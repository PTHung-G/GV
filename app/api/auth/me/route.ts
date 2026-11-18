/**
 * GET /api/auth/me — who the current cookie belongs to, or null.
 *
 * Returns 200 with `user: null` when signed out so the client does not have to
 * treat "not signed in" as an error.
 */
import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { isDatabaseConfigured } from '@/lib/server/db';
import { jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Without a database there is nobody to be; report signed-out rather than
    // breaking every page that mounts the auth provider.
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ success: true, user: null, database: false });
    }
    const user = await currentUser();
    return NextResponse.json({ success: true, user, database: true });
  } catch (error) {
    return jsonError(error);
  }
}
