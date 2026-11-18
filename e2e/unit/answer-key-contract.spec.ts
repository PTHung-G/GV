import { expect, test } from '@playwright/test';
import { renderAnswerKeyHtml } from '@/lib/grading/answer-key-render';
import { parseAnswerKeyHtml } from '@/lib/grading/answer-key-html';
import { normalizeRubric, rubricFromAnswerKey, type AnswerKeyQuestion } from '@/lib/grading/rubric';
import { examContentHash } from '@/lib/exam-revision';

const questions: AnswerKeyQuestion[] = [
  { label: 'Câu 1', answer: 'B', points: '1' },
  { label: 'Câu 2', answer: 'D' },
  { label: 'Câu 3', answer: '$x=2$', points: '2,0', steps: [{ text: 'Giải phương trình $x+1=3$', points: '1' }, { text: 'Kết luận $x=2$', points: '1' }] },
];

test('actual editor horizontal grid and multirow essay import without losing criteria or inventing points', async ({ page }) => {
  const html = await page.evaluate(({ source, questions }) => {
    const render = new Function(`return (${source})`)();
    return render(questions, document) as string;
  }, { source: renderAnswerKeyHtml.toString(), questions });
  expect(html).toContain('data-answer-grid');
  expect(html).toContain('data-rubric');
  const parsed = parseAnswerKeyHtml(html);
  expect(parsed).toHaveLength(3);
  expect(parsed[0]).toEqual(questions[0]);
  expect(parsed[1]).toEqual(questions[1]);
  expect(parsed[2]).toMatchObject({ label: 'Câu 3', type: 'essay', points: '2,0', steps: questions[2].steps });
  expect(() => rubricFromAnswerKey(parsed)).toThrow(/chưa có điểm/);
  const rubric = rubricFromAnswerKey(parsed.map(q => q.label === 'Câu 2' ? { ...q, points: '1' } : q), { expectedTotal: 4 });
  expect(rubric.totalPoints).toBe(4);
  expect(rubric.questions[2].type).toBe('essay');
});

test('rubric rejects duplicate criterion keys and inconsistent points rather than splitting silently', () => {
  expect(() => normalizeRubric({ questions: [{ no: 1, type: 'essay', points: 2, steps: [{ key: 's1', text: 'A', points: 1 }, { key: 's1', text: 'B', points: 1 }] }] })).toThrow(/bị lặp/);
  expect(() => rubricFromAnswerKey([{ label: 'Câu 1', answer: 'x', points: '2', steps: [{ text: 'A', points: '1' }] }])).toThrow(/tổng điểm/);
  expect(() => normalizeRubric({ questions: [{ no: 1, type: 'mc', points: 1, answer: 'A' }] }, 10)).toThrow(/đang chờ 10/);
});

test('content revision changes for any source change and is deterministic', () => {
  expect(examContentHash('<p>A</p>')).toBe(examContentHash('<p>A</p>'));
  expect(examContentHash('<p>A</p>')).not.toBe(examContentHash('<p>B</p>'));
});
