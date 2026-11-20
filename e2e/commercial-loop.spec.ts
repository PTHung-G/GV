import { expect, test } from '@playwright/test';

test('commercial teacher loop: classes, 4-part sample exam, release gradebook & responsive pages', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  const email = `commercial-${crypto.randomUUID()}@example.test`;
  const reg = await page.request.post('/api/auth/register', {
    data: {
      name: 'Cô Minh Thư',
      email,
      password: 'TestFixture123!',
    },
  });
  expect(reg.ok(), await reg.text()).toBe(true);

  // 1. Create a class with student roster
  await page.goto('/classes');
  await expect(page.getByRole('button', { name: 'Tạo lớp mới' })).toBeVisible();
  await page.getByRole('button', { name: 'Tạo lớp mới' }).click();
  const createDialog = page.getByRole('dialog');
  await createDialog.getByPlaceholder('Ví dụ: 9A1').fill('12A1');
  await createDialog
    .getByPlaceholder(/09001 Nguyễn Văn An/)
    .fill('000001 Nguyễn Văn An\n000002 Trần Thị Bình');
  await createDialog.getByRole('button', { name: 'Tạo lớp', exact: true }).click();
  await expect(createDialog).toBeHidden({ timeout: 5_000 });
  await expect(page.getByText('Nguyễn Văn An')).toBeVisible();
  await expect(page.getByText('Trần Thị Bình')).toBeVisible();

  // 2. Copy the flagship 4-part THPT 2025 Toán 12 sample exam into editor
  await page.goto('/exams');
  await expect(page.getByText(/Đề thi thử TN THPT 2025 môn Toán 12/)).toBeVisible();
  await page.getByRole('link', { name: /Đề thi thử TN THPT 2025 môn Toán 12/ }).click();
  await page.getByRole('button', { name: /Sao về trình soạn/ }).click();
  await expect(page).toHaveURL(/\/doc\/[^/]+$/);
  await expect(page.getByText('Đã lưu vào tài khoản')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole('link', { name: /Đáp án/ })).toBeVisible();

  // 3. Open Release Dialog, select class 12A1, preview 101 & 102, and publish
  await page.getByRole('button', { name: 'Chốt đề & xuất PDF', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Các mã đề').fill('101, 102');
  const classSelect = dialog.getByLabel('Gắn lớp học');
  const optionVal = await classSelect.locator('option', { hasText: '12A1' }).getAttribute('value');
  expect(optionVal).toBeTruthy();
  await classSelect.selectOption(optionVal!);

  const sharedBox = dialog.getByRole('checkbox', { name: /Các đoạn trước câu đầu/ });
  if (await sharedBox.isVisible()) await sharedBox.check();

  await dialog.getByRole('button', { name: 'Tạo & kiểm tra các mã đề', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Mã 101', exact: true })).toBeVisible({ timeout: 10_000 });
  await expect(dialog.getByRole('button', { name: 'Mã 102', exact: true })).toBeVisible();

  await dialog.getByRole('checkbox', { name: /Tôi đã rà soát tất cả mã/ }).check();
  await dialog.getByRole('button', { name: 'Chốt bộ in & tạo đợt chấm' }).click();
  await expect(dialog.getByText(/Đã chốt bộ in:/)).toBeVisible({ timeout: 20_000 });
  await dialog.getByRole('link', { name: 'Mở bộ in & chụp chấm' }).click();
  await expect(page).toHaveURL(/\/exam-releases\/[^/]+$/);

  const releaseId = page.url().split('/').pop()!;
  await page.getByRole('button', { name: 'Bảng điểm toàn lớp' }).click();
  await expect(page.getByRole('heading', { name: 'Bảng điểm hợp nhất theo lớp' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Nguyễn Văn An' })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole('cell', { name: 'Trần Thị Bình' })).toBeVisible();

  const csvRes = await page.request.get(`/api/exam-releases/${releaseId}/gradebook?format=csv`);
  expect(csvRes.status()).toBe(200);
  const csvText = await csvRes.text();
  expect(csvText).toContain('Nguyễn Văn An');

  // 4. Verify Dashboard KPIs & Responsive layouts (390x844)
  await page.goto('/hub');
  await expect(page.getByText('Kho câu hỏi').first()).toBeVisible();
  await expect(page.getByText('Bộ mã đề & OMR')).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/exam-releases/${releaseId}`);
  await expect(page.getByRole('heading', { name: 'Chụp chấm nhiều mã đề' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto('/terms');
  for (const id of ['gia', 'hoan-tien', 'khieu-nai']) {
    await expect(page.locator(`section#${id}`)).toBeVisible();
  }
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'Chính sách bảo mật' })).toBeVisible();

  expect(errors).toEqual([]);
});
