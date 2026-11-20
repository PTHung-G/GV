'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import {
  formatTfStatements,
  parsePoints,
  parseTfStatements,
  type AnswerKeyQuestion,
} from '@/lib/grading/rubric';

type EditableRow = {
  id: string;
  type: 'mc' | 'tf' | 'short' | 'essay';
  label: string;
  answer: string;
  points: string;
  steps: Array<{ text: string; points: string }>;
};

function toEditable(questions: AnswerKeyQuestion[]): EditableRow[] {
  if (!questions.length) {
    return [{ id: crypto.randomUUID(), type: 'mc', label: 'Câu 1', answer: 'A', points: '0,5', steps: [] }];
  }
  return questions.map((q) => {
    const st = q.statements ?? (q.type === 'tf' ? parseTfStatements(q.answer) : null);
    const inferredType: EditableRow['type'] =
      q.type ?? (st ? 'tf' : q.steps?.length ? 'essay' : 'mc');
    return {
      id: crypto.randomUUID(),
      type: inferredType,
      label: q.label,
      answer: inferredType === 'tf' && st ? formatTfStatements(st) : q.answer,
      points: q.points ?? '',
      steps: (q.steps ?? []).map((s) => ({ text: s.text, points: s.points ?? '' })),
    };
  });
}

function seedQuestionsFromHtml(html: string): AnswerKeyQuestion[] {
  const plainBlocks = html
    .replace(/<[^>]+>/g, '\n')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out: AnswerKeyQuestion[] = [];
  for (const line of plainBlocks) {
    const m = /^(?:Câu|Bài)\s+(\d+)(?:\s*\((\d+(?:[.,]\d+)?)\s*điểm\))?\s*[.:)]/iu.exec(line);
    if (!m) continue;
    out.push({
      label: `Câu ${m[1]}`,
      type: 'mc',
      answer: 'A',
      ...(m[2] ? { points: m[2].replace('.', ',') } : {}),
    });
  }
  return out;
}

