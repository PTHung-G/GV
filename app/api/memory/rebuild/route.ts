import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { HttpError, jsonError, readJson, requireString } from '@/lib/server/http';
import { newItem, readMemory, writeMemory } from '@/lib/server/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Prune blank/duplicate preferences, not a reconstruction of chat history. */
export async function POST() {
  try {
    const user = await requireUser();
    const memory = await writeMemory(user.id, (memory) => {
      const seen = new Set<string>();
      memory.items = memory.items.filter((item) => {
        const key = item.text.trim().toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return memory;
    });
    return NextResponse.json({ memory });
  } catch (error) { return jsonError(error); }
}
