/**
 * POST /api/grading/pairings/[code]/claim — the phone trades a code for access.
 *
 * The code is single-use and short-lived; claiming it sets a capture cookie
 * scoped to one grading session. No account is needed on the phone.
 */
import { NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/server/auth';
import { withTransaction } from '@/lib/server/db';
import { HttpError, jsonError, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    requireDatabase();
    const { code } = await params;
    const normalized = code.trim().toUpperCase();

    const claimed = await withTransaction(async (client) => {
      // Locking the row makes a double claim impossible even on a flaky network.
      const found = await client.query<{
        id: string;
        session_id: string;
        created_by: string;
        expires_at: Date;
        consumed_at: Date | null;
        revoked_at: Date | null;
      }>(
        `select id, session_id, created_by, expires_at, consumed_at, revoked_at
           from capture_pairings
          where code = $1
          for update`,
        [normalized],
      );

      const pairing = found.rows[0];
      if (!pairing) throw new HttpError(404, 'Mã ghép không đúng.', 'pairing_not_found');
      if (pairing.revoked_at) throw new HttpError(410, 'Mã ghép đã bị thu hồi.', 'pairing_revoked');
      if (pairing.consumed_at) throw new HttpError(409, 'Mã ghép đã được dùng.', 'pairing_used');
      if (pairing.expires_at.getTime() < Date.now()) {
        throw new HttpError(410, 'Mã ghép đã hết hạn.', 'pairing_expired');
      }

      await client.query(`update capture_pairings set consumed_at = now() where id = $1`, [
        pairing.id,
      ]);

      return { sessionId: pairing.session_id, userId: pairing.created_by };
    });

    const token = await createSession(claimed.userId, 'capture', { sessionId: claimed.sessionId });
    await setSessionCookie(token, 'capture');

    return NextResponse.json({ success: true, sessionId: claimed.sessionId });
  } catch (error) {
    return jsonError(error);
  }
}
