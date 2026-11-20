/**
 * Prompt suggestions — POST /api/suggestions
 *
 * Original shape (js/12q7obohwerum.pretty.js, module around line 14571):
 *   fetchSuggestions({ examTitle, questionCount, blockCount, hasAnswers, libraryIds }, refresh?, signal?)
 *     -> { suggestions: string[], pending?: boolean }
 *
 * The caller retries up to 3 times, 5s apart, while `pending` is true; those
 * retries are because the original generates suggestions in the background. We
 * answer synchronously, so `pending` is only ever set when the model is slow.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { isDatabaseConfigured } from '@/lib/server/db';
import { jsonError } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { complete } from '@/lib/server/model';
import { errorBody, newRequestId } from '@/lib/server/chat-exam-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Context = {
  examTitle?: string;
  questionCount?: number;
  blockCount?: number;
  hasAnswers?: boolean;
  libraryIds?: string[];
};

const SYSTEM = `Bạn gợi ý yêu cầu tiếp theo cho một giáo viên đang soạn đề thi trên trang web.

Dựa vào tình trạng đề hiện tại, đưa ra 3 gợi ý ngắn (mỗi gợi ý dưới 70 ký tự), tiếng Việt,
bắt đầu bằng động từ, nói rõ việc cần làm với đề này.
- Đề còn trống: gợi ý tạo đề.
- Đã có câu hỏi nhưng chưa có đáp án: gợi ý giải đề / tạo đáp án.
- Đã có đáp án: gợi ý soát lỗi, đổi ma trận đề, tạo đề tương tự.
Chỉ trả JSON một dòng: {"suggestions":["...","...","..."]}
Không giải thích gì thêm ngoài JSON.`;

const FALLBACK = [
  'Tạo đề thi giữa kỳ Toán lớp 9 gồm 5 câu tự luận',
  'Giải đề trong trang và viết đáp án, barem chi tiết',
  'Soát lỗi chính tả và định dạng của đề này',
];

export async function POST(req: NextRequest) {
  const requestId = newRequestId();
  try {
    if (isDatabaseConfigured()) {
      const user = await requireUser();
      enforceRateLimit('suggestions', user.id, 30, 60_000);
    }

    let body: Context & { refresh?: boolean };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        errorBody(400, 'Dữ liệu gửi lên không hợp lệ.', 'invalid_json', requestId),
        { status: 400 },
      );
    }

    const state = [
      `Tên đề: ${body.examTitle?.trim() || '(chưa có)'}`,
      `Số câu: ${body.questionCount ?? 0}`,
      `Số khối nội dung: ${body.blockCount ?? 0}`,
      `Đã có đáp án: ${body.hasAnswers ? 'có' : 'chưa'}`,
      body.libraryIds?.length ? `Đang tham chiếu ${body.libraryIds.length} đề trong thư viện` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const { text } = await complete({
        signal: req.signal,
        maxTokens: 300,
        // Without this the provider returns prose around the JSON and every call
        // silently degrades to the hardcoded fallback.
        json: true,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: state },
        ],
      });
      const suggestions = parseSuggestions(text);
      // Never leave the panel empty — the caller hides the list on an empty array.
      return NextResponse.json({ suggestions: suggestions.length ? suggestions : FALLBACK });
    } catch {
      // Suggestions are decorative; a model failure must not surface as an error.
      return NextResponse.json({ suggestions: FALLBACK });
    }
  } catch (err) {
    return jsonError(err);
  }
}

function parseSuggestions(text: string): string[] {
  const cleaned = text.replace(/```[a-z]*\n?/gi, '').trim();
  const candidates = [cleaned];
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));

  for (const raw of candidates) {
    try {
      const parsed = JSON.parse(raw) as { suggestions?: unknown } | unknown[];
      const list = Array.isArray(parsed) ? parsed : parsed.suggestions;
      if (!Array.isArray(list)) continue;
      const out = list
        .map((s) => String(s ?? '').trim())
        .filter((s) => s.length > 0 && s.length <= 120)
        .slice(0, 3);
      if (out.length) return out;
    } catch {
      continue;
    }
  }
  return [];
}
