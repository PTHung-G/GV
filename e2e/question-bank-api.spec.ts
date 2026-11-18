import { expect, request, test, type APIRequestContext } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';

/** Opt-in only: target must be a coordinated test server with matching cleanup DB.
 * Never load .env.local automatically or infer a production target. No provider
 * calls: extraction requests exclusively reference another owner's source.
 */
const baseURL = process.env.QUESTION_BANK_API_TEST_URL;
const databaseURL = process.env.QUESTION_BANK_API_TEST_DATABASE_URL;
const prefix = `bank-test-${randomUUID()}`;
const accounts: Array<{ id: string; email: string; api: APIRequestContext }> = [];
let guest: APIRequestContext;
let pool: Pool;
function snapshot(ownerId: string) {
  const rawHtml = '<p>Synthetic shared passage only.</p><p>Câu 1. Tính $2+2$.</p>';
  const cut = rawHtml.indexOf('<p>Câu');
  return { ownerId, operationKey: randomUUID(), docId: 'synthetic-http-only', title: 'Synthetic HTTP owner boundary', rawHtml, blocks: [{ start: 0, end: cut, html: rawHtml.slice(0, cut), text: 'Synthetic shared passage only.' }, { start: cut, end: rawHtml.length, html: rawHtml.slice(cut), text: 'Câu 1. Tính $2+2$.' }], answerKey: null };
}

test.describe('question bank real HTTP authentication and owner boundaries', () => {
  test.skip(!baseURL || !databaseURL, 'Requires coordinated QUESTION_BANK_API_TEST_URL and matching QUESTION_BANK_API_TEST_DATABASE_URL');
  test.describe.configure({ mode: 'serial' });
  test.beforeAll(async () => {
    const target = new URL(baseURL!);
    if (!['127.0.0.1', 'localhost'].includes(target.hostname)) throw new Error('Only explicit loopback test application allowed');
    pool = new Pool({ connectionString: databaseURL! });
    const options = { baseURL: baseURL!.replace(/\/$/, '') + '/', extraHTTPHeaders: { origin: target.origin } };
    guest = await request.newContext(options);
    for (const suffix of ['a', 'b']) {
      const api = await request.newContext(options);
      const email = `${prefix}-${suffix}@example.test`;
      try {
        const response = await api.post('api/auth/register', { data: { email, password: `Synthetic-${randomUUID()}`, name: 'Synthetic bank HTTP' } });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(typeof body.user.id).toBe('string');
        accounts.push({ id: body.user.id, email, api });
        // Prove this explicit cleanup DB matches the target BEFORE writing sources.
        const own = await pool.query('select id from users where id=$1 and email=$2', [body.user.id, email]);
        expect(own.rowCount, 'Explicit cleanup DB must match application server').toBe(1);
      } catch (error) { await api.dispose(); throw error; }
    }
  });
  test.afterAll(async () => {
    for (const account of accounts) {
      // Exact ID + exact per-run email guard; cascades remove only own synthetic data.
      if (account.email.startsWith(`${prefix}-`) && account.email.endsWith('@example.test')) await pool.query('delete from users where id=$1 and email=$2', [account.id, account.email]);
      await account.api.dispose();
    }
    await guest?.dispose();
    await pool?.end();
  });
  test('guest cannot read or mutate any bank resource', async () => {
    for (const path of ['api/question-bank', `api/question-bank/sources/${randomUUID()}`]) expect((await guest.get(path)).status()).toBe(401);
    for (const path of ['sources', 'confirm', 'process']) expect((await guest.post(`api/question-bank/${path}`, { data: { ownerId: randomUUID(), kind: 'extract', sourceId: randomUUID() } })).status()).toBe(401);
  });
  test('two registered cookie contexts isolate bank, source GET, confirm, and foreign extraction', async () => {
    const [a, b] = accounts;
    const saved: Array<{ sourceId: string; rawHtml: string }> = [];
    for (const owner of [a, b]) {
      const input = snapshot(owner.id);
      const response = await owner.api.post('api/question-bank/sources', { data: input });
      expect(response.status()).toBe(200);
      expect(response.headers()['cache-control']).toContain('no-store');
      const envelope = await response.json();
      expect(envelope.ownerId).toBe(owner.id);
      expect(envelope.bank.sources).toHaveLength(1);
      expect(envelope.bank.sources[0]).toMatchObject({ rawHtml: input.rawHtml, status: 'pending', candidates: [] });
      saved.push({ sourceId: envelope.sourceId, rawHtml: input.rawHtml });
    }
    for (const [index, owner] of [a, b].entries()) {
      const own = saved[index], foreign = saved[1 - index];
      const bank = await owner.api.get('api/question-bank');
      expect(bank.status()).toBe(200);
      expect(bank.headers()['cache-control']).toContain('no-store');
      expect((await bank.json()).bank.sources.map((s: { id: string }) => s.id)).toEqual([own.sourceId]);
      const source = await owner.api.get(`api/question-bank/sources/${own.sourceId}`);
      expect(source.status()).toBe(200);
      expect((await source.json()).source.rawHtml).toBe(own.rawHtml);
      expect((await owner.api.get(`api/question-bank/sources/${foreign.sourceId}`)).status()).toBe(404);
      for (const [path, data] of [
        ['confirm', { sourceId: foreign.sourceId, previewVersion: 'synthetic', candidateIds: ['candidate-1'] }],
        ['process', { sourceId: foreign.sourceId, kind: 'extract' }],
      ] as const) {
        const response = await owner.api.post(`api/question-bank/${path}`, { data: { ownerId: owner.id, ...data } });
        expect(response.status()).toBe(404);
        expect((await response.json()).code).toBe('source_not_found');
      }
      // Pending own source does not become confirmed via arbitrary candidate IDs.
      expect((await owner.api.post('api/question-bank/confirm', { data: { ownerId: owner.id, sourceId: own.sourceId, previewVersion: 'stale', candidateIds: ['candidate-1'] } })).status()).toBe(409);
    }
    const aSource = saved[0];
    for (const path of ['sources', 'confirm', 'process']) {
      for (const ownerId of [b.id, undefined]) {
        const data = path === 'sources' ? { ...snapshot(a.id), ownerId } : { ownerId, kind: 'extract', sourceId: aSource.sourceId, previewVersion: 'synthetic', candidateIds: ['candidate-1'] };
        const response = await a.api.post(`api/question-bank/${path}`, { data });
        expect(response.status()).toBe(409);
        expect((await response.json()).code).toBe('account_changed');
      }
    }
    // Same-origin and malformed-origin validation happens before any provider call.
    for (const origin of ['https://foreign.example.test', 'not-a-valid-origin']) expect((await a.api.post('api/question-bank/process', { headers: { origin }, data: { ownerId: a.id, kind: 'extract', sourceId: saved[1].sourceId } })).status()).toBe(403);
    for (const owner of [a, b]) {
      const bank = (await (await owner.api.get('api/question-bank')).json()).bank;
      expect(bank.sources).toHaveLength(1);
      expect(bank.sources[0]).toMatchObject({ status: 'pending', attempts: 0, candidates: [] });
      expect(bank.questions).toEqual([]);
    }
  });
});
