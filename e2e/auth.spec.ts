import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('registration creates a real account; login never creates one; logout revokes session', async ({ request }) => {
  const email = `auth-${randomUUID()}@example.test`, password = 'SecurePass123!';
  expect((await request.post('/api/auth/login', { data: { email, password } })).status()).toBe(401);
  const registered = await request.post('/api/auth/register', { data: { name: 'Nguyễn Giáo Viên', email: email.toUpperCase(), password } });
  expect(registered.status()).toBe(201);
  const { user } = await registered.json();
  expect(user.email).toBe(email); expect(user.name).toBe('Nguyễn Giáo Viên'); expect(user.password_hash).toBeUndefined();
  const cookie = registered.headers()['set-cookie']; expect(cookie).toContain('HttpOnly'); expect(cookie).toContain('SameSite=lax');
  expect((await (await request.get('/api/auth/me')).json()).user.id).toBe(user.id);
  expect((await request.post('/api/auth/register', { data: { name: 'Khác', email, password } })).status()).toBe(409);
  await request.post('/api/auth/logout');
  expect((await (await request.get('/api/auth/me')).json()).user).toBeNull();
  expect((await request.get('/api/memory')).status()).toBe(401);
  expect((await request.post('/api/auth/login', { data: { email, password: 'WrongPass123!' } })).status()).toBe(401);
  expect((await request.post('/api/auth/login', { data: { email, password } })).status()).toBe(200);
  expect((await (await request.get('/api/auth/me')).json()).user.id).toBe(user.id);
  expect((await request.post('/api/auth/demo')).status()).toBe(403);
});

test('registration rejects invalid input and cross-origin requests; concurrent duplicate is safe', async ({ request }) => {
  const email = `auth-validation-${randomUUID()}@example.test`;
  for (const data of [{ name: 'GV', email, password: 'short' }, { name: '', email, password: 'SecurePass123!' }, { name: 'GV', email: ['bad'], password: 'SecurePass123!' }]) {
    expect((await request.post('/api/auth/register', { data })).status()).toBe(400);
  }
  expect((await request.post('/api/auth/register', { headers: { origin: 'https://other.example' }, data: { name: 'GV', email, password: 'SecurePass123!' } })).status()).toBe(403);
  const responses = await Promise.all([1, 2].map(() => request.post('/api/auth/register', { data: { name: 'GV', email, password: 'SecurePass123!' } })));
  expect(responses.map(r => r.status()).sort()).toEqual([201, 409]);
});

test('repeated login attempts are throttled', async ({ request }) => {
  const email = `auth-rate-${randomUUID()}@example.test`;
  for (let i = 0; i < 10; i++) expect((await request.post('/api/auth/login', { data: { email, password: 'WrongPass123!' } })).status()).toBe(401);
  expect((await request.post('/api/auth/login', { data: { email, password: 'WrongPass123!' } })).status()).toBe(429);
});

test('user can register in the dialog and sign back into the same account', async ({ page }) => {
  const email = `auth-ui-${randomUUID()}@example.test`;
  await page.goto('/');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('tab', { name: 'Đăng ký' }).click();
  await dialog.getByLabel('Họ và tên', { exact: true }).fill('Giáo viên thật');
  await dialog.getByLabel('Email', { exact: true }).fill(email);
  await dialog.getByLabel('Mật khẩu', { exact: true }).fill('SecurePass123!');
  await dialog.getByLabel(/Xác nhận mật khẩu|Nhập lại mật khẩu/).fill('SecurePass123!');
  await dialog.getByRole('button', { name: /Tạo tài khoản|Đăng ký/, exact: true }).click();
  await expect(page).toHaveURL(/\/hub$/);
  await page.reload();
  await expect(page.getByRole('button', { name: /Giáo viên thật/ }).first()).toBeVisible();
});
