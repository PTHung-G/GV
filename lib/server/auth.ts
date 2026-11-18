/**
 * Real server-side authentication.
 *
 * Replaces the browser-only simulation: passwords are hashed with scrypt,
 * sessions are rows in `auth_sessions`, and the browser only ever holds an
 * opaque HttpOnly cookie. API routes read the identity from that cookie, never
 * from a client-supplied user id.
 *
 * Two session kinds exist:
 *   user    — a normal signed-in teacher.
 *   capture — a phone that was paired by QR and may only upload pages.
 */
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies, headers } from 'next/headers';
import { query, queryOne } from './db';
import { HttpError } from './http';

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

export const SESSION_COOKIE = 'sdt_session';
const USER_TTL_MINUTES = 30 * 24 * 60;
const CAPTURE_TTL_MINUTES = 120;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  points: number;
};

export type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  avatar_color: string;
  points: number;
};

export type SessionKind = 'user' | 'capture';

const AVATAR_COLORS = ['#3358f4', '#0f7b6c', '#d9730d', '#6940a5', '#c14c8a', '#b03a2e'];

export function toUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarColor: row.avatar_color,
    points: row.points,
  };
}

export function colorFor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i += 1) hash = (hash * 31 + email.charCodeAt(i)) % 9973;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'Giáo viên';
  const pretty = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  return pretty || 'Giáo viên';
}

// ---------------------------------------------------------------- passwords

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const derived = await scrypt(password, Buffer.from(saltHex, 'hex'), 64);
  const expected = Buffer.from(hashHex, 'hex');
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

// ------------------------------------------------------------------- users

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  return queryOne<UserRow>(
    `select id, email, name, password_hash, avatar_color, points
       from users where lower(email) = lower($1)`,
    [email],
  );
}

export async function findUserById(id: string): Promise<UserRow | null> {
  return queryOne<UserRow>(
    `select id, email, name, password_hash, avatar_color, points from users where id = $1`,
    [id],
  );
}

export async function createUser(input: {
  email: string;
  name?: string;
  password?: string;
}): Promise<UserRow> {
  const name = input.name?.trim() || nameFromEmail(input.email);
  const passwordHash = input.password ? await hashPassword(input.password) : null;
  const row = await queryOne<UserRow>(
    `insert into users (email, name, password_hash, avatar_color)
     values ($1, $2, $3, $4)
     returning id, email, name, password_hash, avatar_color, points`,
    [input.email, name, passwordHash, colorFor(input.email)],
  );
  if (!row) throw new HttpError(500, 'Không tạo được tài khoản.', 'user_create_failed');
  return row;
}

// ---------------------------------------------------------------- sessions

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(
  userId: string,
  kind: SessionKind = 'user',
  scope: Record<string, unknown> = {},
  ttlMinutes?: number,
): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  const minutes = ttlMinutes ?? (kind === 'capture' ? CAPTURE_TTL_MINUTES : USER_TTL_MINUTES);
  await query(
    `insert into auth_sessions (token_hash, user_id, kind, scope, expires_at)
     values ($1, $2, $3, $4, now() + make_interval(mins => $5::int))`,
    [hashToken(token), userId, kind, JSON.stringify(scope), minutes],
  );
  return token;
}

export async function revokeSession(token: string): Promise<void> {
  await query(`delete from auth_sessions where token_hash = $1`, [hashToken(token)]);
}

export type SessionRecord = {
  user_id: string;
  kind: SessionKind;
  scope: Record<string, unknown>;
};

export async function findSession(token: string): Promise<SessionRecord | null> {
  return queryOne<SessionRecord>(
    `select user_id, kind, scope from auth_sessions
      where token_hash = $1 and expires_at > now()`,
    [hashToken(token)],
  );
}

/** Secure cookies only when the browser actually reached us over HTTPS. */
async function cookieSecurity(): Promise<boolean> {
  if (process.env.COOKIE_SECURE?.trim().toLowerCase() === 'true') return true;
  const headerList = await headers();
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  return proto.split(',')[0]?.trim() === 'https';
}

export async function setSessionCookie(token: string, kind: SessionKind = 'user'): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: await cookieSecurity(),
    path: '/',
    maxAge: (kind === 'capture' ? CAPTURE_TTL_MINUTES : USER_TTL_MINUTES) * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function sessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

// --------------------------------------------------------------- identity

export async function currentUser(): Promise<AuthUser | null> {
  const token = await sessionToken();
  if (!token) return null;
  const session = await findSession(token);
  if (!session || session.kind !== 'user') return null;
  const row = await findUserById(session.user_id);
  return row ? toUser(row) : null;
}

export async function requireUser(): Promise<AuthUser> {
  const user = await currentUser();
  if (!user) throw new HttpError(401, 'Bạn cần đăng nhập để tiếp tục.', 'unauthenticated');
  return user;
}

export type CaptureIdentity = { userId: string; sessionId: string };

/** Identity of a paired phone; scope carries the grading session it may feed. */
export async function currentCapture(): Promise<CaptureIdentity | null> {
  const token = await sessionToken();
  if (!token) return null;
  const session = await findSession(token);
  if (!session || session.kind !== 'capture') return null;
  const sessionId = session.scope?.sessionId;
  if (typeof sessionId !== 'string') return null;
  return { userId: session.user_id, sessionId };
}
