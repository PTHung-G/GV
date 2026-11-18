import { createHash } from 'node:crypto';
import { queryOne } from './db';
import { HttpError } from './http';

export function validateAuthRequest(req: Request): void {
  const origin = req.headers.get('origin');
  if (origin) {
    let host: string;
    try { host = new URL(origin).host; } catch { throw new HttpError(403, 'Nguồn yêu cầu không hợp lệ.', 'invalid_origin'); }
    if (host !== req.headers.get('host')) throw new HttpError(403, 'Nguồn yêu cầu không hợp lệ.', 'invalid_origin');
  }
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Yêu cầu phải dùng JSON.', 'invalid_content_type');
  }
}

export function credentials(body: unknown): { email: string; password: string } {
  if (!body || typeof body !== 'object') throw new HttpError(400, 'Thông tin không hợp lệ.', 'invalid_input');
  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new HttpError(400, 'Email không hợp lệ.', 'invalid_email');
  }
  if (typeof password !== 'string' || !password.length || password.length > 128) {
    throw new HttpError(400, 'Mật khẩu phải có từ 1 đến 128 ký tự.', 'invalid_password');
  }
  return { email: email.trim().toLowerCase(), password };
}

/** Atomic across application workers. Do not trust arbitrary forwarded IP headers. */
export async function throttleAuth(kind: 'login' | 'register', email: string): Promise<void> {
  const key = `${kind}:${createHash('sha256').update(email).digest('hex')}`;
  const row = await queryOne<{ attempts: number }>(`
    insert into auth_rate_limits(key, attempts, reset_at) values ($1, 1, now() + interval '15 minutes')
    on conflict (key) do update set
      attempts = case when auth_rate_limits.reset_at <= now() then 1 else auth_rate_limits.attempts + 1 end,
      reset_at = case when auth_rate_limits.reset_at <= now() then now() + interval '15 minutes' else auth_rate_limits.reset_at end
    returning attempts`, [key]);
  if (!row || row.attempts > (kind === 'login' ? 10 : 5)) {
    throw new HttpError(429, 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút.', 'auth_rate_limited');
  }
}
