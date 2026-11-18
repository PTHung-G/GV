'use client';

/**
 * Live scanner: keep the camera open, watch for a sheet, shoot it by itself.
 *
 * The point is that the teacher never waits on the network. The device reads the
 * sheet while it is still holding it, hands the pixels to a background queue, and
 * the viewfinder is armed again immediately — so the next sheet can go in as soon
 * as the previous one is lifted away.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Camera, Check, Loader2 } from 'lucide-react';
import { gradingApi, GradingApiError, type SubmissionSummary } from '@/lib/grading-client';
import { describeOmr } from '@/lib/grading/omr-browser';
import { readSheet } from '@/lib/grading/omr';
import { FrameGrabber, inspectFrame, shouldFire, guideFor, NOT_FOUND, type Preview } from '@/lib/grading/live-scan';
import type { SheetTemplate } from '@/lib/grading/sheet-template';

/** Small frames for the aiming loop; big ones only when a sheet is captured. */
const PREVIEW_EDGE = 640;
const CAPTURE_EDGE = 1600;
const TICK_MS = 220;
const MAX_ROWS = 8;

type Row = {
  key: number;
  status: 'reading' | 'saving' | 'done' | 'error';
  sbd: string | null;
  studentName: string | null;
  score: number | null;
  note: string;
};

type Props = {
  sessionId: string;
  template: SheetTemplate;
  /** Called once per stored sheet so the parent can keep a counter. */
  onAccepted: () => void;
  /** Camera unavailable — the parent should offer the system camera instead. */
  onFallback: (message: string) => void;
};

