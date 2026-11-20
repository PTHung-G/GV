import { createHash, randomUUID } from 'node:crypto';
import type { PoolClient } from 'pg';
import { query, queryOne, withTransaction } from './db';
import { HttpError } from './http';
import {
  BANK_LIMITS,
  emptyBank,
  type BankCandidate,
  type BankEnvelope,
  type BankNode,
  type BankQuestion,
  type BankQuestionType,
  type BankRubricStep,
  type BankSource,
  type BankState,
  type SourceBlock,
  type WorkState,
} from '@/lib/question-bank/types';
import { validateBlocks, validateTree } from '@/lib/question-bank/validation';
import { nativeCandidates, validateStructure, type StructuredExam } from '@/lib/structured-exam';
import { formatTfStatements, parsePoints, parseTfStatements, type AnswerKeyQuestion } from '@/lib/grading/rubric';
import { examContentHash } from '@/lib/exam-revision';
import { renderAnswerKeyHtml } from '@/lib/grading/answer-key-render';
import { sourceFragment } from '@/components/question-bank/source-snapshot';
import { createDocumentPair } from './documents-store';
import type { ExamDoc } from '@/lib/docs-store';
import { parseFragment, serialize } from 'parse5';

type BlockRange = { start: number; end: number; text: string };

type OrgRow = {
  status: BankState['organization']['status'];
  error: string | null;
  lease_token: string | null;
  lease_until: string | number | null;
  attempts: number;
  revision: string | number;
};

type TopicRow = {
  id: string;
  label: string;
  parent_id: string | null;
  is_locked: boolean;
  scope_note: string | null;
};

type SourceRow = {
  id: string;
  operation_key: string;
  payload_hash: string | null;
  doc_id: string;
  title: string;
  raw_html: string;
  hash: string;
  block_ranges: BlockRange[];
  status: WorkState;
  error: string | null;
  candidates: BankCandidate[];
  preview_version: string;
  confirmed_ids: string[];
  extraction_mode: 'native' | 'ai';
  structure: StructuredExam | null;
  answer_key: { content: string; questions: unknown[] } | null;
  lease_token: string | null;
  lease_until: string | number | null;
  attempts: number;
  created_at: Date;
};

type QuestionRow = {
  id: string;
  source_id: string;
  candidate_id: string;
  label: string;
  question_type: BankQuestionType | null;
  custom_html: string | null;
  body_block_ids: number[];
  context_block_ids: number[];
  topic_id: string;
  answer: string | null;
  points: string | number | null;
  rubric_steps: BankRubricStep[] | null;
  organized: boolean | null;
  created_at: Date;
};

function rowToSource(row: SourceRow): BankSource {
  const blocks: SourceBlock[] = (row.block_ranges ?? []).map((r) => ({
    start: r.start,
    end: r.end,
    html: row.raw_html.slice(r.start, r.end),
    text: r.text ?? '',
  }));
  return {
    id: row.id,
    operationKey: row.operation_key,
    ...(row.payload_hash ? { payloadHash: row.payload_hash } : {}),
    docId: row.doc_id,
    title: row.title,
    rawHtml: row.raw_html,
    hash: row.hash,
    blocks,
    createdAt: row.created_at.toISOString(),
    status: row.status,
    ...(row.error ? { error: row.error } : {}),
    candidates: row.candidates ?? [],
    previewVersion: row.preview_version,
    confirmedIds: row.confirmed_ids ?? [],
    ...(row.lease_token && row.lease_until !== null
      ? { lease: { token: row.lease_token, until: Number(row.lease_until) } }
      : {}),
    attempts: row.attempts,
    ...(row.extraction_mode ? { extractionMode: row.extraction_mode } : {}),
    ...(row.structure ? { structure: row.structure } : {}),
    answerKey: row.answer_key ?? null,
  };
}

function rowToQuestion(row: QuestionRow): BankQuestion {
  const pts = row.points === null || row.points === undefined ? null : Number(row.points);
  return {
    id: row.id,
    sourceId: row.source_id,
    candidateId: row.candidate_id,
    label: row.label,
    bodyBlockIds: row.body_block_ids ?? [],
    contextBlockIds: row.context_block_ids ?? [],
    topicId: row.topic_id,
    createdAt: row.created_at.toISOString(),
    ...(row.question_type ? { questionType: row.question_type } : {}),
    ...(row.custom_html ? { customHtml: row.custom_html } : {}),
    answer: row.answer ?? null,
    rubric: row.rubric_steps ?? null,
    points: pts !== null && Number.isFinite(pts) ? pts : null,
    ...(row.organized !== null ? { organized: row.organized } : {}),
  };
}

