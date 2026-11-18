import { test, expect, type Page } from '@playwright/test';
import { validateDocuments } from '../lib/document-library';
import type { ExamDoc } from '../lib/docs-store';
import type { StructuredExam } from '../lib/structured-exam';

const structure: StructuredExam = {
  version: 1, blocks: [{ id: 'block-native-1' }],
  questions: [{ id: 'question-native-1', label: 'Câu 1', bodyBlockIds: ['block-native-1'], contextBlockIds: [] }],
};
const nativeHtml = '<p data-sdt-block="block-native-1"><b>Câu 1.</b> Tính $2+3$.</p>';
const document = (content = '', metadata?: StructuredExam): ExamDoc => ({
  id: 'structured-editor', title: 'Đề cấu trúc', content, structure: metadata, subject: 'toan', grade: 9,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
});

// No provider/database calls: the browser exercises actual editor, math capture,
// account persistence and conversation-reapply components with deterministic APIs.
async function mockEditor(page: Page, initial = document()) {
  let docs = [initial];
  let revision = 0;
  let messages: Array<Record<string, unknown>> = [];
  const user = { id: 'structured-owner', name: 'Teacher', email: 'test@example.test', points: 0, avatarColor: '#000' };
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user } }));
  await page.route('**/api/documents', async route => {
    if (route.request().method() === 'PUT') {
      docs = route.request().postDataJSON().documents;
      revision += 1;
    }
    await route.fulfill({ json: { documents: docs, revision } });
  });
  await page.route('**/api/suggestions', route => route.fulfill({ json: { suggestions: ['Soạn một câu'] } }));
  await page.route('**/api/conversations**', async route => {
    const body = route.request().method() === 'GET' ? null : route.request().postDataJSON();
    if (route.request().method() === 'POST' && body?.turnId) {
      messages = [{ id: body.turnId, role: 'assistant', text: 'Đã soạn xong', status: 'completed',
        payload: { html: nativeHtml, action: 'replace', structure } }];
    }
    if (route.request().method() === 'PATCH' && body?.applied) messages = messages.map(m => ({ ...m, applied: true }));
    await route.fulfill({ json: {
      conversation: { id: 'structured-conversation', docId: initial.id, messages },
      conversations: [{ id: 'structured-conversation', current: true }], history: [],
    } });
  });
  await page.route('**/api/chat-exam/plan', route => route.fulfill({ json: { decision: 'proceed', steps: [], clarifications: [] } }));
  await page.route('**/api/chat-exam/verify', route => route.fulfill({ json: { issues: [] } }));
  await page.route('**/api/chat-exam', route => route.fulfill({ json: {
    success: true, action: 'replace', reply: 'Đã soạn xong', exam: { content: nativeHtml, structure },
  } }));
  return { docs: () => docs, history: (html: string, artifact: StructuredExam | undefined) => {
    messages = [{ id: 'history-turn', role: 'assistant', text: 'Bản nháp đã lưu', status: 'completed', payload: { html, action: 'append', structure: artifact } }];
  } };
}

test('generated identities survive live math/text edits, blur and account reload', async ({ page }) => {
  const state = await mockEditor(page);
  await page.goto(`${process.env.NEXT_BASE_PATH ?? ''}/doc/structured-editor`);
  const ai = page.getByRole('complementary', { name: 'Trợ lý AI' });
  await ai.getByRole('textbox').fill('Soạn một câu');
  await ai.getByRole('button', { name: /^Gửi$/ }).click();
  const surface = page.getByRole('textbox', { name: 'Nội dung đề' });
  await expect(surface.locator('[data-sdt-block]')).toHaveCount(1);
  await surface.locator('[data-sdt-block]').evaluate(el => {
    el.append(' Đã sửa ngay.');
    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  });
  await page.getByRole('textbox', { name: 'Tên đề' }).click();
  await expect.poll(() => state.docs()[0].content).toContain('Đã sửa ngay.');
  expect(state.docs()[0].content).toContain('$2+3$');
  expect(state.docs()[0].content).not.toContain('<math');
  expect(state.docs()[0].structure).toEqual(structure);
  await page.reload();
  await expect(surface).toContainText('Đã sửa ngay.');
  await expect(surface.locator('[data-sdt-block]')).toHaveCount(1);
});

for (const damage of ['duplicate', 'missing', 'unknown', 'template'] as const) {
  test(`unsafe ${damage} edit retains HTML but drops persisted native metadata`, async ({ page }) => {
    const state = await mockEditor(page, document(nativeHtml, structure));
    await page.goto(`${process.env.NEXT_BASE_PATH ?? ''}/doc/structured-editor`);
    const surface = page.getByRole('textbox', { name: 'Nội dung đề' });
    await expect(surface.locator('[data-sdt-block]')).toHaveCount(1);
    await surface.evaluate((el, kind) => {
      const block = el.querySelector('[data-sdt-block]')!;
      if (kind === 'duplicate') el.append(block.cloneNode(true));
      if (kind === 'missing') block.removeAttribute('data-sdt-block');
      if (kind === 'unknown') el.insertAdjacentHTML('beforeend', '<p>Nội dung dán chưa biết.</p>');
      if (kind === 'template') el.innerHTML = '<p>Đề mẫu thay thế.</p>';
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
    }, damage);
    await page.getByRole('textbox', { name: 'Tên đề' }).click();
    await expect.poll(() => state.docs()[0].structure).toBeUndefined();
    expect(state.docs()[0].content).toContain(damage === 'template' ? 'Đề mẫu thay thế.' : 'Câu 1.');
    await page.reload();
    await expect(surface).toContainText(damage === 'template' ? 'Đề mẫu thay thế.' : 'Câu 1.');
  });
}

