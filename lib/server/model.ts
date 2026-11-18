/**
 * Model access layer.
 *
 * The clone ships with a deterministic offline provider so the whole pipeline
 * (plan -> generate -> verify) runs without a key. Set AI_API_KEY to route the
 * same calls to a real OpenAI-compatible chat-completions endpoint.
 */
import type { ReasoningLevel } from './chat-exam-types';

export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
};

/** Flattens multimodal content to plain text (used by the offline provider). */
function asText(content: string | ContentPart[]): string {
  if (typeof content === 'string') return content;
  return content
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('\n');
}

export type ModelCall = {
  messages: ChatMessage[];
  reasoning?: ReasoningLevel;
  /** Ask the provider for JSON output where supported. */
  json?: boolean;
  maxTokens?: number;
  signal?: AbortSignal;
};

export type ModelReply = { text: string; model: string };

export type ProviderKind = 'offline' | 'openai-compatible';

export function providerKind(): ProviderKind {
  return process.env.AI_API_KEY ? 'openai-compatible' : 'offline';
}

function modelName(): string {
  return process.env.AI_MODEL ?? 'gpt-4o-mini';
}

/** Maps the composer's three levels onto provider-specific effort hints. */
function effortHint(level: ReasoningLevel | undefined) {
  switch (level) {
    case 'fast':
      return 'Trả lời ngắn gọn, tối ưu tốc độ.';
    case 'deep':
      return 'Suy luận kỹ, kiểm tra lại từng bước trước khi trả lời.';
    default:
      return 'Cân bằng giữa tốc độ và độ kỹ.';
  }
}

/** Statuses where trying again is the right answer. */
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;
const CALL_TIMEOUT_MS = 120_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Honour Retry-After when given, otherwise back off exponentially with jitter. */
function pauseFor(attempt: number, retryAfter: string | null): number {
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) return Math.min(seconds * 1000, 20_000);
    const at = Date.parse(retryAfter);
    if (!Number.isNaN(at)) return Math.min(Math.max(0, at - Date.now()), 20_000);
  }
  return Math.min(600 * 2 ** attempt, 8_000) + Math.floor(Math.random() * 250);
}

/** Bound wrappers/body readers too: not every transport honours fetch's signal. */
function withAbort<T>(operation: () => Promise<T>, signal: AbortSignal): Promise<T> {
  signal.throwIfAborted();
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    // Recheck after subscribing and before starting work; never accept a late result.
    if (signal.aborted) { signal.removeEventListener('abort', abort); reject(signal.reason); return; }
    Promise.resolve().then(() => { signal.throwIfAborted(); return operation(); }).then(
      value => { signal.removeEventListener('abort', abort); signal.aborted ? reject(signal.reason) : resolve(value); },
      error => { signal.removeEventListener('abort', abort); reject(signal.aborted ? signal.reason : error); },
    );
  });
}

export async function complete(call: ModelCall): Promise<ModelReply> {
  call.signal?.throwIfAborted();
  if (providerKind() === 'offline') {
    return { text: await offlineComplete(call), model: 'offline-deterministic' };
  }

  const base = process.env.AI_BASE_URL ?? 'https://api.openai.com/v1';
  const messages = [
    ...call.messages.slice(0, 1),
    { role: 'system' as const, content: effortHint(call.reasoning) },
    ...call.messages.slice(1),
  ];

  const body = JSON.stringify({
    model: modelName(),
    messages,
    max_tokens: call.maxTokens ?? 2400,
    temperature: 0.6,
    ...(call.json ? { response_format: { type: 'json_object' } } : {}),
  });

  let lastError: Error = new Error('provider_error');

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const signal = call.signal ? AbortSignal.any([call.signal, AbortSignal.timeout(CALL_TIMEOUT_MS)]) : AbortSignal.timeout(CALL_TIMEOUT_MS);
    let res: Response;
    try {
      res = await withAbort(() => fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        body,
        // A provider that accepted the connection but never answers would
        // otherwise hold a grading job open forever.
        signal,
      }), signal);
    } catch (error) {
      call.signal?.throwIfAborted();
      lastError = new Error(`provider_unreachable: ${error instanceof Error ? error.message : 'unknown'}`);
      if (attempt === MAX_ATTEMPTS - 1) throw lastError;
      await sleep(pauseFor(attempt, null));
      continue;
    }

    if (res.ok) {
      const json = (await withAbort(() => res.json(), signal)) as {
        choices?: Array<{ message?: { content?: string } }>;
        model?: string;
      };
      const text = json.choices?.[0]?.message?.content ?? '';
      if (!text.trim()) throw new Error('provider_empty_response');
      return { text, model: json.model ?? modelName() };
    }

    const detail = await withAbort(() => res.text().catch(() => ''), signal);
    lastError = new Error(`provider_error ${res.status}: ${detail.slice(0, 300)}`);

    // 429 and 5xx are the provider asking us to come back later, not a bug.
    if (!RETRYABLE_STATUS.has(res.status) || attempt === MAX_ATTEMPTS - 1) throw lastError;
    await sleep(pauseFor(attempt, res.headers.get('retry-after')));
  }

  throw lastError;
}