async function loadBank(client: PoolClient | null, ownerId: string): Promise<{ revision: number; bank: BankState }> {
  const run = async <T extends import('pg').QueryResultRow>(sql: string, params: unknown[]): Promise<T[]> => {
    if (client) return (await client.query<T>(sql, params as never[])).rows;
    return query<T>(sql, params);
  };

  const [orgRows, topicRows, sourceRows, questionRows] = await Promise.all([
    run<OrgRow>(
      `select status, error, lease_token, lease_until, attempts, revision
         from bank_org_states where owner_id = $1`,
      [ownerId],
    ),
    run<TopicRow>(
      `select id, label, parent_id, is_locked, scope_note
         from bank_topics where owner_id = $1 order by sort_order asc, id asc`,
      [ownerId],
    ),
    run<SourceRow>(
      `select id, operation_key, payload_hash, doc_id, title, raw_html, hash,
              block_ranges, status, error, candidates, preview_version, confirmed_ids,
              extraction_mode, structure, answer_key, lease_token, lease_until,
              attempts, created_at
         from bank_sources where owner_id = $1 order by sort_order asc, created_at asc`,
      [ownerId],
    ),
    run<QuestionRow>(
      `select id, source_id, candidate_id, label, question_type, custom_html,
              body_block_ids, context_block_ids, topic_id, answer, points, rubric_steps,
              organized, created_at
         from bank_questions where owner_id = $1 order by sort_order asc, created_at asc`,
      [ownerId],
    ),
  ]);

  if (!orgRows[0] && topicRows.length === 0 && sourceRows.length === 0 && questionRows.length === 0) {
    const legacy = client
      ? (await client.query<{ revision: string; state: BankState }>('select revision, state from question_banks where owner_id = $1', [ownerId])).rows[0] ?? null
      : await queryOne<{ revision: string; state: BankState }>('select revision, state from question_banks where owner_id = $1', [ownerId]);
    if (legacy) return { revision: Number(legacy.revision), bank: legacy.state };
    return { revision: 0, bank: emptyBank() };
  }

  const org = orgRows[0];
  const nodes: BankNode[] = topicRows.length
    ? topicRows.map((t) => ({
        id: t.id,
        label: t.label,
        parentId: t.parent_id,
        ...(t.is_locked ? { isLocked: true } : {}),
        ...(t.scope_note ? { scopeNote: t.scope_note } : {}),
      }))
    : emptyBank().nodes;

  return {
    revision: Number(org?.revision ?? 0),
    bank: {
      nodes,
      sources: sourceRows.map(rowToSource),
      questions: questionRows.map(rowToQuestion),
      organization: {
        status: org?.status ?? 'complete',
        ...(org?.error ? { error: org.error } : {}),
        ...(org?.lease_token && org?.lease_until !== null
          ? { lease: { token: org.lease_token, until: Number(org.lease_until) } }
          : {}),
        attempts: org?.attempts ?? 0,
      },
    },
  };
}

