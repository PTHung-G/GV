'use client';

/**
 * Page frame for every signed-in screen: the navigation rail plus the three-pane
 * shell, so each route only describes its own centre and aside content.
 */
import { AppShell } from './app-shell';
import { Sidebar } from './sidebar';

export function AppFrame({
  children,
  aside,
  asideTitle,
  asideIcon,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  asideTitle?: string;
  asideIcon?: React.ReactNode;
}) {
  return (
    <AppShell rail={<Sidebar />} aside={aside} asideTitle={asideTitle} asideIcon={asideIcon}>
      {children}
    </AppShell>
  );
}
