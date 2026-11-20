import { randomUUID } from 'node:crypto';
import type { PoolClient } from 'pg';
import { queryOne, withTransaction } from './db';
import { HttpError } from './http';
import { compactHtmlForAi } from '@/lib/html-sanitize';
import { validateStructure, reconcileStructure, type StructuredExam } from '@/lib/structured-exam';

export type ConversationStatus = 'running' | 'completed' | 'failed' | 'cancelled' | 'interrupted';
export type ConversationMessage = {
  id: string; role: 'user' | 'assistant'; text: string;
  failed?: boolean; payload?: { html: string; action: 'replace' | 'append'; structure?: StructuredExam };
  issues?: string[]; applied?: boolean; status?: ConversationStatus;
  startedAt?: number;
  generationClaimed?: boolean;
};
export type Conversation = { id: string; docId: string; messages: ConversationMessage[]; revision: number };
type Row = { id: string; doc_id: string; messages: ConversationMessage[]; revision: string | number };
const MAX_TEXT = 24000;
const MAX_HTML = 300000;
const STALE_MS = 5 * 60 * 1000;
const missing = () => new HttpError(404, 'Không tìm thấy hội thoại.', 'conversation_not_found');
function invalid(message = 'Dữ liệu hội thoại không hợp lệ.'): never { throw new HttpError(400, message, 'invalid_conversation'); }
export function conversationDocId(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 200 || /[\u0000-\u001f]/.test(value)) invalid('Mã tài liệu không hợp lệ.');
  return value;
}
export function conversationId(value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) invalid('Mã hội thoại không hợp lệ.');
  return value;
}
function turnKey(value: unknown): string {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(value)) invalid('Mã lượt chat không hợp lệ.');
  return value;
}
function output(row: Row): Conversation { return { id: row.id, docId: row.doc_id, messages: row.messages, revision: Number(row.revision) }; }
async function save(client: PoolClient, row: Row) {
  const result = await client.query<Row>('update ai_conversations set messages=$2::jsonb, revision=revision+1, updated_at=now() where id=$1 returning id,doc_id,messages,revision', [row.id, JSON.stringify(row.messages)]);
  return result.rows[0];
}
async function recover(client: PoolClient, row: Row): Promise<Row> {
  let changed = false;
  row.messages = row.messages.map((m) => {
    if (m.status !== 'running' || (m.startedAt && Date.now() - m.startedAt <= STALE_MS)) return m;
    changed = true;
    return { ...m, status: 'interrupted', failed: true, text: m.text || 'Lượt chat đã bị gián đoạn. Vui lòng gửi lại yêu cầu.' };
  });
  return changed ? save(client, row) : row;
}
async function ownedRow(client: PoolClient, owner: string, id: string) {
  const result = await client.query<Row>('select id,doc_id,messages,revision from ai_conversations where id=$1 and owner_id=$2 for update', [conversationId(id), owner]);
  if (!result.rows[0]) throw missing();
  return recover(client, result.rows[0]);
}

