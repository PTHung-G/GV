import { expect, test } from '@playwright/test';
import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { emptyBank, type BankQuestion, type BankSource } from '../../lib/question-bank/types';
import { selectContext } from '../../lib/server/question-bank-ai';

// Explicit opt-in port only. Never infer a URL from app configuration or .env.
const port = process.env.QUESTION_BANK_TEST_PORT;
const originalEnv = { DATABASE_URL: process.env.DATABASE_URL, AI_API_KEY: process.env.AI_API_KEY, AI_BASE_URL: process.env.AI_BASE_URL, AI_MODEL: process.env.AI_MODEL };
let pool: Pool;
let store: typeof import('../../lib/server/question-bank-store');
let ai: typeof import('../../lib/server/question-bank-ai');
let db: typeof import('../../lib/server/db');
const reply = { questions: [{ label: 'Câu 1', bodyBlockIds: [1], contextBlockIds: [0] }, { label: 'Câu 2', bodyBlockIds: [2], contextBlockIds: [0] }] };
let respond: (res: ServerResponse, request: Record<string, unknown>) => void;
const server = createServer(async (req, res) => {
  let body = '';
  for await (const part of req) body += String(part);
  respond(res, JSON.parse(body));
});
function json(res: ServerResponse, value: unknown = reply) {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ model: 'synthetic-local', choices: [{ message: { content: JSON.stringify(value) } }] }));
}
function snapshot(operationKey: string = randomUUID(), suffix = '') {
  const pieces = ['<p>Đoạn chung: vận tốc tổng hợp.</p>', `<p>Câu 1. Tính quãng đường ${suffix}.</p>`, '<p>Câu 2. Giải thích vận tốc.</p>'];
  const rawHtml = pieces.join('');
  let start = 0;
  const blocks = pieces.map(html => { const block = { start, end: start + html.length, html, text: html.replace(/<[^>]+>/g, '') }; start += html.length; return block; });
  return { operationKey, docId: 'synthetic-document', title: 'Synthetic only', rawHtml, blocks, answerKey: null };
}
async function owner() {
  return (await pool.query('insert into users(email,name) values($1,$2) returning id', [`${randomUUID()}@example.test`, 'Synthetic bank test'])).rows[0].id as string;
}
async function reviewed(ownerId: string) {
  const saved = await store.saveSource(ownerId, snapshot());
  const processed = await ai.processBank(ownerId, 'extract', saved.value);
  expect(processed.bank.sources[0].status).toBe('review');
  const source = processed.bank.sources[0];
  return { source, input: { sourceId: source.id, previewVersion: source.previewVersion, candidateIds: source.candidates.map(c => c.id) } };
}
async function reviewedAdditional(ownerId: string) {
  const saved = await store.saveSource(ownerId, snapshot());
  const processed = await ai.processBank(ownerId, 'extract', saved.value);
  const source = processed.bank.sources.find(s => s.id === saved.value)!;
  expect(source.status).toBe('review');
  return { sourceId: source.id, previewVersion: source.previewVersion, candidateIds: source.candidates.map(c => c.id) };
}
function holdProvider() {
  let received!: (response: ServerResponse) => void;
  const waiting = new Promise<ServerResponse>(resolve => { received = resolve; });
  respond = res => received(res);
  return waiting;
}

