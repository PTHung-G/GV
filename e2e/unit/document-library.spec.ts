import { test, expect } from '@playwright/test';
import { duplicateDocumentPair, mergeImportedDocuments, removeDocumentPair, validateDocuments } from '../../lib/document-library';
import type { ExamDoc } from '../../lib/docs-store';

const exam: ExamDoc = { id: 'exam', title: 'Đề', content: '<p>Câu 1</p>', subject: 'toan', grade: 9, createdAt: '2026-01-01', updatedAt: '2026-01-01' };
const key: ExamDoc = { ...exam, id: 'key', kind: 'answer-key', parentId: 'exam' };

test('duplicate copies an exam with its answer key and remaps parent', () => {
  let next = 0;
  const result = duplicateDocumentPair([exam, key], exam.id, () => `copy-${++next}`, 'now');
  expect(result.id).toBe('copy-1');
  expect(result.docs).toHaveLength(4);
  expect(result.docs[1].parentId).toBe('copy-1');
  expect(result.docs[1].id).toBe('copy-2');
  expect(result.docs[3]).toEqual(key);
});
test('deleting an exam removes its hidden keys but not unrelated exams', () => {
  expect(removeDocumentPair([exam, key, { ...exam, id: 'other' }], 'exam').map((doc) => doc.id)).toEqual(['other']);
});
test('legacy import is idempotent and does not overwrite server documents', () => {
  const imported = mergeImportedDocuments([exam], [{ ...exam, title: 'Old' }, key]);
  expect(imported).toEqual([exam, key]);
  expect(mergeImportedDocuments(imported, [exam, key])).toEqual(imported);
});
test('rejects duplicate IDs and invalid document structures', () => {
  expect(() => validateDocuments([exam, exam])).toThrow();
  expect(() => validateDocuments([{ ...exam, grade: 13 }])).toThrow();
  expect(validateDocuments([exam, key])).toEqual([exam, key]);
  for (const metadata of [
    { answerKeyQuestions: {} }, { answerKeyQuestions: [null] },
    { answerKeyQuestions: [{ label: 'Câu 1', answer: 'A', steps: [null] }] },
    { sourceContentHash: {} }, { contentStatus: 'ready' },
  ]) expect(() => validateDocuments([{ ...key, ...metadata }])).toThrow();
  expect(validateDocuments([{ ...key, answerKeyQuestions: [{ label: 'Câu 1', answer: 'A', points: '1' }] }])).toHaveLength(1);
  expect(
    validateDocuments([
      {
        ...key,
        answerKeyQuestions: [
          { label: 'Câu 1', type: 'mc', answer: 'A', points: '0,5', sectionNo: 1, displayNo: 1 },
          { label: 'Câu 1', type: 'tf', answer: 'ĐSĐS', points: '1,0', sectionNo: 2, displayNo: 1, scoringRule: 'moet-2025' },
          { label: 'Câu 1', type: 'short', answer: '-2,5', points: '1,0', sectionNo: 3, displayNo: 1 },
        ],
      },
    ]),
  ).toHaveLength(1);
});
