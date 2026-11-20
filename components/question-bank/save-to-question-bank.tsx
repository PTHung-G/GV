"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { basePath } from "@/lib/api-url";
import { examContentHash } from "@/lib/exam-revision";
import { parseAnswerKeyHtml } from "@/lib/grading/answer-key-html";
import type { BankEnvelope } from "@/lib/question-bank/types";
import { reconcileStructure, type StructuredExam } from "@/lib/structured-exam";
import { snapshotSource } from "./source-snapshot";

type KeyDocument = {
  content: string;
  sourceContentHash?: string;
  answerKeyQuestions?: unknown[];
};
export function SaveToQuestionBank({
  docId,
  title,
  capture,
  keyDocs,
  structure,
}: {
  docId: string;
  title: string;
  capture: () => string;
  keyDocs: KeyDocument[];
  structure?: StructuredExam;
}) {
  const { user, openDialog } = useAuth();
  const ownerId = user?.id;
  const currentOwner = useRef(ownerId);
  currentOwner.current = ownerId;
  const router = useRouter();
  const controller = useRef<AbortController | null>(null);
  const operation = useRef<{
    ownerId: string;
    payload: string;
    key: string;
  } | null>(null);
  const [snapshot, setSnapshot] = useState<{
    html: string;
    title: string;
    ownerId: string;
    docId: string;
    structure?: StructuredExam;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cancel = () => {
    controller.current?.abort();
    controller.current = null;
    setBusy(false);
    setSnapshot(null);
    setError("");
  };
  useEffect(() => {
    controller.current?.abort();
    setSnapshot(null);
    setBusy(false);
    setError("");
    operation.current = null;
    return () => {
      controller.current?.abort();
    };
  }, [ownerId, docId]);
  const save = async () => {
    if (
      !ownerId ||
      !snapshot ||
      snapshot.ownerId !== ownerId ||
      snapshot.docId !== docId ||
      busy
    )
      return;
    const owner = ownerId;
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    setError("");
    try {
      const source = snapshotSource(snapshot.html);
      const matchingKey = keyDocs.find(
        (key) => key.sourceContentHash === examContentHash(snapshot.html),
      );
      const parsedQuestions =
        matchingKey && matchingKey.answerKeyQuestions?.length
          ? matchingKey.answerKeyQuestions
          : matchingKey?.content.trim()
            ? parseAnswerKeyHtml(matchingKey.content)
            : [];
      const payload = JSON.stringify({
        docId,
        title: snapshot.title,
        ...source,
        ...(snapshot.structure ? { structure: snapshot.structure } : {}),
        ...(matchingKey
          ? {
              answerKey: {
                content: matchingKey.content,
                questions: parsedQuestions,
              },
            }
          : {}),
      });
      if (
        operation.current?.ownerId !== owner ||
        operation.current.payload !== payload
      )
        operation.current = {
          ownerId: owner,
          payload,
          key: crypto.randomUUID(),
        };
      const response = await fetch(basePath("/api/question-bank/sources"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: request.signal,
        body: JSON.stringify({
          ...JSON.parse(payload),
          ownerId: owner,
          operationKey: operation.current.key,
        }),
      });
      const data = (await response.json()) as BankEnvelope & {
        sourceId: string;
        error?: string;
      };
      if (
        request.signal.aborted ||
        currentOwner.current !== owner ||
        controller.current !== request
      )
        return;
      if (!response.ok)
        throw new Error(data.error || "Chưa lưu được nguồn. Vui lòng thử lại.");
      if (data.ownerId !== owner || !data.sourceId)
        throw new Error("Phiên đăng nhập đã thay đổi. Hãy tải lại trang.");
      setSnapshot(null);
      router.push(`/question-bank?source=${encodeURIComponent(data.sourceId)}`);
    } catch (err) {
      if (
        !request.signal.aborted &&
        currentOwner.current === owner &&
        controller.current === request
      )
        setError(
          err instanceof Error ? err.message : "Không thể kết nối kho câu hỏi.",
        );
    } finally {
      if (currentOwner.current === owner && controller.current === request)
        setBusy(false);
    }
  };
  return (
    <>
      <Link
        href="/question-bank"
        className="rounded-md px-2 py-2 text-xs font-medium text-ink-2 hover:bg-surface-3"
      >
        Kho câu hỏi
      </Link>
      <button
        type="button"
        className="rounded-md bg-accent px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-accent-hover disabled:opacity-50"
        onClick={() => {
          if (!ownerId) {
            openDialog("Đăng nhập để lưu vào kho câu hỏi riêng.");
            return;
          }
          // Capture before opening the modal, not a later server snapshot or stale doc.content.
          const html = capture();
          setSnapshot({
            html,
            title: title.trim() || "Đề chưa đặt tên",
            ownerId,
            docId,
            structure: structure ? reconcileStructure(snapshotSource(html).rawHtml, structure) ?? undefined : undefined,
          });
          setError("");
        }}
      >
        Chốt và lưu câu hỏi
      </button>
      {snapshot && snapshot.ownerId === ownerId && snapshot.docId === docId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          role="presentation"
          onClick={cancel}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bank-save-title"
            className="w-full max-w-lg rounded-lg border border-line bg-surface p-6 text-ink shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
          >
            <h2 id="bank-save-title" className="text-lg font-semibold">
              Chốt và lưu câu hỏi
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-2">
              Lưu một phiên bản riêng của <strong>{snapshot.title}</strong> từ
              nội dung đang soạn. Đề gốc không bị thay đổi. {snapshot.structure
                ? `Đã có cấu trúc ${snapshot.structure.questions.length} câu: bạn kiểm tra trực tiếp, không gọi AI tách lại. Sau khi xác nhận, AI mới phân loại kiến thức.`
                : 'Đề chưa có cấu trúc câu hỏi hợp lệ (đề nhập ngoài hoặc ranh giới đã thay đổi). Nguồn vẫn được giữ nguyên; AI sẽ tách câu để bạn kiểm tra trước khi đưa vào kho.'}
            </p>
            <p className="mt-2 text-xs text-ink-3">
              Chỉ giữ đáp án gốc nếu khớp chính xác phiên bản đề này. Không tự
              suy đoán đáp án cho từng câu.
            </p>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-md bg-danger-soft p-3 text-sm text-danger"
              >
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                autoFocus
                type="button"
                onClick={cancel}
                className="rounded-md border border-line px-4 py-2 text-sm"
              >
                {busy ? "Đóng" : "Hủy"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void save()}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {busy ? "Đang lưu nguồn…" : "Lưu nguồn và tiếp tục"}
              </button>
            </div>
            {busy && (
              <p role="status" className="mt-2 text-xs text-ink-3">
                Đóng chỉ dừng chờ trên trình duyệt; nguồn đã được máy chủ nhận
                vẫn có trong kho.
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
