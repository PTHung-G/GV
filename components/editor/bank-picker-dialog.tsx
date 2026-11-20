'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Check, Loader2, Search, Sparkles } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { basePath } from '@/lib/api-url';
import { sanitizeExamHtml } from '@/lib/html-sanitize';
import { sourceFragment } from '@/components/question-bank/source-snapshot';
import type { BankEnvelope, BankQuestion } from '@/lib/question-bank/types';
import { descendantTopicIds } from '@/components/question-bank/question-bank';

export type PickedBankNote = {
  id: string;
  label: string;
  content: string;
};

export function BankPickerDialog({
  open,
  onClose,
  onInsertHtml,
  onAttachNotes,
}: {
  open: boolean;
  onClose: () => void;
  onInsertHtml: (html: string) => void;
  onAttachNotes: (notes: PickedBankNote[]) => void;
}) {
  const [envelope, setEnvelope] = useState<BankEnvelope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [topicId, setTopicId] = useState('root');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError('');
    fetch(basePath('/api/question-bank'), { cache: 'no-store' })
      .then(async (r) => {
        const d = (await r.json()) as BankEnvelope & { error?: string };
        if (!r.ok) throw new Error(d.error || 'Chưa tải được kho câu hỏi.');
        if (active) setEnvelope(d);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Chưa tải được kho câu hỏi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  const bank = envelope?.bank ?? null;
  const topicIds = useMemo(
    () => (bank ? descendantTopicIds(bank.nodes, topicId) : new Set<string>()),
    [bank, topicId],
  );

  const items = useMemo(() => {
    if (!bank) return [];
    const term = query.trim().toLocaleLowerCase('vi');
    return bank.questions
      .filter((q) => {
        if (!topicIds.has(q.topicId)) return false;
        const src = bank.sources.find((s) => s.id === q.sourceId);
        const raw = [
          q.label,
          src?.title ?? '',
          q.answer ?? '',
          ...(src ? q.bodyBlockIds.map((id) => src.blocks[id]?.text ?? '') : []),
        ]
          .join(' ')
          .toLocaleLowerCase('vi');
        return !term || raw.includes(term);
      })
      .slice(0, 120);
  }, [bank, query, topicIds]);

  const materializeQuestion = (q: BankQuestion): string => {
    if (!bank) return '';
    if (q.customHtml?.trim()) return sanitizeExamHtml(q.customHtml);
    const src = bank.sources.find((s) => s.id === q.sourceId);
    if (!src) return `<p><b>${q.label}</b></p>`;
    return sanitizeExamHtml(sourceFragment(src, [...q.contextBlockIds, ...q.bodyBlockIds]));
  };

  const handleInsert = () => {
    if (!bank || !selected.length) return;
    const htmlParts = selected
      .map((id) => bank.questions.find((q) => q.id === id))
      .filter((q): q is BankQuestion => Boolean(q))
      .map(materializeQuestion)
      .filter(Boolean);
    if (htmlParts.length) {
      onInsertHtml(htmlParts.join('\n'));
      setSelected([]);
      onClose();
    }
  };

  const handleAttach = () => {
    if (!bank || !selected.length) return;
    const notes: PickedBankNote[] = selected
      .map((id) => bank.questions.find((q) => q.id === id))
      .filter((q): q is BankQuestion => Boolean(q))
      .map((q) => {
        const src = bank.sources.find((s) => s.id === q.sourceId);
        const txt = src
          ? [...q.contextBlockIds, ...q.bodyBlockIds]
              .map((bid) => src.blocks[bid]?.text ?? '')
              .filter(Boolean)
              .join(' ')
          : q.label;
        return { id: q.id, label: q.label, content: txt.slice(0, 1200) };
      });
    if (notes.length) {
      onAttachNotes(notes);
      setSelected([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy="bank-picker-title" className="max-w-3xl p-5">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-accent" />
          <h2 id="bank-picker-title" className="text-base font-semibold text-ink">
            Chọn câu hỏi từ Kho
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs text-ink-3 hover:bg-surface-3"
        >
          Đóng
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5">
          <Search className="size-3.5 text-ink-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm câu hỏi trong kho…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        {bank ? (
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-ink"
          >
            {bank.nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      <div className="mt-3 max-h-[46dvh] space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-ink-4" />
          </div>
        ) : !items.length ? (
          <p className="py-10 text-center text-sm text-ink-3">
            Chưa có câu hỏi phù hợp trong kho của bạn.
          </p>
        ) : (
          items.map((q) => {
            const src = bank?.sources.find((s) => s.id === q.sourceId);
            const checked = selected.includes(q.id);
            const preview = src
              ? q.bodyBlockIds
                  .map((id) => src.blocks[id]?.text ?? '')
                  .join(' ')
                  .trim()
              : '';
            return (
              <label
                key={q.id}
                className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-3 text-sm transition-colors ${
                  checked ? 'border-accent bg-accent-soft' : 'border-line bg-white hover:bg-surface-2'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setSelected((prev) =>
                      e.target.checked ? [...prev, q.id] : prev.filter((x) => x !== q.id),
                    )
                  }
                  className="mt-1 size-4 accent-accent"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{q.label}</span>
                    {q.answer ? (
                      <span className="rounded-sm bg-ok-soft px-1.5 py-0.5 text-[11px] font-medium text-ok">
                        {q.answer}
                      </span>
                    ) : null}
                    {src ? <span className="text-[11.5px] text-ink-4">· {src.title}</span> : null}
                  </div>
                  {preview ? (
                    <p className="mt-1 line-clamp-2 text-xs text-ink-3">{preview}</p>
                  ) : null}
                </div>
              </label>
            );
          })
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span className="text-xs text-ink-3">Đã chọn {selected.length} câu</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!selected.length}
            onClick={handleAttach}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2 disabled:opacity-45"
          >
            <Sparkles className="size-3.5 text-accent" />
            Gửi vào khung chat AI
          </button>
          <button
            type="button"
            disabled={!selected.length}
            onClick={handleInsert}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white hover:bg-accent-hover disabled:opacity-45"
          >
            <Check className="size-3.5" />
            Chèn vào đề đang soạn
          </button>
        </div>
      </div>
    </Dialog>
  );
}
