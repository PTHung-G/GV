import { parseFragment, type DefaultTreeAdapterMap } from "parse5";
import {
  BANK_LIMITS,
  type BankCandidate,
  type SourceBlock,
} from "./question-bank/types";

/** Membership only: HTML always comes from the current editor/source, never this artifact. */
export type StructuredExam = {
  version: 1;
  blocks: { id: string }[];
  questions: {
    id: string;
    label: string;
    bodyBlockIds: string[];
    contextBlockIds: string[];
  }[];
};
export type GenerationInput = {
  blocks: { key: string; html: string }[];
  questions: {
    key: string;
    label: string;
    bodyKeys: string[];
    contextKeys: string[];
  }[];
};
export type StructuredSnapshot = { html: string; structure: StructuredExam };
export const STRUCTURED_LIMITS = {
  sourceChars: BANK_LIMITS.sourceChars,
  questions: BANK_LIMITS.questions,
  labelChars: BANK_LIMITS.labelChars,
  blocks: 20_000,
  references: 100_000,
  htmlNodes: 100_000,
  htmlDepth: 128,
} as const;
export const STRUCTURED_FALLBACK_REASON =
  "Nội dung hiện tại không còn đủ cấu trúc câu hỏi đáng tin cậy; đề vẫn được giữ nguyên và cần nhận diện lại câu hỏi.";
export class StructuredExamError extends Error {
  constructor(public code: string) {
    super("Cấu trúc đề không hợp lệ hoặc vượt giới hạn.");
    this.name = "StructuredExamError";
  }
}
function fail(code: string): never {
  throw new StructuredExamError(code);
}
function record(value: unknown, expected: string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    fail("INVALID_RECORD");
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) fail("INVALID_PROTOTYPE");
  const names = Reflect.ownKeys(value);
  if (
    names.length !== expected.length ||
    names.some((k) => typeof k !== "string" || !expected.includes(k))
  )
    fail("INVALID_KEYS");
  for (const name of expected) {
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    if (!descriptor || !("value" in descriptor)) fail("INVALID_PROPERTY");
  }
  return value as Record<string, unknown>;
}
function array(value: unknown, max: number, nonempty = false): unknown[] {
  if (
    !Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Array.prototype ||
    value.length > max ||
    (nonempty && !value.length)
  )
    fail("INVALID_ARRAY");
  // Reject sparse arrays, accessors and extra properties just like strict JSON arrays.
  if (Reflect.ownKeys(value).length !== value.length + 1) fail("INVALID_ARRAY");
  for (let i = 0; i < value.length; i++)
    if (
      !Object.getOwnPropertyDescriptor(value, String(i))?.hasOwnProperty(
        "value",
      )
    )
      fail("INVALID_ARRAY");
  return value;
}
function id(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value) ||
    ["__proto__", "prototype", "constructor"].includes(value)
  )
    fail("INVALID_ID");
  return value;
}
function label(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > STRUCTURED_LIMITS.labelChars
  )
    fail("INVALID_LABEL");
  return value;
}