async function persistBank(client: PoolClient, ownerId: string, bank: BankState): Promise<number> {
  // 1. Sync topics
  const topicIds = bank.nodes.map((n) => n.id);
  if (topicIds.length === 0) {
    await client.query(`delete from bank_topics where owner_id = $1`, [ownerId]);
  } else {
    await client.query(`delete from bank_topics where owner_id = $1 and not (id = any($2::text[]))`, [ownerId, topicIds]);
    for (let i = 0; i < bank.nodes.length; i += 1) {
      const node = bank.nodes[i];
      await client.query(
        `insert into bank_topics (owner_id, id, label, parent_id, sort_order, is_locked, scope_note)
         values ($1, $2, $3, $4, $5, $6, $7)
         on conflict (owner_id, id) do update set
           label = excluded.label,
           parent_id = excluded.parent_id,
           sort_order = excluded.sort_order,
           is_locked = excluded.is_locked,
           scope_note = excluded.scope_note`,
        [ownerId, node.id, node.label, node.parentId, i, Boolean(node.isLocked), node.scopeNote ?? null],
      );
    }
  }

  // 2. Sync sources (storing only { start, end, text } ranges, never duplicating html)
  const sourceIds = bank.sources.map((s) => s.id);
  if (sourceIds.length === 0) {
    await client.query(`delete from bank_sources where owner_id = $1`, [ownerId]);
  } else {
    await client.query(`delete from bank_sources where owner_id = $1 and not (id = any($2::uuid[]))`, [ownerId, sourceIds]);
    for (let i = 0; i < bank.sources.length; i += 1) {
      const src = bank.sources[i];
      const ranges = src.blocks.map((b) => ({ start: b.start, end: b.end, text: b.text }));
      await client.query(
        `insert into bank_sources (
           owner_id, id, operation_key, payload_hash, doc_id, title, raw_html, hash,
           block_ranges, status, error, candidates, preview_version, confirmed_ids,
           extraction_mode, structure, answer_key, lease_token, lease_until, attempts,
           sort_order, created_at
         ) values (
           $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12::jsonb, $13, $14::jsonb,
           $15, $16::jsonb, $17::jsonb, $18, $19, $20, $21, $22::timestamptz
         )
         on conflict (owner_id, id) do update set
           operation_key = excluded.operation_key,
           payload_hash = excluded.payload_hash,
           doc_id = excluded.doc_id,
           title = excluded.title,
           raw_html = excluded.raw_html,
           hash = excluded.hash,
           block_ranges = excluded.block_ranges,
           status = excluded.status,
           error = excluded.error,
           candidates = excluded.candidates,
           preview_version = excluded.preview_version,
           confirmed_ids = excluded.confirmed_ids,
           extraction_mode = excluded.extraction_mode,
           structure = excluded.structure,
           answer_key = excluded.answer_key,
           lease_token = excluded.lease_token,
           lease_until = excluded.lease_until,
           attempts = excluded.attempts,
           sort_order = excluded.sort_order`,
        [
          ownerId,
          src.id,
          src.operationKey,
          src.payloadHash ?? null,
          src.docId,
          src.title,
          src.rawHtml,
          src.hash,
          JSON.stringify(ranges),
          src.status,
          src.error ?? null,
          JSON.stringify(src.candidates),
          src.previewVersion,
          JSON.stringify(src.confirmedIds),
          src.extractionMode ?? 'ai',
          src.structure ? JSON.stringify(src.structure) : null,
          src.answerKey ? JSON.stringify(src.answerKey) : null,
          src.lease?.token ?? null,
          src.lease?.until ?? null,
          src.attempts,
          i,
          src.createdAt,
        ],
      );
    }
  }

  // 3. Sync questions
  const questionIds = bank.questions.map((q) => q.id);
  if (questionIds.length === 0) {
    await client.query(`delete from bank_questions where owner_id = $1`, [ownerId]);
  } else {
    await client.query(`delete from bank_questions where owner_id = $1 and not (id = any($2::uuid[]))`, [ownerId, questionIds]);
    for (let i = 0; i < bank.questions.length; i += 1) {
      const q = bank.questions[i];
      await client.query(
        `insert into bank_questions (
           owner_id, id, source_id, candidate_id, label, question_type, custom_html,
           body_block_ids, context_block_ids, topic_id, answer, points, rubric_steps,
           organized, sort_order, created_at, updated_at
         ) values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11, $12, $13::jsonb, $14, $15, $16::timestamptz, now())
         on conflict (owner_id, id) do update set
           label = excluded.label,
           question_type = excluded.question_type,
           custom_html = excluded.custom_html,
           body_block_ids = excluded.body_block_ids,
           context_block_ids = excluded.context_block_ids,
           topic_id = excluded.topic_id,
           answer = excluded.answer,
           points = excluded.points,
           rubric_steps = excluded.rubric_steps,
           organized = excluded.organized,
           sort_order = excluded.sort_order,
           updated_at = now()`,
        [
          ownerId,
          q.id,
          q.sourceId,
          q.candidateId,
          q.label,
          q.questionType ?? 'mc',
          q.customHtml ?? null,
          JSON.stringify(q.bodyBlockIds),
          JSON.stringify(q.contextBlockIds),
          q.topicId,
          q.answer ?? null,
          q.points ?? null,
          q.rubric ? JSON.stringify(q.rubric) : null,
          q.organized ?? null,
          i,
          q.createdAt,
        ],
      );
    }
  }

  // 4. Bump org state & revision
  const updated = await client.query<{ revision: string }>(
    `update bank_org_states
        set status = $2,
            error = $3,
            lease_token = $4,
            lease_until = $5,
            attempts = $6,
            revision = revision + 1,
            updated_at = now()
      where owner_id = $1
      returning revision`,
    [
      ownerId,
      bank.organization.status,
      bank.organization.error ?? null,
      bank.organization.lease?.token ?? null,
      bank.organization.lease?.until ?? null,
      bank.organization.attempts,
    ],
  );
  return Number(updated.rows[0].revision);
}

export async function readBank(ownerId: string): Promise<BankEnvelope> {
  const { revision, bank } = await loadBank(null, ownerId);
  return { ownerId, revision, bank };
}

