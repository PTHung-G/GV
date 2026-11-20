'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileStack, Loader2, Users } from 'lucide-react';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { basePath } from '@/lib/api-url';

type ReleaseItem = {
  id: string;
  title: string;
  sourceExamId: string;
  classId: string | null;
  className: string | null;
  createdAt: string;
  variantCount: number;
};

export default function ExamReleasesPage() {
  const { user, ready, openDialog } = useAuth();
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    fetch(basePath('/api/exam-releases'), { cache: 'no-store' })
      .then(async (r) => {
        const d = (await r.json()) as { releases?: ReleaseItem[]; error?: string };
        if (!r.ok) throw new Error(d.error || 'Không tải được danh sách bộ mã đề.');
        if (active) setReleases(d.releases ?? []);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không kết nối được máy chủ.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <AppFrame>
      <div className="flex h-full flex-col overflow-hidden bg-surface-2">
        <ShellHeader
          title="Bộ mã đề & chấm lớp"
          subtitle="Quản lý các bộ đề đã trộn mã, phiếu in và bảng điểm hợp nhất theo lớp"
          icon={<FileStack className="size-4" />}
          actions={
            <Link
              href="/my-exams"
              className="inline-flex h-8 items-center rounded-md border border-line bg-white px-3 text-xs font-medium text-ink hover:bg-surface-2"
            >
              Chốt bộ mới từ Đề thi
            </Link>
          }
        />
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {!ready ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-5 animate-spin text-ink-4" />
            </div>
          ) : !user ? (
            <section className="mx-auto max-w-md rounded-lg border border-line bg-white p-8 text-center">
              <h1 className="text-lg font-semibold text-ink">Bộ mã đề & bảng điểm lớp</h1>
              <p className="mt-2 text-sm text-ink-3">
                Đăng nhập để xem các bộ mã đề đã chốt và xuất bảng điểm hợp nhất cho từng lớp.
              </p>
              <Button variant="blue" className="mt-4" onClick={() => openDialog('Đăng nhập để mở bộ mã đề')}>
                Đăng nhập
              </Button>
            </section>
          ) : (
            <div className="mx-auto max-w-5xl space-y-4">
              {error ? (
                <p role="alert" className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              ) : null}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-ink-4" />
                </div>
              ) : !releases.length ? (
                <div className="rounded-lg border border-dashed border-line-strong bg-white p-10 text-center text-sm text-ink-3">
                  Chưa có bộ mã đề nào được chốt. Mở một đề trong{' '}
                  <Link href="/my-exams" className="font-medium text-accent underline">
                    Đề thi của tôi
                  </Link>{' '}
                  và chọn “Chốt đề & xuất PDF”.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {releases.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/exam-releases/${rel.id}`}
                      className="block rounded-lg border border-line bg-white p-4 transition-colors hover:border-accent"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-semibold text-ink">{rel.title}</h2>
                        <span className="shrink-0 rounded-sm bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                          {rel.variantCount} mã đề
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-3">
                        <span>{new Date(rel.createdAt).toLocaleString('vi-VN')}</span>
                        {rel.className ? (
                          <span className="inline-flex items-center gap-1 rounded-sm bg-surface-2 px-1.5 py-0.5 text-ink-2">
                            <Users className="size-3" />
                            Lớp {rel.className}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
