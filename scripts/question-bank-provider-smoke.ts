/** Run with Playwright, one worker and NO webServer. Set QUESTION_BANK_TEST_PORT to a
 * fresh, empty, disposable local PostgreSQL (never the application's database).
 * Config: { testDir: '<repo>/scripts', testMatch: 'question-bank-provider-smoke.ts',
 * workers: 1, timeout: 480000 }. Save this temporary config in scripts/ and run
 * pnpm exec playwright test --config=scripts/<temporary-config>.ts.
 * Explicit paid-provider opt-in: QUESTION_BANK_PROVIDER_SMOKE=1.
 */
import { expect, test } from '@playwright/test';
import { Pool } from 'pg';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { randomUUID, createHash } from 'node:crypto';
import Module from 'node:module';
import { resolve } from 'node:path';
import { questionHtml, validateBlocks, validateTree } from '../lib/question-bank/validation';
import type { BankEnvelope, SourceBlock } from '../lib/question-bank/types';

// The corpus is synthetic, a single article, with balanced child elements. Scan
// nesting rather than splitting at closing tags: figure/SVG/path/text stays whole.
function fixture(name: string) {
  const rawHtml = readFileSync(`.specify/assessments/topic-question-bank/${name}`, 'utf8');
  const open = rawHtml.indexOf('>') + 1;
  if (!rawHtml.startsWith('<article>') || !rawHtml.trimEnd().endsWith('</article>')) throw new Error('Unexpected synthetic fixture wrapper');
  const close = rawHtml.lastIndexOf('</article>');
  const tokens = /<!--[\s\S]*?-->|<\/?([a-z][a-z0-9:-]*)\b[^>]*>/gi;
  const voids = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const blocks: SourceBlock[] = [];
  let depth = 0, start = -1;
  tokens.lastIndex = open;
  for (let match; (match = tokens.exec(rawHtml)) && match.index < close;) {
    if (!match[1]) continue;
    const closing = match[0].startsWith('</');
    const self = /\/\s*>$/.test(match[0]) || voids.has(match[1].toLowerCase());
    if (depth === 0 && !closing) start = match.index;
    if (closing) depth--; else if (!self) depth++;
    if (depth < 0) throw new Error('Unbalanced synthetic fixture');
    if (depth === 0 && start >= 0) {
      const end = tokens.lastIndex, html = rawHtml.slice(start, end);
      blocks.push({ start, end, html, text: html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() });
      start = -1;
    }
  }
  if (depth !== 0) throw new Error('Unbalanced synthetic fixture');
  validateBlocks(rawHtml, blocks);
  return { operationKey: randomUUID(), docId: name, title: `Synthetic provider smoke ${name}`, rawHtml, blocks, answerKey: null };
}

