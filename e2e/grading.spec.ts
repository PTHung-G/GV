/**
 * End-to-end checks for the grading feature.
 *
 * These cover the path a teacher actually walks: sign in, open the grading
 * dashboard, and create a session through the three-step wizard.
 */
import { expect, test, type Page } from '@playwright/test';
import { seedAccountDocuments } from './document-fixture';

async function signIn(page: Page) {
  const email = `e2e-${crypto.randomUUID()}@example.test`;
  const registration = await page.request.post('/api/auth/register', { data: {
    name: 'Test Teacher', email, password: 'TestFixture123!',
  } });
  expect(registration.ok(), await registration.text()).toBe(true);
  expect((await page.request.post('/api/auth/logout')).ok()).toBe(true);
  await page.goto('/');
  await page.getByRole('button', { name: /Đăng nhập/ }).first().click();
  await page.locator('#auth-email').fill(email);
  await page.locator('#auth-password').fill('TestFixture123!');
  await page.getByRole('dialog').getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL(/\/hub$/, { timeout: 15_000 });
  await seedAccountDocuments(page);
}

test('the grading dashboard asks for a sign-in before showing anything', async ({ page }) => {
  await page.goto('/grading');
  await expect(page.getByRole('heading', { name: 'Chấm bài thi' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
});

test('the dashboard lists grading sessions once signed in', async ({ page }) => {
  await signIn(page);
  await page.goto('/grading');

  await expect(page.getByRole('heading', { name: 'Chấm bài thi' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Đợt chấm mới/ })).toBeVisible();
});

test('the wizard creates a grading session and opens its workspace', async ({ page }) => {
  await signIn(page);
  await page.goto('/grading/new');

  // Step 1 — pick the seeded demo exam.
  await expect(page.getByRole('heading', { name: 'Chọn đề thi' })).toBeVisible();
  await page.getByRole('button', { name: /Đề kiểm tra giữa kì I môn Toán 9/ }).first().click();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();

  // Step 2 — add one multiple-choice question so a rubric exists.
  await expect(page.getByRole('heading', { name: 'Xác nhận thang điểm' })).toBeVisible();
  await page.getByRole('button', { name: /Câu trắc nghiệm/ }).click();
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'Xoá câu', exact: true }).locator('..').locator('input').last().fill('1');
  await expect(page.getByText(/Tổng:/)).toBeVisible();
  await page.getByLabel('Tổng điểm mong muốn').fill('1');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();

  // Step 3 — name the class and create.
  await expect(page.getByRole('heading', { name: 'Lớp và cách chấm' })).toBeVisible();
  const className = `E2E-${Date.now().toString(36).toUpperCase()}`;
  await page.getByPlaceholder('Ví dụ: 9A').fill(className);
  const created = page.waitForResponse(response => response.url().endsWith('/api/grading/sessions') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Tạo đợt chấm' }).click();
  const creation = await created;
  expect(creation.ok(), await creation.text()).toBe(true);

  // The workspace opens on the receive tab.
  await page.waitForURL(/\/grading\/[0-9a-f-]{36}/, { timeout: 20_000 });
  await expect(page.getByRole('navigation', { name: 'Các phần của đợt chấm' })).toBeVisible();
  // The active section is marked for assistive tech, not by a specific border colour.
  await expect(page.getByRole('button', { name: 'Nhận bài' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: 'Tải ảnh bài mới' })).toBeVisible();
  // The class is echoed in the header subtitle as well as the session itself, so
  // match the first one in the work area rather than the whole page.
  await expect(page.getByRole('main').getByText(className, { exact: false }).first()).toBeVisible();
});

test('the workspace reflects the exam mode in which tabs it offers', async ({ page }) => {
  await signIn(page);
  await page.goto('/grading/new');

  await page.getByRole('button', { name: /Đề kiểm tra giữa kì I môn Toán 9/ }).first().click();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();

  // A rubric with only essay questions must not offer the multiple-choice tab.
  await page.getByRole('button', { name: /Câu tự luận/ }).click();
  await page.getByRole('button', { name: 'Xoá câu', exact: true }).locator('..').locator('input').last().fill('1');
  await page.getByPlaceholder('Nội dung bước chấm').fill('Giải đúng bài toán');
  await page.getByPlaceholder('Nội dung bước chấm').locator('..').locator('input').last().fill('1');
  await page.getByLabel('Tổng điểm mong muốn').fill('1');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();
  const created = page.waitForResponse(response => response.url().endsWith('/api/grading/sessions') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Tạo đợt chấm' }).click();
  const creation = await created;
  expect(creation.ok(), await creation.text()).toBe(true);

  await page.waitForURL(/\/grading\/[0-9a-f-]{36}/, { timeout: 20_000 });
  const nav = page.getByRole('navigation', { name: 'Các phần của đợt chấm' });
  await expect(nav.getByRole('button', { name: 'Tự luận' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Trắc nghiệm' })).toHaveCount(0);
});

test('an exam that only exists on paper can be graded', async ({ page }) => {
  await signIn(page);
  await page.goto('/grading/new');

  // Nothing is written on the web for this exam, so the wizard must accept the
  // text pasted straight from the printed paper.
  await page.getByRole('button', { name: 'Đề bên ngoài' }).click();
  await page
    .getByPlaceholder('Kiểm tra giữa kỳ I môn Toán 9')
    .fill(`Đề in sẵn ${Date.now().toString(36)}`);
  await page
    .locator('textarea')
    .first()
    .fill('Câu 1. Nghiệm của x^2 - 5x + 6 = 0 là\nA. x = 2 hoặc x = 3\nB. x = -2\nC. x = 1\nD. x = 0');

  await expect(page.getByRole('button', { name: 'Tiếp tục' })).toBeEnabled();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();

  // Build the rubric by hand instead of calling the model, so the test stays
  // deterministic and offline.
  await page.getByRole('button', { name: /Câu trắc nghiệm/ }).click();
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'Xoá câu', exact: true }).locator('..').locator('input').last().fill('1');

  await page.getByRole('button', { name: 'B', exact: true }).first().click();
  await expect(page.getByText(/Tổng:/)).toBeVisible();
  await page.getByLabel('Tổng điểm mong muốn').fill('1');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();

  await page.getByPlaceholder('Ví dụ: 9A').fill(`E2E-EXT-${Date.now().toString(36).toUpperCase()}`);
  const created = page.waitForResponse(response => response.url().endsWith('/api/grading/sessions') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Tạo đợt chấm' }).click();
  const creation = await created;
  expect(creation.ok(), await creation.text()).toBe(true);
  await page.waitForURL(/\/grading\/[0-9a-f-]{36}/, { timeout: 20_000 });

  // The frozen rubric came from the pasted text, not from any stored document.
  await page.getByRole('button', { name: 'Đề & thang điểm' }).click();
  await expect(page.getByText('Câu 1', { exact: false })).toBeVisible();
});

test('student codes typed on one line are recognised', async ({ page }) => {
  await signIn(page);
  await page.goto('/grading/new');
  await page.getByRole('button', { name: /Đề kiểm tra giữa kì I môn Toán 9/ }).first().click();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();
  await page.getByRole('button', { name: /Câu trắc nghiệm/ }).click();
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'Xoá câu', exact: true }).locator('..').locator('input').last().fill('1');
  await page.getByLabel('Tổng điểm mong muốn').fill('1');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();

  const className = `E2E-ROSTER-${Date.now().toString(36).toUpperCase()}`;
  await page.getByPlaceholder('Ví dụ: 9A').fill(className);
  // A single space separates the code from the name, the way teachers type it.
  await page.locator('textarea').last().fill('09001 Nguyễn Văn An\n09002 Trần Minh Anh');
  const created = page.waitForResponse(response => response.url().endsWith('/api/grading/sessions') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Tạo đợt chấm' }).click();
  const creation = await created;
  expect(creation.ok(), await creation.text()).toBe(true);
  await page.waitForURL(/\/grading\/[0-9a-f-]{36}/, { timeout: 20_000 });

  // The roster is the identity source for the printed sheets, so check the
  // stored codes rather than what happens to be painted on screen.
  const classes = (await (await page.request.get('/api/classes')).json()) as {
    classes: Array<{ id: string; name: string }>;
  };
  const klass = classes.classes.find((row) => row.name === className);
  expect(klass).toBeTruthy();

  const roster = (await (
    await page.request.get(`/api/classes?classId=${klass!.id}`)
  ).json()) as { students: Array<{ code: string | null; name: string }> };

  expect(roster.students.map((row) => row.code)).toEqual(['09001', '09002']);
  expect(roster.students[0].name).toBe('Nguyễn Văn An');
});

test('picking an exam that already has an answer key fills the rubric', async ({ page }) => {
  await signIn(page);
  await page.goto('/grading/new');

  await page.getByRole('button', { name: /Đề kiểm tra 20 câu – Toán 9/ }).first().click();
  await expect(page.getByText(/Có barem — cần kiểm tra phiên bản và điểm/)).toBeVisible();
  await page.getByRole('button', { name: 'Tiếp tục' }).click();

  // No AI call: the 20 answers come straight from the key document.
  await expect(page.getByRole('heading', { name: 'Xác nhận thang điểm' })).toBeVisible();
  await expect(page.getByText(/20 TN/)).toBeVisible();
  await expect(page.getByText(/Tổng:\s*10,00/)).toBeVisible();
});
