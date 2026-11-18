'use client';

/**
 * Receiving papers.
 *
 * A batch of photos becomes one paper, because a student's work is usually
 * several pages. The teacher can also add pages to an existing paper, re-run
 * grading, or delete a paper that was scanned by mistake.
 */
import { useRef, useState } from 'react';
import { ImagePlus, Loader2, RefreshCcw, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  STATUS_LABELS,
  formatMark,
  gradingApi,
  GradingApiError,
  pageUrl,
  type SessionDetail,
  type SubmissionSummary,
} from '@/lib/grading-client';
import { OmrInspector } from './omr-inspector';
import { describeOmr, readSheetFromFile } from '@/lib/grading/omr-browser';
import { shrinkForUpload } from '@/lib/image-client';

export function ReceiveTab({
  session,
  submissions,
  onRefresh,
}: {
  session: SessionDetail;
  submissions: SubmissionSummary[];
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const batchInput = useRef<HTMLInputElement>(null);
  const [inspect, setInspect] = useState<{ url: string; title: string } | null>(null);

  async function uploadBatch(files: FileList) {
    if (files.length === 0) return;
    setBusy('new');
    setError('');
    setWarnings([]);
    try {
      const created = await gradingApi.post<{ submission: SubmissionSummary }>(
        `/api/grading/sessions/${session.id}/submissions`,
        {},
      );
      const collected: string[] = [];

      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', await shrinkForUpload(file));
        const result = await gradingApi.postForm<{ warnings: string[] }>(
          `/api/grading/submissions/${created.submission.id}/pages`,
          form,
        );
        collected.push(...(result.warnings ?? []));
      }

      // Standard sheets are read on the device before anything is scored by AI.
      let omrNote = '';
      const firstFile = files[0];
      if (session.sheetTemplate && session.mode !== 'essay-only' && firstFile) {
        try {
          const result = await readSheetFromFile(firstFile, session.sheetTemplate);
          if (result.quality.anchorsFound && result.answers.length > 0) {
            await gradingApi.post(`/api/grading/submissions/${created.submission.id}/omr`, {
              answers: result.answers,
              qr: result.qr,
              sbd: result.sbd?.code ?? null,
              warnings: result.quality.warnings,
            });
          }
          omrNote = describeOmr(result);
        } catch {
          omrNote = 'Không đọc được phiếu trên thiết bị.';
        }
      }
      if (omrNote) collected.push(omrNote);

      await gradingApi.post(`/api/grading/submissions/${created.submission.id}/complete`);
      setWarnings(collected);
      onRefresh();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không tải được ảnh lên.');
    } finally {
      setBusy('');
      if (batchInput.current) batchInput.current.value = '';
    }
  }

  async function addPages(submissionId: string, files: FileList) {
    setBusy(submissionId);
    setError('');
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', await shrinkForUpload(file));
        await gradingApi.postForm(`/api/grading/submissions/${submissionId}/pages`, form);
      }
      await gradingApi.post(`/api/grading/submissions/${submissionId}/complete`);
      onRefresh();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không thêm được trang.');
    } finally {
      setBusy('');
    }
  }

  async function remove(submissionId: string) {
    setBusy(submissionId);
    try {
      await gradingApi.post(`/api/grading/submissions/${submissionId}/complete`).catch(() => undefined);
      await fetch(`/api/grading/submissions/${submissionId}`, { method: 'DELETE' });
      onRefresh();
    } finally {
      setBusy('');
    }
  }

  async function regrade(submissionId: string) {
    setBusy(submissionId);
    try {
      await gradingApi.post(`/api/grading/submissions/${submissionId}/complete`);
      await gradingApi.patch(`/api/grading/submissions/${submissionId}`, { regrade: 'mc' });
      await gradingApi.patch(`/api/grading/submissions/${submissionId}`, { regrade: 'essay' });
      onRefresh();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không chấm lại được.');
    } finally {
      setBusy('');
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={batchInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => event.target.files && void uploadBatch(event.target.files)}
        />
        <Button variant="blue" onClick={() => batchInput.current?.click()} disabled={busy === 'new'}>
          {busy === 'new' ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Tải ảnh bài mới
        </Button>
        <span className="text-[12.5px] text-ink-4">
          Chọn nhiều ảnh của cùng một học sinh để thành một bài nhiều trang.
        </span>
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-warn-line bg-warn-soft px-3 py-2 text-[13px] text-warn">
          {error}
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="mt-4 rounded-md border border-warn-line bg-warn-soft px-3 py-2 text-[13px] text-warn">
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}

      {submissions.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-line-strong bg-surface-2 px-6 py-12 text-center">
          <ImagePlus className="mx-auto size-8 text-ink-4" />
          <p className="mt-3 text-[14px] text-ink-2">Chưa nhận được bài nào.</p>
          <p className="mt-1 text-[13px] text-ink-4">
            Tải ảnh lên từ máy này, hoặc bấm “Quét bằng điện thoại” để chụp trực tiếp.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-md border border-line bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-medium text-ink">
                  {submission.studentName || submission.label || 'Bài chưa gán'}
                </span>
                {submission.studentCode ? (
                  <span className="text-[12px] text-ink-4">{submission.studentCode}</span>
                ) : null}
                <span className="rounded-sm bg-surface-3 px-1.5 py-0.5 text-[11.5px] text-ink-2">
                  {STATUS_LABELS[submission.status] ?? submission.status}
                </span>
                {submission.identityStatus === 'suggested' ? (
                  <span className="rounded-sm bg-warn-soft px-1.5 py-0.5 text-[11.5px] text-warn">
                    Tên do máy đọc, cần xác nhận
                  </span>
                ) : null}
                <span className="text-[12px] text-ink-4">{submission.pageCount} trang</span>
                {submission.totalScore !== null ? (
                  <span className="text-[12.5px] text-ink">
                    Tổng {formatMark(submission.totalScore)}
                  </span>
                ) : null}

                <div className="ml-auto flex items-center gap-1.5">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => event.target.files && void addPages(submission.id, event.target.files)}
                    />
                    <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-white px-2.5 text-[12.5px] text-ink hover:bg-surface-2">
                      <ImagePlus className="size-3.5" />
                      Thêm trang
                    </span>
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => void regrade(submission.id)} disabled={busy === submission.id}>
                    {busy === submission.id ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCcw className="size-3.5" />}
                    Chấm lại
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => void remove(submission.id)} aria-label="Xoá bài">
                    <Trash2 className="size-3.5 text-danger" />
                  </Button>
                </div>
              </div>

              {submission.pages.length > 0 ? (
                <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
                  {submission.pages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() =>
                        setInspect({
                          url: pageUrl(page.id),
                          title: `${submission.studentName || submission.label || 'Bài chưa gán'} · trang ${page.pageIndex + 1}`,
                        })
                      }
                      title="Xem máy đọc trang này"
                      className="group relative shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pageUrl(page.id)}
                        alt={`Trang ${page.pageIndex + 1}`}
                        className="h-24 w-auto rounded-sm border border-line object-cover group-hover:border-accent"
                      />
                      <span className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/45 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Xem máy đọc
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {inspect && session.sheetTemplate ? (
        <OmrInspector
          imageUrl={inspect.url}
          template={session.sheetTemplate}
          title={inspect.title}
          onClose={() => setInspect(null)}
        />
      ) : null}
    </div>
  );
}
