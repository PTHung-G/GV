/**
 * PATCH /api/grading/submissions/[id] — the teacher's review actions.
 *
 * One endpoint covers the four things a reviewer does: fix an identity, correct
 * a multiple-choice answer, override an essay mark, and confirm the paper.
 * Every change is written to `audit_events`, and totals are always recomputed
 * from the stored rows rather than patched by hand.
 */
import { NextResponse } from 'next/server';
import { query, queryOne, withTransaction } from '@/lib/server/db';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { lockSession, lockSubmission, assertConfirmable, queueSection } from '@/lib/grading/lifecycle';
import { authorizeTeacher } from '@/lib/grading/access';
import { refreshTotals } from '@/lib/grading/grade';
import { getSubmission } from '@/lib/grading/submissions';
import { rubricFromStored, type McQuestion } from '@/lib/grading/rubric';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  identity?: { studentId?: string | null; studentName?: string | null; studentCode?: string | null };
  mc?: Array<{ questionNo: number; picked: string | null }>;
  essay?: Array<{ questionNo: number; criterionKey: string; finalPoints: number | null }>;
  confirm?: boolean;
  regrade?: 'mc' | 'essay';
};

async function loadSubmission(id: string) {
  const row = await queryOne<{ id: string; session_id: string; payload: unknown; mode: string }>(
    `select sub.id, sub.session_id, r.payload, s.mode
       from submissions sub
       join grading_sessions s on s.id = sub.session_id
       join rubric_revisions r on r.id = s.rubric_revision_id
      where sub.id = $1`,
    [id],
  );
  if (!row) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');
  return row;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    const submission = await loadSubmission(id);
    const actor = await authorizeTeacher(submission.session_id);

    const body = await readJson<Body>(req);
    const rubric = rubricFromStored(submission.payload);
    const mcByNo = new Map<number, McQuestion>(
      rubric.questions
        .filter((question): question is McQuestion => question.type === 'mc')
        .map((question) => [question.no, question]),
    );

    if (body.regrade && !['mc','essay'].includes(body.regrade)) throw new HttpError(400, 'Phần chấm lại không hợp lệ.', 'invalid_section');
    if ((body.regrade === 'mc' && submission.mode === 'essay-only') || (body.regrade === 'essay' && submission.mode === 'mc-only')) throw new HttpError(400, 'Phần này không thuộc chế độ chấm.', 'invalid_section');
    if (body.confirm && body.regrade) throw new HttpError(400, 'Không thể vừa duyệt vừa chấm lại.', 'conflicting_actions');
    await withTransaction(async (client) => {
      await lockSession(client, submission.session_id);
      await lockSubmission(client, submission.session_id, id);
      // Manual edits supersede in-flight proposals only in the edited section.
      for (const section of ['mc','essay'] as const) {
        if (body[section]?.length || body.regrade === section) {
          await client.query(`update submissions set ${section}_revision = ${section}_revision + 1,
            ${section}_status = 'needs-review', status = 'needs-review', confirmed_at = null where id = $1`, [id]);
          await client.query("update jobs set status = 'failed', lease_token = null, last_error = 'Thay bằng phiên bản duyệt mới', finished_at = now() where submission_id = $1 and kind = $2 and status in ('queued','running')", [id, `grade-${section}`]);
        }
      }
      // ---- identity
      if (body.identity) {
        await client.query("update submissions set status = 'needs-review', confirmed_at = null where id = $1", [id]);
        const { studentId, studentName, studentCode } = body.identity;
        const before = await client.query(
          `select student_id, student_name, student_code, identity_status from submissions where id = $1`,
          [id],
        );

        if (studentId) {
          const student = await client.query<{ code: string | null; name: string }>(
            `select st.code, st.name
               from students st
               join grading_sessions s on s.class_id = st.class_id
              where st.id = $1 and s.id = $2`,
            [studentId, submission.session_id],
          );
          const found = student.rows[0];
          if (!found) throw new HttpError(400, 'Học sinh không thuộc lớp của đợt chấm.', 'student_not_in_class');

          const clash = await client.query(
            `select 1 from submissions where session_id = $1 and student_id = $2 and id <> $3`,
            [submission.session_id, studentId, id],
          );
          if (clash.rowCount) {
            throw new HttpError(409, 'Học sinh này đã có bài khác trong đợt chấm.', 'duplicate_student');
          }

          await client.query(
            `update submissions
                set student_id = $2, student_code = $3, student_name = $4,
                    identity_status = 'verified', updated_at = now()
              where id = $1`,
            [id, studentId, found.code, found.name],
          );
        } else {
          const name = studentName?.trim() || null;
          await client.query(
            `update submissions
                set student_id = null, student_name = $2, student_code = $3,
                    identity_status = $4, updated_at = now()
              where id = $1`,
            [id, name, studentCode?.trim() || null, name ? 'verified' : 'unassigned'],
          );
        }

        await client.query(
          `insert into audit_events (session_id, submission_id, actor_id, action, before_value, after_value)
           values ($1, $2, $3, 'identity.update', $4, $5)`,
          [
            submission.session_id,
            id,
            actor.userId,
            JSON.stringify(before.rows[0] ?? {}),
            JSON.stringify(body.identity),
          ],
        );
      }

      // ---- multiple choice
      if (body.mc && body.mc.length > 0) {
        const before = await client.query(
          `select question_no, picked, flags from mc_answers where submission_id = $1`,
          [id],
        );

        for (const answer of body.mc) {
          const question = mcByNo.get(answer.questionNo);
          if (!question) continue;

          const picked = answer.picked === null ? null : String(answer.picked).trim().toUpperCase() || null;
          const flags: string[] = [];
          if (picked === null) flags.push('blank');
          else if (!/^[A-D]$/.test(picked)) flags.push('double-mark');
          else if (picked !== question.answer) flags.push('incorrect');

          await client.query(
            `insert into mc_answers
               (submission_id, question_no, picked, confidence, source, flags, reviewed_by, reviewed_at)
             values ($1, $2, $3, 1, 'teacher', $4, $5, now())
             on conflict (submission_id, question_no) do update
               set picked = excluded.picked,
                   flags = excluded.flags,
                   source = 'teacher',
                   reviewed_by = excluded.reviewed_by,
                   reviewed_at = now()`,
            [id, answer.questionNo, picked, flags, actor.userId],
          );
        }

        await client.query(
          `insert into audit_events (session_id, submission_id, actor_id, action, before_value, after_value)
           values ($1, $2, $3, 'mc.update', $4, $5)`,
          [
            submission.session_id,
            id,
            actor.userId,
            JSON.stringify(before.rows),
            JSON.stringify(body.mc),
          ],
        );
      }

      // ---- essay
      if (body.essay && body.essay.length > 0) {
        const before = await client.query(
          `select question_no, criterion_key, ai_points, final_points
             from criterion_scores where submission_id = $1`,
          [id],
        );

        for (const entry of body.essay) {
          const question = rubric.questions.find(q => q.type === 'essay' && q.no === entry.questionNo);
          const step = question?.type === 'essay' ? question.steps.find(s => s.key === entry.criterionKey) : undefined;
          if (!step) throw new HttpError(400, 'Ý chấm không thuộc barem.', 'invalid_criterion');
          const maxPoints = step.points;

          let finalPoints = entry.finalPoints;
          if (finalPoints !== null) {
            if (!Number.isFinite(finalPoints) || finalPoints < 0) {
              throw new HttpError(400, 'Điểm không hợp lệ.', 'invalid_points');
            }
            // A mark above the step maximum is a mistake, not a rounding issue.
            finalPoints = Math.min(maxPoints, finalPoints);
          }

          await client.query(
            `insert into criterion_scores (submission_id, section, question_no, criterion_key, max_points, final_points, source, reviewed_by, reviewed_at)
             values ($1,'essay',$2,$3,$6,$4,'teacher',$5,now())
             on conflict (submission_id, question_no, criterion_key) do update
               set final_points = excluded.final_points, source = 'teacher', reviewed_by = excluded.reviewed_by,
                   reviewed_at = now(), updated_at = now()`,
            [id, entry.questionNo, entry.criterionKey, finalPoints, actor.userId, maxPoints],
          );
        }

        await client.query(
          `insert into audit_events (session_id, submission_id, actor_id, action, before_value, after_value)
           values ($1, $2, $3, 'essay.update', $4, $5)`,
          [
            submission.session_id,
            id,
            actor.userId,
            JSON.stringify(before.rows),
            JSON.stringify(body.essay),
          ],
        );
      }

      // ---- confirm
      if (body.confirm) {
        await assertConfirmable(client, id);
        await client.query(
          `update submissions
              set mc_status = case when mc_status in ('not-applicable') then mc_status else 'confirmed' end,
                  essay_status = case when essay_status in ('not-applicable') then essay_status else 'confirmed' end,
                  status = 'confirmed',
                  confirmed_at = now(),
                  updated_at = now()
            where id = $1`,
          [id],
        );
        await client.query(
          `insert into audit_events (session_id, submission_id, actor_id, action)
           values ($1, $2, $3, 'submission.confirm')`,
          [submission.session_id, id, actor.userId],
        );
      }

      // ---- regrade
      if (body.regrade) {
        const kind = body.regrade === 'mc' ? 'grade-mc' : 'grade-essay';
        const column = body.regrade === 'mc' ? 'mc_status' : 'essay_status';
        await client.query(
          `update submissions set ${column} = 'processing', status = 'processing', updated_at = now()
            where id = $1`,
          [id],
        );
        if (body.regrade === 'mc') await client.query('delete from mc_answers where submission_id = $1', [id]);
        else await client.query("delete from criterion_scores where submission_id = $1 and section = 'essay'", [id]);
        await queueSection(client, submission.session_id, id, kind);
        await client.query(
          `insert into audit_events (session_id, submission_id, actor_id, action, after_value)
           values ($1, $2, $3, 'submission.regrade', $4)`,
          [submission.session_id, id, actor.userId, JSON.stringify({ section: body.regrade })],
        );
      }
      await refreshTotals(id, client);
    });

    const updated = await getSubmission(submission.session_id, id);
    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    return jsonError(error);
  }
}

/** DELETE /api/grading/submissions/[id] — remove a paper and its photos. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    const submission = await loadSubmission(id);
    await authorizeTeacher(submission.session_id);

    const { deleteSubmission } = await import('@/lib/grading/submissions');
    await deleteSubmission(submission.session_id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
