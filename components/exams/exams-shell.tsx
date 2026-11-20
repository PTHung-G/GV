'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';

export function ExamsShell({
  subtitle,
  children,
}: {
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, ready } = useAuth();

  if (ready && user) {
    return (
      <AppFrame>
        <ShellHeader title="Đề thi cộng đồng" subtitle={subtitle} />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </AppFrame>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </>
  );
}
