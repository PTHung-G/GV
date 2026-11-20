'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { basePath } from '@/lib/api-url';
import { ArrowUp, ChevronsRight, Image as ImageIcon, Loader2, Paperclip, Plus, RotateCcw, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { reconcileStructure, type StructuredExam } from '@/lib/structured-exam';
import { generateExam, planExam, verifyExam, ApiError } from '@/lib/chat-exam-client';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
  stage?: string;
  status?: string;
  /** Steps the assistant announced for this turn. */
  steps?: string[];
  startedAt?: number;
  failed?: boolean;
  applied?: boolean;
  issues?: string[];
  payload?: { html: string; action: 'replace' | 'append'; structure?: StructuredExam };
};

/** Shown until the server suggests something better. */
const SUGGESTIONS = [
  'Tạo đề thi giữa kỳ Toán lớp 9 gồm 5 câu tự luận',
  'Giải đề trong trang và viết đáp án, barem chi tiết',
  'Soát lỗi chính tả và định dạng của đề này',
];

const LEVELS = ['Nhanh', 'Trung bình', 'Kỹ'] as const;

const REASONING = { Nhanh: 'fast', 'Trung bình': 'balanced', Kỹ: 'deep' } as const;

export function AiPanel({
  docId,
  examTitle,
  examContent,
  onClose,
  onApply,
  onReplace,
  onOpenFigure,
  onOpenBank,
  bankNotes = [],
  onRemoveBankNote,
}: {
  docId: string;
  examTitle?: string;
  examContent?: string;
  onClose: () => void;
  onApply: (html: string, structure?: StructuredExam) => void;
  onOpenFigure: () => void;
  onReplace: (html: string, structure?: StructuredExam) => void;
  onOpenBank?: () => void;
  bankNotes?: Array<{ id: string; label: string; content: string }>;
  onRemoveBankNote?: (id: string) => void;
}) {
  const { user, openDialog } = useAuth();
  const [conversationId, setConversationId] = useState('');
  const [sessions, setSessions] = useState<Array<{ id: string; preview?: string; current?: boolean }>>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const identity = `${user?.id ?? 'guest'}:${docId}`;
  const identityRef = useRef(identity);
  identityRef.current = identity;
  const contentRef = useRef(examContent);
  contentRef.current = examContent;
  const selectedRef = useRef('');
  const loadSequence = useRef(0);
  const activeRef = useRef<{ id: string; conversation: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTIONS);
  const [input, setInput] = useState('');
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('Trung bình');
  const [busy, setBusy] = useState(false);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [attachedOcr, setAttachedOcr] = useState<{ count: number; content: string } | null>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);
  // Re-renders once a second while a turn runs, so the elapsed counter ticks
  // instead of jumping only when a progress frame happens to arrive.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [busy]);

  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);



  // Ask the server for suggestions on document open, title change, or completed AI turn —
  // never on every keystroke while the teacher types in the editor.
  const assistantDoneCount = messages.filter((m) => m.role === 'assistant' && m.status === 'done').length;
  useEffect(() => {
    const exam = contentRef.current ?? '';
    const controller = new AbortController();
    const questionCount = (exam.match(/Câu\s*\d+/g) ?? []).length;
    const blockCount = (exam.match(/<(p|h1|h2|h3|div|li|table)\b/gi) ?? []).length;
    fetch(basePath('/api/suggestions'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        examTitle: questionCount > 0 ? examTitle : '',
        questionCount,
        blockCount,
        hasAnswers: /đáp án|hướng dẫn chấm|barem/i.test(exam),
        refresh: false,
      }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { suggestions?: string[] } | null) => {
        if (data?.suggestions?.length) setSuggestions(data.suggestions);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [docId, user?.id, examTitle, assistantDoneCount]);

  async function api(path: string, method = 'GET', body?: unknown, signal?: AbortSignal) {
    const response = await fetch(basePath(path), { method, headers: { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body), signal });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Không lưu được hội thoại.');
    return json;
  }

  const loadConversation = async (selected?: string, fresh = false) => {
    const owner = identity;
    const sequence = ++loadSequence.current;
    setLoading(true); setLoadError('');
    try {
      const data = fresh
        ? await api('/api/conversations', 'POST', { docId })
        : await api(`/api/conversations?docId=${encodeURIComponent(docId)}${selected ? `&conversationId=${selected}` : ''}`);
      if (identityRef.current !== owner || sequence !== loadSequence.current) return;
      selectedRef.current = data.conversation.id;
      setConversationId(data.conversation.id);
      setMessages(data.conversation.messages);
      setSessions(data.conversations ?? []);
      setBusy(data.conversation.messages.some((m: Message) => m.status === 'running'));
    } catch (error) { if (identityRef.current === owner) setLoadError((error as Error).message); }
    finally { if (identityRef.current === owner) setLoading(false); }
  };
  useEffect(() => {
    abortRef.current?.abort();
    activeRef.current = null;
    selectedRef.current = '';
    setMessages([]); setInput(''); setConversationId(''); setBusy(false);
    if (user) void loadConversation(); else setLoading(false);
    return () => {
      abortRef.current?.abort();
      const active = activeRef.current;
      if (active) void fetch(basePath(`/api/conversations/${active.conversation}/turns/${active.id}`), {
        method: 'PATCH', headers: { 'content-type': 'application/json' }, keepalive: true,
        body: JSON.stringify({ status: 'cancelled', text: 'Đã dừng khi rời tài liệu.' }),
      }).catch(() => {});
    };
  }, [identity]); // Account and document boundaries never share client state.

  useEffect(() => {
    if (!user || !conversationId) return;
    const refresh = async () => {
      if (activeRef.current || document.visibilityState === 'hidden') return;
      const owner = identity;
      try {
        const data = await api(`/api/conversations?docId=${encodeURIComponent(docId)}&conversationId=${conversationId}`);
        if (identityRef.current === owner && selectedRef.current === conversationId && !activeRef.current) {
          setMessages(data.conversation.messages);
          setSessions(data.conversations ?? []);
          setBusy(data.conversation.messages.some((m: Message) => m.status === 'running'));
        }
      } catch { /* keep visible history on transient failures */ }
    };
    const timer = setInterval(refresh, 3000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [identity, conversationId]);

  const processOcrFiles = async (files: File[]) => {
    const valid = files.filter((f) => f.type.startsWith('image/')).slice(0, 6);
    if (!valid.length) return;
    if (!user) {
      openDialog('Đăng nhập để đọc ảnh đề thi');
      return;
    }
    setOcrBusy(true);
    setLoadError('');
    try {
      const encoded = await Promise.all(
        valid.map(
          (file) =>
            new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const raw = String(reader.result ?? '');
                const comma = raw.indexOf(',');
                resolve({ data: comma >= 0 ? raw.slice(comma + 1) : raw, mimeType: file.type || 'image/png' });
              };
              reader.onerror = () => reject(new Error('Không đọc được tệp ảnh.'));
              reader.readAsDataURL(file);
            }),
        ),
      );
      const res = await fetch(basePath('/api/exam-image'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ images: encoded }),
      });
      const json = (await res.json()) as { exam?: { content?: string }; error?: string };
      if (!res.ok || !json.exam?.content?.trim()) {
        throw new Error(json.error ?? 'Không trích xuất được nội dung từ ảnh.');
      }
      setAttachedOcr({ count: valid.length, content: json.exam.content });
      if (!input.trim()) {
        setInput('Chuyển đề thi từ ảnh đính kèm thành bản A4 hoàn chỉnh.');
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Không đọc được ảnh đề thi.');
    } finally {
      setOcrBusy(false);
    }
  };

  const cancel = async () => {
    const active = activeRef.current;
    if (!active) {
      const pending = messages.find((m) => m.role === 'assistant' && m.status === 'running');
      if (pending) await api(`/api/conversations/${conversationId}/turns/${pending.id}`, 'PATCH', { status: 'cancelled', text: 'Đã dừng yêu cầu.' });
    } else {
      abortRef.current?.abort();
      await api(`/api/conversations/${active.conversation}/turns/${active.id}`, 'PATCH', { status: 'cancelled', text: 'Đã dừng yêu cầu.' });
      abortRef.current?.abort();
    }
    setBusy(false); void loadConversation(conversationId);
  };

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!user) { openDialog(); return; }
    if (!prompt || busy || loading || !conversationId || activeRef.current) return;
    if (sessions.find(s => s.id === conversationId)?.current === false) { setLoadError('Hội thoại này đã lưu trữ. Hãy chọn hội thoại hiện tại hoặc bắt đầu hội thoại mới.'); return; }
    setInput('');
    setBusy(true);
    const owner = identity;
    const controller = new AbortController();
    abortRef.current = controller;
    const session = conversationId;
    let finalMessage: Message | undefined;
    let started = false;
    let generated = false;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: prompt };
    const botId = crypto.randomUUID();
    activeRef.current = { id: botId, conversation: session };
    setMessages((m) => [
      ...m,
      userMsg,
      { id: botId, role: 'assistant', text: '', streaming: true, stage: 'plan', startedAt: Date.now() },
    ]);

    finalMessage = { id: botId, role: 'assistant', text: '' };
    const patch = (fn: (msg: Message) => Message) => {
      finalMessage = fn(finalMessage!);
      if (identityRef.current === owner) setMessages((m) => m.map((msg) => (msg.id === botId ? fn(msg) : msg)));
    };

    try {
      const saved = await api(`/api/conversations/${session}/turns`, 'POST', { turnId: botId, prompt });
      started = true;
      const history = saved.history ?? [];
      // Step 1 — planner decides proceed / clarify / confirm / reject.
      const planned = await planExam({
        message: prompt,
        conversationId: session,
        turnId: botId,
        plannerHistory: history,
        exam: examContent ? { title: examTitle, content: examContent } : undefined,
        reasoning: REASONING[level],
      }, controller.signal);

      const planSteps = Array.isArray(planned.steps) ? planned.steps : [];
      if (planSteps.length) {
        patch((m) => ({ ...m, steps: planSteps }));
      }

      if (planned.decision === 'reject') {
        patch((m) => ({
          ...m,
          text: planned.reply || 'Tôi chỉ hỗ trợ các việc liên quan tới soạn và sửa đề thi.',
          streaming: false,
          stage: undefined,
        }));
        return;
      }
      if (planned.decision === 'clarify') {
        const q = (planned.clarifications[0] as { question?: string } | undefined)?.question ?? '';
        const opts = (planned.clarifications[0] as { options?: string[] } | undefined)?.options ?? [];

        // Prefer making a reasonable attempt over interrogating the teacher.
        // Only ask when the planner could not even sketch a prompt to work from.
        if (!planned.templatePrompt) {
          patch((m) => ({
            ...m,
            text: [planned.reply || q, opts.length ? `\nGợi ý: ${opts.join(' / ')}` : '']
              .filter(Boolean)
              .join('\n'),
            streaming: false,
            stage: undefined,
          }));
          return;
        }

        // The planner could sketch a prompt, so generate instead of asking —
        // assumptions are stated by the model in its own reply.
        patch((m) => ({
          ...m,
          text: '',
          streaming: false,
          stage: 'generating',
        }));
      }

      const ocrSnapshot = attachedOcr;
      const contextNotes = [
        ...(ocrSnapshot ? [`Nội dung đề đọc từ ${ocrSnapshot.count} ảnh đính kèm:\n${ocrSnapshot.content}`] : []),
        ...bankNotes.map((n) => `Câu/ngữ liệu từ kho (${n.label}):\n${n.content}`),
      ];
      setAttachedOcr(null);

      // Step 2 — generation streams SSE; deltas are appended as they arrive.
      patch((m) => ({ ...m, stage: 'generating' }));
      const result = await generateExam(
        {
          messages: history,
          conversationId: session,
          turnId: botId,
          currentExam: examContent ? { title: examTitle, content: examContent } : undefined,
          examTitle,
          contextSource: examContent ? 'current_exam' : 'none',
          ...(planned.action ? { action: planned.action } : {}),
          ...(contextNotes.length ? { contextNotes } : {}),
          prompt: planned.templatePrompt || prompt,
          planned: true,
          planSteps,
          reasoning: REASONING[level],
        },
        {
          onProgress: (p) =>
            patch((m) => ({
              ...m,
              stage: p.stage,
              status: p.message,
            })),
          onDelta: (d) => patch((m) => ({ ...m, text: m.text + d.text })),
          onReset: () => patch((m) => ({ ...m, text: '' })),
        },
        controller.signal,
      );

      generated = true;
      controller.signal.throwIfAborted();
      const html = result.exam?.content ?? result.content ?? '';
      const structure = reconcileStructure(html, result.exam?.structure ?? result.structure) ?? undefined;

      // Step 3 — verify the generated markup before offering to apply it.
      patch((m) => ({ ...m, stage: 'verify', status: 'Đang kiểm tra cấu trúc đề…' }));
      let issues: string[] = [];
      try {
        const check = await verifyExam(html, result.action);
        issues = (check.issues ?? []).map((i) => i.message);
      } catch {
        /* verification is advisory */
      }

      // An empty document has nothing to protect, so write the draft straight
      // in — otherwise the result sits behind a button the teacher cannot see
      // and the page stays blank while the assistant claims success.
      controller.signal.throwIfAborted();
      const docWasEmpty = !examContent?.trim() && !contentRef.current?.trim() && identityRef.current === owner && selectedRef.current === session;
      if (docWasEmpty && html.trim()) {
        if (result.action === 'replace') onReplace(html, structure);
        else onApply(html, structure);
      }

      patch((m) => ({
        ...m,
        text: docWasEmpty
          ? 'Đã soạn xong và điền vào đề. Thầy cô xem và chỉnh tiếp nhé.'
          : result.reply || 'Đã soạn xong.',
        streaming: false,
        stage: undefined,
        status: undefined,
        payload: { html, action: result.action, ...(structure ? { structure } : {}) },
        applied: docWasEmpty,
        issues,
      }));
    } catch (err) {
      const message = controller.signal.aborted ? 'Đã dừng yêu cầu.' : err instanceof Error ? err.message : 'Đã có lỗi khi kết nối trợ lý. Hãy thử lại.';
      patch((m) => ({ ...m, text: message, streaming: false, stage: undefined, failed: true }));
    } finally {
      try {
        if (started && finalMessage && generated && !controller.signal.aborted) {
          if (finalMessage.applied) await api(`/api/conversations/${session}/turns/${botId}`, 'PATCH', { applied: true });
        } else if (started && finalMessage) await api(`/api/conversations/${session}/turns/${botId}`, 'PATCH', {
          text: finalMessage.text, payload: finalMessage.payload, issues: finalMessage.issues,
          applied: finalMessage.applied, failed: finalMessage.failed,
          status: controller.signal.aborted ? 'cancelled' : finalMessage.failed ? 'failed' : 'completed',
        });
      } catch { if (identityRef.current === owner) void loadConversation(session); }
      if (activeRef.current?.id === botId) activeRef.current = null;
      if (identityRef.current === owner) setBusy(false);
    }
  };

  return (
    <aside
      aria-label="Trợ lý AI"
      className="no-print flex w-[392px] shrink-0 flex-col border-l border-line bg-white max-lg:fixed max-lg:inset-y-14 max-lg:right-0 max-lg:z-30 max-lg:w-[min(92vw,392px)] max-lg:shadow-[var(--shadow-md)]"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-3">
        {/* Same affordance as the reference: the chevron sits on the panel's
            inner edge and points at the side it collapses toward. */}
        <button
          type="button"
          aria-label="Ẩn trợ lý AI"
          title="Thu gọn trợ lý AI"
          onClick={onClose}
          className="grid size-7 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink"
        >
          <ChevronsRight className="size-[17px]" />
        </button>
        <h2 className="text-[15px] font-semibold text-ink">Trợ lý AI soạn đề</h2>
        <a
          href={basePath('/memory')}
          target="_blank"
          title="Trợ lý đang dùng trí nhớ ra đề của bạn. Bấm để xem, sửa hoặc tắt."
          className="flex items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent hover:bg-accent-soft"
        >
          <span className="size-1.5 rounded-full bg-accent" aria-hidden /> Trí nhớ
        </a>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Làm mới hội thoại"
            disabled={busy || loading || !user}
            onClick={() => void loadConversation(undefined, true)}
            className="grid size-7 place-items-center rounded-md text-ink-3 hover:bg-surface-3"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {!user && <button className="m-3 text-sm text-accent" onClick={() => openDialog()}>Đăng nhập để lưu và đồng bộ hội thoại</button>}
      {user && sessions.length > 0 && <select aria-label="Phiên hội thoại" value={conversationId} disabled={busy || loading} className="m-3 rounded-md border border-line p-1 text-xs" onChange={(e) => void loadConversation(e.target.value)}>
        {sessions.map((session, index) => <option key={session.id} value={session.id}>{session.preview || `Hội thoại ${sessions.length - index}`}</option>)}
      </select>}
      {loading && <p role="status" className="px-4 text-xs text-ink-3">Đang tải lịch sử…</p>}
      {loadError && <p role="alert" className="px-4 text-xs text-danger">{loadError} <button onClick={() => void loadConversation()}>Thử tải lại</button></p>}
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-ink-4 uppercase">
              Gợi ý
            </p>
            <div className="space-y-2" data-suggestions="">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="block w-full rounded-md border border-line px-3 py-2 text-left text-[13px] leading-snug text-ink hover:border-line-strong hover:bg-surface-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-md rounded-br-sm bg-surface-3 px-3 py-2 text-[13.5px] leading-relaxed text-ink">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="group">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-medium text-accent">
                    <Sparkles className="size-3.5" aria-hidden /> Trợ lý
                  </div>
                  <div className="text-[13.5px] leading-relaxed whitespace-pre-wrap text-ink">
                    {m.text}
                    {m.streaming && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-accent align-middle" />}
                  </div>
                  {!m.streaming && (m.failed || ['failed', 'cancelled', 'interrupted'].includes(m.status ?? '')) && (
                    <button type="button" disabled={busy || loading} className="mt-2 text-xs text-accent disabled:opacity-50" onClick={() => {
                      const index = messages.findIndex(item => item.id === m.id);
                      const prompt = messages.slice(0, index).reverse().find(item => item.role === 'user')?.text;
                      if (prompt) void send(prompt);
                    }}>Thử lại yêu cầu</button>
                  )}
                  {!m.streaming && m.payload && (
                    <div className="mt-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (m.applied || identityRef.current !== identity || selectedRef.current !== conversationId) return;
                          if (m.payload!.action === 'replace') onReplace(m.payload!.html, reconcileStructure(m.payload!.html, m.payload!.structure) ?? undefined);
                          else onApply(m.payload!.html, reconcileStructure(m.payload!.html, m.payload!.structure) ?? undefined);
                          setMessages((current) => current.map((item) => item.id === m.id ? { ...item, applied: true } : item));
                          void api(`/api/conversations/${conversationId}/turns/${m.id}`, 'PATCH', { applied: true }).catch((error) => setLoadError(error.message));
                        }}
                        className="rounded-md bg-accent px-2.5 py-1 text-[12px] font-medium text-white hover:bg-accent-hover"
                      >
                        {m.applied ? 'Đã áp dụng' : m.payload.action === 'replace' ? 'Thay vào đề' : 'Chèn vào đề'}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(m.payload!.html)}
                        className="rounded-md border border-line px-2 py-1 text-[12px] text-ink-2 hover:bg-surface-3"
                      >
                        Sao chép
                      </button>
                    </div>
                  )}
                </div>
              ),
            )}
            {messages.map((m) => {
              if (m.role !== 'assistant' || (!m.stage && !m.issues?.length)) return null;
              return (
                <div key={`${m.id}-stage`}>
                  {m.stage && (
                    <div className="text-[12.5px] leading-relaxed" data-ai-progress="">
                      <p role="status" aria-live="polite" className="flex items-start gap-2 text-ink-2">
                        <Loader2 aria-hidden className="mt-0.5 size-3.5 shrink-0 animate-spin text-accent" />
                        <span className="flex-1">
                          {m.status ?? (m.stage === 'plan' ? 'Đang đọc yêu cầu và lập kế hoạch…' : 'Đang soạn đề…')}
                        </span>
                        {m.startedAt ? (
                          <span aria-hidden className="tabular-nums text-[11.5px] text-ink-4">
                            {Math.max(0, Math.floor((Date.now() - m.startedAt) / 1000))}s
                          </span>
                        ) : null}
                      </p>
                      {!!m.steps?.length && (
                        <details className="mt-1.5 pl-[22px] text-[12px] text-ink-3">
                          <summary className="cursor-pointer">Kế hoạch soạn đề</summary>
                          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
                            {m.steps.map((label, i) => <li key={`${m.id}-s${i}`}>{label}</li>)}
                          </ol>
                        </details>
                      )}
                    </div>
                  )}
                  {!!m.issues?.length && (
                    <p className="mt-1 text-[12px] text-warn">Lưu ý: {m.issues.join(' ')}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-line px-3 pt-2 pb-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-semibold tracking-wide text-ink-4 uppercase">Nguồn cho trợ lý</span>
          <button
            type="button"
            onClick={onOpenBank}
            className="text-[11.5px] text-ink-3 hover:text-ink"
          >
            Chọn đề mẫu, ma trận từ kho tài liệu
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenBank}
            className="flex h-8 items-center gap-1.5 rounded-md border border-dashed border-line-strong px-2.5 text-[12.5px] text-ink-2 hover:bg-surface-2"
          >
            <Plus className="size-3.5" /> Thêm từ kho
          </button>
          {bankNotes.map((note) => (
            <span
              key={note.id}
              className="inline-flex h-7 max-w-[170px] items-center gap-1 rounded-md bg-accent-soft px-2 text-[11.5px] font-medium text-accent"
            >
              <span className="truncate">{note.label}</span>
              {onRemoveBankNote ? (
                <button
                  type="button"
                  aria-label={`Bỏ ${note.label}`}
                  onClick={() => onRemoveBankNote(note.id)}
                  className="hover:text-ink"
                >
                  <X className="size-3" />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      {busy && <button className="mx-3 mt-2 text-xs text-danger" onClick={() => void cancel().catch((error) => setLoadError(error.message))}>Dừng yêu cầu</button>}
      <div className="shrink-0 p-3">
        {(ocrBusy || attachedOcr) ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-md border border-line bg-surface-2 px-2.5 py-1.5 text-[12px] text-ink-2">
            {ocrBusy ? (
              <span className="flex items-center gap-1.5"><Loader2 className="size-3.5 animate-spin text-accent" /> Đang đọc ảnh đề thi…</span>
            ) : (
              <>
                <span className="truncate font-medium text-ink">Đã đọc {attachedOcr!.count} ảnh đề đính kèm</span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!attachedOcr) return;
                      onApply(attachedOcr.content);
                      setAttachedOcr(null);
                    }}
                    className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent hover:bg-surface-3"
                  >
                    Chèn vào đề
                  </button>
                  <button
                    type="button"
                    aria-label="Xoá ảnh đính kèm"
                    onClick={() => setAttachedOcr(null)}
                    className="text-ink-3 hover:text-ink"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
        <input
          ref={ocrInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const list = e.target.files ? Array.from(e.target.files) : [];
            e.target.value = '';
            if (list.length) void processOcrFiles(list);
          }}
        />
        <div className="rounded-md border border-line-strong bg-white p-2.5 shadow-xs focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={(e) => {
              const items = Array.from(e.clipboardData?.items ?? []);
              const imgs = items
                .filter((it) => it.kind === 'file' && it.type.startsWith('image/'))
                .map((it) => it.getAsFile())
                .filter((f): f is File => f !== null);
              if (imgs.length) {
                e.preventDefault();
                void processOcrFiles(imgs);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            aria-label="Nhập yêu cầu cho trợ lý AI"
            placeholder="Nhập yêu cầu tạo, sửa, giải đề thi..."
            className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-ink outline-none placeholder:text-ink-4"
          />
          <div className="mt-1 flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenFigure}
              aria-label="Chèn hình vào đề"
              title="Chèn hình vào đề"
              className="grid size-7 place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink"
            >
              <ImageIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Chọn tệp đính kèm"
              title="Tải ảnh đề thi để AI đọc (OCR)"
              disabled={ocrBusy}
              onClick={() => ocrInputRef.current?.click()}
              className="grid size-7 place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink disabled:opacity-50"
            >
              <Paperclip className="size-4" />
            </button>
            <div className="ml-auto flex items-center gap-1.5">
              <select
                aria-label="Mức suy luận"
                value={level}
                onChange={(e) => setLevel(e.target.value as (typeof LEVELS)[number])}
                className="h-7 rounded-md border border-line bg-white px-1.5 text-[12px] text-ink-2 outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Gửi"
                onClick={() => send(input)}
                disabled={!input.trim() || busy || loading || !conversationId}
                className={cn(
                  'grid size-7 place-items-center rounded-full text-white transition-colors',
                  input.trim() && !busy ? 'bg-accent hover:bg-accent-hover' : 'bg-line-strong',
                )}
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink-4">
          Trợ lý AI có thể mắc sai sót. Hãy kiểm tra kỹ nội dung nhé.
        </p>
      </div>
    </aside>
  );
}
