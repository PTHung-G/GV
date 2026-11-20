import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { deleteOwnerDocument, getOwnerDocument, putOwnerDocument } from '@/lib/server/documents-store';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const user = await requireUser();
    const { id } = await params;
    const found = await getOwnerDocument(user.id, id);
    if (!found) throw new HttpError(404, 'Không tìm thấy tài liệu.', 'document_not_found');
    return NextResponse.json(found, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const user = await requireUser();
    const { id } = await params;
    const body = await readJson<{ document?: unknown; docRevision?: number; ownerId?: string }>(req);
    if (!body || typeof body !== 'object' || Array.isArray(body) || !body.document) {
      throw new HttpError(400, 'Dữ liệu tài liệu không hợp lệ.', 'invalid_documents');
    }
    if (body.ownerId && body.ownerId !== user.id) {
      throw new HttpError(409, 'Tài khoản đã thay đổi. Không lưu bản nháp của tài khoản trước.', 'account_changed');
    }
    const expected = typeof body.docRevision === 'number' && Number.isSafeInteger(body.docRevision) ? body.docRevision : undefined;
    const saved = await putOwnerDocument(user.id, id, body.document, expected);
    return NextResponse.json(saved);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const user = await requireUser();
    const { id } = await params;
    const result = await deleteOwnerDocument(user.id, id);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return jsonError(error);
  }
}
