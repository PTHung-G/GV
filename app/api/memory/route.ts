import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { HttpError, jsonError, readJson, requireString } from '@/lib/server/http';
import { newItem, readMemory, writeMemory } from '@/lib/server/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({ memory: await readMemory(user.id) });
  } catch (error) { return jsonError(error); }
}
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await readJson<{ text?: unknown }>(req);
    const text = requireString(body?.text, 'Chưa có nội dung cần nhớ.', 'empty_text');
    const item = newItem(text);
    await writeMemory(user.id, (memory) => { memory.items.unshift(item); return memory; });
    return NextResponse.json({ item });
  } catch (error) { return jsonError(error); }
}
export async function DELETE() {
  try {
    const user = await requireUser();
    const memory = await writeMemory(user.id, () => ({ items: [], useMemory: true }));
    return NextResponse.json({ memory });
  } catch (error) { return jsonError(error); }
}
