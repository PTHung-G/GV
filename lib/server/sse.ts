/**
 * Server-Sent Events writer matching the original protocol.
 *
 * Recovered from js/2xwqx5gh-wuz4.js — the client parses frames split on a blank
 * line, then reads `event:` and joined `data:` lines, JSON.parse-ing each payload.
 * Only these five event names are understood:
 *
 *   progress { stage, message, step? } -> onProgress
 *   delta    { action, text }        -> onDelta      (this is the typing effect)
 *   reset    { message }             -> onReset
 *   result   <object with success>   -> resolves the promise
 *   error    <ApiError body>         -> rejects the promise
 */

export type SseWriter = ReturnType<typeof createSseWriter>;

export function createSseWriter() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
    cancel() {
      closed = true;
    },
  });

  function frame(event: string, data: unknown) {
    // `result`/`error` settle the client promise; anything after them is ignored.
    if (closed || !controller) return;
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${payload}\n\n`));
  }

  function close() {
    if (closed) return;
    closed = true;
    controller?.close();
  }

  return {
    stream,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    },
    /** `step` indexes the assistant's own plan, so the UI can tick items off. */
    progress(stage: string, message: string, step?: number) {
      frame('progress', step === undefined ? { stage, message } : { stage, message, step });
    },
    /** Emits `count` characters at a time, mirroring onDelta's incremental text. */
    async delta(text: string, action = 'chat', chunk = 24, delayMs = 12) {
      for (let i = 0; i < text.length; i += chunk) {
        frame('delta', { action, text: text.slice(i, i + chunk) });
        if (delayMs > 0) await sleep(delayMs);
      }
    },
    reset(message: string) {
      frame('reset', { message });
    },
    result(payload: unknown) {
      frame('result', payload);
      close();
    },
    error(body: unknown) {
      frame('error', body);
      close();
    },
    close,
    get closed() {
      return closed;
    },
  };
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
