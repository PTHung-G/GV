import { expect, test } from '@playwright/test';
import { signInWithDocuments } from './document-fixture';

const PUBLIC_PAGES: Array<[string, RegExp]> = [
  ['/', /Soạn đề, chuẩn bị đáp án,\s*chấm bài\s*và tổng hợp điểm\./],
  ['/exams', /Đề thi được chia sẻ/],
  ['/about', /Về Hỗ trợ giáo viên/],
  ['/my-exams', /Đề thi của tôi/],
  ['/hub', /Soạn đề và chấm bài/],
  ['/terms', /Điều khoản sử dụng/],
  ['/privacy', /Chính sách bảo mật/],
];

for (const [path, heading] of PUBLIC_PAGES) {
  test(`renders ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    if (path === '/my-exams') await signInWithDocuments(page);
    await page.goto(path);
    if (path === '/my-exams') await expect(page.getByRole('main').getByText('Đề thi của tôi', { exact: true }).first()).toBeVisible();
    else await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(heading);
    expect(errors).toEqual([]);
  });
}

test('header navigation reaches every main section', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation').first();
  for (const [label, url] of [
    ['Sảnh tính năng', '/hub'],
    ['Đề thi cộng đồng', '/exams'],
    ['Đề thi của tôi', '/my-exams'],
    ['Chấm bài', '/grading'],
  ] as const) {
    await nav.getByRole('link', { name: label, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${url.replace('/', '\\/')}$`));
    await page.goto('/');
  }
});

test('login dialog accepts credentials and shows the account', async ({ page }) => {
  const email = `login-ui-${crypto.randomUUID()}@example.test`;
  const registration = await page.request.post('/api/auth/register', { data: {
    name: 'Login Teacher', email, password: 'TestFixture123!',
  } });
  expect(registration.ok(), await registration.text()).toBe(true);
  expect((await page.request.post('/api/auth/logout')).ok()).toBe(true);
  await page.goto('/');
  await page.getByRole('button', { name: /Đăng nhập/ }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Email').fill(email);
  await dialog.getByLabel('Mật khẩu', { exact: true }).fill('TestFixture123!');
  await dialog.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(dialog).toBeHidden({ timeout: 5_000 });
  // Signing in lands in the app shell, where the account lives in the rail.
  await expect(page).toHaveURL(/\/hub$/);
  const account = page.getByRole('button', { name: /Login Teacher/ }).first();
  await expect(account).toBeVisible();
  await expect(page.getByText(/20\.000 điểm/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Đăng xuất' })).toBeVisible();
});

test('exam library filters by subject and shows a counter', async ({ page }) => {
  await page.goto('/exams');
  const counter = page.locator('p[aria-live="polite"]').first();
  const before = await counter.textContent();
  const filters = page.getByRole('group', { name: 'Lọc theo môn học' });
  await filters.getByRole('button', { name: 'Toán', exact: true }).click();
  await expect(counter).not.toHaveText(before ?? '');
  await filters.getByRole('button', { name: 'Tất cả môn' }).click();
  await expect(counter).toHaveText(before ?? '');
});

test('community exam detail offers copy-to-editor', async ({ page }) => {
  await page.goto('/exams');
  await page.locator('a[href^="/exams/"]').first().click();
  // Real slugs end with the exam's UUID.
  await expect(page).toHaveURL(
    /\/exams\/.+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  );
  await expect(page.getByRole('button', { name: /Sao về trình soạn/ })).toBeVisible();
});

test('the memory page adds, edits, deletes and restores a preference', async ({ page }) => {
  await signInWithDocuments(page);
  const request = page.request;
  // Start from a clean slate so counts are deterministic.
  await request.delete('/api/memory');

  await page.goto('/memory');
  await expect(page.getByRole('heading', { name: 'Trí nhớ của trợ lý' })).toBeVisible();
  await expect(page.getByText('Chưa có ghi nhớ nào.')).toBeVisible();

  await page.getByPlaceholder(/luôn dùng đơn vị cm/).fill('Luôn dùng Times New Roman 15pt');
  await page.getByRole('button', { name: 'Thêm' }).click();
  await expect(page.getByText('Luôn dùng Times New Roman 15pt')).toBeVisible();

  // Edit by clicking the text.
  await page.getByText('Luôn dùng Times New Roman 15pt').click();
  await page.locator('li input').fill('Luôn dùng Times New Roman 14pt');
  await page.getByRole('button', { name: 'Lưu' }).click();
  await expect(page.getByText('Luôn dùng Times New Roman 14pt')).toBeVisible();

  // Delete, then restore.
  await page.getByRole('button', { name: 'Xoá ghi nhớ' }).click();
  await expect(page.getByText('Đã xoá')).toBeVisible();
  await page.getByRole('button', { name: /Khôi phục/ }).click();
  await expect(page.getByText('Đã xoá')).toHaveCount(0);

  // The assistant reads this list, so the switch must persist.
  await page.locator('input[type=checkbox]').click();
  await expect
    .poll(async () => {
      const res = await request.get('/api/memory');
      const body = (await res.json()) as { memory: { useMemory: boolean } };
      return body.memory.useMemory;
    })
    .toBe(false);
});
