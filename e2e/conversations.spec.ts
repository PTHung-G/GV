import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('conversation ownership, deduplication, cancellation, history and sessions', async ({ playwright }) => {
  const baseURL = 'http://127.0.0.1:3100';
  const a = await playwright.request.newContext({ baseURL });
  const b = await playwright.request.newContext({ baseURL });
  const guest = await playwright.request.newContext({ baseURL });
  try {
    for (const [api, name] of [[a, 'a'], [b, 'b']] as const) {
      expect((await api.post('/api/auth/register', { data: { name: 'Chat Teacher', email: `chat-${name}-${randomUUID()}@example.test`, password: 'TestChat123!' } })).ok()).toBeTruthy();
    }
    expect((await guest.get('/api/conversations?docId=test')).status()).toBe(401);
    expect((await guest.get('/api/memory')).status()).toBe(401);
    const docId = `chat-test-${randomUUID()}`;
    const initial = await (await a.get(`/api/conversations?docId=${docId}`)).json();
    const id = initial.conversation.id;
    expect((await b.get(`/api/conversations?docId=${docId}&conversationId=${id}`)).status()).toBe(404);
    const start = `/api/conversations/${id}/turns`;
    const data = { turnId: randomUUID(), prompt: 'Chỉ hỏi về PCA' };
    expect((await a.post(start, { data })).ok()).toBeTruthy();
    expect((await (await a.post(start, { data })).json()).deduplicated).toBe(true);
    expect((await a.post(start, { data: { turnId: randomUUID(), prompt: 'Competing' } })).status()).toBe(409);
    expect((await b.patch(`${start}/${data.turnId}`, { data: { status: 'completed', text: 'Other owner' } })).status()).toBe(404);
    expect((await a.patch(`${start}/${data.turnId}`, { data: { status: 'completed', text: 'Bản PCA', payload: { action: 'replace', html: '<p>PCA draft</p>' } } })).ok()).toBeTruthy();
    const next = { turnId: randomUUID(), prompt: 'Đổi thành 5 câu' };
    const second = await (await a.post(start, { data: next })).json();
    expect(second.history.map((m: {content: string}) => m.content).join(' ')).toContain('PCA draft');
    expect((await a.patch(`${start}/${next.turnId}`, { data: { status: 'cancelled', text: 'Đã dừng' } })).ok()).toBeTruthy();
    expect((await a.patch(`${start}/${next.turnId}`, { data: { status: 'completed', text: 'Late result' } })).status()).toBe(409);
    const restored = await (await a.get(`/api/conversations?docId=${docId}`)).json();
    expect(restored.conversation.messages).toHaveLength(4);
    const fresh = await (await a.post('/api/conversations', { data: { docId } })).json();
    expect(fresh.conversation.id).not.toBe(id);
    expect(fresh.conversations).toHaveLength(2);
    expect((await (await a.get(`/api/conversations?docId=${docId}&conversationId=${id}`)).json()).conversation.messages).toHaveLength(4);
    await a.post('/api/memory', { data: { text: 'A only PCA preference' } });
    const otherMemory = await (await b.get('/api/memory')).json();
    expect(JSON.stringify(otherMemory)).not.toContain('A only PCA preference');
  } finally { await a.dispose(); await b.dispose(); await guest.dispose(); }
});

