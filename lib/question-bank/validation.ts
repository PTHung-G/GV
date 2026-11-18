import { BANK_LIMITS, type BankCandidate, type BankNode, type BankSource, type SourceBlock } from './types';

/** Public, sanitized validation error; safe to use in browser and server callers. */
export class BankError extends Error {
  constructor(public status: number, public code: string, message = 'Dữ liệu kho câu hỏi không hợp lệ.') {
    super(message);
    this.name = 'BankError';
  }
}
function invalid(code: string): never { throw new BankError(400, code); }
function limit(code: string): never { throw new BankError(413, code, 'Dữ liệu vượt giới hạn kho câu hỏi.'); }
const record = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};
function keys(value: Record<string, unknown>, expected: string[], code: string) {
  const actual = Object.keys(value);
  if (actual.length !== expected.length || actual.some(key => !expected.includes(key)) || expected.some(key => !Object.hasOwn(value, key))) invalid(code);
}
function label(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) invalid('INVALID_LABEL');
  if (value.length > BANK_LIMITS.labelChars) limit('LABEL_LIMIT');
}
function safeId(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value) || ['__proto__', 'prototype', 'constructor'].includes(value)) invalid('INVALID_ID');
}

// Ignore only whitespace and simple structural wrappers. Media, math, comments,
// custom/data attributes and unrecognised markup must belong to a source block.
function wrapperOnly(html: string): boolean {
  const wrappers = new Set(['div', 'section', 'article', 'main', 'header', 'footer', 'p', 'span', 'ol', 'ul', 'li', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'u', 'br']);
  const token = /<\/?([a-z][a-z0-9]*)(\s+(?:(?:class|id)\s*=\s*(?:"[^"]*"|'[^']*')\s*)*)?\s*\/?\s*>/gi;
  let previous = 0;
  for (const match of html.matchAll(token)) {
    if (!wrappers.has(match[1].toLowerCase()) || !white(html.slice(previous, match.index))) return false;
    previous = match.index! + match[0].length;
  }
  return white(html.slice(previous));
}
function white(value: string) { return /^(?:\s|&nbsp;|&#160;|&#x[aA]0;)*$/.test(value); }

/** Verify immutable, ordered source ranges without normalising or rewriting HTML. */
export function validateBlocks(rawHtml: string, blocks: SourceBlock[]): void {
  if (typeof rawHtml !== 'string' || !Array.isArray(blocks)) invalid('INVALID_SOURCE');
  if (rawHtml.length > BANK_LIMITS.sourceChars) limit('SOURCE_LIMIT');
  if (!rawHtml.trim() || !blocks.length) invalid('EMPTY_SOURCE');
  let end = 0;
  for (const block of blocks) {
    if (!record(block) || !Number.isInteger(block.start) || !Number.isInteger(block.end) || block.start < end || block.start < 0 || block.end <= block.start || block.end > rawHtml.length || typeof block.html !== 'string' || typeof block.text !== 'string') invalid('INVALID_BLOCK');
    if (rawHtml.slice(block.start, block.end) !== block.html) invalid('BLOCK_MISMATCH');
    if (!wrapperOnly(rawHtml.slice(end, block.start))) invalid('SOURCE_COVERAGE');
    end = block.end;
  }
  if (!wrapperOnly(rawHtml.slice(end))) invalid('SOURCE_COVERAGE');
}
function indices(value: unknown, blockCount: number, nonempty = false): number[] {
  if (!Array.isArray(value) || (nonempty && !value.length)) invalid('INVALID_BLOCK_IDS');
  const seen = new Set<number>();
  for (const id of value) {
    if (!Number.isInteger(id) || id < 0 || id >= blockCount || seen.has(id)) invalid('INVALID_BLOCK_IDS');
    seen.add(id);
  }
  return [...seen].sort((a, b) => a - b);
}

/**
 * Legacy callers keep the historical conservative fallback. Production extraction
 * opts into explicit coverage: no implicit context and no silently dropped blocks.
 * ignoredBlockIds is a model assertion of chrome only, never a content rewrite;
 * semantic review is still needed for text falsely called chrome. Rich media/math
 * cannot be ignored even when it has no accessible text. Original blocks survive.
 */
export function validateCandidates(blocks: SourceBlock[], input: unknown, policy: 'legacy' | 'explicit' = 'legacy'): BankCandidate[] {
  if (!Array.isArray(blocks) || !blocks.length || !record(input)) invalid('INVALID_CANDIDATES');
  // Older complete {questions} responses remain safe: absence of ignored IDs
  // means none ignored, never permission to synthesize dependencies.
  const hasIgnored = Object.hasOwn(input, 'ignoredBlockIds');
  keys(input, policy === 'explicit' && hasIgnored ? ['questions', 'ignoredBlockIds'] : ['questions'], 'INVALID_CANDIDATES');
  const ignored = policy === 'explicit' && hasIgnored ? indices(input.ignoredBlockIds, blocks.length) : [];
  for (const id of ignored) {
    if (/<(?:img|svg|math|figure|table|video|audio|canvas|object|embed|iframe)\b|data-(?:latex|math|formula)|\\\(|\\\[|\$[^$]+\$/i.test(blocks[id].html)) invalid('IGNORED_CONTENT');
  }
  if (!Array.isArray(input.questions) || !input.questions.length) invalid('INVALID_CANDIDATES');
  if (input.questions.length > BANK_LIMITS.questions) limit('QUESTION_LIMIT');
  const bodies = new Set<number>();
  const candidates = input.questions.map((question, index) => {
    if (!record(question)) invalid('INVALID_CANDIDATE');
    keys(question, ['label', 'bodyBlockIds', 'contextBlockIds'], 'INVALID_CANDIDATE');
    label(question.label);
    const bodyBlockIds = indices(question.bodyBlockIds, blocks.length, true);
    const contextBlockIds = indices(question.contextBlockIds, blocks.length);
    for (const id of bodyBlockIds) {
      if (bodies.has(id) || contextBlockIds.includes(id)) invalid('OVERLAPPING_BODY');
      bodies.add(id);
    }
    return { id: `candidate-${index + 1}`, label: question.label, bodyBlockIds, contextBlockIds };
  });
  if (policy === 'explicit') {
    const referenced = new Set(candidates.flatMap(q => [...q.bodyBlockIds, ...q.contextBlockIds]));
    if (ignored.some(id => referenced.has(id))) invalid('IGNORED_REFERENCED_BLOCK');
    if (blocks.some((_, id) => !referenced.has(id) && !ignored.includes(id))) invalid('CANDIDATE_COVERAGE');
  } else {
    const unallocated = blocks.map((_, id) => id).filter(id => !bodies.has(id));
    for (const candidate of candidates) candidate.contextBlockIds = [...new Set([...candidate.contextBlockIds, ...unallocated])].sort((a, b) => a - b);
  }
  return candidates;
}

/** Original fragments in source order; duplicates across body/context appear once. */
export function questionHtml(source: BankSource, question: Pick<BankCandidate, 'bodyBlockIds' | 'contextBlockIds'>): string {
  if (!record(source) || !Array.isArray(source.blocks) || !record(question)) invalid('INVALID_SOURCE');
  // Duplicates in materialization are harmless and intentionally deduplicated.
  if (!Array.isArray(question.bodyBlockIds) || !question.bodyBlockIds.length || !Array.isArray(question.contextBlockIds)) invalid('INVALID_BLOCK_IDS');
  const ids = [...new Set([...question.bodyBlockIds, ...question.contextBlockIds])];
  indices(ids, source.blocks.length, true);
  return ids.sort((a, b) => source.blocks[a].start - source.blocks[b].start).map(id => {
    const block = source.blocks[id];
    if (!block || typeof block.html !== 'string' || !Number.isInteger(block.start) || !Number.isInteger(block.end) || block.start < 0 || block.end <= block.start || source.rawHtml.slice(block.start, block.end) !== block.html) invalid('BLOCK_MISMATCH');
    return block.html;
  }).join('');
}

/** Root is depth zero; a root-to-leaf path may contain at most 12 edges. */
export function validateTree(nodes: BankNode[], questions: Array<{ id: string; topicId: string }>): void {
  if (!Array.isArray(nodes) || !Array.isArray(questions) || !nodes.length) invalid('INVALID_TREE');
  if (nodes.length > BANK_LIMITS.nodes) limit('NODE_LIMIT');
  if (questions.length > BANK_LIMITS.questions) limit('QUESTION_LIMIT');
  const byId = new Map<string, BankNode>();
  const siblings = new Map<string | null, Set<string>>();
  for (const node of nodes) {
    if (!record(node)) invalid('INVALID_NODE');
    safeId(node.id);
    label(node.label);
    if (node.parentId !== null) safeId(node.parentId);
    if (byId.has(node.id)) invalid('DUPLICATE_NODE');
    if ((node.id === 'root') !== (node.parentId === null)) invalid('INVALID_ROOT');
    const names = siblings.get(node.parentId) ?? new Set<string>();
    const name = node.label.trim().normalize('NFC').toLocaleLowerCase('vi');
    if (names.has(name)) invalid('DUPLICATE_LABEL');
    names.add(name);
    siblings.set(node.parentId, names);
    byId.set(node.id, node);
  }
  if (!byId.has('root')) invalid('INVALID_ROOT');
  for (const node of nodes) {
    const visited = new Set<string>();
    let current = node;
    let depth = 0;
    while (current.parentId !== null) {
      if (visited.has(current.id)) invalid('TREE_CYCLE');
      visited.add(current.id);
      const parent = byId.get(current.parentId);
      if (!parent) invalid('INVALID_PARENT');
      current = parent;
      if (++depth > BANK_LIMITS.depth) limit('DEPTH_LIMIT');
    }
  }
  const ids = new Set<string>();
  for (const question of questions) {
    if (!record(question)) invalid('INVALID_QUESTION');
    safeId(question.id);
    safeId(question.topicId);
    if (ids.has(question.id)) invalid('DUPLICATE_QUESTION');
    if (!byId.has(question.topicId)) invalid('INVALID_TOPIC');
    ids.add(question.id);
  }
}

/** Includes self. Unknown IDs return empty; cycle-safe even for unvalidated input. */
export function descendantIds(nodes: BankNode[], id: string): Set<string> {
  const result = new Set<string>();
  if (!nodes.some(node => node.id === id)) return result;
  const children = new Map<string, string[]>();
  for (const node of nodes) {
    if (node.parentId !== null) children.set(node.parentId, [...(children.get(node.parentId) ?? []), node.id]);
  }
  const pending = [id];
  while (pending.length) {
    const next = pending.pop()!;
    if (result.has(next)) continue;
    result.add(next);
    pending.push(...(children.get(next) ?? []));
  }
  return result;
}
