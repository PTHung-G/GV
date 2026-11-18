/**
 * Answer key — POST /api/exam-answer-key
 *
 * Original shape (js/2-_e50duc2fl9.pretty.js, module 577509):
 *   requestAnswerKey({ title, content }) ->
 *     { codes: [{ code, questions: [{ label, answer }] }], model }
 *
 * `codes` always has at least one entry so callers can read `codes[0]`.
 */
import { NextRequest, NextResponse } from 'next/server';
import { complete } from '@/lib/server/model';
import { errorBody, newRequestId } from '@/lib/server/chat-exam-types';
import { requireUser } from '@/lib/server/auth';
import { jsonError } from '@/lib/server/http';
import { examContentHash } from '@/lib/exam-revision';
import { ANSWER_KEY_VERSION, parsePoints } from '@/lib/grading/rubric';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const SYSTEM = `Bạn là giáo viên chấm đề người Việt.

Nhận một đề thi và trả về đáp án cho cả câu trắc nghiệm lẫn câu tự luận.
Quy tắc chung:
- "label" giữ nguyên số câu như trong đề, ví dụ "Câu 1".
- Tự giải để tìm đáp án đúng; không chép bừa.
- Phải giữ đủ mọi câu; nếu không xác định được thì trả JSON {"error":"Không đủ dữ kiện để tạo đáp án đầy đủ"}, không bỏ qua câu âm thầm.

Với câu TRẮC NGHIỆM (có 4 lựa chọn A, B, C, D):
- "answer" là một chữ cái duy nhất: A, B, C hoặc D.
- Không thêm trường "steps". Chỉ thêm "points" khi đề nêu rõ điểm của câu; nếu thiếu thì bỏ trường này, không tự gán 0,5 hay suy đoán thang điểm.

Với câu TỰ LUẬN (không có A/B/C/D):
- "answer" là kết quả cuối cùng, viết dạng ngắn gọn.
- "points" là tổng điểm của câu khi đề nêu rõ, ví dụ "2,0". Nếu đề không nêu điểm thì không tự bịa điểm; bỏ points của câu và các bước để giáo viên nhập.
- "steps" là mảng các bước giải, mỗi bước { "text": "…", "points": "…" }.
  Mỗi bước là một phép biến đổi cụ thể kèm số điểm của bước đó,
  tổng điểm các bước phải đúng bằng "points".
  Ví dụ với câu 2,0 điểm: [{"text":"Điều kiện xác định $x \\\\ne 1$","points":"0,5"},
                            {"text":"Quy đồng và rút gọn được $A=\\\\frac{2}{x-1}$","points":"1,0"},
                            {"text":"Kết luận","points":"0,5"}]
- Điểm dùng dấu phẩy thập phân kiểu Việt Nam: 0,5 / 1,0 / 2,0.
- Chỉ giải thật, không viết chung chung kiểu "trình bày đúng".

Chỉ trả JSON một dòng:
{"questions":[{"label":"Câu 1","answer":"B"},
              {"label":"Câu 3","answer":"$A=\\\\frac{2}{x-1}$","points":"2,0","steps":[{"text":"…","points":"1,0"}]}]}
Không giải thích gì thêm ngoài JSON.`;

type Step = { text: string; points?: string };
type Question = { label: string; answer: string; points?: string; steps?: Step[] };

