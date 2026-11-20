'use client';

/**
 * Shows what the reader actually saw on one scanned page.
 *
 * A teacher who suspects a wrong mark needs more than a final score: they need
 * to know whether the machine locked onto the four corners, which bubbles it
 * sampled, and how dark each one looked. Everything drawn here comes from
 * `inspectSheet`, the same code that produced the grade, so a green bubble here
 * is exactly the bubble that earned the point.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { inspectSheet, type SheetInspection } from '@/lib/grading/omr';
import type { SheetTemplate } from '@/lib/grading/sheet-template';

type Props = {
  imageUrl: string;
  template: SheetTemplate;
  title: string;
  onClose: () => void;
};

/* Overlay colours come from the same tokens as the rest of the app, so the
   inspector never drifts from the palette. */
const GREEN = 'var(--color-ok)';
const BLUE = 'var(--color-accent)';
const RED = 'var(--color-danger)';

export function OmrInspector({ imageUrl, template, title, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<SheetInspection | null>(null);
  const [error, setError] = useState('');
  const [showMarks, setShowMarks] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.decoding = 'async';
    image.src = imageUrl;

    image
      .decode()
      .then(() => {
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('no 2d context');
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const inspection = inspectSheet(
          { width: pixels.width, height: pixels.height, data: pixels.data },
          template,
        );
        if (!cancelled) setResult(inspection);
      })
      .catch(() => {
        if (!cancelled) setError('Không mở được ảnh trang này.');
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl, template]);

  const picked = useMemo(() => {
    const map = new Map<number, string | null>();
    for (const answer of result?.answers ?? []) map.set(answer.q, answer.picked);
    return map;
  }, [result]);

  const markedCount = useMemo(
    () => (result?.answers ?? []).filter((answer) => answer.picked).length,
    [result],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3" role="dialog" aria-modal>
      <div className="flex h-full max-h-[92vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-md bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div>
            <p className="text-[14px] font-semibold text-ink">Máy đọc được gì trên trang này</p>
            <p className="text-[12px] text-ink-3">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-md p-1.5 text-ink-3 hover:bg-surface-3"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="relative flex min-h-0 items-start justify-center overflow-auto rounded-md bg-surface-3 p-2">
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Trang bài làm" className="block max-h-[70vh] w-auto" />
              {result && showMarks ? (
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${result.width} ${result.height}`}
                  preserveAspectRatio="none"
                >
                  {result.qrCorners ? (
                    <polygon
                      points={result.qrCorners.map((corner) => `${corner.x},${corner.y}`).join(' ')}
                      fill="none"
                      stroke="var(--color-warn)"
                      strokeWidth={3}
                      strokeDasharray="10 6"
                    />
                  ) : null}
                  {result.anchors?.map((anchor, index) => {
                    const substituted = result.substitutedCorners.includes(index);
                    return (
                      <rect
                        key={`anchor-${index}`}
                        x={anchor.x - 22}
                        y={anchor.y - 22}
                        width={44}
                        height={44}
                        fill={substituted ? 'rgba(217,115,13,0.18)' : 'rgba(15,123,108,0.18)'}
                        stroke={substituted ? 'var(--color-warn)' : GREEN}
                        strokeWidth={2.5}
                      />
                    );
                  })}
                  {result.sbdMarks.map((mark) => (
                    <circle
                      key={`sbd-${mark.column}-${mark.digit}`}
                      cx={mark.x}
                      cy={mark.y}
                      r={Math.max(mark.radius * 1.1, 4)}
                      fill={mark.picked ? 'rgba(15,123,108,0.5)' : 'none'}
                      stroke={mark.picked ? GREEN : 'rgba(35,131,226,0.55)'}
                      strokeWidth={1.6}
                    />
                  ))}
                  {result.marks.map((mark) => {
                    const choice = picked.get(mark.q) ?? null;
                    let isPicked = choice === mark.label;
                    let ambiguous = choice === null && mark.fill > 18;
                    if (mark.label.includes(':')) {
                      const [prefix, sym] = mark.label.split(':');
                      const subIdx = 'abcd'.indexOf(prefix);
                      if (subIdx >= 0) {
                        const subChar = choice?.[subIdx];
                        isPicked = subChar === sym;
                        ambiguous = (!subChar || subChar === '?' || subChar === '!') && mark.fill > 22;
                      } else {
                        isPicked = mark.fill > 30 && choice !== null && !choice.includes('?');
                        ambiguous = (!choice || choice.includes('?')) && mark.fill > 24;
                      }
                    }
                    return (
                      <circle
                        key={`m-${mark.q}-${mark.label}`}
                        cx={mark.x}
                        cy={mark.y}
                        r={Math.max((mark.radius ?? 6) * 1.1, 4)}
                        fill={isPicked ? 'rgba(15,123,108,0.5)' : 'none'}
                        stroke={ambiguous ? RED : isPicked ? GREEN : 'rgba(35,131,226,0.5)'}
                        strokeWidth={isPicked || ambiguous ? 2.2 : 1.4}
                      />
                    );
                  })}
                </svg>
              ) : null}
              <canvas ref={canvasRef} className="hidden" />
              {!result && !error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <Loader2 className="size-5 animate-spin text-ink-3" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto">
            {error ? <p className="text-[13px] text-danger">{error}</p> : null}

            {result?.anchorsSuspect ? (
              <div className="rounded-md border border-danger bg-danger-soft p-3 text-[12.5px] text-danger">
                <p className="font-semibold">Lớp phủ này sai — đừng tin điểm của trang.</p>
                <ul className="mt-1 space-y-0.5">
                  {result.anchorReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <p className="mt-1 text-[12px] text-danger/80">
                  Trang đã được đánh dấu “cần xem lại”. Chụp lại tờ này (đủ 4 góc, đủ sáng, không chói) rồi
                  chấm lại.
                </p>
              </div>
            ) : null}

            <label className="flex items-center gap-2 text-[12.5px] text-ink-2">
              <input
                type="checkbox"
                checked={showMarks}
                onChange={(event) => setShowMarks(event.target.checked)}
                className="size-3.5 accent-ok"
              />
              Hiện lớp phủ ô đã dò
            </label>

            {result ? (
              <dl className="space-y-1.5 rounded-md border border-line p-3 text-[12.5px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-3">4 điểm neo</dt>
                  <dd
                    className={
                      !result.anchors
                        ? 'font-medium text-danger'
                        : result.anchorSource === 'qr'
                          ? 'font-medium text-warn'
                          : 'font-medium text-ok'
                    }
                  >
                    {!result.anchors
                      ? 'không thấy'
                      : result.anchorSource === 'qr'
                        ? 'định vị bằng mã QR'
                        : 'đã bắt được'}
                  </dd>
                </div>
                {result.substitutedCorners.length > 0 ? (
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink-3">Góc phải bù</dt>
                    <dd className="font-medium text-warn">
                      {result.substitutedCorners.map((index) => index + 1).join(', ')}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-3">Cỡ phiếu trong ảnh</dt>
                  <dd className="font-medium text-ink">{result.scale.toFixed(2)}×</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-3">Số báo danh đọc được</dt>
                  <dd className="font-medium text-ink">{result.sbd?.digits ?? '—'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-3">Mã QR</dt>
                  <dd className="font-medium text-ink">{result.qr ? 'đọc được' : 'không thấy'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-3">Số câu có tô</dt>
                  <dd className="font-medium text-ink">
                    {markedCount}/{result.answers.length}
                  </dd>
                </div>
              </dl>
            ) : null}

            {result?.warnings.length ? (
              <ul className="space-y-1 rounded-md border border-warn-line bg-warn-soft p-3 text-[12px] text-warn">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}

            {result && result.answers.length > 0 ? (
              <div className="min-h-0 flex-1">
                <p className="mb-1 text-[12px] text-ink-4">Từng câu</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
                  {result.answers.map((answer) => {
                    const fills = result.marks.filter((mark) => mark.q === answer.q);
                    const darkest = fills.reduce(
                      (best, mark) => (mark.fill > (best?.fill ?? -Infinity) ? mark : best),
                      fills[0],
                    );
                    return (
                      <div key={answer.q} className="flex items-baseline justify-between gap-2">
                        <span className="text-ink-3">Câu {answer.q}</span>
                        <span
                          className={
                            answer.picked
                              ? 'font-semibold text-ok'
                              : answer.flags.length
                                ? 'font-semibold text-danger'
                                : 'text-ink-4'
                          }
                        >
                          {answer.picked ?? 'trống'}
                        </span>
                        <span className="text-[11px] text-ink-4">
                          {darkest ? Math.round(darkest.fill) : 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-ink-4">
                  Số bên phải là độ chênh sáng giữa ô và nền giấy (0–255): càng lớn càng chắc là có tô. Ô
                  viền xanh là ô máy chọn; viền đỏ là ô đậm nhưng không được chọn (có thể tô hai ô). Khung
                  cam nét đứt là mã QR máy dùng để định vị tờ; góc cam là góc bị mất, đã suy ra từ mã QR.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
