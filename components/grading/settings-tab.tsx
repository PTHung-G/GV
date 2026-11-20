'use client';

/**
 * Read-only view of what this session is grading against.
 *
 * The rubric here is the frozen snapshot taken when the session was created,
 * which is why later edits to the exam do not change historic marks.
 */
import Link from 'next/link';
import { subjectLabel } from '@/lib/site';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Printer, Trash2 } from 'lucide-react';
import { gradingApi, GradingApiError } from '@/lib/grading-client';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { basePath } from '@/lib/api-url';
import { formatMark, type SessionDetail } from '@/lib/grading-client';
import { formatTfStatements } from '@/lib/grading/rubric';

export function SettingsTab({ session }: { session: SessionDetail }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState('');

  async function remove() {
    setDeleting(true);
    setError('');
    try {
      await gradingApi.remove(`/api/grading/sessions/${session.id}`);
      router.push('/grading');
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không xoá được đợt chấm.');
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-md border border-line bg-white p-4">
        <h3 className="text-[14px] font-medium text-ink">Thông tin đợt chấm</h3>
        <dl className="mt-3 space-y-1.5 text-[13px]">
          {[
            ['Đề', session.title],
            ['Môn', session.subject ? subjectLabel(session.subject) : '—'],
            ['Lớp', session.className ?? '—'],
            ['Hình thức', session.sheetMode === 'template' ? 'Phiếu chuẩn (in trước khi thi)' : 'Giấy thường'],
            ['Cách chấm', session.mode === 'mixed' ? 'Trắc nghiệm + Tự luận' : session.mode === 'mc-only' ? 'Chỉ trắc nghiệm' : 'Chỉ tự luận'],
            ['Tổng điểm', formatMark(session.totalPoints)],
            ...(session.mode !== 'essay-only' ? [['Trắc nghiệm', `${formatMark(session.mcPoints)} điểm`]] : []),
            ...(session.mode !== 'mc-only' ? [['Tự luận', `${formatMark(session.essayPoints)} điểm`]] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt className="text-ink-3">{label}</dt>
              <dd className="text-right text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 border-t border-surface-3 pt-3 text-[12px] leading-relaxed text-ink-4">
          Thang điểm đã được đóng băng khi tạo đợt. Sửa đề gốc về sau không làm thay đổi điểm đã chấm.
        </p>

        <p className="mt-2 text-xs text-ink-3">Bản đề lưu lúc {new Date(session.snapshotCreatedAt ?? session.createdAt).toLocaleString('vi-VN')}</p>
        {session.sourceExamId ? <Link className="mt-2 inline-block text-sm underline" href={`/doc/${encodeURIComponent(session.sourceExamId)}`}>Mở đề nguồn hiện tại (có thể đã thay đổi)</Link> : null}
        {session.examHtml ? <details className="mt-3"><summary className="cursor-pointer text-sm">Xem đề đã dùng cho đợt chấm</summary><iframe title="Đề đã đóng băng" sandbox="" className="mt-2 h-96 w-full border border-line" srcDoc={`<!doctype html><html lang="vi"><meta charset="utf-8"><style>body{font-family:serif;padding:16px}img{max-width:100%}</style><body>${session.examHtml}</body></html>`} /></details> : null}
        {session.answerKeyHtml ? <details className="mt-3"><summary className="cursor-pointer text-sm">Xem bản đáp án đã lưu kèm</summary><iframe title="Đáp án đã đóng băng" sandbox="" className="mt-2 h-80 w-full border border-line" srcDoc={`<!doctype html><html lang="vi"><meta charset="utf-8"><body>${session.answerKeyHtml}</body></html>`} /><p className="mt-1 text-xs text-ink-3">Điểm được tính theo barem có cấu trúc ở bên cạnh; bản HTML lưu kèm có thể khác nếu barem đã được sửa riêng khi tạo đợt.</p></details> : null}
        {session.sheetMode === 'template' ? (
          <div className="mt-3 border-t border-surface-3 pt-3">
            <p className="text-[12.5px] text-ink-2">
              Phiếu trả lời đã sinh sẵn, mỗi học sinh một phiếu có mã riêng.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                window.open(basePath(`/api/grading/sessions/${session.id}/sheet`), '_blank', 'noopener')
              }
            >
              <Printer className="size-3.5" />
              Mở phiếu để in
            </Button>
          </div>
        ) : null}
      </div>

      <div className="rounded-md border border-line bg-white p-4">
        <h3 className="text-[14px] font-medium text-ink">Đáp án & barem</h3>
        <div className="mt-2 max-h-[420px] space-y-1.5 overflow-y-auto">
          {session.rubric.questions.map((question) => (
            <div key={question.no} className="rounded-sm border border-surface-3 px-2.5 py-1.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-ink">Câu {question.no}</span>
                <span className="text-ink-4">{formatMark(question.points)} điểm</span>
              </div>
              {question.type === 'mc' ? (
                <p className="mt-0.5 text-[12px] text-ink-3">Trắc nghiệm · đáp án {question.answer}</p>
              ) : question.type === 'tf' ? (
                <p className="mt-0.5 text-[12px] text-ink-3">
                  Đúng/Sai · đáp án {formatTfStatements(question.statements)}
                </p>
              ) : question.type === 'short' ? (
                <p className="mt-0.5 text-[12px] text-ink-3">Trả lời ngắn · đáp án {question.answer}</p>
              ) : (
                <ul className="mt-1 space-y-0.5">
                  {question.steps.map((step) => (
                    <li key={step.key} className="flex justify-between gap-2 text-[12px] text-ink-3">
                      <span>{step.text}</span>
                      <span className="shrink-0 text-ink-4">{formatMark(step.points)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
        <div className="rounded-md border border-danger/20 bg-white p-4 lg:col-span-2">
          <p className="text-[12px] leading-relaxed text-ink-4">
            Xoá đợt chấm sẽ xoá luôn ảnh bài làm, điểm và lịch sử sửa điểm.
          </p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setConfirmOpen(true)} disabled={deleting}>
            {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5 text-danger" />}
            Xoá đợt chấm
          </Button>
          {error ? <p className="mt-1.5 text-[12px] text-danger">{error}</p> : null}
        </div>
        <Dialog open={confirmOpen} onClose={() => (deleting ? undefined : setConfirmOpen(false))} labelledBy="delete-session-title">
          <h3 id="delete-session-title" className="text-base font-semibold text-ink">
            Xoá đợt chấm này?
          </h3>
          <p className="mt-2 text-sm text-ink-2">
            Toàn bộ ảnh bài làm và điểm đã chấm của đợt <strong>{session.title}</strong> sẽ bị xoá vĩnh viễn và không thể hoàn tác.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmOpen(false)} disabled={deleting}>
              Huỷ
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-danger bg-danger text-white hover:bg-danger/90"
              onClick={() => void remove()}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Xoá vĩnh viễn
            </Button>
          </div>
        </Dialog>
    </div>
  );
}
