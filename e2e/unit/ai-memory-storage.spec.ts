import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { query, closePool } from '../../lib/server/db';
import { readMemory, writeMemory, newItem } from '../../lib/server/memory';

// Real PostgreSQL integration tests; run after migration 0008 with DATABASE_URL.
test.describe('account-private AI memory storage', () => {
  test.skip(!process.env.DATABASE_URL, 'Requires migrated PostgreSQL DATABASE_URL');
  const owners = [randomUUID(), randomUUID()];
  test.beforeAll(async () => {
    for (const id of owners) await query('insert into users(id,email,name) values ($1,$2,$3)', [id, `memory-${id}@example.test`, 'Memory isolation test']);
  });
  test.afterAll(async () => {
    await query('delete from users where id = any($1::uuid[])', [owners]);
    await closePool();
  });
  test('starts empty without importing shared JSON and isolates account data/settings', async () => {
    const [a, b] = owners;
    expect(await readMemory(a)).toEqual({ items: [], useMemory: true });
    expect(await readMemory(b)).toEqual({ items: [], useMemory: true });
    const item = newItem('Only owner A');
    await writeMemory(a, memory => ({ ...memory, items: [item], useMemory: false }));
    expect(await readMemory(b)).toEqual({ items: [], useMemory: true });
    expect(await readMemory(a)).toEqual({ items: [item], useMemory: false });
  });
  test('concurrent inserts including first writes lose neither items nor settings', async () => {
    const id = randomUUID();
    await query('insert into users(id,email,name) values ($1,$2,$3)', [id, `memory-${id}@example.test`, 'Concurrent memory test']);
    try {
      const items = Array.from({ length: 12 }, (_, i) => newItem(`Concurrent ${i}`));
      await Promise.all([
        ...items.map(item => writeMemory(id, memory => { memory.items.push(item); return memory; })),
        writeMemory(id, memory => ({ ...memory, useMemory: false })),
      ]);
      const stored = await readMemory(id);
      expect(stored.items.map(i => i.id).sort()).toEqual(items.map(i => i.id).sort());
      expect(stored.useMemory).toBe(false);
    } finally { await query('delete from users where id = $1', [id]); }
  });
  test('failed mutation rolls back and explicit owner is mandatory', async () => {
    const before = await readMemory(owners[0]);
    await expect(writeMemory(owners[0], memory => { memory.items = []; throw new Error('rollback probe'); })).rejects.toThrow('rollback probe');
    expect(await readMemory(owners[0])).toEqual(before);
    await expect(readMemory('')).rejects.toThrow('explicit userId');
    await expect(writeMemory('', m => m)).rejects.toThrow('explicit userId');
  });
});
