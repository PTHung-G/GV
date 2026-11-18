import { NextResponse } from 'next/server';
import { withTransaction } from '@/lib/server/db';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { authorizeTeacher } from '@/lib/grading/access';
import { assertConfirmable, lockSession } from '@/lib/grading/lifecycle';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    const actor = await authorizeTeacher(id);
    const body = await readJson<{ force?: boolean; reason?: string }>(req);
    const pending = await withTransaction(async client => {
      await lockSession(client, id);
      const { rows } = await client.query<{ id: string; status: string }>(
        'select id, status from submissions where session_id = $1 order by id for update', [id]);
      if (!rows.length) throw new HttpError(409, 'Chưa có bài để chốt.', 'no_submissions');
      const incomplete: string[] = [];
      for (const sub of rows) {
        if (sub.status === 'absent') continue;
        if (sub.status !== 'confirmed') { incomplete.push(sub.id); continue; }
        try { await assertConfirmable(client, sub.id); }
        catch (error) {
          if ((error as { code?: string }).code !== 'submission_incomplete') throw error;
          incomplete.push(sub.id);
        }
      }
      if (incomplete.length && !body.force) throw new HttpError(409,
        `Còn ${incomplete.length} bài chưa đủ dữ liệu hoặc chưa duyệt. Hãy xử lý hoặc chốt với ngoại lệ có lý do.`, 'outstanding_submissions');
      if (incomplete.length && !body.reason?.trim()) throw new HttpError(400,
        'Hãy nhập lý do chốt với ngoại lệ.', 'exception_reason_required');
      // Same session lock as every mutator/worker commit: no result can land after this point.
      await client.query("update jobs set status = 'failed', lease_token = null, last_error = 'Đợt đã chốt; cần mở lại và chấm lại', finished_at = now() where session_id = $1 and status in ('queued','running')", [id]);
      await client.query(`update submissions set
        mc_status = case when mc_status = 'processing' then 'failed' else mc_status end,
        essay_status = case when essay_status = 'processing' then 'failed' else essay_status end,
        status = case when status = 'processing' then 'needs-review' else status end,
        updated_at = now() where session_id = $1 and (mc_status = 'processing' or essay_status = 'processing')`, [id]);
      await client.query("update grading_sessions set status = 'finalized', finalized_at = now(), updated_at = now() where id = $1", [id]);
      await client.query("insert into audit_events (session_id, actor_id, action, after_value, reason) values ($1,$2,'session.finalize',$3,$4)",
        [id, actor.userId, JSON.stringify({ forced: Boolean(body.force), incompleteSubmissionIds: incomplete }), body.reason?.trim() || null]);
      return incomplete.length;
    });
    return NextResponse.json({ success: true, finalized: true, pending });
  } catch (error) { return jsonError(error); }
}
