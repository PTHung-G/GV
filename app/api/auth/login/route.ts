import { NextResponse } from 'next/server';
import { createSession, findUserByEmail, setSessionCookie, toUser, verifyPassword, sessionToken, revokeSession } from '@/lib/server/auth';
import { credentials, throttleAuth, validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const DUMMY_HASH = `scrypt$${'00'.repeat(16)}$${'00'.repeat(64)}`;

export async function POST(req: Request) {
  try {
    requireDatabase();
    validateAuthRequest(req);
    const { email, password } = credentials(await readJson<unknown>(req));
    await throttleAuth('login', email);
    const row = await findUserByEmail(email);
    const valid = await verifyPassword(password, row?.password_hash ?? DUMMY_HASH);
    if (!row || !valid) throw new HttpError(401, 'Email hoặc mật khẩu không đúng.', 'bad_credentials');
    const previous = await sessionToken();
    const token = await createSession(row.id);
    if (previous) await revokeSession(previous);
    await setSessionCookie(token);
    return NextResponse.json({ success: true, user: toUser(row) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return jsonError(error); }
}
