import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { patchConversationTurn } from '@/lib/server/conversations';
import { jsonError, readJson } from '@/lib/server/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; turnId: string }> }) {
  try {
    const user = await requireUser();
    const { id, turnId } = await params;
    return NextResponse.json(await patchConversationTurn(user.id, id, turnId, await readJson<unknown>(req)), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return jsonError(error); }
}
