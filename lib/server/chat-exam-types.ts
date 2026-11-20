import type { StructuredExam } from '@/lib/structured-exam';

/**
 * Shared contract for the chat-exam backend.
 *
 * Mirrors the original service as recovered from source-mirror/js/180c0fplvd4t3.js
 * (the client call sites) and js/2xwqx5gh-wuz4.js (the SSE reader).
 */

/** The exam the model is asked to write, as the page renders it. */
export type ExamPayload = {
  title?: string;
  subject?: string;
  grade?: number;
  content: string;
  structure?: StructuredExam;
};

/** Planner verdict — the four branches the original client handles. */
export type PlanDecision = 'proceed' | 'clarify' | 'confirm' | 'reject';

/** `task_kind` short-circuits planning: answer or drive the UI without touching the exam. */
export type TaskKind = 'generate' | 'ui_action' | 'direct_reply';

export type Clarification = {
  kind: 'confirm' | 'choice';
  question: string;
  options: string[];
};

/** What the generator is allowed to do to the document. */
export type ChatExamAction = 'replace' | 'append';

export type ChatExamPlan = {
  decision: PlanDecision;
  taskKind: TaskKind;
  action?: ChatExamAction;
  /** Prompt handed to the generator when decision === 'proceed'. */
  templatePrompt: string;
  /** Operations to run against the editor after generation. */
  operations: string[];
  /** Required when operations includes 'chat'. */
  reply: string;
  summary: string;
  /** Short, human steps the model intends to take; shown while it works. */
  steps: string[];
  notes: string[];
  warnings: string[];
  clarifications: Clarification[];
};

export type ChatExamResult = {
  success: true;
  action: ChatExamAction;
  /** Present when action === 'replace'. */
  exam?: ExamPayload;
  /** Present when action === 'append'. */
  content?: string;
  structure?: StructuredExam;
  /** Assistant prose shown above the document actions. */
  reply: string;
  summary: string;
  warnings: string[];
};

export type ChatExamErrorBody = {
  status: number;
  success: false;
  error: string;
  code: string;
  requestId: string;
};

/** Reasoning effort the composer exposes (Nhanh / Trung bình / Kỹ). */
export type ReasoningLevel = 'fast' | 'balanced' | 'deep';

export type ChatExamRequest = {
  conversationId?: string;
  turnId?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentExam?: ExamPayload;
  examTitle?: string;
  contextSource?: 'none' | 'current_exam' | 'library' | 'both';
  intent?: string;
  action?: ChatExamAction;
  prompt?: string;
  reasoning?: ReasoningLevel;
  planned?: boolean;
  /** Steps the assistant announced, echoed so the UI can tick them off. */
  planSteps?: string[];
  libraryIds?: string[];
  contextNotes?: string[];
  agentTurnId?: string;
};

export type ChatExamPlanRequest = {
  conversationId?: string;
  turnId?: string;
  message: string;
  exam?: ExamPayload;
  selection?: string;
  requireApproval?: boolean;
  planned?: boolean;
  reasoning?: ReasoningLevel;
  plannerHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

export function errorBody(
  status: number,
  error: string,
  code: string,
  requestId: string,
): ChatExamErrorBody {
  return { status, success: false, error, code, requestId };
}

export function newRequestId() {
  return crypto.randomUUID();
}
