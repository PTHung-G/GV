import { expect, test, type Page } from '@playwright/test';
import { emptyBank, type BankEnvelope, type BankQuestion, type BankSource } from '../lib/question-bank/types';

const ownerId = 'synthetic-bank-owner';
const createdAt = '2026-11-13T12:00:00.000Z';
function syntheticSource(): BankSource {
  const pieces = ['<p>Đoạn chung tổng hợp: vận tốc 2 m/s.</p>', '<p>Câu 1. a) Tính quãng đường. b) Giải thích $x=2$.</p>', '<figure><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="5"></circle></svg><figcaption>Hình chung tổng hợp</figcaption></figure>', '<p>Câu 2. Phân tích chuyển động.</p>'];
  let start = 0;
  const blocks = pieces.map(html => { const block = { start, end: start + html.length, html, text: html.replace(/<[^>]+>/g, '') }; start += html.length; return block; });
  return { id: 'source-synthetic', operationKey: 'operation-synthetic', docId: 'synthetic-doc', title: 'Nguồn tổng hợp synthetic', rawHtml: pieces.join(''), hash: 'abcdef1234567890', blocks, createdAt, status: 'review', candidates: [{ id: 'candidate-1', label: 'Câu 1 synthetic', bodyBlockIds: [1], contextBlockIds: [0, 2] }, { id: 'candidate-2', label: 'Câu 2 synthetic', bodyBlockIds: [3], contextBlockIds: [0, 2] }], previewVersion: 'preview-v1', confirmedIds: [], attempts: 1, answerKey: null };
}
function envelope(): BankEnvelope { return { ownerId, revision: 1, bank: { ...emptyBank(), sources: [syntheticSource()] } }; }
function retained(source: BankSource, candidate = source.candidates[0]): BankQuestion { return { id: `question-${candidate.id}`, sourceId: source.id, candidateId: candidate.id, label: candidate.label, bodyBlockIds: candidate.bodyBlockIds, contextBlockIds: candidate.contextBlockIds, topicId: 'root', createdAt, answer: null, rubric: null, points: null }; }
async function mock(page: Page, state: BankEnvelope, guest = false) {
  const calls: Array<{ path: string; body: Record<string, unknown> }> = [];
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: guest ? null : { id: ownerId, name: 'Synthetic Teacher', email: 'synthetic@example.test', avatarColor: '#0369a1', points: 0 } } }));
  await page.route('**/api/documents', route => route.fulfill({ json: { ownerId, revision: 1, documents: [{ id: 'synthetic-doc', title: 'Đề synthetic', content: '<p>Nội dung server cũ.</p>', createdAt, updatedAt: createdAt, subject: 'toan', grade: 9 }] } }));
  await page.route('**/api/question-bank**', async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (request.method() === 'GET') calls.push({ path, body: {} });
    if (request.method() === 'POST') {
      const body = request.postDataJSON() as Record<string, unknown>;
      calls.push({ path, body });
      expect(body.ownerId).toBe(ownerId);
      if (path.endsWith('/confirm')) {
        const source = state.bank.sources.find(s => s.id === body.sourceId)!;
        for (const id of body.candidateIds as string[]) if (!source.confirmedIds.includes(id)) { source.confirmedIds.push(id); state.bank.questions.push(retained(source, source.candidates.find(c => c.id === id)!)); }
        source.status = 'complete';
      } else if (path.endsWith('/process')) {
        if (body.kind === 'extract') { const source = state.bank.sources.find(s => s.id === body.sourceId)!; source.status = 'review'; delete source.error; }
        else state.bank.organization.status = 'complete';
      } else if (path.endsWith('/sources')) {
        state.bank.sources = [{ ...syntheticSource(), ...body, id: 'source-captured', status: 'pending', candidates: [], answerKey: null } as BankSource];
      }
      state.revision++;
    }
    await route.fulfill({ json: { ...state, ...(path.endsWith('/sources') ? { sourceId: 'source-captured' } : {}) } });
  });
  return calls;
}