/**
 * Streaming variant. `onDelta` receives text as the provider produces it.
 *
 * This exists so the assistant can say what it is doing *while* it works. A
 * single blocking call gives the teacher one line — "Đang soạn đề…" — for half
 * a minute with no sign of life; the stream lets the caller count questions as
 * they appear and report real progress.
 *
 * Falls back to the blocking call when the provider cannot stream, so a
 * provider that rejects `stream: true` still works.
 */
export async function completeStream(
  call: ModelCall,
  onDelta: (text: string) => void,
): Promise<ModelReply> {
  call.signal?.throwIfAborted();
  if (providerKind() === 'offline') {
    const text = await offlineComplete(call);
    // Chunked so the offline provider behaves like a real stream in dev.
    // AI_OFFLINE_DELAY_MS slows it further — the only way to watch the
    // in-progress UI without a live key.
    const delay = Number(process.env.AI_OFFLINE_DELAY_MS ?? 16);
    for (let i = 0; i < text.length; i += 90) {
      call.signal?.throwIfAborted();
      onDelta(text.slice(i, i + 90));
      if (delay > 0) await sleep(delay);
    }
    return { text, model: 'offline-deterministic' };
  }

  const base = process.env.AI_BASE_URL ?? 'https://api.openai.com/v1';
  const messages = [
    ...call.messages.slice(0, 1),
    { role: 'system' as const, content: effortHint(call.reasoning) },
    ...call.messages.slice(1),
  ];

  let res: Response;
  try {
    res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName(),
        messages,
        max_tokens: call.maxTokens ?? 2400,
        temperature: 0.6,
        stream: true,
        ...(call.json ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: call.signal ? AbortSignal.any([call.signal, AbortSignal.timeout(CALL_TIMEOUT_MS)]) : AbortSignal.timeout(CALL_TIMEOUT_MS),
    });
  } catch {
    call.signal?.throwIfAborted();
    return complete(call);
  }

  if (!res.ok || !res.body) {
    // Some compatible providers refuse `stream`; the blocking call is the
    // documented fallback rather than a failed request.
    return complete(call);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let model = modelName();

  const consumeFrame = (frame: string) => {
    for (const line of frame.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      let json: { model?: string; choices?: Array<{ delta?: { content?: string } }> };
      try {
        json = JSON.parse(payload);
      } catch {
        continue;
      }
      if (json.model) model = json.model;
      const piece = json.choices?.[0]?.delta?.content;
      if (piece) {
        text += piece;
        onDelta(piece);
      }
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split(/\r?\n\r?\n/);
      buffer = frames.pop() ?? '';
      for (const frame of frames) consumeFrame(frame);
    }
    buffer += decoder.decode();
    if (buffer.trim()) consumeFrame(buffer);
  } finally {
    reader.releaseLock();
  }

  if (!text.trim()) return complete(call);
  return { text, model };
}