export async function getBankSource(ownerId: string, sourceId: string): Promise<BankSource | null> {
  const row = await queryOne<SourceRow>(
    `select id, operation_key, payload_hash, doc_id, title, raw_html, hash,
            block_ranges, status, error, candidates, preview_version, confirmed_ids,
            extraction_mode, structure, answer_key, lease_token, lease_until,
            attempts, created_at
       from bank_sources
      where owner_id = $1 and id = $2`,
    [ownerId, sourceId],
  );
  return row ? rowToSource(row) : null;
}

export async function mutateBank<T>(
  ownerId: string,
  fn: (bank: BankState, revision: number) => T,
  admitWork = false,
): Promise<{ value: T; envelope: BankEnvelope }> {
  const maxActive = Math.max(2, Number(process.env.AI_BANK_CONCURRENCY ?? 12));
  return withTransaction(async (client) => {
    if (admitWork) {
      await client.query('select pg_advisory_xact_lock(72319012)');
      const active = await client.query<{ total: number }>(
        `select count(*)::int as total from (
           select owner_id from bank_org_states where coalesce(lease_until, 0) > $1
           union
           select owner_id from bank_sources where coalesce(lease_until, 0) > $1
         ) active_owners`,
        [Date.now()],
      );
      if (active.rows[0].total >= maxActive) {
        throw new HttpError(409, `Dịch vụ đang xử lý tối đa ${maxActive} kho đồng thời. Hãy thử lại sau.`, 'service_busy');
      }
    }

    await client.query('select pg_advisory_xact_lock(hashtextextended($1, 72319))', [ownerId]);
    await client.query(
      `insert into bank_org_states (owner_id, revision)
       values ($1, 0)
       on conflict (owner_id) do nothing`,
      [ownerId],
    );
    await client.query(`select revision from bank_org_states where owner_id = $1 for update`, [ownerId]);

    const { revision, bank } = await loadBank(client, ownerId);
    const value = fn(bank, revision);
    validateTree(bank.nodes, bank.questions);
    const nextRevision = await persistBank(client, ownerId, bank);
    return { value, envelope: { ownerId, revision: nextRevision, bank } };
  });
}

function required(value: unknown, max: number, name: string): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new HttpError(400, `${name} không hợp lệ.`, 'invalid_source');
  }
  return value;
}

export async function saveSource(ownerId: string, input: Record<string, unknown>) {
  const rawHtml = required(input.rawHtml, BANK_LIMITS.sourceChars, 'Nội dung');
  const operationKey = required(input.operationKey, 100, 'Mã thao tác');
  const docId = required(input.docId, 200, 'Đề nguồn');
  const title = required(input.title, 500, 'Tên đề');
  if (!Array.isArray(input.blocks)) throw new HttpError(400, 'Thiếu khối nguồn.', 'invalid_blocks');
  const blocks = input.blocks as SourceBlock[];
  validateBlocks(rawHtml, blocks);

  let structure: ReturnType<typeof validateStructure> | undefined;
  let candidates: ReturnType<typeof nativeCandidates> = [];
  if (input.structure !== undefined) {
    try {
      structure = validateStructure(input.structure);
      candidates = nativeCandidates(rawHtml, blocks, structure);
    } catch {
      throw new HttpError(400, 'Cấu trúc câu hỏi không khớp nguồn hiện tại. Nội dung chưa bị thay đổi.', 'invalid_structure');
    }
  }

  const hash = createHash('sha256').update(rawHtml).digest('hex');
  const payloadHash = createHash('sha256')
    .update(JSON.stringify({ docId, title, rawHtml, blocks, answerKey: input.answerKey ?? null, ...(structure ? { structure } : {}) }))
    .digest('hex');

  return mutateBank(ownerId, (bank) => {
    const old = bank.sources.find((s) => s.operationKey === operationKey);
    if (old) {
      if (old.hash !== hash || old.docId !== docId || old.payloadHash !== payloadHash) {
        throw new HttpError(409, 'Mã thao tác đã dùng cho nội dung khác.', 'operation_conflict');
      }
      return old.id;
    }
    if (bank.sources.length >= BANK_LIMITS.sources) {
      throw new HttpError(413, 'Kho đạt giới hạn 200 nguồn đã chốt.', 'source_limit');
    }
    const source: BankSource = {
      id: randomUUID(),
      operationKey,
      payloadHash,
      docId,
      title,
      rawHtml,
      hash,
      blocks,
      createdAt: new Date().toISOString(),
      status: structure ? 'review' : 'pending',
      candidates,
      previewVersion: randomUUID(),
      confirmedIds: [],
      attempts: 0,
      answerKey: null,
      extractionMode: structure ? 'native' : 'ai',
      ...(structure ? { structure } : {}),
    };
    // Preserve explicit accompanying answer-key snapshot without guessing question mapping.
    const key = input.answerKey as Record<string, unknown> | undefined;
    if (key && typeof key.content === 'string' && key.content.length <= BANK_LIMITS.sourceChars && Array.isArray(key.questions)) {
      source.answerKey = { content: key.content, questions: key.questions };
    }
    bank.sources.push(source);
    return source.id;
  });
}

