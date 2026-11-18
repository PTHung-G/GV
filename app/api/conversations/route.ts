import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { getConversation } from '@/lib/server/conversations';
import { HttpError, jsonError, readJson } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const docId = req.nextUrl.searchParams.get('docId');
    const selected = req.nextUrl.searchParams.get('conversationId') ?? undefined;
    if (typeof docId !== 'string') throw new HttpError(400, 'Thiếu mã tài liệu.', 'invalid_doc_id');
    return NextResponse.json(await getConversation(user.id, docId, selected), { headers });
  } catch (error) { return jsonError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await readJson<{ docId?: unknown }>(req);
    if (!body || typeof body.docId !== 'string') throw new HttpError(400, 'Thiếu mã tài liệu.', 'invalid_doc_id');
    return NextResponse.json(await getConversation(user.id, body.docId, undefined, true), { status: 201, headers });
  } catch (error) { return jsonError(error); }
}
