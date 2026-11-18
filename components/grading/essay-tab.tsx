'use client';

/**
 * Reviewing essay answers.
 *
 * The paper is shown next to the marking scheme, and every proposed mark carries
 * the evidence the model quoted. A teacher approves or corrects; nothing here is
 * applied automatically.
 */
import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  formatMark,
  gradingApi,
  GradingApiError,
  pageUrl,
  type SessionDetail,
  type SubmissionSummary,
} from '@/lib/grading-client';

type EssayRow = {
  submissionId: string;
  questionNo: number;
  criterionKey: string;
  maxPoints: number;
  aiPoints: number | null;
  finalPoints: number | null;
  evidence: string | null;
  confidence: number | null;
  flags: string[];
  source: string;
};

export function EssayTab({
  session,
  submissions,
  onRefresh,
}: {
  session: SessionDetail;
  submissions: SubmissionSummary[];
  onRefresh: () => void;
}) {
  const [rows, setRows] = useState<EssayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<'paper' | 'question'>('paper');
  const [questionNo, setQuestionNo] = useState<number | null>(null);

  const essayQuestions = session.rubric.questions.filter((question) => question.type === 'essay');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await gradingApi.get<{ essay: EssayRow[] }>(`/api/grading/sessions/${session.id}/review`);
      setRows(data.essay);
      setError('');
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không tải được điểm tự luận.');
    } finally {
      setLoading(false);
    }
  }, [session.id]);

  useEffect(() => {
    void load();
  }, [load, submissions]);

  useEffect(() => {
    if (!activeId && submissions.length > 0) setActiveId(submissions[0].id);
  }, [submissions, activeId]);

  const active = submissions.find((submission) => submission.id === activeId) ?? null;

  async function saveMark(row: EssayRow, value: string) {
    const key = `${row.submissionId}:${row.questionNo}:${row.criterionKey}`;
    setSaving(key);
    try {
      const parsed = value.trim() === '' ? null : Number(value.replace(',', '.'));
      await gradingApi.patch(`/api/grading/submissions/${row.submissionId}`, {
        essay: [{ questionNo: row.questionNo, criterionKey: row.criterionKey, finalPoints: parsed }],
      });
      onRefresh();
      void load();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không lưu được điểm.');
    } finally {
      setSaving('');
    }
  }

  async function confirm(submissionId: string) {
    setSaving(submissionId);
    try {
      await gradingApi.patch(`/api/grading/submissions/${submissionId}`, { confirm: true });
      onRefresh();
      void load();
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không xác nhận được bài.');
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

      <div className="mt-1 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setView('paper')}
          className={`rounded-md border px-2.5 py-1 text-[12.5px] ${
            view === 'paper' ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-white text-ink-3'
          }`}
        >
          Từng bài
        </button>
        <button
          type="button"
          onClick={() => {
            setView('question');
            if (questionNo === null && essayQuestions[0]) setQuestionNo(essayQuestions[0].no);
          }}
          className={`rounded-md border px-2.5 py-1 text-[12.5px] ${
            view === 'question' ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-white text-ink-3'
          }`}
        >
          Theo câu cho cả lớp
        </button>
        {view === 'question' ? (
          <span className="ml-2 flex items-center gap-1">
            {essayQuestions.map((question) => (
              <button
                key={question.no}
                type="button"
                onClick={() => setQuestionNo(question.no)}
                className={`rounded-sm px-2 py-1 text-[12px] ${
                  questionNo === question.no ? 'bg-ink text-white' : 'bg-surface-3 text-ink-2'
                }`}
              >
                Câu {question.no}
              </button>
            ))}
          </span>
        ) : null}
      </div>

      <div className={`mt-3 flex gap-3 overflow-x-auto pb-2 ${view === 'paper' ? '' : 'hidden'}`}>
        {submissions.map((submission) => (
          <button
            key={submission.id}
            type="button"
            onClick={() => setActiveId(submission.id)}
            className={`shrink-0 rounded-md border px-2.5 py-1.5 text-[12.5px] ${
              submission.id === activeId
                ? 'border-accent bg-accent-soft text-ink'
                : 'border-line bg-white text-ink-3 hover:bg-surface-2'
            }`}
          >
            {submission.studentName || submission.label}
            <span className="ml-1.5 text-ink-4">{formatMark(submission.essayScore)}</span>
          </button>
        ))}
      </div>

      {view === 'paper' && active ? (
        <div className="mt-3 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="max-h-[460px] space-y-2 overflow-y-auto rounded-md border border-line bg-surface-2 p-2">
              {active.pages.map((page) => (
                <a key={page.id} href={pageUrl(page.id)} target="_blank" rel="noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pageUrl(page.id)}
                    alt={`Trang ${page.pageIndex + 1}`}
                    className="w-full rounded-sm border border-line"
                  />
                </a>
              ))}
            </div>
            <Button
              variant="blue"
              className="mt-2 w-full"
              onClick={() => void confirm(active.id)}
              disabled={saving === active.id}
            >
              {saving === active.id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Xác nhận bài này
            </Button>
          </div>

          <div className="space-y-3">
            {essayQuestions.map((question) => {
              const questionRows = rows.filter(
                (row) => row.submissionId === active.id && row.questionNo === question.no,
              );
              const steps = question.type === 'essay' ? question.steps : [];

              return (
                <div key={question.no} className="rounded-md border border-line bg-white p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13.5px] font-medium text-ink">
                      Câu {question.no}
                      <span className="ml-1.5 font-normal text-ink-4">{question.points} điểm</span>
                    </h3>
                  </div>

                  <div className="mt-2 space-y-2">
                    {steps.map((step) => {
                      const row = questionRows.find((entry) => entry.criterionKey === step.key);
                      const key = `${active.id}:${question.no}:${step.key}`;
                      const value = row?.finalPoints ?? row?.aiPoints ?? null;

                      return (
                        <div key={step.key} className="rounded-sm border border-surface-3 bg-surface-2 p-2">
                          <div className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[12.5px] text-ink">{step.text}</p>
                              {row?.evidence ? (
                                <p className="mt-1 border-l-2 border-line pl-2 text-[12px] text-ink-3 italic">
                                  “{row.evidence}”
                                </p>
                              ) : (
                                <p className="mt-1 text-[12px] text-ink-4">Chưa có căn cứ trích dẫn.</p>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <input
                                type="number"
                                step="0.25"
                                min={0}
                                max={step.points}
                                defaultValue={value ?? ''}
                                onBlur={(event) => {
                                  if (event.target.value === String(value ?? '')) return;
                                  void saveMark(
                                    row ?? {
                                      submissionId: active.id,
                                      questionNo: question.no,
                                      criterionKey: step.key,
                                      maxPoints: step.points,
                                      aiPoints: null,
                                      finalPoints: null,
                                      evidence: null,
                                      confidence: null,
                                      flags: [],
                                      source: 'teacher',
                                    },
                                    event.target.value,
                                  );
                                }}
                                className="h-8 w-16 rounded-sm border border-line-strong bg-white px-2 text-right text-[13px]"
                              />
                              <span className="text-[11.5px] text-ink-4">/{step.points}</span>
                              {saving === key ? <Loader2 className="size-3.5 animate-spin text-ink-4" /> : null}
                            </div>
                          </div>

                          {row?.flags?.length ? (
                            <p className="mt-1 text-[11.5px] text-warn">
                              {row.flags.includes('unreadable')
                                ? 'Không đọc rõ bài làm'
                                : row.flags.includes('low-confidence')
                                  ? 'Máy chưa chắc chắn'
                                  : row.flags.includes('partial')
                                    ? 'Điểm một phần'
                                    : row.flags.join(', ')}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {view === 'question'
        ? essayQuestions
            .filter((question) => question.no === questionNo)
            .map((question) => (
              <div key={question.no} className="mt-3 space-y-2">
                <p className="text-[12.5px] text-ink-3">
                  Đang chấm câu {question.no} ({question.points} điểm) cho {submissions.length} bài. So sánh trực
                  tiếp giúp điểm công bằng hơn chấm từng bài một.
                </p>
                {submissions.map((submission) => (
                  <div key={submission.id} className="rounded-md border border-line bg-white p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-ink">
                        {submission.studentName || submission.label}
                      </span>
                      <span className="text-[11.5px] text-ink-4">
                        {formatMark(submission.essayScore)} điểm tự luận
                      </span>
                      {submission.pages[0] ? (
                        <a
                          href={pageUrl(submission.pages[0].id)}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto text-[11.5px] text-accent hover:underline"
                        >
                          Xem bài
                        </a>
                      ) : null}
                    </div>

                    <div className="mt-1.5 space-y-1.5">
                      {question.steps.map((step) => {
                        const row = rows.find(
                          (entry) =>
                            entry.submissionId === submission.id &&
                            entry.questionNo === question.no &&
                            entry.criterionKey === step.key,
                        );
                        const value = row?.finalPoints ?? row?.aiPoints ?? null;
                        const key = `${submission.id}:${question.no}:${step.key}`;

                        return (
                          <div key={step.key} className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] text-ink-2">{step.text}</p>
                              {row?.evidence ? (
                                <p className="mt-0.5 border-l-2 border-line pl-2 text-[11.5px] text-ink-3 italic">
                                  “{row.evidence}”
                                </p>
                              ) : null}
                            </div>
                            <input
                              type="number"
                              step="0.25"
                              min={0}
                              max={step.points}
                              defaultValue={value ?? ''}
                              onBlur={(event) => {
                                if (event.target.value === String(value ?? '')) return;
                                void saveMark(
                                  row ?? {
                                    submissionId: submission.id,
                                    questionNo: question.no,
                                    criterionKey: step.key,
                                    maxPoints: step.points,
                                    aiPoints: null,
                                    finalPoints: null,
                                    evidence: null,
                                    confidence: null,
                                    flags: [],
                                    source: 'teacher',
                                  },
                                  event.target.value,
                                );
                              }}
                              className="h-8 w-16 shrink-0 rounded-sm border border-line-strong bg-white px-2 text-right text-[13px]"
                            />
                            <span className="mt-1.5 w-8 shrink-0 text-[11px] text-ink-4">/{step.points}</span>
                            {saving === key ? <Loader2 className="mt-2 size-3.5 shrink-0 animate-spin text-ink-4" /> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))
        : null}
    </div>
  );
}
