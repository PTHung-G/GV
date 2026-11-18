/**
 * Scoring and reporting maths.
 *
 * Pure functions only — no database, no network, no React — so the same code
 * runs in the grading worker, in the review UI and in unit tests.
 *
 * Two rules drive everything here:
 *   * A missing score is NOT a zero. "Chưa chấm" and "sai" are different facts,
 *     and a paper with an ungraded section has no final total.
 *   * Money-style rounding: all arithmetic happens in integer hundredths, so
 *     0.1 + 0.2 never becomes 0.30000000000000004 on a student's report.
 */
import type { McQuestion, Rubric } from './rubric';

export type SectionStatus =
  | 'not-applicable'
  | 'pending'
  | 'processing'
  | 'needs-review'
  | 'confirmed'
  | 'failed';

export type McAnswer = {
  questionNo: number;
  picked: string | null;
  confidence?: number | null;
  flags?: string[];
};

export type CriterionScore = {
  questionNo: number;
  criterionKey: string;
  maxPoints: number;
  aiPoints: number | null;
  finalPoints: number | null;
};

export type McOutcome = {
  questionNo: number;
  picked: string | null;
  correct: boolean;
  points: number;
  flags: string[];
};

// ------------------------------------------------------------- hundredths

/** Converts a mark to integer hundredths. */
export function toHundredths(value: number): number {
  return Math.round(value * 100);
}

/** Converts integer hundredths back to a mark. */
export function fromHundredths(value: number): number {
  return Math.round(value) / 100;
}

function clampHundredths(value: number, max: number): number {
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
}

// -------------------------------------------------------- multiple choice

function mcQuestions(rubric: Rubric): McQuestion[] {
  return rubric.questions.filter((question): question is McQuestion => question.type === 'mc');
}

function mergeFlags(existing: string[] | undefined, added: string[]): string[] {
  const out = [...(existing ?? [])];
  for (const flag of added) if (!out.includes(flag)) out.push(flag);
  return out;
}

/**
 * Marks the multiple-choice section.
 *
 * A blank answer and a double mark both score zero, but they carry different
 * flags so the review screen can tell an omission from a mistake.
 */
export function scoreMultipleChoice(
  rubric: Rubric,
  answers: McAnswer[],
): { outcomes: McOutcome[]; points: number } {
  const byQuestion = new Map<number, McAnswer>();
  for (const answer of answers) byQuestion.set(answer.questionNo, answer);

  const outcomes: McOutcome[] = [];
  let total = 0;

  for (const question of mcQuestions(rubric)) {
    const answer = byQuestion.get(question.no);
    const raw = (answer?.picked ?? '').trim().toUpperCase();

    if (!raw) {
      outcomes.push({
        questionNo: question.no,
        picked: null,
        correct: false,
        points: 0,
        flags: mergeFlags(answer?.flags, ['blank']),
      });
      continue;
    }

    if (!/^[A-D]$/.test(raw)) {
      // Two bubbles filled, or something the reader could not resolve.
      outcomes.push({
        questionNo: question.no,
        picked: raw,
        correct: false,
        points: 0,
        flags: mergeFlags(answer?.flags, ['double-mark']),
      });
      continue;
    }

    const correct = raw === question.answer;
    if (correct) total += toHundredths(question.points);
    outcomes.push({
      questionNo: question.no,
      picked: raw,
      correct,
      points: correct ? question.points : 0,
      flags: answer?.flags ?? [],
    });
  }

  return { outcomes, points: fromHundredths(total) };
}

// -------------------------------------------------------------- sections

export type ScoreInput = {
  rubric: Rubric;
  mcAnswers: McAnswer[];
  criteria: CriterionScore[];
  mcStatus: SectionStatus;
  essayStatus: SectionStatus;
};

export type ScoreResult = {
  mc: number | null;
  essay: number | null;
  total: number | null;
  /** True when the total is a projection rather than a final mark. */
  draft: boolean;
  /** Vietnamese reasons the total is not final, for the teacher. */
  missing: string[];
};

