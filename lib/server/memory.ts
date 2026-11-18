/** Account-private AI preferences. Never imports the former shared JSON file. */
import { randomUUID } from 'node:crypto';
import { queryOne, withTransaction } from './db';

export type MemoryItem = { id: string; text: string; deleted?: boolean; createdAt: number };
export type Memory = { items: MemoryItem[]; useMemory: boolean };

type MemoryRow = { items: MemoryItem[]; use_memory: boolean };
const emptyMemory = (): Memory => ({ items: [], useMemory: true });
function requireOwner(userId: string): void {
  if (typeof userId !== 'string' || !userId.trim()) throw new Error('Memory requires an explicit userId.');
}

export async function readMemory(userId: string): Promise<Memory> {
  requireOwner(userId);
  const row = await queryOne<MemoryRow>('select items, use_memory from ai_memories where owner_id = $1', [userId]);
  return row ? { items: row.items, useMemory: row.use_memory } : emptyMemory();
}

/**
 * Serialize updates for this owner, including concurrent first writes. The
 * callback receives the latest committed state UNDER the row lock; callers must
 * not read a snapshot outside this transaction and replace it later.
 */
export async function writeMemory(userId: string, update: (memory: Memory) => Memory): Promise<Memory> {
  requireOwner(userId);
  return withTransaction(async (client) => {
    await client.query('insert into ai_memories (owner_id) values ($1) on conflict (owner_id) do nothing', [userId]);
    const { rows } = await client.query<MemoryRow>('select items, use_memory from ai_memories where owner_id = $1 for update', [userId]);
    const memory = update({ items: rows[0].items, useMemory: rows[0].use_memory });
    if (!Array.isArray(memory.items) || typeof memory.useMemory !== 'boolean') throw new Error('Invalid memory update.');
    await client.query('update ai_memories set items = $2::jsonb, use_memory = $3, updated_at = now() where owner_id = $1',
      [userId, JSON.stringify(memory.items), memory.useMemory]);
    return memory;
  });
}

export function newItem(text: string): MemoryItem {
  return { id: randomUUID(), text: text.trim(), createdAt: Date.now() };
}
export function activeItems(memory: Memory): MemoryItem[] {
  return memory.items.filter((i) => !i.deleted);
}
export function memoryPrompt(memory: Memory): string {
  if (!memory.useMemory) return '';
  const items = activeItems(memory).slice(0, 40);
  if (!items.length) return '';
  return `Ghi nhớ về giáo viên (áp dụng mặc định cho mọi đề):\n${items.map((i) => `- ${i.text}`).join('\n')}`;
}
export const REMEMBER_HINT = /(nhớ|từ (giờ|nay|lần sau)|lần sau|về sau|mặc định|luôn luôn|lúc nào cũng)/i;
