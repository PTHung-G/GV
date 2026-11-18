'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, LayoutGrid, LogOut, Menu, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDocs } from '@/lib/docs-store';
import { cn } from '@/lib/utils';
import { basePath } from '@/lib/api-url';
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
  return (
    <span className={className}>
      soandethi<span className="text-ink-4">.com</span>
    </span>
  );
}

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="soandethi.com - về trang chủ"
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
      <div className="flex items-center gap-2">
        <Menu className="size-4 text-ink-4 xl:hidden" aria-hidden />
        <button
          type="button"
          onClick={() => openDialog()}
          aria-label="Đăng nhập"
          className="flex h-9 items-center gap-1.5 rounded-md bg-accent px-4 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <UserRound className="size-4" aria-hidden />
          Đăng nhập
        </button>
      </div>
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
            <span className="block max-w-[130px] truncate text-[13px] font-medium text-ink">{user.name}</span>
            <span className="block text-[11px] text-ink-3">
              {new Intl.NumberFormat('vi-VN').format(user.points)} điểm
            </span>
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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 px-(--gutter)">
        <div className="flex justify-start">
          <BrandLink className="-ml-1.5" />
        </div>
        <MainNav className="hidden items-center gap-1 xl:flex" />
        <div className="col-start-3 flex justify-end">
          <AccountMenu />
        </div>
      </div>
      <div className="border-t border-line xl:hidden">
        <MainNav className="scrollbar-none mx-auto flex h-11 max-w-(--page-max) items-center gap-1 overflow-x-auto px-(--gutter)" />
      </div>
    </header>
  );
}
