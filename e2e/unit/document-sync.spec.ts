import { test, expect } from '@playwright/test';

const doc = { id: 'private-a', title: 'Đề riêng A', content: '<p>Câu 1.</p>', subject: 'toan', grade: 9, createdAt: '2026-01-01', updatedAt: '2026-01-01' };

for (const storageKey of ['sdt.docs.v1', 'sdt.docs.account.owner-a']) {
test(`corrupt browser data at ${storageKey} does not block account loading`, async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, '{broken-json'), storageKey);
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { id: 'owner-a', name: 'A', email: 'a@example.test', points: 0, avatarColor: '#2383e2' } } }));
  await page.route('**/api/documents', route => route.fulfill({ json: { documents: [doc], revision: 3 } }));
  await page.goto('/my-exams');
  await expect(page.getByRole('link', { name: doc.title, exact: true })).toBeVisible();
  if (storageKey === 'sdt.docs.v1') expect(await page.evaluate(() => localStorage.getItem('sdt.docs.v1'))).toBe('{broken-json');
});
}

test('account library loads server state and does not silently claim legacy browser docs', async ({ page }) => {
  await page.addInitScript((legacy) => localStorage.setItem('sdt.docs.v1', JSON.stringify([legacy])), { ...doc, id: 'legacy', title: 'Đề cũ dùng chung' });
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { id: 'owner-a', name: 'A', email: 'a@example.test', points: 0, avatarColor: '#2383e2' } } }));
  await page.route('**/api/documents', route => route.fulfill({ json: { documents: [doc], revision: 3 } }));
  await page.goto('/my-exams');
  await expect(page.getByRole('link', { name: 'Đề riêng A', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Đề cũ dùng chung', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Xác nhận nhập vào tài khoản này' })).toBeVisible();
});

test('conflicting server revision leaves visible error and backup instead of retry overwrite', async ({ page }) => {
  let puts = 0;
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { id: 'owner-a', name: 'A', email: 'a@example.test', points: 0, avatarColor: '#2383e2' } } }));
  await page.route('**/api/documents', route => {
    if (route.request().method() === 'PUT') { puts++; return route.fulfill({ status: 409, json: { error: 'Kho đề đã thay đổi trên thiết bị khác.' } }); }
    return route.fulfill({ json: { documents: [doc], revision: 3 } });
  });
  await page.goto('/my-exams');
  await page.getByRole('button', { name: 'Đề mới', exact: true }).click();
  await expect(page.getByText('Kho đề đã thay đổi trên thiết bị khác.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tải bản sao lưu' })).toBeVisible();
  expect(puts).toBe(1);
  const backup = await page.evaluate(() => JSON.parse(localStorage.getItem('sdt.docs.account.owner-a')!));
  expect(backup.dirty).toBe(true);
  expect(backup.documents).toHaveLength(2);
});


test('newer server revision preserves unresolved browser backup across reload', async ({ page }) => {
  const recovered = { ...doc, id: 'unsaved', title: 'Bản nháp chưa đồng bộ' };
  await page.addInitScript((documents) => {
    if (!localStorage.getItem('sdt.docs.account.owner-a')) localStorage.setItem('sdt.docs.account.owner-a', JSON.stringify({ revision: 2, documents, dirty: true }));
  }, [recovered]);
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { id: 'owner-a', name: 'A', email: 'a@example.test', points: 0, avatarColor: '#2383e2' } } }));
  let puts = 0;
  await page.route('**/api/documents', route => {
    if (route.request().method() === 'PUT') puts++;
    return route.fulfill({ json: { documents: [doc], revision: 3 } });
  });
  await page.goto('/my-exams');
  await expect(page.getByRole('button', { name: 'Tải bản dự phòng', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Tải bản dự phòng', exact: true })).toBeVisible();
  const backup = await page.evaluate(() => JSON.parse(localStorage.getItem('sdt.docs.account.owner-a')!));
  expect(backup.revision).toBe(2);
  expect(backup.documents).toEqual([recovered]);
  expect(backup.dirty).toBe(true);
  expect(puts).toBe(0);
});
