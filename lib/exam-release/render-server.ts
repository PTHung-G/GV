import { PRINT_SHARED_CSS, sanitizeExamHtml } from '@/lib/html-sanitize';
import { escapeHtml } from '@/lib/math';

export function sanitizeReleaseHtml(html: string): string {
  return sanitizeExamHtml(html);
}

export { escapeHtml };

export function releaseArtifact(title: string, code: string, releaseId: string, content: string): string {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escapeHtml(title)} — ${escapeHtml(code)}</title><style>${PRINT_SHARED_CSS}.release-identity{border-bottom:1px solid #777;font:10pt Arial;padding-bottom:6px;margin-bottom:12px}</style></head><body><div class="release-identity">Mã đề: <b>${escapeHtml(code)}</b> · Bộ in: ${escapeHtml(releaseId)}</div>${sanitizeReleaseHtml(content)}</body></html>`;
}
