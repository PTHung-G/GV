"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, Printer, Shuffle, ExternalLink, FileDown } from "lucide-react";
import { basePath } from "@/lib/api-url";
import { downloadDocx, safeDocxFilename } from "@/lib/docx-export";
import { examContentHash } from "@/lib/exam-revision";
import type { AnswerKeyQuestion } from "@/lib/grading/rubric";
import { RubricEditorDialog } from "./rubric-editor-dialog";
import {
  exportKeyStatus,
  exportPrintHtml,
  type ExportSnapshot,
} from "@/lib/editor-export";
import type {
  ReleaseBuild,
  ReleaseInput,
  RecipeId,
} from "@/lib/exam-release/types";
import { parseAnswerKeyHtml } from "@/lib/grading/answer-key-html";
import { escapeHtml } from "@/lib/editor-model";

type Summary = {
  id: string;
  title: string;
  createdAt: string;
  variants?: Array<{ code: string }>;
};
const field = "rounded border border-line px-2 py-1.5 text-sm";
export function ReleaseDialog({
  snapshot,
  onClose,
  onQuickPrint,
  onSaveAnswerKey,
}: {
  snapshot: ExportSnapshot;
  onClose: () => void;
  onQuickPrint: () => void;
  onSaveAnswerKey?: (questions: AnswerKeyQuestion[]) => void;
}) {
  const [codes, setCodes] = useState("101, 102, 103, 104");
  const [seed, setSeed] = useState(() => crypto.randomUUID());
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [groupsText, setGroupsText] = useState("");
  const [pinned, setPinned] = useState("");
  const [pinnedOptions, setPinnedOptions] = useState("");
  const [recipes, setRecipes] = useState<Record<number, RecipeId | "">>({});
  const [reviewed, setReviewed] = useState(false);
  const [legacyReviewed, setLegacyReviewed] = useState(false);
  const [numericReviewed, setNumericReviewed] = useState(false);
  const [globalReviewed, setGlobalReviewed] = useState(false);
  const [preview, setPreview] = useState<ReleaseBuild | null>(null);
  const [previewInput, setPreviewInput] = useState<ReleaseInput | null>(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [releases, setReleases] = useState<Summary[]>([]);
  const [published, setPublished] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [artifact, setArtifact] = useState<"exam" | "key" | "sheet">("exam");
  const [ready, setReady] = useState(false);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState<AnswerKeyQuestion[] | null>(null);
  const [classId, setClassId] = useState('');
  const [savedClasses, setSavedClasses] = useState<Array<{ id: string; name: string; studentCount: number }>>([]);
  const frame = useRef<HTMLIFrameElement>(null);
  const modal = useRef<HTMLElement>(null);
  const idempotency = useRef(crypto.randomUUID());
  const status = editedQuestions ? "current" : exportKeyStatus(snapshot);
  const effectiveHash = editedQuestions
    ? examContentHash(snapshot.content)
    : snapshot.answerKey?.sourceContentHash;
  const keyQuestions =
    editedQuestions ??
    (snapshot.answerKey?.answerKeyQuestions?.length
      ? snapshot.answerKey.answerKeyQuestions
      : parseAnswerKeyHtml(snapshot.answerKey?.content ?? ""));
  const numbers = (value: string) =>
    value.trim()
      ? value.split(/[,;\s]+/).map((n) => {
          if (!/^\d+$/.test(n))
            throw new Error(
              "Số câu phải là số nguyên, phân cách bằng dấu phẩy.",
            );
          return Number(n);
        })
      : [];
  const invalidate = () => {
    setPreview(null);
    setPreviewInput(null);
    setReviewed(false);
    setError("");
    setReady(false);
    idempotency.current = crypto.randomUUID();
  };
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = [
          ...(modal.current?.querySelectorAll<HTMLElement>(
            "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],iframe",
          ) ?? []),
        ];
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [onClose]);
  useEffect(() => {
    let active = true;
    fetch(basePath("/api/classes"), { cache: "no-store" })
      .then(async (r) => {
        const d = (await r.json()) as { classes?: Array<{ id: string; name: string; studentCount: number }> };
        if (r.ok && active && d.classes) setSavedClasses(d.classes);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!snapshot.sourceExamId) return;
    let active = true;
    fetch(
      basePath(
        `/api/exam-releases?sourceExamId=${encodeURIComponent(snapshot.sourceExamId)}`,
      ),
    )
      .then(async (r) => {
        const d = await r.json();
        if (r.ok && active) setReleases(d.releases ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [snapshot.sourceExamId]);
  const buildInput = (): ReleaseInput => {
    if (!snapshot.sourceExamId)
      throw new Error("Hãy lưu đề vào tài khoản trước khi chốt bộ in.");
    if (status === "stale")
      throw new Error(
        "Đề đã thay đổi so với barem. Hãy cập nhật đáp án rồi mở lại.",
      );
    if (status === "unverified" && !legacyReviewed)
      throw new Error("Hãy đối chiếu và xác nhận đáp án cũ với đề hiện tại.");
    if (!keyQuestions.length)
      throw new Error(
        "Cần đáp án có cấu trúc, đủ đáp án và điểm từng câu để tạo bộ in chấm được.",
      );
    const selected = Object.entries(recipes)
      .filter(([, id]) => id)
      .map(([no, id]) => ({
        questionNo: Number(no),
        recipeId: id as RecipeId,
      }));
    if (selected.length && !numericReviewed)
      throw new Error("Hãy xác nhận việc thay câu bằng mẫu tham số đã chọn.");
    return {
      sourceExamId: snapshot.sourceExamId,
      title: snapshot.title,
      content: snapshot.content,
      answerKey: keyQuestions,
      sourceContentHash: effectiveHash,
      reviewed: true,
      codes: codes.split(/[,;\s]+/).filter(Boolean),
      seed,
      shuffleQuestions,
      globalInstructionsReviewed: globalReviewed,
      shuffleOptions,
      groups: groupsText
        .split(/\n|;/)
        .filter((s) => s.trim())
        .map((s) => ({ questionNos: numbers(s) })),
      pinnedQuestionNos: numbers(pinned),
      pinnedOptionNos: numbers(pinnedOptions),
      recipes: selected,
      ...(classId ? { classId } : {}),
    };
  };
  const generate = async () => {
    setBusy("preview");
    setError("");
    setReviewed(false);
    setReady(false);
    try {
      const input = buildInput();
      const r = await fetch(basePath("/api/exam-releases/preview"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Không tạo được bản xem trước.");
      setPreview(d);
      setPreviewInput(input);
      setSelectedCode(d.variants[0]?.code ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không xem trước được.");
    } finally {
      setBusy("");
    }
  };
  const publish = async () => {
    if (!previewInput || !reviewed) return;
    setBusy("publish");
    setError("");
    try {
      const r = await fetch(basePath("/api/exam-releases"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: previewInput,
          idempotencyKey: idempotency.current,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Không chốt được bộ in.");
      setPublished(d.release);
      setArtifact("exam");
      setReady(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không chốt được bộ in.");
    } finally {
      setBusy("");
    }
  };
  const variant = preview?.variants.find((v) => v.code === selectedCode);
  const previewHtml = variant
    ? exportPrintHtml(
        `${snapshot.title} — Mã đề ${variant.code}`,
        `<p class="release-identity">Mã đề ${escapeHtml(variant.code)}</p>${variant.examHtml}`,
      )
    : "";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-2 sm:p-5">
      <section
        ref={modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-title"
        className="flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-line bg-white shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line p-4">
          <div>
            <h2 id="release-title" className="text-lg font-semibold">
              Chốt đề & xuất PDF
            </h2>
            <p className="mt-1 text-xs text-ink-3">
              Bộ in đã chốt giữ nguyên đề, barem và phiếu để chấm đúng phiên
              bản. Không sửa đề gốc.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bộ mã đề"
            className="rounded p-2 hover:bg-surface-3"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="min-h-0 overflow-y-auto p-4">
          {published ? (
            <>
              <div className="rounded border border-ok/30 bg-ok-soft p-3 text-sm">
                <strong>Đã chốt bộ in: {published.title}</strong>
                <p className="mt-1">
                  Đợt chấm cho từng mã đã sẵn sàng. Sửa đề nguồn không làm đổi
                  bản này.
                </p>
                <a
                  href={basePath(`/exam-releases/${published.id}`)}
                  className="mt-2 inline-flex items-center gap-1 font-medium underline"
                >
                  Mở bộ in & chụp chấm
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["exam", "key", "sheet"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setArtifact(k);
                      setReady(false);
                    }}
                    className={`${field} ${artifact === k ? "border-accent text-accent" : ""}`}
                  >
                    {k === "exam"
                      ? "Đề thi"
                      : k === "key"
                        ? "Đáp án & barem"
                        : "Phiếu tô trắc nghiệm"}
                  </button>
                ))}
              </div>
              <iframe
                ref={frame}
                title="Bộ in đã chốt"
                sandbox="allow-same-origin allow-modals"
                src={basePath(
                  `/api/exam-releases/${published.id}/print?kind=${artifact}`,
                )}
                onLoad={() => setReady(true)}
                className="mt-3 h-[52dvh] w-full rounded border border-line"
              />
            </>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              <div className="space-y-3 text-sm">
                <h3 className="font-semibold">1. Chọn cách tạo mã đề</h3>
                <label className="block">
                  Các mã đề (1–12 mã)
                  <input
                    aria-label="Các mã đề"
                    value={codes}
                    onChange={(e) => {
                      setCodes(e.target.value);
                      invalidate();
                    }}
                    className={`${field} mt-1 w-full`}
                  />
                </label>
                <label className="block">
                  Gắn lớp học (tuỳ chọn)
                  <select
                    aria-label="Gắn lớp học"
                    value={classId}
                    onChange={(e) => {
                      setClassId(e.target.value);
                      invalidate();
                    }}
                    className={`${field} mt-1 w-full bg-white`}
                  >
                    <option value="">Không gắn lớp — phát phiếu trống</option>
                    {savedClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.name} ({c.studentCount} học sinh)
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => {
                      setShuffleQuestions(e.target.checked);
                      invalidate();
                    }}
                  />
                  Xáo thứ tự câu trong cùng phần
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={(e) => {
                      setShuffleOptions(e.target.checked);
                      invalidate();
                    }}
                  />
                  Xáo phương án A–D và cập nhật đáp án
                </label>
                <p className="text-xs text-ink-3">
                  Chỉ xáo cấu trúc xác định được. Câu phụ thuộc hoặc phương án
                  “tất cả trên” cần giữ nguyên. Với đề chưa tách cấu trúc: bỏ
                  xáo và chọn một mã để giữ nguyên.
                </p>
                <label className="flex items-start gap-2 text-xs">
                  <input type="checkbox" checked={globalReviewed} onChange={e => {setGlobalReviewed(e.target.checked);invalidate();}} />
                  Các đoạn trước câu đầu mỗi phần chỉ là hướng dẫn chung, giữ cố định. Ngữ liệu dùng chung đã được gom nhóm bên dưới.
                </label>
                <details className="rounded border border-line p-2">
                  <summary className="cursor-pointer font-medium">
                    Nhóm câu & giữ vị trí
                  </summary>
                  <div className="mt-2 space-y-2">
                    <label className="block">
                      Nhóm câu dùng chung ngữ liệu
                      <textarea
                        aria-label="Nhóm câu"
                        placeholder={"1,2,3\n7,8"}
                        value={groupsText}
                        onChange={(e) => {
                          setGroupsText(e.target.value);
                          invalidate();
                        }}
                        className={`${field} mt-1 w-full`}
                        rows={3}
                      />
                    </label>
                    <p className="text-xs text-ink-3">
                      Mỗi dòng là nhóm câu liên tiếp; giữ thứ tự bên trong. Kiểm
                      tra đoạn dẫn đi cùng cả nhóm ở bản xem trước.
                    </p>
                    <label className="block">
                      Giữ vị trí câu
                      <input
                        value={pinned}
                        onChange={(e) => {
                          setPinned(e.target.value);
                          invalidate();
                        }}
                        placeholder="4, 10"
                        className={`${field} mt-1 w-full`}
                      />
                    </label>
                    <label className="block">
                      Không xáo phương án câu
                      <input
                        value={pinnedOptions}
                        onChange={(e) => {
                          setPinnedOptions(e.target.value);
                          invalidate();
                        }}
                        placeholder="5, 9"
                        className={`${field} mt-1 w-full`}
                      />
                    </label>
                  </div>
                </details>
                <details className="rounded border border-line p-2">
                  <summary className="cursor-pointer font-medium">
                    Biến thể số liệu theo mẫu
                  </summary>
                  <p className="mt-2 text-xs text-ink-3">
                    Thay toàn bộ câu được chọn bằng mẫu có tính lại nghiệm, đáp
                    án và lời giải. Không tự sửa số trong câu cũ; không khẳng
                    định độ khó tương đương.
                  </p>
                  <div className="mt-2 max-h-48 space-y-2 overflow-auto">
                    {keyQuestions
                      .filter(
                        (q) =>
                          q.type !== "essay" &&
                          !q.steps?.length &&
                          /^[A-D]$/i.test(q.answer),
                      )
                      .map((q) => {
                        const no = Number(/\d+/.exec(q.label)?.[0]);
                        if (!no) return null;
                        return (
                          <label key={no} className="block text-xs">
                            {q.label}
                            <select
                              aria-label={`Mẫu số liệu câu ${no}`}
                              value={recipes[no] ?? ""}
                              onChange={(e) => {
                                setRecipes((p) => ({
                                  ...p,
                                  [no]: e.target.value as RecipeId | "",
                                }));
                                setNumericReviewed(false);
                                invalidate();
                              }}
                              className={`${field} mt-1 w-full`}
                            >
                              <option value="">Giữ câu gốc</option>
                              <option value="square-root">
                                Căn bậc hai chính phương
                              </option>
                              <option value="linear-equation">
                                Phương trình bậc nhất nghiệm nguyên
                              </option>
                              <option value="rational-addition">
                                Cộng phân số chính xác
                              </option>
                            </select>
                          </label>
                        );
                      })}
                  </div>
                  <label className="mt-2 flex gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={numericReviewed}
                      onChange={(e) => {
                        setNumericReviewed(e.target.checked);
                        invalidate();
                      }}
                    />
                    Tôi đồng ý thay câu đã chọn bằng mẫu và sẽ rà soát từng mã.
                  </label>
                </details>
                <button
                  onClick={() => {
                    setSeed(crypto.randomUUID());
                    invalidate();
                  }}
                  className="inline-flex items-center gap-1 text-xs underline"
                >
                  <Shuffle className="size-3.5" />
                  Tạo lượt xáo khác
                </button>
                {status === "stale" ? (
                  <p role="status" className="text-warn">
                    Barem đã cũ so với đề. Cập nhật đáp án rồi mở lại để chốt.
                  </p>
                ) : null}
                {status === "missing" ? (
                  <p role="status" className="text-warn">
                    Chưa có đáp án liên kết. Cần barem có điểm từng câu để tạo
                    bộ in chấm được.
                  </p>
                ) : null}
                {status === "unverified" ? (
                  <label className="flex gap-2 text-xs text-warn">
                    <input
                      type="checkbox"
                      checked={legacyReviewed}
                      onChange={(e) => {
                        setLegacyReviewed(e.target.checked);
                        invalidate();
                      }}
                    />
                    Tôi đã đối chiếu barem cũ chưa có dấu phiên bản với đề hiện
                    tại.
                  </label>
                ) : null}
                <button
                  type="button"
                  onClick={() => setRubricOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-2"
                >
                  Chỉnh đáp án &amp; thang điểm ({keyQuestions.length} câu)
                </button>
                <button
                  disabled={
                    !!busy || status === "stale" || status === "missing"
                  }
                  onClick={() => void generate()}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 font-medium text-white disabled:opacity-40"
                >
                  {busy === "preview" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Tạo & kiểm tra các mã đề
                </button>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold">2. Rà soát trước khi chốt</h3>
                {!preview ? (
                  <div className="mt-3 rounded border border-dashed border-line p-6 text-sm text-ink-3">
                    Chọn cách tạo mã và bấm “Tạo & kiểm tra”. Hệ thống chỉ tạo
                    đợt chấm sau khi bạn xác nhận bản xem trước.
                  </div>
                ) : (
                  <>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {preview.variants.map((v) => (
                        <button
                          key={v.code}
                          onClick={() => {
                            setSelectedCode(v.code);
                            setReady(false);
                          }}
                          className={`${field} ${selectedCode === v.code ? "border-accent text-accent" : ""}`}
                        >
                          Mã {v.code}
                        </button>
                      ))}
                    </div>
                    {preview.warnings.map((w, i) => (
                      <p key={i} className="mt-2 text-xs text-warn">
                        {w}
                      </p>
                    ))}
                    <iframe
                      ref={frame}
                      title="Xem trước mã đề"
                      sandbox="allow-same-origin allow-modals"
                      srcDoc={previewHtml}
                      onLoad={() => setReady(true)}
                      className="mt-3 h-[40dvh] w-full rounded border border-line"
                    />
                    <details className="mt-3 rounded border border-line p-2 text-sm">
                      <summary className="cursor-pointer">
                        Ánh xạ câu & đáp án — mã {selectedCode}
                      </summary>
                      <div className="mt-2 max-h-44 overflow-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr>
                              <th>Câu gốc → bản in</th>
                              <th>Thứ tự phương án gốc</th>
                              <th>Đáp án mới</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variant?.mapping.map((m) => (
                              <tr
                                key={m.sourceNo}
                                className="border-t border-line"
                              >
                                <td className="py-1">
                                  {m.sourceNo} → {m.printedNo}
                                  {m.recipe ? " (mẫu số liệu)" : ""}
                                </td>
                                <td>
                                  {m.optionOrder?.join(", ") ?? "Giữ nguyên"}
                                </td>
                                <td>
                                  {
                                    variant.answerKey.find(
                                      (q) =>
                                        Number(/\d+/.exec(q.label)?.[0]) ===
                                        m.printedNo,
                                    )?.answer
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                    <label className="mt-3 flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={reviewed}
                        onChange={(e) => setReviewed(e.target.checked)}
                      />
                      Tôi đã rà soát tất cả mã, nhóm ngữ liệu, đáp án và điểm.
                      Chốt đúng bộ đang xem; bản đã chốt không tự cập nhật theo
                      đề gốc.
                    </label>
                  </>
                )}
                {releases.length ? (
                  <details className="mt-4 text-sm" open>
                    <summary className="cursor-pointer font-medium">
                      Bộ in đã chốt trước đây ({releases.length})
                    </summary>
                    <ul className="mt-2 space-y-2">
                      {releases.map((r) => (
                        <li key={r.id}>
                          <a
                            href={basePath(`/exam-releases/${r.id}`)}
                            className="text-accent underline"
                          >
                            {r.title}
                          </a>
                          <span className="ml-2 text-xs text-ink-3">
                            {new Date(r.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            </div>
          )}
          {error ? (
            <p
              role="alert"
              className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-ink-3">
            Phiếu chuẩn hỗ trợ tối đa 60 câu chọn một A–D. Chưa có ô
            Đúng/Sai/trả lời ngắn. Khi in: A4, tỷ lệ 100%, tắt đầu/chân trang;
            chọn “Lưu dưới dạng PDF” trong hộp thoại trình duyệt.
          </p>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line p-3">
          <button
            onClick={onQuickPrint}
            className="text-xs text-ink-3 underline"
          >
            Chỉ in nhanh, không liên kết chấm
          </button>
          {published ? (
            <div className="flex items-center gap-2">
              {artifact !== "sheet" ? (
                <button
                  type="button"
                  disabled={!ready}
                  onClick={() => {
                    const bodyHtml = frame.current?.contentDocument?.body?.innerHTML ?? "";
                    if (!bodyHtml.trim()) {
                      setError("Chưa tải xong nội dung để xuất Word.");
                      return;
                    }
                    void downloadDocx({
                      title: `${published.title}${artifact === "key" ? " — Đáp án" : ""}`,
                      html: bodyHtml,
                    }).catch(() => setError("Không tạo được tệp Word (.docx)."));
                  }}
                  className="flex items-center gap-2 rounded-md border border-line-strong bg-white px-3 py-2 text-sm font-medium text-ink hover:bg-surface-2 disabled:opacity-40"
                >
                  <FileDown className="size-4" />
                  Tải Word (.docx)
                </button>
              ) : null}
              <button
                disabled={!ready}
                onClick={() => {
                  try {
                    frame.current?.contentWindow?.focus();
                    frame.current?.contentWindow?.print();
                  } catch {
                    setError(
                      "Không mở được hộp thoại in. Hãy mở bộ in để thử lại.",
                    );
                  }
                }}
                className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-white disabled:opacity-40"
              >
                <Printer className="size-4" />
                In / Lưu PDF
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {variant ? (
                <button
                  type="button"
                  onClick={() => {
                    void downloadDocx({
                      title: `${snapshot.title} — Mã đề ${variant.code}`,
                      html: `<p style="text-align:right"><b>Mã đề ${escapeHtml(variant.code)}</b></p>${variant.examHtml}`,
                      filename: safeDocxFilename(`${snapshot.title} - Ma de ${variant.code}`),
                    }).catch(() => setError("Không tạo được tệp Word (.docx)."));
                  }}
                  className="flex items-center gap-2 rounded-md border border-line-strong bg-white px-3 py-2 text-sm font-medium text-ink hover:bg-surface-2"
                >
                  <FileDown className="size-4" />
                  Tải Word mã {variant.code} (.docx)
                </button>
              ) : null}
              <button
                disabled={!preview || !reviewed || !!busy}
                onClick={() => void publish()}
                className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                {busy === "publish" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Chốt bộ in & tạo đợt chấm
              </button>
            </div>
          )}
        </footer>
      </section>
      <RubricEditorDialog
        open={rubricOpen}
        initialQuestions={keyQuestions}
        examHtml={snapshot.content}
        onClose={() => setRubricOpen(false)}
        onSave={(qs) => {
          setEditedQuestions(qs);
          onSaveAnswerKey?.(qs);
          invalidate();
        }}
      />
    </div>
  );
}