test('configured real provider retains ten synthetic questions through two incremental batches', async () => {
  test.skip(process.env.QUESTION_BANK_PROVIDER_SMOKE !== '1', 'Explicit paid-provider opt-in required');
  test.setTimeout(480_000);
  const port = Number(process.env.QUESTION_BANK_TEST_PORT);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Explicit disposable QUESTION_BANK_TEST_PORT required');
  // Load provider keys ONLY; never import or print the application database URL.
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const match = /^\s*(AI_API_KEY|AI_BASE_URL|AI_MODEL)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match || match[1] in process.env) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
  if (!process.env.AI_API_KEY) throw new Error('Configured real AI provider required; offline is forbidden');
  process.env.DATABASE_URL = `postgresql://postgres@127.0.0.1:${port}/postgres`;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const evidence: Record<string, any> = { startedAt: new Date().toISOString(), syntheticOnly: true, storage: 'dedicated disposable PostgreSQL', outcome: 'failed', calls: [], batches: [] };
  const originalFetch = globalThis.fetch;
  let ownerId: string | undefined;
  let closePool: undefined | (() => Promise<void>);
  try {
    const existing = await pool.query("select count(*)::int as count from information_schema.tables where table_schema='public'");
    if (existing.rows[0].count !== 0) throw new Error('Refusing populated database');
    for (const name of readdirSync('db/migrations').filter(n => n.endsWith('.sql')).sort()) await pool.query(readFileSync(`db/migrations/${name}`, 'utf8'));
    ownerId = (await pool.query('insert into users(email,name) values($1,$2) returning id', [`provider-smoke-${randomUUID()}@example.test`, 'Synthetic provider smoke'])).rows[0].id;
    // Observe actual transport only; never replace provider responses or log headers,
    // request bodies, endpoint URLs, API keys, or provider error bodies.
    globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
      const started = performance.now();
      const entry: Record<string, unknown> = {};
      evidence.calls.push(entry);
      try {
        const response = await originalFetch(...args);
        entry.status = response.status;
        if (response.ok) {
          const body = await response.clone().json().catch(() => null);
          entry.model = body?.model ?? null;
          const usage = body?.usage;
          entry.usage = usage ? Object.fromEntries(Object.entries(usage).filter(([key, value]) => /tokens/.test(key) && typeof value === 'number')) : null;
        }
        return response;
      } catch { entry.transportError = true; throw new Error('provider_transport_failed'); }
      finally { entry.elapsedMs = Math.round(performance.now() - started); }
    };
    // Playwright transpiles dynamic TS dependencies, but CJS resolution does not
    // apply Next's @/ alias in all versions. Scope an exact repository alias hook
    // to this isolated worker and restore it immediately after loading services.
    const resolver = Module as unknown as { _resolveFilename: (name: string, ...rest: any[]) => string };
    const originalResolve = resolver._resolveFilename;
    resolver._resolveFilename = function(name, ...rest) { return originalResolve.call(this, name.startsWith('@/') ? resolve(process.cwd(), name.slice(2)) : name, ...rest); };
    let store: typeof import('../lib/server/question-bank-store');
    let ai: typeof import('../lib/server/question-bank-ai');
    try {
      store = await import('../lib/server/question-bank-store');
      ai = await import('../lib/server/question-bank-ai');
      ({ closePool } = await import('../lib/server/db'));
    } finally { resolver._resolveFilename = originalResolve; }
    const originals = new Map<string, ReturnType<typeof fixture>>();
    let previous: BankEnvelope | undefined;
    for (const [name, count] of [['round4-batch-a.html', 6], ['round4-batch-b.html', 4]] as const) {
      const input = fixture(name);
      const saved = await store.saveSource(ownerId!, input);
      originals.set(saved.value, input);
      const started = performance.now();
      evidence.stage = `extract:${name}`;
      const extracted = await ai.processBank(ownerId!, 'extract', saved.value);
      const source = extracted.bank.sources.find(s => s.id === saved.value)!;
      evidence.batches.push({ fixture: name, sha256: createHash('sha256').update(input.rawHtml).digest('hex'), blockCount: input.blocks.length, extractionStatus: source.status, candidates: source.candidates.length, extractionMs: Math.round(performance.now() - started) });
      // No automatic paid retry. Fail honestly and leave bounded evidence.
      expect(source.status, 'Real provider extraction failed; no automatic retry').toBe('review');
      expect(source.candidates).toHaveLength(count);
      const confirmation = { sourceId: source.id, previewVersion: source.previewVersion, candidateIds: source.candidates.map(c => c.id) };
      await store.confirmSource(ownerId!, confirmation);
      const once = await store.readBank(ownerId!);
      await store.confirmSource(ownerId!, confirmation);
      expect((await store.readBank(ownerId!)).bank.questions).toEqual(once.bank.questions);
      evidence.stage = `organize:${name}`;
      const organized = await ai.processBank(ownerId!, 'organize');
      evidence.batches.at(-1).organizationStatus = organized.bank.organization.status;
      expect(organized.bank.organization.status, 'Real provider organization failed; no automatic retry').toBe('complete');
      validateTree(organized.bank.nodes, organized.bank.questions);
      if (previous) {
        expect(organized.bank.sources[0]).toEqual(previous.bank.sources[0]);
        for (const old of previous.bank.questions) {
          const current = organized.bank.questions.find(q => q.id === old.id)!;
          expect({ ...current, topicId: old.topicId }).toEqual(old);
        }
      }
      previous = organized;
    }
    // Close/reopen the service pool to force a durable reload, not an in-memory read.
    await closePool!();
    const reloaded = await store.readBank(ownerId!);
    expect(reloaded.bank.questions).toHaveLength(10);
    expect(reloaded.bank).toEqual(previous!.bank);
    for (const source of reloaded.bank.sources) {
      const original = originals.get(source.id)!;
      expect(source.rawHtml).toBe(original.rawHtml);
      expect(source.blocks).toEqual(original.blocks);
      expect(source.answerKey).toBeNull();
      const questions = reloaded.bank.questions.filter(q => q.sourceId === source.id);
      const bodyIds = questions.flatMap(q => q.bodyBlockIds);
      expect(new Set(bodyIds).size).toBe(bodyIds.length);
      for (const question of questions) {
        expect(question).toMatchObject({ answer: null, rubric: null, points: null, organized: true });
        const ids = [...new Set([...question.bodyBlockIds, ...question.contextBlockIds])].sort((a, b) => a - b);
        expect(questionHtml(source, question)).toBe(ids.map(id => original.blocks[id].html).join(''));
      }
      // Every exact source component is retained and materializes at least once.
      for (const [id, block] of source.blocks.entries()) expect(questions.some(q => [...q.bodyBlockIds, ...q.contextBlockIds].includes(id) && questionHtml(source, q).includes(block.html))).toBeTruthy();
      const first = questions.find(q => q.bodyBlockIds.some(id => /<strong>Câu 1\./.test(source.blocks[id].html)))!;
      expect(first).toBeTruthy();
      if (source.docId.includes('batch-b')) {
        const figure = source.blocks.find(b => b.html.startsWith('<figure>'))!.html;
        expect(questionHtml(source, first)).toContain(figure);
        expect(questionHtml(source, first)).toContain('a) Tính BC; b) Tính diện tích');
      } else {
        const shared = source.blocks.find(b => b.html.startsWith('<blockquote>'))!.html;
        for (const n of [1, 2]) {
          const q = questions.find(q => q.bodyBlockIds.some(id => source.blocks[id].html.includes(`<strong>Câu ${n}.`)))!;
          expect(questionHtml(source, q)).toContain(shared);
        }
      }
    }
    validateTree(reloaded.bank.nodes, reloaded.bank.questions);
    evidence.outcome = 'passed';
    evidence.verified = { questions: 10, sources: 2, exactRawHtml: true, exactBlocks: true, deduplicatedBodies: true, sharedPassage: true, completeNestedFigure: true, multipartAndFormulas: true, metadataNull: true, immutablePriorSource: true, durableReload: true, incrementalTreeValid: true, confirmationIdempotent: true };
  } catch (error) {
    evidence.failure = 'Smoke assertion or provider processing failed; inspect sanitized test assertion (no provider details recorded).';
    evidence.failureCode = typeof (error as { code?: unknown })?.code === 'string' ? (error as { code: string }).code : null;
    evidence.failureName = error instanceof Error ? error.name : 'unknown';
    if (error instanceof Error && error.name === 'Error' && 'matcherResult' in error) evidence.assertion = error.message.replace(/\u001b\[[0-9;]*m/g, '').slice(0, 1800);
    if (evidence.calls.length === 0) console.error('Pre-provider setup failure:', evidence.failureName, evidence.failureCode ?? 'setup_or_assertion_failure');
    throw new Error('Real-provider smoke failed; see synthetic provider-smoke.json evidence. No paid processing retry performed.');
  } finally {
    globalThis.fetch = originalFetch;
    await closePool?.();
    if (ownerId) await pool.query('delete from users where id=$1 and email like $2', [ownerId, 'provider-smoke-%@example.test']);
    await pool.end();
    evidence.finishedAt = new Date().toISOString();
    writeFileSync('specs/002-topic-question-bank/provider-smoke.json', JSON.stringify(evidence, null, 2) + '\n');
  }
});
