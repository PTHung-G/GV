/**
 * Submissions and their pages.
 *
 * A submission is one student's paper inside one session; pages are the photos
 * that make it up. Identity and scoring are deliberately separate axes: a paper
 * can be fully graded while still waiting for the teacher to confirm whose it is.
 */
import { verifyPublishedIdentity, assertPublishedProvenance, assertBundleStudentUnique } from '@/lib/exam-release/access';
import { lockSession, lockSubmission, queueSection } from './lifecycle';
import { createHash } from 'node:crypto';
import { query, queryOne, withTransaction } from '@/lib/server/db';
import { HttpError } from '@/lib/server/http';
import { buildKey, deleteObject, putObject } from '@/lib/server/storage';
import { extensionFor, readImageSize, sniffImageType } from './image-info';

export const MAX_PAGE_BYTES = 12 * 1024 * 1024;

export type PageSummary = {
  id: string;
  pageIndex: number;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  status: string;
};

export type SubmissionSummary = {
  id: string;
  label: string | null;
  studentId: string | null;
  studentCode: string | null;
  studentName: string | null;
  identityStatus: string;
  examCode: string | null;
  pageCount: number;
  mcStatus: string;
  essayStatus: string;
  mcScore: number | null;
  essayScore: number | null;
  totalScore: number | null;
  status: string;
  flags: string[];
  createdAt: string;
  pages: PageSummary[];
};

type SubmissionRow = {
  id: string;
  label: string | null;
  student_id: string | null;
  student_code: string | null;
  student_name: string | null;
  identity_status: string;
  exam_code: string | null;
  page_count: number;
  mc_status: string;
  essay_status: string;
  mc_score: string | null;
  essay_score: string | null;
  total_score: string | null;
  status: string;
  flags: string[];
  created_at: Date;
};

type PageRow = {
  id: string;
  submission_id: string;
  page_index: number;
  mime_type: string;
  byte_size: string;
  width: number | null;
  height: number | null;
  status: string;
};

const SUBMISSION_COLUMNS = `
  id, label, student_id, student_code, student_name, identity_status, exam_code,
  page_count, mc_status, essay_status, mc_score, essay_score, total_score,
  status, flags, created_at
`;

function toSummary(row: SubmissionRow, pages: PageSummary[]): SubmissionSummary {
  return {
    id: row.id,
    label: row.label,
    studentId: row.student_id,
    studentCode: row.student_code,
    studentName: row.student_name,
    identityStatus: row.identity_status,
    examCode: row.exam_code,
    pageCount: row.page_count,
    mcStatus: row.mc_status,
    essayStatus: row.essay_status,
    mcScore: row.mc_score === null ? null : Number(row.mc_score),
    essayScore: row.essay_score === null ? null : Number(row.essay_score),
    totalScore: row.total_score === null ? null : Number(row.total_score),
    status: row.status,
    flags: row.flags ?? [],
    createdAt: row.created_at.toISOString(),
    pages,
  };
}

function toPage(row: PageRow): PageSummary {
  return {
    id: row.id,
    pageIndex: row.page_index,
    mimeType: row.mime_type,
    byteSize: Number(row.byte_size),
    width: row.width,
    height: row.height,
    status: row.status,
  };
}

async function pagesFor(submissionIds: string[]): Promise<Map<string, PageSummary[]>> {
  const map = new Map<string, PageSummary[]>();
  if (submissionIds.length === 0) return map;

  const rows = await query<PageRow>(
    `select id, submission_id, page_index, mime_type, byte_size, width, height, status
       from page_assets
      where submission_id = any($1::uuid[]) and kind = 'original'
      order by page_index`,
    [submissionIds],
  );

  for (const row of rows) {
    const list = map.get(row.submission_id) ?? [];
    list.push(toPage(row));
    map.set(row.submission_id, list);
  }
  return map;
}

