'use client';

/**
 * Navigation rail: workspace chip, quick find, the two product areas, recent
 * documents, and the account row.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ClipboardCheck,
  FilePlus2,
  FileText,
  LayoutGrid,
  Library,
  LogOut,
  ChevronsLeft,
  Search,
  Settings2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDocs } from '@/lib/docs-store';
import { relativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useShell } from './app-shell';

type NavItem = {
  href: string;
  label: string;
  Icon: typeof FileText;
  /** Matches nested routes such as /doc/<id> or /grading/<id>. */
  also?: string[];
};

const PRIMARY: NavItem[] = [
  { href: '/hub', label: 'Sảnh tính năng', Icon: LayoutGrid },
  { href: '/my-exams', label: 'Đề thi của tôi', Icon: FileText, also: ['/doc'] },
  { href: '/grading', label: 'Chấm bài thi', Icon: ClipboardCheck },
];

const SECONDARY: NavItem[] = [{ href: '/exams', label: 'Đề thi cộng đồng', Icon: Library }];

export function Sidebar() {
  const pathname = usePathname();
  const { user, openDialog, logout } = useAuth();
  const { docs, openNew } = useDocs();
  const { toggleLeft } = useShell();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const exams = useMemo(
    () =>
      docs
        .filter((doc) => doc.kind !== 'answer-key')
        .slice()
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    [docs],
  );

  const term = query.trim().toLowerCase();
  const matches = term ? exams.filter((doc) => doc.title.toLowerCase().includes(term)) : exams.slice(0, 8);

  const isActive = (item: NavItem) =>
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`) ||
    (item.also ?? []).some((prefix) => pathname.startsWith(`${prefix}/`));

  return (
    <div className="flex h-full flex-col">
      {/* Workspace / account chip */}
      <div className="flex h-14 shrink-0 items-center gap-2 px-2.5">
        <button
          type="button"
          onClick={() => (user ? undefined : openDialog())}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface-3"
        >
          <span
            className="grid size-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold text-white"
            style={{ backgroundColor: user?.avatarColor ?? 'var(--color-accent)' }}
          >
            {(user?.name ?? 'S').slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold tracking-tight text-ink">
              {user?.name ?? 'soandethi.com'}
            </span>
            <span className="block truncate text-[11px] leading-tight text-ink-4">
              {user ? `${new Intl.NumberFormat('vi-VN').format(user.points)} điểm` : 'Chưa đăng nhập'}
            </span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={toggleLeft}
          aria-label="Thu gọn thanh bên"
          className="hidden size-7 shrink-0 place-items-center rounded-md text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink lg:grid"
        >
          <ChevronsLeft className="size-[18px]" />
        </button>
      </div>

      {/* Quick find */}
      <div className="px-2.5 pb-2">
        <div className="flex h-9 items-center gap-2 rounded-md border border-transparent bg-surface-3 px-2.5 transition-colors focus-within:border-line-strong focus-within:bg-white">
          <Search className="size-4 shrink-0 text-ink-4" aria-hidden />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm đề của bạn"
            aria-label="Tìm đề của bạn"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-4"
          />
          <kbd className="shrink-0 rounded-sm border border-line bg-white px-1 py-0.5 text-[10px] font-medium text-ink-4">
            ⌘K
          </kbd>
        </div>
      </div>

      <nav aria-label="Điều hướng chính" className="px-2">
        <button
          type="button"
          onClick={() => (user ? openNew() : openDialog('Đăng nhập để soạn đề mới'))}
          className="mb-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
        >
          <FilePlus2 className="size-4 shrink-0 text-ink-3" aria-hidden />
          Soạn đề mới
        </button>

        {PRIMARY.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] transition-colors',
                active
                  ? 'bg-white font-medium text-ink shadow-[var(--shadow-xs)]'
                  : 'font-medium text-ink-2 hover:bg-surface-3 hover:text-ink',
              )}
            >
              <item.Icon className={cn('size-4 shrink-0', active ? 'text-accent' : 'text-ink-3')} aria-hidden />
              {item.label}
            </Link>
          );
        })}

        {SECONDARY.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] transition-colors',
                active
                  ? 'bg-white font-medium text-ink shadow-[var(--shadow-xs)]'
                  : 'font-medium text-ink-2 hover:bg-surface-3 hover:text-ink',
              )}
            >
              <item.Icon className={cn('size-4 shrink-0', active ? 'text-accent' : 'text-ink-3')} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <p className="px-2.5 pb-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-ink-4 uppercase">
          {term ? 'Kết quả' : 'Gần đây'}
        </p>

        {matches.length === 0 ? (
          <p className="px-2.5 py-2 text-[12.5px] text-ink-4">
            {term ? 'Không tìm thấy đề nào.' : 'Chưa có đề nào được lưu.'}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {matches.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/doc/${doc.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                    pathname === `/doc/${doc.id}`
                      ? 'bg-white font-medium text-ink shadow-[var(--shadow-xs)]'
                      : 'text-ink-2 hover:bg-surface-3 hover:text-ink',
                  )}
                  title={`${doc.title} · sửa ${relativeTime(doc.updatedAt)}`}
                >
                  <FileText className="size-3.5 shrink-0 text-ink-4" aria-hidden />
                  <span className="truncate">{doc.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="shrink-0 border-t border-line p-2">
        <Link
          href="/my-exams"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
        >
          <Settings2 className="size-4 shrink-0 text-ink-3" aria-hidden />
          Quản lý đề
        </Link>
        {user ? (
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
          >
            <LogOut className="size-4 shrink-0 text-ink-3" aria-hidden />
            Đăng xuất
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openDialog()}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-accent transition-colors hover:bg-accent-soft"
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
}