export async function POST(req: NextRequest) {
  const requestId = newRequestId();
  try { await requireUser(); } catch (error) { return jsonError(error); }

  let body: { exam?: { title?: string; content?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      errorBody(400, 'Dữ liệu gửi lên không hợp lệ.', 'invalid_json', requestId),
      { status: 400 },
    );
  }

  const content = typeof body?.exam?.content === 'string' ? body.exam.content : '';
  if (!content.trim()) {
    return NextResponse.json(
      errorBody(400, 'Chưa có nội dung đề.', 'empty_exam', requestId),
      { status: 400 },
    );
  }

  if (content.length > 12000) {
    return NextResponse.json(errorBody(413, 'Đề vượt quá 12.000 ký tự. Chưa gửi phần nào cho AI; hãy rút gọn hoặc nhập barem thủ công.', 'exam_too_long', requestId), { status: 413 });
  }

  try {
    const { text } = await complete({
      // Rubrics carry one row per working step, so a 6-question paper needs far
      // more room than a bare A/B/C/D list; a truncated reply loses the tail.
      maxTokens: 4000,
      messages: [
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content: `Đề: ${typeof body.exam?.title === 'string' ? body.exam.title.slice(0, 500) : '(không tên)'}\n\n${content}`,
        },
      ],
    });

    const questions = parseQuestions(text);
    if (!questions.length) throw new Error('AI chưa trả về đáp án đầy đủ, hợp lệ. Hãy thử lại hoặc nhập thủ công.');
    const sourceNumbers = [...new Set([...content.replace(/<[^>]+>/g, ' ').matchAll(/Câu\s+(\d+)\s*[.:)]/gi)].map(match => Number(match[1])))];
    const returnedNumbers = questions.map(q => Number(/(\d+)/.exec(q.label)?.[1]));
    if (new Set(returnedNumbers).size !== returnedNumbers.length || sourceNumbers.some(no => !returnedNumbers.includes(no))) {
      throw new Error('Đáp án AI bị thiếu hoặc trùng số câu. Chưa sử dụng kết quả này; hãy kiểm tra đề hoặc nhập thủ công.');
    }
    return NextResponse.json({
      version: ANSWER_KEY_VERSION,
      sourceContentHash: examContentHash(content),
      warnings: ['Bản nháp AI: đối chiếu đủ câu, đáp án và điểm trước khi xác nhận.'],
      codes: [{ code: '', questions }],
      model: undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không tạo được đáp án.';
    return NextResponse.json(errorBody(502, message, 'answer_key_failed', requestId), {
      status: 502,
    });
  }
}

/** Reads `{"questions":[...]}`; tolerates a bare array or stray prose. */
function parseQuestions(text: string): Question[] {
  const cleaned = text.replace(/```[a-z]*\n?/gi, '').trim();
  const candidates = [cleaned];
  const objStart = cleaned.indexOf('{');
  const objEnd = cleaned.lastIndexOf('}');
  if (objStart >= 0 && objEnd > objStart) candidates.push(cleaned.slice(objStart, objEnd + 1));

  for (const raw of candidates) {
    try {
      const parsed = JSON.parse(raw) as { questions?: unknown } | unknown[];
      const list = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!Array.isArray(list)) continue;
      const result = list
        .map((item): Question | null => {
          if (!item || typeof item !== 'object') return null;
          const q = item as {
            label?: unknown;
            answer?: unknown;
            points?: unknown;
            steps?: unknown;
          };
          if (typeof q.label !== 'string' || typeof q.answer !== 'string') return null;
          const label = q.label.trim();
          const answer = q.answer.trim();
          if (!/^(?:Câu\s*)?\d+$/i.test(label) || !answer) return null;
          if (q.steps != null && !Array.isArray(q.steps)) return null;
          if (q.points != null && (parsePoints(q.points) ?? 0) <= 0) return null;

          const steps = Array.isArray(q.steps)
            ? q.steps
                .map((s) => {
                  const step = s as { text?: unknown; points?: unknown };
                  const text = String(step.text ?? '').trim();
                  if (!text) return null;
                  const points = step.points == null ? undefined : String(step.points).trim();
                  return points ? { text, points } : { text };
                })
                .filter((s): s is Step => s !== null)
            : [];

          if (Array.isArray(q.steps) && steps.length !== q.steps.length) return null;
          if (q.points != null && steps.length && steps.every(step => step.points != null)) {
            const sum = steps.reduce((total, step) => total + (parsePoints(step.points) ?? 0), 0);
            if (Math.abs(sum - (parsePoints(q.points) ?? 0)) > 0.01) return null;
          }
          const points = q.points == null ? undefined : String(q.points).trim();

          // A choice question: a bare A/B/C/D letter and no rubric.
          if (!steps.length) {
            const letter = answer.toUpperCase();
            if (!/^[A-D]$/.test(letter)) return null;
            return points ? { label, answer: letter, points } : { label, answer: letter };
          }

          return points ? { label, answer, points, steps } : { label, answer, steps };
        })
        .filter((q): q is Question => q !== null);
      return result.length === list.length ? result : [];
    } catch {
      continue;
    }
  }
  return [];
}
