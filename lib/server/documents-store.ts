/**
 * Normalized relational document store backed by the `documents` table.
 *
 * Each exam/answer-key lives in its own row (`(owner_id, id)` PK), while
 * `document_libraries(owner_id, revision)` serves as the lightweight per-owner
 * library revision counter so whole-library GET/PUT contracts stay backwards-
 * compatible without packing megabytes of SVG/HTML into one JSONB column.
 */
import type { PoolClient } from 'pg';
import type { ExamDoc } from '@/lib/docs-store';
import { mergeImportedDocuments, validateDocuments } from '@/lib/document-library';
import { query, queryOne, withTransaction } from './db';
import { HttpError } from './http';

type DocumentRow = {
  id: string;
  kind: 'exam' | 'answer-key';
  parent_id: string | null;
  title: string;
  subject: string;
  grade: number | null;
  content: string;
  structure: ExamDoc['structure'] | null;
  answer_key_questions: ExamDoc['answerKeyQuestions'] | null;
  source_content_hash: string | null;
  content_status: 'complete' | 'preview' | null;
  source_id: string | null;
  shared: boolean | null;
  author_name: string | null;
  revision: string;
  created_at: Date;
  updated_at: Date;
};

function rowToDoc(row: DocumentRow): ExamDoc {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    subject: row.subject,
    grade: row.grade,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    ...(row.kind === 'answer-key' ? { kind: 'answer-key' as const } : {}),
    ...(row.parent_id ? { parentId: row.parent_id } : {}),
    ...(row.structure ? { structure: row.structure } : {}),
    ...(row.answer_key_questions ? { answerKeyQuestions: row.answer_key_questions } : {}),
    ...(row.source_content_hash ? { sourceContentHash: row.source_content_hash } : {}),
    ...(row.content_status ? { contentStatus: row.content_status } : {}),
    ...(row.source_id ? { sourceId: row.source_id } : {}),
    ...(row.shared !== null ? { shared: row.shared } : {}),
    ...(row.author_name ? { authorName: row.author_name } : {}),
  };
}

async function upsertDocRow(client: PoolClient, ownerId: string, doc: ExamDoc): Promise<void> {
  await client.query(
    `insert into documents (
       owner_id, id, kind, parent_id, title, subject, grade, content,
       structure, answer_key_questions, source_content_hash, content_status,
       source_id, shared, author_name, revision, created_at, updated_at
     ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11, $12, $13, $14, $15, 1, $16::timestamptz, $17::timestamptz)
     on conflict (owner_id, id) do update set
       kind = excluded.kind,
       parent_id = excluded.parent_id,
       title = excluded.title,
       subject = excluded.subject,
       grade = excluded.grade,
       content = excluded.content,
       structure = excluded.structure,
       answer_key_questions = excluded.answer_key_questions,
       source_content_hash = excluded.source_content_hash,
       content_status = excluded.content_status,
       source_id = excluded.source_id,
       shared = excluded.shared,
       author_name = excluded.author_name,
       revision = documents.revision + 1,
       updated_at = excluded.updated_at`,
    [
      ownerId,
      doc.id,
      doc.kind ?? 'exam',
      doc.parentId ?? null,
      doc.title,
      doc.subject,
      doc.grade,
      doc.content,
      doc.structure ? JSON.stringify(doc.structure) : null,
      doc.answerKeyQuestions ? JSON.stringify(doc.answerKeyQuestions) : null,
      doc.sourceContentHash ?? null,
      doc.contentStatus ?? null,
      doc.sourceId ?? null,
      doc.shared ?? null,
      doc.authorName ?? null,
      doc.createdAt || new Date().toISOString(),
      doc.updatedAt || new Date().toISOString(),
    ],
  );
}

async function bumpLibraryRevision(
  client: PoolClient,
  ownerId: string,
  expectedRevision?: number,
): Promise<number> {
  await client.query(
    `insert into document_libraries (owner_id, documents, revision)
     values ($1, '[]'::jsonb, 0)
     on conflict (owner_id) do nothing`,
    [ownerId],
  );
  const locked = await client.query<{ revision: string }>(
    `select revision from document_libraries where owner_id = $1 for update`,
    [ownerId],
  );
  const current = Number(locked.rows[0]?.revision ?? 0);
  if (expectedRevision !== undefined && current !== expectedRevision) {
    throw new HttpError(
      409,
      'Kho đề đã thay đổi trên thiết bị khác. Bản nháp vẫn ở trình duyệt này; hãy sao lưu trước khi tải lại.',
      'library_conflict',
    );
  }
  const updated = await client.query<{ revision: string }>(
    `update document_libraries
        set revision = revision + 1,
            documents = '[]'::jsonb,
            updated_at = now()
      where owner_id = $1
      returning revision`,
    [ownerId],
  );
  return Number(updated.rows[0].revision);
}

export async function getOwnerLibrary(ownerId: string): Promise<{ documents: ExamDoc[]; revision: number }> {
  const [rows, meta] = await Promise.all([
    query<DocumentRow>(
      `select id, kind, parent_id, title, subject, grade, content, structure,
              answer_key_questions, source_content_hash, content_status,
              source_id, shared, author_name, revision, created_at, updated_at
         from documents
        where owner_id = $1
        order by updated_at desc, created_at desc`,
      [ownerId],
    ),
    queryOne<{ revision: string; documents: unknown[] }>(
      `select revision, documents from document_libraries where owner_id = $1`,
      [ownerId],
    ),
  ]);

  if (rows.length > 0) {
    return { documents: rows.map(rowToDoc), revision: Number(meta?.revision ?? 0) };
  }
  const legacy = Array.isArray(meta?.documents) && meta.documents.length > 0
    ? validateDocuments(meta.documents, { strictStructure: false })
    : [];
  return { documents: legacy, revision: Number(meta?.revision ?? 0) };
}

