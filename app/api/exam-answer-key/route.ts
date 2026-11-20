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
import { complete, providerKind } from '@/lib/server/model';
import { errorBody, newRequestId } from '@/lib/server/chat-exam-types';
import { requireUser } from '@/lib/server/auth';
import { jsonError } from '@/lib/server/http';
import { examContentHash } from '@/lib/exam-revision';
import { compactHtmlForAi } from '@/lib/html-sanitize';
import {
  ANSWER_KEY_VERSION,
  formatTfStatements,
  normalizeShortValue,
  parsePoints,
  parseTfStatements,
  type AnswerKeyQuestion,
} from '@/lib/grading/rubric';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const SYSTEM = `Bạn là giáo viên chấm đề người Việt Nam theo chuẩn GDPT 2018 / THPT 2025.

Nhận một đề thi và trả về đáp án cho tất cả 4 dạng câu hỏi có thể xuất hiện:
1. "mc": Trắc nghiệm 4 lựa chọn A, B, C, D. "answer" là đúng 1 chữ cái A/B/C/D. Không có "steps".
2. "tf": Trắc nghiệm Đúng/Sai gồm 4 ý a, b, c, d. "answer" viết 4 ký tự Đ/S liền nhau, ví dụ "ĐSĐS" (tương ứng a=Đúng, b=Sai, c=Đúng, d=Sai). Mặc định "points":"1,0" nếu thuộc PHẦN II hoặc đề nêu điểm.
3. "short": Trắc nghiệm trả lời ngắn. "answer" là giá trị số/chuỗi ngắn gọn (dùng dấu phẩy thập phân, tối đa 4 ký tự nếu theo phiếu THPT 2025, ví dụ "-2,5" hoặc "1250").
4. "essay": Tự luận (hoặc Bài n.). "answer" là kết quả cuối, kèm mảng "steps": [{"text":"...","points":"..."}] sao cho tổng điểm các bước đúng bằng "points" (nếu đề nêu điểm).

Quy tắc đánh số:
- "label" giữ nguyên nhãn câu trong đề (ví dụ "Câu 1"). Nếu đề chia nhiều PHẦN mà mỗi phần đánh lại từ Câu 1, thêm "sectionNo" (1, 2, 3...) và "displayNo" (số câu trong phần đó).
- Điểm dùng dấu phẩy thập phân kiểu Việt Nam (0,25 / 0,5 / 1,0 / 2,0). Chỉ ghi "points" khi đề nêu rõ hoặc theo chuẩn phần thi; không bịa đặt.

Chỉ trả JSON một dòng:
{"questions":[{"type":"mc","label":"Câu 1","answer":"B","points":"0,25","sectionNo":1,"displayNo":1},{"type":"tf","label":"Câu 1","answer":"ĐSĐS","points":"1,0","sectionNo":2,"displayNo":1},{"type":"short","label":"Câu 1","answer":"12,5","points":"0,5","sectionNo":3,"displayNo":1},{"type":"essay","label":"Câu 1","answer":"$x=2$","points":"2,0","sectionNo":4,"displayNo":1,"steps":[{"text":"Biến đổi đúng","points":"2,0"}]}]}
Không giải thích gì thêm ngoài JSON.`;

type Step = { text: string; points?: string };
type Question = AnswerKeyQuestion;