export function RubricEditorDialog({
  open,
  initialQuestions,
  examHtml,
  onClose,
  onSave,
}: {
  open: boolean;
  initialQuestions: AnswerKeyQuestion[];
  examHtml?: string;
  onClose: () => void;
  onSave: (questions: AnswerKeyQuestion[]) => void;
}) {
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    const source = initialQuestions.length
      ? initialQuestions
      : examHtml
        ? seedQuestionsFromHtml(examHtml)
        : [];
    setRows(toEditable(source));
  }, [open, initialQuestions, examHtml]);

  const totalPoints = useMemo(
    () =>
      rows.reduce((sum, row) => {
        const pts = parsePoints(row.points);
        return sum + (pts && pts > 0 ? pts : 0);
      }, 0),
    [rows],
  );

  const distribute10 = () => {
    if (!rows.length) return;
    const each = Math.round((10 / rows.length) * 100) / 100;
    const formatted = each.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        points: formatted,
        steps:
          row.type === 'essay' && row.steps.length === 1
            ? [{ ...row.steps[0], points: formatted }]
            : row.steps,
      })),
    );
  };

  const applyThpt2025Preset = () => {
    setRows((prev) =>
      prev.map((row) => {
        const pts = row.type === 'mc' ? '0,25' : row.type === 'tf' ? '1,0' : row.type === 'short' ? '0,5' : row.points || '2,0';
        return { ...row, points: pts };
      }),
    );
  };

  const updateRow = (id: string, patch: Partial<EditableRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleSave = () => {
    setError('');
    const out: AnswerKeyQuestion[] = [];
    for (let i = 0; i < rows.length; i += 1) {
      const r = rows[i];
      const label = r.label.trim() || `Câu ${i + 1}`;
      const ptsNum = parsePoints(r.points);
      if (r.points.trim() && (ptsNum === null || ptsNum <= 0)) {
        setError(`${label}: điểm phải là số dương (ví dụ 0,25 hoặc 2,0).`);
        return;
      }
      if (r.type === 'mc') {
        const letter = r.answer.trim().toUpperCase();
        if (!/^[A-D]$/.test(letter)) {
          setError(`${label}: trắc nghiệm A–D cần chọn 1 chữ cái A, B, C hoặc D.`);
          return;
        }
        out.push({ type: 'mc', label, answer: letter, ...(r.points.trim() ? { points: r.points.trim() } : {}) });
      } else if (r.type === 'tf') {
        const st = parseTfStatements(r.answer);
        if (!st) {
          setError(`${label}: cần đủ 4 đáp án Đúng/Sai (a, b, c, d).`);
          return;
        }
        out.push({
          type: 'tf',
          label,
          answer: formatTfStatements(st),
          statements: st,
          ...(r.points.trim() ? { points: r.points.trim() } : {}),
        });
      } else if (r.type === 'short') {
        if (!r.answer.trim()) {
          setError(`${label}: vui lòng nhập đáp án trả lời ngắn.`);
          return;
        }
        out.push({ type: 'short', label, answer: r.answer.trim(), ...(r.points.trim() ? { points: r.points.trim() } : {}) });
      } else {
        const cleanSteps = r.steps
          .map((s) => ({ text: s.text.trim(), ...(s.points.trim() ? { points: s.points.trim() } : {}) }))
          .filter((s) => s.text);
        if (!cleanSteps.length) {
          setError(`${label}: câu tự luận cần ít nhất 1 bước chấm.`);
          return;
        }
        out.push({
          type: 'essay',
          label,
          answer: r.answer.trim(),
          ...(r.points.trim() ? { points: r.points.trim() } : {}),
          steps: cleanSteps,
        });
      }
    }
    onSave(out);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy="rubric-editor-title" className="max-w-[780px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="rubric-editor-title" className="text-[16px] font-semibold text-ink">
            Chỉnh sửa đáp án &amp; thang điểm có cấu trúc
          </h2>
          <p className="mt-0.5 text-[12px] text-ink-3">
            Hỗ trợ 4 dạng câu GDPT 2018 / THPT 2025. Lưu xong sẽ đồng bộ thẳng sang bảng đáp án và phiếu chấm.
          </p>
        </div>
        <div className="rounded-md bg-surface-2 px-3 py-1.5 text-[13px] font-semibold text-ink">
          Tổng: {totalPoints.toFixed(2).replace(/\.?0+$/, '').replace('.', ',')} điểm
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={distribute10}
          className="h-8 rounded-md border border-line bg-white px-2.5 text-[12.5px] font-medium text-ink hover:bg-surface-2"
        >
          Chia đều thang 10
        </button>
        <button
          type="button"
          onClick={applyThpt2025Preset}
          className="h-8 rounded-md border border-line bg-white px-2.5 text-[12.5px] font-medium text-ink hover:bg-surface-2"
        >
          Thang THPT 2025 (0,25 / 1,0 / 0,5)
        </button>
        <button
          type="button"
          onClick={() =>
            setRows((prev) => [
              ...prev,
              { id: crypto.randomUUID(), type: 'mc', label: `Câu ${prev.length + 1}`, answer: 'A', points: '0,25', steps: [] },
            ])
          }
          className="ml-auto inline-flex h-8 items-center gap-1 rounded-md border border-line-strong bg-white px-2.5 text-[12.5px] font-medium text-ink hover:bg-surface-2"
        >
          <Plus className="size-3.5" /> Thêm câu
        </button>
      </div>

      <div className="mt-3 max-h-[52dvh] space-y-2 overflow-y-auto pr-1">
        {rows.map((row, idx) => (
          <div key={row.id} className="rounded-md border border-line bg-surface-2 p-2.5 text-[13px]">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={row.label}
                onChange={(e) => updateRow(row.id, { label: e.target.value })}
                aria-label={`Nhãn câu ${idx + 1}`}
                className="h-8 w-24 rounded-md border border-line bg-white px-2 text-[13px] font-medium text-ink"
              />
              <select
                value={row.type}
                onChange={(e) => {
                  const nextType = e.target.value as EditableRow['type'];
                  updateRow(row.id, {
                    type: nextType,
                    answer:
                      nextType === 'mc'
                        ? 'A'
                        : nextType === 'tf'
                          ? 'ĐSĐS'
                          : nextType === 'short'
                            ? '0'
                            : row.answer,
                    steps:
                      nextType === 'essay' && !row.steps.length
                        ? [{ text: 'Trình bày đúng phương pháp và kết quả', points: row.points || '1,0' }]
                        : row.steps,
                  });
                }}
                className="h-8 rounded-md border border-line bg-white px-2 text-[12.5px] text-ink"
              >
                <option value="mc">Trắc nghiệm A–D</option>
                <option value="tf">Đúng/Sai (4 ý)</option>
                <option value="short">Trả lời ngắn</option>
                <option value="essay">Tự luận</option>
              </select>

              {row.type === 'mc' ? (
                <select
                  value={row.answer.toUpperCase()}
                  onChange={(e) => updateRow(row.id, { answer: e.target.value })}
                  className="h-8 w-20 rounded-md border border-line bg-white px-2 text-[13px] font-semibold text-ink"
                >
                  {['A', 'B', 'C', 'D'].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              ) : row.type === 'tf' ? (
                <div className="flex items-center gap-1">
                  {(['a', 'b', 'c', 'd'] as const).map((sub, i) => {
                    const ch = (row.answer.toUpperCase()[i] === 'Đ' || row.answer.toUpperCase()[i] === 'T') ? 'Đ' : 'S';
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          const chars = (row.answer.padEnd(4, 'S').slice(0, 4)).split('');
                          chars[i] = ch === 'Đ' ? 'S' : 'Đ';
                          updateRow(row.id, { answer: chars.join('') });
                        }}
                        className={`h-8 rounded-md border px-2 text-[12px] font-medium ${
                          ch === 'Đ'
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-line bg-white text-ink-3'
                        }`}
                      >
                        {sub}) {ch}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  value={row.answer}
                  onChange={(e) => updateRow(row.id, { answer: e.target.value })}
                  placeholder={row.type === 'short' ? 'Ví dụ: -2,5' : 'Đáp án mẫu'}
                  className="h-8 min-w-[140px] flex-1 rounded-md border border-line bg-white px-2 text-[13px] text-ink"
                />
              )}

              <input
                value={row.points}
                onChange={(e) => updateRow(row.id, { points: e.target.value })}
                placeholder="Điểm"
                aria-label={`Điểm ${row.label}`}
                className="ml-auto h-8 w-20 rounded-md border border-line bg-white px-2 text-right text-[13px] text-ink"
              />
              <button
                type="button"
                aria-label={`Xoá ${row.label}`}
                onClick={() => setRows((prev) => prev.filter((item) => item.id !== row.id))}
                className="grid size-8 place-items-center rounded-md text-ink-3 hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {row.type === 'essay' ? (
              <div className="mt-2 space-y-1.5 border-t border-line pt-2">
                {row.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-1.5">
                    <input
                      value={step.text}
                      onChange={(e) => {
                        const next = [...row.steps];
                        next[sIdx] = { ...next[sIdx], text: e.target.value };
                        updateRow(row.id, { steps: next });
                      }}
                      placeholder={`Bước chấm ${sIdx + 1}`}
                      className="h-7 flex-1 rounded-sm border border-line bg-white px-2 text-[12.5px] text-ink"
                    />
                    <input
                      value={step.points}
                      onChange={(e) => {
                        const next = [...row.steps];
                        next[sIdx] = { ...next[sIdx], points: e.target.value };
                        updateRow(row.id, { steps: next });
                      }}
                      placeholder="Điểm"
                      className="h-7 w-16 rounded-sm border border-line bg-white px-1.5 text-right text-[12.5px] text-ink"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateRow(row.id, { steps: [...row.steps, { text: '', points: '' }] })}
                  className="text-[12px] font-medium text-accent hover:underline"
                >
                  + Thêm ý chấm
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {error ? <p role="alert" className="mt-2 text-[12.5px] text-danger">{error}</p> : null}

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="h-8 rounded-md px-3 text-[13px] font-medium text-ink-2 hover:bg-surface-3">
          Huỷ
        </button>
        <button type="button" onClick={handleSave} className="h-8 rounded-md bg-accent px-4 text-[13px] font-medium text-white hover:bg-accent-hover">
          Lưu đáp án &amp; barem
        </button>
      </div>
    </Dialog>
  );
}
