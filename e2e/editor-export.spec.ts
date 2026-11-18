import { test, expect } from '@playwright/test';
import { signInWithDocuments } from './document-fixture';

test.beforeEach(async ({ page }) => { await signInWithDocuments(page); });

test('direct editor export captures live content and produces a separate printable exam and blank sheet', async ({ page }) => {
  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const editor = page.locator('[contenteditable="true"]').first();
  await expect(editor).toBeVisible();
  await editor.press('Control+End');
  await editor.press('Enter');
  await editor.pressSequentially('Ban in noi dung vua sua');
  await page.getByRole('button', { name: 'Chốt đề & xuất PDF', exact: true }).click();
  await page.getByRole('button', { name: 'Chỉ in nhanh, không liên kết chấm' }).click();
  const dialog = page.getByRole('dialog');
  const frame = page.frameLocator('iframe[title="Xem trước bản in"]');
  await expect(frame.locator('body')).toContainText('Ban in noi dung vua sua');
  await expect(frame.locator('body')).not.toContainText('HƯỚNG DẪN CHẤM');
  const print = dialog.getByRole('button', { name: 'In / Lưu PDF', exact: true });
  await expect(print).toBeDisabled();
  await dialog.getByRole('checkbox', { name: /Tôi đã rà soát/ }).check();
  await expect(print).toBeEnabled();
  await dialog.getByRole('button', { name: 'Phiếu tô trắc nghiệm', exact: true }).click();
  await dialog.getByLabel('Số câu A–D').fill('20');
  await dialog.getByRole('button', { name: 'Tạo phiếu xem trước' }).click();
  await expect(frame.locator('.bubble')).toHaveCount(140); // 80 answer bubbles + 60 candidate-number bubbles
  await expect(frame.locator('body')).not.toContainText('Căn bậc hai');
  await expect(print).toBeEnabled();
  await page.evaluate(() => { const f = document.querySelector<HTMLIFrameElement>('iframe[title="Xem trước bản in"]')!; (window as any).__printed = false; f.contentWindow!.print = () => { (window as any).__printed = true; }; });
  await print.click();
  expect(await page.evaluate(() => (window as any).__printed)).toBe(true);
  await expect(page).toHaveURL(/\/doc\//);
});

test('legacy key requires explicit review and never leaks into exam', async ({ page }) => {
  await page.goto('/doc/mau-de-toan-9-20-cau');
  await page.getByRole('button', { name: 'Chốt đề & xuất PDF', exact: true }).click();
  await page.getByRole('button', { name: 'Chỉ in nhanh, không liên kết chấm' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Đáp án & barem', exact: true }).click();
  await expect(dialog.getByText('Đáp án chưa đủ điều kiện xuất.')).toBeVisible();
  await dialog.getByRole('checkbox', { name: /Tôi đã đối chiếu/ }).check();
  const frame = page.frameLocator('iframe[title="Xem trước bản in"]');
  await expect(frame.locator('body')).toContainText('HƯỚNG DẪN CHẤM');
});

test('blank sheet endpoint is private and validates question counts', async ({ page, playwright }) => {
  const anonymous = await playwright.request.newContext({ baseURL: 'http://127.0.0.1:3100' });
  expect((await anonymous.post('/api/editor/export-sheet', { data: { title: 'Phiếu', numbers: [1] } })).status()).toBe(401);
  await anonymous.dispose();
  const invalid = await page.request.post('/api/editor/export-sheet', { data: { title: 'Phiếu', numbers: [1, 1] } });
  expect(invalid.status()).toBe(400);
});