function matchKeyForCandidate(
  questions: unknown[],
  candLabel: string,
  candIndex: number,
  totalCandidates: number,
): AnswerKeyQuestion | null {
  if (!Array.isArray(questions) || questions.length === 0) return null;
  const typed = questions as AnswerKeyQuestion[];
  if (typed.length === totalCandidates && typed[candIndex]) {
    return typed[candIndex];
  }
  const numMatch = /(?:Câu|Bài)\s*(\d+)/i.exec(candLabel) ?? /^(\d+)[.:)]?/.exec(candLabel.trim());
  if (!numMatch) return typed[candIndex] ?? null;
  const n = numMatch[1];
  return (
    typed.find((k) => {
      const km = /(\d+)/.exec(String(k.label ?? ''));
      return km?.[1] === n;
    }) ?? null
  );
}

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildAssembledKeyHtml(questions: AnswerKeyQuestion[]): string {
  const mcs = questions.filter((q) => (q.type ?? 'mc') === 'mc' && !q.steps?.length);
  const tfs = questions.filter((q) => q.type === 'tf');
  const shorts = questions.filter((q) => q.type === 'short');
  const essays = questions.filter((q) => q.type === 'essay' || Boolean(q.steps?.length));
  const parts: string[] = [];

  if (mcs.length) {
    parts.push(
      '<table data-answer-grid><thead><tr><th>Câu</th>' +
        mcs.map((q) => `<th>${escapeHtmlText(q.label)}</th>`).join('') +
        '</tr></thead><tbody><tr><td>Đáp án</td>' +
        mcs.map((q) => `<td>${escapeHtmlText(q.answer ?? '')}</td>`).join('') +
        '</tr><tr><td>Điểm</td>' +
        mcs.map((q) => `<td>${escapeHtmlText(q.points ?? '')}</td>`).join('') +
        '</tr></tbody></table>',
    );
  }
  if (tfs.length) {
    parts.push(
      '<table data-tf-grid><thead><tr><th>Câu</th><th>a</th><th>b</th><th>c</th><th>d</th><th>Điểm</th></tr></thead><tbody>' +
        tfs
          .map((q) => {
            const st = parseTfStatements(q.statements ?? q.answer) ?? { a: false, b: false, c: false, d: false };
            const cells = [st.a, st.b, st.c, st.d].map((b) => `<td>${b ? 'Đ' : 'S'}</td>`).join('');
            return `<tr><td>${escapeHtmlText(q.label)}</td>${cells}<td>${escapeHtmlText(q.points ?? '')}</td></tr>`;
          })
          .join('') +
        '</tbody></table>',
    );
  }
  if (shorts.length) {
    parts.push(
      '<table data-short-grid><thead><tr><th>Câu</th><th>Đáp án</th><th>Điểm</th></tr></thead><tbody>' +
        shorts
          .map((q) => `<tr><td>${escapeHtmlText(q.label)}</td><td>${escapeHtmlText(q.answer ?? '')}</td><td>${escapeHtmlText(q.points ?? '')}</td></tr>`)
          .join('') +
        '</tbody></table>',
    );
  }
  if (essays.length) {
    parts.push(
      '<table data-rubric><thead><tr><th>Câu</th><th>Ý chính</th><th>Điểm</th><th>Ghi chú</th></tr></thead><tbody>' +
        essays
          .map((q) => {
            const steps = q.steps?.length ? q.steps : [{ text: q.answer || 'Đáp án mẫu', points: q.points ?? '' }];
            return steps
              .map(
                (s, idx) =>
                  `<tr><td>${idx === 0 ? `${escapeHtmlText(q.label)}${q.points ? ` (${escapeHtmlText(q.points)} điểm)` : ''}` : ''}</td>` +
                  `<td>${escapeHtmlText(s.text)}</td><td>${escapeHtmlText(s.points ?? '')}</td><td></td></tr>`,
              )
              .join('');
          })
          .join('') +
        '</tbody></table>',
    );
  }
  return parts.join('\n') || '<p>Chưa có đáp án.</p>';
}

