/**
 * Shared HTTP helpers for the grading API.
 *
 * Every failure leaves the process as the same JSON envelope the rest of the
 * app already uses (`errorBody`), so the client can show `error` verbatim.
 */
import { NextResponse } from 'next/server';
import { errorBody, newRequestId } from './chat-exam-types';
import { isDatabaseConfigured } from './db';

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message: string, code: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Anything shaped like an HTTP error is reported as one. This lets pure domain
 * modules (for example the rubric validator) signal a 400 without importing the
 * server layer.
 */
function asHttpFailure(
  error: unknown,
): { status: number; message: string; code: string } | null {
  if (error instanceof HttpError) {
    return { status: error.status, message: error.message, code: error.code };
  }
  if (error && typeof error === 'object' && 'status' in error && 'code' in error) {
    const candidate = error as { status: unknown; code: unknown; message?: unknown };
    if (typeof candidate.status === 'number' && typeof candidate.code === 'string') {
      return {
        status: candidate.status,
        code: candidate.code,
        message: typeof candidate.message === 'string' ? candidate.message : 'Dữ liệu không hợp lệ.',
      };
    }
  }
  return null;
}

/** Turns any thrown value into the app's standard error response. */
export function jsonError(error: unknown): NextResponse {
  const requestId = newRequestId();

  const failure = asHttpFailure(error);
  if (failure) {
    return NextResponse.json(
      errorBody(failure.status, failure.message, failure.code, requestId),
      { status: failure.status },
    );
  }

  const message = error instanceof Error ? error.message : 'Lỗi không xác định.';
  console.error('[api] lỗi không mong đợi:', message);
  return NextResponse.json(
    errorBody(500, 'Máy chủ gặp lỗi. Vui lòng thử lại.', 'internal_error', requestId),
    { status: 500 },
  );
}

/**
 * Grading needs durable storage; without it we say so plainly instead of
 * failing later with a confusing database error.
 */
export function requireDatabase(): void {
  if (!isDatabaseConfigured()) {
    throw new HttpError(
      503,
      'Tính năng chấm bài cần cơ sở dữ liệu. Hãy cấu hình DATABASE_URL rồi chạy migration.',
      'database_not_configured',
    );
  }
}

export async function readJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, 'Dữ liệu gửi lên không hợp lệ.', 'invalid_json');
  }
}

export function requireString(value: unknown, message: string, code = 'invalid_field'): string {
  if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, message, code);
  return value.trim();
}