export function LiveScan({ sessionId, template, onAccepted, onFallback }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const grabberRef = useRef<FrameGrabber | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const armedRef = useRef(true);
  const heldRef = useRef(0);
  const lastShotRef = useRef(Number.NEGATIVE_INFINITY);
  const chainRef = useRef<Promise<void>>(Promise.resolve());
  const aliveRef = useRef(true);
  const keyRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [preview, setPreview] = useState<Preview>(NOT_FOUND);
  const [rows, setRows] = useState<Row[]>([]);
  const [flash, setFlash] = useState(false);

  const acceptedRef = useRef(onAccepted);
  acceptedRef.current = onAccepted;
  const fallbackRef = useRef(onFallback);
  fallbackRef.current = onFallback;

  const patch = useCallback((key: number, changes: Partial<Row>) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...changes } : row)));
  }, []);

  const capture = useCallback(
    async (video: HTMLVideoElement) => {
      const grabber = grabberRef.current ?? new FrameGrabber();
      grabberRef.current = grabber;

      const shot = await grabber.grabShot(video, CAPTURE_EDGE);
      if (!shot) return;

      const key = keyRef.current++;
      setRows((prev) =>
        [{ key, status: 'reading' as const, sbd: null, studentName: null, score: null, note: '' }, ...prev].slice(0, MAX_ROWS),
      );
      // The confirmation is shown before anything is sent, so the teacher gets
      // feedback in the time it takes to lift the phone away.
      setFlash(true);
      window.setTimeout(() => setFlash(false), 420);

      // Reading happens on this thread (~60 ms) and the queue does the talking.
      const result = readSheet(shot.frame, template);
      patch(key, { sbd: result.sbd?.code ?? null, status: 'saving', note: describeOmr(result) });

      chainRef.current = chainRef.current.then(async () => {
        try {
          if (!shot.blob) throw new Error('Không tạo được ảnh để tải lên.');
          const created = await gradingApi.post<{ submission: { id: string } }>(
            `/api/grading/sessions/${sessionId}/submissions`,
            {},
          );
          const form = new FormData();
          form.append('file', shot.blob, 'phieu.jpg');
          const uploaded = await gradingApi.postForm<{ warnings: string[] }>(
            `/api/grading/submissions/${created.submission.id}/pages`,
            form,
          );

          if (result.quality.anchorsFound && result.answers.length > 0) {
            await gradingApi.post(`/api/grading/submissions/${created.submission.id}/omr`, {
              answers: result.answers,
              qr: result.qr,
              sbd: result.sbd?.code ?? null,
              warnings: result.quality.warnings,
            });
          }

          // One sheet is one paper here: finish it so grading starts without
          // another tap, which is what keeps the queue moving while scanning.
          const done = await gradingApi.post<{ submission: SubmissionSummary }>(
            `/api/grading/submissions/${created.submission.id}/complete`,
          );
          const stored = done.submission;
          patch(key, {
            status: 'done',
            sbd: stored.studentCode ?? result.sbd?.code ?? null,
            studentName: stored.studentName,
            score: stored.totalScore,
            note: [...(uploaded.warnings ?? []), result.quality.warnings.join(' ')].filter(Boolean).join(' '),
          });
          acceptedRef.current();
        } catch (err) {
          patch(key, {
            status: 'error',
            note: err instanceof GradingApiError ? err.message : 'Không gửi được tờ này lên máy chủ.',
          });
        }
      });
    },
    [patch, sessionId, template],
  );

  // ---- camera
  useEffect(() => {
    aliveRef.current = true;
    let cancelled = false;

    (async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        fallbackRef.current('Thiết bị này không mở được camera trực tiếp.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1440 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        setReady(true);
      } catch {
        const message = 'Chưa mở được camera. Hãy cho phép quyền camera rồi thử lại.';
        setCameraError(message);
        fallbackRef.current(message);
      }
    })();

    return () => {
      cancelled = true;
      aliveRef.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  // ---- aiming loop
  useEffect(() => {
    if (!ready) return;
    let timer = 0;

    const tick = () => {
      if (!aliveRef.current) return;
      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        const grabber = grabberRef.current ?? new FrameGrabber();
        grabberRef.current = grabber;
        const frame = grabber.grab(video, PREVIEW_EDGE);
        if (frame) {
          const seen = inspectFrame(frame, template);
          const good =
            seen.found && seen.coverage >= 0.45 && seen.squareness >= 0.55;
          heldRef.current = good ? heldRef.current + 1 : 0;
          setPreview(seen);

          // The sheet leaving the frame is what re-arms the next shot, so the
          // same paper cannot be filed twice by accident.
          if (!seen.found) armedRef.current = true;

          if (
            shouldFire({
              preview: seen,
              heldFrames: heldRef.current,
              sinceLastShotMs: performance.now() - lastShotRef.current,
              armed: armedRef.current,
            })
          ) {
            armedRef.current = false;
            lastShotRef.current = performance.now();
            heldRef.current = 0;
            void capture(video);
          }
        }
      }
      timer = window.setTimeout(tick, TICK_MS);
    };

    tick();
    return () => window.clearTimeout(timer);
  }, [ready, template, capture]);

  const guidance = guideFor(preview, heldRef.current);

  if (cameraError) {
    return (
      <div className="rounded-md border border-danger-soft bg-danger-soft p-4 text-center">
        <AlertTriangle className="mx-auto size-5 text-danger" />
        <p className="mt-2 text-[13px] text-danger">{cameraError}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-md border border-line bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="block max-h-[62vh] w-full object-contain"
        />

        {/* Corner guides: the frame the sheet has to fill before it is shot. */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute inset-[6%] rounded-sm border-2 transition-colors duration-150 ${
              guidance.tone === 'ready'
                ? 'border-ok'
                : guidance.tone === 'closer'
                  ? 'border-warn'
                  : 'border-white/70'
            }`}
          />
          {flash ? <div className="absolute inset-0 bg-white/70" /> : null}
        </div>

        {!ready ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-white" />
          </div>
        ) : null}
      </div>

      <p
        className={`mt-2 text-center text-[13px] ${
          guidance.tone === 'ready'
            ? 'text-ok'
            : guidance.tone === 'closer'
              ? 'text-warn'
              : 'text-ink-3'
        }`}
      >
        {guidance.text}
      </p>

      <button
        type="button"
        onClick={() => {
          const video = videoRef.current;
          if (!video || !ready) return;
          armedRef.current = false;
          lastShotRef.current = performance.now();
          heldRef.current = 0;
          void capture(video);
        }}
        disabled={!ready}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-white py-3 text-[14px] font-medium text-ink disabled:opacity-50"
      >
        <Camera className="size-4" />
        Chụp tay tờ đang đưa vào
      </button>

      {rows.length > 0 ? (
        <div className="mt-3">
          {/* The running total is in the screen header; this list is the log. */}
          <p className="mb-1.5 text-[12px] text-ink-4">Tờ vừa quét</p>
          <ul className="space-y-1">
            {rows.map((row) => (
              <li
                key={row.key}
                className="flex items-center gap-2 rounded-sm border border-line px-2 py-1.5 text-[12.5px]"
              >
                {row.status === 'done' ? (
                  <Check className="size-3.5 shrink-0 text-ok" />
                ) : row.status === 'error' ? (
                  <AlertTriangle className="size-3.5 shrink-0 text-danger" />
                ) : (
                  <Loader2 className="size-3.5 shrink-0 animate-spin text-accent" />
                )}
                <span className="truncate">
                  <b className="font-medium text-ink">
                    {row.studentName ?? (row.sbd ? `SBD ${row.sbd}` : 'Đang đọc…')}
                  </b>
                  {row.score !== null ? (
                    <span className="text-ink-3"> · {row.score} điểm</span>
                  ) : null}
                </span>
                {row.note ? (
                  // A filed sheet can still carry a warning — a repeated student,
                  // an unreadable mark — so it stays on screen, in amber.
                  <span
                    title={row.note}
                    className={`ml-auto max-w-[46%] truncate text-[11.5px] ${
                      row.status === 'error' ? 'text-danger' : 'text-warn'
                    }`}
                  >
                    {row.note}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
