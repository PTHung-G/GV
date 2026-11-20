"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { Printer, Loader2, ArrowLeft, Download, Users } from "lucide-react";
import { basePath } from "@/lib/api-url";
import { AppFrame } from "@/components/shell/app-frame";
import { ShellHeader } from "@/components/shell/app-shell";
import { ReleaseScan } from "./release-scan";
type Detail = {
  id: string;
  title: string;
  classId?: string | null;
  className?: string | null;
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
type GradebookPayload = {
  rows: Array<{
    studentId: string | null;
    studentCode: string | null;
    studentName: string;
    identityStatus: string;
    examCode: string | null;
    sessionId: string | null;
    submissionId: string | null;
    mcScore: number | null;
    essayScore: number | null;
    totalScore: number | null;
    status: string;
  }>;
  stats: {
    totalRows: number;
    submitted: number;
    confirmed: number;
    average: number | null;
    highest: number | null;
    lowest: number | null;
  };
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
    [pairQr, setPairQr] = useState(""),
    [pairBusy, setPairBusy] = useState(false),
    [activeTab, setActiveTab] = useState<"overview" | "gradebook">("overview"),
    [savedClasses, setSavedClasses] = useState<Array<{ id: string; name: string; studentCount: number }>>([]),
    [gradebook, setGradebook] = useState<GradebookPayload | null>(null),
    [gbBusy, setGbBusy] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const loadGradebook = useCallback(() => {
    setGbBusy(true);
    fetch(basePath(`/api/exam-releases/${releaseId}/gradebook`), { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (r.ok) setGradebook(d);
      })
      .catch(() => {})
      .finally(() => setGbBusy(false));
  }, [releaseId]);
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
    fetch(basePath("/api/classes"), { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { classes?: Array<{ id: string; name: string; studentCount: number }> }) => {
        if (active && d.classes) setSavedClasses(d.classes);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [releaseId]);
  useEffect(() => {
    if (activeTab === "gradebook") loadGradebook();
  }, [activeTab, loadGradebook]);
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
      const url = `${window.location.origin}${basePath(`/exam-releases/pair/${d.code}`)}`;
      setPairQr(await QRCode.toDataURL(url, { width: 220, margin: 1 }).catch(() => ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không kết nối được.");
    } finally {
      setPairBusy(false);
    }
  };
  return (
    <AppFrame>
      <ShellHeader
        title={release?.title ?? "Bộ mã đề đã chốt"}
        subtitle={
          release
            ? `${release.variants.length} mã đề${release.className ? ` · Lớp ${release.className}` : ""}`
            : undefined
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl min-w-0 space-y-4 p-3 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/exam-releases"
              className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-accent"
            >
              <ArrowLeft className="size-4" />
              Danh sách bộ mã đề
            </Link>
            {release ? (
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs text-ink-3">
                  <Users className="size-3.5" />
                  <span>Lớp:</span>
                  <select
                    aria-label="Gắn lớp cho bộ mã đề"
                    value={release.classId ?? ""}
                    onChange={(e) => {
                      const classId = e.target.value || null;
                      void fetch(basePath(`/api/exam-releases/${releaseId}`), {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ classId }),
                      })
                        .then((r) => r.json())
                        .then((d: { release?: Detail }) => {
                          if (d.release) setRelease(d.release);
                          if (activeTab === "gradebook") loadGradebook();
                        });
                    }}
                    className="rounded-md border border-line bg-white px-2 py-1 text-xs text-ink"
                  >
                    <option value="">Chưa gắn lớp</option>
                    {savedClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.studentCount} HS)
                      </option>
                    ))}
                  </select>
                </label>
                <div className="inline-flex rounded-md border border-line bg-white p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`rounded-sm px-2.5 py-1 font-medium ${activeTab === "overview" ? "bg-accent text-white" : "text-ink-3"}`}
                  >
                    In phiếu &amp; quét bài
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("gradebook")}
                    className={`rounded-sm px-2.5 py-1 font-medium ${activeTab === "gradebook" ? "bg-accent text-white" : "text-ink-3"}`}
                  >
                    Bảng điểm toàn lớp
                  </button>
                </div>
              </div>
            ) : null}
          </div>
      <header>
        <h1 className="text-xl font-semibold">
          {release?.title ?? "Bộ in đã chốt"}
        </h1>
        {release ? (
          <p className="mt-1 text-xs text-ink-3">
            {release.variants.length} mã đề{release.className ? ` · Lớp ${release.className}` : ""} · Chốt{" "}
            {new Date(release.createdAt).toLocaleString("vi-VN")} · Bản in và
            đáp án giữ nguyên sau khi sửa đề nguồn.
          </p>
        ) : null}
      </header>
      {error ? (
        <p
          role="alert"
          className="rounded-md border border-warn-line bg-warn-soft p-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}
      {!release && !error ? <Loader2 className="size-5 animate-spin" /> : null}
      {release && activeTab === "gradebook" ? (
        <section className="rounded-lg border border-line bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold">Bảng điểm hợp nhất theo lớp</h2>
              {gradebook ? (
                <p className="text-xs text-ink-3">
                  {gradebook.stats.submitted} đã nộp / {gradebook.stats.totalRows} · Đã duyệt {gradebook.stats.confirmed}
                  {gradebook.stats.average !== null ? ` · TB ${gradebook.stats.average}` : ""}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadGradebook}
                className="rounded-md border border-line px-3 py-1.5 text-xs hover:bg-surface-2"
              >
                Làm mới
              </button>
              <a
                href={basePath(`/api/exam-releases/${releaseId}/gradebook?format=csv`)}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
              >
                <Download className="size-3.5" />
                Xuất Excel/CSV
              </a>
            </div>
          </div>
          {gbBusy && !gradebook ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-ink-4" />
            </div>
          ) : gradebook ? (
            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-2 text-left text-xs text-ink-3">
                    <th className="border-b border-line px-3 py-2">#</th>
                    <th className="border-b border-line px-3 py-2">SBD</th>
                    <th className="border-b border-line px-3 py-2">Họ và tên</th>
                    <th className="border-b border-line px-3 py-2">Mã đề</th>
                    <th className="border-b border-line px-3 py-2 text-right">TN</th>
                    <th className="border-b border-line px-3 py-2 text-right">TL</th>
                    <th className="border-b border-line px-3 py-2 text-right">Tổng</th>
                    <th className="border-b border-line px-3 py-2">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {gradebook.rows.map((row, idx) => (
                    <tr key={row.submissionId ?? row.studentId ?? idx} className="hover:bg-surface-2">
                      <td className="border-b border-surface-3 px-3 py-2 text-xs text-ink-4">{idx + 1}</td>
                      <td className="border-b border-surface-3 px-3 py-2 font-mono text-xs">{row.studentCode ?? "—"}</td>
                      <td className="border-b border-surface-3 px-3 py-2 font-medium text-ink">{row.studentName}</td>
                      <td className="border-b border-surface-3 px-3 py-2 text-xs">{row.examCode ?? "—"}</td>
                      <td className="border-b border-surface-3 px-3 py-2 text-right text-xs">{row.mcScore ?? "—"}</td>
                      <td className="border-b border-surface-3 px-3 py-2 text-right text-xs">{row.essayScore ?? "—"}</td>
                      <td className="border-b border-surface-3 px-3 py-2 text-right font-semibold">{row.totalScore ?? "—"}</td>
                      <td className="border-b border-surface-3 px-3 py-2 text-xs">
                        {row.sessionId ? (
                          <Link href={`/grading/${row.sessionId}`} className="text-accent underline">
                            {row.status === "confirmed" ? "Đã duyệt" : row.status === "needs-review" ? "Cần xem" : row.status}
                          </Link>
                        ) : (
                          <span className="text-ink-4">Chưa có bài</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!gradebook.rows.length ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center text-xs text-ink-4">
                        Chưa có bài nộp hoặc học sinh trong lớp này.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}
      {release && activeTab === "overview" ? (
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
                className="rounded-md border border-line px-2 py-2 text-sm"
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
                className="rounded-md border border-line px-2 py-2 text-sm"
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
                className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-white disabled:opacity-40"
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
              className="mt-3 h-[48dvh] w-full rounded-md border border-line"
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
                  className="mt-3 rounded-md border border-line px-3 py-2 text-sm hover:bg-surface-2"
                >
                  {pairBusy ? "Đang tạo…" : "Tạo mã kết nối"}
                </button>
                {pair ? (
                  <div className="mt-3 break-words text-sm">
                    {pairQr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pairQr}
                        alt="QR ghép thiết bị"
                        className="mb-2 size-36 rounded-md border border-line bg-white p-1"
                      />
                    ) : null}
                    <p>
                      Mã: <strong>{pair.code}</strong>
                    </p>
                    <a
                      className="mt-1 block text-accent underline"
                      href={basePath(`/exam-releases/pair/${pair.code}`)}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      <Link
                        className="text-accent underline"
                        href={`/grading/${v.sessionId}`}
                      >
                        Mã {v.code} — xem &amp; duyệt điểm
                      </Link>
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
        </div>
      </div>
    </AppFrame>
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
        <p role="alert" className="mt-3 text-sm text-danger">
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
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {release ? <ReleaseScan releaseId={release.id} /> : null}
    </main>
  );
}
