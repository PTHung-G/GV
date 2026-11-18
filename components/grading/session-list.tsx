'use client';

/**
 * The grading dashboard: one card per grading session.
 *
 * This is the screen a teacher lands on after tapping "Chấm bài thi", so it
 * leads with the next useful action rather than with configuration.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ClipboardCheck, Loader2, Plus, RefreshCw, Smartphone } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  GradingApiError,
  gradingApi,
  type SessionSummary,
} from '@/lib/grading-client';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="mt-3">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-ok transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11.5px] text-ink-3">
        {done}/{total} bài đã xong
      </p>
    </div>
  );
}

function SessionRow({
  session,
  selected,
  onSelect,
}: {
  session: SessionSummary;
  selected: boolean;
  onSelect: () => void;
}) {
  const graded = session.confirmedCount;
  const total = Math.max(session.studentCount, session.submissionCount);
  const percent = total > 0 ? Math.round((graded / total) * 100) : 0;

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 transition-colors',
        selected ? 'bg-accent-soft' : 'hover:bg-surface-2',
      )}
    >
      {/* The row navigates; the small button only previews it in the aside. */}
      <Link
        href={`/grading/${session.id}`}
        aria-label={`Mở đợt chấm ${session.title}`}
        className="absolute inset-0"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="min-w-0 truncate text-[13.5px] leading-snug font-semibold text-ink">
            {session.title}
          </h3>
          {session.status === 'finalized' ? (
            <Badge>Đã chốt</Badge>
          ) : null}
          {session.needsReviewCount > 0 ? (
            <span className="shrink-0 text-[11px] font-medium text-warn">
              {session.needsReviewCount} cần duyệt
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-ink-4">
          {session.submissionCount} bài đã nhận ·{' '}
          {session.mode === 'mixed' ? 'TN + tự luận' : session.mode === 'mc-only' ? 'Trắc nghiệm' : 'Tự luận'} ·{' '}
          {session.totalPoints} điểm
        </p>
      </div>

      {/* Progress reads as a number first; the bar is only a hint. */}
      <div className="hidden w-24 shrink-0 items-center gap-2 sm:flex">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
          <div className="h-full rounded-full bg-ok" style={{ width: `${percent}%` }} />
        </div>
        <span className="w-8 text-right text-[11px] tabular-nums text-ink-3">{percent}%</span>
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Xem nhanh ${session.title}`}
        className="relative z-10 hidden h-7 shrink-0 items-center rounded-md border border-line-strong bg-white px-2 text-[11.5px] font-medium text-ink hover:bg-surface-2 sm:inline-flex"
      >
        {selected ? 'Đang xem' : 'Xem nhanh'}
      </button>
    </div>
  );
}

export function GradingSessionList() {
  const { user, ready, openDialog } = useAuth();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await gradingApi.get<{ sessions: SessionSummary[] }>('/api/grading/sessions');
      setSessions(data.sessions);
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không tải được danh sách.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [ready, user, load]);

  const selected = sessions.find((s) => s.id === selectedId) ?? null;
  const pending = useMemo(
    () => sessions.reduce((sum, s) => sum + s.needsReviewCount, 0),
    [sessions],
  );

  if (!ready) {
    return (
      <AppFrame>
        <ShellHeader title="Chấm bài" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-ink-4" />
        </div>
      </AppFrame>
    );
  }

  if (!user) {
    return (
      <AppFrame>
        <ShellHeader title="Chấm bài" subtitle="Chưa đăng nhập" />
        <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <ClipboardCheck className="size-9 text-ink-4" />
          <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-ink">Chấm bài thi</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
            Đăng nhập để tạo đợt chấm, nhận bài từ điện thoại và duyệt điểm cho cả lớp.
          </p>
          <Button className="mt-6" size="lg" onClick={() => openDialog('Đăng nhập để bắt đầu chấm bài.')}>
            Đăng nhập
          </Button>
        </div>
      </AppFrame>
    );
  }

  const aside = (
    <div className="space-y-3 p-3">
      {selected ? (
        <section className="rounded-md border border-line bg-white p-3.5">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-ink-4 uppercase">Đợt chấm</p>
          <p className="mt-1.5 text-[13.5px] leading-snug font-semibold text-ink">{selected.title}</p>
          <dl className="mt-3 space-y-1.5">
            {[
              ['Đã nhận', `${selected.submissionCount} bài`],
              ['Cần duyệt', `${selected.needsReviewCount} bài`],
              ['Đã duyệt', `${selected.confirmedCount} bài`],
              ['Thang điểm', `${selected.totalPoints} điểm`],
              ['Trạng thái', selected.status === 'finalized' ? 'Đã chốt' : 'Đang làm'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-3">
                <dt className="text-[12px] text-ink-3">{label}</dt>
                <dd className="text-[12.5px] font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/grading/${selected.id}`}
            className="mt-3.5 flex h-8 items-center justify-center rounded-md bg-accent text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Mở bàn làm việc
          </Link>
        </section>
      ) : (
        <section className="rounded-md border border-dashed border-line-strong bg-white p-4 text-center">
          <ClipboardCheck className="mx-auto size-5 text-ink-4" aria-hidden />
          <p className="mt-2 text-[13px] font-medium text-ink">Chưa chọn đợt nào</p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-3">
            Bấm vào một đợt để xem nhanh tiến độ trước khi mở bàn làm việc.
          </p>
        </section>
      )}

      <section className="rounded-md border border-line bg-white p-3.5">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-ink-4 uppercase">Cần xử lý</p>
        <p className="mt-1.5 text-[20px] leading-none font-semibold text-ink">{pending}</p>
        <p className="mt-1 text-[12px] text-ink-3">bài chờ duyệt trên tất cả các đợt</p>
      </section>

      <section className="rounded-md border border-line bg-white p-3.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-ink-4 uppercase">
          <Smartphone className="size-3.5" aria-hidden /> Quét bằng điện thoại
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
          Mở một đợt chấm rồi chọn “Quét bằng điện thoại” để ghép máy — không cần cài ứng dụng.
        </p>
      </section>
    </div>
  );

  return (
    <AppFrame aside={aside} asideTitle="Chi tiết đợt chấm" asideIcon={<ClipboardCheck className="size-4" />}>
      <ShellHeader title="Chấm bài" subtitle={`${sessions.length} đợt chấm`} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-ink">
                Chấm bài thi
              </h1>
              <p className="mt-1.5 text-[13px] text-ink-3">
                Mỗi đợt chấm là một đề, một lớp và một thang điểm đã chốt.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => void load()} aria-label="Tải lại">
                <RefreshCw className="size-4" />
              </Button>
              <Link href="/grading/new">
                <Button variant="blue">
                  <Plus className="size-4" />
                  Đợt chấm mới
                </Button>
              </Link>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-md border border-warn-line bg-warn-soft px-3 py-2 text-[12.5px] text-warn">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-16 flex justify-center">
              <Loader2 className="size-5 animate-spin text-ink-4" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-line-strong bg-surface-2 px-6 py-12 text-center">
              <ClipboardCheck className="mx-auto size-8 text-ink-4" />
              <h2 className="mt-3 text-[15px] font-semibold text-ink">Chưa có đợt chấm nào</h2>
              <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed text-ink-3">
                Tạo đợt chấm để chọn đề, xác nhận thang điểm rồi nhận bài từ điện thoại.
              </p>
              <ol className="mx-auto mt-5 max-w-sm space-y-1.5 text-left text-[12.5px] text-ink-2">
                <li>1. Chọn đề đã có bảng đáp án</li>
                <li>2. Xác nhận thang điểm từng câu</li>
                <li>3. Chụp bài làm bằng điện thoại</li>
                <li>4. Duyệt bài máy chưa chắc, rồi xuất điểm</li>
              </ol>
              <Link href="/grading/new">
                <Button variant="blue" className="mt-6">
                  <Plus className="size-4" />
                  Tạo đợt chấm đầu tiên
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-line overflow-hidden rounded-md border border-line bg-white">
              {sessions.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  selected={session.id === selectedId}
                  onSelect={() => setSelectedId(session.id === selectedId ? null : session.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
