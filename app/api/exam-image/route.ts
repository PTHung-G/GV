/**
 * Exam OCR — POST /api/exam-image
 *
 * Original shape (js/16aj47n690ufs.js): `requestExamImage(payload, opts)` posts
 * to /api/exam-image and returns the parsed exam. Here the image is read by the
 * same vision model used for chat, so one provider serves both paths.
 */
import { NextRequest, NextResponse } from 'next/server';
import { complete, type ContentPart } from '@/lib/server/model';
import { errorBody, newRequestId } from '@/lib/server/chat-exam-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const SYSTEM = `Bạn là bộ chuyển ảnh đề thi thành văn bản cho giáo viên Việt Nam.

Đọc ảnh và dựng lại đề dưới dạng HTML của một trang A4.
Quy tắc:
- Giữ nguyên chữ, số, dấu tiếng Việt, đơn vị như trong ảnh.
- <h1> cho tiêu đề đề, <h3> cho từng phần, <p><b>Câu n.</b> …</p> cho từng câu.
- Công thức toán viết bằng LaTeX trong $...$ (trong dòng) hoặc $$...$$ (riêng dòng).
- Đáp án A/B/C/D gom vào <div class="doc-grid"><div class="doc-grid-cell"><p>A. …</p></div>…</div>.
- Bảng dùng <table>. Chỗ không đọc được ghi <span>[không rõ]</span>.
- Chỉ trả JSON một dòng: {"content": "<html>", "warnings": ["..."]}
Không giải thích gì thêm ngoài JSON.`;

type ImagePayload = { data: string; mimeType?: string };

export async function POST(req: NextRequest) {
  const requestId = newRequestId();

  let body: { images?: ImagePayload[]; image?: ImagePayload; subject?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      errorBody(400, 'Dữ liệu gửi lên không hợp lệ.', 'invalid_json', requestId),
      { status: 400 },
    );
  }

  const images = body.images ?? (body.image ? [body.image] : []);
  if (!images.length) {
    return NextResponse.json(
      errorBody(400, 'Chưa có ảnh nào để đọc.', 'no_images', requestId),
      { status: 400 },
    );
  }

  // Vision payloads are large; cap them so one bad request cannot exhaust memory.
  const MAX_BYTES = 8 * 1024 * 1024;
  for (const img of images) {
    if (!img.data || typeof img.data !== 'string') {
      return NextResponse.json(
        errorBody(400, 'Ảnh không hợp lệ.', 'invalid_image', requestId),
        { status: 400 },
      );
    }
    if (img.data.length * 0.75 > MAX_BYTES) {
      return NextResponse.json(
        errorBody(413, 'Ảnh quá lớn. Hãy nén lại dưới 8MB.', 'image_too_large', requestId),
        { status: 413 },
      );
    }
  }

  const contentParts: ContentPart[] = [
    { type: 'text', text: 'Đọc đề thi trong ảnh và trả JSON theo đúng schema.' },
  ];
  for (const img of images) {
    contentParts.push({
      type: 'image_url',
      image_url: { url: `data:${img.mimeType ?? 'image/png'};base64,${img.data}` },
    });
  }

  try {
    const { text, model } = await complete({
      json: true,
      maxTokens: 4000,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: contentParts },
      ],
    });

    const parsed = parseJson(text);
    const content = typeof parsed.content === 'string' ? parsed.content : '';
    if (!content.trim()) {
      return NextResponse.json(
        errorBody(502, 'Không đọc được nội dung nào từ ảnh.', 'ocr_empty', requestId),
        { status: 502 },
      );
    }

    const warnings = Array.isArray(parsed.warnings)
      ? parsed.warnings.filter((w): w is string => typeof w === 'string')
      : [];

    return NextResponse.json({
      success: true,
      exam: { content },
      analysis: { documentType: 'exam', model, imageCount: images.length },
      warnings,
      model,
      requestId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json(
      errorBody(502, 'Không đọc được ảnh lúc này. Hãy thử lại.', 'ocr_failed', requestId),
      { status: 502 },
    );
  }
}

function parseJson(text: string): Record<string, unknown> {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const slice = start >= 0 && end > start ? text.slice(start, end + 1) : text;
  try {
    return JSON.parse(slice) as Record<string, unknown>;
  } catch {
    // Model answered with bare HTML instead of the wrapper — accept that too.
    return { content: text.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/, '').trim() };
  }
}
