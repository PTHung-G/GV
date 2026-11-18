import { NextResponse } from 'next/server';
import { withTransaction } from '@/lib/server/db';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { authorizeTeacher } from '@/lib/grading/access';
import { lockSession } from '@/lib/grading/lifecycle';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Reopening never replays old jobs; the teacher explicitly requests fresh grading. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    const actor = await authorizeTeacher(id);
    const body = await readJson<{ reason?: string }>(req);
    if (!body.reason?.trim()) throw new HttpError(400, 'Hãy nhập lý do mở lại đợt chấm.', 'reopen_reason_required');
    await withTransaction(async client => {
      const session = await lockSession(client, id, false);
      if (session.status === 'active') throw new HttpError(409, 'Đợt chấm đang mở.', 'session_already_active');
      await client.query("update jobs set status = 'failed', lease_token = null, finished_at = now(), last_error = 'Đợt được mở lại; yêu cầu chấm lại rõ ràng' where session_id = $1 and status in ('queued','running')", [id]);
      await client.query("update grading_sessions set status = 'active', finalized_at = null, updated_at = now() where id = $1", [id]);
      await client.query("insert into audit_events (session_id, actor_id, action, before_value, after_value, reason) values ($1,$2,'session.reopen',$3,$4,$5)",
        [id, actor.userId, JSON.stringify({ status: session.status }), JSON.stringify({ status: 'active' }), body.reason!.trim()]);
    });
    return NextResponse.json({ success: true, reopened: true });
  } catch (error) { return jsonError(error); }
}
