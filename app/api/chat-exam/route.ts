/**
 * Streaming exam generator.
 *
 * Contract recovered from js/180c0fplvd4t3.js:
 *   - request  { messages, currentExam, prompt, planned, reasoning, ... }
 *   - response SSE with progress / delta / reset / result / error
 *   - result   { action: 'replace' | 'append', exam?, content?, ... }
 *   - errors   empty_generated_exam / empty_generated_content when the action
 *              arrives without any content (the client rejects those).
 */
import { requireUser } from '@/lib/server/auth';
import { ownedConversationHistory, patchConversationTurn, claimConversationGeneration, assertConversationTurnRunning } from '@/lib/server/conversations';
import { jsonError } from '@/lib/server/http';
import { NextRequest } from 'next/server';
import { completeStream } from '@/lib/server/model';
import { createSseWriter } from '@/lib/server/sse';
import {
  errorBody,
  newRequestId,
  type ChatExamRequest,
  type ChatExamResult,
} from '@/lib/server/chat-exam-types';
import { compactHtmlForAi } from '@/lib/html-sanitize';
import { maybeRememberFromPrompt, memoryPrompt, readMemory } from '@/lib/server/memory';
import { embedFigures } from '@/lib/geometry/embed';
import { randomUUID } from 'node:crypto';
import { materializeGeneration } from '@/lib/structured-exam';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM = String.raw`Bạn là trợ lý soạn đề thi cho giáo viên Việt Nam.

Trả về JSON hợp lệ duy nhất theo hợp đồng structured-exam-generation:
{"blocks":[{"key":"header","html":"<div class=\"doc-header\">…</div>"},{"key":"q1","html":"<p><b>Câu 1.</b> …</p>"}],"questions":[{"key":"question1","label":"Câu 1","bodyKeys":["q1"],"contextKeys":[]}]}
- blocks theo đúng thứ tự in; mỗi html chứa đúng một phần tử HTML cấp cao nhất.
- key chỉ là tham chiếu cục bộ duy nhất, KHÔNG cấp ID, data-sdt-block hay thuộc tính nhận dạng. Máy chủ cấp ID.
- Mỗi câu có bodyKeys không rỗng, gồm toàn bộ đề câu, các ý, lựa chọn và hình riêng. Không dùng chung bodyKeys giữa các câu.
- contextKeys chỉ tham chiếu dữ kiện/hình dùng chung thật sự cần cho câu đó. Không gắn tiêu đề/đầu trang/hướng dẫn chung vào câu.
- Mọi blocks phải được liệt kê; blocks không thuộc câu hay ngữ cảnh là đầu trang/tiêu đề/hướng dẫn chấm, không phải câu bị bỏ sót.
- Không trả HTML thuần, Markdown, lời dẫn hay trường khác. Escape dấu ngoặc kép và dấu gạch chéo ngược LaTeX theo JSON (mỗi dấu gạch chéo ngược trong HTML thành hai dấu trong chuỗi JSON).
Nội dung HTML của một trang đề A4 tuân thủ cấu trúc bắt buộc:
- Mở đầu bằng đầu đề hai cột:
  <div class="doc-header">
    <div class="doc-header-col"><p><b>TRƯỜNG …</b></p><p>TỔ …</p></div>
    <div class="doc-header-col"><p><b>KIỂM TRA …</b></p><p>Môn: … – Thời gian: … phút</p></div>
  </div>
- <h1> tiêu đề đề thi (in hoa)
- <p> dòng môn học / thời gian, căn giữa bằng style="text-align:center"
- <h3> cho từng phần (PHẦN I. Trắc nghiệm nhiều lựa chọn, PHẦN II. Trắc nghiệm Đúng/Sai, PHẦN III. Trắc nghiệm trả lời ngắn, PHẦN IV. Tự luận)
- <p><b>Câu n.</b> …</p> cho từng câu tự luận / trả lời ngắn
- Câu Đúng/Sai 4 ý: một <p><b>Câu n.</b> …</p> rồi <div class="doc-tf-list"><p>a) …</p><p>b) …</p><p>c) …</p><p>d) …</p></div>
- Câu trắc nghiệm 4 lựa chọn: một <p> cho đề câu, rồi một lưới đáp án
  <div class="doc-grid"><div class="doc-grid-cell"><p>A. …</p></div><div class="doc-grid-cell"><p>B. …</p></div>
  <div class="doc-grid-cell"><p>C. …</p></div><div class="doc-grid-cell"><p>D. …</p></div></div>
  Lưới phải có đúng 2, 3, 4 hoặc 6 ô, mỗi ô bắt đầu bằng "A. ", "B. " … theo thứ tự liên tiếp.
- Bảng phải có <tbody> tường minh bao quanh các <tr>, đóng đầy đủ mọi thẻ; không dựa vào trình duyệt tự sửa cấu trúc HTML.
Chỉ dùng các thẻ: h1, h2, h3, p, b, i, u, br, span, sub, sup, ol, ul, li, table, thead, tbody, tfoot, tr, td, th, div.
Ngoài các class doc-header / doc-header-col / doc-grid / doc-grid-cell / doc-tf-list ở trên, không thêm class nào khác.

HÌNH VẼ: khi câu hỏi cần hình (tam giác, đường tròn, tiếp tuyến, parabol), KHÔNG tự vẽ.
Chèn một thẻ rỗng, máy chủ sẽ dựng hình thật:
  <figure data-figure-spec='{"kind":"triangle-right","params":{"ab":6,"ac":8,"altitude":true}}'></figure>
Chỉ dùng đúng bốn "kind" sau, tham số là số, không thêm khoá lạ:
  - triangle-right   : ab, ac (cm), altitude (true/false)  — tam giác ABC vuông tại A
  - triangle-sides   : a, b, c (cm)                        — a = BC, b = CA, c = AB
  - circle-tangents  : r (bán kính), d (khoảng cách OA)    — hai tiếp tuyến từ A, cần d > r
  - parabola         : a, b, c                             — đồ thị y = ax² + bx + c, a ≠ 0
Có thể thêm "caption":"Hình 1" nếu đề cần đánh số hình.
Số đo trong hình PHẢI khớp số liệu trong đề. Tối đa 4 hình mỗi đề.
Ví dụ đặt hình ngay dưới câu hỏi:
  <p><b>Câu 4.</b> Cho tam giác ABC vuông tại A, AB = 6 cm, AC = 8 cm.</p>
  <figure data-figure-spec='{"kind":"triangle-right","params":{"ab":6,"ac":8,"altitude":true}}'></figure>

Công thức toán BẮT BUỘC viết bằng LaTeX trong $...$ (inline) hoặc $$...$$ (display).
Ví dụ: $\frac{2}{\sqrt{5}-\sqrt{3}}$, $x^2 - 3x + 2 = 0$, $\angle ABC = 90°$, $x \in \mathbb{R}$.
Không viết công thức bằng ký tự Unicode thường và không bọc trong <code>.

ĐỀ GỐC PHẢI SẠCH: đề dùng để in cho học sinh làm bài nên TUYỆT ĐỐI KHÔNG chứa
đáp án, lời giải hay thang điểm chi tiết bên trong đề. Chỉ ghi điểm của từng câu
trên đầu câu (ví dụ "Câu 1 (2,0 điểm).") và tổng điểm ở tiêu đề phần.

HƯỚNG DẪN CHẤM: CHỈ khi người dùng nói rõ muốn "đáp án", "thang điểm" hoặc "barem"
kèm theo, mới viết thêm phần hướng dẫn chấm. Khi đó phải đặt nó SAU trang đề,
sang trang mới bằng <div style="page-break-after:always"></div>, và dựng đúng cấu trúc:
- <h1 style="text-align:center">HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM</h1>
- <h3>A. HƯỚNG DẪN CHUNG</h3>
  <p>Học sinh làm theo cách khác, nếu đúng vẫn cho điểm tối đa.</p>
- <h3>B. ĐÁP ÁN VÀ THANG ĐIỂM</h3>
- Trắc nghiệm: bảng 2 dòng, mỗi ô một câu:
  <table border="1" style="border-collapse:collapse;width:100%"><tbody><tr><td><p><b>Câu</b></p></td>
  <td><p><b>1</b></p></td><td><p><b>2</b></p></td></tr>
  <tr><td><p><b>Đáp án</b></p></td><td><p>B</p></td><td><p>A</p></td></tr></tbody></table>
- Tự luận: bảng 4 cột gồm Câu / Ý / Nội dung / Điểm, mỗi bước giải một dòng và ghi số điểm của bước đó:
  <table border="1" style="border-collapse:collapse;width:100%"><tbody><tr><td><p><b>Câu</b></p></td>
  <td><p><b>Ý</b></p></td><td><p><b>Nội dung</b></p></td><td><p><b>Điểm</b></p></td></tr>
  <tr><td><p><b>Câu 2</b><br><i>(8,0 điểm)</i></p></td><td><p></p></td>
  <td><p><b>Giải hệ phương trình (8,0 điểm)</b></p></td><td><p><b>8,0</b></p></td></tr>
  <tr><td><p></p></td><td><p></p></td><td><p>Nhân hai vế … được …</p></td><td><p>2,0</p></td></tr>
  … </tbody></table>
Quy tắc chấm:
- Điểm viết bằng dấu phẩy thập phân kiểu Việt Nam: 2,0 / 1,0 / 0,5.
- Mỗi bước giải phải kèm số điểm riêng; tổng các bước đúng bằng điểm của câu.
- Tổng điểm toàn bài luôn là 10; ghi rõ điểm của từng phần ở tiêu đề phần.
- Chỉ giải thật, không viết chung chung kiểu "trình bày đúng".
Trả về đúng JSON blocks/questions ở trên, không thêm lời dẫn.`;

