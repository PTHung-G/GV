/**
 * Server-side data access for grading sessions.
 *
 * Ownership is enforced in SQL (`owner_id = $1`) rather than in the caller, so
 * a wrong id returns "not found" instead of someone else's class.
 */
import type { PoolClient } from 'pg';
import { query, queryOne, withTransaction } from '@/lib/server/db';
import { HttpError } from '@/lib/server/http';
import {
  normalizeRubric,
  rubricMode,
  rubricTotals,
  type Rubric,
  type RubricMode,
} from './rubric';
import { buildSheetTemplate, type SheetTemplate } from './sheet-template';

export type SheetMode = 'template' | 'manual';
export type SessionStatus = 'active' | 'finalized' | 'archived';

export type SessionSummary = {
  id: string;
  title: string;
  className: string | null;
  mode: RubricMode;
  sheetMode: SheetMode;
  status: SessionStatus;
  createdAt: string;
  totalPoints: number;
  mcPoints: number;
  essayPoints: number;
  studentCount: number;
  submissionCount: number;
  needsReviewCount: number;
  confirmedCount: number;
};

export type SessionDetail = SessionSummary & {
  subject: string | null;
  grade: number | null;
  snapshotId: string;
  sourceExamId?: string | null;
  examHtml?: string | null;
  answerKeyHtml?: string | null;
  snapshotCreatedAt?: string;
  rubricRevisionId: string;
  rubric: Rubric;
  finalizedAt: string | null;
  /** Present only for the standard-sheet branch; the scanner samples against it. */
  sheetTemplate: SheetTemplate | null;
};

export type CreateSessionInput = {
  title?: string;
  examTitle: string;
  subject?: string | null;
  grade?: number | null;
  examHtml?: string | null;
  answerKeyHtml?: string | null;
  sourceExamId?: string | null;
  rubric: unknown;
  expectedTotal?: number | null;
  sheetMode?: SheetMode;
  className?: string | null;
  classId?: string | null;
  students?: Array<{ code?: string | null; name: string }>;
};

type SessionRow = {
  id: string;
  title: string;
  class_name: string | null;
  mode: RubricMode;
  sheet_mode: SheetMode;
  status: SessionStatus;
  created_at: Date;
  total_points: string;
  mc_points: string;
  essay_points: string;
  student_count: string;
  submission_count: string;
  needs_review_count: string;
  confirmed_count: string;
};

const SUMMARY_COLUMNS = `
  s.id,
  s.title,
  s.class_name,
  s.mode,
  s.sheet_mode,
  s.status,
  s.created_at,
  r.total_points,
  r.mc_points,
  r.essay_points,
  (select count(*) from students st where st.class_id = s.class_id) as student_count,
  (select count(*) from submissions sub where sub.session_id = s.id) as submission_count,
  (select count(*) from submissions sub
    where sub.session_id = s.id and sub.status = 'needs-review') as needs_review_count,
  (select count(*) from submissions sub
    where sub.session_id = s.id and sub.status = 'confirmed') as confirmed_count
`;

function toSummary(row: SessionRow): SessionSummary {
  return {
    id: row.id,
    title: row.title,
    className: row.class_name,
    mode: row.mode,
    sheetMode: row.sheet_mode,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    totalPoints: Number(row.total_points),
    mcPoints: Number(row.mc_points),
    essayPoints: Number(row.essay_points),
    studentCount: Number(row.student_count),
    submissionCount: Number(row.submission_count),
    needsReviewCount: Number(row.needs_review_count),
    confirmedCount: Number(row.confirmed_count),
  };
}

export async function listSessions(ownerId: string, sourceExamId?: string): Promise<SessionSummary[]> {
  const rows = await query<SessionRow>(
    `select ${SUMMARY_COLUMNS}
       from grading_sessions s
       join rubric_revisions r on r.id = s.rubric_revision_id
       join exam_snapshots snap on snap.id = s.snapshot_id
      where s.owner_id = $1 and ($2::text is null or snap.source_exam_id = $2)
      order by s.created_at desc`,
    [ownerId, sourceExamId ?? null],
  );
  return rows.map(toSummary);
}

export async function getSession(ownerId: string, id: string): Promise<SessionDetail | null> {
  const row = await queryOne<SessionRow & {
    subject: string | null;
    grade: number | null;
    snapshot_id: string;
    rubric_revision_id: string;
    finalized_at: Date | null;
    payload: unknown;
    sheet_template: SheetTemplate | null;
    source_exam_id: string | null;
    exam_html: string | null;
    answer_key_html: string | null;
    snapshot_created_at: Date;
  }>(
    `select ${SUMMARY_COLUMNS},
            snap.subject,
            snap.grade,
             snap.source_exam_id,
             snap.exam_html,
             snap.answer_key_html,
             snap.created_at as snapshot_created_at,
            s.snapshot_id,
            s.rubric_revision_id,
            s.finalized_at,
            s.sheet_template,
            r.payload
       from grading_sessions s
       join rubric_revisions r on r.id = s.rubric_revision_id
       join exam_snapshots snap on snap.id = s.snapshot_id
      where s.owner_id = $1 and s.id = $2`,
    [ownerId, id],
  );

  if (!row) return null;

  return {
    ...toSummary(row),
    subject: row.subject,
    grade: row.grade,
    snapshotId: row.snapshot_id,
    sourceExamId: row.source_exam_id,
    examHtml: row.exam_html,
    answerKeyHtml: row.answer_key_html,
    snapshotCreatedAt: row.snapshot_created_at.toISOString(),
    rubricRevisionId: row.rubric_revision_id,
    finalizedAt: row.finalized_at ? row.finalized_at.toISOString() : null,
    rubric: row.payload as Rubric,
    sheetTemplate: row.sheet_template ?? null,
  };
}

