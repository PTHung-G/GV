/**
 * Client-side SSE reader, mirroring js/2xwqx5gh-wuz4.js.
 *
 * The original accepts both plain JSON and text/event-stream from the same POST;
 * frames are split on a blank line, `event:` names the type, repeated `data:`
 * lines are joined and JSON-parsed. Nothing else in the frame is significant.
 */
import { basePath } from '@/lib/api-url';
import type { ChatExamErrorBody, ChatExamResult } from './server/chat-exam-types';

export type StreamHandlers = {
  onProgress?: (p: { stage: string; message: string; step?: number }) => void;
  onDelta?: (d: { action: string; text: string }) => void;
  onReset?: (message: string) => void;
};

export class ApiError extends Error {
  status: number;
  code: string;
  requestId: string;
  constructor(body: Partial<ChatExamErrorBody>) {
    super(body.error ?? 'Đã có lỗi xảy ra.');
    this.name = 'ApiError';
    this.status = body.status ?? 0;
    this.code = body.code ?? 'unknown';
    this.requestId = body.requestId ?? '';
  }
}

export async function postJsonStream<T>(url: string, body: unknown, h: StreamHandlers = {}, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(basePath(url), {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream, application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch {
    throw new ApiError({
      status: 0,
      error: 'Không kết nối được tới dịch vụ. Hãy kiểm tra mạng rồi thử lại.',
      code: 'network_error',
    });
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/event-stream')) {
    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; error?: string; code?: string; requestId?: string }
      | null;
    if (!res.ok || !json || json.success === false) {
      throw new ApiError({
        status: res.status,
        error: json?.error ?? 'Dịch vụ trả về phản hồi không hợp lệ.',
        code: json?.code ?? `http_${res.status}`,
        requestId: json?.requestId,
      });
    }
    return json as T;
  }

  if (!res.ok || !res.body) {
    throw new ApiError({ status: res.status, error: 'Không đọc được luồng phản hồi.', code: 'stream_unavailable' });
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result: T | undefined;

  const parseFrame = (raw: string) => {
    if (!raw) return;
    let event = 'message';
    const dataLines: string[] = [];
    for (const line of raw.split('\n')) {
      if (line.startsWith(':')) continue;
      if (line.startsWith('event:')) event = line.slice(6).trim();
      if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
    }
    if (!dataLines.length) return;

    let payload: unknown;
    try {
      payload = JSON.parse(dataLines.join('\n'));
    } catch {
      throw new ApiError({ status: 502, error: 'Dịch vụ trả về một event stream không hợp lệ.', code: 'invalid_stream_event' });
    }

    if (event === 'progress') {
      const p = payload as { stage?: string; message?: string; step?: number };
      if (p.message) {
        h.onProgress?.({ stage: p.stage ?? '', message: p.message, step: p.step });
      }
      return;
    }
    if (event === 'delta') {
      const d = payload as { action?: string; text?: string };
      if (typeof d.text === 'string' && d.text) h.onDelta?.({ action: d.action ?? '', text: d.text });
      return;
    }
    if (event === 'reset') {
      h.onReset?.((payload as { message?: string }).message ?? '');
      return;
    }
    if (event === 'error') {
      throw new ApiError(payload as ChatExamErrorBody);
    }
    if (event === 'result') {
      const r = payload as { success?: boolean };
      if (!r || typeof r !== 'object' || r.success === false) {
        throw new ApiError((payload as ChatExamErrorBody) ?? {});
      }
      result = payload as T;
    }
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      buffer = buffer.replace(/\r\n/g, '\n');
      let idx = buffer.indexOf('\n\n');
      while (idx >= 0) {
        parseFrame(buffer.slice(0, idx));
        if (result !== undefined) return result;
        buffer = buffer.slice(idx + 2);
        idx = buffer.indexOf('\n\n');
      }
      if (done) break;
    }
    if (buffer.trim()) parseFrame(buffer.trim());
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError({ status: 0, error: 'Kết nối bị ngắt giữa chừng.', code: 'stream_interrupted' });
  }

  if (result === undefined) {
    throw new ApiError({ status: 502, error: 'Luồng phản hồi kết thúc trước khi có kết quả.', code: 'stream_no_result' });
  }
  return result;
}

export function planExam(
  body: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<{
  decision: string;
  templatePrompt: string;
  reply: string;
  steps: string[];
  clarifications: unknown[];
}> {
  return postJsonStream('/api/chat-exam/plan', body, {}, signal);
}

export function generateExam(
  body: Record<string, unknown>,
  handlers: StreamHandlers,
  signal?: AbortSignal,
): Promise<ChatExamResult> {
  return postJsonStream<ChatExamResult>('/api/chat-exam', body, handlers, signal);
}

export function verifyExam(content: string, subject?: string) {
  return postJsonStream<{ ok: boolean; issues: Array<{ message: string }>; stats: { questionCount: number } }>(
    '/api/chat-exam/verify',
    { content, subject },
  );
}
