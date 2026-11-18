import { NextResponse } from 'next/server';
import { createUser, createSession, setSessionCookie, toUser, sessionToken, revokeSession } from '@/lib/server/auth';
import { credentials, throttleAuth, validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    requireDatabase();
    validateAuthRequest(req);
    const body = await readJson<Record<string, unknown>>(req);
    const { email, password } = credentials(body);
    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 80) {
      throw new HttpError(400, 'Họ và tên phải có từ 2 đến 80 ký tự.', 'invalid_name');
    }
    if (password.length < 8) throw new HttpError(400, 'Mật khẩu phải có ít nhất 8 ký tự.', 'weak_password');
    await throttleAuth('register', email);
    let row;
    try { row = await createUser({ email, password, name: body.name.trim() }); }
    catch (error) {
      if ((error as { code?: string }).code === '23505') throw new HttpError(409, 'Email này đã được đăng ký. Hãy đăng nhập.', 'email_registered');
      throw error;
    }
    const previous = await sessionToken();
    const token = await createSession(row.id);
    if (previous) await revokeSession(previous);
    await setSessionCookie(token);
    return NextResponse.json({ success: true, user: toUser(row) }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return jsonError(error); }
}
