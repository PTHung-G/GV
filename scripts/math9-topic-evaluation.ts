/** Public corpus evaluation. No application DB, server, gold-derived boundaries, or paid retries.
 * QUESTION_BANK_PROVIDER_SMOKE=1 QUESTION_BANK_TEST_PORT=<empty postgres port>
 * pnpm exec playwright test --config=docs/evaluations/math9-topic-tree/playwright.config.ts
 */
import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { randomUUID, createHash } from 'node:crypto';
import Module from 'node:module';
import { resolve } from 'node:path';
import { validateBlocks, validateTree, questionHtml } from '../lib/question-bank/validation';
import type { SourceBlock, BankEnvelope } from '../lib/question-bank/types';
const root = 'docs/evaluations/math9-topic-tree';
const sha = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');

// One paragraph per physical logical text line, including blank/formfeed lines.
// This is deliberately oblivious to question labels and frozen gold boundaries.
function capture(text: string, id: string) {
  let rawHtml = '';
  const blocks: SourceBlock[] = [];
  for (const line of text.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = `<p style="white-space:pre-wrap">${escaped}</p>`;
    const start = rawHtml.length;
    rawHtml += html;
    blocks.push({ start, end: rawHtml.length, html, text: line });
  }
  validateBlocks(rawHtml, blocks);
  return { operationKey: randomUUID(), docId: id, title: `Public mathematics exam ${id}`, rawHtml, blocks, answerKey: null };
}