export async function confirmSource(ownerId: string, input: Record<string, unknown>) {
  return mutateBank(ownerId, (bank) => {
    const source = bank.sources.find((s) => s.id === input.sourceId);
    if (!source) throw new HttpError(404, 'Không tìm thấy nguồn.', 'source_not_found');
    if (source.previewVersion !== input.previewVersion) {
      throw new HttpError(409, 'Bản xem trước đã thay đổi. Hãy xem lại.', 'preview_changed');
    }
    if (!['review', 'complete'].includes(source.status)) {
      throw new HttpError(409, 'Nguồn chưa sẵn sàng để xác nhận.', 'source_not_ready');
    }
    if (
      !Array.isArray(input.candidateIds) ||
      !input.candidateIds.length ||
      input.candidateIds.some((id) => typeof id !== 'string' || !source.candidates.some((c) => c.id === id))
    ) {
      throw new HttpError(400, 'Hãy chọn nội dung hợp lệ.', 'invalid_selection');
    }

    const ids = [...new Set(input.candidateIds as string[])];
    const fresh = ids.filter((id) => !source.confirmedIds.includes(id));
    if (bank.questions.length + fresh.length > BANK_LIMITS.questions) {
      throw new HttpError(413, 'Kho đạt giới hạn 2.000 câu hỏi.', 'question_limit');
    }
    const keyQs = source.answerKey?.questions ?? [];
    for (const id of fresh) {
      const candIdx = source.candidates.findIndex((item) => item.id === id);
      const c = source.candidates[candIdx]!;
      const matchedKey = matchKeyForCandidate(keyQs, c.label, candIdx, source.candidates.length);
      let questionType: BankQuestionType | undefined;
      let answer: string | null = null;
      let points: number | null = null;
      let rubric: BankRubricStep[] | null = null;

      if (matchedKey) {
        const tfParsed =
          matchedKey.type === 'tf' || (!matchedKey.type && !matchedKey.steps?.length)
            ? parseTfStatements(matchedKey.statements ?? matchedKey.answer)
            : null;
        if (tfParsed) {
          questionType = 'tf';
          answer = formatTfStatements(tfParsed);
        } else if (matchedKey.type === 'short') {
          questionType = 'short';
          answer = matchedKey.answer ? String(matchedKey.answer).trim() : null;
        } else if (matchedKey.type === 'essay' || Boolean(matchedKey.steps?.length)) {
          questionType = 'essay';
          answer = matchedKey.answer ? String(matchedKey.answer).trim() : null;
          if (matchedKey.steps?.length) {
            rubric = matchedKey.steps.map((s) => ({
              text: s.text,
              ...(s.points ? { points: s.points } : {}),
            }));
          }
        } else {
          questionType = 'mc';
          answer = matchedKey.answer ? String(matchedKey.answer).trim().toUpperCase() : null;
        }
        const parsedPts = parsePoints(matchedKey.points);
        points = parsedPts !== null ? parsedPts : null;
      }

      bank.questions.push({
        id: randomUUID(),
        sourceId: source.id,
        candidateId: id,
        label: c.label,
        bodyBlockIds: c.bodyBlockIds,
        contextBlockIds: c.contextBlockIds,
        topicId: 'root',
        createdAt: new Date().toISOString(),
        ...(questionType ? { questionType } : {}),
        answer,
        rubric,
        points,
      });
    }
    source.confirmedIds.push(...fresh);
    source.status = 'complete';
    if (fresh.length) bank.organization = { status: 'pending', attempts: 0 };
    return source.id;
  });
}