test('chat survives panel collapse and reload with saved draft', async ({ page }) => {
  const email = `chat-ui-${randomUUID()}@example.test`;
  const loginResponse = await page.request.post('/api/auth/register', { data: { name: 'Chat Teacher', email, password: 'TestChat123!' } });
  expect(loginResponse.ok()).toBeTruthy();
  const login = await loginResponse.json();
  const now = new Date().toISOString();
  const saved = await page.request.put('/api/documents', { data: { ownerId: login.user.id, revision: 0, documents: [{ id: 'demo-de-giua-ky-toan-9', title: 'Đề kiểm tra chat', content: '<p>Câu 1. PCA</p>', subject: 'Tin học', grade: null, createdAt: now, updatedAt: now }] } });
  expect(saved.ok()).toBeTruthy();
  await page.route('**/api/chat-exam/plan', route => route.fulfill({ json: { success: true, decision: 'reject', reply: 'Đã ghi nhận PCA', steps: [] } }));
  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const ai = page.getByRole('complementary', { name: 'Trợ lý AI' });
  await expect(ai.getByRole('button', { name: /^Gửi(?: yêu cầu)?$/ })).toBeDisabled();
  await ai.getByRole('textbox').fill('Yêu cầu PCA cần được lưu');
  await expect(ai.getByRole('button', { name: /^Gửi(?: yêu cầu)?$/ })).toBeEnabled();
  await ai.getByRole('button', { name: /^Gửi(?: yêu cầu)?$/ }).click();
  await expect(ai.getByText('Đã ghi nhận PCA', { exact: true })).toBeVisible();
  await expect(ai.getByRole('button', { name: 'Làm mới hội thoại' })).toBeEnabled();
  await ai.getByRole('button', { name: 'Ẩn trợ lý AI' }).click();
  await page.getByRole('button', { name: 'Hiện trợ lý AI', exact: true }).click();
  await expect(ai.getByRole('paragraph').filter({ hasText: /^Yêu cầu PCA cần được lưu$/ })).toBeVisible();
  await page.reload();
  await expect(ai.getByRole('paragraph').filter({ hasText: /^Yêu cầu PCA cần được lưu$/ })).toBeVisible();
  await expect(ai.getByText('Đã ghi nhận PCA', { exact: true })).toBeVisible();
});

test('cancelled pending turn survives reload and can be retried', async ({ page }) => {
  const email = `chat-cancel-${randomUUID()}@example.test`;
  const login = await (await page.request.post('/api/auth/register', { data: { name: 'Chat Teacher', email, password: 'TestChat123!' } })).json();
  const now = new Date().toISOString();
  expect((await page.request.put('/api/documents', { data: { ownerId: login.user.id, revision: 0, documents: [{ id: 'cancel-test', title: 'Đề kiểm tra hủy', content: '<p>Câu 1. PCA</p>', subject: 'Tin học', grade: null, createdAt: now, updatedAt: now }] } })).ok()).toBeTruthy();
  const conversation = await (await page.request.get('/api/conversations?docId=cancel-test')).json();
  const turnId = randomUUID();
  expect((await page.request.post(`/api/conversations/${conversation.conversation.id}/turns`, { data: { turnId, prompt: 'Soạn PCA sau khi thử lại' } })).ok()).toBeTruthy();
  await page.route('**/api/chat-exam/plan', route => route.fulfill({ json: { success: true, decision: 'reject', reply: 'Đã xử lý lượt thử lại', steps: [] } }));
  await page.goto('/doc/cancel-test');
  const ai = page.getByRole('complementary', { name: 'Trợ lý AI' });
  await ai.getByRole('button', { name: 'Dừng yêu cầu' }).click();
  await expect(ai.getByRole('button', { name: 'Thử lại yêu cầu' })).toBeVisible();
  await page.reload();
  await expect(ai.getByRole('button', { name: 'Thử lại yêu cầu' })).toBeVisible();
  await ai.getByRole('button', { name: 'Thử lại yêu cầu' }).click();
  await expect(ai.getByText('Đã xử lý lượt thử lại', { exact: true })).toBeVisible();
  await expect(ai.getByRole('button', { name: 'Làm mới hội thoại' })).toBeEnabled();
  const restored = await (await page.request.get('/api/conversations?docId=cancel-test')).json();
  expect(restored.conversation.messages).toHaveLength(4);
  expect(restored.conversation.messages[1].status).toBe('cancelled');
  expect(restored.conversation.messages[3].status).toBe('completed');
});