test('public math9 extraction and incremental topic organization (retained evidence)', async () => {
  test.setTimeout(720_000);
  if (process.env.QUESTION_BANK_PROVIDER_SMOKE !== '1') throw new Error('Explicit provider authorization flag required');
  const port = Number(process.env.QUESTION_BANK_TEST_PORT);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Explicit disposable PostgreSQL port required');
  // Read frozen gold before any outputs. Its contents never enter capture or service inputs.
  const gold = readFileSync(`${root}/independent-gold.md`, 'utf8');
  const freeze = readFileSync(`${root}/gold-freeze.sha256`, 'utf8').trim();
  expect(sha(gold)).toBe(freeze.split(/\s+/)[0]);
  const manifestRaw = readFileSync(`${root}/source-manifest.json`, 'utf8');
  const manifest = JSON.parse(manifestRaw);
  for (const s of manifest.sources) {
    expect(sha(readFileSync(s.original_path))).toBe(s.sha256);
    expect(sha(readFileSync(s.exam_only_path))).toBe(s.exam_only_sha256);
  }
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = /^\s*(AI_API_KEY|AI_BASE_URL|AI_MODEL)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m || m[1] in process.env) continue;
    process.env[m[1]] = m[2].replace(/^(["'])(.*)\1$/, '$2');
  }
  if (!process.env.AI_API_KEY) throw new Error('Configured real provider required');
  const database = process.env.QUESTION_BANK_TEST_DATABASE ?? 'postgres';
  if (!/^(?:postgres|math9_final_[0-9]+)$/.test(database)) throw new Error('Invalid disposable database');
  process.env.DATABASE_URL = `postgresql://postgres@127.0.0.1:${port}/${database}`;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const pass = process.env.QUESTION_BANK_EVALUATION_PASS ?? 'final-pass';
  if (!['first-pass', 'final-pass'].includes(pass)) throw new Error('Invalid evidence pass');
  const run = `${root}/${pass}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  mkdirSync(run); // Never overwrite a prior run.
  const save = (name: string, value: unknown) => writeFileSync(`${run}/${name}.json`, JSON.stringify(value, null, 2) + '\n');
  const evidence: any = { startedAt: new Date().toISOString(), goldSha256: sha(gold), manifestSha256: sha(manifestRaw), configuredModel: process.env.AI_MODEL ?? null, publicCorpus: true, syntheticOwner: true, calls: [], stages: [], checks: {}, retry: false };
  const originalFetch = globalThis.fetch;
  let closePool: undefined | (() => Promise<void>), ownerId: string | undefined;
  let stage = 'setup';
  try {
    expect((await pool.query("select count(*)::int as n from information_schema.tables where table_schema='public'")).rows[0].n).toBe(0);
    for (const name of readdirSync('db/migrations').filter(n => n.endsWith('.sql')).sort()) await pool.query(readFileSync(`db/migrations/${name}`, 'utf8'));
    ownerId = (await pool.query('insert into users(email,name) values($1,$2) returning id', [`math9-${randomUUID()}@example.test`, 'Synthetic public corpus evaluator'])).rows[0].id;
    globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
      const started = performance.now();
      const entry: any = { stage, startedAt: new Date().toISOString() };
      evidence.calls.push(entry);
      try {
        const response = await originalFetch(...args);
        entry.status = response.status;
        if (response.ok) {
          const body = await response.clone().json().catch(() => null);
          entry.model = body?.model ?? null;
          entry.usage = body?.usage ?? null;
          // Retain full successful public model output, not credentials/headers/URL/request.
          entry.output = body?.choices ?? body?.output ?? null;
        }
        return response;
      } catch { entry.transportError = true; throw new Error('provider_transport_failed'); }
      finally { entry.elapsedMs = Math.round(performance.now() - started); save('telemetry', evidence); }
    };
    // Preload the ESM parser before Playwright's CJS-transformed service graph.
    // Node otherwise hits ERR_VM_MODULE_LINK_FAILURE in require(ESM) linking.
    await import('parse5');
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
    const inputs = new Map<string, ReturnType<typeof capture>>();
    let previous: BankEnvelope | undefined;
    for (const s of manifest.sources) {
      const inputText = readFileSync(s.exam_only_path, 'utf8');
      const input = capture(inputText, s.id);
      writeFileSync(`${run}/${s.id}.input.txt`, inputText);
      writeFileSync(`${run}/${s.id}.input.html`, input.rawHtml);
      save(`${s.id}.input`, { ...input, inputSha256: sha(inputText), rawHtmlSha256: sha(input.rawHtml), originalPdfSha256: s.sha256, rawExtractedSha256: sha(readFileSync(s.extracted_path)) });
      const saved = await store.saveSource(ownerId!, input);
      inputs.set(saved.value, input);
      stage = `extract:${s.id}`;
      let started = performance.now();
      const extracted = await ai.processBank(ownerId!, 'extract', saved.value);
      save(`${s.id}.extracted-bank`, extracted);
      const source = extracted.bank.sources.find(x => x.id === saved.value)!;
      const result: any = { source: s.id, blockCount: input.blocks.length, extractionStatus: source.status, candidates: source.candidates.length, extractionMs: Math.round(performance.now() - started) };
      evidence.stages.push(result);
      if (source.status !== 'review') { result.failure = 'extraction_failed_no_retry'; continue; }
      const confirmation = { sourceId: source.id, previewVersion: source.previewVersion, candidateIds: source.candidates.map(c => c.id) };
      await store.confirmSource(ownerId!, confirmation);
      const once = await store.readBank(ownerId!);
      await store.confirmSource(ownerId!, confirmation);
      expect((await store.readBank(ownerId!)).bank.questions).toEqual(once.bank.questions);
      save(`${s.id}.confirmed-bank`, once);
      stage = `organize:${s.id}`;
      started = performance.now();
      const organized = await ai.processBank(ownerId!, 'organize');
      result.organizationMs = Math.round(performance.now() - started);
      result.organizationStatus = organized.bank.organization.status;
      save(`${s.id}.organized-bank`, organized);
      validateTree(organized.bank.nodes, organized.bank.questions);
      if (previous) {
        for (const old of previous.bank.sources) expect(organized.bank.sources.find(x => x.id === old.id)).toEqual(old);
        for (const old of previous.bank.questions) expect({ ...organized.bank.questions.find(q => q.id === old.id), topicId: old.topicId }).toEqual(old);
      }
      previous = organized;
      save('telemetry', evidence);
    }
    await closePool!();
    const final = await store.readBank(ownerId!);
    save('final-bank', final);
    if (previous) expect(final.bank).toEqual(previous.bank);
    const review = final.bank.questions.map(q => {
      const source = final.bank.sources.find(s => s.id === q.sourceId)!;
      const path: string[] = [];
      let node = final.bank.nodes.find(n => n.id === q.topicId);
      while (node) { path.unshift(node.label); node = final.bank.nodes.find(n => n.id === node!.parentId); }
      return { id: q.id, source: source.docId, label: q.label, path, bodyBlockIds: q.bodyBlockIds, contextBlockIds: q.contextBlockIds, html: questionHtml(source, q), text: [...new Set([...q.bodyBlockIds, ...q.contextBlockIds])].sort((a,b) => a-b).map(id => source.blocks[id].text).join('') };
    });
    save('question-review', review);
    const coverage = final.bank.sources.map(source => {
      const input = inputs.get(source.id)!;
      expect(source.rawHtml).toBe(input.rawHtml);
      expect(source.blocks).toEqual(input.blocks);
      const qs = final.bank.questions.filter(q => q.sourceId === source.id);
      const body = qs.flatMap(q => q.bodyBlockIds);
      expect(new Set(body).size).toBe(body.length);
      return { source: source.docId, questions: qs.length, rawAndBlocksExact: true, duplicateBodyIds: body.length - new Set(body).size, unreferencedBlocks: source.blocks.map((b,id) => ({ id, text: b.text })).filter(b => !qs.some(q => [...q.bodyBlockIds,...q.contextBlockIds].includes(b.id))) };
    });
    const ignoredReview = evidence.calls.filter((c: any) => c.stage.startsWith('extract:')).map((c: any) => {
      const text = c.output?.[0]?.message?.content;
      let output: any;
      try { output = JSON.parse(text?.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')); } catch { return { stage: c.stage, parseable: false }; }
      const source = final.bank.sources.find(s => `extract:${s.docId}` === c.stage)!;
      return { stage: c.stage, ignoredBlocks: (output.ignoredBlockIds ?? []).map((id: number) => ({ id, text: source.blocks[id]?.text, html: source.blocks[id]?.html })) };
    });
    save('ignored-block-review', ignoredReview);
    expect(sha(readFileSync(`${root}/independent-gold.md`))).toBe(sha(gold));
    expect(sha(readFileSync(`${root}/source-manifest.json`))).toBe(sha(manifestRaw));
    save('coverage', coverage);
    evidence.checks = { hashVerification: true, exactRawAndBlocks: true, nonduplicatedBodies: true, confirmationIdempotent: true, durableReload: true, treeValid: true, incrementalOldContentStable: true };
    evidence.outcome = evidence.stages.every((s: any) => s.extractionStatus === 'review' && s.organizationStatus === 'complete') ? 'pipeline_completed_semantic_review_required' : 'pipeline_failed';
    expect(evidence.stages).toHaveLength(manifest.sources.length);
    expect(evidence.outcome, 'Do not mark failed extraction/organization as a passing pipeline test').toBe('pipeline_completed_semantic_review_required');
  } catch (error) {
    evidence.outcome = 'failed';
    evidence.failure = { stage, name: error instanceof Error ? error.name : 'unknown', code: typeof (error as any)?.code === 'string' ? (error as any).code : null };
    throw new Error('Public evaluation failed; inspect sanitized retained evidence; no paid retry.');
  } finally {
    globalThis.fetch = originalFetch;
    await closePool?.();
    if (ownerId) await pool.query('delete from users where id=$1 and email like $2', [ownerId, 'math9-%@example.test']);
    await pool.end();
    evidence.finishedAt = new Date().toISOString();
    save('telemetry', evidence);
    console.log(`Public evaluation evidence: ${run}`);
  }
});
