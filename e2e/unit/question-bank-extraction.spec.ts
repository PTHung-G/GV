import { expect, test } from '@playwright/test';
import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import Module from 'node:module';
import { resolve } from 'node:path';

// No app server, real provider, app configuration, or default database.
test('production extraction fails closed on missing coverage and keeps explicit context scoped', async () => {
  const port = Number(process.env.QUESTION_BANK_TEST_PORT);
  test.skip(!port, 'Requires explicitly isolated PostgreSQL port');
  expect(Number.isInteger(port) && port >= 1024 && port <= 65535).toBe(true);
  const database = 'math9_final_5';
  const env = { DATABASE_URL: process.env.DATABASE_URL, AI_API_KEY: process.env.AI_API_KEY, AI_MODEL: process.env.AI_MODEL };
  process.env.DATABASE_URL = `postgresql://postgres@127.0.0.1:${port}/${database}`;
  process.env.AI_API_KEY = 'synthetic-only';
  process.env.AI_MODEL = 'synthetic-only';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const originalFetch = globalThis.fetch;
  let closePool: undefined | (() => Promise<void>);
  let owner: string | undefined;
  let response: unknown = { questions: [{ label: 'A', bodyBlockIds: [2], contextBlockIds: [1] }] };
  const calls: any[] = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ model: 'synthetic-only', choices: [{ message: { content: JSON.stringify(response) } }] }), { status: 200 });
  };
  try {
    expect((await pool.query("select count(*)::int as n from information_schema.tables where table_schema='public'")).rows[0].n).toBe(0);
    for (const name of readdirSync('db/migrations').filter(n => n.endsWith('.sql')).sort()) await pool.query(readFileSync(`db/migrations/${name}`, 'utf8'));
    await import('parse5');
    const resolver = Module as unknown as { _resolveFilename: (name: string, ...rest: any[]) => string };
    const originalResolve = resolver._resolveFilename;
    let store: typeof import('../../lib/server/question-bank-store');
    let ai: typeof import('../../lib/server/question-bank-ai');
    try {
      resolver._resolveFilename = function(name, ...rest) { return originalResolve.call(this, name.startsWith('@/') ? resolve(process.cwd(), name.slice(2)) : name, ...rest); };
      store = await import('../../lib/server/question-bank-store');
      ai = await import('../../lib/server/question-bank-ai');
      ({ closePool } = await import('../../lib/server/db'));
    } finally { resolver._resolveFilename = originalResolve; }
    owner = (await pool.query('insert into users(email,name) values($1,$2) returning id', [`math9-${randomUUID()}@example.test`, 'Synthetic extraction regression'])).rows[0].id;
    const pieces = ['<p>Exam header</p>', '<p>Shared data</p>', '<p>A dependent parts a and b</p>', '<p>B independent task</p>'];
    let start = 0;
    const blocks = pieces.map(html => { const b = { start, end: start + html.length, html, text: html.replace(/<[^>]*>/g, '') }; start = b.end; return b; });
    const input = { operationKey: randomUUID(), docId: 'synthetic', title: 'Synthetic', rawHtml: pieces.join(''), blocks, answerKey: null };
    const saved = await store!.saveSource(owner!, input);
    const failed = await ai!.processBank(owner!, 'extract', saved.value);
    expect(failed.bank.sources[0]).toMatchObject({ status: 'failed', rawHtml: input.rawHtml, blocks, candidates: [] });
    expect(failed.bank.sources[0].lease).toBeUndefined();
    // Retry is synthetic only; no automatic provider retry or dependency broadcast.
    response = { questions: [
      { label: 'A', bodyBlockIds: [2], contextBlockIds: [1] },
      { label: 'B', bodyBlockIds: [3], contextBlockIds: [] },
    ], ignoredBlockIds: [0] };
    const reviewed = await ai!.processBank(owner!, 'extract', saved.value, true);
    expect(reviewed.bank.sources[0].status).toBe('review');
    expect(reviewed.bank.sources[0].candidates.map(q => q.contextBlockIds)).toEqual([[1], []]);
    expect(calls).toHaveLength(2);
    expect(calls[0].messages[0].content).toContain('ignoredBlockIds');
    expect(calls[0].messages[0].content).toContain('Tách các bài tập độc lập');
    const s = reviewed.bank.sources[0];
    await store!.confirmSource(owner!, { sourceId: s.id, previewVersion: s.previewVersion, candidateIds: s.candidates.map(q => q.id) });
    response = { nodes: [{ id: 'root', label: 'Kho câu hỏi', parentId: null }], assignments: (await store!.readBank(owner!)).bank.questions.map((_q, i) => ({ questionId: `Q${i}`, topicId: 'root' })) };
    expect((await ai!.processBank(owner!, 'organize')).bank.organization.status).toBe('complete');
    expect(calls[2].messages[0].content).toContain('TOÀN BỘ');
    expect(calls[2].messages[0].content).toContain('mỗi cha phải bao hàm mọi con');
    expect(calls[2].max_tokens).toBe(22000);
  } finally {
    globalThis.fetch = originalFetch;
    await closePool?.();
    if (owner) await pool.query('delete from users where id=$1 and email like $2', [owner, 'math9-%@example.test']);
    await pool.end();
    for (const [key, value] of Object.entries(env)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
