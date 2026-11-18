'use client';

/**
 * Reviewing multiple choice as a grid: papers down the side, questions across
 * the top. Only cells the reader was unsure about are highlighted, so a class of
 * 30 papers needs a handful of fixes rather than 600 looks.
 */
import { useCallback, useEffect, useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { formatMark, pageUrl, gradingApi, GradingApiError, type SessionDetail, type SubmissionSummary } from '@/lib/grading-client';
import { OmrInspector } from './omr-inspector';

type McRow = {
  submissionId: string;
  questionNo: number;
  picked: string | null;
  confidence: number | null;
  flags: string[];
  source: string;
};

const LETTERS = ['', 'A', 'B', 'C', 'D'];

function needsAttention(row: McRow | undefined): boolean {
  if (!row) return true;
  return row.flags.some((flag) => flag === 'blank' || flag === 'double-mark' || flag === 'low-confidence');
}

export function McTab({
  session,
  submissions,
  onRefresh,
}: {
  session: SessionDetail;
  submissions: SubmissionSummary[];
  onRefresh: () => void;
}) {
  const [rows, setRows] = useState<McRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');
  const [inspect, setInspect] = useState<{ url: string; title: string } | null>(null);

  const mcQuestions = session.rubric.questions.filter((question) => question.type === 'mc');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await gradingApi.get<{ mc: McRow[] }>(`/api/grading/sessions/${session.id}/review`);
      setRows(data.mc);
      setError('');
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không tải được đáp án.');
    } finally {
      setLoading(false);
    }
  }, [session.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const lookup = new Map(rows.map((row) => [`${row.submissionId}:${row.questionNo}`, row]));

  async function change(submissionId: string, questionNo: number, picked: string) {
    const key = `${submissionId}:${questionNo}`;
    setSaving(key);
    // Optimistic: the grid must feel instant while correcting a whole class.
    setRows((current) => {
      const next = current.filter((row) => !(row.submissionId === submissionId && row.questionNo === questionNo));
      next.push({
        submissionId,
        questionNo,
        picked: picked || null,
        confidence: 1,
        flags: [],
        source: 'teacher',
      });
      return next;
    });

    try {
      await gradingApi.patch(`/api/grading/submissions/${submissionId}`, {
        mc: [{ questionNo, picked: picked || null }],
      });
      onRefresh();
      void load();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không lưu được đáp án.');
      void load();
    } finally {
      setSaving('');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-ink-4" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return <p className="py-12 text-center text-[13.5px] text-ink-4">Chưa có bài nào để chấm.</p>;
  }

  return (
    <div>
      {error ? (
        <div className="mb-3 rounded-md border border-warn-line bg-warn-soft px-3 py-2 text-[13px] text-warn">
          {error}
        </div>
      ) : null}

      <p className="mb-3 text-[12.5px] text-ink-4">
        Ô tô vàng là chỗ máy đọc chưa chắc. Sửa trực tiếp vào bảng, điểm tự cập nhật.
      </p>

      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-surface-2">
              <th className="sticky left-0 z-10 min-w-40 border-b border-line bg-surface-2 px-3 py-2 text-left font-medium text-ink-2">
                Học sinh
              </th>
              {mcQuestions.map((question) => (
                <th
                  key={question.no}
                  className="border-b border-line px-2 py-2 text-center font-medium text-ink-2"
                  title={`Đáp án đúng: ${question.type === 'mc' ? question.answer : ''}`}
                >
                  {question.no}
                </th>
              ))}
              <th className="border-b border-line px-3 py-2 text-right font-medium text-ink-2">TN</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-surface-2">
                <th className="sticky left-0 z-10 border-b border-surface-3 bg-white px-3 py-1.5 text-left font-normal">
                  <span className="flex items-center gap-1.5">
                    <span className="text-ink">{submission.studentName || submission.label}</span>
                    {submission.pages.length > 0 && session.sheetTemplate ? (
                      <button
                        type="button"
                        onClick={() =>
                          setInspect({
                            url: pageUrl(submission.pages[0].id),
                            title: `${submission.studentName || submission.label || 'Bài chưa gán'} · trang 1`,
                          })
                        }
                        title="Xem máy đọc tờ này"
                        aria-label={`Xem máy đọc bài của ${submission.studentName ?? submission.label}`}
                        className="text-ink-4 transition-colors hover:text-accent"
                      >
                        <Eye className="size-3.5" />
                      </button>
                    ) : null}
                  </span>
                </th>
                {mcQuestions.map((question) => {
                  const row = lookup.get(`${submission.id}:${question.no}`);
                  const attention = needsAttention(row);
                  const busy = saving === `${submission.id}:${question.no}`;
                  return (
                    <td key={question.no} className="border-b border-surface-3 p-0.5 text-center">
                      <select
                        value={row?.picked ?? ''}
                        onChange={(event) => void change(submission.id, question.no, event.target.value)}
                        disabled={busy}
                        aria-label={`Câu ${question.no} của ${submission.studentName ?? submission.label}`}
                        className={`h-7 w-11 rounded-sm border text-center text-[12.5px] outline-none ${
                          attention
                            ? 'border-warn-line bg-warn-soft text-warn'
                            : 'border-transparent bg-transparent text-ink'
                        }`}
                      >
                        {LETTERS.map((letter) => (
                          <option key={letter || 'blank'} value={letter}>
                            {letter || '—'}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
                <td className="border-b border-surface-3 px-3 py-1.5 text-right text-ink-2">
                  {formatMark(submission.mcScore)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[12px] text-ink-4">
        Cột TN là điểm phần trắc nghiệm. Đáp án đúng của từng câu nằm trong tab “Đề &amp; thang điểm”.
      </p>

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