export async function listSubmissions(sessionId: string): Promise<SubmissionSummary[]> {
  const rows = await query<SubmissionRow>(
    `select ${SUBMISSION_COLUMNS} from submissions
      where session_id = $1
      order by created_at`,
    [sessionId],
  );
  const pages = await pagesFor(rows.map((row) => row.id));
  return rows.map((row) => toSummary(row, pages.get(row.id) ?? []));
}

export async function getSubmission(
  sessionId: string,
  submissionId: string,
): Promise<SubmissionSummary | null> {
  const row = await queryOne<SubmissionRow>(
    `select ${SUBMISSION_COLUMNS} from submissions where session_id = $1 and id = $2`,
    [sessionId, submissionId],
  );
  if (!row) return null;
  const pages = await pagesFor([row.id]);
  return toSummary(row, pages.get(row.id) ?? []);
}

export type CreateSubmissionInput = {
  qr?: string | null;
  studentId?: string | null;
  studentCode?: string | null;
  studentName?: string | null;
  examCode?: string | null;
  label?: string | null;
};

/**
 * Creates a paper, defaulting to an auto label so a teacher can start scanning
 * before deciding who the paper belongs to.
 */
export async function createSubmission(
  sessionId: string,
  input: CreateSubmissionInput,
): Promise<SubmissionSummary> {
  const id = await withTransaction(async (client) => {
    const published = await verifyPublishedIdentity(client, sessionId, input.qr);
    const session = await lockSession(client, sessionId);
    let studentCode = input.studentCode?.trim() || null;
    let studentName = input.studentName?.trim() || null;
    let identityStatus: 'unassigned' | 'verified' = 'unassigned';

    if (input.studentId) {
      const student = await client.query<{ code: string | null; name: string }>(
        `select st.code, st.name
           from students st
           join grading_sessions s on s.class_id = st.class_id
          where st.id = $1 and s.id = $2`,
        [input.studentId, sessionId],
      );
      const row = student.rows[0];
      if (!row) {
        throw new HttpError(400, 'Học sinh không thuộc lớp của đợt chấm này.', 'student_not_in_class');
      }

      const clash = await client.query(
        `select 1 from submissions where session_id = $1 and student_id = $2`,
        [sessionId, input.studentId],
      );
      if (clash.rowCount) {
        throw new HttpError(409, 'Học sinh này đã có bài trong đợt chấm.', 'duplicate_student');
      }

      studentCode = row.code;
      studentName = row.name;
      identityStatus = 'verified';
    }

    let label = input.label?.trim() || null;
    if (!label) {
      const counted = await client.query<{ next: string }>(
        `select coalesce(count(*), 0) + 1 as next from submissions where session_id = $1`,
        [sessionId],
      );
      label = `Bài ${String(Number(counted.rows[0].next)).padStart(3, '0')}`;
    }

    const created = await client.query<{ id: string }>(
      `insert into submissions
         (session_id, student_id, student_code, student_name, identity_status, exam_code, label)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id`,
      [
        sessionId,
        input.studentId ?? null,
        studentCode,
        studentName,
        identityStatus,
        input.examCode?.trim() || null,
        label,
      ],
    );
    if (published) {
      await client.query('update submissions set published_variant_id=$2,published_identity_verified_at=now(),exam_code=$3 where id=$1',[created.rows[0].id,published.id,published.code]);
      await assertBundleStudentUnique(client,sessionId,created.rows[0].id);
    }
    await client.query(`update submissions set
      mc_status = case when $2 = 'essay-only' then 'not-applicable' else 'pending' end,
      essay_status = case when $2 = 'mc-only' then 'not-applicable' else 'pending' end where id = $1`,
      [created.rows[0].id, session.mode]);
    return created.rows[0].id;
  });

  const detail = await getSubmission(sessionId, id);
  if (!detail) throw new HttpError(500, 'Không đọc lại được bài vừa tạo.', 'submission_readback_failed');
  return detail;
}

export type AddPageResult = {
  page: PageSummary;
  duplicate: boolean;
  warnings: string[];
};

/**
 * Stores one photo. The declared MIME type is ignored in favour of the magic
 * bytes, and a byte-identical page already on this paper is reported rather
 * than stored twice.
 */