/** Strict, bounded schema validation; returns a detached JSON-shaped copy or throws. */
export function validateStructure(input: unknown): StructuredExam {
  const root = record(input, ["version", "blocks", "questions"]);
  if (root.version !== 1) fail("INVALID_VERSION");
  const ids = new Set<string>();
  const blocks = array(root.blocks, STRUCTURED_LIMITS.blocks, true).map(
    (value) => {
      const block = record(value, ["id"]);
      const blockId = id(block.id);
      if (ids.has(blockId)) fail("DUPLICATE_ID");
      ids.add(blockId);
      return { id: blockId };
    },
  );
  const blockIds = new Set(ids);
  const ownedBodies = new Set<string>();
  let references = 0;
  const refs = (value: unknown, nonempty = false) => {
    const values = array(value, blocks.length, nonempty);
    references += values.length;
    if (references > STRUCTURED_LIMITS.references) fail("REFERENCE_LIMIT");
    const seen = new Set<string>();
    return values.map((value) => {
      const ref = id(value);
      if (!blockIds.has(ref) || seen.has(ref)) fail("INVALID_REFERENCE");
      seen.add(ref);
      return ref;
    });
  };
  const questions = array(
    root.questions,
    STRUCTURED_LIMITS.questions,
    true,
  ).map((value) => {
    const q = record(value, ["id", "label", "bodyBlockIds", "contextBlockIds"]);
    const questionId = id(q.id);
    if (ids.has(questionId)) fail("DUPLICATE_ID");
    ids.add(questionId);
    const bodyBlockIds = refs(q.bodyBlockIds, true);
    const contextBlockIds = refs(q.contextBlockIds);
    const context = new Set(contextBlockIds);
    for (const blockId of bodyBlockIds) {
      if (ownedBodies.has(blockId) || context.has(blockId))
        fail("OVERLAPPING_BODY");
      ownedBodies.add(blockId);
    }
    return {
      id: questionId,
      label: label(q.label),
      bodyBlockIds,
      contextBlockIds,
    };
  });
  return { version: 1, blocks, questions };
}