/** Bounded model context: at most 12 user/assistant pairs and 24,000 characters. */
export function boundedConversationHistory(messages: ConversationMessage[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  const userIndexes = messages.flatMap((m, index) => m.role === 'user' ? [index] : []);
  const first = userIndexes.length ? userIndexes[Math.max(0, userIndexes.length - 12)] : messages.length;
  const eligible = messages.slice(first).filter((m) => m.role === 'user' || (m.status === 'completed' && !m.failed));
  const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  let remaining = MAX_TEXT;
  for (const m of eligible.slice(-24).reverse()) {
    const compactedHtml = m.payload?.html ? compactHtmlForAi(m.payload.html) : '';
    const raw = m.role === 'assistant' && compactedHtml ? `${m.text}\nBản nháp đã tạo:\n${compactedHtml}` : m.text;
    if (!raw || remaining <= 0) continue;
    const content = raw.slice(0, remaining);
    history.unshift({ role: m.role, content });
    remaining -= content.length;
  }
  return history;
}

/** Owner supplied from requireUser(), never trusted from the request body. */
export async function ownedConversationHistory(userId: string, id: string) {
  return withTransaction(async (client) => boundedConversationHistory((await ownedRow(client, userId, id)).messages));
}

export async function getConversation(userId: string, doc: string, selectedId?: string, fresh = false) {
  const docId = conversationDocId(doc);
  if (selectedId) conversationId(selectedId);
  return withTransaction(async (client) => {
    // A head row serializes first creation and concurrent 'new conversation' requests.
    await client.query('insert into ai_conversation_heads(owner_id,doc_id) values($1,$2) on conflict do nothing', [userId, docId]);
    const head = (await client.query<{ conversation_id: string | null }>('select conversation_id from ai_conversation_heads where owner_id=$1 and doc_id=$2 for update', [userId, docId])).rows[0];
    let row: Row;
    if (selectedId && !fresh) {
      row = await ownedRow(client, userId, selectedId);
      if (row.doc_id !== docId) throw missing();
    } else if (head.conversation_id && !fresh) {
      row = await ownedRow(client, userId, head.conversation_id);
    } else {
      if (head.conversation_id) {
        const old = await ownedRow(client, userId, head.conversation_id);
        let changed = false;
        old.messages = old.messages.map((m) => {
          if (m.status !== 'running') return m;
          changed = true;
          return { ...m, status: 'cancelled', text: m.text || 'Đã hủy khi bắt đầu hội thoại mới.' };
        });
        if (changed) await save(client, old);
      }
      row = (await client.query<Row>('insert into ai_conversations(id,owner_id,doc_id) values($1,$2,$3) returning id,doc_id,messages,revision', [randomUUID(), userId, docId])).rows[0];
      await client.query('update ai_conversation_heads set conversation_id=$3 where owner_id=$1 and doc_id=$2', [userId, docId, row.id]);
    }
    const list = await client.query<{ id: string; created_at: Date; updated_at: Date; message_count: number; preview: string | null }>(`select id,created_at,updated_at,jsonb_array_length(messages) as message_count, messages->0->>'text' as preview from ai_conversations where owner_id=$1 and doc_id=$2 order by created_at desc limit 50`, [userId, docId]);
    return { conversation: output(row), conversations: list.rows.map((r) => ({ id: r.id, docId, createdAt: r.created_at, updatedAt: r.updated_at, messageCount: r.message_count, preview: (r.preview ?? '').slice(0, 120), current: r.id === (fresh || !head.conversation_id ? row.id : head.conversation_id) })) };
  });
}

export async function startConversationTurn(userId: string, id: string, input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid();
  const body = input as Record<string, unknown>;
  const turnId = turnKey(body.turnId);
  if (typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > MAX_TEXT || body.prompt.includes('\0')) invalid('Yêu cầu phải có từ 1 đến 24.000 ký tự.');
  const prompt = body.prompt.trim();
  return withTransaction(async (client) => {
    let row = await ownedRow(client, userId, id);
    const existing = row.messages.find((m) => m.id === turnId);
    if (existing) {
      if (existing.role !== 'assistant' || row.messages.find((m) => m.id === `${turnId}-user`)?.text !== prompt) throw new HttpError(409, 'Mã lượt chat đã được dùng cho yêu cầu khác.', 'turn_conflict');
      return { messages: row.messages, history: boundedConversationHistory(row.messages), turnId, revision: Number(row.revision), deduplicated: true };
    }
    // An archived conversation can be read and marked applied but cannot acquire new turns.
    const head = await client.query('select 1 from ai_conversation_heads where owner_id=$1 and doc_id=$2 and conversation_id=$3', [userId, row.doc_id, row.id]);
    if (!head.rowCount) throw new HttpError(409, 'Hội thoại này đã được lưu trữ. Hãy dùng hội thoại hiện tại.', 'conversation_archived');
    if (row.messages.some((m) => m.status === 'running')) throw new HttpError(409, 'Một lượt chat khác đang được xử lý.', 'turn_active');
    if (row.messages.some((m) => m.id === `${turnId}-user`)) throw new HttpError(409, 'Mã lượt chat đã tồn tại.', 'turn_conflict');
    if (row.messages.length >= 1000) throw new HttpError(409, 'Hội thoại quá dài. Hãy bắt đầu hội thoại mới.', 'conversation_full');
    row.messages.push({ id: `${turnId}-user`, role: 'user', text: prompt }, { id: turnId, role: 'assistant', text: '', status: 'running', startedAt: Date.now() });
    row = await save(client, row);
    return { messages: row.messages, history: boundedConversationHistory(row.messages), turnId, revision: Number(row.revision), deduplicated: false };
  });
}

type TurnPatch = Partial<Pick<ConversationMessage, 'text' | 'payload' | 'issues' | 'failed' | 'applied' | 'status'>>;
function validatePatch(input: unknown): TurnPatch {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid();
  const b = input as Record<string, unknown>;
  if (!Object.keys(b).length || Object.keys(b).some((k) => !['text','payload','issues','failed','applied','status'].includes(k))) invalid();
  if (b.text !== undefined && (typeof b.text !== 'string' || b.text.length > MAX_TEXT || b.text.includes('\0'))) invalid('Phản hồi quá dài hoặc không hợp lệ.');
  for (const k of ['failed','applied']) if (b[k] !== undefined && typeof b[k] !== 'boolean') invalid();
  if (b.status !== undefined && !['running','completed','failed','cancelled','interrupted'].includes(b.status as string)) invalid();
  if (b.issues !== undefined && (!Array.isArray(b.issues) || b.issues.length > 50 || b.issues.some((v) => typeof v !== 'string' || v.length > 1000 || v.includes('\0')))) invalid();
  if (b.payload !== undefined) {
    const p = b.payload as Record<string, unknown>;
    if (!p || typeof p !== 'object' || Array.isArray(p) || typeof p.html !== 'string' || p.html.length > MAX_HTML || p.html.includes('\0') || !['append','replace'].includes(p.action as string) || Object.keys(p).some((k) => !['html','action','structure'].includes(k))) invalid('Bản nháp vượt giới hạn hoặc không hợp lệ.');
    if (Object.hasOwn(p, 'structure')) {
      try {
        const structure = validateStructure(p.structure);
        if (!reconcileStructure(p.html as string, structure)) invalid('Cấu trúc bản nháp không khớp nội dung.');
      } catch { invalid('Cấu trúc bản nháp không hợp lệ hoặc không khớp nội dung.'); }
    }
  }
  return b as TurnPatch;
}

export async function patchConversationTurn(userId: string, id: string, key: string, input: unknown) {
  const turnId = turnKey(key);
  const patch = validatePatch(input);
  return withTransaction(async (client) => {
    let row = await ownedRow(client, userId, id);
    const message = row.messages.find((m) => m.id === turnId && m.role === 'assistant');
    if (!message) throw new HttpError(404, 'Không tìm thấy lượt chat.', 'turn_not_found');
    const appliedOnly = Object.keys(patch).every((k) => k === 'applied');
    if (message.status !== 'running') {
      if (message.status === 'completed' && appliedOnly) {
        if (message.applied && patch.applied) return { message, messages: row.messages, revision: Number(row.revision), deduplicated: true };
        if (message.applied && patch.applied === false) throw new HttpError(409, 'Bản nháp đã được áp dụng.', 'already_applied');
        Object.assign(message, patch);
        row = await save(client, row);
        return { message, messages: row.messages, revision: Number(row.revision) };
      }
      // Idempotent terminal retries do not change content, particularly after cancellation.
      if (patch.status === message.status && Object.entries(patch).every(([k,v]) => JSON.stringify(message[k as keyof ConversationMessage]) === JSON.stringify(v))) return { message, messages: row.messages, revision: Number(row.revision) };
      throw new HttpError(409, 'Lượt chat đã kết thúc hoặc bị hủy; không thể ghi đè kết quả.', 'turn_terminal');
    }
    if (patch.applied && patch.status !== 'completed' && !appliedOnly) invalid('Chỉ có thể áp dụng bản nháp đã hoàn thành.');
    if (appliedOnly) invalid('Lượt chat chưa hoàn thành.');
    const status = patch.status ?? (patch.failed ? 'failed' : 'completed');
    if (status === 'completed' && patch.failed === true) invalid();
    if (status === 'running' && (patch.failed || patch.applied)) invalid();
    Object.assign(message, patch, { status, failed: status === 'failed' || status === 'interrupted' });
    row = await save(client, row);
    return { message, messages: row.messages, revision: Number(row.revision) };
  });
}

/** Serialize generator admission: replayed HTTP requests must not purchase a second model run. */
export async function claimConversationGeneration(userId: string, id: string, turnId: string) {
  return withTransaction(async client => {
    const row = await ownedRow(client, userId, id);
    const message = row.messages.find(m => m.id === turnKey(turnId) && m.role === 'assistant');
    if (!message || message.status !== 'running') throw new HttpError(409, 'Lượt chat không còn đang chạy.', 'turn_terminal');
    if (message.generationClaimed) throw new HttpError(409, 'Lượt chat này đã bắt đầu soạn đề. Hãy chờ kết quả hoặc dừng rồi thử lại.', 'generation_started');
    message.generationClaimed = true;
    await save(client, row);
  });
}

export async function assertConversationTurnRunning(userId: string, id: string, turnId: string) {
  const row = await queryOne<Pick<Row, 'messages'>>(
    'select messages from ai_conversations where id=$1 and owner_id=$2',
    [conversationId(id), userId],
  );
  if (!row) throw missing();
  const message = row.messages.find(m => m.id === turnKey(turnId) && m.role === 'assistant');
  if (!message || message.status !== 'running') throw new HttpError(409, 'Lượt chat không còn đang chạy.', 'turn_terminal');
}
