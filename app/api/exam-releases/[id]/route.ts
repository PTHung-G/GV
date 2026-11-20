import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError, jsonError, readJson } from '@/lib/server/http';
import { assignReleaseClass, getRelease } from '@/lib/exam-release/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const release = await getRelease(user.id, (await params).id);
    if (!release) throw new HttpError(404, 'Không tìm thấy bộ mã đề.', 'release_not_found');
    return NextResponse.json({ release }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    validateAuthRequest(req);
    const user = await requireUser();
    const body = await readJson<{ classId?: string | null }>(req);
    const release = await assignReleaseClass(user.id, (await params).id, body.classId || null);
    return NextResponse.json({ release }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return jsonError(e);
  }
}
