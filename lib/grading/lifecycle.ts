import { assertPublishedProvenance, assertBundleStudentUnique } from '@/lib/exam-release/access';
import { HttpError } from '@/lib/server/http';
import type { PoolClient } from 'pg';
import { computeSectionScores, type ScoreInput } from './scores';
import { rubricFromStored } from './rubric';

/** Global lock order: session first, then submission, then job. Never hold during AI I/O. */
export async function lockSession(client: PoolClient, sessionId: string, mutable = true) {
  const { rows } = await client.query<{ id: string; status: string; mode: string }>(
    'select id, status, mode from grading_sessions where id = $1 for update', [sessionId]);
  const row = rows[0];
  if (!row) throw new HttpError(404, 'Không tìm thấy đợt chấm.', 'session_not_found');
  if (mutable && row.status !== 'active') throw new HttpError(409,
    'Đợt chấm đã chốt hoặc lưu trữ. Hãy mở lại trước khi thay đổi.', 'session_locked');
  return row;
}
export async function lockSubmission(client: PoolClient, sessionId: string, id: string) {
  const { rows } = await client.query<{
    id: string; input_revision: number; mc_revision: number; essay_revision: number;
    page_count: number; status: string; mc_status: string; essay_status: string;
  }>('select * from submissions where session_id = $1 and id = $2 for update', [sessionId, id]);
  if (!rows[0]) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');
  return rows[0];
}
export type GradeFence = { jobId: string; leaseToken: string; inputRevision: number; sectionRevision: number };
export async function checkWorkerFence(client: PoolClient, sessionId: string, id: string,
  kind: string, fence: GradeFence) {
  await lockSession(client, sessionId);
  await assertPublishedProvenance(client,sessionId,id);
  const sub = await lockSubmission(client, sessionId, id);
  const { rows } = await client.query<{ valid: boolean }>(
    `select true as valid from jobs where id = $1 and status = 'running' and lease_token = $2 for update`,
    [fence.jobId, fence.leaseToken]);
  if (!rows.length || sub.status === 'confirmed' || sub.input_revision !== fence.inputRevision ||
      (kind === 'grade-mc' ? sub.mc_revision : sub.essay_revision) !== fence.sectionRevision)
    throw new HttpError(409, 'Đầu vào đã thay đổi; kết quả cũ đã được bỏ qua.', 'stale_grading_result');
}
export async function queueSection(client: PoolClient, sessionId: string, id: string, kind: string) {
  await assertPublishedProvenance(client,sessionId,id);
  const sub = await lockSubmission(client, sessionId, id);
  if (kind === 'grade-mc') {
    const published=await client.query('select id from exam_release_variants where session_id=$1',[sessionId]);
    if(published.rows.length) throw new HttpError(409,'Phiếu đã chốt phải đọc ô tô với QR hợp lệ; không chuyển sang AI.','published_omr_required');
  }
  const sectionRevision = kind === 'grade-mc' ? sub.mc_revision : sub.essay_revision;
  const result = await client.query(
    `insert into jobs (session_id, submission_id, kind, idempotency_key, input_revision, section_revision)
     values ($1,$2,$3,$4,$5,$6) on conflict (idempotency_key) do nothing returning id`,
    [sessionId, id, kind, `${id}:${kind}:i${sub.input_revision}:s${sectionRevision}`, sub.input_revision, sectionRevision]);
  if (result.rowCount) await client.query(
    `update submissions set ${kind === 'grade-mc' ? 'mc_status' : 'essay_status'} = 'processing',
     status = 'processing', confirmed_at = null, updated_at = now() where id = $1`, [id]);
}

export function confirmationProblems(input: ScoreInput & {
  pageCount: number; identityStatus: string; activeJobs: number; flags: string[];
}): string[] {
  const problems: string[] = [];
  if (input.pageCount < 1) problems.push('Bài chưa có trang nào');
  if (!['verified', 'anonymous-confirmed'].includes(input.identityStatus)) problems.push('Chưa xác nhận danh tính');
  if (input.activeJobs > 0) problems.push('Bài vẫn đang chờ hoặc đang xử lý');
  if (input.flags.some(flag => /missing.page|needs.retake|unreadable/i.test(flag))) problems.push('Cần xử lý trang thiếu hoặc ảnh không đọc được');
  for (const type of ['mc', 'essay'] as const) {
    if ((type === 'mc' ? input.mcStatus : input.essayStatus) !== 'not-applicable' && input.rubric.questions.some(q => q.type === type) && !['needs-review', 'confirmed'].includes(
      type === 'mc' ? input.mcStatus : input.essayStatus)) problems.push(`Phần ${type} chưa chấm xong`);
  }
  const scores = computeSectionScores(input);
  if (scores.total === null) problems.push(...scores.missing, 'Chưa đủ điểm cho tất cả câu/ý');
  return [...new Set(problems)];
}
export async function assertConfirmable(client: PoolClient, id: string) {
  const { rows } = await client.query(
    `select sub.*, r.payload,
       (select count(*)::int from jobs j where j.submission_id = sub.id and j.status in ('queued','running')
        and j.input_revision = sub.input_revision
        and j.section_revision = case when j.kind = 'grade-mc' then sub.mc_revision else sub.essay_revision end) as active_jobs
     from submissions sub join grading_sessions s on s.id = sub.session_id
     join rubric_revisions r on r.id = s.rubric_revision_id where sub.id = $1`, [id]);
  const row = rows[0];
  if (!row) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');
  await assertPublishedProvenance(client,row.session_id,id);
  await assertBundleStudentUnique(client,row.session_id,id);
  const pages = await client.query<{ stored: number; invalid: number }>(`select
    count(*) filter (where status = 'stored')::int as stored,
    count(*) filter (where status in ('needs-retake','failed','pending'))::int as invalid
    from page_assets where submission_id = $1 and kind = 'original'`, [id]);
  const mc = await client.query('select question_no, picked from mc_answers where submission_id = $1', [id]);
  const essay = await client.query("select * from criterion_scores where submission_id = $1 and section = 'essay'", [id]);
  const problems = confirmationProblems({
    rubric: rubricFromStored(row.payload), mcStatus: row.mc_status, essayStatus: row.essay_status,
    pageCount: pages.rows[0].stored, identityStatus: row.identity_status, activeJobs: row.active_jobs, flags: [...(row.flags ?? []), ...(pages.rows[0].invalid || pages.rows[0].stored !== row.page_count ? ['needs-retake'] : [])],
    mcAnswers: mc.rows.map(a => ({ questionNo: a.question_no, picked: a.picked })),
    criteria: essay.rows.map(a => ({ questionNo: a.question_no, criterionKey: a.criterion_key,
      maxPoints: Number(a.max_points), aiPoints: a.ai_points === null ? null : Number(a.ai_points),
      finalPoints: a.final_points === null ? null : Number(a.final_points) })),
  });
  if (problems.length) throw new HttpError(409, problems.join('. ') + '.', 'submission_incomplete');
}