export async function POST(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch (error) { return jsonError(error); }
  const requestId = newRequestId();
  let body: ChatExamRequest;
  try {
    body = (await req.json()) as ChatExamRequest;
  } catch {
    return new Response(
      JSON.stringify(errorBody(400, 'Dữ liệu gửi lên không hợp lệ.', 'invalid_json', requestId)),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  let history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  try {
    if (body.conversationId) {
      if (!body.turnId) return new Response(JSON.stringify({ error: 'Thiếu mã lượt chat.', code: 'invalid_turn' }), { status: 400, headers: { 'content-type': 'application/json' } });
      await claimConversationGeneration(user.id, body.conversationId, body.turnId);
      history = await ownedConversationHistory(user.id, body.conversationId);
    }
  } catch (error) { return jsonError(error); }
  const sse = createSseWriter();

  void (async () => {
    let cancelled: ReturnType<typeof setInterval> | undefined;
    try {
      const controller = new AbortController();
      if (req.signal.aborted) controller.abort();
      req.signal.addEventListener('abort', () => controller.abort(), { once: true });
      // Explicit cancellation on another tab is also authoritative.
      cancelled = setInterval(async () => {
        if (!body.conversationId || !body.turnId) return;
        try {
          await assertConversationTurnRunning(user.id, body.conversationId, body.turnId);
        } catch { controller.abort(); }
      }, 2000);
      controller.signal.addEventListener('abort', () => clearInterval(cancelled), { once: true });
      sse.progress('generating', 'Đang soạn đề…');

      // Standing preferences the teacher asked us to remember, if enabled.
      const remembered = memoryPrompt(await readMemory(user.id));
      const messages = [
        { role: 'system' as const, content: SYSTEM },
        { role: 'system' as const, content: remembered || '(chưa có ghi nhớ nào)' },
        ...(history.at(-1)?.role === 'user' ? history.slice(0, -1) : history),
        { role: 'user' as const, content: buildPrompt(body) },
      ];

      // Generation is the long part — tens of seconds with nothing to look at.
      // Streaming it lets us count questions as they land and say so.
      sse.progress('generating', 'Đang soạn nội dung đề…');

      let seen = 0;
      let lastReport = 0;
      let buffer = '';
      const streamed = await completeStream(
        { reasoning: body.reasoning, json: true, maxTokens: 10000, messages, signal: controller.signal },
        (piece) => {
          buffer += piece;
          const written = (buffer.match(/<b>\s*Câu\s+\d+/gi) ?? []).length;
          const now = Date.now();
          if (written > seen && now - lastReport > 350) {
            seen = written;
            lastReport = now;
            sse.progress('generating', `Đang soạn… đã viết ${written} câu`, 1);
          }
        },
      );
      // Tokens are progress only. Strip markdown fences before parsing JSON.
      const cleanedJson = parseJsonEnvelope(streamed.text);
      const generated: unknown = JSON.parse(cleanedJson);
      if (!generated || typeof generated !== 'object' || Array.isArray(generated)) throw new Error('invalid_generated_structure');
      const draft = generated as { blocks?: Array<{ key: string; html: string }>; questions?: unknown };
      if (!Array.isArray(draft.blocks) || !draft.blocks.length || draft.blocks.length > 2000 ||
          draft.blocks.some(block => !block || typeof block.html !== 'string' || block.html.length > 300000) ||
          draft.blocks.reduce((total, block) => total + block.html.length, 0) > 300000) {
        throw new Error('invalid_generated_structure');
      }
      const warnings: string[] = [];
      let figureCount = 0;
      // Embed before anchoring: each final block (including SVG) must retain
      // exactly the HTML that materialization validates and assigns an ID to.
      for (const block of draft.blocks) {
        block.html = block.html.replace(
          /<figure\b[^>]*?data-figure(?:-spec)?\s*=\s*(?:"[^"]*"|'[^']*')[^>]*>[\s\S]*?<\/figure>/gi,
          placeholder => {
            figureCount += 1;
            if (figureCount <= 4) return placeholder;
            warnings.push('Đề vượt giới hạn 4 hình; hình bổ sung không được dựng.');
            return '<figure class="doc-figure" data-figure-error="">[Hình vẽ vượt giới hạn 4 hình mỗi đề.]</figure>';
          },
        );
        const embedded = await embedFigures(block.html, (done, total) => {
          sse.progress('figures', `Đang dựng hình ${done}/${total} trong khối…`, 2);
        });
        block.html = embedded.html;
        warnings.push(...embedded.warnings);
      }
      const { html, structure } = materializeGeneration(generated, randomUUID);
      const action = decideAction(body);

      sse.progress('preparing', 'Đang hoàn thiện bản nháp…');

      // Delta carries the visible text; the client appends it progressively.
      await sse.delta(action === 'replace' ? 'Đã soạn xong đề. Bạn xem và chỉnh tiếp nhé.' : 'Đã soạn phần bổ sung.');

      if (action === 'replace' && !html.trim()) {
        throw new Error('empty_generated_exam');
      }
      if (action === 'append' && !html.trim()) {
        throw new Error('empty_generated_content');
      }

      const result: ChatExamResult = {
        success: true,
        action,
        reply: action === 'replace' ? 'Đã soạn xong đề. Bạn xem và chỉnh tiếp nhé.' : 'Đã soạn phần bổ sung.',
        summary: body.prompt?.slice(0, 120) ?? '',
        warnings,
        ...(action === 'replace'
          ? { exam: { title: body.examTitle, content: html, structure } }
          : { content: html, structure }),
      };
      if (body.conversationId && body.turnId) {
        await patchConversationTurn(user.id, body.conversationId, body.turnId, {
          status: 'completed', text: result.reply, payload: { html, action, structure }, issues: warnings,
        });
      }
      const rawPrompt = body.prompt || body.messages?.[body.messages.length - 1]?.content || '';
      void maybeRememberFromPrompt(user.id, rawPrompt).catch(() => {});
      sse.result(result);
    } catch (err) {
      if (body.conversationId && body.turnId) {
        await patchConversationTurn(user.id, body.conversationId, body.turnId, {
          status: req.signal.aborted ? 'cancelled' : 'failed',
          text: req.signal.aborted ? 'Đã dừng yêu cầu.' : 'Không soạn được đề. Bạn có thể thử lại.',
        }).catch(() => {}); // A cancelled/completed result is immutable.
      }
      const message = err instanceof Error ? err.message : 'unknown';
      const code = message.startsWith('provider_') ? message.split(':')[0] : 'generate_failed';
      sse.error(
        errorBody(
          502,
          'Không soạn được đề lúc này. Hãy thử lại sau ít phút.',
          code,
          requestId,
        ),
      );
    } finally {
      if (cancelled) clearInterval(cancelled);
    }
  })();

  return new Response(sse.stream, { headers: sse.headers });
}

function parseJsonEnvelope(raw: string): string {
  const trimmed = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
  if (trimmed.startsWith('{')) return trimmed;
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  return start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed;
}

function buildPrompt(body: ChatExamRequest) {
  const current = body.currentExam?.content;
  const action = decideAction(body);
  const parts = [body.prompt || body.messages?.[body.messages.length - 1]?.content || ''];
  if (current && body.contextSource !== 'none') {
    const compacted = compactHtmlForAi(current).slice(0, 32000);
    parts.push(`---\nĐề đang mở (${action === 'append' ? 'CHỈ soạn các câu/phần bổ sung nối tiếp, KHÔNG lặp lại .doc-header hoặc <h1>' : 'giữ cấu trúc, sửa hoặc soạn theo yêu cầu'}):\n${compacted}`);
  }
  for (const note of body.contextNotes ?? []) parts.push(`---\nGhi chú / Ngữ liệu tham khảo:\n${note}`);
  return parts.filter(Boolean).join('\n\n');
}

function decideAction(body: ChatExamRequest): 'replace' | 'append' {
  const hasExam = !!body.currentExam?.content?.trim();
  if (!hasExam) return 'replace';
  if (body.action === 'append' || body.action === 'replace') return body.action;
  const prompt = (body.prompt ?? '').toLowerCase();
  const appendIntent = /(thêm|chèn|bổ sung|nối tiếp|viết tiếp)/.test(prompt);
  return appendIntent ? 'append' : 'replace';
}