export async function putOwnerLibrary(
  ownerId: string,
  expectedRevision: number,
  rawDocs: unknown,
): Promise<{ revision: number }> {
  let documents: ExamDoc[];
  try {
    documents = validateDocuments(rawDocs);
  } catch (error) {
    throw new HttpError(400, (error as Error).message, 'invalid_documents');
  }

  return withTransaction(async (client) => {
    const revision = await bumpLibraryRevision(client, ownerId, expectedRevision);
    const keepIds = documents.map((d) => d.id);
    if (keepIds.length === 0) {
      await client.query(`delete from documents where owner_id = $1`, [ownerId]);
    } else {
      await client.query(
        `delete from documents where owner_id = $1 and not (id = any($2::text[]))`,
        [ownerId, keepIds],
      );
      for (const doc of documents) {
        await upsertDocRow(client, ownerId, doc);
      }
    }
    return { revision };
  });
}

export async function getOwnerDocument(
  ownerId: string,
  docId: string,
): Promise<{ document: ExamDoc; docRevision: number } | null> {
  const row = await queryOne<DocumentRow>(
    `select id, kind, parent_id, title, subject, grade, content, structure,
            answer_key_questions, source_content_hash, content_status,
            source_id, shared, author_name, revision, created_at, updated_at
       from documents
      where owner_id = $1 and id = $2`,
    [ownerId, docId],
  );
  if (!row) return null;
  return { document: rowToDoc(row), docRevision: Number(row.revision) };
}

export async function putOwnerDocument(
  ownerId: string,
  docId: string,
  rawDoc: unknown,
  expectedDocRevision?: number,
): Promise<{ document: ExamDoc; docRevision: number; revision: number }> {
  let parsed: ExamDoc[];
  try {
    parsed = validateDocuments([rawDoc]);
  } catch (error) {
    throw new HttpError(400, (error as Error).message, 'invalid_documents');
  }
  const doc = parsed[0];
  if (doc.id !== docId) {
    throw new HttpError(400, 'Mã tài liệu không khớp đường dẫn.', 'id_mismatch');
  }

  return withTransaction(async (client) => {
    const existing = await client.query<{ revision: string }>(
      `select revision from documents where owner_id = $1 and id = $2 for update`,
      [ownerId, docId],
    );
    if (expectedDocRevision !== undefined && existing.rows[0]) {
      const current = Number(existing.rows[0].revision);
      if (current !== expectedDocRevision) {
        throw new HttpError(409, 'Tài liệu đã được sửa ở phiên bản mới hơn.', 'document_conflict');
      }
    }
    await upsertDocRow(client, ownerId, doc);
    const revision = await bumpLibraryRevision(client, ownerId);
    const saved = await client.query<DocumentRow>(
      `select id, kind, parent_id, title, subject, grade, content, structure,
              answer_key_questions, source_content_hash, content_status,
              source_id, shared, author_name, revision, created_at, updated_at
         from documents where owner_id = $1 and id = $2`,
      [ownerId, docId],
    );
    return {
      document: rowToDoc(saved.rows[0]),
      docRevision: Number(saved.rows[0].revision),
      revision,
    };
  });
}

export async function deleteOwnerDocument(
  ownerId: string,
  docId: string,
): Promise<{ deleted: number; revision: number }> {
  return withTransaction(async (client) => {
    const res = await client.query(
      `delete from documents where owner_id = $1 and (id = $2 or parent_id = $2)`,
      [ownerId, docId],
    );
    const revision = await bumpLibraryRevision(client, ownerId);
    return { deleted: res.rowCount ?? 0, revision };
  });
}

export async function importOwnerDocuments(
  ownerId: string,
  rawDocs: unknown,
): Promise<{ revision: number; importedCount: number; documents: ExamDoc[] }> {
  let incoming: ExamDoc[];
  try {
    incoming = validateDocuments(rawDocs, { strictStructure: false });
  } catch (error) {
    throw new HttpError(400, (error as Error).message, 'invalid_documents');
  }

  return withTransaction(async (client) => {
    const currentRows = await client.query<DocumentRow>(
      `select id, kind, parent_id, title, subject, grade, content, structure,
              answer_key_questions, source_content_hash, content_status,
              source_id, shared, author_name, revision, created_at, updated_at
         from documents where owner_id = $1`,
      [ownerId],
    );
    const current = currentRows.rows.map(rowToDoc);
    const known = new Set(current.map((d) => d.id));
    const merged = mergeImportedDocuments(current, incoming);
    const fresh = merged.filter((d) => !known.has(d.id));

    for (const doc of fresh) {
      await upsertDocRow(client, ownerId, doc);
    }
    const revision = await bumpLibraryRevision(client, ownerId);
    return { revision, importedCount: fresh.length, documents: merged };
  });
}

export async function createDocumentPair(
  ownerId: string,
  docsToSave: ExamDoc[],
): Promise<{ revision: number }> {
  return withTransaction(async (client) => {
    for (const doc of docsToSave) {
      await upsertDocRow(client, ownerId, doc);
    }
    const revision = await bumpLibraryRevision(client, ownerId);
    return { revision };
  });
}
