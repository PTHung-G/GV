/**
 * Private object storage for student work.
 *
 * Files never live under `public/` and are only ever served through routes that
 * check ownership. Supports two drivers seamlessly behind one interface:
 *   1. S3 / Cloudflare R2 (activated automatically when `S3_BUCKET`, `S3_ENDPOINT`,
 *      `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY` are set) using pure
 *      Node crypto AWS Signature V4.
 *   2. Local disk under `UPLOAD_DIR` or `<cwd>/.data/uploads` for self-contained
 *      development and testing.
 */
import { createHash, createHmac, randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.env.UPLOAD_DIR?.trim()
  ? path.resolve(process.env.UPLOAD_DIR.trim())
  : path.join(process.cwd(), '.data', 'uploads');

export type StoredObject = {
  key: string;
  byteSize: number;
  sha256: string;
};

type S3Config = {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

function s3Config(): S3Config | null {
  const bucket = process.env.S3_BUCKET?.trim();
  const endpoint = process.env.S3_ENDPOINT?.trim();
  const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim();
  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) return null;
  return {
    bucket,
    endpoint: endpoint.replace(/\/+$/, ''),
    region: process.env.S3_REGION?.trim() || 'auto',
    accessKeyId,
    secretAccessKey,
  };
}

/** Rejects traversal and anything that is not a plain relative key. */
function assertSafeKey(key: string): string {
  if (!key || key.startsWith('/') || key.includes('..') || !/^[A-Za-z0-9/_.-]+$/.test(key)) {
    throw new Error('Khoá lưu trữ không hợp lệ.');
  }
  return key;
}

function resolvePath(key: string): string {
  const full = path.join(ROOT, assertSafeKey(key));
  if (!full.startsWith(ROOT + path.sep)) throw new Error('Khoá lưu trữ vượt phạm vi cho phép.');
  return full;
}

export function storageRoot(): string {
  return ROOT;
}

export function storageDriver(): 's3' | 'local' {
  return s3Config() ? 's3' : 'local';
}

/** Builds a collision-free key, e.g. `sessions/<id>/submissions/<id>/<uuid>.jpg`. */
export function buildKey(...parts: string[]): string {
  return parts
    .flatMap((part) => part.split('/'))
    .map((part) => part.trim())
    .filter(Boolean)
    .join('/');
}

// --------------------------------------------------------------- AWS SigV4

function sha256Hex(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex');
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest();
}

function encodeRfc3986(segment: string): string {
  return encodeURIComponent(segment).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

async function s3Request(
  cfg: S3Config,
  method: 'GET' | 'PUT' | 'DELETE' | 'HEAD',
  key: string,
  body?: Buffer,
): Promise<Response> {
  const safeKey = assertSafeKey(key);
  const encodedKey = safeKey.split('/').map(encodeRfc3986).join('/');
  const base = new URL(cfg.endpoint);
  const basePathPrefix = base.pathname.replace(/\/+$/, '');
  const canonicalUri = `${basePathPrefix}/${encodeRfc3986(cfg.bucket)}/${encodedKey}`;
  const url = `${base.origin}${canonicalUri}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = body ? sha256Hex(body) : sha256Hex('');

  const headers: Record<string, string> = {
    host: base.host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };
  if (method === 'PUT' && body) {
    headers['content-type'] = 'application/octet-stream';
    headers['content-length'] = String(body.byteLength);
  }

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaderNames.map((k) => `${k}:${headers[k]}\n`).join('');
  const signedHeaders = signedHeaderNames.join(';');

  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${dateStamp}/${cfg.region}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = hmac(`AWS4${cfg.secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, cfg.region);
  const kService = hmac(kRegion, 's3');
  const kSigning = hmac(kService, 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  headers.Authorization = `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(url, {
    method,
    headers,
    body: body ? new Uint8Array(body) : undefined,
  });
}

// --------------------------------------------------------------- Public API

export async function putObject(key: string, data: Buffer): Promise<StoredObject> {
  const safeKey = assertSafeKey(key);
  const sha256 = sha256Hex(data);
  const cfg = s3Config();
  if (cfg) {
    const res = await s3Request(cfg, 'PUT', safeKey, data);
    if (!res.ok) {
      throw new Error(`Không lưu được tệp lên S3 (${res.status}).`);
    }
    return { key: safeKey, byteSize: data.byteLength, sha256 };
  }

  const full = resolvePath(safeKey);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
  return { key: safeKey, byteSize: data.byteLength, sha256 };
}

export async function getObject(key: string): Promise<Buffer> {
  const safeKey = assertSafeKey(key);
  const cfg = s3Config();
  if (cfg) {
    const res = await s3Request(cfg, 'GET', safeKey);
    if (!res.ok) {
      throw new Error(`Không tải được tệp từ S3 (${res.status}).`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(resolvePath(safeKey));
}

export async function deleteObject(key: string): Promise<void> {
  const safeKey = assertSafeKey(key);
  const cfg = s3Config();
  if (cfg) {
    const res = await s3Request(cfg, 'DELETE', safeKey);
    if (!res.ok && res.status !== 404) {
      throw new Error(`Không xoá được tệp trên S3 (${res.status}).`);
    }
    return;
  }
  await rm(resolvePath(safeKey), { force: true });
}

export async function objectExists(key: string): Promise<boolean> {
  const safeKey = assertSafeKey(key);
  const cfg = s3Config();
  if (cfg) {
    const res = await s3Request(cfg, 'HEAD', safeKey);
    return res.ok;
  }
  try {
    await stat(resolvePath(safeKey));
    return true;
  } catch {
    return false;
  }
}

export function newObjectName(extension: string): string {
  const clean = extension.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  return `${randomUUID()}.${clean}`;
}
