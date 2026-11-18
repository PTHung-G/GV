import { NextRequest, NextResponse } from 'next/server';
import { errorBody, newRequestId } from '@/lib/server/chat-exam-types';

export const runtime = 'nodejs';

const ALLOWED = new Set([
  'h1', 'h2', 'h3', 'p', 'b', 'strong', 'i', 'em', 'u', 'br', 'span',
  'sub', 'sup', 'ol', 'ul', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
  // layout containers generated for the exam header and option grids
  'div',
]);

/**
 * Post-generation check, matching POST /api/chat-exam/verify { content, subject }.
 * Rejects markup the page cannot safely or correctly render.
 */
export async function POST(req: NextRequest) {
  const requestId = newRequestId();
  let body: { content?: string; subject?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      errorBody(400, 'Dữ liệu gửi lên không hợp lệ.', 'invalid_json', requestId),
      { status: 400 },
    );
  }

  const content = body.content ?? '';
  if (!content.trim()) {
    return NextResponse.json(
      errorBody(400, 'Chưa có nội dung để kiểm tra.', 'verify_empty', requestId),
      { status: 400 },
    );
  }

  const issues: Array<{ code: string; message: string }> = [];

  const tags = [...content.matchAll(/<\/?([a-z0-9]+)[^>]*>/gi)].map((m) => m[1].toLowerCase());
  const unknown = [...new Set(tags.filter((t) => !ALLOWED.has(t)))];
  if (unknown.length) {
    issues.push({
      code: 'unknown_tags',
      message: `Thẻ không được hỗ trợ: ${unknown.join(', ')}`,
    });
  }

  if (/\bon\w+\s*=/i.test(content)) {
    issues.push({ code: 'inline_handlers', message: 'Có thuộc tính sự kiện inline.' });
  }
  if (/\*\*[^*]+\*\*/.test(content)) {
    issues.push({ code: 'markdown_leftover', message: 'Còn ký hiệu Markdown (**) chưa chuyển sang thẻ.' });
  }
  if (!/<h1/i.test(content)) {
    issues.push({ code: 'missing_title', message: 'Thiếu tiêu đề <h1> của đề.' });
  }

  const questionCount = (content.match(/<b>\s*Câu\s+\d+/gi) ?? []).length;

  return NextResponse.json({
    success: true,
    ok: issues.length === 0,
    issues,
    stats: { questionCount, length: content.length },
    requestId,
  });
}