function stripTags(html: string): string {
  return html
    .replace(/<span\b[^>]*data-latex="([^"]*)"[^>]*>[\s\S]*?<\/span>/gi, ' $1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildOfflineDraftKey(content: string): Question[] {
  const blocks = content.match(/<(?:p|h[1-6]|div)\b[^>]*>[\s\S]*?<\/(?:p|h[1-6]|div)>/gi) ?? [];
  let sectionNo = 0;
  let currentType: 'mc' | 'tf' | 'short' | 'essay' | null = null;
  const out: Question[] = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const plain = stripTags(blocks[i]);
    if (!plain) continue;
    if (/^(?:PHẦN|Phần|SECTION)\s+/u.test(plain)) {
      sectionNo += 1;
      if (/đúng\s*\/?\s*sai|trắc nghiệm đúng sai/iu.test(plain)) currentType = 'tf';
      else if (/trả lời ngắn/iu.test(plain)) currentType = 'short';
      else if (/tự luận/iu.test(plain)) currentType = 'essay';
      else if (/trắc nghiệm/iu.test(plain)) currentType = 'mc';
      continue;
    }
    const qMatch = /^(?:Câu|Bài)\s+(\d+)(?:\s*\((\d+(?:[.,]\d+)?)\s*điểm\))?\s*[.:)]/iu.exec(plain);
    if (!qMatch) continue;
    const displayNo = Number(qMatch[1]);
    const pts = qMatch[2]?.replace('.', ',');
    const lookahead = stripTags(blocks.slice(i, i + 4).join(' '));
    const looksMc = /\bA\.\s/.test(lookahead) && /\bB\.\s/.test(lookahead);
    const looksTf = /\ba\)\s/.test(lookahead) && /\bb\)\s/.test(lookahead);
    const kind = looksTf ? 'tf' : looksMc ? 'mc' : currentType ?? 'essay';
    const meta = sectionNo > 0 ? { sectionNo, displayNo } : {};

    if (kind === 'tf') {
      out.push({ type: 'tf', label: `Câu ${displayNo}`, answer: 'ĐSĐS', points: pts ?? '1,0', ...meta });
    } else if (kind === 'mc') {
      out.push({ type: 'mc', label: `Câu ${displayNo}`, answer: 'A', ...(pts ? { points: pts } : {}), ...meta });
    } else if (kind === 'short') {
      out.push({ type: 'short', label: `Câu ${displayNo}`, answer: '0', points: pts ?? '0,5', ...meta });
    } else {
      out.push({
        type: 'essay',
        label: `Câu ${displayNo}`,
        answer: 'Xem hướng dẫn chấm',
        ...(pts ? { points: pts, steps: [{ text: 'Trình bày đúng phương pháp và kết quả', points: pts }] } : { steps: [{ text: 'Trình bày đúng phương pháp và kết quả' }] }),
        ...meta,
      });
    }
  }
  return out;
}

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

  const compacted = compactHtmlForAi(content);
  if (compacted.length > 45000) {
    return NextResponse.json(errorBody(413, 'Đề vượt quá 45.000 ký tự. Chưa gửi phần nào cho AI; hãy rút gọn hoặc nhập barem thủ công.', 'exam_too_long', requestId), { status: 413 });
  }

  if (providerKind() === 'offline') {
    const offlineQuestions = buildOfflineDraftKey(content);
    if (!offlineQuestions.length) {
      return NextResponse.json(errorBody(422, 'Không nhận diện được câu hỏi nào trong đề.', 'no_questions', requestId), { status: 422 });
    }
    return NextResponse.json({
      version: ANSWER_KEY_VERSION,
      sourceContentHash: examContentHash(content),
      warnings: ['Chế độ offline: hệ thống tạo khung đáp án mẫu từ đề, thầy cô kiểm tra và chỉnh lại đáp án đúng trước khi chốt.'],
      codes: [{ code: '', questions: offlineQuestions }],
      model: 'offline-deterministic',
    });
  }

  try {
    const { text } = await complete({
      maxTokens: 6000,
      messages: [
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content: `Đề: ${typeof body.exam?.title === 'string' ? body.exam.title.slice(0, 500) : '(không tên)'}\n\n${compacted}`,
        },
      ],
    });

    const questions = parseQuestions(text);
    if (!questions.length) throw new Error('AI chưa trả về đáp án đầy đủ, hợp lệ. Hãy thử lại hoặc nhập thủ công.');
    const sourceMarkers = [...stripTags(content).matchAll(/\b(?:Câu|Bài)\s+(\d+)(?:\s*\([^)]*\))?\s*[.:)]/giu)].map((m) => Number(m[1]));
    const keys = questions.map((q, idx) => `${q.sectionNo ?? 0}:${q.displayNo ?? (/(\d+)/.exec(q.label)?.[1] ?? idx + 1)}`);
    if (new Set(keys).size !== keys.length || questions.length < sourceMarkers.length) {
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

/** Reads `{"questions":[...]}`; tolerates a bare array, markdown fences, and all 4 GDPT 2018 types. */
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
            type?: unknown;
            label?: unknown;
            answer?: unknown;
            statements?: unknown;
            points?: unknown;
            steps?: unknown;
            sectionNo?: unknown;
            displayNo?: unknown;
          };
          if (typeof q.label !== 'string') return null;
          const label = q.label.trim();
          if (!/^(?:(?:Câu|Bài)\s*)?\d+$/i.test(label)) return null;
          if (q.steps != null && !Array.isArray(q.steps)) return null;
          if (q.points != null && (parsePoints(q.points) ?? 0) <= 0) return null;

          const sectionNo = Number.isInteger(Number(q.sectionNo)) && Number(q.sectionNo) > 0 ? Number(q.sectionNo) : undefined;
          const displayNo = Number.isInteger(Number(q.displayNo)) && Number(q.displayNo) > 0 ? Number(q.displayNo) : undefined;
          const meta = { ...(sectionNo ? { sectionNo } : {}), ...(displayNo ? { displayNo } : {}) };
          const points = q.points == null ? undefined : String(q.points).trim();

          const steps = Array.isArray(q.steps)
            ? q.steps
                .map((s) => {
                  const step = s as { text?: unknown; points?: unknown };
                  const textVal = String(step.text ?? '').trim();
                  if (!textVal) return null;
                  const pts = step.points == null ? undefined : String(step.points).trim();
                  return pts ? { text: textVal, points: pts } : { text: textVal };
                })
                .filter((s): s is Step => s !== null)
            : [];
          if (Array.isArray(q.steps) && steps.length !== q.steps.length) return null;

          if (q.type === 'tf') {
            const st = parseTfStatements(q.statements ?? q.answer);
            if (!st) return null;
            return {
              type: 'tf',
              label,
              answer: formatTfStatements(st),
              statements: st,
              ...(points ? { points } : {}),
              ...meta,
            };
          }

          const answer = typeof q.answer === 'string' ? q.answer.trim() : String(q.answer ?? '').trim();
          if (!answer) return null;

          if (q.type === 'short') {
            const normalized = normalizeShortValue(answer);
            if (!normalized) return null;
            return { type: 'short', label, answer: normalized, ...(points ? { points } : {}), ...meta };
          }

          if (q.type !== 'essay' && !steps.length) {
            const st = parseTfStatements(q.statements ?? answer);
            if (st) {
              return { type: 'tf', label, answer: formatTfStatements(st), statements: st, ...(points ? { points } : {}), ...meta };
            }
            const letter = answer.toUpperCase();
            if (/^[A-D]$/.test(letter)) {
              return { ...(q.type === 'mc' ? { type: 'mc' as const } : {}), label, answer: letter, ...(points ? { points } : {}), ...meta };
            }
            return null;
          }

          if (q.points != null && steps.length && steps.every((step) => step.points != null)) {
            const sum = steps.reduce((total, step) => total + (parsePoints(step.points) ?? 0), 0);
            if (Math.abs(sum - (parsePoints(q.points) ?? 0)) > 0.01) return null;
          }

          return { type: 'essay', label, answer, ...(points ? { points } : {}), steps, ...meta };
        })
        .filter((q): q is Question => q !== null);
      return result.length === list.length ? result : [];
    } catch {
      continue;
    }
  }
  return [];
}
