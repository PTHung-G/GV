import { expect, test } from '@playwright/test';

test('wizard binds AI result to selected source and requires explicit total/review', async ({ page }) => {
  await page.goto('/grading/new?examId=demo-trac-nghiem-20-toan-9');
  await page.getByRole('button', { name: 'Đề bên ngoài', exact: true }).click();
  await page.getByPlaceholder('Kiểm tra giữa kỳ I môn Toán 9').fill('Đề A');
  await page.getByPlaceholder('Dán nội dung đề, hoặc chụp ảnh đề ở trên để máy đọc giúp.').fill('Câu 1. A hay B?');
  await page.getByRole('button', { name: /Tiếp/ }).click();
  let release!: () => void;
  let requested!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const started = new Promise<void>(resolve => { requested = resolve; });
  await page.route('**/api/exam-answer-key', async route => {
    requested();
    await pending;
    await route.fulfill({ json: { codes: [{ questions: [{ label: 'Câu 1', answer: 'B', points: '1' }] }] } });
  });
  await page.getByRole('button', { name: /AI|Tạo đáp án/ }).last().click();
  await started;
  await page.getByRole('button', { name: /Quay lại/ }).click();
  await page.getByPlaceholder('Kiểm tra giữa kỳ I môn Toán 9').fill('Đề B');
  release();
  await page.getByRole('button', { name: /Tiếp/ }).click();
  await expect(page.getByText('Chưa có câu nào', { exact: false })).toBeVisible();
  await expect(page.getByLabel('Tổng điểm mong muốn')).toHaveValue('');
  await page.getByRole('button', { name: 'Câu trắc nghiệm', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tiếp tục', exact: true })).toBeDisabled();
});

test('unknown examId never invents a source', async ({ page }) => {
  await page.goto('/grading/new?examId=demo-de-trac-nghiem-20-toan-9');
  // Unknown or unavailable ids must leave the wizard requiring an actual selection.
  await expect(page.getByRole('heading', { name: 'Chọn đề thi', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tiếp tục', exact: true })).toBeDisabled();
});

test('valid examId preselects an available exam and imports its legacy warning', async ({ page }) => {
  await page.goto('/grading/new?examId=mau-de-toan-9-20-cau');
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(page.getByText('Barem cũ chỉ có HTML/chưa xác minh phiên bản.', { exact: false })).toBeVisible();
  await expect(page.getByLabel('Tổng điểm mong muốn')).toHaveValue('');
});
