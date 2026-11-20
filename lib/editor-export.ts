import type { AnswerKeyQuestion } from './grading/rubric';
import { examContentHash } from './exam-revision';
import { PRINT_SHARED_CSS, sanitizeExamHtml } from './html-sanitize';
import { escapeHtml } from './math';

export type ExportSnapshot = {
  sourceExamId?: string;
  title: string;
  content: string;
  subject?: string;
  capturedAt?: string;
  answerKey?: { content: string; sourceContentHash?: string; answerKeyQuestions?: AnswerKeyQuestion[] };
};

export function exportKeyStatus(snapshot: ExportSnapshot): 'missing' | 'unverified' | 'stale' | 'current' {
  if (!snapshot.answerKey) return 'missing';
  if (!snapshot.answerKey.sourceContentHash) return 'unverified';
  return snapshot.answerKey.sourceContentHash === examContentHash(snapshot.content) ? 'current' : 'stale';
}

/** Only single A–D answers are recognized: true/false and essays must never become MC silently. */
export function exportMcNumbers(questions: AnswerKeyQuestion[]): number[] {
  const numbers = questions.flatMap((q, index) => {
    if (q.type === 'essay' || q.steps?.length || !/^[A-D]$/i.test(q.answer.trim())) return [];
    return [Number(/\d+/.exec(q.label)?.[0] ?? index + 1)];
  });
  if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 999) || new Set(numbers).size !== numbers.length) return [];
  return numbers;
}

/** Strict isomorphic allowlist: no scripts, event handlers, frames, active URLs or raw CSS. */
export function safeExportHtml(content: string): string {
  const origin = typeof location !== 'undefined' ? location.origin : undefined;
  return sanitizeExamHtml(content, { origin });
}

export function exportPrintHtml(title: string, content: string): string {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
${PRINT_SHARED_CSS}
</style></head><body>${safeExportHtml(content)}</body></html>`;
}
