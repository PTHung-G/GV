import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { complete, completeStream } from '../../lib/server/model';
import { materializeGeneration, reconcileStructure } from '../../lib/structured-exam';
import { patchConversationTurn, boundedConversationHistory } from '../../lib/server/conversations';

const schema = 'structured-exam-generation: {"blocks":[{"key":"q1","html":"<p>Câu 1.</p>"}],"questions":[{"key":"question1","label":"Câu 1","bodyKeys":["q1"],"contextKeys":[]}]}';

test.describe('structured generation and history backend', () => {
  let oldKey: string | undefined;
  let oldDelay: string | undefined;
  test.beforeEach(() => {
    oldKey = process.env.AI_API_KEY;
    oldDelay = process.env.AI_OFFLINE_DELAY_MS;
    delete process.env.AI_API_KEY;
    process.env.AI_OFFLINE_DELAY_MS = '0';
  });
  test.afterEach(() => {
    if (oldKey === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = oldKey;
    if (oldDelay === undefined) delete process.env.AI_OFFLINE_DELAY_MS;
    else process.env.AI_OFFLINE_DELAY_MS = oldDelay;
  });

  test('streams valid local-key JSON even when history contains old action/planner schemas', async () => {
    const pieces: string[] = [];
    const reply = await completeStream({ json: true, maxTokens: 10000, messages: [
      { role: 'system', content: schema },
      { role: 'assistant', content: '{"action":"replace","decision":"proceed"}' },
      { role: 'user', content: 'Soạn 3 câu Toán lớp 9' },
    ] }, piece => pieces.push(piece));
    expect(pieces.join('')).toBe(reply.text);
    const draft = JSON.parse(reply.text);
    expect(draft.questions).toHaveLength(3);
    expect(draft.blocks[0].html).toContain('doc-header');
    expect(draft.blocks.every((block: Record<string, unknown>) => !('id' in block))).toBe(true);
    const { html, structure } = materializeGeneration(draft, randomUUID);
    expect(structure.questions).toHaveLength(3);
    expect(reconcileStructure(html, structure)).toEqual(structure);
    expect(html).toContain('data-sdt-block');
    expect(new Set([...structure.blocks.map(b => b.id), ...structure.questions.map(q => q.id)]).size)
      .toBe(structure.blocks.length + structure.questions.length);
  });

  test('preserves legacy planner, action and plain offline dispatch', async () => {
    for (const [content, expected] of [
      ['Trả về JSON {"decision":"proceed"}', { decision: 'proceed' }],
      ['Trả về JSON {"action":"replace"}', { action: 'replace' }],
    ] as const) {
      const reply = await complete({ json: true, messages: [{ role: 'system', content }] });
      expect(JSON.parse(reply.text)).toMatchObject(expected);
    }
    const plain = await complete({ messages: [{ role: 'user', content: 'Soạn 2 câu Toán' }] });
    expect(plain.text).toContain('<h1>');
    expect(plain.text.match(/<b>Câu /g)).toHaveLength(2);
  });

  test('rejects malformed generation instead of fabricating boundaries', () => {
    for (const value of [{ action: 'replace' }, { blocks: [], questions: [] }, {
      blocks: [{ key: 'q1', html: '<p>Câu 1.</p>' }],
      questions: [{ key: 'question1', label: 'Câu 1', bodyKeys: ['missing'], contextKeys: [] }],
    }]) expect(() => materializeGeneration(value, randomUUID)).toThrow();
  });

  test('rejects invalid/mismatched submitted conversation structures before database access', async () => {
    const { html, structure } = materializeGeneration({
      blocks: [{ key: 'q1', html: '<p>Câu 1. Tính $x^2$.</p>' }],
      questions: [{ key: 'question1', label: 'Câu 1', bodyKeys: ['q1'], contextKeys: [] }],
    }, randomUUID);
    for (const payload of [
      { html, action: 'replace', structure: { version: 99 } },
      { html: '<p>Không có neo</p>', action: 'replace', structure },
      { html, action: 'replace', structure: null },
      { html, action: 'replace', structure, injected: true },
    ]) await expect(patchConversationTurn('owner', randomUUID(), 'turn1', { payload }))
      .rejects.toMatchObject({ status: 400, code: 'invalid_conversation' });
  });

  test('bounded history retains current stored HTML with structured payloads', () => {
    const { html, structure } = materializeGeneration({
      blocks: [{ key: 'q1', html: '<p>Câu 1. Nội dung đã sửa.</p>' }],
      questions: [{ key: 'question1', label: 'Câu 1', bodyKeys: ['q1'], contextKeys: [] }],
    }, randomUUID);
    const history = boundedConversationHistory([
      { id: 'user', role: 'user', text: 'Soạn câu hỏi' },
      { id: 'assistant', role: 'assistant', text: 'Đã soạn.', status: 'completed', payload: { html, structure, action: 'replace' } },
    ]);
    expect(history[1].content).toContain(html);
    expect(history[1].content).toContain('Nội dung đã sửa.');
  });
});