type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];
type AnchoredRange = { id: string; start: number; end: number };
const VOID = new Set(
  "area base br col embed hr img input link meta param source track wbr".split(
    " ",
  ),
);
const UNSAFE = new Set(
  "script style iframe object embed base link meta template form input button textarea select option frameset frame".split(
    " ",
  ),
);
const isElement = (node: Node): node is Element => "tagName" in node;
const white = (value: string) =>
  /^(?:\s|&nbsp;|&#0*160;|&#x0*a0;)*$/i.test(value);
function sourceString(html: unknown): asserts html is string {
  if (
    typeof html !== "string" ||
    !html.trim() ||
    html.length > STRUCTURED_LIMITS.sourceChars
  )
    fail("SOURCE_LIMIT");
}
/** Parse with source locations, rejecting parser repair and all non-whitespace outside roots. */
function rootsOf(html: string): Element[] {
  sourceString(html);
  let parseError = false;
  const fragment = parseFragment(html, {
    sourceCodeLocationInfo: true,
    onParseError: () => {
      parseError = true;
    },
  });
  if (parseError) fail("INVALID_HTML");
  const roots: Element[] = [];
  let end = 0;
  for (const node of fragment.childNodes) {
    if (!isElement(node)) {
      if (
        node.nodeName !== "#text" ||
        !("value" in node) ||
        !/^\s*$/.test(node.value)
      )
        fail("UNOWNED_CONTENT");
      continue;
    }
    const loc = node.sourceCodeLocation;
    if (
      !loc ||
      loc.startOffset < end ||
      !white(html.slice(end, loc.startOffset))
    )
      fail("INVALID_HTML_RANGE");
    roots.push(node);
    end = loc.endOffset;
  }
  if (
    !roots.length ||
    roots.length > STRUCTURED_LIMITS.blocks ||
    !white(html.slice(end))
  )
    fail("INVALID_HTML_COVERAGE");
  let count = 0;
  const pending = roots.map((node) => ({ node: node as Node, depth: 1 }));
  while (pending.length) {
    const { node, depth } = pending.pop()!;
    if (
      ++count > STRUCTURED_LIMITS.htmlNodes ||
      depth > STRUCTURED_LIMITS.htmlDepth
    )
      fail("HTML_LIMIT");
    if (isElement(node)) {
      const loc = node.sourceCodeLocation;
      // Implied HTML nodes (e.g. tbody) do not carry source locations. Conservatively
      // reject these: callers can normalize editor HTML before capturing it.
      if (
        !loc?.startTag ||
        (!loc.endTag &&
          !(node.namespaceURI === "http://www.w3.org/1999/xhtml"
            ? VOID.has(node.tagName)
            : /\/\s*>$/.test(
                html.slice(loc.startTag.startOffset, loc.startTag.endOffset),
              )))
      )
        fail("UNCLOSED_HTML");
      if (UNSAFE.has(node.tagName.toLowerCase())) fail("UNSAFE_HTML");
      for (const attr of node.attrs) {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on") || name === "srcdoc")
          fail("UNSAFE_ATTRIBUTE");
        if (
          ["href", "src", "action", "formaction"].includes(name) &&
          /^(?:javascript|vbscript):/i.test(
            attr.value.replace(/[\u0000-\u0020\u007f-\u009f]/g, ""),
          )
        )
          fail("UNSAFE_URL");
      }
      for (const child of node.childNodes)
        pending.push({ node: child, depth: depth + 1 });
    }
  }
  return roots;
}
function anchorsOf(html: string): AnchoredRange[] {
  const roots = rootsOf(html);
  const ranges: AnchoredRange[] = [];
  const seen = new Set<string>();
  for (const root of roots) {
    const anchor = root.attrs.find((attr) => attr.name === "data-sdt-block");
    if (!anchor) fail("MISSING_ANCHOR");
    const blockId = id(anchor.value);
    if (seen.has(blockId)) fail("DUPLICATE_ANCHOR");
    seen.add(blockId);
    const pending: Node[] = [...root.childNodes];
    while (pending.length) {
      const node = pending.pop()!;
      if (isElement(node)) {
        if (node.attrs.some((attr) => attr.name === "data-sdt-block"))
          fail("NESTED_ANCHOR");
        pending.push(...node.childNodes);
      }
    }
    const loc = root.sourceCodeLocation!;
    ranges.push({ id: blockId, start: loc.startOffset, end: loc.endOffset });
  }
  return ranges;
}
function reconcileOrThrow(
  html: string,
  input: unknown,
): { structure: StructuredExam; ranges: AnchoredRange[] } {
  const structure = validateStructure(input);
  const ranges = anchorsOf(html);
  const known = new Set(structure.blocks.map((block) => block.id));
  if (
    known.size !== ranges.length ||
    ranges.some((range) => !known.has(range.id))
  )
    fail("ANCHOR_MISMATCH");
  structure.blocks = ranges.map(({ id }) => ({ id }));
  return { structure, ranges };
}
/** Safe in-unit edits/reordering retain identity; any unprovable coverage returns null. Never rewrites HTML. */
export function reconcileStructure(
  html: string,
  structure: unknown,
): StructuredExam | null {
  try {
    return reconcileOrThrow(html, structure).structure;
  } catch {
    return null;
  }
}

/**
 * Self-heals live DOM edits inside contentEditable (e.g. pressing Enter to split
 * a `data-sdt-block`, pasting/inserting a paragraph, or deleting an extra line)
 * by minting fresh block IDs on split/new blocks and attaching them to the nearest
 * owning question, without relaxing `reconcileStructure`'s strict contract.
 */
export function healStructuredDom(
  root: { children: ArrayLike<{ getAttribute(name: string): string | null; setAttribute(name: string, val: string): void; hasAttribute(name: string): boolean }> },
  structure: StructuredExam | undefined,
  serializeHtml: () => string,
  mintId: () => string = () => globalThis.crypto.randomUUID(),
): StructuredExam | undefined {
  if (!structure) return undefined;
  const clone: StructuredExam = {
    version: 1,
    blocks: [],
    questions: structure.questions.map((q) => ({
      ...q,
      bodyBlockIds: [...q.bodyBlockIds],
      contextBlockIds: [...q.contextBlockIds],
    })),
  };

  const seenIds = new Set<string>();
  const orderedIds: string[] = [];

  const children = Array.from(root.children);
  for (const el of children) {
    if (el.hasAttribute('data-page-spacer') || el.getAttribute('data-split-part') === 't') {
      continue;
    }
    const existing = el.getAttribute('data-sdt-block');
    if (!existing || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(existing)) {
      return undefined;
    }
    if (!seenIds.has(existing)) {
      seenIds.add(existing);
      orderedIds.push(existing);
      continue;
    }

    const freshId = mintId();
    el.setAttribute('data-sdt-block', freshId);
    seenIds.add(freshId);
    orderedIds.push(freshId);

    for (const q of clone.questions) {
      const bodyIdx = q.bodyBlockIds.indexOf(existing);
      if (bodyIdx >= 0) {
        q.bodyBlockIds.splice(bodyIdx + 1, 0, freshId);
        break;
      }
      const ctxIdx = q.contextBlockIds.indexOf(existing);
      if (ctxIdx >= 0) {
        q.contextBlockIds.splice(ctxIdx + 1, 0, freshId);
        break;
      }
    }
  }

  const present = new Set(orderedIds);
  clone.blocks = orderedIds.map((blockId) => ({ id: blockId }));
  clone.questions = clone.questions
    .map((q) => ({
      ...q,
      bodyBlockIds: q.bodyBlockIds.filter((bid) => present.has(bid)),
      contextBlockIds: q.contextBlockIds.filter((cid) => present.has(cid)),
    }))
    .filter((q) => q.bodyBlockIds.length > 0);

  if (!clone.questions.length || !clone.blocks.length) return undefined;
  return reconcileStructure(serializeHtml(), clone) ?? undefined;
}

/** Materialize one element per model-local block; only the server mint function supplies IDs.
 * Injects a single attribute into each original start tag; no wrapping or reserialization. */
export function materializeGeneration(
  input: unknown,
  mintId: () => string = () => globalThis.crypto.randomUUID(),
): StructuredSnapshot {
  const root = record(input, ["blocks", "questions"]);
  const usedKeys = new Set<string>();
  let totalChars = 0;
  const blocks = array(root.blocks, STRUCTURED_LIMITS.blocks, true).map(
    (value) => {
      const b = record(value, ["key", "html"]);
      const key = id(b.key);
      if (usedKeys.has(key)) fail("DUPLICATE_KEY");
      usedKeys.add(key);
      sourceString(b.html);
      totalChars += b.html.length;
      if (totalChars > STRUCTURED_LIMITS.sourceChars) fail("SOURCE_LIMIT");
      const roots = rootsOf(b.html);
      if (roots.length !== 1) fail("MULTIPLE_BLOCK_ROOTS");
      const pending: Node[] = [roots[0]];
      while (pending.length) {
        const node = pending.pop()!;
        if (isElement(node)) {
          if (node.attrs.some((attr) => attr.name === "data-sdt-block"))
            fail("FORGED_ANCHOR");
          pending.push(...node.childNodes);
        }
      }
      return { key, html: b.html, root: roots[0] };
    },
  );
  const questions = array(
    root.questions,
    STRUCTURED_LIMITS.questions,
    true,
  ).map((value) => {
    const q = record(value, ["key", "label", "bodyKeys", "contextKeys"]);
    const key = id(q.key);
    if (usedKeys.has(key)) fail("DUPLICATE_KEY");
    usedKeys.add(key);
    return {
      key,
      label: label(q.label),
      bodyKeys: q.bodyKeys,
      contextKeys: q.contextKeys,
    };
  });
  // Validate the model-local graph before minting; a question key is not a block reference.
  const local = validateStructure({
    version: 1,
    blocks: blocks.map((b) => ({ id: b.key })),
    questions: questions.map((q) => ({
      id: q.key,
      label: q.label,
      bodyBlockIds: q.bodyKeys,
      contextBlockIds: q.contextKeys,
    })),
  });
  const minted = new Set<string>();
  const mint = () => {
    const value = id(mintId());
    if (minted.has(value)) fail("DUPLICATE_MINTED_ID");
    minted.add(value);
    return value;
  };
  const ids = new Map(blocks.map((block) => [block.key, mint()]));
  const structure = validateStructure({
    version: 1,
    blocks: blocks.map((b) => ({ id: ids.get(b.key) })),
    questions: local.questions.map((q) => ({
      id: mint(),
      label: q.label,
      bodyBlockIds: q.bodyBlockIds.map((k) => ids.get(k)),
      contextBlockIds: q.contextBlockIds.map((k) => ids.get(k)),
    })),
  });
  const html = blocks
    .map((block) => {
      const start = block.root.sourceCodeLocation!.startTag!.startOffset;
      const offset = start + 1 + block.root.tagName.length;
      return (
        block.html.slice(0, offset) +
        ` data-sdt-block="${ids.get(block.key)}"` +
        block.html.slice(offset)
      );
    })
    .join("\n");
  reconcileOrThrow(html, structure);
  return { html, structure };
}

/** Independently verify exact top-level ranges against raw source. Whitespace-only
 * splitter blocks are accepted but never attached; known chrome is not implicit context.
 * Candidate IDs are question IDs, not array indices. Throws on any submitted mismatch. */
export function nativeCandidates(
  rawHtml: string,
  blocks: SourceBlock[],
  input: unknown,
): BankCandidate[] {
  const { structure, ranges } = reconcileOrThrow(rawHtml, input);
  const values = array(blocks, STRUCTURED_LIMITS.blocks * 2 + 1, true);
  const rangeByStart = new Map(ranges.map((range) => [range.start, range]));
  const indexById = new Map<string, number>();
  let end = 0;
  for (let index = 0; index < values.length; index++) {
    const b = record(values[index], ["start", "end", "html", "text"]);
    if (
      typeof b.start !== "number" ||
      typeof b.end !== "number" ||
      !Number.isInteger(b.start) ||
      !Number.isInteger(b.end) ||
      b.start < end ||
      b.end <= b.start ||
      b.end > rawHtml.length ||
      typeof b.html !== "string" ||
      typeof b.text !== "string"
    )
      fail("INVALID_SOURCE_BLOCK");
    if (
      rawHtml.slice(b.start, b.end) !== b.html ||
      !white(rawHtml.slice(end, b.start))
    )
      fail("SOURCE_BLOCK_MISMATCH");
    const range = rangeByStart.get(b.start);
    if (range && range.end === b.end) indexById.set(range.id, index);
    else if (!white(b.html)) fail("SOURCE_BLOCK_ANCHOR_MISMATCH");
    end = b.end;
  }
  if (!white(rawHtml.slice(end)) || indexById.size !== ranges.length)
    fail("SOURCE_BLOCK_COVERAGE");
  const indices = (ids: string[]) =>
    ids.map((id) => indexById.get(id)!).sort((a, b) => a - b);
  return structure.questions.map((q) => ({
    id: q.id,
    label: q.label,
    bodyBlockIds: indices(q.bodyBlockIds),
    contextBlockIds: indices(q.contextBlockIds),
  }));
}

/** Atomic capture helper: keep exact caller HTML even when structured capture fails. */
export function captureStructuredSnapshot(
  html: string,
  structure?: unknown,
): { html: string; structure?: StructuredExam; reason?: string } {
  if (structure === undefined) return { html };
  const current = reconcileStructure(html, structure);
  return current
    ? { html, structure: current }
    : { html, reason: STRUCTURED_FALLBACK_REASON };
}
/** Merge only already valid, ID-disjoint artifacts at a top-level block boundary. */
export function appendStructuredExams(
  current: StructuredSnapshot,
  incoming: StructuredSnapshot,
): StructuredSnapshot | null {
  try {
    const a = reconcileOrThrow(current.html, current.structure).structure;
    const b = reconcileOrThrow(incoming.html, incoming.structure).structure;
    const html = `${current.html}\n${incoming.html}`;
    const structure = validateStructure({
      version: 1,
      blocks: [...a.blocks, ...b.blocks],
      questions: [...a.questions, ...b.questions],
    });
    return { html, structure: reconcileOrThrow(html, structure).structure };
  } catch {
    return null;
  }
}
