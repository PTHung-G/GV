"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Folder,
  RefreshCw,
  Search,
  ArrowLeft,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  FilePlus2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { basePath } from "@/lib/api-url";
import { AppFrame } from "@/components/shell/app-frame";
import { ShellHeader } from "@/components/shell/app-shell";
import { Dialog } from "@/components/ui/dialog";
import { SUBJECTS } from "@/lib/site";
import type {
  BankEnvelope,
  BankNode,
  BankQuestion,
  BankQuestionType,
} from "@/lib/question-bank/types";
import { sourceFragment } from "./source-snapshot";
import { QuestionPreview } from "./question-preview";

const statusLabels = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  review: "Cần kiểm tra",
  complete: "Đã lưu",
  failed: "Xử lý chưa thành công",
};
const button =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink hover:bg-surface-2 disabled:opacity-50";
const primary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-accent-hover disabled:opacity-50";

export function descendantTopicIds(
  nodes: BankEnvelope["bank"]["nodes"],
  topicId: string,
): Set<string> {
  const ids = new Set([topicId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes)
      if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
  }
  return ids;
}

export function QuestionBank() {
  const router = useRouter();
  const { user, ready, openDialog } = useAuth();
  const ownerId = user?.id;
  const currentOwner = useRef(ownerId);
  currentOwner.current = ownerId;
  const controller = useRef<AbortController | null>(null);
  const [envelope, setEnvelope] = useState<BankEnvelope | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"questions" | "sources">("questions");
  const [topic, setTopic] = useState("root");
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | BankQuestionType>("");
  const [answerFilter, setAnswerFilter] = useState<"" | "yes" | "no">("");
  const [pageIndex, setPageIndex] = useState(0);
  const [basket, setBasket] = useState<string[]>([]);
  const [assembleOpen, setAssembleOpen] = useState(false);
  const [assembleTitle, setAssembleTitle] = useState("Đề kiểm tra từ kho câu hỏi");
  const [assembleSubject, setAssembleSubject] = useState("toan");
  const [assembleGrade, setAssembleGrade] = useState("9");
  const [topicDialog, setTopicDialog] = useState<
    | { mode: "create"; parentId: string; label: string }
    | { mode: "rename"; node: BankNode; label: string }
    | null
  >(null);
  const [confirmDelete, setConfirmDelete] = useState<
    | { kind: "question"; id: string; label: string }
    | { kind: "topic"; id: string; label: string }
    | { kind: "source"; id: string; label: string }
    | null
  >(null);
  const [editingQ, setEditingQ] = useState<{
    question: BankQuestion;
    label: string;
    topicId: string;
    questionType: BankQuestionType;
    answer: string;
    points: string;
  } | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    setExpandedQuestions(new Set());
    setPageIndex(0);
  }, [ownerId, topic, query, sourceFilter, typeFilter, answerFilter]);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [previewSource, setPreviewSource] = useState(false);
  const previewKey = useRef("");

  const request = useCallback(
    async (
      path = "",
      payload?: Record<string, unknown>,
    ): Promise<BankEnvelope | null> => {
      if (!ownerId) return null;
      const owner = ownerId;
      controller.current?.abort();
      const active = new AbortController();
      controller.current = active;
      setBusy(true);
      setError("");
      try {
        const response = await fetch(basePath(`/api/question-bank${path}`), {
          method: payload ? "POST" : "GET",
          cache: "no-store",
          headers: payload ? { "content-type": "application/json" } : undefined,
          body: payload
            ? JSON.stringify({ ...payload, ownerId: owner })
            : undefined,
          signal: active.signal,
        });
        const data = (await response.json()) as BankEnvelope & {
          error?: string;
        };
        if (
          active.signal.aborted ||
          currentOwner.current !== owner ||
          controller.current !== active
        )
          return null;
        if (!response.ok)
          throw new Error(
            data.error ||
              (response.status === 409
                ? "Một tác vụ khác đang chạy. Hãy tải lại trạng thái trước khi tiếp tục."
                : "Không tải được kho câu hỏi. Vui lòng thử lại."),
          );
        if (data.ownerId !== owner || !data.bank)
          throw new Error(
            "Phiên đăng nhập đã thay đổi. Vui lòng tải lại trang.",
          );
        setEnvelope((previous) =>
          previous?.ownerId === owner && previous.revision > data.revision
            ? previous
            : data,
        );
        return data;
      } catch (err) {
        if (
          !active.signal.aborted &&
          currentOwner.current === owner &&
          controller.current === active
        )
          setError(
            err instanceof Error ? err.message : "Không kết nối được máy chủ.",
          );
        return null;
      } finally {
        if (currentOwner.current === owner && controller.current === active)
          setBusy(false);
      }
    },
    [ownerId],
  );

  useEffect(() => {
    setEnvelope(null);
    setError("");
    setSourceId(null);
    setSelection(new Set());
    previewKey.current = "";
    setBusy(false);
    const initial = new URLSearchParams(window.location.search).get("source");
    if (initial) {
      setSourceId(initial);
      setTab("sources");
    }
    if (ownerId) void request();
    return () => {
      controller.current?.abort();
    };
  }, [ownerId, request]);

  // Never display a previous account's envelope, even for the render before effect cleanup.
  const bank = envelope && envelope.ownerId === ownerId ? envelope.bank : null;
  const source = bank?.sources.find((item) => item.id === sourceId);
  useEffect(() => {
    const key = source
      ? `${ownerId}:${source.id}:${source.previewVersion}`
      : "";
    if (key !== previewKey.current) {
      previewKey.current = key;
      setSelection(
        new Set(
          source?.candidates
            .filter((c) => !source.confirmedIds.includes(c.id))
            .map((c) => c.id) ?? [],
        ),
      );
      setPreviewSource(false);
    }
  }, [ownerId, source]);

  const topics = useMemo(
    () => (bank ? descendantTopicIds(bank.nodes, topic) : new Set<string>()),
    [bank, topic],
  );
  const questions =
    bank?.questions.filter((question) => {
      if (!topics.has(question.topicId)) return false;
      if (sourceFilter && question.sourceId !== sourceFilter) return false;
      const qType = question.questionType ?? "mc";
      if (typeFilter && qType !== typeFilter) return false;
      const hasAns = Boolean(question.answer?.trim() || question.rubric?.length);
      if (answerFilter === "yes" && !hasAns) return false;
      if (answerFilter === "no" && hasAns) return false;
      const origin = bank.sources.find((s) => s.id === question.sourceId);
      const text = [
        question.label,
        origin?.title,
        question.answer ?? "",
        ...(origin
          ? [...question.contextBlockIds, ...question.bodyBlockIds].map(
              (id) => origin.blocks[id]?.text ?? "",
            )
          : []),
      ]
        .join(" ")
        .toLocaleLowerCase("vi");
      return text.includes(query.trim().toLocaleLowerCase("vi"));
    }) ?? [];

  const PAGE_SIZE = 200;
  const pageCount = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const safePage = Math.min(pageIndex, pageCount - 1);
  const visibleQuestions = questions.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE,
  );

  const mutateApi = async (
    path: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: Record<string, unknown>,
  ): Promise<boolean> => {
    if (!ownerId) return false;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(basePath(`/api/question-bank${path}`), {
        method,
        headers: { "content-type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await response.json()) as BankEnvelope & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Không cập nhật được kho câu hỏi.");
      }
      if (data.ownerId === ownerId && data.bank) {
        setEnvelope(data);
      }
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không kết nối được máy chủ.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  };

  const assembleExam = async () => {
    if (!basket.length || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(basePath("/api/question-bank/assemble"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: assembleTitle.trim() || "Đề lắp ghép từ kho",
          subject: assembleSubject,
          grade: assembleGrade ? Number(assembleGrade) : null,
          questionIds: basket,
        }),
      });
      const data = (await response.json()) as {
        docId?: string;
        error?: string;
      };
      if (!response.ok || !data.docId) {
        throw new Error(data.error || "Không tạo được đề mới.");
      }
      setAssembleOpen(false);
      setBasket([]);
      router.push(`/doc/${data.docId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tạo được đề mới.");
    } finally {
      setBusy(false);
    }
  };

  const process = async (
    kind: "extract" | "organize",
    id?: string,
    retry?: boolean,
  ) => {
    await request("/process", {
      kind,
      ...(id ? { sourceId: id } : {}),
      ...(retry ? { retry: true } : {}),
    });
  };
  const confirm = async () => {
    if (!source || !selection.size) return;
    const owner = ownerId;
    const result = await request("/confirm", {
      sourceId: source.id,
      candidateIds: [...selection],
      previewVersion: source.previewVersion,
    });
    if (result && currentOwner.current === owner)
      await request("/process", { kind: "organize" });
  };

  function tree(parentId: string | null, depth = 0): React.ReactNode {
    if (!bank || depth > 12) return null;
    return bank.nodes
      .filter((n) => n.parentId === parentId)
      .map((node) => (
        <div key={node.id}>
          <div className="group flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => {
                setTopic(node.id);
                setTab("questions");
              }}
              aria-pressed={topic === node.id}
              style={{ paddingLeft: `${12 + depth * 14}px` }}
              className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg py-2 pr-2 text-left text-sm ${topic === node.id ? "bg-accent-soft font-semibold text-accent" : "text-ink-2 hover:bg-surface-2"}`}
            >
              <Folder className="size-4 shrink-0" />
              <span className="min-w-0 break-words">{node.label}</span>
              {node.isLocked ? (
                <Lock className="ml-auto size-3 shrink-0 text-ink-4" />
              ) : null}
            </button>
            {node.id !== "root" ? (
              <div className="hidden shrink-0 items-center pr-1 group-hover:flex group-focus-within:flex">
                <button
                  type="button"
                  title={node.isLocked ? "Mở khoá chủ đề" : "Khoá chủ đề"}
                  aria-label={node.isLocked ? `Mở khoá ${node.label}` : `Khoá ${node.label}`}
                  onClick={() =>
                    void mutateApi("/topics", "PATCH", {
                      id: node.id,
                      isLocked: !node.isLocked,
                    })
                  }
                  className="rounded-sm p-1 text-ink-4 hover:bg-surface-3 hover:text-ink"
                >
                  {node.isLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                </button>
                <button
                  type="button"
                  title="Đổi tên chủ đề"
                  aria-label={`Đổi tên ${node.label}`}
                  onClick={() =>
                    setTopicDialog({ mode: "rename", node, label: node.label })
                  }
                  className="rounded-sm p-1 text-ink-4 hover:bg-surface-3 hover:text-ink"
                >
                  <Pencil className="size-3" />
                </button>
                <button
                  type="button"
                  title="Xoá chủ đề"
                  aria-label={`Xoá ${node.label}`}
                  onClick={() =>
                    setConfirmDelete({ kind: "topic", id: node.id, label: node.label })
                  }
                  className="rounded-sm p-1 text-ink-4 hover:bg-surface-3 hover:text-danger"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ) : null}
          </div>
          {tree(node.id, depth + 1)}
        </div>
      ));
  }

  return (
    <AppFrame>
      <ShellHeader
        title="Kho câu hỏi"
        subtitle="Giữ nguyên nội dung câu hỏi · sắp xếp theo chủ đề"
        actions={
          ownerId ? (
            <button
              type="button"
              onClick={() => void request()}
              disabled={busy}
              className={button}
            >
              <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />{" "}
              Tải lại trạng thái
            </button>
          ) : undefined
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-2 text-ink">
        <div className="border-b border-line bg-surface px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
                <span className="rounded-lg bg-accent-soft p-1.5 text-accent">
                  <BookOpen className="size-5" />
                </span>
                Kho câu hỏi
              </h1>
              <p className="mt-1 text-xs text-ink-3">
                Kho riêng của bạn · Đính kèm đáp án &amp; barem, chọn câu ghép nhanh thành đề mới
              </p>
            </div>
            <Link
              href="/my-exams"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-3 hover:text-accent"
            >
              <ArrowLeft className="size-3.5" /> Đề thi của tôi
            </Link>
          </div>
        </div>
      {!ready ? (
        <p className="p-8 text-center text-sm">Đang kiểm tra tài khoản…</p>
      ) : !ownerId ? (
        <section className="mx-auto my-16 max-w-lg rounded-lg border border-line bg-surface p-8 text-center">
          <h2 className="text-lg font-semibold">Câu hỏi của riêng bạn</h2>
          <p className="my-4 text-sm text-ink-3">
            Đăng nhập để xem và lưu câu hỏi từ đề đang soạn. Nội dung không được
            chia sẻ với tài khoản khác.
          </p>
          <button
            type="button"
            onClick={() => openDialog("Đăng nhập để mở kho câu hỏi riêng.")}
            className={primary}
          >
            Đăng nhập
          </button>
        </section>
      ) : (
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-danger bg-danger-soft p-4 text-sm text-danger"
            >
              {error}
            </div>
          )}
          {busy && (
            <div
              role="status"
              className="mb-4 flex items-center gap-2 rounded-lg bg-accent-soft p-3 text-sm text-accent"
            >
              <Loader2 className="size-4 animate-spin" /> Đang xử lý, nguồn đã
              lưu không bị mất.
              <button
                type="button"
                className="ml-auto underline"
                onClick={() => {
                  controller.current?.abort();
                  controller.current = null;
                  setBusy(false);
                }}
              >
                Dừng chờ
              </button>
            </div>
          )}
          {bank && (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-lg border border-line bg-surface p-1">
                  <button
                    type="button"
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "questions" ? "bg-ink text-primary-foreground" : "text-ink-3"}`}
                    onClick={() => setTab("questions")}
                  >
                    Câu hỏi · {bank.questions.length}
                  </button>
                  <button
                    type="button"
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "sources" ? "bg-ink text-primary-foreground" : "text-ink-3"}`}
                    onClick={() => setTab("sources")}
                  >
                    Nguồn đã lưu · {bank.sources.length}
                  </button>
                </div>
                <p className="text-xs text-ink-3">
                  Để thêm câu hỏi, mở đề và chọn “Chốt và lưu câu hỏi”.
                </p>
              </div>
              {bank.organization.status !== "complete" && (
                <section className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-warn-line bg-warn-soft p-4">
                  <div className="flex-1 text-sm">
                    <strong>
                      Sắp xếp chủ đề: {statusLabels[bank.organization.status]}
                    </strong>
                    <p className="mt-1 text-xs text-warn">
                      {bank.organization.error ||
                        "Câu hỏi đã duyệt vẫn được giữ trong kho. Tiếp tục để AI sắp xếp chủ đề."}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    className={button}
                    onClick={() =>
                      void process(
                        "organize",
                        undefined,
                        bank.organization.status === "failed" ||
                          bank.organization.status === "processing",
                      )
                    }
                  >
                    {bank.organization.status === "failed"
                      ? "Thử sắp xếp lại"
                      : "Tiếp tục sắp xếp"}
                  </button>
                </section>
              )}
              {tab === "questions" ? (
                <div className="grid items-start gap-5 md:grid-cols-[240px_minmax(0,1fr)]">
                  <aside className="rounded-lg border border-line bg-surface p-3">
                    <div className="flex items-center justify-between px-3 pb-3 pt-1">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-4">
                        Chủ đề
                      </h2>
                      <button
                        type="button"
                        onClick={() =>
                          setTopicDialog({
                            mode: "create",
                            parentId: topic || "root",
                            label: "",
                          })
                        }
                        title="Thêm chủ đề mới"
                        className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium text-accent hover:bg-accent-soft"
                      >
                        <Plus className="size-3.5" />
                        Thêm
                      </button>
                    </div>
                    {tree(null)}
                    <p className="px-3 pt-4 text-xs leading-5 text-ink-4">
                      Bao gồm câu hỏi thuộc chủ đề đang chọn và các chủ đề con. Khoá chủ đề để AI không đổi tên khi tự phân loại.
                    </p>
                  </aside>
                  <section className="min-w-0">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5">
                        <Search className="size-4 text-ink-4" />
                        <input
                          aria-label="Tìm câu hỏi theo nội dung hoặc tên nguồn"
                          placeholder="Tìm nội dung câu hỏi, tên nguồn…"
                          className="w-full bg-transparent text-sm outline-none"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </label>
                      <select
                        aria-label="Lọc theo nguồn"
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
                      >
                        <option value="">Tất cả nguồn</option>
                        {bank.sources.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="Lọc theo loại câu"
                        value={typeFilter}
                        onChange={(e) =>
                          setTypeFilter(e.target.value as "" | BankQuestionType)
                        }
                        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
                      >
                        <option value="">Mọi dạng câu</option>
                        <option value="mc">Trắc nghiệm</option>
                        <option value="tf">Đúng/Sai</option>
                        <option value="short">Trả lời ngắn</option>
                        <option value="essay">Tự luận</option>
                      </select>
                      <select
                        aria-label="Lọc theo đáp án"
                        value={answerFilter}
                        onChange={(e) =>
                          setAnswerFilter(e.target.value as "" | "yes" | "no")
                        }
                        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
                      >
                        <option value="">Có & chưa có đáp án</option>
                        <option value="yes">Đã có đáp án</option>
                        <option value="no">Chưa có đáp án</option>
                      </select>
                    </div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-3">
                      <p>{questions.length} câu hỏi</p>
                      {questions.length > 0 ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-accent hover:underline"
                            onClick={() => {
                              const ids = visibleQuestions.map((q) => q.id);
                              const allIn = ids.every((id) => basket.includes(id));
                              setBasket((prev) =>
                                allIn
                                  ? prev.filter((id) => !ids.includes(id))
                                  : [...new Set([...prev, ...ids])],
                              );
                            }}
                          >
                            {visibleQuestions.every((q) => basket.includes(q.id))
                              ? "Bỏ chọn trang này"
                              : "Chọn tất cả vào giỏ đề"}
                          </button>
                          {basket.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setAssembleOpen(true)}
                              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-accent-hover"
                            >
                              <FilePlus2 className="size-3.5" />
                              Tạo đề mới từ {basket.length} câu
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-4">
                      {visibleQuestions.map((question) => {
                        const origin = bank.sources.find(
                          (s) => s.id === question.sourceId,
                        );
                        const inBasket = basket.includes(question.id);
                        const snippet = origin
                          ? question.bodyBlockIds
                              .map((id) => origin.blocks[id]?.text ?? "")
                              .join(" ")
                              .trim()
                          : "";
                        return (
                          <article
                            key={question.id}
                            className={`rounded-lg border bg-surface p-4 ${inBasket ? "border-accent" : "border-line"}`}
                          >
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <input
                                type="checkbox"
                                checked={inBasket}
                                aria-label={`Chọn ${question.label} vào giỏ đề`}
                                onChange={(e) =>
                                  setBasket((prev) =>
                                    e.target.checked
                                      ? [...prev, question.id]
                                      : prev.filter((id) => id !== question.id),
                                  )
                                }
                                className="size-4 accent-accent"
                              />
                              <h3 className="text-sm font-semibold">
                                {question.label}
                              </h3>
                              {question.questionType ? (
                                <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-ink-3">
                                  {question.questionType === "mc"
                                    ? "TN"
                                    : question.questionType === "tf"
                                      ? "Đ/S"
                                      : question.questionType === "short"
                                        ? "TLN"
                                        : "TL"}
                                </span>
                              ) : null}
                              {question.answer ? (
                                <span className="rounded-sm bg-ok-soft px-1.5 py-0.5 text-[11px] font-medium text-ok">
                                  Đáp án: {question.answer}
                                </span>
                              ) : null}
                              {question.points !== null ? (
                                <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-[11px] text-ink-3">
                                  {question.points} điểm
                                </span>
                              ) : null}
                              <div className="ml-auto flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingQ({
                                      question,
                                      label: question.label,
                                      topicId: question.topicId,
                                      questionType: question.questionType ?? "mc",
                                      answer: question.answer ?? "",
                                      points:
                                        question.points !== null && question.points !== undefined
                                          ? String(question.points)
                                          : "",
                                    })
                                  }
                                  className="rounded-sm p-1 text-ink-4 hover:bg-surface-2 hover:text-ink"
                                  aria-label={`Sửa ${question.label}`}
                                  title="Sửa câu hỏi & đáp án"
                                >
                                  <Pencil className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmDelete({
                                      kind: "question",
                                      id: question.id,
                                      label: question.label,
                                    })
                                  }
                                  className="rounded-sm p-1 text-ink-4 hover:bg-surface-2 hover:text-danger"
                                  aria-label={`Xoá ${question.label}`}
                                  title="Xoá câu hỏi"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="mb-2 text-xs text-ink-3">
                              {origin?.title ?? "Nguồn đã lưu"} ·{" "}
                              {new Date(question.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}{" "}
                              · Phiên bản {origin?.hash.slice(0, 10)}{" "}
                              <button
                                type="button"
                                className="ml-2 text-accent underline"
                                onClick={() => {
                                  setSourceId(question.sourceId);
                                  setTab("sources");
                                }}
                              >
                                Xem nguồn
                              </button>
                            </p>
                            {snippet ? (
                              <p className="mb-2 line-clamp-2 text-xs text-ink-2">
                                {snippet}
                              </p>
                            ) : null}
                            {origin && (
                              <details
                                onToggle={(event) => {
                                  const open = event.currentTarget.open;
                                  setExpandedQuestions((previous) => {
                                    const next = new Set(previous);
                                    if (open) next.add(question.id);
                                    else next.delete(question.id);
                                    return next;
                                  });
                                }}
                                open={expandedQuestions.has(question.id)}
                              >
                                <summary className="cursor-pointer text-sm font-medium text-accent">
                                  Xem nội dung
                                </summary>
                                {expandedQuestions.has(question.id) && (
                                  <div className="mt-3">
                                    <QuestionPreview
                                      title={`Câu hỏi ${question.label}`}
                                      html={
                                        question.customHtml ??
                                        sourceFragment(origin, [
                                          ...question.contextBlockIds,
                                          ...question.bodyBlockIds,
                                        ])
                                      }
                                    />
                                  </div>
                                )}
                              </details>
                            )}
                          </article>
                        );
                      })}
                      {pageCount > 1 ? (
                        <div className="flex items-center justify-between pt-2 text-xs text-ink-3">
                          <span>
                            Trang {safePage + 1}/{pageCount}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={safePage === 0}
                              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                              className={button}
                            >
                              Trang trước
                            </button>
                            <button
                              type="button"
                              disabled={safePage >= pageCount - 1}
                              onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                              className={button}
                            >
                              Trang sau
                            </button>
                          </div>
                        </div>
                      ) : null}
                      {!questions.length && (
                        <section className="rounded-lg border border-dashed border-line-strong bg-surface p-10 text-center text-sm text-ink-3">
                          {query
                            ? "Không có câu hỏi khớp tìm kiếm."
                            : "Chưa có câu hỏi ở đây. Lưu nguồn từ trình soạn đề, kiểm tra rồi duyệt các câu cần giữ."}
                        </section>
                      )}
                    </div>
                  </section>
                </div>
              ) : (
                <div className="grid items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
                  <aside className="space-y-2">
                    {bank.sources.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSourceId(item.id)}
                        className={`w-full rounded-lg border p-4 text-left ${item.id === sourceId ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong"}`}
                      >
                        <span className="block text-sm font-semibold">
                          {item.title}
                        </span>
                        <span
                          className={`mt-2 block text-xs ${item.status === "failed" ? "text-danger" : "text-ink-3"}`}
                        >
                          {statusLabels[item.status]} ·{" "}
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </button>
                    ))}
                    {!bank.sources.length && (
                      <p className="rounded-lg border border-line bg-surface p-5 text-sm text-ink-3">
                        Chưa có nguồn. Dùng “Chốt và lưu câu hỏi” trong trình
                        soạn đề.
                      </p>
                    )}
                  </aside>
                  <section className="min-w-0">
                    {source ? (
                      <>
                        <div className="mb-4 rounded-lg border border-line bg-surface p-5">
                          <h2 className="text-lg font-semibold">
                            {source.title}
                          </h2>
                          <p className="mt-1 break-all text-xs text-ink-3">
                            Nguồn bất biến · Phiên bản{" "}
                            {source.hash.slice(0, 12)} · {source.blocks.length}{" "}
                            khối nội dung
                          </p>
                          <p className="mt-2 text-xs text-ink-3">
                            {source.answerKey
                              ? "Có giữ đáp án gốc khớp phiên bản; không gán tự động vào từng câu."
                              : "Không có đáp án gốc khớp phiên bản này."}
                          </p>
                          {source.extractionMode === "native" && (
                            <p className="mt-2 text-xs text-ok">
                              Giữ cấu trúc từ đề soạn — không gọi AI tách lại. Kiểm tra câu bên dưới rồi xác nhận để AI phân loại kiến thức.
                            </p>
                          )}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className={button}
                              onClick={() => setPreviewSource((v) => !v)}
                            >
                              {previewSource
                                ? "Ẩn bản gốc"
                                : "Xem toàn bộ bản gốc"}
                            </button>
                            {["pending", "processing", "failed"].includes(
                              source.status,
                            ) && (
                              <button
                                type="button"
                                disabled={busy}
                                className={primary}
                                onClick={() =>
                                  void process(
                                    "extract",
                                    source.id,
                                    source.status !== "pending",
                                  )
                                }
                              >
                                {source.status === "failed"
                                  ? "Thử tách lại"
                                  : source.status === "processing"
                                    ? "Tiếp tục xử lý nguồn"
                                    : "Tách câu hỏi bằng AI"}
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={busy}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-danger/30 bg-surface px-3 py-2 text-sm font-medium text-danger hover:bg-danger-soft disabled:opacity-50"
                              onClick={() =>
                                setConfirmDelete({
                                  kind: "source",
                                  id: source.id,
                                  label: source.title,
                                })
                              }
                            >
                              <Trash2 className="size-4" />
                              Xoá nguồn
                            </button>
                          </div>
                          {source.error && (
                            <p
                              role="alert"
                              className="mt-3 rounded-lg bg-danger-soft p-3 text-sm text-danger"
                            >
                              {source.error}
                            </p>
                          )}
                          {source.status === "processing" && (
                            <p className="mt-3 text-xs text-ink-3">
                              Tác vụ có thể vẫn đang chạy trên máy chủ. Tải lại
                              trạng thái; nếu phiên xử lý đã hết hạn, chọn tiếp
                              tục. Không tự động thử lại liên tục.
                            </p>
                          )}
                          {previewSource && (
                            <div className="mt-4">
                              <QuestionPreview
                                title={`Bản gốc ${source.title}`}
                                html={source.rawHtml}
                                large
                              />
                            </div>
                          )}
                          {source.answerKey && (
                            <details className="mt-4 rounded-lg border border-line p-3">
                              <summary className="cursor-pointer text-sm font-medium text-accent">
                                Xem đáp án & barem gốc (lưu riêng)
                              </summary>
                              <p className="my-3 text-xs text-ink-3">
                                Tài liệu đáp án gốc của phiên bản này; không
                                phải đáp án do kho tự tạo hay gán nhãn lại.
                              </p>
                              <QuestionPreview
                                title={`Đáp án gốc ${source.title}`}
                                html={source.answerKey.content}
                                large
                              />
                            </details>
                          )}
                        </div>
                        {source.candidates.length > 0 && (
                          <>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold">
                                  Kiểm tra nội dung câu hỏi
                                </h3>
                                <p className="mt-1 text-xs text-ink-3">
                                  Kiểm tra cả ngữ cảnh, hình và các ý nhỏ. AI tự
                                  sắp xếp chủ đề sau khi duyệt.
                                </p>
                              </div>
                              {source.status === "review" && (
                                <button
                                  type="button"
                                  className={button}
                                  onClick={() =>
                                    setSelection(
                                      new Set(
                                        source.candidates
                                          .filter(
                                            (c) =>
                                              !source.confirmedIds.includes(
                                                c.id,
                                              ),
                                          )
                                          .map((c) => c.id),
                                      ),
                                    )
                                  }
                                >
                                  Chọn tất cả chưa lưu
                                </button>
                              )}
                            </div>
                            <div className="space-y-4">
                              {source.candidates.map((candidate) => {
                                const confirmed = source.confirmedIds.includes(
                                  candidate.id,
                                );
                                return (
                                  <article
                                    key={candidate.id}
                                    className="rounded-lg border border-line bg-surface p-4"
                                  >
                                    <label className="mb-3 flex items-center gap-3 text-sm font-semibold">
                                      <input
                                        type="checkbox"
                                        disabled={
                                          busy ||
                                          confirmed ||
                                          source.status !== "review"
                                        }
                                        checked={
                                          confirmed ||
                                          selection.has(candidate.id)
                                        }
                                        onChange={(e) =>
                                          setSelection((prev) => {
                                            const next = new Set(prev);
                                            if (e.target.checked)
                                              next.add(candidate.id);
                                            else next.delete(candidate.id);
                                            return next;
                                          })
                                        }
                                        className="size-4 accent-accent"
                                      />
                                      {candidate.label}
                                      {confirmed && (
                                        <span className="ml-auto text-xs font-normal text-ok">
                                          Đã lưu vào kho
                                        </span>
                                      )}
                                    </label>
                                    <p className="mb-2 text-xs text-ink-4">
                                      {candidate.contextBlockIds.length
                                        ? `Kèm ${candidate.contextBlockIds.length} khối ngữ cảnh chung · `
                                        : ""}
                                      {candidate.bodyBlockIds.length} khối nội
                                      dung gốc
                                    </p>
                                    <QuestionPreview
                                      title={`Kiểm tra ${candidate.label}`}
                                      html={sourceFragment(source, [
                                        ...candidate.contextBlockIds,
                                        ...candidate.bodyBlockIds,
                                      ])}
                                    />
                                  </article>
                                );
                              })}
                            </div>
                            {source.status === "review" && (
                              <div className="sticky bottom-3 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4 shadow-lg">
                                <span className="text-sm text-ink-2">
                                  {selection.size} câu được chọn
                                </span>
                                <button
                                  type="button"
                                  disabled={busy || !selection.size}
                                  className={primary}
                                  onClick={() => void confirm()}
                                >
                                  Duyệt câu đã chọn và sắp xếp
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="rounded-lg border border-dashed border-line-strong bg-surface p-10 text-center text-sm text-ink-3">
                        {sourceId
                          ? "Nguồn không còn khả dụng trong tài khoản này."
                          : "Chọn một nguồn để xem nội dung, tiếp tục xử lý hoặc kiểm tra câu hỏi."}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {bank && assembleOpen ? (
        <Dialog
          open
          onClose={() => setAssembleOpen(false)}
          labelledBy="bank-assemble-title"
          className="max-w-md p-5"
        >
          <h2 id="bank-assemble-title" className="text-lg font-semibold text-ink">
            Tạo đề mới từ {basket.length} câu hỏi
          </h2>
          <p className="mt-1 text-xs text-ink-3">
            Hệ thống sẽ lắp ghép các câu đã chọn kèm ngữ liệu dùng chung và đáp án thành một đề hoàn chỉnh.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-2">Tên đề thi</span>
              <input
                value={assembleTitle}
                onChange={(e) => setAssembleTitle(e.target.value)}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-2">Môn</span>
                <select
                  value={assembleSubject}
                  onChange={(e) => setAssembleSubject(e.target.value)}
                  className="w-full rounded-md border border-line bg-surface px-2.5 py-2 text-sm"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-2">Khối lớp</span>
                <input
                  value={assembleGrade}
                  onChange={(e) => setAssembleGrade(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  placeholder="9"
                  className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setAssembleOpen(false)} className={button}>
              Huỷ
            </button>
            <button type="button" disabled={busy} onClick={() => void assembleExam()} className={primary}>
              {busy ? "Đang tạo…" : "Tạo đề & mở trình soạn"}
            </button>
          </div>
        </Dialog>
      ) : null}

      {bank && editingQ ? (
        <Dialog
          open
          onClose={() => setEditingQ(null)}
          labelledBy="bank-edit-q-title"
          className="max-w-md p-5"
        >
          <h2 id="bank-edit-q-title" className="text-lg font-semibold text-ink">
            Chỉnh sửa câu hỏi trong kho
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-2">Nhãn câu hỏi</span>
              <input
                value={editingQ.label}
                onChange={(e) => setEditingQ({ ...editingQ, label: e.target.value })}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-2">Loại câu</span>
                <select
                  value={editingQ.questionType}
                  onChange={(e) =>
                    setEditingQ({
                      ...editingQ,
                      questionType: e.target.value as BankQuestionType,
                    })
                  }
                  className="w-full rounded-md border border-line bg-surface px-2.5 py-2 text-sm"
                >
                  <option value="mc">Trắc nghiệm</option>
                  <option value="tf">Đúng/Sai</option>
                  <option value="short">Trả lời ngắn</option>
                  <option value="essay">Tự luận</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-2">Điểm gợi ý</span>
                <input
                  value={editingQ.points}
                  onChange={(e) => setEditingQ({ ...editingQ, points: e.target.value })}
                  placeholder="0.5"
                  className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-2">Đáp án</span>
              <input
                value={editingQ.answer}
                onChange={(e) => setEditingQ({ ...editingQ, answer: e.target.value })}
                placeholder="A / ĐSĐS / -2,5"
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-2">Chủ đề</span>
              <select
                value={editingQ.topicId}
                onChange={(e) => setEditingQ({ ...editingQ, topicId: e.target.value })}
                className="w-full rounded-md border border-line bg-surface px-2.5 py-2 text-sm"
              >
                {bank.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setEditingQ(null)} className={button}>
              Huỷ
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                const pts = editingQ.points.trim()
                  ? Number(editingQ.points.trim().replace(",", "."))
                  : null;
                void mutateApi(`/questions/${editingQ.question.id}`, "PATCH", {
                  label: editingQ.label.trim(),
                  topicId: editingQ.topicId,
                  questionType: editingQ.questionType,
                  answer: editingQ.answer.trim() || null,
                  points: pts !== null && Number.isFinite(pts) ? pts : null,
                }).then((ok) => {
                  if (ok) setEditingQ(null);
                });
              }}
              className={primary}
            >
              Lưu thay đổi
            </button>
          </div>
        </Dialog>
      ) : null}

      {topicDialog ? (
        <Dialog
          open
          onClose={() => setTopicDialog(null)}
          labelledBy="bank-topic-dlg-title"
          className="max-w-sm p-5"
        >
          <h2 id="bank-topic-dlg-title" className="text-base font-semibold text-ink">
            {topicDialog.mode === "create" ? "Thêm chủ đề mới" : "Đổi tên chủ đề"}
          </h2>
          <input
            autoFocus
            value={topicDialog.label}
            onChange={(e) => setTopicDialog({ ...topicDialog, label: e.target.value })}
            placeholder="Tên chủ đề…"
            className="mt-3 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setTopicDialog(null)} className={button}>
              Huỷ
            </button>
            <button
              type="button"
              disabled={busy || !topicDialog.label.trim()}
              onClick={() => {
                if (topicDialog.mode === "create") {
                  void mutateApi("/topics", "POST", {
                    label: topicDialog.label.trim(),
                    parentId: topicDialog.parentId,
                  }).then((ok) => {
                    if (ok) setTopicDialog(null);
                  });
                } else {
                  void mutateApi("/topics", "PATCH", {
                    id: topicDialog.node.id,
                    label: topicDialog.label.trim(),
                  }).then((ok) => {
                    if (ok) setTopicDialog(null);
                  });
                }
              }}
              className={primary}
            >
              Lưu
            </button>
          </div>
        </Dialog>
      ) : null}

      {confirmDelete ? (
        <Dialog
          open
          onClose={() => setConfirmDelete(null)}
          labelledBy="bank-del-title"
          className="max-w-sm p-5"
        >
          <h2 id="bank-del-title" className="text-base font-semibold text-ink">
            Xác nhận xoá
          </h2>
          <p className="mt-2 text-sm text-ink-2">
            Bạn có chắc muốn xoá <strong>{confirmDelete.label}</strong>?
            {confirmDelete.kind === "source"
              ? " Toàn bộ câu hỏi từ nguồn này cũng sẽ bị xoá khỏi kho."
              : confirmDelete.kind === "topic"
                ? " Các câu hỏi trong thư mục này sẽ được chuyển về thư mục cha."
                : ""}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setConfirmDelete(null)} className={button}>
              Huỷ
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                const req =
                  confirmDelete.kind === "question"
                    ? mutateApi(`/questions/${confirmDelete.id}`, "DELETE")
                    : confirmDelete.kind === "source"
                      ? mutateApi(`/sources/${confirmDelete.id}`, "DELETE").then((ok) => {
                          if (ok && sourceId === confirmDelete.id) setSourceId(null);
                          return ok;
                        })
                      : mutateApi(`/topics?id=${encodeURIComponent(confirmDelete.id)}`, "DELETE").then((ok) => {
                          if (ok && topic === confirmDelete.id) setTopic("root");
                          return ok;
                        });
                void req.then((ok) => {
                  if (ok) {
                    if (confirmDelete.kind === "question") {
                      setBasket((prev) => prev.filter((id) => id !== confirmDelete.id));
                    }
                    setConfirmDelete(null);
                  }
                });
              }}
              className="inline-flex items-center justify-center rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Xoá
            </button>
          </div>
        </Dialog>
      ) : null}
      </div>
    </AppFrame>
  );
}
