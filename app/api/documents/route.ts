import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { getOwnerLibrary, putOwnerLibrary } from '@/lib/server/documents-store';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    requireDatabase();
    const user = await requireUser();
    const data = await getOwnerLibrary(user.id);
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(req: Request) {
  try {
    requireDatabase();
    const user = await requireUser();
    const body = await readJson<{ documents?: unknown; revision?: unknown; ownerId?: string }>(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new HttpError(400, 'Dữ liệu kho đề không hợp lệ.', 'invalid_documents');
    }
    if (body.ownerId !== user.id) {
      throw new HttpError(409, 'Tài khoản đã thay đổi. Không lưu bản nháp của tài khoản trước.', 'account_changed');
    }
    if (!Number.isSafeInteger(body.revision) || Number(body.revision) < 0) {
      throw new HttpError(400, 'Thiếu phiên bản kho đề.', 'invalid_revision');
    }
    const result = await putOwnerLibrary(user.id, Number(body.revision), body.documents);
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error);
  }
}
