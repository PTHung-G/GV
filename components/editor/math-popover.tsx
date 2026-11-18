'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** A `math-field` element with the subset of MathLive's API used here. */
type MathField = HTMLElement & {
  value: string;
  setValue: (value: string, options?: { silenceNotifications?: boolean }) => void;
  focus: () => void;
  executeCommand: (command: string) => boolean;
};

export type MathTarget = {
  /** The `span.doc-math` being edited. */
  el: HTMLElement;
  latex: string;
  display: boolean;
  /** Position in page coordinates. */
  top: number;
  left: number;
};

/**
 * Formula editor for a `span.doc-math` in the document.
 *
 * React cannot own the inside of `math-field`, so MathLive is loaded once on the
 * client and the element is driven imperatively. Mirrors the original node view
 * (source-mirror/js/1twhdx9v_bid8.pretty.js): inline/display toggle, delete,
 * cancel, save.
 */
export function MathPopover({
  target,
  onSave,
  onDelete,
  onClose,
}: {
  target: MathTarget;
  onSave: (latex: string, display: boolean) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathField | null>(null);
  const [value, setValue] = useState(target.latex);
  const [display, setDisplay] = useState(target.display);
  const [ready, setReady] = useState(false);

  // Register the custom element once, on the client.
  useEffect(() => {
    let cancelled = false;
    void import('mathlive').then((MathLive) => {
      // Fonts ship in public/mathlive-fonts; without this MathLive looks for
      // them next to its own chunk under /_next/static and 404s.
      // Respect basePath so the editor also works when hosted under a subpath.
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      MathLive.MathfieldElement.fontsDirectory = `${base}/mathlive-fonts`;
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Move the field into the popover and keep it in sync with local state.
  useEffect(() => {
    if (!ready || !hostRef.current) return;
    const field = document.createElement('math-field') as MathField;
    field.value = target.latex;
    field.style.display = 'block';
    field.style.width = '100%';
    field.style.fontSize = '1.125rem';
    field.style.padding = '6px 8px';
    field.style.borderRadius = '4px';
    field.style.background = '#fff';
    field.style.outline = 'none';
    field.addEventListener('input', () => setValue(field.value));
    hostRef.current.appendChild(field);
    fieldRef.current = field;
    // Focus after the element is connected, otherwise MathLive cannot place the caret.
    requestAnimationFrame(() => field.focus());

    return () => {
      field.remove();
      fieldRef.current = null;
    };
  }, [ready, target.latex]);

  // Keep the intrinsic height following the content (fractions are taller).
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.setValue(value, { silenceNotifications: true });
  }, [value, display]);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSave(value, display);
      }
    };
    const onDown = (e: MouseEvent) => {
      const node = e.target as Node | null;
      if (!node) return;
      if (popoverRef.current?.contains(node)) return;
      // Clicking the formula being edited must not close the popover.
      if (target.el.contains(node)) return;
      // MathLive renders its keyboard in a separate top-level element.
      if ((node as HTMLElement).closest?.('math-field, math-virtual-keyboard')) return;
      close();
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('mousedown', onDown, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('mousedown', onDown, true);
    };
  }, [close, onSave, value, display, target.el]);

  return (
    <div
      ref={popoverRef}
      data-math-popover=""
      // Coordinates come from getBoundingClientRect; the container is the viewport.
      style={{ position: 'fixed', top: target.top, left: target.left, width: 384 }}
      className="z-50 max-w-[calc(100vw-2rem)] rounded-md border border-line bg-white p-3 shadow-[var(--shadow-md)]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-ink">Sửa công thức toán</span>
        <div className="flex gap-1 rounded-sm border border-line p-0.5">
          <button
            type="button"
            onClick={() => setDisplay(false)}
            className={cn(
              'rounded-sm px-1.5 py-0.5 text-[11px] font-medium transition',
              !display ? 'bg-ink text-white' : 'text-ink-2 hover:bg-surface-3',
            )}
          >
            Trong dòng
          </button>
          <button
            type="button"
            onClick={() => setDisplay(true)}
            className={cn(
              'rounded-sm px-1.5 py-0.5 text-[11px] font-medium transition',
              display ? 'bg-ink text-white' : 'text-ink-2 hover:bg-surface-3',
            )}
          >
            Riêng dòng
          </button>
        </div>
      </div>

      {/* MathLive renders into its own shadow root and reports its height via
          --mathfield-height; a fixed min-height keeps the popover from jumping. */}
      <div
        ref={hostRef}
        className="relative min-h-[48px] overflow-hidden rounded-sm border border-line focus-within:border-accent [&>math-field]:min-h-[44px]"
      />

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1 rounded-sm border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 aria-hidden className="size-3.5" />
          Xoá
        </button>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded-sm border border-line px-2 py-1 text-xs font-medium text-ink-2 hover:bg-surface-3"
          >
            <X aria-hidden className="size-3.5" />
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => onSave(value, display)}
            className="flex items-center gap-1 rounded-sm bg-ink px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-ink"
          >
            <Check aria-hidden className="size-3.5" />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
