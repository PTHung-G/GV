'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, ClipboardCheck, FileText, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDocs } from '@/lib/docs-store';
import { relativeTime } from '@/lib/utils';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';

type Feature = {
  href: string;
  title: string;
  body: string;
  Icon: typeof FileText;
  /** Short list of what the feature covers, shown under the description. */
  points: string[];
  tone: string;
};

const FEATURES: Feature[] = [
  {
    href: '/my-exams',
    title: 'Soạn đề thi',
    body: 'Mô tả đề bạn cần, trợ lý AI soạn bản đầu tiên trên trang A4 rồi bạn chỉnh tiếp trong trình soạn.',
    Icon: FileText,
    points: ['Soạn đề mới bằng AI', 'Đề thi của tôi', 'Đề thi cộng đồng', 'Đáp án và thang điểm'],
    tone: 'bg-accent-soft text-accent',
  },
  {
    href: '/grading',
    title: 'Chấm bài thi',
    body: 'Chấm bài làm của học sinh theo đáp án và barem đã soạn, tổng hợp điểm cho cả lớp.',
    Icon: ClipboardCheck,
    points: ['Chấm theo barem', 'Bảng điểm cả lớp'],
    tone: 'bg-ok-soft text-ok',
  },
];

export function FeatureHall() {
  const { user, ready, openDialog } = useAuth();
  const { docs } = useDocs();

  const recent = useMemo(
    () =>
      docs
        .filter((doc) => doc.kind !== 'answer-key')
        .slice()
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 4),
    [docs],
  );

  const aside = (
    <div className="space-y-3 p-3">
      <section className="rounded-md border border-line bg-white p-3.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-ink-4 uppercase">
          <Sparkles className="size-3.5" aria-hidden /> Bắt đầu nhanh
        </p>
        <ol className="mt-2.5 space-y-2.5">
          {[
            ['Tạo đề', 'Mô tả môn, lớp, số câu — trợ lý soạn bản nháp.'],
            ['Chỉnh trên A4', 'Sửa câu chữ, chèn công thức, xuất PDF hoặc in.'],
            ['Tạo đáp án', 'Barem nằm ở trang riêng, không lẫn vào đề.'],
            ['Chấm bài', 'In phiếu trả lời, quét bằng điện thoại, chốt điểm.'],
          ].map(([title, body], index) => (
            <li key={title} className="flex gap-2.5">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[10.5px] font-semibold text-accent">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-ink">{title}</span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-3">{body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-md border border-line bg-white p-3.5">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-ink-4 uppercase">Đề vừa sửa</p>
        {recent.length === 0 ? (
          <p className="mt-2 text-[12.5px] text-ink-4">Chưa có đề nào.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {recent.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/doc/${doc.id}`}
                  className="flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors hover:bg-surface-2"
                >
                  <FileText className="size-3.5 shrink-0 text-ink-4" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{doc.title}</span>
                  <span className="shrink-0 text-[11px] text-ink-4">{relativeTime(doc.updatedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );

  return (
    <AppFrame aside={aside} asideTitle="Bảng điều khiển" asideIcon={<Sparkles className="size-4" />}>
      <ShellHeader title="Sảnh tính năng" subtitle={user ? user.email : 'Chưa đăng nhập'} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink">
            Soạn đề và chấm bài
          </h1>

          {!ready ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg border border-line bg-white" />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {FEATURES.map(({ href, title, body, Icon, points, tone }) => {
                const inner = (
                  <>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-md ${tone}`}>
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[15.5px] font-semibold tracking-tight text-ink">
                        {title}
                        <ArrowRight
                          aria-hidden
                          className="size-4 -translate-x-1 text-ink-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-ink-3">{body}</span>
                      <span className="mt-2.5 flex flex-wrap gap-1.5">
                        {points.map((point) => (
                          <span
                            key={point}
                            className="rounded-md bg-surface-3 px-2 py-1 text-[11.5px] font-medium text-ink-2"
                          >
                            {point}
                          </span>
                        ))}
                      </span>
                    </span>
                  </>
                );

                const className =
                  'group flex w-full items-start gap-3.5 rounded-lg border border-line bg-surface-2 p-4 text-left transition-all hover:border-line-strong hover:bg-white hover:shadow-[var(--shadow-sm)]';

                return user ? (
                  <Link key={href} href={href} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    key={href}
                    type="button"
                    onClick={() => openDialog(`Đăng nhập để dùng ${title.toLowerCase()}`)}
                    className={className}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          )}

          {ready && !user ? (
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-line bg-white p-3.5">
              <p className="text-[13px] text-ink-2">Bạn cần đăng nhập để mở sảnh tính năng.</p>
              <button
                type="button"
                onClick={() => openDialog()}
                className="ml-auto inline-flex h-8 items-center gap-2 rounded-md bg-accent px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Đăng nhập
              </button>
            </div>
          ) : null}

          {!ready ? (
            <p className="mt-5 flex items-center gap-2 text-[12.5px] text-ink-4">
              <Loader2 className="size-3.5 animate-spin" aria-hidden /> Đang kiểm tra đăng nhập…
            </p>
          ) : null}
        </div>
      </div>
    </AppFrame>
  );
}
