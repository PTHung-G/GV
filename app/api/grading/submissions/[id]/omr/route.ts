/**
 * POST /api/grading/submissions/[id]/omr — accept marks read on the device.
 *
 * Optical mark reading happens in the browser (the image is already decoded
 * there for the preview), so the heavy pixel work never costs a server round
 * trip and the answers arrive as plain data. The server still decides the score:
 * it re-checks every answer against the frozen rubric.
 */
import { verifyPublishedIdentity, assertPublishedProvenance } from '@/lib/exam-release/access';
import { NextResponse } from 'next/server';
import { query, queryOne, withTransaction } from '@/lib/server/db';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { lockSession, lockSubmission } from '@/lib/grading/lifecycle';
import { authorizeSession } from '@/lib/grading/access';
import { refreshTotals } from '@/lib/grading/grade';
import { getSubmission } from '@/lib/grading/submissions';
import { rubricFromStored, type McQuestion } from '@/lib/grading/rubric';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  answers?: Array<{ q: number; picked: string | null; confidence?: number; flags?: string[] }>;
  qr?: string | null;
  /** Candidate number read from the grid, when the sheet has one. */
  sbd?: string | null;
  warnings?: string[];
};

/** The QR is printed by us, but it still arrives from an untrusted device. */
function parseQr(payload: string | null | undefined): { sessionId: string | null; studentCode: string | null } {
  if (!payload) return { sessionId: null, studentCode: null };
  try {
    const parsed = JSON.parse(payload) as { sid?: unknown; code?: unknown };
    return {
      sessionId: typeof parsed.sid === 'string' ? parsed.sid : null,
      studentCode: typeof parsed.code === 'string' ? parsed.code : null,
    };
  } catch {
    return { sessionId: null, studentCode: null };
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;

    const owner = await queryOne<{ session_id: string; payload: unknown }>(
      `select sub.session_id, r.payload
         from submissions sub
         join grading_sessions s on s.id = sub.session_id
         join rubric_revisions r on r.id = s.rubric_revision_id
        where sub.id = $1`,
      [id],
    );
    if (!owner) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');
    await authorizeSession(owner.session_id);

    const body = await readJson<Body>(req);
    const answers = Array.isArray(body.answers) ? body.answers : [];
    if (answers.length === 0) {
      throw new HttpError(400, 'Không có đáp án nào được đọc từ phiếu.', 'no_readings');
    }

    const rubric = rubricFromStored(owner.payload);
    const questions = new Map<number, McQuestion>(
      rubric.questions
        .filter((question): question is McQuestion => question.type === 'mc')
        .map((question) => [question.no, question]),
    );

    let needsReview = false;
    const warnings = [...(body.warnings ?? [])];
    const qr = parseQr(body.qr);

    // A sheet printed for a different session must never be filed here silently.
    if (qr.sessionId && qr.sessionId !== owner.session_id) {
      warnings.push('Phiếu này in cho đợt chấm khác, đã bỏ qua mã học sinh trên phiếu.');
    }

    await withTransaction(async (client) => {
      const published = await verifyPublishedIdentity(client, owner.session_id, body.qr);
      if(published){
        const numbers=answers.map(answer=>answer.q);
        if(numbers.length!==questions.size||new Set(numbers).size!==questions.size||numbers.some(no=>!questions.has(no)))throw new HttpError(422,'Cần đọc đủ mỗi câu trắc nghiệm đúng một lần.','incomplete_published_omr');
        await client.query('update submissions set published_omr_verified_at=now() where id=$1',[id]);
      }
      await assertPublishedProvenance(client, owner.session_id, id);
      await lockSession(client, owner.session_id);
      await lockSubmission(client, owner.session_id, id);
      await client.query("update submissions set mc_revision = mc_revision + 1, status = 'needs-review', confirmed_at = null where id = $1", [id]);
      await client.query("update jobs set status = 'failed', lease_token = null, last_error = 'Thay bằng kết quả OMR mới', finished_at = now() where submission_id = $1 and kind = 'grade-mc' and status in ('queued','running')", [id]);
      await client.query(`delete from mc_answers where submission_id = $1 and source <> 'teacher'`, [id]);

      for (const answer of answers) {
        const question = questions.get(answer.q);
        if (!question) continue;

        const picked =
          answer.picked === null || answer.picked === undefined
            ? null
            : String(answer.picked).trim().toUpperCase() || null;
        const confidence =
          typeof answer.confidence === 'number' ? Math.min(1, Math.max(0, answer.confidence)) : null;

        const flags = new Set<string>(answer.flags ?? []);
        if (picked === null) flags.add('blank');
        else if (!/^[A-D]$/.test(picked)) flags.add('double-mark');
        else if (picked !== question.answer) flags.add('incorrect');

        // A wrong answer is a fact; an unreadable or doubled mark is a question.
        if ([...flags].some((flag) => flag !== 'incorrect')) needsReview = true;

        await client.query(
          `insert into mc_answers (submission_id, question_no, picked, confidence, source, flags)
           values ($1, $2, $3, $4, 'omr', $5)
           on conflict (submission_id, question_no) do update
             set picked = excluded.picked,
                 confidence = excluded.confidence,
                 flags = excluded.flags,
                 source = case when mc_answers.source = 'teacher' then 'teacher' else 'omr' end`,
          [id, answer.q, picked, confidence, [...flags]],
        );
      }

      await client.query(
        `update submissions set mc_status = $2, updated_at = now() where id = $1`,
        [id, needsReview ? 'needs-review' : 'confirmed'],
      );

      // Two ways a sheet identifies its student: the QR carries the code when the
      // teacher printed one sheet per student, otherwise the student bubbles their
      // candidate number into the grid and the scanner reads it here.
      const printedCode =
        qr.studentCode && (!qr.sessionId || qr.sessionId === owner.session_id) ? qr.studentCode : null;
      const bubbledCode = typeof body.sbd === 'string' ? body.sbd.trim() : '';
      const usableCode =
        printedCode ?? (/^[0-9A-Za-z._-]{1,20}$/.test(bubbledCode) ? bubbledCode : null);

      if (usableCode) {
        // SBD grids drop leading zeros when a teacher types "1" instead of
        // "000001", so a numeric comparison is accepted as a fallback.
        const student = await client.query<{ id: string; code: string | null; name: string }>(
          `select st.id, st.code, st.name
             from students st
             join grading_sessions s on s.class_id = st.class_id
            where s.id = $1
              and (
                lower(st.code) = lower($2)
                or ($2 ~ '^[0-9]+$' and st.code ~ '^[0-9]+$' and st.code::bigint = $2::bigint)
              )
            order by (lower(st.code) = lower($2)) desc
            limit 1`,
          [owner.session_id, usableCode],
        );
        const found = student.rows[0];

        if (found) {
          const clash = await client.query(
            `select 1 from submissions
              where session_id = $1 and student_id = $2 and id <> $3`,
            [owner.session_id, found.id, id],
          );

          if (clash.rowCount) {
            warnings.push('Học sinh trên phiếu đã có bài khác trong đợt này.');
            needsReview = true;
          } else {
            await client.query(
              `update submissions
                  set student_id = $2, student_code = $3, student_name = $4,
                      identity_status = 'verified', updated_at = now()
                where id = $1 and identity_status <> 'verified'`,
              [id, found.id, found.code, found.name],
            );
          }
        } else {
          warnings.push(
            `Phiếu ghi số báo danh "${usableCode}" nhưng lớp này chưa có học sinh mang số đó. ` +
              'Thầy/cô thêm học sinh vào danh sách lớp rồi chấm lại.',
          );
        }
      }
      await refreshTotals(id, client);
    });

    const submission = await getSubmission(owner.session_id, id);
    return NextResponse.json({
      success: true,
      submission,
      warnings,
    });
  } catch (error) {
    return jsonError(error);
  }
}