export async function updateBankQuestion(
  ownerId: string,
  questionId: string,
  patch: {
    label?: string;
    topicId?: string;
    questionType?: BankQuestionType;
    customHtml?: string | null;
    answer?: string | null;
    points?: number | null;
    rubric?: BankRubricStep[] | null;
  },
) {
  return mutateBank(ownerId, (bank) => {
    const q = bank.questions.find((item) => item.id === questionId);
    if (!q) throw new HttpError(404, 'Không tìm thấy câu hỏi.', 'question_not_found');
    if (patch.label !== undefined) {
      const label = patch.label.trim();
      if (!label || label.length > BANK_LIMITS.labelChars) {
        throw new HttpError(400, 'Nhãn câu hỏi không hợp lệ.', 'invalid_label');
      }
      q.label = label;
    }
    if (patch.topicId !== undefined) {
      if (!bank.nodes.some((n) => n.id === patch.topicId)) {
        throw new HttpError(400, 'Chủ đề không tồn tại.', 'invalid_topic');
      }
      q.topicId = patch.topicId;
    }
    if (patch.questionType !== undefined) {
      if (!['mc', 'tf', 'short', 'essay'].includes(patch.questionType)) {
        throw new HttpError(400, 'Loại câu không hợp lệ.', 'invalid_type');
      }
      q.questionType = patch.questionType;
    }
    if (patch.customHtml !== undefined) {
      q.customHtml = patch.customHtml === null ? null : patch.customHtml.slice(0, 60_000);
    }
    if (patch.answer !== undefined) {
      q.answer = patch.answer === null ? null : String(patch.answer).trim() || null;
    }
    if (patch.points !== undefined) {
      if (patch.points === null) q.points = null;
      else if (!Number.isFinite(patch.points) || patch.points < 0 || patch.points > 100) {
        throw new HttpError(400, 'Điểm câu hỏi không hợp lệ.', 'invalid_points');
      } else {
        q.points = Math.round(patch.points * 100) / 100;
      }
    }
    if (patch.rubric !== undefined) {
      q.rubric = patch.rubric;
    }
    return q;
  });
}

export async function deleteBankQuestion(ownerId: string, questionId: string) {
  return mutateBank(ownerId, (bank) => {
    const idx = bank.questions.findIndex((item) => item.id === questionId);
    if (idx < 0) throw new HttpError(404, 'Không tìm thấy câu hỏi.', 'question_not_found');
    bank.questions.splice(idx, 1);
    return questionId;
  });
}

export async function createBankTopic(
  ownerId: string,
  input: { label: string; parentId?: string | null; isLocked?: boolean },
) {
  const label = typeof input.label === 'string' ? input.label.trim() : '';
  if (!label || label.length > BANK_LIMITS.labelChars) {
    throw new HttpError(400, 'Tên chủ đề không hợp lệ.', 'invalid_label');
  }
  const parentId = input.parentId?.trim() || 'root';
  return mutateBank(ownerId, (bank) => {
    if (bank.nodes.length >= BANK_LIMITS.nodes) {
      throw new HttpError(413, 'Đạt giới hạn số chủ đề.', 'node_limit');
    }
    if (!bank.nodes.some((n) => n.id === parentId)) {
      throw new HttpError(400, 'Chủ đề cha không tồn tại.', 'invalid_parent');
    }
    const id = `topic-${randomUUID().slice(0, 12)}`;
    const node: BankNode = {
      id,
      label,
      parentId,
      ...(input.isLocked ? { isLocked: true } : {}),
    };
    bank.nodes.push(node);
    return node;
  });
}

export async function updateBankTopic(
  ownerId: string,
  topicId: string,
  patch: { label?: string; parentId?: string | null; isLocked?: boolean },
) {
  return mutateBank(ownerId, (bank) => {
    const node = bank.nodes.find((n) => n.id === topicId);
    if (!node) throw new HttpError(404, 'Không tìm thấy chủ đề.', 'topic_not_found');
    if (patch.label !== undefined) {
      const label = patch.label.trim();
      if (!label || label.length > BANK_LIMITS.labelChars) {
        throw new HttpError(400, 'Tên chủ đề không hợp lệ.', 'invalid_label');
      }
      node.label = label;
    }
    if (patch.parentId !== undefined && topicId !== 'root') {
      node.parentId = patch.parentId?.trim() || 'root';
    }
    if (patch.isLocked !== undefined && topicId !== 'root') {
      if (patch.isLocked) node.isLocked = true;
      else delete node.isLocked;
    }
    return node;
  });
}

export async function deleteBankTopic(ownerId: string, topicId: string) {
  if (topicId === 'root') {
    throw new HttpError(400, 'Không thể xoá thư mục gốc.', 'cannot_delete_root');
  }
  return mutateBank(ownerId, (bank) => {
    const target = bank.nodes.find((n) => n.id === topicId);
    if (!target) throw new HttpError(404, 'Không tìm thấy chủ đề.', 'topic_not_found');
    const fallbackParent = target.parentId ?? 'root';
    for (const child of bank.nodes) {
      if (child.parentId === topicId) child.parentId = fallbackParent;
    }
    for (const q of bank.questions) {
      if (q.topicId === topicId) q.topicId = fallbackParent;
    }
    bank.nodes = bank.nodes.filter((n) => n.id !== topicId);
    return topicId;
  });
}

