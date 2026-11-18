/**
 * POST /api/auth/logout — revoke the current session and clear the cookie.
 */
import { NextResponse } from 'next/server';
import { clearSessionCookie, revokeSession, sessionToken } from '@/lib/server/auth';
import { jsonError, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    requireDatabase();
    const token = await sessionToken();
    if (token) await revokeSession(token);
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
