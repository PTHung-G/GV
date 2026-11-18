import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { HttpError, jsonError, readJson, requireString } from '@/lib/server/http';
import { newItem, readMemory, writeMemory } from '@/lib/server/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await readJson<{ useMemory?: unknown }>(req);
    if (typeof body?.useMemory !== 'boolean') throw new HttpError(400, 'Cài đặt không hợp lệ.', 'invalid_memory_settings');
    const useMemory = body.useMemory;
    const memory = await writeMemory(user.id, (memory) => ({ ...memory, useMemory }));
    return NextResponse.json({ memory });
  } catch (error) { return jsonError(error); }
}