/** A section can only be computed once its grading run has produced results. */
function hasResults(status: SectionStatus): boolean {
  return status === 'needs-review' || status === 'confirmed';
}

export function computeSectionScores(input: ScoreInput): ScoreResult {
  const { rubric, mcAnswers, criteria, mcStatus, essayStatus } = input;
  const missing: string[] = [];

  const mcList = mcQuestions(rubric);
  // The pass mark is half of THIS paper's total, not a fixed 5: a 3-point quiz
  // would otherwise report the whole class as failing.
  const passMark = rubric.totalPoints / 2;
  const essayList = rubric.questions.filter((question) => question.type === 'essay');

  // ---- multiple choice
  let mc: number | null = null;
  if (mcList.length > 0) {
    if (hasResults(mcStatus) && mcList.every(q => mcAnswers.some(a => a.questionNo === q.no))) {
      mc = scoreMultipleChoice(rubric, mcAnswers).points;
    } else {
      missing.push('Chưa chấm xong phần trắc nghiệm');
    }
  }

  // ---- essay
  let essay: number | null = null;
  if (essayList.length > 0) {
    if (!hasResults(essayStatus)) {
      missing.push('Chưa chấm xong phần tự luận');
    } else {
      const byKey = new Map<string, CriterionScore>();
      for (const row of criteria) byKey.set(`${row.questionNo}:${row.criterionKey}`, row);

      let sum = 0;
      let complete = true;

      for (const question of essayList) {
        const questionMax = toHundredths(question.points);
        let questionSum = 0;

        for (const step of question.steps) {
          const row = byKey.get(`${question.no}:${step.key}`);
          const awarded = row?.finalPoints ?? row?.aiPoints ?? null;
          if (awarded === null || !Number.isFinite(awarded)) {
            complete = false;
            break;
          }
          questionSum += clampHundredths(toHundredths(awarded), toHundredths(step.points));
        }

        if (!complete) break;
        sum += clampHundredths(questionSum, questionMax);
      }

      if (complete) {
        essay = fromHundredths(sum);
      } else {
        missing.push('Còn ý tự luận chưa có điểm');
      }
    }
  }

  // ---- total
  // `not-applicable` wins over the rubric's contents: a teacher may grade only
  // the essay half of a mixed exam, and that must not block the total.
  const mcApplicable = mcList.length > 0 && mcStatus !== 'not-applicable';
  const essayApplicable = essayList.length > 0 && essayStatus !== 'not-applicable';
  const mcDone = !mcApplicable || mc !== null;
  const essayDone = !essayApplicable || essay !== null;

  let total: number | null = null;
  if (mcDone && essayDone) {
    total = fromHundredths(toHundredths(mc ?? 0) + toHundredths(essay ?? 0));
  }

  // A section the teacher has not confirmed yet keeps the mark provisional.
  const unconfirmed =
    (mcApplicable && mcStatus === 'needs-review') ||
    (essayApplicable && essayStatus === 'needs-review');

  return { mc, essay, total, draft: total === null || unconfirmed, missing };
}

// ------------------------------------------------------------------ CSV

export type CsvStudent = {
  code?: string | null;
  name: string;
  mc?: number | null;
  essay?: number | null;
  total?: number | null;
  status: string;
  note?: string | null;
};

/** Vietnamese marks use a decimal comma, so the file uses semicolons. */
function formatMark(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return value.toFixed(2).replace('.', ',');
}

