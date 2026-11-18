import { expect, test } from '@playwright/test';
import { completeStream } from '../../lib/server/model';

test.describe('provider streaming progress', () => {
  let oldKey: string | undefined;
  let originalFetch: typeof fetch;
  test.beforeEach(() => {
    oldKey = process.env.AI_API_KEY;
    process.env.AI_API_KEY = 'unit-test-key';
    originalFetch = globalThis.fetch;
  });
  test.afterEach(() => {
    if (oldKey === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = oldKey;
    globalThis.fetch = originalFetch;
  });

  for (const separator of ['\n\n', '\r\n\r\n']) {
    test(`handles fragmented UTF-8, ${JSON.stringify(separator)} frames and final unterminated frame`, async () => {
      const frame = (content: string) => `data: ${JSON.stringify({ model: 'test-stream', choices: [{ delta: { content } }] })}`;
      const bytes = new TextEncoder().encode(frame('Đang soạn ') + separator + frame('Câu 1'));
      globalThis.fetch = async () => new Response(new ReadableStream({
        start(controller) {
          for (let i = 0; i < bytes.length; i += 3) controller.enqueue(bytes.slice(i, i + 3));
          controller.close();
        },
      }), { headers: { 'content-type': 'text/event-stream' } });
      const deltas: string[] = [];
      const result = await completeStream({ messages: [{ role: 'user', content: 'test' }] }, (text) => deltas.push(text));
      expect(result.text).toBe('Đang soạn Câu 1');
      expect(result.model).toBe('test-stream');
      expect(deltas).toEqual(['Đang soạn ', 'Câu 1']);
    });
  }

  test('falls back when a provider rejects streaming', async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return calls === 1
        ? new Response('stream unsupported', { status: 400 })
        : Response.json({ choices: [{ message: { content: 'Bản nháp' } }] });
    };
    const result = await completeStream({ messages: [{ role: 'user', content: 'test' }] }, () => {});
    expect(result.text).toBe('Bản nháp');
    expect(calls).toBe(2);
  });
});
