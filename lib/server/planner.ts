/**
 * Planner step — reproduces the validation the original applies to the plan.
 *
 * Source: js/180c0fplvd4t3.js. The original branches on `decision` before it is
 * allowed to generate anything:
 *
 *   clarify -> needs >= 1 clarification, each with >= 2 options
 *   reject  -> reply only, nothing generated
 *   proceed -> must return template_prompt when 'chat' is in operations
 *   ui_action / direct_reply -> must NOT carry template_prompt, agents or operations
 */
import { compactHtmlForAi } from '@/lib/html-sanitize';
import { complete } from './model';
import type {
  ChatExamAction,
  ChatExamPlan,
  ChatExamPlanRequest,
  Clarification,
  PlanDecision,
  TaskKind,
} from './chat-exam-types';

const SYSTEM = `Bạn là bước lập kế hoạch cho trợ lý soạn đề thi của giáo viên Việt Nam.

Chỉ trả về JSON một dòng, không giải thích, đúng schema:
{
  "decision": "proceed" | "clarify" | "confirm" | "reject",
  "task_kind": "generate" | "ui_action" | "direct_reply",
  "action": "replace" | "append",
  "template_prompt": string,
  "operations": string[],
  "reply": string,
  "summary": string,
  "steps": string[],
  "notes": string[],
  "warnings": string[],
  "clarifications": [{"kind":"confirm"|"choice","question":string,"options":string[]}]
}

Quy tắc:
- MẶC ĐỊNH là "proceed": tự chọn giả định hợp lý rồi soạn đề luôn, KHÔNG hỏi lại.
  Thiếu môn/lớp/số câu/thời lượng thì tự điền theo ngữ cảnh (ưu tiên đề đang mở;
  không có gì thì mặc định Toán – lớp 9 – 15 phút – 3 câu), ghi giả định vào "notes"
  và nêu ngắn gọn trong "reply" để giáo viên biết mà chỉnh.
- "action": chọn "append" CHỈ khi đề đang mở đã có nội dung và giáo viên yêu cầu thêm/chèn/nối tiếp câu mới vào cuối đề; chọn "replace" khi soạn mới hoàn toàn hoặc sửa/viết lại đề hiện tại.
- Chỉ dùng "clarify" khi yêu cầu mơ hồ tới mức soạn ra chắc chắn sai hẳn
  (ví dụ "làm đề đi" mà không nêu môn, và đề đang mở cũng trống).
  Mỗi clarification phải có ít nhất 2 lựa chọn.
- "reject" khi yêu cầu nằm ngoài phạm vi soạn/sửa đề thi.
- Khi operations chứa "chat" thì bắt buộc có template_prompt, và template_prompt
  phải ghi rõ các giả định đã chọn để bước soạn đề bám theo.
- "ui_action" hoặc "direct_reply" thì template_prompt phải rỗng và operations phải rỗng.
- "steps": 2 đến 4 dòng ngắn (mỗi dòng dưới 60 ký tự) mô tả việc bạn SẼ LÀM, ở thể
  đang làm, để hiện cho giáo viên trong lúc chờ. Viết cụ thể theo yêu cầu này, ví dụ:
  ["Đọc đề đang mở", "Soạn 6 câu tự luận", "Dựng 2 hình", "Trình bày theo mẫu A4"].
  Không viết chung chung kiểu "Xử lý yêu cầu", không nhắc tới JSON hay mô hình.`;

export async function plan(
  body: ChatExamPlanRequest,
  signal?: AbortSignal,
): Promise<{ plan: ChatExamPlan; model: string }> {
  const message = (body.message ?? '').trim();
  if (!message && !body.selection?.trim()) {
    throw new PlanError('Chưa có nội dung để lập kế hoạch.', 'plan_missing_message');
  }

  const compactedExam = body.exam?.content ? stripTags(compactHtmlForAi(body.exam.content)).slice(0, 6000) : '';
  const context = [
    compactedExam ? `Đề đang mở:\n${compactedExam}` : '',
    body.selection?.trim() ? `Đoạn đang chọn:\n${body.selection.slice(0, 1500)}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const { text, model } = await complete({
    signal,
    reasoning: body.reasoning,
    json: true,
    messages: [
      { role: 'system', content: SYSTEM },
      ...(body.plannerHistory ?? []),
      { role: 'user', content: context ? `${message}\n\n---\n${context}` : message },
    ],
  });

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(extractJson(text)) as Record<string, unknown>;
  } catch {
    throw new PlanError('Bước lập kế hoạch trả về dữ liệu không đọc được.', 'planner_parse');
  }

  const parsed = normalize(raw);
  validate(parsed);
  return { plan: parsed, model };
}

export class PlanError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

function extractJson(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  return start >= 0 && end > start ? text.slice(start, end + 1) : text;
}

function str(v: unknown, fallback = '') {
  return typeof v === 'string' ? v : fallback;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function normalize(raw: Record<string, unknown>): ChatExamPlan {
  const decision = (
    ['proceed', 'clarify', 'confirm', 'reject'].includes(str(raw.decision))
      ? str(raw.decision)
      : 'proceed'
  ) as PlanDecision;

  const taskKind = (
    ['generate', 'ui_action', 'direct_reply'].includes(str(raw.task_kind))
      ? str(raw.task_kind)
      : 'generate'
  ) as TaskKind;

  const clarifications: Clarification[] = Array.isArray(raw.clarifications)
    ? raw.clarifications
        .filter((c): c is Record<string, unknown> => !!c && typeof c === 'object')
        .map((c): Clarification => ({
          kind: str(c.kind) === 'confirm' ? 'confirm' : 'choice',
          question: str(c.question),
          options: strArray(c.options),
        }))
        .filter((c) => c.question.trim())
    : [];

  const rawAction = str(raw.action);
  const action: ChatExamAction | undefined =
    rawAction === 'append' || rawAction === 'replace' ? rawAction : undefined;

  return {
    decision,
    taskKind,
    ...(action ? { action } : {}),
    templatePrompt: str(raw.template_prompt),
    operations: strArray(raw.operations),
    reply: str(raw.reply),
    summary: str(raw.summary),
    steps: strArray(raw.steps).map((step) => step.trim().slice(0, 60)).filter(Boolean).slice(0, 4),
    notes: strArray(raw.notes),
    warnings: strArray(raw.warnings),
    clarifications,
  };
}

function validate(plan: ChatExamPlan) {
  if (plan.decision === 'clarify') {
    const bad =
      plan.clarifications.length === 0 || plan.clarifications.some((c) => c.options.length < 2);
    if (bad) {
      throw new PlanError(
        'Agent điều phối chưa gửi câu hỏi làm rõ hợp lệ.',
        'plan_invalid_clarification',
      );
    }
    return;
  }

  if (plan.decision === 'reject') return;

  const uiLike = plan.taskKind === 'ui_action' || plan.taskKind === 'direct_reply';
  if (uiLike) {
    if (plan.templatePrompt.trim() || plan.operations.length) {
      throw new PlanError(
        'Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.',
        'plan_invalid_ui_action',
      );
    }
    return;
  }

  // proceed: generating content requires a prompt for the generator.
  if (plan.operations.includes('chat') && !plan.templatePrompt.trim()) {
    throw new PlanError('Bước lập kế hoạch không trả về lời nhắc nào.', 'plan_missing_prompt');
  }
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
