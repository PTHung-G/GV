/**
 * The three-pane shell: rail, centre, aside — and the two independent collapses.
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
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Email').fill(email);
  await dialog.getByLabel('Mật khẩu', { exact: true }).fill('TestFixture123!');
  await dialog.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL(/\/hub$/);
  await seedAccountDocuments(page);
}

const boxOf = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: Math.round(rect.x), width: Math.round(rect.width) };
  }, selector);

const widthOf = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? Math.round(el.getBoundingClientRect().width) : -1;
  }, selector);

test('the app shell shows a rail, the work, and an aside', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Soạn đề và chấm bài');
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Bảng điều khiển' })).toBeVisible();

  // Three columns, side by side, not stacked.
  const rail = await page.locator('[data-shell-rail]').boundingBox();
  const main = await page.getByRole('main').boundingBox();
  expect(rail!.width).toBeGreaterThan(200);
  expect(main!.x).toBeGreaterThanOrEqual(rail!.width - 1);
});

test('collapsing the rail gives its width to the work area, and the choice sticks', async ({ page }) => {
  await signIn(page);
  const openWidth = await widthOf(page, '[data-shell-rail]');
  const mainBefore = (await page.getByRole('main').boundingBox())!.width;

  await page.getByRole('button', { name: 'Thu gọn thanh bên' }).first().click();
  await expect.poll(() => widthOf(page, '[data-shell-rail]')).toBe(0);

  const mainAfter = (await page.getByRole('main').boundingBox())!.width;
  expect(mainAfter).toBeGreaterThan(mainBefore + openWidth - 4);

  await page.reload();
  await expect.poll(() => widthOf(page, '[data-shell-rail]')).toBe(0);

  // And it can be brought back from the header.
  await page.getByRole('button', { name: 'Mở thanh bên' }).first().click();
  await expect.poll(() => widthOf(page, '[data-shell-rail]')).toBeGreaterThan(200);
});

test('the right pane collapses on its own', async ({ page }) => {
  await signIn(page);
  expect(await widthOf(page, '[data-shell-aside]')).toBeGreaterThan(300);
  const railBefore = await widthOf(page, '[data-shell-rail]');

  await page.getByRole('button', { name: 'Thu gọn bảng bên phải' }).first().click();
  await expect.poll(() => widthOf(page, '[data-shell-aside]')).toBe(0);
  // Closing one pane must not disturb the other.
  expect(await widthOf(page, '[data-shell-rail]')).toBe(railBefore);

  await page.getByRole('button', { name: 'Mở bảng bên phải' }).first().click();
  await expect.poll(() => widthOf(page, '[data-shell-aside]')).toBeGreaterThan(300);
});

test('on a phone the rail is a drawer, closed until asked for', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);

  // Off-canvas: it keeps its width, but sits entirely left of the viewport.
  const closed = await boxOf(page, '[data-shell-rail]');
  expect(closed!.x + closed!.width).toBeLessThanOrEqual(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'Mở thanh bên' }).click();
  await expect.poll(async () => (await boxOf(page, '[data-shell-rail]'))!.x).toBe(0);

  await page.getByRole('button', { name: 'Đóng thanh bên' }).first().click();
  await expect
    .poll(async () => {
      const box = await boxOf(page, '[data-shell-rail]');
      return box!.x + box!.width;
    })
    .toBeLessThanOrEqual(0);
});

test('every signed-in screen sits inside the shell', async ({ page }) => {
  await signIn(page);
  for (const path of ['/my-exams', '/grading', '/grading/new']) {
    await page.goto(path);
    await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toBeVisible();
    if (path === '/my-exams') await expect(page.getByRole('main').getByText('Đề thi của tôi', { exact: true }).first()).toBeVisible();
    else await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('the mark appears once per page', async ({ page }) => {
  // One logo, in the public header. It used to be repeated in the footer and in
  // the editor header, which is what made the interface feel like a brochure.
  for (const route of ['/', '/about', '/exams', '/terms', '/privacy']) {
    await page.goto(route);
    await expect(page.locator('.brand-logo')).toHaveCount(1);
  }
});