export async function deleteBankSource(ownerId: string, sourceId: string) {
  return mutateBank(ownerId, (bank) => {
    const idx = bank.sources.findIndex((s) => s.id === sourceId);
    if (idx < 0) throw new HttpError(404, 'Không tìm thấy nguồn.', 'source_not_found');
    bank.sources.splice(idx, 1);
    bank.questions = bank.questions.filter((q) => q.sourceId !== sourceId);
    return sourceId;
  });
}

function renumberStemHtml(html: string, newNo: number): string {
  const replaced = html.replace(
    /^(\s*<(?:p|h[1-6])\b[^>]*>(?:\s*<(?:b|strong)\b[^>]*>)*\s*)(?:Câu|Bài)\s+\d+/iu,
    `$1Câu ${newNo}`,
  );
  if (replaced !== html) return replaced;
  const frag = parseFragment(html);
  const firstEl = frag.childNodes.find((n) => 'tagName' in n);
  if (firstEl && 'tagName' in firstEl) {
    const raw = serialize(firstEl);
    if (!/(?:Câu|Bài)\s+\d+/i.test(raw)) {
      return html;
    }
  }
  return html;
}

export async function assembleExamFromBank(
  ownerId: string,
  input: { title: string; subject?: string; grade?: number | null; questionIds: string[] },
): Promise<{ docId: string; keyDocId: string; questionCount: number }> {
  const title = typeof input.title === 'string' && input.title.trim() ? input.title.trim().slice(0, 200) : 'Đề lắp ghép từ kho';
  if (!Array.isArray(input.questionIds) || input.questionIds.length === 0 || input.questionIds.length > 200) {
    throw new HttpError(400, 'Chọn từ 1 đến 200 câu hỏi để tạo đề.', 'invalid_selection');
  }
  const envelope = await readBank(ownerId);
  const bank = envelope.bank;
  const selected = input.questionIds
    .map((id) => bank.questions.find((q) => q.id === id))
    .filter((q): q is BankQuestion => Boolean(q));
  if (selected.length === 0) {
    throw new HttpError(404, 'Không tìm thấy câu hỏi đã chọn trong kho.', 'question_not_found');
  }

  const blocks: string[] = [];
  const answerKeyQuestions: AnswerKeyQuestion[] = [];
  let prevContextKey = '';

  selected.forEach((q, idx) => {
    const src = bank.sources.find((s) => s.id === q.sourceId);
    const contextKey = q.contextBlockIds.length && !q.customHtml ? `${q.sourceId}:${q.contextBlockIds.join(',')}` : '';
    if (contextKey && contextKey !== prevContextKey && src) {
      const ctxHtml = sourceFragment(src, q.contextBlockIds);
      if (ctxHtml.trim()) blocks.push(ctxHtml);
    }
    prevContextKey = contextKey;

    const rawBody = q.customHtml?.trim()
      ? q.customHtml
      : src
        ? sourceFragment(src, q.bodyBlockIds)
        : `<p><b>Câu ${idx + 1}.</b> ${escapeHtmlText(q.label)}</p>`;
    blocks.push(renumberStemHtml(rawBody, idx + 1));

    const ptsStr = q.points !== null && q.points !== undefined ? String(q.points).replace('.', ',') : undefined;
    answerKeyQuestions.push({
      label: `Câu ${idx + 1}`,
      type: q.questionType ?? 'mc',
      answer: q.answer ?? '',
      ...(ptsStr ? { points: ptsStr } : {}),
      ...(q.rubric?.length ? { steps: q.rubric } : {}),
    });
  });

  const examContent = `<h1>${escapeHtmlText(title)}</h1>\n${blocks.join('\n')}`;
  const keyContent = buildAssembledKeyHtml(answerKeyQuestions);
  const now = new Date().toISOString();
  const docId = `doc-${randomUUID().slice(0, 12)}`;
  const keyDocId = `key-${randomUUID().slice(0, 12)}`;
  const grade = typeof input.grade === 'number' && input.grade >= 1 && input.grade <= 12 ? input.grade : null;

  const examDoc: ExamDoc = {
    id: docId,
    title,
    subject: input.subject?.trim() || 'toan',
    grade,
    content: examContent,
    createdAt: now,
    updatedAt: now,
  };
  const keyDoc: ExamDoc = {
    id: keyDocId,
    kind: 'answer-key',
    parentId: docId,
    title: `Đáp án – ${title}`,
    subject: examDoc.subject,
    grade,
    content: keyContent,
    answerKeyQuestions,
    sourceContentHash: examContentHash(examContent),
    createdAt: now,
    updatedAt: now,
  };

  await createDocumentPair(ownerId, [examDoc, keyDoc]);
  return { docId, keyDocId, questionCount: selected.length };
}
