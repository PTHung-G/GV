import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { importOwnerDocuments } from '@/lib/server/documents-store';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    requireDatabase();
    const user = await requireUser();
    const body = await readJson<{ documents?: unknown; recovery?: unknown }>(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new HttpError(400, 'Tệp sao lưu không hợp lệ.', 'invalid_documents');
    }
    const list = [
      ...(Array.isArray(body.documents) ? body.documents : []),
      ...(Array.isArray(body.recovery) ? body.recovery : []),
    ];
    if (!list.length) {
      throw new HttpError(400, 'Không có tài liệu nào trong tệp sao lưu.', 'invalid_documents');
    }
    const result = await importOwnerDocuments(user.id, list);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return jsonError(error);
  }
}
