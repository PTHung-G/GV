"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Folder,
  RefreshCw,
  Search,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { basePath } from "@/lib/api-url";
import type { BankEnvelope, BankSource } from "@/lib/question-bank/types";
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
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    setExpandedQuestions(new Set());
  }, [ownerId, topic, query]);
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
      const origin = bank.sources.find((s) => s.id === question.sourceId);
      const text = [
        question.label,
        origin?.title,
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
          <button
            type="button"
            onClick={() => {
              setTopic(node.id);
              setTab("questions");
            }}
            aria-pressed={topic === node.id}
            style={{ paddingLeft: `${12 + depth * 14}px` }}
            className={`flex w-full items-center gap-2 rounded-lg py-2.5 pr-3 text-left text-sm ${topic === node.id ? "bg-accent-soft font-semibold text-accent" : "text-ink-2 hover:bg-surface-2"}`}
          >
            <Folder className="size-4 shrink-0" />
            <span className="min-w-0 break-words">{node.label}</span>
          </button>
          {tree(node.id, depth + 1)}
        </div>
      ));
  }

  return (
    <main className="min-h-dvh bg-surface-2 text-ink">
      <header className="border-b border-line bg-surface px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/my-exams"
              className="mb-3 inline-flex items-center gap-1 text-xs text-ink-3 hover:text-accent"
            >
              <ArrowLeft className="size-3" /> Đề thi của tôi
            </Link>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
              <span className="rounded-lg bg-accent-soft p-2 text-accent">
                <BookOpen className="size-6" />
              </span>
              Kho câu hỏi
            </h1>
            <p className="mt-2 text-sm text-ink-3">
              Kho riêng của bạn · Giữ nguyên nội dung, sắp xếp theo chủ đề bằng
              AI
            </p>
          </div>
          {ownerId && (
            <button
              type="button"
              onClick={() => void request()}
              disabled={busy}
              className={button}
            >
              <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />{" "}
              Tải lại trạng thái
            </button>
          )}
        </div>
      </header>
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
                    <h2 className="px-3 pb-3 pt-1 text-xs font-semibold uppercase tracking-wide text-ink-4">
                      Chủ đề
                    </h2>
                    {tree(null)}
                    <p className="px-3 pt-4 text-xs leading-5 text-ink-4">
                      Bao gồm câu hỏi thuộc chủ đề đang chọn và các chủ đề con.
                    </p>
                  </aside>
                  <section className="min-w-0">
                    <label className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3">
                      <Search className="size-4 text-ink-4" />
                      <input
                        aria-label="Tìm câu hỏi theo nội dung hoặc tên nguồn"
                        placeholder="Tìm nội dung câu hỏi, tên nguồn…"
                        className="w-full bg-transparent text-sm outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                    <p className="mb-3 text-xs text-ink-3">
                      {questions.length} câu hỏi
                    </p>
                    <div className="space-y-4">
                      {questions.map((question) => {
                        const origin = bank.sources.find(
                          (s) => s.id === question.sourceId,
                        );
                        return (
                          <article
                            key={question.id}
                            className="rounded-lg border border-line bg-surface p-4"
                          >
                            <h3 className="mb-1 text-sm font-semibold">
                              {question.label}
                            </h3>
                            <p className="mb-3 text-xs text-ink-3">
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
                                      html={sourceFragment(origin, [
                                        ...question.contextBlockIds,
                                        ...question.bodyBlockIds,
                                      ])}
                                    />
                                  </div>
                                )}
                              </details>
                            )}
                          </article>
                        );
                      })}
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
    </main>
  );
}
