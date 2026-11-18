import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { HttpError, jsonError, readJson, requireString } from '@/lib/server/http';
import { newItem, readMemory, writeMemory } from '@/lib/server/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const memory = await writeMemory(user.id, (memory) => {
      const item = memory.items.find((i) => i.id === id);
      if (!item) throw new HttpError(404, 'Không tìm thấy mục.', 'memory_not_found');
      delete item.deleted;
      return memory;
    });
    return NextResponse.json({ item: memory.items.find((i) => i.id === id) });
  } catch (error) { return jsonError(error); }
}
