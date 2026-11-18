"use client";
import { useEffect, useRef, useState } from "react";
import { Printer, Loader2, ArrowLeft } from "lucide-react";
import { basePath } from "@/lib/api-url";
import { ReleaseScan } from "./release-scan";
type Detail = {
  id: string;
  title: string;
  createdAt: string;
  warnings: string[];
  variants: Array<{
    id: string;
    code: string;
    sessionId: string;
    mapping: Array<{
      sourceNo: number;
      printedNo: number;
      optionOrder?: string[];
    }>;
    printUrls: { exam: string; key: string; sheet: string };
  }>;
};
export function ReleaseWorkspace({ releaseId }: { releaseId: string }) {
  const [release, setRelease] = useState<Detail | null>(null),
    [error, setError] = useState(""),
    [kind, setKind] = useState<"exam" | "key" | "sheet">("exam"),
    [code, setCode] = useState(""),
    [ready, setReady] = useState(false),
    [pair, setPair] = useState<{ code: string; expiresAt: string } | null>(
      null,
    ),
    [pairBusy, setPairBusy] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    let active = true;
    fetch(basePath(`/api/exam-releases/${releaseId}`))
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Không mở được bộ in.");
        if (active) setRelease(d.release);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [releaseId]);
  const pairing = async () => {
    setPairBusy(true);
    setError("");
    try {
      const r = await fetch(
        basePath(`/api/exam-releases/${releaseId}/pairings`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        },
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Không tạo được mã kết nối.");
      setPair(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không kết nối được.");
    } finally {
      setPairBusy(false);
    }
  };
  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 sm:p-6">
      <a
        href={basePath("/my-exams")}
        className="inline-flex items-center gap-1 text-sm text-ink-3"
      >
        <ArrowLeft className="size-4" />
        Thư viện đề
      </a>
      <header>
        <h1 className="text-xl font-semibold">
          {release?.title ?? "Bộ in đã chốt"}
        </h1>
        {release ? (
          <p className="mt-1 text-xs text-ink-3">
            {release.variants.length} mã đề · Chốt{" "}
            {new Date(release.createdAt).toLocaleString("vi-VN")} · Bản in và
            đáp án giữ nguyên sau khi sửa đề nguồn.
          </p>
        ) : null}
      </header>
      {error ? (
        <p
          role="alert"
          className="rounded border border-red-200 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
      {!release && !error ? <Loader2 className="size-5 animate-spin" /> : null}
      {release ? (
        <>
          <section className="rounded-lg border border-line bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="mr-auto font-semibold">In / Lưu PDF</h2>
              <select
                aria-label="Loại bản in"
                value={kind}
                onChange={(e) => {
                  setKind(e.target.value as typeof kind);
                  setReady(false);
                }}
                className="rounded border border-line px-2 py-2 text-sm"
              >
                <option value="exam">Đề thi</option>
                <option value="key">Đáp án & barem</option>
                <option value="sheet">Phiếu tô trắc nghiệm</option>
              </select>
              <select
                aria-label="Mã đề cần in"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setReady(false);
                }}
                className="rounded border border-line px-2 py-2 text-sm"
              >
                <option value="">Tất cả mã</option>
                {release.variants.map((v) => (
                  <option key={v.id} value={v.code}>
                    Mã {v.code}
                  </option>
                ))}
              </select>
              <button
                disabled={!ready}
                onClick={() => {
                  try {
                    frame.current?.contentWindow?.focus();
                    frame.current?.contentWindow?.print();
                  } catch {
                    setError(
                      "Không mở được in. Thử lại sau khi bản xem trước tải xong.",
                    );
                  }
                }}
                className="flex items-center gap-2 rounded bg-accent px-3 py-2 text-sm text-white disabled:opacity-40"
              >
                <Printer className="size-4" />
                In / Lưu PDF
              </button>
            </div>
            <iframe
              ref={frame}
              title="Bản in bất biến"
              sandbox="allow-same-origin allow-modals"
              src={basePath(
                `/api/exam-releases/${releaseId}/print?kind=${kind}${code ? `&code=${encodeURIComponent(code)}` : ""}`,
              )}
              onLoad={() => setReady(true)}
              className="mt-3 h-[48dvh] w-full rounded border border-line"
            />
            <p className="mt-2 text-xs text-ink-3">
              A4, tỷ lệ 100%, tắt đầu/chân trang. Barem là tài liệu giáo viên,
              in riêng với đề và phiếu.
            </p>
          </section>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <ReleaseScan releaseId={releaseId} />
            <aside className="space-y-4">
              <section className="rounded-lg border border-line bg-white p-4">
                <h2 className="font-semibold">Dùng điện thoại chụp</h2>
                <p className="mt-1 text-xs text-ink-3">
                  Kết nối chỉ được gửi bài cho bộ in này, không mở barem hay các
                  bộ khác.
                </p>
                <button
                  disabled={pairBusy}
                  onClick={() => void pairing()}
                  className="mt-3 rounded border border-line px-3 py-2 text-sm"
                >
                  {pairBusy ? "Đang tạo…" : "Tạo mã kết nối"}
                </button>
                {pair ? (
                  <div className="mt-3 break-words text-sm">
                    <p>
                      Mã: <strong>{pair.code}</strong>
                    </p>
                    <a
                      className="mt-1 block text-accent underline"
                      href={basePath(`/exam-releases/pair/${pair.code}`)}
                    >
                      Mở liên kết kết nối điện thoại
                    </a>
                    <p className="mt-1 text-xs text-ink-3">
                      Hết hạn{" "}
                      {new Date(pair.expiresAt).toLocaleTimeString("vi-VN")}.
                      Liên kết chỉ dùng một lần.
                    </p>
                    <button
                      className="mt-2 text-xs underline"
                      onClick={() =>
                        void navigator.clipboard
                          ?.writeText(
                            `${location.origin}${basePath(`/exam-releases/pair/${pair.code}`)}`,
                          )
                          .catch(() =>
                            setError(
                              "Không sao chép được. Hãy dùng liên kết kết nối.",
                            ),
                          )
                      }
                    >
                      Sao chép liên kết
                    </button>
                  </div>
                ) : null}
              </section>
              <section className="rounded-lg border border-line bg-white p-4">
                <h2 className="font-semibold">Kết quả theo mã</h2>
                <ul className="mt-2 space-y-2 text-sm">
                  {release.variants.map((v) => (
                    <li key={v.id}>
                      <a
                        className="text-accent underline"
                        href={basePath(`/grading/${v.sessionId}`)}
                      >
                        Mã {v.code} — xem & duyệt điểm
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-ink-3">
                  Các mã dùng chung một bộ in, mỗi mã giữ đáp án tương ứng. Bài
                  chấm cần duyệt trước khi công bố điểm.
                </p>
              </section>
            </aside>
          </div>
        </>
      ) : null}
    </main>
  );
}
export function ReleasePair({ code }: { code: string }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const claim = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(
        basePath(
          `/api/exam-releases/pairings/${encodeURIComponent(code)}/claim`,
        ),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        },
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Mã hết hạn hoặc đã được sử dụng.");
      location.assign(basePath("/exam-releases/capture"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không kết nối được.");
      setBusy(false);
    }
  };
  return (
    <main className="mx-auto max-w-md p-5">
      <h1 className="text-xl font-semibold">Kết nối chụp bộ đề</h1>
      <p className="mt-3 text-sm">
        Mã kết nối <strong>{code}</strong>. Thiết bị chỉ được gửi phiếu cho bộ
        đề đã cấp quyền, không xem barem.
      </p>
      <button
        disabled={busy}
        onClick={() => void claim()}
        className="mt-4 rounded bg-accent px-4 py-2 text-white"
      >
        {busy ? "Đang kết nối…" : "Kết nối thiết bị này"}
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </main>
  );
}
export function ReleaseCapture() {
  const [release, setRelease] = useState<{ id: string; title: string } | null>(
      null,
    ),
    [error, setError] = useState("");
  useEffect(() => {
    fetch(basePath("/api/exam-releases/capture"))
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok)
          throw new Error(
            d.error || "Chưa kết nối bộ đề. Hãy mở lại liên kết giáo viên cấp.",
          );
        setRelease(d.release);
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-3">
      <h1 className="text-lg font-semibold">
        {release?.title ?? "Chụp phiếu bộ đề"}
      </h1>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {release ? <ReleaseScan releaseId={release.id} /> : null}
    </main>
  );
}
