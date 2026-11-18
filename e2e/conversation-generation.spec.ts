import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { reconcileStructure } from '../lib/structured-exam';

test('generation commits its draft without client completion and rejects replay', async ({ request }) => {
  const registration = await request.post('/api/auth/register', { data: { name: 'Generation Teacher', email: `generation-${randomUUID()}@example.test`, password: 'ChatTest123!' } });
  expect(registration.ok()).toBeTruthy();
  const { conversation } = await (await request.post('/api/conversations', { data: { docId: `test-${randomUUID()}` } })).json();
  const turnId = randomUUID();
  await request.post(`/api/conversations/${conversation.id}/turns`, { data: { turnId, prompt: 'Soạn một câu đại số' } });
  const body = { conversationId: conversation.id, turnId, prompt: 'Soạn một câu đại số', messages: [] };
  const response = await request.post('/api/chat-exam', { data: body });
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain('event: result');
  const saved = await (await request.get(`/api/conversations?docId=${conversation.docId}&conversationId=${conversation.id}`)).json();
  const answer = saved.conversation.messages.find((m: {id: string}) => m.id === turnId);
  expect(answer.status).toBe('completed');
  expect(answer.payload.html).toContain('Câu 1');
  expect(answer.payload.structure.version).toBe(1);
  expect(answer.payload.structure.questions.length).toBeGreaterThan(0);
  expect(reconcileStructure(answer.payload.html, answer.payload.structure)).toEqual(answer.payload.structure);
  expect((await request.post('/api/chat-exam', { data: body })).status()).toBe(409);
  expect((await request.patch(`/api/conversations/${conversation.id}/turns/${turnId}`, { data: { applied: true } })).ok()).toBeTruthy();
  const next = randomUUID();
  await request.post(`/api/conversations/${conversation.id}/turns`, { data: { turnId: next, prompt: 'Soạn thêm' } });
  await request.patch(`/api/conversations/${conversation.id}/turns/${next}`, { data: { status: 'cancelled', text: 'Đã dừng' } });
  expect((await request.post('/api/chat-exam', { data: { ...body, turnId: next } })).status()).toBe(409);
});