test.describe('question bank disposable PostgreSQL + local synthetic provider', () => {
  test.skip(!port, 'Requires QUESTION_BANK_TEST_PORT for a fresh disposable PostgreSQL database');
  test.describe.configure({ mode: 'default' });
  test.beforeAll(async () => {
    if (!/^\d+$/.test(port ?? '') || Number(port) < 1024 || Number(port) > 65535) throw new Error('Invalid disposable test port');
    pool = new Pool({ host: '127.0.0.1', port: Number(port), user: 'postgres', database: 'postgres', max: 6 });
    const existing = await pool.query("select count(*)::int as count from information_schema.tables where table_schema='public'");
    if (existing.rows[0].count !== 0) throw new Error('Refusing populated database: bank tests require an empty disposable PostgreSQL instance');
    for (const name of readdirSync('db/migrations').filter(name => name.endsWith('.sql')).sort()) await pool.query(readFileSync(`db/migrations/${name}`, 'utf8'));
    process.env.DATABASE_URL = `postgresql://postgres@127.0.0.1:${Number(port)}/postgres`;
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Local synthetic provider missing');
    process.env.AI_API_KEY = 'synthetic-test-key-not-a-secret';
    process.env.AI_BASE_URL = `http://127.0.0.1:${address.port}/v1`;
    process.env.AI_MODEL = 'synthetic-local';
    store = await import('../../lib/server/question-bank-store');
    ai = await import('../../lib/server/question-bank-ai');
    db = await import('../../lib/server/db');
  });
  test.beforeEach(() => { respond = res => json(res); });
  test.afterAll(async () => {
    await db?.closePool();
    await pool?.end();
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
    for (const [key, value] of Object.entries(originalEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  });

  test('native structured source opens review without model extraction and keeps exact scoped dependencies', async () => {
    const id = await owner();
    let calls = 0;
    respond = res => { calls++; json(res); };
    const pieces = ['<h1 data-sdt-block="header">Đề</h1>', '<p data-sdt-block="context">Cho x &gt; 0.</p>', '<p data-sdt-block="body-a">Câu 1. Tính $x^2$.</p>', '<p data-sdt-block="body-b">Câu 2. Chứng minh.</p>'];
    let start = 0;
    const blocks = pieces.map(html => { const block = { start, end: start + html.length, html, text: html.replace(/<[^>]+>/g, '') }; start += html.length; return block; });
    const structure = { version: 1, blocks: ['header', 'context', 'body-a', 'body-b'].map(id => ({ id })), questions: [{ id: 'question-a', label: 'Câu 1', bodyBlockIds: ['body-a'], contextBlockIds: ['context'] }, { id: 'question-b', label: 'Câu 2', bodyBlockIds: ['body-b'], contextBlockIds: [] }] };
    const input = { operationKey: randomUUID(), docId: 'native-doc', title: 'Native', rawHtml: pieces.join(''), blocks, structure };
    const saved = await store.saveSource(id, input);
    const source = saved.envelope.bank.sources[0];
    expect(source).toMatchObject({ status: 'review', attempts: 0, extractionMode: 'native' });
    expect(source.candidates).toEqual([{ id: 'question-a', label: 'Câu 1', bodyBlockIds: [2], contextBlockIds: [1] }, { id: 'question-b', label: 'Câu 2', bodyBlockIds: [3], contextBlockIds: [] }]);
    await ai.processBank(id, 'extract', source.id);
    expect(calls).toBe(0);
    await store.confirmSource(id, { sourceId: source.id, previewVersion: source.previewVersion, candidateIds: ['question-a'] });
    expect((await store.readBank(id)).bank.questions[0]).toMatchObject({ candidateId: 'question-a', answer: null, rubric: null, points: null, contextBlockIds: [1] });
    const changed = structuredClone(structure); changed.questions[0].contextBlockIds = [];
    await expect(store.saveSource(id, { ...input, structure: changed })).rejects.toMatchObject({ status: 409, code: 'operation_conflict' });
    await expect(store.saveSource(id, { ...input, operationKey: randomUUID(), structure: { ...structure, version: 99 } })).rejects.toMatchObject({ status: 400 });
    await expect(store.saveSource(id, { ...input, operationKey: randomUUID(), rawHtml: input.rawHtml.replace('data-sdt-block="body-a"', 'data-sdt-block="forged"') })).rejects.toMatchObject({ status: 400 });
  });

  test('source snapshot is immutable, operation retry is idempotent and changed raw HTML conflicts', async () => {
    const id = await owner();
    const input = snapshot();
    const saved = await store.saveSource(id, input);
    const again = await store.saveSource(id, input);
    expect(again.value).toBe(saved.value);
    expect(again.envelope.bank.sources).toHaveLength(1);
    expect(again.envelope.bank.sources[0]).toMatchObject({ rawHtml: input.rawHtml, blocks: input.blocks, answerKey: null, status: 'pending' });
    await expect(store.saveSource(id, snapshot(input.operationKey, 'changed'))).rejects.toMatchObject({ status: 409, code: 'operation_conflict' });
    input.blocks[0].text = 'client mutation';
    expect((await store.readBank(id)).bank.sources[0].blocks[0].text).not.toBe('client mutation');
  });

  test('same operation key with changed snapshot metadata must conflict, not silently discard changes', async () => {
    const id = await owner();
    const input = snapshot();
    await store.saveSource(id, input);
    await expect(store.saveSource(id, { ...input, title: 'Different title' })).rejects.toMatchObject({ status: 409, code: 'operation_conflict' });
    await expect(store.saveSource(id, { ...input, answerKey: { content: '<p>Explicit synthetic answer</p>', questions: [] } })).rejects.toMatchObject({ status: 409, code: 'operation_conflict' });
  });

  test('concurrent confirms and duplicate selections retain one immutable question per candidate with null missing metadata', async () => {
    const id = await owner();
    const { source, input } = await reviewed(id);
    await Promise.all([store.confirmSource(id, input), store.confirmSource(id, { ...input, candidateIds: [...input.candidateIds, input.candidateIds[0]] })]);
    const bank = (await store.readBank(id)).bank;
    expect(bank.questions).toHaveLength(2);
    expect(new Set(bank.questions.map(q => q.candidateId)).size).toBe(2);
    expect(bank.sources[0].confirmedIds).toHaveLength(2);
    for (const question of bank.questions) expect(question).toMatchObject({ sourceId: source.id, topicId: 'root', answer: null, rubric: null, points: null });
    const ids = bank.questions.map(q => q.id);
    await store.confirmSource(id, input);
    expect((await store.readBank(id)).bank.questions.map(q => q.id)).toEqual(ids);
    await expect(store.confirmSource(id, { ...input, previewVersion: 'stale' })).rejects.toMatchObject({ status: 409, code: 'preview_changed' });
  });

  test('new document version does not overwrite retained original or confirmed questions', async () => {
    const id = await owner();
    const first = await reviewed(id);
    await store.confirmSource(id, first.input);
    const before = await store.readBank(id);
    const next = await store.saveSource(id, snapshot(randomUUID(), 'version two'));
    expect(next.value).not.toBe(first.source.id);
    const after = await store.readBank(id);
    expect(after.bank.sources).toHaveLength(2);
    expect(after.bank.sources[0]).toEqual(before.bank.sources[0]);
    expect(after.bank.questions).toEqual(before.bank.questions);
  });

  test('owners remain isolated for reads, extraction, confirmation and operation keys', async () => {
    const a = await owner(); const b = await owner();
    const { source, input } = await reviewed(a);
    expect((await store.readBank(b)).bank.sources).toEqual([]);
    await expect(store.confirmSource(b, input)).rejects.toMatchObject({ status: 404, code: 'source_not_found' });
    await expect(ai.processBank(b, 'extract', source.id)).rejects.toMatchObject({ status: 404, code: 'source_not_found' });
    const sameKey = await store.saveSource(b, snapshot(source.operationKey));
    expect(sameKey.value).not.toBe(source.id);
    expect((await store.readBank(a)).bank.sources).toHaveLength(1);
  });

  test('concurrent extraction claim is rejected and revision-stale provider result cannot overwrite new source', async () => {
    const id = await owner();
    const saved = await store.saveSource(id, snapshot());
    const waiting = holdProvider();
    const running = ai.processBank(id, 'extract', saved.value);
    const res = await waiting;
    await expect(ai.processBank(id, 'extract', saved.value)).rejects.toMatchObject({ status: 409, code: 'processing_busy' });
    const newer = await store.saveSource(id, snapshot(randomUUID(), 'new version while processing'));
    json(res);
    await running;
    const bank = (await store.readBank(id)).bank;
    expect(bank.sources).toHaveLength(2);
    expect(bank.sources.find(s => s.id === newer.value)?.status).toBe('pending');
    expect(bank.sources[0]).toMatchObject({ status: 'failed', candidates: [], rawHtml: saved.envelope.bank.sources[0].rawHtml });
    expect(bank.sources[0].lease).toBeUndefined();
  });

  test('superseded lease is fenced without clearing replacement lease or publishing stale candidates', async () => {
    const id = await owner();
    const saved = await store.saveSource(id, snapshot());
    const waiting = holdProvider();
    const running = ai.processBank(id, 'extract', saved.value);
    const res = await waiting;
    const token = randomUUID();
    await store.mutateBank(id, bank => { bank.sources[0].lease = { token, until: Date.now() + 60_000 }; });
    json(res);
    await running;
    expect((await store.readBank(id)).bank.sources[0]).toMatchObject({ status: 'processing', candidates: [], lease: { token } });
  });

  test('provider errors preserve raw source, sanitize details and require explicit retry', async () => {
    const id = await owner();
    const saved = await store.saveSource(id, snapshot());
    respond = res => { res.writeHead(400); res.end('SYNTHETIC_PROVIDER_PRIVATE_DETAIL'); };
    const failed = await ai.processBank(id, 'extract', saved.value);
    expect(failed.bank.sources[0]).toMatchObject({ status: 'failed', rawHtml: saved.envelope.bank.sources[0].rawHtml, candidates: [], attempts: 1 });
    expect(failed.bank.sources[0].error).not.toContain('SYNTHETIC_PROVIDER_PRIVATE_DETAIL');
    await expect(ai.processBank(id, 'extract', saved.value)).rejects.toMatchObject({ code: 'retry_required' });
    respond = res => json(res);
    const retried = await ai.processBank(id, 'extract', saved.value, true);
    expect(retried.bank.sources[0]).toMatchObject({ status: 'review', attempts: 2 });
  });

  test('organization moves related old questions, retains other assignments, and includes root composites in completed batches', async () => {
    const id = await owner();
    const first = await reviewed(id);
    await store.confirmSource(id, first.input);
    const old = (await store.readBank(id)).bank.questions;
    respond = (res, request) => {
      const messages = request.messages as Array<{ role: string; content: string }>;
      const supplied = JSON.parse(messages.findLast(m => m.role === 'user')!.content) as { questions: Array<{ id: string }> };
      json(res, { nodes: [{ id: 'root', label: 'Kho', parentId: null }, { id: 'motion', label: 'Chuyển động', parentId: 'root' }], assignments: supplied.questions.map((q, i) => ({ questionId: q.id, topicId: i === 0 ? 'motion' : 'root' })) });
    };
    const organized = await ai.processBank(id, 'organize');
    expect(organized.bank.organization.status).toBe('complete');
    expect(organized.bank.questions.every(q => q.organized)).toBeTruthy();
    expect(organized.bank.questions[1].topicId).toBe('root');
    respond = res => json(res);
    const next = await reviewedAdditional(id);
    await store.confirmSource(id, next);
    respond = (res, request) => {
      const messages = request.messages as Array<{ role: string; content: string }>;
      const supplied = JSON.parse(messages.findLast(m => m.role === 'user')!.content) as { questions: Array<{ id: string }> };
      expect(supplied.questions.map(q => q.id)).toEqual(Array.from({ length: old.length + 2 }, (_, i) => `Q${i}`));
      json(res, { nodes: [{ id: 'root', label: 'Kho', parentId: null }, { id: 'motion', label: 'Chuyển động', parentId: 'root' }, { id: 'speed', label: 'Vận tốc', parentId: 'motion' }], assignments: supplied.questions.map(q => ({ questionId: q.id, topicId: 'speed' })) });
    };
    const moved = await ai.processBank(id, 'organize');
    expect(moved.bank.questions).toHaveLength(4);
    expect(moved.bank.questions.every(q => q.topicId === 'speed')).toBeTruthy();
    expect(new Set(moved.bank.questions.map(q => q.id)).size).toBe(4);
    expect(moved.bank.organization.status).toBe('complete');
  });

  test('missing assignments cannot commit a partial tree and expired leases cannot publish extraction', async () => {
    const id = await owner();
    const { input } = await reviewed(id);
    await store.confirmSource(id, input);
    const before = await store.readBank(id);
    respond = res => json(res, { nodes: before.bank.nodes, assignments: [] });
    const invalid = await ai.processBank(id, 'organize');
    expect(invalid.bank.organization.status).toBe('failed');
    expect(invalid.bank.questions).toEqual(before.bank.questions);
    const saved = await store.saveSource(id, snapshot());
    const waiting = holdProvider();
    const running = ai.processBank(id, 'extract', saved.value);
    const res = await waiting;
    await store.mutateBank(id, bank => { bank.sources.find(s => s.id === saved.value)!.lease!.until = Date.now() - 1; });
    json(res);
    await running;
    expect((await store.readBank(id)).bank.sources.find(s => s.id === saved.value)).toMatchObject({ status: 'failed', candidates: [] });
  });

  test('invalid AI indices and cyclic topic proposal fail without losing approved content', async () => {
    const id = await owner();
    const { input } = await reviewed(id);
    await store.confirmSource(id, input);
    const before = await store.readBank(id);
    respond = res => json(res, { nodes: [{ id: 'root', label: 'Kho', parentId: null }, { id: 'loop', label: 'Loop', parentId: 'loop' }], assignments: before.bank.questions.map(q => ({ questionId: q.id, topicId: 'loop' })) });
    const result = await ai.processBank(id, 'organize');
    expect(result.bank.organization.status).toBe('failed');
    expect(result.bank.nodes).toEqual(before.bank.nodes);
    expect(result.bank.questions).toEqual(before.bank.questions);
    const another = await store.saveSource(id, snapshot());
    respond = res => json(res, { questions: [{ label: 'Invalid', bodyBlockIds: [999], contextBlockIds: [] }] });
    const failed = await ai.processBank(id, 'extract', another.value);
    expect(failed.bank.sources.find(s => s.id === another.value)).toMatchObject({ status: 'failed', candidates: [] });
  });
});

test('selectContext prioritizes fresh units and related old units deterministically with 200-question cap', () => {
  const bank = emptyBank();
  const input = snapshot();
  bank.sources = [{ ...input, id: 'source', hash: 'synthetic', createdAt: '', status: 'complete', candidates: [], confirmedIds: [], previewVersion: '', attempts: 0 }] as BankSource[];
  const question = (id: string, organized: boolean, label: string): BankQuestion => ({ id, sourceId: 'source', candidateId: id, label, bodyBlockIds: [1], contextBlockIds: [0], topicId: 'root', createdAt: '', answer: null, rubric: null, points: null, organized });
  bank.questions = [question('fresh', false, 'vận tốc'), question('related', true, 'vận tốc vận tốc'), ...Array.from({ length: 220 }, (_, i) => question(`old-${String(i).padStart(3, '0')}`, true, 'other'))];
  const selected = selectContext(bank);
  expect(selected).toHaveLength(200);
  expect(selected.slice(0, 3).map(q => q.id)).toEqual(['fresh', 'related', 'old-000']);
  expect(new Set(selected.map(q => q.id)).size).toBe(200);
});
