import { expect, test } from '@playwright/test';

test('AI progress shows actual status separately from the proposed plan', async ({ page }) => {
  const prefix = process.env.NEXT_BASE_PATH ?? '';
  const login = await page.request.post(`${prefix}/api/auth/register`, { data: {
    name: 'AI Test Teacher', email: `ai-ui-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`, password: 'TestChat123!',
  } });
  expect(login.ok()).toBeTruthy();
  const { user } = await login.json();
  const now = new Date().toISOString();
  const library = await page.request.put(`${prefix}/api/documents`, { data: {
    ownerId: user.id, revision: 0, documents: [{ id: 'demo-de-giua-ky-toan-9',
      title: 'Đề kiểm tra AI', content: '<p>Câu 1. Đề đang mở.</p>', subject: 'Toán', grade: 9,
      createdAt: now, updatedAt: now }],
  } });
  expect(library.ok()).toBeTruthy();

  let releasePlan!: () => void;
  let releaseVerify!: () => void;
  const planGate = new Promise<void>((resolve) => { releasePlan = resolve; });
  const verifyGate = new Promise<void>((resolve) => { releaseVerify = resolve; });
  await page.route('**/api/chat-exam/plan', async (route) => {
    await planGate;
    await route.fulfill({ json: {
      decision: 'proceed', clarifications: [],
      steps: ['Đọc đề đang mở', 'Soạn 3 câu tự luận'],
    } });
  });
  await page.route('**/api/chat-exam', async (route) => {
    const turn = route.request().postDataJSON();
    const saved = await page.request.patch(`${prefix}/api/conversations/${turn.conversationId}/turns/${turn.turnId}`, { data: {
      status: 'completed', text: 'Đã soạn xong.', payload: { action: 'replace', html: '<p>Bản nháp được lưu</p>' },
    } });
    expect(saved.ok()).toBeTruthy();
    await route.fulfill({
    contentType: 'text/event-stream',
    body: 'event: progress\ndata: {"stage":"generating","message":"Đang soạn… đã viết 3 câu"}\n\n' +
      'event: result\ndata: ' + JSON.stringify({ success: true, action: 'replace',
        reply: 'Đã soạn xong.', exam: { content: '<h1>ĐỀ TOÁN</h1><p>Câu 1. Giải phương trình.</p>' },
      }) + '\n\n',
    });
  });
  await page.route('**/api/chat-exam/verify', async (route) => {
    await verifyGate;
    await route.fulfill({ json: { issues: [] } });
  });
  try {
    await page.goto(`${process.env.NEXT_BASE_PATH ?? ''}/doc/demo-de-giua-ky-toan-9`);
    const ai = page.getByRole('complementary', { name: 'Trợ lý AI' });
    await ai.getByRole('textbox').last().fill('Soạn 3 câu tự luận');
    await ai.getByRole('button', { name: /^Gửi(?: yêu cầu)?$/ }).click();
    const progress = ai.locator('[data-ai-progress]');
    await expect(progress.getByRole('status')).toContainText('Đang đọc yêu cầu và lập kế hoạch');
    releasePlan();
    await expect(progress.getByRole('status')).toContainText('Đang kiểm tra cấu trúc đề');
    await progress.locator('summary').click();
    await expect(progress.locator('ol')).toContainText('Soạn 3 câu tự luận');
    // Free-form model steps are a proposal, never falsely marked as completed.
    await expect(progress.locator('ol .line-through')).toHaveCount(0);
    releaseVerify();
    await expect(progress).toHaveCount(0);
    await expect(ai.getByRole('button', { name: 'Thay vào đề' })).toBeVisible();
  } finally {
    releasePlan();
    releaseVerify();
  }
});