function quoteField(value: string): string {
  if (!/[;"\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Builds a CSV that Excel opens correctly: a UTF-8 BOM for Vietnamese
 * diacritics, semicolon separators and comma decimals.
 */
export function toCsv(students: CsvStudent[], options: { includeSections?: boolean } = {}): string {
  const includeSections = options.includeSections !== false;

  const header = includeSections
    ? ['Mã HS', 'Họ tên', 'Trắc nghiệm', 'Tự luận', 'Tổng', 'Trạng thái', 'Ghi chú']
    : ['Mã HS', 'Họ tên', 'Tổng', 'Trạng thái', 'Ghi chú'];

  const lines = [header.join(';')];

  for (const student of students) {
    const cells = includeSections
      ? [
          student.code ?? '',
          student.name,
          formatMark(student.mc),
          formatMark(student.essay),
          formatMark(student.total),
          student.status,
          student.note ?? '',
        ]
      : [
          student.code ?? '',
          student.name,
          formatMark(student.total),
          student.status,
          student.note ?? '',
        ];
    lines.push(cells.map((cell) => quoteField(String(cell))).join(';'));
  }

  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

// ------------------------------------------------------------ statistics

export type ScoreStatistics = {
  count: number;
  average: number | null;
  median: number | null;
  highest: number | null;
  lowest: number | null;
  /** Index 0 is [0,1), index 9 is [9,10]. */
  distribution: number[];
  belowAverageCount: number;
  perQuestion: Array<{ questionNo: number; correctRate: number; answered: number; blank: number }>;
  distractors: Array<{ questionNo: number; counts: Record<string, number> }>;
};

/**
 * Class-level statistics. Papers without a final total are excluded from the
 * averages but still counted in the per-question analysis, because a
 * half-graded paper still tells you which question the class found hard.
 */
export function scoreStatistics(
  rubric: Rubric,
  submissions: Array<{ mcAnswers: McAnswer[]; total: number | null }>,
): ScoreStatistics {
  const totals = submissions
    .map((submission) => submission.total)
    .filter((value): value is number => typeof value === 'number')
    .sort((a, b) => a - b);

  const count = totals.length;
  const distribution = new Array(10).fill(0);
  for (const total of totals) {
    const bucket = Math.min(9, Math.max(0, Math.floor(total)));
    distribution[bucket] += 1;
  }

  const average =
    count === 0
      ? null
      : fromHundredths(totals.reduce((sum, value) => sum + toHundredths(value), 0) / count);

  const median =
    count === 0
      ? null
      : count % 2 === 1
        ? totals[(count - 1) / 2]
        : fromHundredths((toHundredths(totals[count / 2 - 1]) + toHundredths(totals[count / 2])) / 2);

  const mcList = mcQuestions(rubric);
  // The pass mark is half of THIS paper's total, not a fixed 5: a 3-point quiz
  // would otherwise report the whole class as failing.
  const passMark = rubric.totalPoints / 2;

  const perQuestion = mcList.map((question) => {
    let correct = 0;
    let answered = 0;
    let blank = 0;

    for (const submission of submissions) {
      const answer = submission.mcAnswers.find((row) => row.questionNo === question.no);
      const picked = (answer?.picked ?? '').trim().toUpperCase();
      if (!picked) {
        blank += 1;
        continue;
      }
      answered += 1;
      if (picked === question.answer) correct += 1;
    }

    const attempts = answered + blank;
    return {
      questionNo: question.no,
      correctRate: attempts === 0 ? 0 : correct / attempts,
      answered,
      blank,
    };
  });

  const distractors = mcList.map((question) => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, '—': 0 };
    for (const submission of submissions) {
      const answer = submission.mcAnswers.find((row) => row.questionNo === question.no);
      const picked = (answer?.picked ?? '').trim().toUpperCase();
      if (/^[A-D]$/.test(picked)) counts[picked] += 1;
      else counts['—'] += 1;
    }
    return { questionNo: question.no, counts };
  });

  return {
    count,
    average,
    median,
    highest: count === 0 ? null : totals[count - 1],
    lowest: count === 0 ? null : totals[0],
    distribution,
    belowAverageCount: totals.filter((value) => value < passMark).length,
    perQuestion,
    distractors,
  };
}