export async function addPage(
  sessionId: string,
  submissionId: string,
  buffer: Buffer,
): Promise<AddPageResult> {
  if (buffer.byteLength === 0) throw new HttpError(400, 'Tệp rỗng.', 'empty_file');
  if (buffer.byteLength > MAX_PAGE_BYTES) {
    throw new HttpError(
      413,
      `Ảnh vượt quá ${Math.round(MAX_PAGE_BYTES / 1024 / 1024)}MB. Hãy chụp lại ở độ phân giải thấp hơn.`,
      'file_too_large',
    );
  }

  const mimeType = sniffImageType(buffer);
  if (!mimeType) {
    throw new HttpError(415, 'Chỉ nhận ảnh JPEG, PNG hoặc WebP.', 'unsupported_media_type');
  }

  const exists = await queryOne<{ id: string }>(
    `select id from submissions where session_id = $1 and id = $2`,
    [sessionId, submissionId],
  );
  if (!exists) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');

  const size = readImageSize(buffer);
  const warnings: string[] = [];
  if (size && Math.min(size.width, size.height) < 900) {
    warnings.push('Ảnh khá nhỏ, chữ viết tay có thể khó đọc.');
  }

  // Hash before storing: a byte-identical page is the same photo sent twice, so
  // returning the stored one avoids paying for storage again and, more
  // importantly, stops the page count from drifting above the real page count.
  const sha256 = createHash('sha256').update(buffer).digest('hex');
  const existing = await queryOne<PageRow>(
    `select id, submission_id, page_index, mime_type, byte_size, width, height, status
       from page_assets
      where submission_id = $1 and sha256 = $2 and kind = 'original'
      order by page_index
      limit 1`,
    [submissionId, sha256],
  );

  if (existing) {
    return {
      page: toPage(existing),
      duplicate: true,
      warnings: [...warnings, 'Trang này giống hệt một trang đã có trong bài.'],
    };
  }

  const stored = await putObject(
    buildKey(
      'sessions',
      sessionId,
      'submissions',
      submissionId,
      `${Date.now()}-${crypto.randomUUID()}.${extensionFor(mimeType)}`,
    ),
    buffer,
  );

  let page: PageRow;
  try {
    page = await withTransaction(async (client) => {
    const session = await lockSession(client, sessionId);
    await lockSubmission(client, sessionId, submissionId);
    const next = await client.query<{ next: number }>(
      `select coalesce(max(page_index), -1) + 1 as next
         from page_assets where submission_id = $1 and kind = 'original'`,
      [submissionId],
    );

    const inserted = await client.query<PageRow>(
      `insert into page_assets
         (submission_id, storage_key, mime_type, byte_size, width, height, page_index, kind, status, sha256)
       values ($1, $2, $3, $4, $5, $6, $7, 'original', 'stored', $8)
       returning id, submission_id, page_index, mime_type, byte_size, width, height, status`,
      [
        submissionId,
        stored.key,
        mimeType,
        stored.byteSize,
        size?.width ?? null,
        size?.height ?? null,
        next.rows[0].next,
        sha256,
      ],
    );

    await client.query(
      `update submissions
          set page_count = (select count(*) from page_assets
                             where submission_id = $1 and kind = 'original' and status = 'stored'),
              updated_at = now()
        where id = $1`,
      [submissionId],
    );

    await client.query('delete from mc_answers where submission_id = $1', [submissionId]);
    await client.query('delete from criterion_scores where submission_id = $1', [submissionId]);
    await client.query("update jobs set status = 'failed', last_error = 'Đầu vào đã thay đổi', finished_at = now(), lease_token = null where submission_id = $1 and status in ('queued','running')", [submissionId]);
    await client.query("insert into audit_events (session_id, submission_id, action, after_value) values ($1,$2,'submission.input_changed',jsonb_build_object('pageId',$3::text))", [sessionId, submissionId, inserted.rows[0].id]);
    return inserted.rows[0];
  });
  } catch (error) {
    await deleteObject(stored.key).catch(() => undefined);
    throw error;
  }

  return { page: toPage(page), duplicate: false, warnings };
}

