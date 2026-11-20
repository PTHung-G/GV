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
import {
  formatTfStatements,
  normalizeShortValue,
  type McQuestion,
  type Rubric,
  type ShortQuestion,
  type TfQuestion,
} from './rubric';

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

export type ObjectiveQuestion = McQuestion | TfQuestion | ShortQuestion;

function objectiveQuestions(rubric: Rubric): ObjectiveQuestion[] {
  return rubric.questions.filter(
    (question): question is ObjectiveQuestion =>
      question.type === 'mc' || question.type === 'tf' || question.type === 'short',
  );
}

function mcQuestions(rubric: Rubric): McQuestion[] {
  return rubric.questions.filter((question): question is McQuestion => question.type === 'mc');
}

function mergeFlags(existing: string[] | undefined, added: string[]): string[] {
  const out = [...(existing ?? [])];
  for (const flag of added) if (!out.includes(flag)) out.push(flag);
  return out;
}

const MOET_2025_TF_RATIOS = [0, 0.1, 0.25, 0.5, 1] as const;

export function scoreTfQuestion(
  question: TfQuestion,
  rawPicked: string | null,
  existingFlags?: string[],
): McOutcome {
  const cleaned = (rawPicked ?? '').trim().toUpperCase().replace(/[^ĐDSTF?!_]/g, '');
  if (!cleaned) {
    return {
      questionNo: question.no,
      picked: null,
      correct: false,
      points: 0,
      flags: mergeFlags(existingFlags, ['blank']),
    };
  }

  const expected = [
    question.statements.a,
    question.statements.b,
    question.statements.c,
    question.statements.d,
  ];
  let correctCount = 0;
  let blankCount = 0;
  let hasDouble = false;

  for (let i = 0; i < 4; i += 1) {
    const ch = cleaned[i] ?? '?';
    if (ch === '!') {
      hasDouble = true;
    } else if (ch === '?' || ch === '_') {
      blankCount += 1;
    } else if ((ch === 'Đ' || ch === 'D' || ch === 'T') && expected[i] === true) {
      correctCount += 1;
    } else if ((ch === 'S' || ch === 'F') && expected[i] === false) {
      correctCount += 1;
    }
  }

  const flagsToAdd: string[] = [];
  if (blankCount === 4 && !hasDouble) flagsToAdd.push('blank');
  else if (hasDouble) flagsToAdd.push('double-mark');
  else if (blankCount > 0) flagsToAdd.push('partial-blank');

  const ratio =
    question.scoringRule === 'equal' ? correctCount / 4 : MOET_2025_TF_RATIOS[correctCount];
  const points =
    blankCount === 4 && !hasDouble
      ? 0
      : fromHundredths(Math.round(toHundredths(question.points) * ratio));

  return {
    questionNo: question.no,
    picked: cleaned.slice(0, 4).padEnd(4, '?'),
    correct: correctCount === 4 && !hasDouble && blankCount === 0,
    points,
    flags: mergeFlags(existingFlags, flagsToAdd),
  };
}

export function scoreShortQuestion(
  question: ShortQuestion,
  rawPicked: string | null,
  existingFlags?: string[],
): McOutcome {
  const normalized = normalizeShortValue(rawPicked ?? '');
  if (!normalized) {
    return {
      questionNo: question.no,
      picked: null,
      correct: false,
      points: 0,
      flags: mergeFlags(existingFlags, ['blank']),
    };
  }
  if ((rawPicked ?? '').includes('!')) {
    return {
      questionNo: question.no,
      picked: rawPicked,
      correct: false,
      points: 0,
      flags: mergeFlags(existingFlags, ['double-mark']),
    };
  }
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])].map(normalizeShortValue);
  const correct = accepted.includes(normalized);
  return {
    questionNo: question.no,
    picked: normalized,
    correct,
    points: correct ? question.points : 0,
    flags: existingFlags ?? [],
  };
}

/**
 * Normalizes and evaluates a single objective answer for storage in `mc_answers`.
 */
export function evaluateObjectiveAnswer(
  question: ObjectiveQuestion,
  rawPicked: string | null | undefined,
  existingFlags?: string[],
): { picked: string | null; flags: string[]; uncertain: boolean } {
  const flags = new Set<string>(existingFlags ?? []);
  const raw =
    rawPicked === null || rawPicked === undefined ? '' : String(rawPicked).trim();
  let picked: string | null = raw ? raw : null;

  if (picked === null) {
    flags.add('blank');
  } else if (question.type === 'mc') {
    picked = picked.toUpperCase();
    if (!/^[A-D]$/.test(picked)) flags.add('double-mark');
    else if (picked !== question.answer) flags.add('incorrect');
  } else if (question.type === 'tf') {
    picked = picked.toUpperCase().replace(/[^ĐDSTF?!]/g, '');
    if (!picked) {
      picked = null;
      flags.add('blank');
    } else if (picked.includes('!')) {
      flags.add('double-mark');
    } else if (picked.includes('?') || picked.length < 4) {
      picked = picked.slice(0, 4);
      flags.add('low-confidence');
    } else {
      const outcome = scoreTfQuestion(question, picked);
      picked = outcome.picked;
      if (!outcome.correct) flags.add('incorrect');
    }
  } else {
    if (picked.includes('!') || picked.includes('?')) {
      flags.add(picked.includes('!') ? 'double-mark' : 'low-confidence');
    } else {
      picked = normalizeShortValue(picked);
      if (!picked) {
        picked = null;
        flags.add('blank');
      } else {
        const outcome = scoreShortQuestion(question, picked);
        if (!outcome.correct) flags.add('incorrect');
      }
    }
  }

  const flagList = [...flags];
  return {
    picked,
    flags: flagList,
    uncertain: flagList.some((flag) => flag !== 'incorrect'),
  };
}

/**
 * Marks all auto-graded objective questions (MC A-D, GDPT 2018 True/False, Short Answer).
 */
export function scoreMultipleChoice(
  rubric: Rubric,
  answers: McAnswer[],
): { outcomes: McOutcome[]; points: number } {
  const byQuestion = new Map<number, McAnswer>();
  for (const answer of answers) byQuestion.set(answer.questionNo, answer);

  const outcomes: McOutcome[] = [];
  let total = 0;

  for (const question of objectiveQuestions(rubric)) {
    const answer = byQuestion.get(question.no);

    if (question.type === 'tf') {
      const outcome = scoreTfQuestion(question, answer?.picked ?? null, answer?.flags);
      total += toHundredths(outcome.points);
      outcomes.push(outcome);
      continue;
    }

    if (question.type === 'short') {
      const outcome = scoreShortQuestion(question, answer?.picked ?? null, answer?.flags);
      total += toHundredths(outcome.points);
      outcomes.push(outcome);
      continue;
    }

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

  const mcList = objectiveQuestions(rubric);
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

  const objList = objectiveQuestions(rubric);
  const mcList = mcQuestions(rubric);
  // The pass mark is half of THIS paper's total, not a fixed 5: a 3-point quiz
  // would otherwise report the whole class as failing.
  const passMark = rubric.totalPoints / 2;

  const perQuestion = objList.map((question) => {
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
      if (question.type === 'mc' && picked === question.answer) correct += 1;
      else if (question.type === 'tf' && picked === formatTfStatements(question.statements)) correct += 1;
      else if (
        question.type === 'short' &&
        [question.answer, ...(question.acceptedAnswers ?? [])]
          .map(normalizeShortValue)
          .includes(normalizeShortValue(picked))
      ) {
        correct += 1;
      }
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
