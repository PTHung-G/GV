/**
 * Private object storage for student work.
 *
 * Files live outside `public/` and are only ever served through a route that
 * checks ownership, so a leaked key is not enough to read someone's paper.
 * The local driver keeps development self-contained; swapping in S3 or
 * Supabase Storage later means implementing this same interface.
 */
import { createHash, randomUUID } from 'node:crypto';
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

/** Rejects traversal and anything that is not a plain relative key. */
function assertSafeKey(key: string): string {
  if (!key || key.startsWith('/') || key.includes('..') || !/^[A-Za-z0-9/_.-]+$/.test(key)) {
    throw new Error('Khoá lưu trữ không hợp lệ.');
  }
  return key;
}

function resolvePath(key: string): string {
  const full = path.join(ROOT, assertSafeKey(key));
  // Defence in depth: the resolved path must stay inside ROOT.
  if (!full.startsWith(ROOT + path.sep)) throw new Error('Khoá lưu trữ vượt phạm vi cho phép.');
  return full;
}

export function storageRoot(): string {
  return ROOT;
}

/** Builds a collision-free key, e.g. `sessions/<id>/submissions/<id>/<uuid>.jpg`. */
export function buildKey(...parts: string[]): string {
  return parts
    .flatMap((part) => part.split('/'))
    .map((part) => part.trim())
    .filter(Boolean)
    .join('/');
}

export async function putObject(key: string, data: Buffer): Promise<StoredObject> {
  const full = resolvePath(key);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
  return {
    key,
    byteSize: data.byteLength,
    sha256: createHash('sha256').update(data).digest('hex'),
  };
}

export async function getObject(key: string): Promise<Buffer> {
  return readFile(resolvePath(key));
}

export async function deleteObject(key: string): Promise<void> {
  await rm(resolvePath(key), { force: true });
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await stat(resolvePath(key));
    return true;
  } catch {
    return false;
  }
}

export function newObjectName(extension: string): string {
  const clean = extension.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  return `${randomUUID()}.${clean}`;
}
