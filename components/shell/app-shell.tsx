'use client';

/**
 * Three-pane application shell.
 *
 *   [ rail ]  [        centre        ]  [ aside ]
 *
 * The rail carries navigation, the centre carries the work, the aside carries
 * what the current screen needs beside it (properties, assistant, reading
 * help). Both side panes collapse and the choice is remembered per browser.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ShellState = {
  leftOpen: boolean;
  rightOpen: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  openLeft: () => void;
  closeLeft: () => void;
  hasAside: boolean;
};

const ShellContext = createContext<ShellState | null>(null);

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used inside <AppShell>');
  return ctx;
}

/** True from `lg` up, where the panes are columns rather than drawers. */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return wide;
}

function useStoredFlag(key: string, fallback: boolean) {
  const [value, setValue] = useState(fallback);

  // Read after mount: the server has no storage, and rendering the stored value
  // on the first client pass would not match the markup it sent.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === '1' || stored === '0') setValue(stored === '1');
    } catch {
      /* storage blocked */
    }
  }, [key]);

  const update = useCallback(
    (next: boolean) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, next ? '1' : '0');
      } catch {
        /* storage blocked */
      }
    },
    [key],
  );

  return [value, update] as const;
}

export function AppShell({
  rail,
  children,
  aside,
  asideTitle,
  asideIcon,
}: {
  rail: React.ReactNode;
  children: React.ReactNode;
  /** Right-hand pane. Omit on screens that do not need one. */
  aside?: React.ReactNode;
  asideTitle?: string;
  asideIcon?: React.ReactNode;
}) {
  const [leftOpen, setLeftOpen] = useStoredFlag('sdt.shell.left', true);
  const [rightOpen, setRightOpen] = useStoredFlag('sdt.shell.right', true);
  const hasAside = Boolean(aside);
  const wide = useWide();

  // Below `lg` the rail is a drawer instead of a column, so it starts closed and
  // is dismissed by the scrim, Escape, or the close button.
  const [drawerOpen, setDrawerOpen] = useState(false);
  // A collapsed pane keeps its zero-width box for the transition, but nothing
  // inside it should exist: clipped links would still be reachable by Tab.
  const railVisible = wide ? leftOpen : drawerOpen;

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const state = useMemo<ShellState>(
    () => ({
      leftOpen,
      rightOpen,
      toggleLeft: () => setLeftOpen(!leftOpen),
      toggleRight: () => setRightOpen(!rightOpen),
      openLeft: () => setDrawerOpen(true),
      closeLeft: () => setDrawerOpen(false),
      hasAside,
    }),
    [leftOpen, rightOpen, hasAside, setLeftOpen, setRightOpen],
  );

  return (
    <ShellContext.Provider value={state}>
      <div className="flex h-dvh overflow-hidden bg-[var(--shell-canvas)] text-ink">
        {/* Decorative: the labelled control is the close button, and Escape works
            too. A second button here would duplicate that label and sit under the
            drawer itself. */}
        {drawerOpen ? (
          <div
            aria-hidden
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[1px] lg:hidden"
          />
        ) : null}

        <div
          data-shell-rail
          data-open={leftOpen ? '1' : '0'}
          className={cn(
            'shrink-0 overflow-hidden bg-[var(--shell-panel)] transition-[width] duration-200 ease-out',
            'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-[280px] max-lg:border-r max-lg:border-line max-lg:shadow-[var(--shadow-lg)]',
            drawerOpen ? 'max-lg:translate-x-0' : 'max-lg:pointer-events-none max-lg:-translate-x-full',
            leftOpen ? 'lg:w-[264px] lg:border-r lg:border-line' : 'lg:w-0',
          )}
        >
          {/* Fixed inner width: animating the outer width only slides, it never
              rewraps the contents. */}
          <div className="h-full w-[280px] lg:w-[264px]">{railVisible ? rail : null}</div>
        </div>

        {drawerOpen ? (
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Đóng thanh bên"
            className="fixed top-3 right-3 z-50 grid size-9 place-items-center rounded-full bg-white text-ink shadow-[var(--shadow-md)] lg:hidden"
          >
            <X className="size-4" />
          </button>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex min-w-0 flex-1 flex-col bg-white">{children}</main>
        </div>

        {hasAside ? (
          <aside
            data-shell-aside
            data-open={rightOpen ? '1' : '0'}
            className={cn(
              'hidden shrink-0 overflow-hidden bg-[var(--shell-panel)] transition-[width] duration-200 ease-out lg:flex',
              rightOpen ? 'w-[400px] border-l border-line xl:w-[440px]' : 'w-0',
            )}
            aria-hidden={!rightOpen}
            aria-label={asideTitle}
          >
            <div className="flex h-full w-[400px] flex-col xl:w-[440px]">
              {rightOpen ? (
                <>
              <div className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3">
                <button
                  type="button"
                  onClick={() => setRightOpen(false)}
                  aria-label="Thu gọn bảng bên phải"
                  title="Thu gọn bảng bên phải"
                  className="grid size-8 shrink-0 place-items-center rounded-md text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink"
                >
                  <ChevronsRight className="size-[18px]" />
                </button>
                <span className="shrink-0 text-ink-3">{asideIcon}</span>
                <p className="flex-1 truncate text-[13.5px] font-semibold tracking-tight text-ink">
                  {asideTitle}
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{aside}</div>
                </>
              ) : null}
            </div>
          </aside>
        ) : null}

        {hasAside && !rightOpen ? (
          <div className="hidden w-11 shrink-0 flex-col items-center border-l border-line bg-[var(--shell-panel)] py-2 lg:flex">
            <button
              type="button"
              onClick={() => setRightOpen(true)}
              aria-label="Mở bảng bên phải"
              className="grid size-8 place-items-center rounded-md text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink"
            >
              <ChevronsLeft className="size-[18px]" />
            </button>
          </div>
        ) : null}
      </div>
    </ShellContext.Provider>
  );
}

/** Header row for the centre pane: pane toggles, title, and screen actions. */
export function ShellHeader({
  title,
  subtitle,
  actions,
  leading,
  icon,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  leading?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const { leftOpen, toggleLeft, openLeft } = useShell();

  // Which toggle a click should drive depends on the viewport: on a phone the
  // rail is a drawer, on a desktop it is a column.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-surface-3 bg-white px-2.5 sm:px-3.5">
      {/* One control per boundary: while the rail is open its own chevron closes
          it, so this one only appears when there is nothing else to click. */}
      {!wide || !leftOpen ? (
        <button
          type="button"
          onClick={() => (wide ? toggleLeft() : openLeft())}
          aria-label="Mở thanh bên"
          title="Mở thanh bên"
          className="grid size-8 shrink-0 place-items-center rounded-md text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink"
        >
          <ChevronsRight className="size-[18px]" />
        </button>
      ) : null}
      {leading}
      {icon ? <span className="shrink-0 text-ink-3">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold tracking-tight text-ink">{title}</p>
        {subtitle ? <p className="truncate text-[12px] leading-tight text-ink-3">{subtitle}</p> : null}
      </div>
      {actions}
    </header>
  );
}
