'use client';

/**
 * Class analysis after the marks are in.
 *
 * This is the screen that actually helps teaching: which questions the class
 * failed, and which wrong option they clustered on — a wrong option chosen by
 * most of the class usually means a shared misconception, not 30 separate
 * mistakes.
 */
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { formatMark, gradingApi, GradingApiError, type SessionDetail } from '@/lib/grading-client';

type Stats = {
  count: number;
  average: number | null;
  median: number | null;
  highest: number | null;
  lowest: number | null;
  distribution: number[];
  belowAverageCount: number;
  perQuestion: Array<{ questionNo: number; correctRate: number; answered: number; blank: number }>;
  distractors: Array<{ questionNo: number; counts: Record<string, number> }>;
};

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-md border border-line bg-white px-3 py-2.5">
      <p className="text-[11.5px] tracking-wide text-ink-4 uppercase">{label}</p>
      <p className="mt-0.5 text-[19px] leading-tight font-medium text-ink">{value}</p>
      {hint ? <p className="text-[11.5px] text-ink-4">{hint}</p> : null}
    </div>
  );
}

export function StatsTab({ session }: { session: SessionDetail }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await gradingApi.get<{ stats: Stats }>(`/api/grading/sessions/${session.id}/stats`);
      setStats(data.stats);
      setError('');
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không tải được thống kê.');
    } finally {
      setLoading(false);
    }
  }, [session.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-ink-4" />
      </div>
    );
  }

  if (error) {
    return <p className="py-12 text-center text-[13px] text-danger">{error}</p>;
  }

  if (!stats || stats.count === 0) {
    return (
      <div className="rounded-md border border-dashed border-line-strong bg-surface-2 px-6 py-12 text-center">
        <p className="text-[13.5px] text-ink-2">Chưa có bài nào có điểm để thống kê.</p>
        <p className="mt-1 text-[12.5px] text-ink-4">Duyệt xong bài đầu tiên là bảng này có dữ liệu.</p>
      </div>
    );
  }

  const maxBucket = Math.max(1, ...stats.distribution);
  const hardest = [...stats.perQuestion].sort((a, b) => a.correctRate - b.correctRate).slice(0, 3);
  const mcQuestions = session.rubric.questions.filter((question) => question.type === 'mc');
  const answerOf = new Map(
    mcQuestions.map((question) => [question.no, question.type === 'mc' ? question.answer : '']),
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Số bài có điểm" value={String(stats.count)} />
        <StatCard label="Trung bình" value={formatMark(stats.average)} />
        <StatCard label="Trung vị" value={formatMark(stats.median)} />
        <StatCard label="Cao nhất" value={formatMark(stats.highest)} />
        <StatCard label="Thấp nhất" value={formatMark(stats.lowest)} />
        <StatCard label="Dưới 5" value={String(stats.belowAverageCount)} hint="học sinh cần kèm" />
      </div>

      <div className="rounded-md border border-line bg-white p-4">
        <h3 className="text-[13.5px] font-medium text-ink">Phổ điểm</h3>
        <div className="mt-3 flex items-end gap-1.5">
          {stats.distribution.map((count, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[11px] text-ink-4">{count || ''}</span>
              <div
                className="w-full rounded-t bg-accent"
                style={{ height: `${Math.max(2, (count / maxBucket) * 96)}px` }}
                title={`${index}–${index + 1} điểm: ${count} bài`}
              />
              <span className="text-[10.5px] text-ink-4">{index}</span>
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-[11.5px] text-ink-4">Cột 0 là 0–1 điểm, cột 9 là 9–10 điểm.</p>
      </div>

      {stats.perQuestion.length > 0 ? (
        <div className="rounded-md border border-line bg-white p-4">
          <h3 className="text-[13.5px] font-medium text-ink">Tỉ lệ đúng từng câu</h3>
          <div className="mt-3 space-y-1.5">
            {stats.perQuestion.map((question) => {
              const percent = Math.round(question.correctRate * 100);
              const isHard = percent < 50;
              return (
                <div key={question.questionNo} className="flex items-center gap-2">
                  <span className="w-12 shrink-0 text-[12px] text-ink-2">Câu {question.questionNo}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-sm bg-surface-3">
                    <div
                      className={`h-full rounded-sm ${isHard ? 'bg-warn' : 'bg-ok'}`}
                      style={{ width: `${Math.max(1, percent)}%` }}
                    />
                  </div>
                  <span className={`w-10 shrink-0 text-right text-[12px] ${isHard ? 'text-warn' : 'text-ink-2'}`}>
                    {percent}%
                  </span>
                  <span className="w-16 shrink-0 text-right text-[11px] text-ink-4">
                    {question.blank > 0 ? `${question.blank} bỏ trống` : ''}
                  </span>
                </div>
              );
            })}
          </div>
          {hardest.length > 0 && hardest[0].correctRate < 0.5 ? (
            <p className="mt-3 border-t border-surface-3 pt-2 text-[12.5px] text-warn">
              Câu khó nhất: {hardest.map((item) => `câu ${item.questionNo}`).join(', ')} — nên chữa lại trên lớp.
            </p>
          ) : null}
        </div>
      ) : null}

      {stats.distractors.length > 0 ? (
        <div className="rounded-md border border-line bg-white p-4">
          <h3 className="text-[13.5px] font-medium text-ink">Phân bố phương án đã chọn</h3>
          <p className="mt-1 text-[12px] text-ink-4">
            Đáp án đúng in đậm. Nhiều em cùng chọn một phương án sai thường là lỗi hệ thống của lớp.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr className="text-ink-4">
                  <th className="px-2 py-1 text-left font-medium">Câu</th>
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <th key={letter} className="px-2 py-1 text-right font-medium">
                      {letter}
                    </th>
                  ))}
                  <th className="px-2 py-1 text-right font-medium">Bỏ trống</th>
                </tr>
              </thead>
              <tbody>
                {stats.distractors.map((row) => {
                  const correct = answerOf.get(row.questionNo) ?? '';
                  return (
                    <tr key={row.questionNo} className="border-t border-surface-3">
                      <td className="px-2 py-1 text-ink-2">{row.questionNo}</td>
                      {['A', 'B', 'C', 'D'].map((letter) => (
                        <td
                          key={letter}
                          className={`px-2 py-1 text-right ${
                            letter === correct ? 'font-semibold text-ok' : 'text-ink-2'
                          }`}
                        >
                          {row.counts[letter] ?? 0}
                        </td>
                      ))}
                      <td className="px-2 py-1 text-right text-ink-4">{row.counts['—'] ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
