'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileText,
  Layers,
  Loader2,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDocs } from '@/lib/docs-store';
import { basePath } from '@/lib/api-url';
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
    body: 'Mô tả đề bạn cần, trợ lý AI soạn bản đầu tiên trên trang A4 rồi bạn chỉnh tiếp và tạo barem.',
    Icon: FileText,
    points: ['Soạn đề A4 với AI', 'Đề thi của tôi', 'Đáp án & barem'],
    tone: 'bg-accent-soft text-accent',
  },
  {
    href: '/question-bank',
    title: 'Kho câu hỏi',
    body: 'Tổ chức câu hỏi theo cây chủ đề, giữ nguyên công thức & đáp án để lắp ghép nhanh đề kiểm tra mới.',
    Icon: BookOpen,
    points: ['Sắp xếp chủ đề', 'Ghép đề từ giỏ câu'],
    tone: 'bg-surface-3 text-ink',
  },
  {
    href: '/exam-releases',
    title: 'Bộ mã đề & OMR',
    body: 'Trộn nhiều mã đề chuẩn 4 phần THPT 2025, sinh phiếu tô OMR theo lớp và xem bảng điểm hợp nhất.',
    Icon: Layers,
    points: ['Trộn 4 phần THPT 2025', 'Bảng điểm & CSV'],
    tone: 'bg-accent-soft text-accent',
  },
  {
    href: '/grading',
    title: 'Chấm bài thi',
    body: 'Quét phiếu trắc nghiệm OMR bằng điện thoại, AI gợi ý chấm tự luận theo từng ý barem.',
    Icon: ClipboardCheck,
    points: ['Quét phiếu OMR', 'Chấm tự luận AI'],
    tone: 'bg-ok-soft text-ok',
  },
  {
    href: '/classes',
    title: 'Quản lý lớp học',
    body: 'Nhập danh sách học sinh từ CSV/Excel, cấp SBD tự động để đối khớp tên ngay khi quét bài.',
    Icon: Users,
    points: ['Danh sách lớp & SBD', 'Đối khớp khi chấm'],
    tone: 'bg-surface-3 text-ink',
  },
];

export function FeatureHall() {
  const { user, ready, openDialog } = useAuth();
  const { docs } = useDocs();
  const [counts, setCounts] = useState<{
    classes: number | null;
    releases: number | null;
    sessions: number | null;
  }>({ classes: null, releases: null, sessions: null });

  const examCount = useMemo(
    () => docs.filter((doc) => doc.kind !== 'answer-key').length,
    [docs],
  );

  useEffect(() => {
    if (!user) {
      setCounts({ classes: null, releases: null, sessions: null });
      return;
    }
    let active = true;
    void Promise.all([
      fetch(basePath('/api/classes'), { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(basePath('/api/exam-releases'), { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(basePath('/api/grading/sessions'), { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([cls, rel, ses]) => {
      if (!active) return;
      setCounts({
        classes: Array.isArray(cls?.classes) ? cls.classes.length : 0,
        releases: Array.isArray(rel?.releases) ? rel.releases.length : 0,
        sessions: Array.isArray(ses?.sessions) ? ses.sessions.length : 0,
      });
    });
    return () => {
      active = false;
    };
  }, [user]);

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
            ['Soạn hoặc ghép đề', 'Soạn AI trên A4 hoặc chọn câu từ Kho câu hỏi.'],
            ['Gắn lớp & xuất mã đề', 'Chọn lớp học, sinh bộ mã đề kèm phiếu tô OMR.'],
            ['Quét bài trên điện thoại', 'Quét OMR 4 phần THPT 2025 và duyệt phần tự luận.'],
            ['Xuất bảng điểm', 'Xem điểm toàn lớp và tải file CSV ngay tức thì.'],
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
        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink">
            Soạn đề và chấm bài
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-3">
            Quy trình khép kín từ kho câu hỏi, soạn đề A4, quản lý lớp đến chấm bài &amp; tổng hợp bảng điểm.
          </p>

          {ready && user ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Đề của tôi', value: examCount, href: '/my-exams' },
                { label: 'Lớp học', value: counts.classes ?? '—', href: '/classes' },
                { label: 'Bộ mã đề', value: counts.releases ?? '—', href: '/exam-releases' },
                { label: 'Đợt chấm', value: counts.sessions ?? '—', href: '/grading' },
              ].map((stat) => (
                <Link
                  key={stat.href}
                  href={stat.href}
                  className="rounded-lg border border-line bg-white px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <p className="text-[11.5px] font-medium text-ink-3">{stat.label}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{stat.value}</p>
                </Link>
              ))}
            </div>
          ) : null}

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
