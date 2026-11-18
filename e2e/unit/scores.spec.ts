/**
 * Unit tests for the scoring maths.
 *
 * These are pure functions, so there is no page and no navigation here — the
 * suite only guards the rules that decide a student's mark.
 */
import { expect, test } from '@playwright/test';
import {
  computeSectionScores,
  scoreMultipleChoice,
  scoreStatistics,
  toCsv,
  type CriterionScore,
  type McAnswer,
} from '../../lib/grading/scores';
import type { Rubric } from '../../lib/grading/rubric';

const RUBRIC: Rubric = {
  version: 1,
  totalPoints: 3,
  questions: [
    { no: 1, type: 'mc', points: 0.5, answer: 'B', label: 'Câu 1' },
    { no: 2, type: 'mc', points: 0.5, answer: 'D', label: 'Câu 2' },
    {
      no: 3,
      type: 'essay',
      points: 2,
      label: 'Câu 3',
      steps: [
        { key: 's1', text: 'Đưa về phương trình bậc hai', points: 1 },
        { key: 's2', text: 'Tìm đúng hai nghiệm', points: 1 },
      ],
    },
  ],
};

/** A 10-point paper, so the "below 5" threshold means what teachers expect. */
const TEN_POINT: Rubric = {
  version: 1,
  totalPoints: 10,
  questions: [
    { no: 1, type: 'mc', points: 5, answer: 'B' },
    { no: 2, type: 'mc', points: 5, answer: 'D' },
  ],
};

const MC_ONLY: Rubric = {
  version: 1,
  totalPoints: 1,
  questions: [
    { no: 1, type: 'mc', points: 0.5, answer: 'B' },
    { no: 2, type: 'mc', points: 0.5, answer: 'D' },
  ],
};

function essayCriteria(s1: number | null, s2: number | null): CriterionScore[] {
  return [
    { questionNo: 3, criterionKey: 's1', maxPoints: 1, aiPoints: s1, finalPoints: null },
    { questionNo: 3, criterionKey: 's2', maxPoints: 1, aiPoints: s2, finalPoints: null },
  ];
}

test('a fully correct multiple-choice paper scores full marks', () => {
  const answers: McAnswer[] = [
    { questionNo: 1, picked: 'B' },
    { questionNo: 2, picked: 'd' },
  ];
  const { outcomes, points } = scoreMultipleChoice(MC_ONLY, answers);

  expect(points).toBe(1);
  expect(outcomes.every((outcome) => outcome.correct)).toBe(true);
});

test('a blank answer scores zero and is flagged as blank', () => {
  const { outcomes, points } = scoreMultipleChoice(MC_ONLY, [{ questionNo: 1, picked: null }]);

  expect(points).toBe(0);
  expect(outcomes[0].flags).toContain('blank');
  // Question 2 had no row at all and must be treated the same way.
  expect(outcomes[1].flags).toContain('blank');
});

test('two bubbles on one question are flagged as a double mark', () => {
  const { outcomes } = scoreMultipleChoice(MC_ONLY, [{ questionNo: 1, picked: 'AB' }]);

  expect(outcomes[0].correct).toBe(false);
  expect(outcomes[0].flags).toContain('double-mark');
});

test('an essay with a missing criterion has no total and is a draft', () => {
  const result = computeSectionScores({
    rubric: RUBRIC,
    mcAnswers: [
      { questionNo: 1, picked: 'B' },
      { questionNo: 2, picked: 'D' },
    ],
    criteria: essayCriteria(1, null),
    mcStatus: 'confirmed',
    essayStatus: 'needs-review',
  });

  expect(result.mc).toBe(1);
  expect(result.essay).toBeNull();
  expect(result.total).toBeNull();
  expect(result.draft).toBe(true);
  expect(result.missing.join(' ')).toContain('tự luận');
});

test('a section that is not applicable never makes the result a draft', () => {
  const result = computeSectionScores({
    rubric: MC_ONLY,
    mcAnswers: [
      { questionNo: 1, picked: 'B' },
      { questionNo: 2, picked: 'D' },
    ],
    criteria: [],
    mcStatus: 'confirmed',
    essayStatus: 'not-applicable',
  });

  expect(result.total).toBe(1);
  expect(result.draft).toBe(false);
  expect(result.missing).toEqual([]);
});

