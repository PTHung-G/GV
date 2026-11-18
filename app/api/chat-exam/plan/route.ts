import { requireUser } from '@/lib/server/auth';
import { ownedConversationHistory, assertConversationTurnRunning, patchConversationTurn } from '@/lib/server/conversations';
import { HttpError, jsonError } from '@/lib/server/http';
import { NextRequest, NextResponse } from 'next/server';
import { plan, PlanError } from '@/lib/server/planner';
import { errorBody, newRequestId, type ChatExamPlanRequest } from '@/lib/server/chat-exam-types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch (error) { return jsonError(error); }
  const requestId = newRequestId();
  let body: ChatExamPlanRequest;
  try {
    body = (await req.json()) as ChatExamPlanRequest;
  } catch {
    return NextResponse.json(
      errorBody(400, 'Dữ liệu gửi lên không hợp lệ.', 'invalid_json', requestId),
      { status: 400 },
    );
  }

  let timer: ReturnType<typeof setInterval> | undefined;
  try {
    const controller = new AbortController();
    if (req.signal.aborted) controller.abort();
    req.signal.addEventListener('abort', () => controller.abort(), { once: true });
    if (body.conversationId) {
      if (body.turnId) {
        await assertConversationTurnRunning(user.id, body.conversationId, body.turnId);
        timer = setInterval(() => {
          void assertConversationTurnRunning(user.id, body.conversationId!, body.turnId!).catch(() => controller.abort());
        }, 2000);
      }
      const history = await ownedConversationHistory(user.id, body.conversationId);
      body.plannerHistory = history.at(-1)?.role === 'user' ? history.slice(0, -1) : history;
    } else body.plannerHistory = [];
    const { plan: result, model } = await plan(body, controller.signal);
    controller.signal.throwIfAborted();
    if (body.conversationId && body.turnId && (result.decision === 'reject' || (result.decision === 'clarify' && !result.templatePrompt))) {
      await patchConversationTurn(user.id, body.conversationId, body.turnId, { status: 'completed', text: result.reply || result.clarifications.map(q => q.question).join('\n') });
    }
    return NextResponse.json({
      success: true,
      decision: result.decision,
      taskKind: result.taskKind,
      templatePrompt: result.templatePrompt,
      operations: result.operations,
      reply: result.reply,
      summary: result.summary,
      steps: result.steps,
      notes: result.notes,
      warnings: result.warnings,
      clarifications: result.clarifications,
      plannerModel: model,
      requestId,
    });
  } catch (err) {
    if (body.conversationId && body.turnId && !(err instanceof HttpError)) {
      await patchConversationTurn(user.id, body.conversationId, body.turnId, { status: req.signal.aborted ? 'cancelled' : 'failed', text: 'Không lập được kế hoạch. Bạn có thể thử lại.' }).catch(() => {});
    }
    if (err instanceof HttpError) return jsonError(err);
    if (err instanceof PlanError) {
      const status = err.code === 'planner_parse' || err.code.startsWith('plan_invalid') ? 502 : 400;
      return NextResponse.json(errorBody(status, err.message, err.code, requestId), { status });
    }
    const message = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json(
      errorBody(502, 'Không lập được kế hoạch.', 'plan_failed', requestId),
      { status: 502 },
    );
  } finally {
    if (timer) clearInterval(timer);
  }
}
