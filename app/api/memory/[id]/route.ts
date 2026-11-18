import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { HttpError, jsonError, readJson, requireString } from '@/lib/server/http';
import { newItem, readMemory, writeMemory } from '@/lib/server/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await readJson<{ text?: unknown }>(req);
    const text = requireString(body?.text, 'Nội dung trống.');
    const memory = await writeMemory(user.id, (memory) => {
      const item = memory.items.find((i) => i.id === id);
      if (!item) throw new HttpError(404, 'Không tìm thấy mục.', 'memory_not_found');
      item.text = text;
      return memory;
    });
    return NextResponse.json({ item: memory.items.find((i) => i.id === id) });
  } catch (error) { return jsonError(error); }
}
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await writeMemory(user.id, (memory) => {
      const item = memory.items.find((i) => i.id === id);
      if (!item) throw new HttpError(404, 'Không tìm thấy mục.', 'memory_not_found');
      item.deleted = true;
      return memory;
    });
    return NextResponse.json({ ok: true });
  } catch (error) { return jsonError(error); }
}
