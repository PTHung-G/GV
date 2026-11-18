'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

/**
 * The two ways in: the hall for someone who teaches, the library for someone
 * who just wants to look at an exam first. No price line, no free-points pitch.
 */
export function StartActions() {
  const { user, openDialog } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          if (user) {
            router.push('/hub');
            return;
          }
          openDialog('Đăng nhập để vào sảnh tính năng');
        }}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-accent px-4 text-[13.5px] font-medium text-white transition-colors outline-none hover:bg-accent-hover focus-visible:ring-[3px] focus-visible:ring-accent/40 [&_svg]:size-4"
      >
        {user ? 'Vào sảnh tính năng' : 'Đăng nhập và bắt đầu'}
        <ArrowRight aria-hidden />
      </button>
      <Link
        href="/exams"
        className="inline-flex h-9 shrink-0 items-center rounded-md border border-line-strong bg-surface px-4 text-[13.5px] font-medium text-ink transition-colors hover:bg-surface-2"
      >
        Xem một đề mẫu
      </Link>
    </div>
  );
}
