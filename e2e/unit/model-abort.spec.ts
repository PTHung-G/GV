import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Hermetic actual production module; never accesses env secrets/network/provider.
function model(fetch: typeof globalThis.fetch) {
  const code = ts.transpileModule(readFileSync('lib/server/model.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports: Record<string, any> = {};
  new Function('exports', 'process', 'fetch', code)(exports, { env: { AI_API_KEY: 'synthetic', AI_BASE_URL: 'https://invalid.test', AI_MODEL: 'test' } }, fetch);
  return exports.complete as typeof import('../../lib/server/model').complete;
}
const call = { messages: [{ role: 'user' as const, content: 'Public synthetic task' }] };
function hung(status = 200) { return new Response(new ReadableStream({ start() {} }), { status }); }
async function mustAbort(complete: ReturnType<typeof model>) {
  const controller = new AbortController();
  const reason = new Error('synthetic_caller_deadline');
  const result = complete({ ...call, signal: controller.signal });
  const timer = setTimeout(() => controller.abort(reason), 10);
  try { await expect(result).rejects.toBe(reason); } finally { clearTimeout(timer); }
}

test('abort bounds successful headers with an indefinitely unfinished response body', async () => {
  await mustAbort(model(async () => hung()));
});
test('abort bounds a fetch wrapper blocked reading its cloned response', async () => {
  await mustAbort(model(async () => { const response = hung(); await response.clone().json(); return response; }));
});
test('abort bounds an error response body without swallowing abort into retry', async () => {
  let calls = 0;
  await mustAbort(model(async () => { calls++; return hung(503); }));
  expect(calls).toBe(1);
});
test('normal success preserves exact text and actual model', async () => {
  const complete = model(async () => Response.json({ model: 'actual', choices: [{ message: { content: ' untouched text ' } }] }));
  expect(await complete(call)).toEqual({ model: 'actual', text: ' untouched text ' });
});
test('late transport success after caller abort is not accepted or retried', async () => {
  const controller = new AbortController(); const reason = new Error('late_response'); let calls = 0;
  const complete = model(async () => { calls++; controller.abort(reason); return Response.json({ choices: [{ message: { content: 'late' } }] }); });
  await expect(complete({ ...call, signal: controller.signal })).rejects.toBe(reason);
  expect(calls).toBe(1);
});
test('already aborted caller does not start work', async () => {
  let calls = 0; const controller = new AbortController(); controller.abort();
  const complete = model(async () => { calls++; return hung(); });
  await expect(complete({ ...call, signal: controller.signal })).rejects.toThrow();
  expect(calls).toBe(0);
});
