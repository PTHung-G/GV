/**
 * Rubric — the marking scheme the whole grading feature depends on.
 *
 * A rubric is frozen into the session snapshot, so every score can be traced
 * back to the exact wording and point split that produced it. Everything that
 * enters the database goes through `normalizeRubric`, which rejects nonsense
 * instead of silently scoring against a broken scheme.
 *
 * This module is intentionally free of server imports so it can be unit tested
 * and reused in the browser; `RubricError` carries the status/code shape the
 * HTTP layer already understands.
 */

export class RubricError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, code = 'invalid_rubric', status = 400) {
    super(message);
    this.name = 'RubricError';
    this.code = code;
    this.status = status;
  }
}

export type McLetter = 'A' | 'B' | 'C' | 'D';

export type McQuestion = {
  no: number;
  type: 'mc';
  points: number;
  answer: McLetter;
  label?: string;
};

export type EssayStep = {
  /** Stable key so a score row keeps pointing at the same step after edits. */
  key: string;
  text: string;
  points: number;
};

export type EssayQuestion = {
  no: number;
  type: 'essay';
  points: number;
  steps: EssayStep[];
  label?: string;
  /** Final answer, shown to the teacher while reviewing. */
  answer?: string;
};

export type RubricQuestion = McQuestion | EssayQuestion;

export type Rubric = {
  version: 1;
  totalPoints: number;
  questions: RubricQuestion[];
};

export type RubricMode = 'mc-only' | 'essay-only' | 'mixed';

const MC_LETTERS: McLetter[] = ['A', 'B', 'C', 'D'];
const EPSILON = 0.005;

/**
 * Vietnamese answer keys write decimals with a comma ("2,0"); models sometimes
 * emit a dot. Accept both plus plain numbers.
 */
export function parsePoints(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function rubricTotals(rubric: Rubric): {
  total: number;
  mc: number;
  essay: number;
  mcCount: number;
  essayCount: number;
} {
  let mc = 0;
  let essay = 0;
  let mcCount = 0;
  let essayCount = 0;
  for (const question of rubric.questions) {
    if (question.type === 'mc') {
      mc += question.points;
      mcCount += 1;
    } else {
      essay += question.points;
      essayCount += 1;
    }
  }
  return {
    total: round2(mc + essay),
    mc: round2(mc),
    essay: round2(essay),
    mcCount,
    essayCount,
  };
}

export function rubricMode(rubric: Rubric): RubricMode {
  const { mcCount, essayCount } = rubricTotals(rubric);
  if (mcCount > 0 && essayCount > 0) return 'mixed';
  return mcCount > 0 ? 'mc-only' : 'essay-only';
}

function fail(message: string): never {
  throw new RubricError(message);
}

/**
 * Validates and normalises an untrusted rubric.
 *
 * Rejects: empty rubrics, duplicate question numbers, non-positive points, a
 * missing or malformed multiple-choice answer, an essay question without any
 * step, and steps that do not add up to the question total.
 */
export function normalizeRubric(input: unknown, expectedTotal?: number | null): Rubric {
  if (!input || typeof input !== 'object') fail('Thiếu bảng đáp án và thang điểm.');
  const raw = input as { questions?: unknown };
  if (!Array.isArray(raw.questions) || raw.questions.length === 0) {
    fail('Bảng đáp án phải có ít nhất một câu.');
  }

  const seen = new Set<number>();
  const questions: RubricQuestion[] = [];

  raw.questions.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') fail(`Câu thứ ${index + 1} không hợp lệ.`);
    const item = entry as Record<string, unknown>;

    const no = Number(item.no);
    if (!Number.isInteger(no) || no <= 0) fail(`Câu thứ ${index + 1} thiếu số câu hợp lệ.`);
    if (seen.has(no)) fail(`Câu ${no} bị lặp trong bảng đáp án.`);
    seen.add(no);

    const points = parsePoints(item.points);
    if (points === null || points <= 0) fail(`Câu ${no} chưa có điểm hợp lệ.`);

    const label = typeof item.label === 'string' && item.label.trim() ? item.label.trim() : undefined;
    const type = item.type === 'essay' ? 'essay' : item.type === 'mc' ? 'mc' : null;

    if (type === 'mc') {
      const answer = String(item.answer ?? '').trim().toUpperCase();
      if (!MC_LETTERS.includes(answer as McLetter)) {
        fail(`Câu ${no} là trắc nghiệm nên đáp án phải là A, B, C hoặc D.`);
      }
      questions.push({ no, type: 'mc', points: round2(points), answer: answer as McLetter, label });
      return;
    }

    if (type === 'essay') {
      const rawSteps = Array.isArray(item.steps) ? item.steps : [];
      if (rawSteps.length === 0) {
        fail(`Câu ${no} là tự luận nhưng chưa có các bước chấm điểm.`);
      }
      const stepKeys = new Set<string>();
      const steps: EssayStep[] = rawSteps.map((stepEntry, stepIndex) => {
        if (!stepEntry || typeof stepEntry !== 'object') {
          fail(`Bước ${stepIndex + 1} của câu ${no} không hợp lệ.`);
        }
        const step = stepEntry as Record<string, unknown>;
        const text = String(step.text ?? '').trim();
        if (!text) fail(`Bước ${stepIndex + 1} của câu ${no} thiếu nội dung.`);
        const stepPoints = parsePoints(step.points);
        if (stepPoints === null || stepPoints <= 0) {
          fail(`Bước ${stepIndex + 1} của câu ${no} chưa có điểm hợp lệ.`);
        }
        const key = typeof step.key === 'string' && step.key.trim() ? step.key.trim() : `s${stepIndex + 1}`;
        if (stepKeys.has(key)) fail(`Câu ${no}: mã ý chấm ${key} bị lặp.`);
        stepKeys.add(key);
        return { key, text, points: round2(stepPoints) };
      });

      const stepSum = round2(steps.reduce((sum, step) => sum + step.points, 0));
      if (Math.abs(stepSum - round2(points)) > EPSILON) {
        fail(
          `Câu ${no}: tổng điểm các bước là ${stepSum} nhưng điểm của câu là ${round2(points)}.`,
        );
      }

      const answer = typeof item.answer === 'string' && item.answer.trim() ? item.answer.trim() : undefined;
      questions.push({ no, type: 'essay', points: round2(points), steps, label, answer });
      return;
    }

    fail(`Câu ${no} chưa xác định là trắc nghiệm hay tự luận.`);
  });

  questions.sort((a, b) => a.no - b.no);
  const total = round2(questions.reduce((sum, question) => sum + question.points, 0));

  if (typeof expectedTotal === 'number' && (!Number.isFinite(expectedTotal) || expectedTotal <= 0 || Math.abs(total - expectedTotal) > EPSILON)) {
    fail(`Tổng điểm toàn bài là ${total} nhưng hệ thống đang chờ ${expectedTotal}.`);
  }

  return { version: 1, totalPoints: total, questions };
}