/** Finds or creates a class and adds any students that are not in it yet. */
async function upsertClass(
  client: PoolClient,
  ownerId: string,
  className: string,
  subject: string | null,
  grade: number | null,
  students: Array<{ code?: string | null; name: string }>,
): Promise<string> {
  const existing = await client.query<{ id: string }>(
    `select id from classes where owner_id = $1 and lower(name) = lower($2)`,
    [ownerId, className],
  );

  let classId = existing.rows[0]?.id;
  if (!classId) {
    const created = await client.query<{ id: string }>(
      `insert into classes (owner_id, name, subject, grade) values ($1, $2, $3, $4) returning id`,
      [ownerId, className, subject, grade],
    );
    classId = created.rows[0].id;
  }

  const current = await client.query<{ code: string | null; name: string }>(
    `select code, name from students where class_id = $1`,
    [classId],
  );
  const knownCodes = new Set(
    current.rows.map((row) => row.code?.toLowerCase()).filter((code): code is string => Boolean(code)),
  );
  const knownNames = new Set(current.rows.map((row) => row.name.toLowerCase()));

  let sortIndex = current.rows.length;
  for (const student of students) {
    const name = student.name.trim();
    if (!name) continue;
    const code = student.code?.trim() || null;
    if (code && knownCodes.has(code.toLowerCase())) continue;
    if (!code && knownNames.has(name.toLowerCase())) continue;

    await client.query(
      `insert into students (class_id, code, name, sort_index) values ($1, $2, $3, $4)`,
      [classId, code, name, sortIndex],
    );
    sortIndex += 1;
    if (code) knownCodes.add(code.toLowerCase());
    knownNames.add(name.toLowerCase());
  }

  return classId;
}

export async function createSession(
  ownerId: string,
  input: CreateSessionInput,
): Promise<SessionDetail> {
  const rubric = normalizeRubric(input.rubric, input.expectedTotal ?? null);
  const totals = rubricTotals(rubric);
  const mode = rubricMode(rubric);
  const sheetMode: SheetMode = input.sheetMode === 'template' ? 'template' : 'manual';
  const examTitle = input.examTitle.trim() || 'Đề không tên';
  const className = input.className?.trim() || null;
  const title = input.title?.trim() || (className ? `${examTitle} – ${className}` : examTitle);

  const sessionId = await withTransaction(async (client) => {
    const snapshot = await client.query<{ id: string }>(
      `insert into exam_snapshots
         (owner_id, title, subject, grade, exam_html, answer_key_html, source_exam_id)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id`,
      [
        ownerId,
        examTitle,
        input.subject?.trim() || null,
        input.grade ?? null,
        input.examHtml ?? null,
        input.answerKeyHtml ?? null,
        input.sourceExamId ?? null,
      ],
    );
    const snapshotId = snapshot.rows[0].id;

    const revision = await client.query<{ id: string }>(
      `insert into rubric_revisions
         (snapshot_id, version, total_points, mc_points, essay_points, payload)
       values ($1, 1, $2, $3, $4, $5)
       returning id`,
      [snapshotId, totals.total, totals.mc, totals.essay, JSON.stringify(rubric)],
    );

    let classId: string | null = null;
    if (input.classId) {
      const selected = await client.query<{ id: string; name: string }>('select id, name from classes where id = $1 and owner_id = $2', [input.classId, ownerId]);
      if (!selected.rows[0]) throw new HttpError(404, 'Không tìm thấy lớp thuộc tài khoản này.', 'class_not_found');
      classId = selected.rows[0].id;
    } else if (className) {
      classId = await upsertClass(
        client,
        ownerId,
        className,
        input.subject?.trim() || null,
        input.grade ?? null,
        input.students ?? [],
      );
    }

    // The sheet geometry is computed once here, from the same rubric the
    // scanner will later compare against.
    const sheetTemplate =
      sheetMode === 'template'
        ? buildSheetTemplate(rubric, {
            title: examTitle,
            subject: input.subject ?? null,
            className,
          })
        : null;

    const created = await client.query<{ id: string }>(
      `insert into grading_sessions
         (owner_id, snapshot_id, rubric_revision_id, title, class_id, class_name, mode, sheet_mode, sheet_template)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       returning id`,
      [
        ownerId,
        snapshotId,
        revision.rows[0].id,
        title,
        classId,
        className,
        mode,
        sheetMode,
        sheetTemplate ? JSON.stringify(sheetTemplate) : null,
      ],
    );

    return created.rows[0].id;
  });

  const detail = await getSession(ownerId, sessionId);
  if (!detail) throw new HttpError(500, 'Không đọc lại được đợt chấm vừa tạo.', 'session_readback_failed');
  return detail;
}

/** Lists the classes this teacher already has, for the wizard's reuse option. */
export async function listClasses(ownerId: string) {
  const rows = await query<{
    id: string;
    name: string;
    subject: string | null;
    grade: number | null;
    student_count: string;
  }>(
    `select c.id, c.name, c.subject, c.grade,
            (select count(*) from students st where st.class_id = c.id) as student_count
       from classes c
      where c.owner_id = $1
      order by c.created_at desc`,
    [ownerId],
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    subject: row.subject,
    grade: row.grade,
    studentCount: Number(row.student_count),
  }));
}

export async function listStudents(ownerId: string, classId: string) {
  const rows = await query<{ id: string; code: string | null; name: string; sort_index: number }>(
    `select st.id, st.code, st.name, st.sort_index
       from students st
       join classes c on c.id = st.class_id
      where c.owner_id = $1 and st.class_id = $2
      order by st.sort_index, st.name`,
    [ownerId, classId],
  );
  return rows;
}