test('review preserves shared composite context, selected subset, provenance and reload', async ({ page }) => {
  const state = envelope();
  const calls = await mock(page, state);
  await page.goto('/question-bank?source=source-synthetic');
  await expect(page.getByText('2 câu được chọn')).toBeVisible();
  const preview = page.frameLocator('iframe[title="Kiểm tra Câu 1 synthetic"]');
  await expect(preview.locator('body')).toContainText('Đoạn chung tổng hợp');
  await expect(preview.locator('body')).toContainText('b) Giải thích');
  await expect(preview.locator('figcaption')).toHaveText('Hình chung tổng hợp');
  await expect(preview.locator('circle')).toHaveCount(1);
  await page.getByRole('checkbox', { name: 'Câu 2 synthetic' }).uncheck();
  await page.getByRole('button', { name: 'Duyệt câu đã chọn và sắp xếp' }).click();
  await expect(page.getByText('Đã lưu vào kho', { exact: true })).toHaveCount(1);
  expect(calls.find(c => c.path.endsWith('/confirm'))?.body).toMatchObject({ candidateIds: ['candidate-1'], previewVersion: 'preview-v1' });
  await page.getByRole('button', { name: 'Câu hỏi · 1', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article')).toContainText('Phiên bản abcdef1234');
  await expect(page.locator('article')).toContainText('Nguồn tổng hợp synthetic');
  await page.locator('article summary').filter({ hasText: 'Xem nội dung' }).click();
  await expect(page.frameLocator('iframe[title="Câu hỏi Câu 1 synthetic"]').locator('body')).toContainText('b) Giải thích');
  await page.reload();
  await page.getByRole('button', { name: 'Câu hỏi · 1', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Xem nguồn', exact: true }).click();
  await expect(page.getByText('Nguồn bất biến · Phiên bản', { exact: false })).toBeVisible();
});

test('200-question tree includes self and descendants and searches within two seconds', async ({ page }, info) => {
  const state = envelope();
  state.bank.nodes.push({ id: 'physics', label: 'Vật lý synthetic', parentId: 'root' }, { id: 'motion', label: 'Chuyển động synthetic', parentId: 'physics' }, { id: 'math', label: 'Toán synthetic', parentId: 'root' });
  state.bank.sources[0].status = 'complete';
  state.bank.questions = Array.from({ length: 200 }, (_, i) => ({ ...retained(state.bank.sources[0]), id: `q-${i}`, label: `Câu synthetic ${i}`, topicId: i < 50 ? 'physics' : i < 150 ? 'motion' : 'math' }));
  await mock(page, state);
  await page.goto('/question-bank');
  await expect(page.locator('article')).toHaveCount(200);
  const start = Date.now();
  await page.getByRole('button', { name: 'Vật lý synthetic', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(150);
  await page.getByRole('textbox', { name: 'Tìm câu hỏi theo nội dung hoặc tên nguồn' }).fill('Câu synthetic 149');
  await expect(page.locator('article')).toHaveCount(1);
  const elapsed = Date.now() - start;
  await info.attach('200-question-browse-search-latency', { body: JSON.stringify({ elapsedMs: elapsed, questionCount: 200, includesSelfAndDescendants: true }), contentType: 'application/json' });
  expect(elapsed).toBeLessThanOrEqual(2000);
});

test('guest sees authentication gate and sends no bank requests', async ({ page }) => {
  const state = envelope();
  const calls = await mock(page, state, true);
  await page.goto('/question-bank');
  await expect(page.getByRole('heading', { name: 'Câu hỏi của riêng bạn' })).toBeVisible();
  await expect(page.locator('article')).toHaveCount(0);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).last().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(calls).toEqual([]);
});

test('failed extraction retains source, shows honest status and retries explicitly', async ({ page }) => {
  const state = envelope();
  state.bank.sources[0].status = 'failed';
  state.bank.sources[0].error = 'Chưa hoàn tất xử lý AI. Nguồn synthetic vẫn được giữ.';
  const calls = await mock(page, state);
  await page.goto('/question-bank?source=source-synthetic');
  await expect(page.getByRole('alert').filter({ hasText: 'Nguồn synthetic vẫn được giữ' })).toBeVisible();
  await page.getByRole('button', { name: 'Xem toàn bộ bản gốc' }).click();
  await expect(page.frameLocator('iframe[title="Bản gốc Nguồn tổng hợp synthetic"]').locator('body')).toContainText('Câu 2. Phân tích chuyển động');
  await page.getByRole('button', { name: 'Thử tách lại', exact: true }).click();
  await expect(page.getByText('2 câu được chọn')).toBeVisible();
  expect(calls.find(c => c.path.endsWith('/process'))?.body).toMatchObject({ sourceId: 'source-synthetic', kind: 'extract', retry: true });
});

test('malicious source preview blocks scripts, forms, remote resources and navigation', async ({ page }, info) => {
  const state = envelope();
  state.bank.sources[0].rawHtml = '<p>SAFE_SYNTHETIC_VISIBLE</p><script>parent.document.body.dataset.bankPwned="yes";fetch("https://synthetic-evil.invalid/script")</script><img src="https://synthetic-evil.invalid/image" onerror="parent.document.body.dataset.bankPwned=1"><svg onload="alert(1)"><image href="https://synthetic-evil.invalid/svg"/><use href="https://synthetic-evil.invalid/use"/><circle cx="2" cy="2" r="1" fill="url(https://synthetic-evil.invalid/paint)"/></svg><form action="https://synthetic-evil.invalid/form"><input name="secret"><button>send</button></form><a href="javascript:alert(1)">click</a><iframe src="https://synthetic-evil.invalid/frame"></iframe>';
  await mock(page, state);
  const outbound: string[] = []; const dialogs: string[] = [];
  await page.route('https://synthetic-evil.invalid/**', route => { outbound.push(route.request().url()); return route.abort(); });
  page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.dismiss(); });
  await page.goto('/question-bank?source=source-synthetic');
  await page.getByRole('button', { name: 'Xem toàn bộ bản gốc' }).click();
  const frame = page.frameLocator('iframe[title="Bản gốc Nguồn tổng hợp synthetic"]');
  await expect(frame.locator('body')).toContainText('SAFE_SYNTHETIC_VISIBLE');
  await info.attach('sanitized-preview-html', { body: await frame.locator('body').innerHTML(), contentType: 'text/html' });
  await expect(frame.locator('script, form, iframe, input, a[href]')).toHaveCount(0);
  await expect(frame.locator('[onload], [onerror], [href^="http"], [src^="http"]')).toHaveCount(0);
  await expect(page.locator('iframe[title="Bản gốc Nguồn tổng hợp synthetic"]')).toHaveAttribute('sandbox', '');
  expect(await page.locator('body').getAttribute('data-bank-pwned')).toBeNull();
  expect(outbound).toEqual([]); expect(dialogs).toEqual([]);
  await expect(page).toHaveURL(/question-bank\?source=source-synthetic/);
});

test('editor capture saves current DOM content, exact ranges and not stale server document', async ({ page }) => {
  const state = envelope();
  const calls = await mock(page, state);
  await page.goto('/doc/synthetic-doc');
  const surface = page.locator('#doc-surface');
  await expect(surface).toContainText('Nội dung server cũ');
  await surface.evaluate(el => { el.innerHTML = '<p>ĐOẠN HIỆN TẠI SYNTHETIC</p><p>Câu 1. a) Mới. b) Giữ nguyên.</p><figure><svg viewBox="0 0 2 2"><circle cx="1" cy="1" r="1"></circle></svg><figcaption>Hình hiện tại</figcaption></figure>'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.getByRole('button', { name: 'Chốt và lưu câu hỏi', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Lưu nguồn và tiếp tục' }).click();
  await expect(page).toHaveURL(/question-bank\?source=source-captured/);
  const body = calls.find(c => c.path.endsWith('/sources'))!.body;
  expect(body.rawHtml).toContain('ĐOẠN HIỆN TẠI SYNTHETIC');
  expect(body.rawHtml).not.toContain('Nội dung server cũ');
  expect(body.answerKey).toBeUndefined();
  expect(typeof body.operationKey).toBe('string');
  const blocks = body.blocks as Array<{ start: number; end: number; html: string }>;
  expect(blocks.length).toBeGreaterThan(0);
  for (const block of blocks) expect((body.rawHtml as string).slice(block.start, block.end)).toBe(block.html);
  expect(blocks.map(b => b.html).join('')).toContain('Hình hiện tại');
});
