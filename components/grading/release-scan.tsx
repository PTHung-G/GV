"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Upload, CheckCircle2 } from "lucide-react";
import { gradingApi } from "@/lib/grading-client";
import { decodeSheetQr, readSheet, type RgbaImage } from "@/lib/grading/omr";
import { imageFromFile } from "@/lib/grading/omr-browser";
import type { SheetTemplate } from "@/lib/grading/sheet-template";

type ScanRow = { id: number; code: string; status: string; error?: boolean };
export function ReleaseScan({ releaseId }: { releaseId: string }) {
  const video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null),
    cameraCancelled = useRef(false),
    counter = useRef(0);
  const [camera, setCamera] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [rows, setRows] = useState<ScanRow[]>([]);
  const stop = () => {
    cameraCancelled.current = true;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setCamera(false);
  };
  useEffect(
    () => () => {
      cameraCancelled.current = true;
      stream.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );
  const start = async () => {
    setError("");
    cameraCancelled.current = false;
    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error(
          "Trình duyệt chưa cho mở camera. Dùng nút Chọn ảnh / camera hệ thống bên dưới.",
        );
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1440 },
        },
        audio: false,
      });
      if (cameraCancelled.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = s;
      setCamera(true);
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = s;
          void video.current.play().catch(() => {});
        }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không mở được camera.");
    }
  };
  const process = async (image: RgbaImage, file: File) => {
    setBusy(true);
    setError("");
    const id = counter.current++;
    let code = "";
    setRows((r) =>
      [{ id, code: "", status: "Đang đọc QR…" }, ...r].slice(0, 15),
    );
    const patch = (status: string, err = false) =>
      setRows((r) =>
        r.map((x) => (x.id === id ? { ...x, code, status, error: err } : x)),
      );
    try {
      const qr = decodeSheetQr(image);
      if (!qr)
        throw new Error(
          "Chưa đọc được QR. Chụp đủ bốn góc và rõ mã QR; chưa tạo bài hay tính điểm.",
        );
      const resolved = await gradingApi.post<{
        sessionId: string;
        variantId: string;
        code: string;
        template: SheetTemplate;
      }>(`/api/exam-releases/${releaseId}/resolve`, { qr });
      code = resolved.code;
      patch(`Đã nhận mã ${code}, đang đọc phiếu…`);
      const result = readSheet(image, resolved.template);
      if (
        !result.quality.anchorsFound ||
        result.quality.anchorsSuspect ||
        !result.answers.length
      )
        throw new Error(
          "Chưa đọc chắc chắn bố cục phiếu. Hãy chụp lại thẳng trang, rõ bốn góc; không chuyển sang chấm AI bằng bản đề đoán.",
        );
      if (result.qr !== qr)
        throw new Error(
          "QR thay đổi khi đọc bố cục. Chụp lại riêng một phiếu.",
        );
      const created = await gradingApi.post<{ submission: { id: string } }>(
        `/api/grading/sessions/${resolved.sessionId}/submissions`,
        { qr, examCode: code },
      );
      const form = new FormData();
      form.append("file", file, file.name);
      const uploaded = await gradingApi.postForm<{ warnings?: string[] }>(
        `/api/grading/submissions/${created.submission.id}/pages`,
        form,
      );
      const read = await gradingApi.post<{ warnings?: string[] }>(
        `/api/grading/submissions/${created.submission.id}/omr`,
        {
          answers: result.answers,
          qr,
          sbd: result.sbd?.code ?? null,
          warnings: result.quality.warnings,
        },
      );
      const done = await gradingApi.post<{
        submission: {
          totalScore: number | null;
          status: string;
          studentCode?: string | null;
        };
      }>(`/api/grading/submissions/${created.submission.id}/complete`);
      const doubtful = result.answers.filter((a) => a.flags.length).length;
      patch(
        [
          `Mã ${code}`,
          done.submission.studentCode
            ? `SBD ${done.submission.studentCode}`
            : "Chưa xác định SBD",
          done.submission.totalScore !== null
            ? `${done.submission.totalScore} điểm`
            : "Đã nhận bài",
          done.submission.status === "needs-review" || doubtful
            ? "Cần duyệt lại"
            : "Đã lưu",
          ...(uploaded.warnings ?? []),
          ...(read.warnings ?? []),
        ].join(" · "),
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Không đọc được phiếu.";
      patch(message, true);
      setError(message);
    } finally {
      setBusy(false);
    }
  };
  const capture = async () => {
    if (busy || !video.current) return;
    const v = video.current;
    if (!v.videoWidth) {
      setError("Camera chưa sẵn sàng.");
      return;
    }
    const c = document.createElement("canvas");
    const scale = Math.min(1, 2200 / Math.max(v.videoWidth, v.videoHeight));
    c.width = Math.round(v.videoWidth * scale);
    c.height = Math.round(v.videoHeight * scale);
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const image = ctx.getImageData(0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) =>
      c.toBlob(r, "image/jpeg", 0.94),
    );
    if (!blob) return;
    await process(
      {
        data: image.data,
        width: image.width,
        height: image.height,
        channels: 4,
      },
      new File([blob], "phieu.jpg", { type: "image/jpeg" }),
    );
  };
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h2 className="font-semibold">Chụp chấm nhiều mã đề</h2>
      <p className="mt-1 text-sm text-ink-3">
        Đưa từng phiếu vào khung. QR chọn đúng bản đã chốt trước khi đọc ô tô;
        không cần chọn mã bằng tay. Phiếu thiếu hoặc khác bộ QR sẽ bị từ chối.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {camera ? (
          <button
            onClick={stop}
            disabled={busy}
            className="rounded border border-line px-3 py-2 text-sm"
          >
            Tắt camera
          </button>
        ) : (
          <button
            onClick={() => void start()}
            className="flex items-center gap-2 rounded border border-line px-3 py-2 text-sm"
          >
            <Camera className="size-4" />
            Mở camera
          </button>
        )}
        <label
          className={`flex cursor-pointer items-center gap-2 rounded border border-line px-3 py-2 text-sm ${busy ? "pointer-events-none opacity-40" : ""}`}
        >
          <Upload className="size-4" />
          Chọn ảnh / camera hệ thống
          <input
            type="file"
            accept="image/*"
            capture="environment"
            disabled={busy}
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                setBusy(true);
                const pixels = await imageFromFile(file);
                await process(pixels, file);
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Không mở được ảnh.",
                );
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      </div>
      {camera ? (
        <>
          <video
            ref={video}
            playsInline
            muted
            className="mt-3 max-h-[55dvh] w-full rounded bg-ink object-contain"
          />
          <button
            disabled={busy}
            onClick={() => void capture()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-accent px-4 py-3 font-medium text-white disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
            {busy ? "Đang nhận mã & lưu bài…" : "Chụp phiếu này"}
          </button>
        </>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <ul className="mt-3 space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className={`flex gap-2 rounded border p-2 text-sm ${row.error ? "border-red-200 text-red-700" : "border-line"}`}
          >
            {row.error ? null : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
            )}
            <span>{row.status}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-3">
        Ô mờ, tô nhiều lựa chọn hoặc SBD chưa rõ vẫn cần giáo viên duyệt. Lỗi
        mạng sau khi tạo bài có thể để lại bài nháp; kiểm tra đợt chấm trước khi
        chụp lại.
      </p>
    </section>
  );
}
