'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown, Copy, LayoutGrid, List, Search } from 'lucide-react';
import type { CommunityExam } from '@/lib/community-exams';
import { GRADES, SUBJECTS, subjectLabel } from '@/lib/site';
import { cn } from '@/lib/utils';
import { ExamPaperPreview } from './exam-paper-preview';

const PAGE_SIZE = 20;

function SubjectPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'h-9 shrink-0 rounded-md border px-3.5 text-[14px] font-medium whitespace-nowrap transition-colors',
        active
          ? 'border-ink bg-ink text-white'
          : 'border-line bg-white text-ink-2 hover:border-ink/40 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}

function GradeFilter({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-label="Lọc theo lớp"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-[156px] items-center justify-between gap-2 rounded-md border border-line-strong bg-white px-3 text-[15px] font-medium text-ink shadow-xs transition-colors hover:bg-surface-2"
      >
        {value ? `Lớp ${value}` : 'Mọi lớp'}
        <ChevronDown className={cn('size-4 opacity-50 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-40 mt-1.5 max-h-[320px] w-[156px] overflow-y-auto rounded-md border border-line bg-white p-1.5 shadow-[var(--shadow-md)]">
            {[{ v: null as number | null, label: 'Mọi lớp' }, ...GRADES.map((g) => ({ v: g, label: `Lớp ${g}` }))].map(
              (opt) => (
                <button
                  key={String(opt.v)}
                  type="button"
                  onClick={() => {
                    onChange(opt.v);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[14px] hover:bg-surface-3',
                    opt.v === value ? 'font-semibold text-ink' : 'text-ink-2',
                  )}
                >
                  {opt.label}
                  {opt.v === value && <span className="text-accent">✓</span>}
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ExamCard({ exam, view }: { exam: CommunityExam; view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <Link
        href={`/exams/${exam.slug}`}
        className="flex items-center gap-4 rounded-md border border-line bg-white p-3 transition-colors hover:border-ink-2"
      >
        <div className="w-[74px] shrink-0 overflow-hidden rounded-sm border border-line">
          <div className="aspect-[208/263]">
            <ExamPaperPreview lines={exam.preview} scale={0.6} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-ink">{exam.title}</p>
          <div className="mt-2 flex items-center gap-1">
            <span className="rounded-md bg-surface-3 px-2 py-[3px] text-xs font-medium text-ink">
              {subjectLabel(exam.subject)}
            </span>
            {exam.grade > 0 ? (
              <span className="rounded-md bg-surface-3 px-2 py-[3px] text-xs font-medium text-ink">
                Lớp {exam.grade}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pr-1 text-xs text-ink-2">
          <span className="size-[18px] rounded-full" style={{ backgroundColor: exam.authorColor }} aria-hidden />
          <span className="max-w-[120px] truncate">{exam.author}</span>
          <span className="flex items-center gap-0.5" title="Lượt sử dụng đề">
            <Copy className="size-3" aria-hidden />
            {exam.copies}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/exams/${exam.slug}`}
      className="flex w-full min-w-0 flex-col overflow-hidden rounded-sm border border-ink-4 bg-white text-left transition-colors hover:border-ink-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink-2"
    >
      <div className="aspect-[208/263] w-full shrink-0">
        <ExamPaperPreview lines={exam.preview} />
      </div>
      <div className="min-w-0 border-t border-ink-4 pt-4 pr-2 pb-3.5 pl-4 max-[519px]:pt-3 max-[519px]:pb-2.5 max-[519px]:pl-3">
        <p
          className="ml-0.5 line-clamp-2 h-9 pr-1 text-sm leading-[18px] font-medium text-ink"
          title={exam.title}
        >
          {exam.title}
        </p>
        <div className="mt-2 flex h-[22px] items-center gap-1 overflow-hidden">
          <span
            className="min-w-0 truncate rounded-md bg-surface-3 px-2 py-[3px] text-xs font-medium text-ink"
            title={subjectLabel(exam.subject)}
          >
            {subjectLabel(exam.subject)}
          </span>
          {exam.grade > 0 ? (
            <span className="shrink-0 rounded-md bg-surface-3 px-2 py-[3px] text-xs font-medium text-ink">
              Lớp {exam.grade}
            </span>
          ) : null}
        </div>
        <div className="mt-2.5 flex h-[18px] items-center gap-1.5 pr-2 text-xs text-ink-2">
          <span
            className="grid size-[18px] shrink-0 place-items-center overflow-hidden rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: exam.authorColor }}
            aria-hidden
          >
            {exam.author.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 truncate">{exam.author}</span>
          <span className="flex shrink-0 items-center gap-0.5" title="Lượt sử dụng đề">
            <Copy className="size-3" aria-hidden />
            {exam.copies}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ExamsBrowser({ exams }: { exams: CommunityExam[] }) {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<string | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exams.filter((e) => {
      if (subject && e.subject !== subject) return false;
      if (grade && e.grade !== grade) return false;
      if (q && !`${e.title} ${subjectLabel(e.subject)} lớp ${e.grade}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [exams, query, subject, grade]);

  const visible = filtered.slice(0, limit);

  return (
    <>
      <div role="search" className="mt-7 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-ink-3"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            className="flex h-11 w-full rounded-md border border-line-strong bg-white pr-3 pl-10 text-[15px] text-ink shadow-xs outline-none transition-colors placeholder:text-ink-4 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/15"
            placeholder="Tìm đề theo tên hoặc nội dung"
            aria-label="Tìm đề thi"
          />
        </label>
        <GradeFilter
          value={grade}
          onChange={(v) => {
            setGrade(v);
            setLimit(PAGE_SIZE);
          }}
        />
        <div role="group" aria-label="Cách xem" className="flex h-11 items-center rounded-md border border-line-strong p-1">
          <button
            type="button"
            aria-label="Dạng lưới"
            aria-pressed={view === 'grid'}
            onClick={() => setView('grid')}
            className={cn(
              'flex size-8 items-center justify-center rounded-sm transition-colors hover:text-ink',
              view === 'grid' ? 'bg-surface-3 text-ink' : 'text-ink-3',
            )}
          >
            <LayoutGrid className="size-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Dạng danh sách"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
            className={cn(
              'flex size-8 items-center justify-center rounded-sm transition-colors hover:text-ink',
              view === 'list' ? 'bg-surface-3 text-ink' : 'text-ink-3',
            )}
          >
            <List className="size-[18px]" />
          </button>
        </div>
      </div>

      <div
        role="group"
        aria-label="Lọc theo môn học"
        className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
      >
        <SubjectPill
          active={subject === null}
          onClick={() => {
            setSubject(null);
            setLimit(PAGE_SIZE);
          }}
        >
          Tất cả môn
        </SubjectPill>
        {SUBJECTS.map((s) => (
          <SubjectPill
            key={s.id}
            active={subject === s.id}
            onClick={() => {
              setSubject(s.id);
              setLimit(PAGE_SIZE);
            }}
          >
            {s.label}
          </SubjectPill>
        ))}
      </div>

      <div className="mt-6 mb-4 flex min-h-6 items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-sm font-semibold text-ink" aria-live="polite">
          {filtered.length} đề
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-md border border-dashed border-line-strong bg-surface-2 py-16 text-center">
          <p className="text-[15px] font-medium text-ink">Không tìm thấy đề phù hợp</p>
          <p className="mt-1 text-[14px] text-ink-3">Thử bỏ bộ lọc môn hoặc lớp, hoặc tìm bằng từ khoá khác.</p>
        </div>
      ) : (
        <div
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-2 gap-3 min-[520px]:grid-cols-[repeat(auto-fill,210px)] min-[520px]:gap-5'
              : 'flex flex-col gap-2',
          )}
        >
          {visible.map((exam) => (
            <ExamCard key={exam.slug} exam={exam} view={view} />
          ))}
        </div>
      )}

      {filtered.length > limit && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="h-10 rounded-md border border-line-strong bg-white px-4 text-[14px] font-medium text-ink transition-colors hover:bg-surface-2"
          >
            Xem thêm đề
          </button>
        </div>
      )}
    </>
  );
}
