'use client';

/**
 * Typed fetch helpers for the grading API.
 *
 * Every call goes through `basePath` so the app keeps working under the
 * `/soandethi` subpath, and every error carries the server's Vietnamese message
 * so components can show it directly.
 */
import { basePath } from './api-url';
import type { SheetTemplate } from './grading/sheet-template';

export class GradingApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message: string, code: string) {
    super(message);
    this.name = 'GradingApiError';
    this.status = status;
    this.code = code;
  }
}

type ErrorPayload = { error?: string; code?: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(basePath(path), {
      ...init,
      headers: {
        ...(init?.body && !(init.body instanceof FormData)
          ? { 'content-type': 'application/json' }
          : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new GradingApiError(0, 'Không kết nối được máy chủ.', 'network_error');
  }

  const data = (await res.json().catch(() => null)) as (T & ErrorPayload) | null;
  if (!res.ok) {
    throw new GradingApiError(
      res.status,
      data?.error ?? 'Yêu cầu không thành công.',
      data?.code ?? 'request_failed',
    );
  }
  return data as T;
}

export const gradingApi = {
  get: <T>(path: string) => request<T>(path, { cache: 'no-store' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  postForm: <T>(path: string, form: FormData) =>
    request<T>(path, { method: 'POST', body: form }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// ------------------------------------------------------------------ types

export type RubricMode = 'mc-only' | 'essay-only' | 'mixed';
export type SessionStatus = 'active' | 'finalized' | 'archived';

export type SessionSummary = {
  id: string;
  title: string;
  className: string | null;
  mode: RubricMode;
  sheetMode: 'template' | 'manual';
  status: SessionStatus;
  createdAt: string;
  totalPoints: number;
  mcPoints: number;
  essayPoints: number;
  studentCount: number;
  submissionCount: number;
  needsReviewCount: number;
  confirmedCount: number;
};

export type PageSummary = {
  id: string;
  pageIndex: number;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  status: string;
};

export type SubmissionSummary = {
  id: string;
  label: string | null;
  studentId: string | null;
  studentCode: string | null;
  studentName: string | null;
  identityStatus: string;
  examCode: string | null;
  pageCount: number;
  mcStatus: string;
  essayStatus: string;
  mcScore: number | null;
  essayScore: number | null;
  totalScore: number | null;
  status: string;
  flags: string[];
  createdAt: string;
  pages: PageSummary[];
};

export type RubricStep = { key: string; text: string; points: number };
export type RubricQuestion =
  | { no: number; type: 'mc'; points: number; answer: string; label?: string }
  | { no: number; type: 'essay'; points: number; steps: RubricStep[]; label?: string; answer?: string };

export type SessionDetail = SessionSummary & {
  subject: string | null;
  grade: number | null;
  snapshotId: string;
  sourceExamId?: string | null;
  examHtml?: string | null;
  answerKeyHtml?: string | null;
  snapshotCreatedAt?: string;
  rubricRevisionId: string;
  rubric: { version: 1; totalPoints: number; questions: RubricQuestion[] };
  finalizedAt: string | null;
  /** Present for the standard-sheet branch; used to read marks on the device. */
  sheetTemplate: SheetTemplate | null;
};

export function pageUrl(pageId: string): string {
  return basePath(`/api/grading/pages/${pageId}`);
}

/** Vietnamese mark formatting: 8.5 → "8,5". */
export function formatMark(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return value.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Đang nhận',
  processing: 'Đang chấm',
  graded: 'Đã chấm',
  'needs-review': 'Cần duyệt',
  confirmed: 'Đã duyệt',
  absent: 'Vắng',
};
