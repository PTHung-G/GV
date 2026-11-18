'use client';

/**
 * The workspace for one grading session.
 *
 * Papers arrive on the left (Nhận bài), get reviewed per section, and end up in
 * one score table. Progress is pushed over SSE so the desktop updates while a
 * phone is still scanning.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardCheck, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';
import { basePath } from '@/lib/api-url';
import {
  GradingApiError,
  gradingApi,
  type SessionDetail,
  type SubmissionSummary,
} from '@/lib/grading-client';
import { PairDialog } from './pair-dialog';
import { ReceiveTab } from './receive-tab';
import { McTab } from './mc-tab';
import { EssayTab } from './essay-tab';
import { ScoresTab } from './scores-tab';
import { SettingsTab } from './settings-tab';
import { StatsTab } from './stats-tab';

type Tab = 'receive' | 'mc' | 'essay' | 'scores' | 'stats' | 'settings';

type Progress = {
  submissions: number;
  needsReview: number;
  confirmed: number;
  processing: number;
  pages: number;
};

const EMPTY_PROGRESS: Progress = { submissions: 0, needsReview: 0, confirmed: 0, processing: 0, pages: 0 };

export function GradingWorkspace({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [tab, setTab] = useState<Tab>('receive');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pairOpen, setPairOpen] = useState(false);

  // Read the tab from the URL without useSearchParams, so the page needs no
  // Suspense boundary during prerender.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (requested && ['receive', 'mc', 'essay', 'scores', 'stats', 'settings'].includes(requested)) {
      setTab(requested as Tab);
    }
  }, []);

  const selectTab = useCallback((next: Tab) => {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', next);
    window.history.replaceState(null, '', url.toString());
  }, []);

  const load = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      try {
        const [detail, list] = await Promise.all([
          gradingApi.get<{ session: SessionDetail }>(`/api/grading/sessions/${sessionId}`),
          gradingApi.get<{ submissions: SubmissionSummary[]; progress: Progress }>(
            `/api/grading/sessions/${sessionId}/submissions`,
          ),
        ]);
        setSession(detail.session);
        setSubmissions(list.submissions);
        setProgress(list.progress);
        setError('');
      } catch (err) {
        setError(err instanceof GradingApiError ? err.message : 'Không tải được đợt chấm.');
      } finally {
        setLoading(false);
      }
    },
    [sessionId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  // Live progress while papers are still being scanned elsewhere.
  useEffect(() => {
    if (typeof EventSource === 'undefined') return;
    const source = new EventSource(basePath(`/api/grading/sessions/${sessionId}/events`));

    source.addEventListener('progress', (event) => {
      try {
        const next = JSON.parse((event as MessageEvent).data) as Progress;
        setProgress(next);
        // Any progress event can represent new review rows, failures or pages,
        // not only a changed submission/confirmation count.
        void load(true);
      } catch {
        /* ignore malformed frames */
      }
    });

    return () => source.close();
  }, [sessionId, load]);

  if (loading) {
    return (
      <AppFrame>
        <ShellHeader title="Đợt chấm" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-ink-4" />
        </div>
      </AppFrame>
    );
  }

  if (error || !session) {
    return (
      <AppFrame>
        <ShellHeader title="Đợt chấm" />
        <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-[13.5px] text-danger">{error || 'Không tìm thấy đợt chấm.'}</p>
          <Link href="/grading">
            <Button variant="outline" className="mt-4">
              Về danh sách đợt chấm
            </Button>
          </Link>
        </div>
      </AppFrame>
    );
  }

  const showMc = session.mode !== 'essay-only';
  const showEssay = session.mode !== 'mc-only';

  const tabs: Array<{ id: Tab; label: string; badge?: number }> = [
    { id: 'receive', label: 'Nhận bài' },
    ...(showMc ? [{ id: 'mc' as Tab, label: 'Trắc nghiệm' }] : []),
    ...(showEssay ? [{ id: 'essay' as Tab, label: 'Tự luận' }] : []),
    { id: 'scores', label: 'Bảng điểm' },
    { id: 'stats', label: 'Thống kê' },
    { id: 'settings', label: 'Đề & thang điểm' },
  ];

  const aside = (
    <div className="space-y-3 p-3">
      <section className="rounded-md border border-line bg-white p-3.5">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-ink-4 uppercase">Tiến độ</p>
        <dl className="mt-2 space-y-1.5">
          {[
            ['Bài đã nhận', progress.submissions],
            ['Đang chấm', progress.processing],
            ['Cần duyệt', progress.needsReview],
            ['Đã duyệt', progress.confirmed],
            ['Trang đã quét', progress.pages],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-baseline justify-between gap-3">
              <dt className="text-[12px] text-ink-3">{label}</dt>
              <dd className="text-[13px] font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-md border border-line bg-white p-3.5">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-ink-4 uppercase">Đợt chấm</p>
        <dl className="mt-2 space-y-1.5">
          {[
            ['Hình thức', session.mode === 'mixed' ? 'TN + Tự luận' : session.mode === 'mc-only' ? 'Trắc nghiệm' : 'Tự luận'],
            ['Thang điểm', `${session.totalPoints} điểm`],
            ['Lớp', session.className || 'Chưa gán'],
            ['Sĩ số', session.studentCount > 0 ? `${session.studentCount} học sinh` : 'Chưa có'],
            ['Trạng thái', session.status === 'finalized' ? 'Đã chốt' : 'Đang làm'],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-baseline justify-between gap-3">
              <dt className="text-[12px] text-ink-3">{label}</dt>
              <dd className="min-w-0 truncate text-right text-[12.5px] font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={() => setPairOpen(true)}
          className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-accent text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <Smartphone className="size-3.5" />
          Quét bằng điện thoại
        </button>
      </section>
    </div>
  );

  return (
    <AppFrame
      aside={aside}
      asideTitle="Tổng quan đợt chấm"
      asideIcon={<ClipboardCheck className="size-4" />}
    >
      <ShellHeader
        title={session.title}
        subtitle={`${progress.submissions} bài · ${progress.needsReview} cần duyệt${
          session.className ? ` · Lớp ${session.className}` : ''
        }`}
        actions={
          <Button variant="ghost" size="icon" onClick={() => void load()} aria-label="Tải lại">
            <RefreshCw className="size-4" />
          </Button>
        }
      />

      <nav
        className="scrollbar-none flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-surface-3 bg-white px-2.5"
        aria-label="Các phần của đợt chấm"
      >
        {tabs.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => selectTab(entry.id)}
            aria-current={tab === entry.id ? 'page' : undefined}
            className={`flex h-7 shrink-0 items-center rounded-md px-2.5 text-[12.5px] whitespace-nowrap transition-colors ${
              tab === entry.id
                ? 'bg-surface-3 font-semibold text-ink'
                : 'font-medium text-ink-2 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            {entry.label}
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {tab === 'receive' ? (
          <ReceiveTab session={session} submissions={submissions} onRefresh={() => void load(true)} />
        ) : null}
        {tab === 'mc' && showMc ? (
          <McTab session={session} submissions={submissions} onRefresh={() => void load(true)} />
        ) : null}
        {tab === 'essay' && showEssay ? (
          <EssayTab session={session} submissions={submissions} onRefresh={() => void load(true)} />
        ) : null}
        {tab === 'scores' ? (
          <ScoresTab session={session} submissions={submissions} onRefresh={() => void load(true)} />
        ) : null}
        {tab === 'stats' ? <StatsTab session={session} /> : null}
        {tab === 'settings' ? <SettingsTab session={session} /> : null}
      </div>

      <PairDialog sessionId={sessionId} open={pairOpen} onClose={() => setPairOpen(false)} />
    </AppFrame>
  );
}