/** Rebuilds a stored rubric, so a bad row surfaces as an error, not as bad scores. */
export function rubricFromStored(payload: unknown): Rubric {
  return normalizeRubric(payload);
}

// ------------------------------------------------------- adapter from the key

export const ANSWER_KEY_VERSION = 1 as const;
export type AnswerKeyContract = { version: 1; questions: AnswerKeyQuestion[]; sourceContentHash: string };
export type AnswerKeyStep = { text: string; points?: string };
export type AnswerKeyQuestion = {
  type?: 'mc' | 'essay';
  label: string;
  answer: string;
  points?: string;
  steps?: AnswerKeyStep[];
};

function questionNumber(label: string, fallback: number): number {
  const match = /(\d+)/.exec(label);
  if (match) {
    const parsed = Number(match[1]);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }
  return fallback;
}

/**
 * Converts the answer-key endpoint's shape into a rubric.
 *
 * Multiple choice is recognised by "no steps and a single A–D letter"; anything
 * else is treated as an essay with its step breakdown. Questions without a
 * usable point value are reported together so the teacher can fill them in one
 * pass instead of fixing them one at a time.
 */
export function rubricFromAnswerKey(
  questions: AnswerKeyQuestion[],
  options: { fallbackPoints?: number; expectedTotal?: number | null } = {},
): Rubric {
  const missing: number[] = [];

  const draft = questions.map((question, index) => {
    const no = questionNumber(question.label, index + 1);
    const steps = (question.steps ?? []).filter((step) => step.text?.trim());
    const answer = String(question.answer ?? '').trim();
    const isMc = question.type !== 'essay' && steps.length === 0 && /^[A-Da-d]$/.test(answer);

    let points = parsePoints(question.points);
    if (points === null && options.fallbackPoints && options.fallbackPoints > 0) {
      points = options.fallbackPoints;
    }
    if (points === null || points <= 0) {
      missing.push(no);
      points = 0;
    }

    if (isMc) {
      return {
        no,
        type: 'mc' as const,
        points,
        answer: answer.toUpperCase() as McLetter,
        label: question.label,
      };
    }

    // Missing or inconsistent criteria must be reviewed, never evenly invented.
    const stepPoints = steps.map((step) => parsePoints(step.points) ?? 0);

    return {
      no,
      type: 'essay' as const,
      points,
      label: question.label,
      answer: answer || undefined,
      steps: steps.map((step, stepIndex) => ({
        key: `s${stepIndex + 1}`,
        text: step.text.trim(),
        points: stepPoints[stepIndex] ?? 0,
      })),
    };
  });

  if (missing.length > 0) {
    throw new RubricError(
      `Các câu sau chưa có điểm: ${missing.join(', ')}. Hãy nhập điểm rồi xác nhận lại.`,
      'missing_points',
    );
  }

  return normalizeRubric({ questions: draft }, options.expectedTotal ?? null);
}
