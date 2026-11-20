'use client';

/**
 * The score table and the end of the workflow.
 *
 * It always distinguishes a provisional mark from a confirmed one, and the CSV
 * export mirrors what is on screen so the file cannot contradict the app.
 */
import { useEffect, useState } from 'react';
import { Check, Download, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toCsv } from '@/lib/grading/scores';
import {
  formatMark,
  gradingApi,
  GradingApiError,
  STATUS_LABELS,
  type SessionDetail,
  type SubmissionSummary,
} from '@/lib/grading-client';

export function ScoresTab({
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
  const [notice, setNotice] = useState('');
  const [canForce, setCanForce] = useState(false);
  const [reasonModal, setReasonModal] = useState<{ mode: 'force' | 'reopen'; reason: string } | null>(null);
  const [roster, setRoster] = useState<Array<{ id: string; code: string | null; name: string }>>([]);

  useEffect(() => {
    if (!session.classId) {
      setRoster([]);
      return;
    }
    let active = true;
    gradingApi
      .get<{ students: Array<{ id: string; code: string | null; name: string }> }>(
        `/api/classes?classId=${encodeURIComponent(session.classId)}`,
      )
      .then((d) => {
        if (active) setRoster(d.students ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [session.classId]);

  async function assignStudent(submissionId: string, identity: { studentId?: string | null; studentName?: string | null; studentCode?: string | null }) {
    setBusy(submissionId);
    setError('');
    try {
      await gradingApi.patch(`/api/grading/submissions/${submissionId}`, { identity });
      onRefresh();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không cập nhật được tên học sinh.');
    } finally {
      setBusy('');
    }
  }

  const showMc = session.mode !== 'essay-only';
  const showEssay = session.mode !== 'mc-only';

  function exportCsv() {
    const csv = toCsv(
      submissions.map((submission) => ({
        code: submission.studentCode,
        name: submission.studentName || submission.label || 'Chưa gán tên',
        mc: submission.mcScore,
        essay: submission.essayScore,
        total: submission.totalScore,
        status: STATUS_LABELS[submission.status] ?? submission.status,
        note:
          submission.identityStatus === 'verified'
            ? null
            : submission.identityStatus === 'suggested'
              ? 'Tên do máy đọc, chưa xác nhận'
              : 'Chưa gán tên',
      })),
      { includeSections: showMc && showEssay },
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bang-diem-${session.title.replace(/[^\p{L}\p{N}]+/gu, '-').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function finalize(force: boolean, reason?: string) {
    if (force && !reason?.trim()) {
      setReasonModal({ mode: 'force', reason: '' });
      return;
    }
    setCanForce(false);
    setBusy('finalize');
    setError('');
    setNotice('');
    try {
      await gradingApi.post(`/api/grading/sessions/${session.id}/finalize`, { force, reason: reason?.trim() });
      setNotice('Đã chốt đợt chấm.');
      onRefresh();
    } catch (err) {
      if (err instanceof GradingApiError && err.code === 'outstanding_submissions') {
        setCanForce(true);
        setError(err.message);
      } else {
        setError(err instanceof GradingApiError ? err.message : 'Không chốt được đợt chấm.');
      }
    } finally {
      setBusy('');
    }
  }

  async function confirmOne(submissionId: string) {
    setBusy(submissionId);
    try {
      await gradingApi.patch(`/api/grading/submissions/${submissionId}`, { confirm: true });
      onRefresh();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không xác nhận được bài.');
    } finally {
      setBusy('');
    }
  }

  const finalised = session.status !== 'active';

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={exportCsv} disabled={submissions.length === 0}>
          <Download className="size-4" />
          Xuất CSV
        </Button>
        {finalised ? (
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-ok-soft px-2 py-1 text-[12.5px] text-ok">
            <Lock className="size-3.5" />
            Đã chốt
          </span>
        ) : (
          <Button variant="blue" onClick={() => void finalize(false)} disabled={busy === 'finalize'}>
            {busy === 'finalize' ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Chốt đợt chấm
          </Button>
        )}
        {session.status === 'finalized' ? (
          <Button variant="outline" disabled={!!busy} onClick={() => setReasonModal({ mode: 'reopen', reason: '' })}>
            Mở lại có ghi lịch sử
          </Button>
        ) : null}
      </div>

      {error ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-warn-line bg-warn-soft px-3 py-2 text-[13px] text-warn">
          <span>{error}</span>
          {canForce ? <button
            type="button"
            onClick={() => void finalize(true)}
            className="underline underline-offset-2 hover:text-warn"
          >
            Chốt với ngoại lệ
          </button> : null}
        </div>
      ) : null}

      {notice ? (
        <div className="mt-3 rounded-md border border-ok-soft bg-ok-soft px-3 py-2 text-[13px] text-ok">
          {notice}
        </div>
      ) : null}

      {submissions.length === 0 ? (
        <p className="py-12 text-center text-[13.5px] text-ink-4">Chưa có bài nào.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-md border border-line">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-surface-2 text-ink-2">
                <th className="border-b border-line px-3 py-2 text-left font-medium">Học sinh</th>
                {showMc ? <th className="border-b border-line px-3 py-2 text-right font-medium">Trắc nghiệm</th> : null}
                {showEssay ? <th className="border-b border-line px-3 py-2 text-right font-medium">Tự luận</th> : null}
                <th className="border-b border-line px-3 py-2 text-right font-medium">Tổng</th>
                <th className="border-b border-line px-3 py-2 text-left font-medium">Trạng thái</th>
                <th className="border-b border-line px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => {
                const provisional = submission.status !== 'confirmed';
                return (
                  <tr key={submission.id} className="hover:bg-surface-2">
                    <td className="border-b border-surface-3 px-3 py-1.5">
                      <span className="text-ink">{submission.studentName || submission.label}</span>
                      {submission.studentCode ? (
                        <span className="ml-1.5 text-[11.5px] text-ink-4">{submission.studentCode}</span>
                      ) : null}
                      {submission.identityStatus === 'suggested' ? (
                        <span className="ml-1.5 text-[11px] text-warn">
                          (tên chưa xác nhận)
                          {submission.studentName ? (
                            <button
                              type="button"
                              onClick={() =>
                                void assignStudent(submission.id, {
                                  studentName: submission.studentName,
                                  studentCode: submission.studentCode,
                                })
                              }
                              className="ml-1 underline"
                            >
                              Xác nhận
                            </button>
                          ) : null}
                        </span>
                      ) : null}
                      {roster.length > 0 && submission.identityStatus !== 'verified' ? (
                        <select
                          aria-label={`Gán tên cho ${submission.label}`}
                          value={submission.studentId ?? ''}
                          disabled={busy === submission.id}
                          onChange={(e) => {
                            const studentId = e.target.value;
                            if (studentId) void assignStudent(submission.id, { studentId });
                          }}
                          className="ml-2 h-6 rounded-sm border border-line bg-white px-1 text-[11px] text-ink"
                        >
                          <option value="">Chọn học sinh…</option>
                          {roster.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.code ? `${st.code} · ` : ''}{st.name}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </td>
                    {showMc ? (
                      <td className="border-b border-surface-3 px-3 py-1.5 text-right">{formatMark(submission.mcScore)}</td>
                    ) : null}
                    {showEssay ? (
                      <td className="border-b border-surface-3 px-3 py-1.5 text-right">{formatMark(submission.essayScore)}</td>
                    ) : null}
                    <td className="border-b border-surface-3 px-3 py-1.5 text-right font-medium">
                      {formatMark(submission.totalScore)}
                      {provisional && submission.totalScore !== null ? (
                        <span className="ml-1 text-[11px] font-normal text-warn">dự kiến</span>
                      ) : null}
                    </td>
                    <td className="border-b border-surface-3 px-3 py-1.5">
                      <span
                        className={
                          submission.status === 'confirmed'
                            ? 'text-ok'
                            : submission.status === 'needs-review'
                              ? 'text-warn'
                              : 'text-ink-3'
                        }
                      >
                        {STATUS_LABELS[submission.status] ?? submission.status}
                      </span>
                    </td>
                    <td className="border-b border-surface-3 px-3 py-1.5 text-right">
                      {submission.status !== 'confirmed' && submission.totalScore !== null ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void confirmOne(submission.id)}
                          disabled={busy === submission.id}
                        >
                          {busy === submission.id ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                          Duyệt
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-2 text-[12px] text-ink-4">
        Điểm “dự kiến” chưa được giáo viên duyệt. File CSV xuất đúng những gì đang hiển thị ở đây.
      </p>

      {reasonModal ? (
        <Dialog
          open
          onClose={() => setReasonModal(null)}
          labelledBy="scores-reason-title"
          className="max-w-md p-5"
        >
          <h2 id="scores-reason-title" className="text-base font-semibold text-ink">
            {reasonModal.mode === 'force'
              ? 'Lý do chốt với ngoại lệ'
              : 'Lý do mở lại đợt chấm'}
          </h2>
          <p className="mt-1 text-xs text-ink-3">
            Nội dung này sẽ được lưu vĩnh viễn vào lịch sử kiểm toán của đợt chấm.
          </p>
          <Input
            autoFocus
            value={reasonModal.reason}
            onChange={(e) => setReasonModal({ ...reasonModal, reason: e.target.value })}
            placeholder="Nhập lý do…"
            className="mt-3"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setReasonModal(null)}>
              Huỷ
            </Button>
            <Button
              variant="blue"
              size="sm"
              disabled={!reasonModal.reason.trim() || !!busy}
              onClick={() => {
                const current = reasonModal;
                setReasonModal(null);
                if (current.mode === 'force') {
                  void finalize(true, current.reason);
                } else {
                  setBusy('reopen');
                  void gradingApi
                    .post(`/api/grading/sessions/${session.id}/reopen`, { reason: current.reason.trim() })
                    .then(() => onRefresh())
                    .catch((err) => setError(err instanceof Error ? err.message : 'Không mở lại được đợt chấm.'))
                    .finally(() => setBusy(''));
                }
              }}
            >
              Xác nhận
            </Button>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}
