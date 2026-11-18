/**
 * POST /api/grading/submissions/[id]/complete — "Xong bài".
 *
 * Marks the paper finished and queues the grading jobs it needs. Queuing is
 * idempotent per (submission, kind), so tapping twice does not grade twice.
 */
import { NextResponse } from 'next/server';
import { HttpError, jsonError, requireDatabase } from '@/lib/server/http';
import { authorizeSession } from '@/lib/grading/access';
import { completeSubmission, getSubmission } from '@/lib/grading/submissions';
import { queryOne } from '@/lib/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;

    const owner = await queryOne<{ session_id: string }>(
      `select session_id from submissions where id = $1`,
      [id],
    );
    if (!owner) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');
    await authorizeSession(owner.session_id);

    await completeSubmission(owner.session_id, id);
    const refreshed = await getSubmission(owner.session_id, id);
    return NextResponse.json({ success: true, submission: refreshed });
  } catch (error) {
    return jsonError(error);
  }
}
