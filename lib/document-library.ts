import type { ExamDoc } from './docs-store';
import { reconcileStructure, validateStructure } from './structured-exam';

/** Remove an exam and its private answer-key sheets as one aggregate. */
export function removeDocumentPair(docs: ExamDoc[], id: string): ExamDoc[] {
  return docs.filter((doc) => doc.id !== id && doc.parentId !== id);
}

export function duplicateDocumentPair(docs: ExamDoc[], id: string, newId: () => string, now: string): { docs: ExamDoc[]; id: string | null } {
  const source = docs.find((doc) => doc.id === id);
  if (!source) return { docs, id: null };
  const copyId = newId();
  const copy = { ...source, id: copyId, title: `${source.title} (bản sao)`, createdAt: now, updatedAt: now };
  const keys = source.kind === 'answer-key' ? [] : docs.filter((doc) => doc.parentId === id).map((doc) => ({
    ...doc, id: newId(), parentId: copyId, createdAt: now, updatedAt: now,
  }));
  return { docs: [copy, ...keys, ...docs], id: copyId };
}

/** Legacy import preserves server documents on ID conflicts and is idempotent. */
export function mergeImportedDocuments(current: ExamDoc[], imported: ExamDoc[]): ExamDoc[] {
  const known = new Set(current.map((doc) => doc.id));
  return [...current, ...imported.filter((doc) => !known.has(doc.id))];
}

function validKeyQuestion(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  if (typeof item.label !== 'string' || typeof item.answer !== 'string'
    || (item.type !== undefined && item.type !== 'mc' && item.type !== 'essay')
    || (item.points !== undefined && typeof item.points !== 'string')) return false;
  if (item.steps !== undefined) {
    if (!Array.isArray(item.steps) || item.steps.length > 2000) return false;
    return item.steps.every((step: unknown) => {
      if (!step || typeof step !== 'object' || Array.isArray(step)) return false;
      const criterion = step as Record<string, unknown>;
      return typeof criterion.text === 'string' && (criterion.points === undefined || typeof criterion.points === 'string');
    });
  }
  return true;
}

export function validateDocuments(value: unknown, options: { strictStructure?: boolean } = { strictStructure: true }): ExamDoc[] {
  if (!Array.isArray(value) || value.length > 2000) throw new Error('Kho đề phải là danh sách tối đa 2.000 tài liệu.');
  const ids = new Set<string>();
  for (const doc of value) {
    if (!doc || typeof doc !== 'object' || typeof doc.id !== 'string' || !doc.id || doc.id.length > 200 || ids.has(doc.id)
      || typeof doc.title !== 'string' || doc.title.length > 1000 || typeof doc.content !== 'string' || doc.content.length > 2_000_000
      || typeof doc.subject !== 'string' || !(doc.grade === null || (Number.isInteger(doc.grade) && doc.grade >= 1 && doc.grade <= 12))
      || typeof doc.createdAt !== 'string' || typeof doc.updatedAt !== 'string'
      || (doc.kind !== undefined && !['exam', 'answer-key'].includes(doc.kind))
      || (doc.parentId !== undefined && typeof doc.parentId !== 'string')
      || (doc.sourceContentHash !== undefined && typeof doc.sourceContentHash !== 'string')
      || (doc.contentStatus !== undefined && !['complete', 'preview'].includes(doc.contentStatus))
      || (doc.answerKeyQuestions !== undefined && (!Array.isArray(doc.answerKeyQuestions) || doc.answerKeyQuestions.length > 2000 || doc.answerKeyQuestions.some((question: unknown) => !validKeyQuestion(question))))) {
      throw new Error('Tài liệu trong kho đề không hợp lệ hoặc trùng mã.');
    }
    ids.add(doc.id);
  }
  return (value as ExamDoc[]).map((doc) => {
    // Arbitrary imports/recovery must never lose usable HTML because old metadata
    // is damaged. API submissions can opt into strict schema/mapping rejection.
    if (doc.structure === undefined) return doc;
    if (options.strictStructure) validateStructure(doc.structure);
    const structure = reconcileStructure(doc.content, doc.structure) ?? undefined;
    if (options.strictStructure && !structure) throw new Error('Cấu trúc câu hỏi không khớp nội dung đề.');
    return { ...doc, structure };
  });
}