/**
 * Offline stand-in. It reads the *structure* of the request (how many questions,
 * which action, which subject) so the pipeline behaves realistically, but the
 * prose is fixed sample content rather than a generated answer.
 */ async function offlineComplete(call: ModelCall): Promise<string> {
    // Dispatch explicit structured generation before legacy action/planner JSON.
    // Conversation history may itself contain an old action response.
    const all = call.messages.map((m: ChatMessage) => asText(m.content)).join('\n');
    const wantsJson = !!call.json || /trả về JSON/i.test(all);
    const system = call.messages.filter(m => m.role === 'system').map(m => asText(m.content)).join('\n');
    if (wantsJson && (/structured-exam-generation/.test(system) ||
        (/"blocks"/.test(system) && /"questions"/.test(system) && /"bodyKeys"/.test(system)))) {
        const prompt = asText([...call.messages].reverse().find(m => m.role === 'user')?.content ?? '');
        return JSON.stringify(offlineStructuredExam(prompt));
    }
    if (wantsJson && /"decision"/.test(all)) {
        return JSON.stringify({
            decision: 'proceed',
            task_kind: 'generate',
            template_prompt: 'Soạn đề theo yêu cầu người dùng.',
            operations: [
                'chat',
                'replace_exam'
            ],
            summary: 'Soạn đề mới theo yêu cầu.',
            steps: ['Đọc đề đang mở', 'Soạn đề theo yêu cầu', 'Trình bày theo mẫu A4'],
            notes: [],
            warnings: [],
            clarifications: []
        });
    }
    if (wantsJson && /"action"/.test(all)) {
        return JSON.stringify({
            action: 'replace'
        });
    }
    const lastUser = asText(
        [...call.messages].reverse().find((m: ChatMessage) => m.role === 'user')?.content ?? '',
    );
    return offlineExamHtml(lastUser);
}
function countQuestions(prompt: string): number {
    const m = prompt.match(/(\d+)\s*câu/);
    const n = m ? Number(m[1]) : 5;
    return Math.min(Math.max(n, 1), 20);
}
function offlineExamHtml(prompt: string): string {
    const lower = prompt.toLowerCase();
    const subject = lower.includes('văn') ? 'Ngữ văn' : lower.includes('anh') ? 'Tiếng Anh' : 'Toán';
    const grade = (prompt.match(/lớp\s*(\d+)/) ?? [])[1] ?? '9';
    const total = countQuestions(prompt);
    const questions = Array.from({
        length: total
    }, (_, i)=>{
        const n = i + 1;
        return `<p><b>Câu ${n}.</b> (1,0 điểm) Nội dung câu hỏi số ${n} của đề ${subject} lớp ${grade}.</p>`;
    }).join('');
    return [
        `<h1>ĐỀ KIỂM TRA ${subject.toUpperCase()} – LỚP ${grade}</h1>`,
        `<p style="text-align:center"><b>Thời gian làm bài: 90 phút</b><br>Không kể thời gian phát đề</p>`,
        `<h3>PHẦN I. CÂU HỎI</h3>`,
        questions
    ].join('');
}

/** Local keys only: authoritative identities are minted by the server. */
function offlineStructuredExam(prompt: string) {
    const lower = prompt.toLowerCase();
    const subject = lower.includes('văn') ? 'Ngữ văn' : lower.includes('anh') ? 'Tiếng Anh' : 'Toán';
    const grade = (prompt.match(/lớp\s*(\d+)/) ?? [])[1] ?? '9';
    const blocks = [
        { key: 'header', html: '<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG …</b></p><p>TỔ …</p></div><div class="doc-header-col"><p><b>KIỂM TRA</b></p><p>Thời gian: 90 phút</p></div></div>' },
        { key: 'title', html: `<h1>ĐỀ KIỂM TRA ${subject.toUpperCase()} – LỚP ${grade}</h1>` },
        { key: 'time', html: '<p style="text-align:center"><b>Thời gian làm bài: 90 phút</b></p>' },
        { key: 'section', html: '<h3>PHẦN I. CÂU HỎI</h3>' },
    ];
    const questions = Array.from({ length: countQuestions(prompt) }, (_, index) => {
        const n = index + 1;
        const key = `q${n}`;
        blocks.push({ key, html: `<p><b>Câu ${n}.</b> (1,0 điểm) Nội dung câu hỏi số ${n} của đề ${subject} lớp ${grade}.</p>` });
        return { key: `question${n}`, label: `Câu ${n}`, bodyKeys: [key], contextKeys: [] };
    });
    return { blocks, questions };
}
