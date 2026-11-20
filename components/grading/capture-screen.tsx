"use client";

/**
 * The phone capture screen.
 *
 * With a printed sheet it opens the live scanner: the camera stays on, a whole
 * sheet is recognised and filed automatically, and the viewfinder re-arms the
 * moment the paper is lifted away. Plain paper falls back to one photo at a time,
 * adding pages, then "Xong bài".
 */
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, Loader2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  gradingApi,
  GradingApiError,
  pageUrl,
  type PageSummary,
  type SubmissionSummary,
} from "@/lib/grading-client";
import { describeOmr, readBestSheetFromFiles } from "@/lib/grading/omr-browser";
import type { SheetTemplate } from "@/lib/grading/sheet-template";
import { shrinkForUpload } from "@/lib/image-client";
import { LiveScan } from "@/components/grading/live-scan";

type CaptureSession = {
  id: string;
  title: string;
  className: string | null;
  mode: string;
  sheetMode: string;
  sheetTemplate: SheetTemplate | null;
};

type Student = { id: string; code: string | null; name: string };

export function CaptureScreen() {
  const [session, setSession] = useState<CaptureSession | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");
  const [current, setCurrent] = useState<SubmissionSummary | null>(null);
  const [doneCount, setDoneCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  /** null until the session loads, so the first paint does not flash the wrong mode. */
  const [live, setLive] = useState<boolean | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await gradingApi.get<{
        session: CaptureSession;
        students: Student[];
      }>("/api/grading/capture");
      setSession(data.session);
      setStudents(data.students);
      // A standard sheet is read on the device, so it can be scanned in a stream.
      // Essays and plain paper still need one photo at a time.
      setLive(
        Boolean(data.session.sheetTemplate) &&
          data.session.mode !== "essay-only",
      );
    } catch (err) {
      setError(
        err instanceof GradingApiError
          ? err.message
          : "Thiết bị chưa được ghép.",
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function ensureSubmission(): Promise<SubmissionSummary | null> {
    if (current) return current;
    const created = await gradingApi.post<{ submission: SubmissionSummary }>(
      `/api/grading/sessions/${session?.id}/submissions`,
      studentId ? { studentId } : {},
    );
    setCurrent(created.submission);
    return created.submission;
  }

  async function onCapture(files: FileList) {
    if (!session) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const submission = await ensureSubmission();
      if (!submission) return;

      const collected: string[] = [];
      const addedPages: PageSummary[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        // Shrink after the on-device read, so OMR still sees full detail.
        form.append("file", await shrinkForUpload(file));
        const result = await gradingApi.postForm<{ page: PageSummary; duplicate?: boolean; warnings: string[] }>(
          `/api/grading/submissions/${submission.id}/pages`,
          form,
        );
        if (!result.duplicate && result.page) {
          addedPages.push(result.page);
        }
        collected.push(...(result.warnings ?? []));
      }

      // A standard sheet can be scored right here on the device: no upload of
      // pixels to a model, and the marks are known before the photo is sent.
      let omrNote = "";
      const fileList = Array.from(files);
      if (session.sheetTemplate && session.mode !== "essay-only" && fileList.length > 0) {
        const result = await readBestSheetFromFiles(fileList, session.sheetTemplate);
        if (result) {
          if (result.quality.anchorsFound && result.answers.length > 0) {
            await gradingApi.post(
              `/api/grading/submissions/${submission.id}/omr`,
              {
                answers: result.answers,
                qr: result.qr,
                sbd: result.sbd?.code ?? null,
                warnings: result.quality.warnings,
              },
            );
          }
          omrNote = ` ${describeOmr(result)}`;
        } else {
          omrNote = " Không đọc được phiếu trên thiết bị, sẽ chấm bằng AI.";
        }
      }

      setCurrent((prev) => {
        const base = prev ?? submission;
        const known = new Set(base.pages.map((p) => p.id));
        const pages = [...base.pages, ...addedPages.filter((p) => !known.has(p.id))];
        return { ...base, pageCount: pages.length, pages };
      });
      setNotice(
        collected.length > 0
          ? `${collected.join(" ")}${omrNote}`
          : `Đã nhận trang.${omrNote} Chụp tiếp hoặc bấm Xong bài.`,
      );
    } catch (err) {
      setError(
        err instanceof GradingApiError ? err.message : "Không tải được ảnh.",
      );
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function finishPaper() {
    if (!current || !session) return;
    setBusy(true);
    setError("");
    try {
      await gradingApi.post(`/api/grading/submissions/${current.id}/complete`);
      setDoneCount((count) => count + 1);
      setCurrent(null);
      setStudentId("");
      setNotice("Đã xong bài. Chụp bài học sinh tiếp theo.");
    } catch (err) {
      setError(
        err instanceof GradingApiError
          ? err.message
          : "Không hoàn tất được bài.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (error && !session) {
    return (
      <div className="mx-auto max-w-sm px-6 py-20 text-center">
        <h1 className="text-[17px] font-semibold text-ink">Thiết bị chưa được ghép</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-3">{error}</p>
        <p className="mt-6 text-[12px] text-ink-4">
          Trên máy tính, mở đợt chấm rồi chọn “Quét bằng điện thoại” để lấy mã ghép.
        </p>
        <Link
          href="/grading/pair"
          className="mt-3 inline-flex h-8 items-center rounded-md border border-line-strong bg-white px-3 text-[13px] font-medium text-ink hover:bg-surface-2"
        >
          Nhập mã ghép
        </Link>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-ink-4" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="rounded-md border border-line bg-white p-3">
        <p className="text-[12px] text-ink-4">Đang quét cho</p>
        <h1 className="text-[15px] font-medium text-ink">
          {session.title}
        </h1>
        <p className="mt-0.5 text-[12.5px] text-ink-3">
          {live ? `Đã nhận ${doneCount} tờ` : `Đã xong ${doneCount} bài`}
          {!live && current ? " · đang chụp 1 bài" : ""}
        </p>
      </div>

      {live && session.sheetTemplate ? (
        <div className="mt-3">
          <LiveScan
            sessionId={session.id}
            template={session.sheetTemplate}
            onAccepted={() => setDoneCount((count) => count + 1)}
            onFallback={() => setLive(false)}
          />
          <button
            type="button"
            onClick={() => setLive(false)}
            className="mt-3 w-full text-center text-[12px] text-ink-4 underline"
          >
            Cách cũ: chụp từng trang rồi tự bấm Xong bài
          </button>
        </div>
      ) : null}

      {live ? null : (
        <>
          {students.length > 0 ? (
            <label className="mt-3 block">
              <span className="mb-1 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-2">
                <UserRound className="size-3.5" />
                Học sinh của bài này
              </span>
              <select
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                disabled={Boolean(current)}
                className="h-10 w-full rounded-md border border-line-strong bg-white px-2 text-[13.5px] text-ink"
              >
                <option value="">— Chưa gán, để sau —</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.code ? `${student.code} · ` : ""}
                    {student.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={(event) =>
              event.target.files && void onCapture(event.target.files)
            }
          />

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-accent py-4 text-[15px] font-medium text-white disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Camera className="size-5" />
            )}
            {current ? "Chụp thêm trang" : "Chụp trang đầu"}
          </button>

          {current && current.pages.length > 0 ? (
            <div className="mt-3">
              <p className="mb-1.5 text-[12px] text-ink-4">
                {current.pages.length} trang đã nhận của bài này
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {current.pages.map((page) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={page.id}
                    src={pageUrl(page.id)}
                    alt={`Trang ${page.pageIndex + 1}`}
                    className="h-24 w-auto rounded-sm border border-line"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {current ? (
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => void finishPaper()}
              disabled={busy}
            >
              <Check className="size-4" />
              Xong bài → Bài tiếp
            </Button>
          ) : null}

          {notice && !live ? (
            <p className="mt-3 text-center text-[12.5px] text-ok">
              {notice}
            </p>
          ) : null}
          {error && session && !live ? (
            <p className="mt-3 text-center text-[12.5px] text-danger">
              {error}
            </p>
          ) : null}
          {session.sheetTemplate && !live ? (
            <button
              type="button"
              onClick={() => setLive(true)}
              className="mt-3 w-full text-center text-[12px] text-ink-4 underline"
            >
              Quay lại quét liên tục
            </button>
          ) : null}
        </>
      )}

      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-ink-4">
        Ảnh được tải lên máy chủ và xử lý ở đó. Bạn có thể khoá điện thoại sau
        khi bấm Xong bài.
      </p>
    </div>
  );
}