test('a complete mixed paper totals exactly, without float drift', () => {
  const result = computeSectionScores({
    rubric: RUBRIC,
    mcAnswers: [
      { questionNo: 1, picked: 'B' },
      { questionNo: 2, picked: 'A' },
    ],
    criteria: essayCriteria(1, 1),
    mcStatus: 'confirmed',
    essayStatus: 'confirmed',
  });

  expect(result.mc).toBe(0.5);
  expect(result.essay).toBe(2);
  expect(result.total).toBe(2.5);
  expect(result.draft).toBe(false);
});

test('the teacher final mark overrides the AI proposal', () => {
  const result = computeSectionScores({
    rubric: RUBRIC,
    mcAnswers: [],
    criteria: [
      { questionNo: 3, criterionKey: 's1', maxPoints: 1, aiPoints: 1, finalPoints: 0.5 },
      { questionNo: 3, criterionKey: 's2', maxPoints: 1, aiPoints: 1, finalPoints: 1 },
    ],
    mcStatus: 'not-applicable',
    essayStatus: 'confirmed',
  });

  expect(result.essay).toBe(1.5);
  expect(result.total).toBe(1.5);
});

test('an essay question cannot exceed its maximum', () => {
  const result = computeSectionScores({
    rubric: RUBRIC,
    mcAnswers: [],
    criteria: [
      { questionNo: 3, criterionKey: 's1', maxPoints: 1, aiPoints: 1, finalPoints: 1 },
      { questionNo: 3, criterionKey: 's2', maxPoints: 1, aiPoints: 1, finalPoints: 1 },
    ],
    mcStatus: 'not-applicable',
    essayStatus: 'confirmed',
  });

  expect(result.essay).toBe(2);
});

test('CSV opens correctly in Excel: BOM, semicolons and comma decimals', () => {
  const csv = toCsv([
    { code: '09001', name: 'Nguyễn Văn An', mc: 2.5, essay: 5, total: 7.5, status: 'Đã duyệt' },
    { code: null, name: 'Trần; Minh', mc: null, essay: null, total: null, status: 'Thiếu bài' },
  ]);

  expect(csv.startsWith('\uFEFF')).toBe(true);
  expect(csv).toContain('Mã HS;Họ tên;Trắc nghiệm;Tự luận;Tổng;Trạng thái;Ghi chú');
  expect(csv).toContain('09001;Nguyễn Văn An;2,50;5,00;7,50;Đã duyệt;');
  // A name containing the separator must be quoted.
  expect(csv).toContain('"Trần; Minh"');
  expect(csv).toContain('\r\n');
  // Missing marks are empty fields, never the word "null".
  expect(csv).not.toContain('null');
});

test('statistics exclude ungraded papers from averages but keep per-question data', () => {
  const stats = scoreStatistics(TEN_POINT, [
    {
      mcAnswers: [
        { questionNo: 1, picked: 'B' },
        { questionNo: 2, picked: 'A' },
      ],
      total: 8,
    },
    {
      mcAnswers: [
        { questionNo: 1, picked: 'A' },
        { questionNo: 2, picked: null },
      ],
      total: 4,
    },
    { mcAnswers: [], total: null },
  ]);

  expect(stats.count).toBe(2);
  expect(stats.average).toBe(6);
  expect(stats.median).toBe(6);
  expect(stats.highest).toBe(8);
  expect(stats.lowest).toBe(4);
  expect(stats.belowAverageCount).toBe(1);
  expect(stats.distribution[8]).toBe(1);
  expect(stats.distribution[4]).toBe(1);

  // Question 1: one correct out of three attempts.
  expect(stats.perQuestion[0].correctRate).toBeCloseTo(1 / 3, 5);
  expect(stats.perQuestion[0].blank).toBe(1);
  expect(stats.distractors[0].counts.A).toBe(1);
  expect(stats.distractors[0].counts.B).toBe(1);
  expect(stats.distractors[0].counts['—']).toBe(1);
});

test('statistics on an empty class do not divide by zero', () => {
  const stats = scoreStatistics(MC_ONLY, []);

  expect(stats.count).toBe(0);
  expect(stats.average).toBeNull();
  expect(stats.median).toBeNull();
  expect(stats.perQuestion[0].correctRate).toBe(0);
});
