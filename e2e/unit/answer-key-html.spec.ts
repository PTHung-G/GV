import { expect, test } from '@playwright/test';
import { parseAnswerKeyHtml } from '@/lib/grading/answer-key-html';

const TABLE_KEY = `<h1>HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM</h1>
<table><thead><tr><th>Câu</th><th>Đáp án</th><th>Điểm</th></tr></thead><tbody>
<tr><td>1</td><td><b>A</b></td><td>0,5</td></tr>
<tr><td>2</td><td><b>B</b></td><td>0,5</td></tr>
<tr><td>3</td><td><b>C</b></td><td>0,5</td></tr>
</tbody></table>`;

test('a key kept as a table becomes questions with their points', () => {
  const questions = parseAnswerKeyHtml(TABLE_KEY);
  expect(questions).toHaveLength(3);
  expect(questions[0]).toMatchObject({ label: 'Câu 1', answer: 'A', points: '0,5' });
  expect(questions[2]).toMatchObject({ label: 'Câu 3', answer: 'C' });
});

test('the header row is not read as a question', () => {
  const questions = parseAnswerKeyHtml(TABLE_KEY);
  expect(questions.map((question) => question.label)).toEqual(['Câu 1', 'Câu 2', 'Câu 3']);
});

test('a key written as plain lines is read too', () => {
  const questions = parseAnswerKeyHtml('<p>Câu 1: A</p><p>Câu 2. B</p><p>Câu 3) D</p>');
  expect(questions.map((question) => `${question.answer}`)).toEqual(['A', 'B', 'D']);
});

test('a row without a letter is left for the teacher to fill in', () => {
  const questions = parseAnswerKeyHtml(
    '<table><tr><td>1</td><td>A</td><td>0,5</td></tr><tr><td>2</td><td>Tự luận</td><td>2,0</td></tr></table>',
  );
  expect(questions).toHaveLength(1);
  expect(questions[0].label).toContain('1');
});

test('the same question number twice is only taken once', () => {
  const questions = parseAnswerKeyHtml(
    '<table><tr><td>1</td><td>A</td><td>0,5</td></tr><tr><td>1</td><td>B</td><td>0,5</td></tr></table>',
  );
  expect(questions).toHaveLength(1);
  expect(questions[0].answer).toBe('A');
});

test('a page with no answers yields nothing rather than guesses', () => {
  expect(parseAnswerKeyHtml('<h1>ĐỀ KIỂM TRA</h1><p>Câu 1. Căn bậc hai của 16 là</p>')).toEqual([]);
});
