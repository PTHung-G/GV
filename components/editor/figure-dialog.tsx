'use client';

/**
 * Insert a figure into the exam.
 *
 * The dialog only ever sends numbers to the server. Whatever comes back is a
 * drawing that the geometry solver accepted; an impossible figure is refused
 * here, in words the teacher can act on ("A nằm trong đường tròn"), not drawn
 * wrongly and left for a student to notice.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { basePath } from '@/lib/api-url';
import { FIGURE_KINDS, FIGURE_META, type FigureKind, type FigureSpec } from '@/lib/geometry/spec';

type Props = {
  open: boolean;
  initialSpec?: FigureSpec | null;
  onClose: () => void;
  onInsert: (html: string) => void;
};

const DEFAULT_PARAMS: Record<FigureKind, Record<string, number | boolean>> = {
  'triangle-right': { ab: 6, ac: 8, altitude: true },
  'triangle-sides': { a: 5, b: 6, c: 7 },
  'circle-tangents': { r: 2, d: 4 },
  parabola: { a: 1, b: -2, c: -1 },
};

export function FigureDialog({ open, initialSpec, onClose, onInsert }: Props) {
  const [kind, setKind] = useState<FigureKind>('triangle-right');
  const [params, setParams] = useState<Record<string, number | boolean>>(DEFAULT_PARAMS['triangle-right']);
  const [caption, setCaption] = useState('');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (!open) return;
    if (initialSpec && FIGURE_KINDS.includes(initialSpec.kind)) {
      setKind(initialSpec.kind);
      setParams({ ...DEFAULT_PARAMS[initialSpec.kind], ...(initialSpec.params ?? {}) });
      setCaption(initialSpec.caption ?? '');
    } else if (!initialSpec) {
      setKind('triangle-right');
      setParams(DEFAULT_PARAMS['triangle-right']);
      setCaption('');
    }
  }, [open, initialSpec]);

  const spec: FigureSpec = useMemo(() => ({ kind, params, ...(caption ? { caption } : {}) }), [kind, params, caption]);

  const preview = useCallback(async (next: FigureSpec) => {
    const ticket = ++requestId.current;
    setPending(true);
    setError('');
    try {
      const res = await fetch(basePath('/api/figures'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ spec: next }),
      });
      const data = (await res.json()) as { svg?: string; error?: string; reason?: string };
      if (ticket !== requestId.current) return;
      if (!res.ok) {
        setSvg('');
        setError(data.error ?? 'Không vẽ được hình này.');
        return;
      }
      setSvg(data.svg ?? '');
    } catch {
      if (ticket === requestId.current) {
        setError('Không gọi được dịch vụ vẽ hình.');
        setSvg('');
      }
    } finally {
      if (ticket === requestId.current) setPending(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => void preview(spec), 350);
    return () => clearTimeout(timer);
  }, [open, spec, preview]);

  const pickKind = (next: FigureKind) => {
    setKind(next);
    setParams(DEFAULT_PARAMS[next]);
  };

  const setNumber = (key: string, raw: string) => {
    const value = Number(raw.replace(',', '.'));
    setParams((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }));
  };

  const insert = () => {
    if (!svg) return;
    const figure = [
      `<figure class="doc-figure" data-figure="${escapeAttr(JSON.stringify(spec))}">`,
      svg,
      caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : '',
      '</figure>',
      '<p><br></p>',
    ].join('');
    onInsert(figure);
    onClose();
  };

  const meta = FIGURE_META[kind];

  return (
    <Dialog open={open} onClose={onClose} labelledBy="figure-title" className="max-w-[560px]">
      <h2 id="figure-title" className="text-[16px] font-semibold tracking-tight text-ink">
        {initialSpec ? 'Chỉnh sửa hình vẽ' : 'Chèn hình'}
      </h2>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {FIGURE_KINDS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => pickKind(option)}
            aria-pressed={option === kind}
            className={
              option === kind
                ? 'rounded-md bg-accent px-2.5 py-1 text-[12.5px] font-medium text-white'
                : 'rounded-md border border-line-strong bg-surface px-2.5 py-1 text-[12.5px] text-ink hover:bg-surface-2'
            }
          >
            {FIGURE_META[option].label}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[12px] text-ink-3">{meta.description}</p>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        {meta.fields.map((field) => (
          <label key={field.key} className="flex flex-col gap-1 text-[11.5px] text-ink-3">
            {field.label}
            <input
              type="number"
              step="0.5"
              value={String(params[field.key] ?? field.def)}
              onChange={(e) => setNumber(field.key, e.target.value)}
              className="h-8 w-24 rounded-md border border-line-strong bg-surface px-2 text-[13px] text-ink outline-none focus-visible:border-accent"
            />
          </label>
        ))}

        {kind === 'triangle-right' ? (
          <label className="flex h-8 items-center gap-1.5 text-[12.5px] text-ink-2">
            <input
              type="checkbox"
              checked={params.altitude === true}
              onChange={(e) => setParams((prev) => ({ ...prev, altitude: e.target.checked }))}
              className="size-3.5 accent-[var(--color-accent)]"
            />
            Có đường cao AH
          </label>
        ) : null}

        <label className="flex flex-col gap-1 text-[11.5px] text-ink-3">
          Chú thích (không bắt buộc)
          <input
            type="text"
            value={caption}
            placeholder="Hình 1"
            onChange={(e) => setCaption(e.target.value)}
            className="h-8 w-36 rounded-md border border-line-strong bg-surface px-2 text-[13px] text-ink outline-none focus-visible:border-accent"
          />
        </label>
      </div>

      <div className="mt-3 grid min-h-[232px] place-items-center rounded-md border border-line bg-surface-2 p-3">
        {pending && !svg ? <Loader2 className="size-5 animate-spin text-ink-4" /> : null}
        {!pending && !svg && !error ? <span className="text-[12.5px] text-ink-4">Chưa có hình.</span> : null}
        {error ? (
          <p className="max-w-[380px] text-center text-[12.5px] leading-relaxed text-danger">{error}</p>
        ) : null}
        {svg ? (
          <div
            className="w-full [&>svg]:mx-auto [&>svg]:block [&>svg]:h-auto [&>svg]:max-h-[220px] [&>svg]:w-auto [&>svg]:max-w-full"
            // The markup comes from our own renderer, never from user input.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-8 rounded-md px-3 text-[13px] font-medium text-ink-2 hover:bg-surface-3"
        >
          Huỷ
        </button>
        <button
          type="button"
          onClick={insert}
          disabled={!svg || pending}
          className="h-8 rounded-md bg-accent px-3.5 text-[13px] font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {initialSpec ? 'Cập nhật hình' : 'Chèn vào đề'}
        </button>
      </div>
    </Dialog>
  );
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
