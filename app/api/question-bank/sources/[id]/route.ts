import { NextResponse } from 'next/server';
import { bankUser, bankResponse, jsonError } from '@/lib/server/question-bank-http';
import { deleteBankSource, getBankSource } from '@/lib/server/question-bank-store';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await bankUser();
    const { id } = await params;
    const source = await getBankSource(user.id, id);
    if (!source) throw new HttpError(404, 'Không tìm thấy nguồn.', 'source_not_found');
    return NextResponse.json({ ownerId: user.id, source }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    validateAuthRequest(req);
    const user = await bankUser();
    const { id } = await params;
    const res = await deleteBankSource(user.id, id);
    return bankResponse(res.envelope, { deletedId: res.value });
  } catch (e) {
    return jsonError(e);
  }
}
