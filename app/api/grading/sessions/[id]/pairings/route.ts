/**
 * POST /api/grading/sessions/[id]/pairings — mint a one-time code for a phone.
 *
 * The teacher shows this as a QR; the phone trades it for a capture session
 * that can only upload pages to this one grading session.
 */
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { queryOne } from '@/lib/server/db';
import { jsonError, requireDatabase } from '@/lib/server/http';
import { authorizeTeacher } from '@/lib/grading/access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAIRING_TTL_MINUTES = 30;
// No 0/O/1/I: the code is read off a screen and typed by hand as a fallback.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function newCode(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('');
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const user = await requireUser();
    const { id } = await params;
    await authorizeTeacher(id);

    const row = await queryOne<{ code: string; expires_at: Date }>(
      `insert into capture_pairings (session_id, created_by, code, expires_at)
       values ($1, $2, $3, now() + make_interval(mins => $4::int))
       returning code, expires_at`,
      [id, user.id, newCode(), PAIRING_TTL_MINUTES],
    );

    return NextResponse.json({
      success: true,
      pairing: {
        code: row?.code,
        expiresAt: row?.expires_at.toISOString(),
        claimPath: `/grading/pair/${row?.code}`,
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
