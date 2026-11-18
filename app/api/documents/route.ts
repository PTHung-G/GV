import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { queryOne } from '@/lib/server/db';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { validateDocuments } from '@/lib/document-library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    requireDatabase();
    const user = await requireUser();
    const row = await queryOne<{ revision: string; documents: unknown[] }>(
      'select revision, documents from document_libraries where owner_id = $1', [user.id],
    );
    return NextResponse.json({ documents: row?.documents ?? [], revision: Number(row?.revision ?? 0) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return jsonError(error); }
}

export async function PUT(req: Request) {
  try {
    requireDatabase();
    const user = await requireUser();
    const body = await readJson<{ documents?: unknown; revision?: unknown; ownerId?: string }>(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Dữ liệu kho đề không hợp lệ.', 'invalid_documents');
    if (body.ownerId !== user.id) throw new HttpError(409, 'Tài khoản đã thay đổi. Không lưu bản nháp của tài khoản trước.', 'account_changed');
    if (!Number.isSafeInteger(body.revision) || Number(body.revision) < 0) throw new HttpError(400, 'Thiếu phiên bản kho đề.', 'invalid_revision');
    let documents;
    try { documents = validateDocuments(body.documents); }
    catch (error) { throw new HttpError(400, (error as Error).message, 'invalid_documents'); }
    if (JSON.stringify(documents).length > 10_000_000) throw new HttpError(413, 'Kho đề vượt giới hạn 10 MB cho một lần lưu.', 'library_too_large');
    const row = await queryOne<{ revision: string }>(
      `insert into document_libraries (owner_id, documents, revision)
       select $1, $2::jsonb, 1 where $3::bigint = 0
       on conflict (owner_id) do update set documents = excluded.documents,
         revision = document_libraries.revision + 1, updated_at = now()
       where document_libraries.revision = $3::bigint
       returning revision`, [user.id, JSON.stringify(documents), body.revision],
    );
    // INSERT ... SELECT cannot update existing rows when the input revision > 0.
    const updated = row ?? (Number(body.revision) > 0 ? await queryOne<{ revision: string }>(
      `update document_libraries set documents = $2::jsonb, revision = revision + 1, updated_at = now()
       where owner_id = $1 and revision = $3 returning revision`, [user.id, JSON.stringify(documents), body.revision],
    ) : null);
    if (!updated) throw new HttpError(409, 'Kho đề đã thay đổi trên thiết bị khác. Bản nháp vẫn ở trình duyệt này; hãy sao lưu trước khi tải lại.', 'library_conflict');
    return NextResponse.json({ revision: Number(updated.revision) });
  } catch (error) { return jsonError(error); }
}
