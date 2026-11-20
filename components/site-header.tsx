'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, LayoutGrid, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDocs } from '@/lib/docs-store';
import { cn } from '@/lib/utils';
import { basePath } from '@/lib/api-url';
import { APP_NAME } from '@/lib/site';
import { Dropdown } from '@/components/ui/dropdown';

export function Logo({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('brand-logo inline-block', className)}>
      <img src={basePath('/brand/logo-light.png')} alt="" width={800} height={800} className="brand-logo-light h-full w-full object-contain" />
      <img src={basePath('/brand/logo-dark.png')} alt="" width={800} height={800} className="brand-logo-dark h-full w-full object-contain" />
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={className}>{APP_NAME}</span>;
}

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${APP_NAME} - về trang chủ`}
      className={cn('flex w-fit shrink-0 items-center gap-2 rounded-md px-1.5 py-1 hover:bg-surface-3', className)}
    >
      <Logo className="size-7 shrink-0" />
      <Wordmark className="text-[15px] font-semibold tracking-tight text-ink" />
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-9 shrink-0 items-center rounded-md px-3 text-[15px] font-medium whitespace-nowrap text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink',
        active && 'bg-surface-3 font-semibold text-ink',
      )}
    >
      {children}
    </Link>
  );
}

function CreateExamButton() {
  const { openNew } = useDocs();
  const { user, openDialog } = useAuth();
  return (
    <button
      type="button"
      onClick={() => (user ? openNew() : openDialog('Đăng nhập để soạn đề mới'))}
      className="flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-[15px] font-medium whitespace-nowrap text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
    >
      Soạn đề
    </button>
  );
}

function AccountMenu() {
  const { user, openDialog, logout } = useAuth();

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openDialog()}
        aria-label="Đăng nhập"
        className="flex h-9 items-center gap-1.5 rounded-md bg-accent px-4 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        <UserRound className="size-4" aria-hidden />
        Đăng nhập
      </button>
    );
  }

  return (
    <Dropdown
      align="end"
      className="w-[248px]"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="flex h-10 items-center gap-2 rounded-md px-1.5 hover:bg-surface-3"
        >
          <span
            className="grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block max-w-[140px] truncate text-[13px] font-medium text-ink">{user.name}</span>
            <span className="block max-w-[140px] truncate text-[11px] text-ink-3">{user.email}</span>
          </span>
          <ChevronDown className="size-3.5 text-ink-4" aria-hidden />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="px-2.5 py-2">
            <p className="truncate text-[13px] font-semibold text-ink">{user.name}</p>
            <p className="truncate text-[12px] text-ink-3">{user.email}</p>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link
            href="/my-exams"
            onClick={close}
            className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[14px] text-ink hover:bg-surface-3"
          >
            <UserRound className="size-4 text-ink-3" /> Đề thi của tôi
          </Link>
          <Link
            href="/hub"
            onClick={close}
            className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[14px] text-ink hover:bg-surface-3"
          >
            <LayoutGrid className="size-4 text-ink-3" /> Sảnh tính năng
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              close();
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[14px] text-ink hover:bg-surface-3"
          >
            <LogOut className="size-4 text-ink-3" /> Đăng xuất
          </button>
        </>
      )}
    </Dropdown>
  );
}

function MainNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Điều hướng chính" className={className}>
      <NavLink href="/hub">Sảnh tính năng</NavLink>
      <CreateExamButton />
      <NavLink href="/exams">Đề thi cộng đồng</NavLink>
      <NavLink href="/my-exams">Đề thi của tôi</NavLink>
      <NavLink href="/grading">Chấm bài</NavLink>
    </nav>
  );
}

const MOBILE_LINKS = [
  { href: '/hub', label: 'Sảnh tính năng' },
  { href: '/exams', label: 'Đề thi cộng đồng' },
  { href: '/my-exams', label: 'Đề thi của tôi' },
  { href: '/question-bank', label: 'Kho câu hỏi' },
  { href: '/grading', label: 'Chấm bài thi' },
  { href: '/exam-releases', label: 'Bộ mã đề' },
  { href: '/classes', label: 'Quản lý lớp học' },
  { href: '/about', label: 'Giới thiệu' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 px-(--gutter)">
        <div className="flex items-center justify-start gap-1">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="grid size-9 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink xl:hidden"
          >
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
          <BrandLink className="-ml-1" />
        </div>
        <MainNav className="hidden items-center gap-1 xl:flex" />
        <div className="col-start-3 flex justify-end">
          <AccountMenu />
        </div>
      </div>
      {mobileOpen ? (
        <nav
          aria-label="Điều hướng di động"
          className="border-t border-line bg-white px-(--gutter) py-3 xl:hidden"
        >
          <div className="grid gap-1 sm:grid-cols-2">
            {MOBILE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex h-10 items-center rounded-md px-3 text-[14.5px] font-medium text-ink-2 hover:bg-surface-3 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