/** Marks the paper finished so grading can start; safe to call twice. */
export async function completeSubmission(
  sessionId: string,
  submissionId: string,
): Promise<SubmissionSummary> {
  await withTransaction(async client => {
    const session = await lockSession(client, sessionId);
    await assertPublishedProvenance(client,sessionId,submissionId);
    const sub = await lockSubmission(client, sessionId, submissionId);
    const published=await client.query(`select v.id from exam_release_variants v join submissions sub on sub.id=$2 where v.session_id=$1 and sub.published_omr_verified_at is null and exists(select 1 from jsonb_array_elements(v.rubric->'questions') q where q->>'type'='mc')`,[sessionId,submissionId]);
    if(published.rows.length)throw new HttpError(409,'Cần đọc đầy đủ phiếu bằng QR trước khi chấm.','published_omr_required');
    if (!sub.page_count) throw new HttpError(400, 'Bài này chưa có trang nào.', 'no_pages');
    if (sub.status === 'confirmed') return;
    const omr = await client.query<{ count: number }>("select count(*)::int as count from mc_answers where submission_id = $1 and source = 'omr'", [submissionId]);
    if (session.mode !== 'essay-only' && !omr.rows[0].count) await queueSection(client, sessionId, submissionId, 'grade-mc');
    if (session.mode !== 'mc-only') await queueSection(client, sessionId, submissionId, 'grade-essay');
  });

  const detail = await getSubmission(sessionId, submissionId);
  if (!detail) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');
  return detail;
}

export async function deleteSubmission(sessionId: string, submissionId: string): Promise<void> {
  const keys = await withTransaction(async client => {
    await lockSession(client, sessionId);
    await lockSubmission(client, sessionId, submissionId);
    const files = await client.query<{ storage_key: string }>('select storage_key from page_assets where submission_id = $1', [submissionId]);
    await client.query("insert into audit_events (session_id, action, before_value) values ($1,'submission.delete',jsonb_build_object('submissionId',$2::text))", [sessionId, submissionId]);
    await client.query('delete from submissions where id = $1', [submissionId]);
    return files.rows;
  });

  // Files are removed after the row, so a failure leaves an orphan, never a
  // database row pointing at a missing image.
  await Promise.all(keys.map((row) => deleteObject(row.storage_key).catch(() => undefined)));
}

export async function pageStorageKey(
  sessionId: string,
  pageId: string,
): Promise<{ storageKey: string; mimeType: string } | null> {
  const row = await queryOne<{ storage_key: string; mime_type: string }>(
    `select p.storage_key, p.mime_type
       from page_assets p
       join submissions sub on sub.id = p.submission_id
      where p.id = $1 and sub.session_id = $2`,
    [pageId, sessionId],
  );
  return row ? { storageKey: row.storage_key, mimeType: row.mime_type } : null;
}

/** Progress counters used by the workspace header and the SSE stream. */
export async function sessionProgress(sessionId: string) {
  const row = await queryOne<{
    total: string;
    needs_review: string;
    confirmed: string;
    processing: string;
    failed: string;
    pages: string;
  }>(
    `select
       (select count(*) from submissions where session_id = $1) as total,
       (select count(*) from submissions where session_id = $1 and status = 'needs-review') as needs_review,
       (select count(*) from submissions where session_id = $1 and status = 'confirmed') as confirmed,
       (select count(*) from submissions where session_id = $1 and status = 'processing') as processing,
       (select count(*) from page_assets p
          join submissions s2 on s2.id = p.submission_id
         where s2.session_id = $1 and p.kind = 'original') as pages`,
    [sessionId],
  );

  return {
    submissions: Number(row?.total ?? 0),
    needsReview: Number(row?.needs_review ?? 0),
    confirmed: Number(row?.confirmed ?? 0),
    processing: Number(row?.processing ?? 0),
    failed: Number(row?.failed ?? 0),
    pages: Number(row?.pages ?? 0),
  };
}
