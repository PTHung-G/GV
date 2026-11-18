'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Copy, Download, Loader2, Pencil, Share2 } from 'lucide-react';
import type { CommunityExam } from '@/lib/community-exams';
import { subjectLabel } from '@/lib/site';
import { useAuth } from '@/lib/auth-context';
import { useDocs } from '@/lib/docs-store';

export function ExamDetail({ exam }: { exam: CommunityExam }) {
  const { user, openDialog } = useAuth();
  const { create } = useDocs();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToEditor = () => {
    if (!user) {
      openDialog('Đăng nhập để sao đề vào trình soạn');
      return;
    }
    setBusy(true);
    const id = create({
      title: exam.title,
      subject: exam.subject,
      grade: exam.grade,
      sourceId: exam.slug,
      contentStatus: 'preview',
      authorName: exam.author,
      content: exam.preview
        .map((line, i) => (i === 0 ? `<h1>${escapeHtml(line)}</h1>` : `<p>${escapeHtml(line)}</p>`))
        .join('\n'),
    });
    router.push(`/doc/${id}`);
  };

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="mx-auto w-full max-w-(--page-max) px-(--gutter) py-8 sm:py-10">
      <Link href="/exams" className="inline-flex items-center gap-1.5 text-[14px] text-ink-3 hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Đề thi cộng đồng
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 max-w-3xl">
          <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight">{exam.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-ink-2">
            <span className="rounded-md bg-surface-3 px-2 py-[3px] text-xs font-medium text-ink">
              {subjectLabel(exam.subject)}
            </span>
            <span className="rounded-md bg-surface-3 px-2 py-[3px] text-xs font-medium text-ink">
              Lớp {exam.grade}
            </span>
            <span className="ml-1 flex items-center gap-1.5">
              <span
                className="grid size-[18px] place-items-center rounded-full text-[9px] font-semibold text-white"
                style={{ backgroundColor: exam.authorColor }}
                aria-hidden
              >
                {exam.author.slice(0, 1).toUpperCase()}
              </span>
              {exam.author}
            </span>
            <span className="flex items-center gap-1">
              <Copy className="size-3.5" aria-hidden />
              {exam.copies} lượt sử dụng
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={share}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line-strong bg-white px-3.5 text-[14px] font-medium hover:bg-surface-2"
          >
            <Share2 className="size-4" aria-hidden />
            {copied ? 'Đã sao liên kết' : 'Chia sẻ'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line-strong bg-white px-3.5 text-[14px] font-medium hover:bg-surface-2"
          >
            <Download className="size-4" aria-hidden />
            In bản xem trước
          </button>
          <button
            type="button"
            onClick={copyToEditor}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-[14px] font-semibold text-white hover:bg-accent-hover disabled:opacity-70"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Pencil className="size-4" aria-hidden />}
            Sao về trình soạn
          </button>
        </div>
      </div>

      <p className="mt-5 border-l-2 border-warn-line bg-warn-soft px-3 py-2 text-sm text-warn">Chỉ có bản xem trước, chưa có toàn bộ câu hỏi và đáp án. Bản sao cần được bổ sung, xác nhận đầy đủ trước khi dùng để chấm bài.</p>
      <div className="mt-8 rounded-sm border border-line bg-white p-8 shadow-[var(--shadow-sm)] sm:p-12">
        <article className="doc-page mx-auto max-w-[720px] text-[15.5px] leading-[1.75]">
          {exam.preview.map((line, i) => {
            const isTitle = i === 0;
            const isHead = !isTitle && (i < 3 || /^PHẦN|^HƯỚNG DẪN|^ĐÁP ÁN/.test(line));
            return (
              <p
                key={`${i}-${line.slice(0, 10)}`}
                className={
                  isTitle
                    ? 'mb-4 text-center text-[1.3em] font-bold'
                    : isHead
                      ? 'mb-1 text-center'
                      : 'mb-2 pl-1 text-left'
                }
              >
                {line}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