test('native bank capture freezes current live content and skips extraction, damaged markers explain fallback', async ({ page }) => {
  await mockEditor(page, document(nativeHtml, structure));
  let saved: Record<string, unknown> | undefined;
  const bank = { nodes: [{ id: 'root', label: 'Kho câu hỏi', parentId: null }], sources: [], questions: [], organization: { status: 'complete', attempts: 0 } };
  await page.route('**/api/question-bank**', async route => {
    if (route.request().method() === 'POST') saved = route.request().postDataJSON();
    await route.fulfill({ json: { ownerId: 'structured-owner', revision: 1, bank, sourceId: 'native-saved' } });
  });
  await page.goto('/doc/structured-editor');
  const surface = page.getByRole('textbox', { name: 'Nội dung đề' });
  await expect(surface.locator('[data-sdt-block]')).toHaveCount(1);
  await surface.locator('[data-sdt-block]').evaluate(el => { el.append(' Chỉnh trước khi chốt.'); el.dispatchEvent(new InputEvent('input', { bubbles: true })); });
  await page.getByRole('button', { name: 'Chốt và lưu câu hỏi', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('không gọi AI tách lại');
  await page.getByRole('dialog').getByRole('button', { name: 'Lưu nguồn và tiếp tục' }).click();
  await expect.poll(() => saved?.rawHtml).toContain('Chỉnh trước khi chốt.');
  expect(saved?.structure).toEqual(structure);
  expect(saved?.rawHtml).toContain('$2+3$');
  const blocks = saved!.blocks as Array<{ start: number; end: number; html: string }>;
  for (const block of blocks) expect((saved!.rawHtml as string).slice(block.start, block.end)).toBe(block.html);

  await page.goto('/doc/structured-editor');
  await expect(surface.locator('[data-sdt-block]')).toHaveCount(1);
  await surface.evaluate(el => { el.insertAdjacentHTML('beforeend', '<p>Câu mới chưa có mốc.</p>'); el.dispatchEvent(new InputEvent('input', { bubbles: true })); });
  await page.getByRole('button', { name: 'Chốt và lưu câu hỏi', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Đề chưa có cấu trúc câu hỏi hợp lệ');
  await page.getByRole('dialog').getByRole('button', { name: 'Lưu nguồn và tiếp tục' }).click();
  await expect.poll(() => saved?.rawHtml).toContain('Câu mới chưa có mốc.');
  expect(saved?.structure).toBeUndefined();
});

test('arbitrary recovery discards bad metadata while strict submitted documents reject it', () => {
  const stale = document('<p>Current imported HTML</p>', structure);
  expect(() => validateDocuments([stale])).toThrow();
  expect(validateDocuments([stale], { strictStructure: false })[0]).toMatchObject({ content: stale.content, structure: undefined });
  const malformed = { ...document(nativeHtml), structure: { version: 999 } };
  expect(() => validateDocuments([malformed])).toThrow();
  expect(validateDocuments([malformed], { strictStructure: false })[0].content).toBe(nativeHtml);
});

for (const collision of [false, true]) {
  test(`history append uses a top-level boundary and ${collision ? 'rejects colliding' : 'combines disjoint'} identities`, async ({ page }) => {
    const state = await mockEditor(page, document(nativeHtml, structure));
    const incoming = collision ? structure : {
      version: 1 as const, blocks: [{ id: 'block-native-2' }],
      questions: [{ id: 'question-native-2', label: 'Câu 2', bodyBlockIds: ['block-native-2'], contextBlockIds: [] }],
    };
    state.history(collision ? nativeHtml : nativeHtml.replaceAll('block-native-1', 'block-native-2').replace('Câu 1.', 'Câu 2.'), incoming);
    await page.goto(`${process.env.NEXT_BASE_PATH ?? ''}/doc/structured-editor`);
    const surface = page.getByRole('textbox', { name: 'Nội dung đề' });
    await expect(surface.locator('[data-sdt-block]')).toHaveCount(1);
    // Leave the caret inside the question: append must not nest generated blocks.
    await surface.locator('b').click();
    await page.getByRole('button', { name: 'Chèn vào đề', exact: true }).click();
    await expect(surface.locator(':scope > [data-sdt-block]')).toHaveCount(2);
    await expect(surface.locator('[data-sdt-block] [data-sdt-block]')).toHaveCount(0);
    await expect.poll(() => state.docs()[0].content).toContain(collision ? nativeHtml.split('>')[0] : 'block-native-2');
    await expect.poll(() => state.docs()[0].structure?.questions.length).toBe(collision ? undefined : 2);
  });
}
