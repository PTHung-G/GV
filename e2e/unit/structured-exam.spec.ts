import { expect, test } from "@playwright/test";
import { buildReleaseVariants } from '../../lib/exam-release/engine';
import { BANK_LIMITS, type SourceBlock } from "../../lib/question-bank/types";
import {
  appendStructuredExams,
  captureStructuredSnapshot,
  materializeGeneration,
  nativeCandidates,
  reconcileStructure,
  validateStructure,
  STRUCTURED_LIMITS,
  type GenerationInput,
  type StructuredExam,
} from "../../lib/structured-exam";

const structure = (): StructuredExam => ({
  version: 1,
  blocks: ["header", "shared", "one", "two"].map((id) => ({ id })),
  questions: [
    {
      id: "q1",
      label: "Câu 1",
      bodyBlockIds: ["one"],
      contextBlockIds: ["shared"],
    },
    { id: "q2", label: "Câu 2", bodyBlockIds: ["two"], contextBlockIds: [] },
  ],
});
const parts = [
  '<div data-sdt-block="header" class="grid"><p>Đề kiểm tra</p></div>',
  '<figure data-sdt-block="shared"><svg viewBox="0 0 1 1"><path d="M0 0"/></svg></figure>',
  '<p data-sdt-block="one">Câu 1. <math><mi>x</mi></math></p>',
  '<p data-sdt-block="two">Câu 2. a) Một. b) Hai.</p>',
];
const html = parts.join("\n");
function blocksFor(parts: string[], whitespace = false) {
  const raw = parts.join("\n");
  let offset = 0;
  const result: SourceBlock[] = [];
  parts.forEach((part, i) => {
    if (i) {
      if (whitespace)
        result.push({ start: offset, end: offset + 1, html: "\n", text: "\n" });
      offset++;
    }
    result.push({
      start: offset,
      end: offset + part.length,
      html: part,
      text: "untrusted display text",
    });
    offset += part.length;
  });
  return { raw, blocks: result };
}
const generation = (): GenerationInput => ({
  blocks: [
    { key: "head", html: '<div class="grid"><p>ĐỀ</p></div>' },
    { key: "body", html: "<p>Câu 1. <math><mi>x</mi></math></p>" },
  ],
  questions: [
    {
      key: "localQuestion",
      label: "Câu 1",
      bodyKeys: ["body"],
      contextKeys: [],
    },
  ],
});

test('native top-level anchors stay compatible with release variants and undo can reconcile original identities', () => {
  const native = materializeGeneration({
    blocks: [
      { key: 'heading', html: '<h1>ĐỀ</h1>' },
      { key: 'first', html: '<p><b>Câu 1.</b> Giải $x+1=2$.</p>' },
      { key: 'second', html: '<p><b>Câu 2.</b> Tính diện tích.</p>' },
    ],
    questions: [
      { key: 'qfirst', label: 'Câu 1', bodyKeys: ['first'], contextKeys: [] },
      { key: 'qsecond', label: 'Câu 2', bodyKeys: ['second'], contextKeys: [] },
    ],
  });
  expect(reconcileStructure(native.html + '<p>Chưa có mốc</p>', native.structure)).toBeNull();
  expect(reconcileStructure(native.html, native.structure)).toEqual(native.structure);
  const result = buildReleaseVariants({
    sourceExamId: 'native', title: 'Đề native', content: native.html,
    answerKey: [{ label: '1', answer: 'x=1', points: '5', steps: [{ text: 'x=1', points: '5' }] }, { label: '2', answer: '10', points: '5', steps: [{ text: 'Diện tích bằng 10', points: '5' }] }],
    reviewed: true, globalInstructionsReviewed: true, codes: ['101', '102'], seed: 'structured', shuffleQuestions: true, shuffleOptions: false,
  });
  expect(result.variants).toHaveLength(2);
  for (const variant of result.variants) {
    expect(variant.rubric.totalPoints).toBe(10);
    expect(variant.examHtml).toContain('$x+1=2$');
    expect(variant.mapping.map(m => m.sourceNo).sort()).toEqual([1, 2]);
  }
});

test("validates and clones versioned structure with explicit chrome and context", () => {
  const s = structure();
  const result = validateStructure(s);
  expect(result).toEqual(s);
  expect(result).not.toBe(s);
  expect(result.questions[0].bodyBlockIds).not.toBe(
    s.questions[0].bodyBlockIds,
  );
});
test("rejects schemas, inherited records, reserved identifiers and cross-group duplicates", () => {
  for (const bad of [
    null,
    [],
    { ...structure(), version: 2 },
    { ...structure(), extra: true },
    Object.assign(Object.create({}), structure()),
    { ...structure(), blocks: [{ id: "__proto__" }] },
    { ...structure(), blocks: [{ id: "one", extra: 1 }] },
    { ...structure(), questions: [{ ...structure().questions[0], id: "one" }] },
  ])
    expect(() => validateStructure(bad)).toThrow();
});
test("rejects dangling/duplicate dependencies, overlapping or empty bodies and invalid labels", () => {
  for (const patch of [
    { bodyBlockIds: [] },
    { bodyBlockIds: ["missing"] },
    { bodyBlockIds: ["one", "one"] },
    { contextBlockIds: ["one"] },
    { contextBlockIds: ["shared", "shared"] },
    { contextBlockIds: ["missing"] },
    { label: "" },
    { label: "x".repeat(101) },
  ]) {
    const s = structure();
    Object.assign(s.questions[0], patch);
    expect(() => validateStructure(s)).toThrow();
  }
  const s = structure();
  s.questions[1].bodyBlockIds = ["one"];
  expect(() => validateStructure(s)).toThrow();
});
test("bounds source, block, question and aggregate reference sizes", () => {
  expect(() =>
    validateStructure({
      ...structure(),
      blocks: Array.from({ length: STRUCTURED_LIMITS.blocks + 1 }, (_, i) => ({
        id: `b${i}`,
      })),
    }),
  ).toThrow();
  expect(() =>
    validateStructure({
      ...structure(),
      questions: Array.from({ length: BANK_LIMITS.questions + 1 }, (_, i) => ({
        ...structure().questions[0],
        id: `q${i}`,
      })),
    }),
  ).toThrow();
  expect(
    reconcileStructure("x".repeat(BANK_LIMITS.sourceChars + 1), structure()),
  ).toBeNull();
});
test("safe live edits and current block order survive without rewriting HTML", () => {
  const edited = [
    parts[3],
    parts[0],
    parts[1],
    parts[2].replace("Câu 1.", "Câu 1. Đã sửa &amp; giữ"),
  ].join("\n");
  const s = reconcileStructure(edited, structure());
  expect(s?.blocks.map((b) => b.id)).toEqual([
    "two",
    "header",
    "shared",
    "one",
  ]);
  expect(s?.questions.map((q) => q.id)).toEqual(["q1", "q2"]);
  expect(reconcileStructure(` \n${html}\n&nbsp;`, structure())).not.toBeNull();
});
test("missing, duplicate, nested, unknown anchors and unknown top-level content fail safe", () => {
  for (const broken of [
    parts.slice(1).join(""),
    html + parts[0],
    html + "<p>Lost</p>",
    html + " lost",
    html + "<div></div>",
    html + "<!-- unknown -->",
    html.replace('data-sdt-block="one"', 'data-sdt-block="unknown"'),
    html.replace("Câu 1.", '<span data-sdt-block="forged">Nested</span>'),
    `<div>${html}</div>`,
    html.replace(
      'data-sdt-block="one"',
      'data-sdt-block="one" data-sdt-block="two"',
    ),
    html.replace("</p>", ""),
  ])
    expect(reconcileStructure(broken, structure()), broken).toBeNull();
});
test("materialization mints authoritative IDs and anchors existing top-level elements only", () => {
  let i = 0;
  const out = materializeGeneration(generation(), () => `server-${++i}`);
  expect(out.structure.blocks.map((b) => b.id)).toEqual([
    "server-1",
    "server-2",
  ]);
  expect(out.structure.questions[0]).toEqual({
    id: "server-3",
    label: "Câu 1",
    bodyBlockIds: ["server-2"],
    contextBlockIds: [],
  });
  expect(out.html).toBe(
    '<div data-sdt-block="server-1" class="grid"><p>ĐỀ</p></div>\n<p data-sdt-block="server-2">Câu 1. <math><mi>x</mi></math></p>',
  );
  expect(reconcileStructure(out.html, out.structure)).toEqual(out.structure);
  expect(
    materializeGeneration(generation()).structure.questions[0].id,
  ).not.toBe("localQuestion");
});
test("generation rejects forged markers, multiple roots, malformed markup and unsafe markup", () => {
  for (const blockHtml of [
    "<p>A</p><p>B</p>",
    "text<p>A</p>",
    '<p data-sdt-block="x">A</p>',
    '<p><span data-sdt-block="x">A</span></p>',
    "<p>A",
    "<script>alert(1)</script>",
    '<p onclick="evil()">A</p>',
    '<p><a href="javascript:evil()">A</a></p>',
  ]) {
    const g = generation();
    g.blocks[1].html = blockHtml;
    expect(() => materializeGeneration(g)).toThrow();
  }
});
test("generation strictly validates model-local keys and minted IDs", () => {
  for (const mutate of [
    (g: ReturnType<typeof generation>) => {
      g.blocks[1].key = "head";
    },
    (g: ReturnType<typeof generation>) => {
      g.questions[0].bodyKeys = ["lost"];
    },
    (g: ReturnType<typeof generation>) => {
      g.questions[0].contextKeys = ["body"];
    },
    (g: ReturnType<typeof generation>) => {
      Object.assign(g.questions[0], { id: "forged" });
    },
    (g: ReturnType<typeof generation>) => {
      g.questions[0].key = "constructor";
    },
  ]) {
    const g = generation();
    mutate(g);
    expect(() => materializeGeneration(g)).toThrow();
  }
  expect(() =>
    materializeGeneration(generation(), () => "duplicate"),
  ).toThrow();
  expect(() => materializeGeneration(generation(), () => "<unsafe>")).toThrow();
});
test("native candidates use stable IDs, exact indices and explicit context only, preserving raw fragments", () => {
  for (const whitespace of [false, true]) {
    const source = blocksFor(parts, whitespace);
    const before = structuredClone(source);
    const out = nativeCandidates(source.raw, source.blocks, structure());
    expect(out).toEqual([
      {
        id: "q1",
        label: "Câu 1",
        bodyBlockIds: [whitespace ? 4 : 2],
        contextBlockIds: [whitespace ? 2 : 1],
      },
      {
        id: "q2",
        label: "Câu 2",
        bodyBlockIds: [whitespace ? 6 : 3],
        contextBlockIds: [],
      },
    ]);
    expect(source).toEqual(before);
    expect(source.blocks[out[0].bodyBlockIds[0]].html).toBe(parts[2]);
  }
});
test("capture retains exact current content and append requires disjoint valid artifacts", () => {
  expect(captureStructuredSnapshot(html, structure())).toEqual({
    html,
    structure: structure(),
  });
  expect(captureStructuredSnapshot(html + " lost", structure())).toEqual({
    html: html + " lost",
    reason: expect.any(String),
  });
  expect(captureStructuredSnapshot(html)).toEqual({ html });
  let i = 0;
  const a = materializeGeneration(generation(), () => `a${++i}`);
  const b = materializeGeneration(generation(), () => `b${++i}`);
  const appended = appendStructuredExams(a, b);
  expect(appended?.html).toBe(a.html + "\n" + b.html);
  expect(appended?.structure.questions).toHaveLength(2);
  expect(appendStructuredExams(a, a)).toBeNull();
  expect(appendStructuredExams({ ...a, html: a.html + " lost" }, b)).toBeNull();
});

test("rejects accessor/sparse/prototype-bearing input without executing getters", () => {
  let called = false;
  const bad = Object.defineProperty({ ...structure() }, "blocks", {
    get() {
      called = true;
      return [];
    },
  });
  expect(() => validateStructure(bad)).toThrow();
  expect(called).toBe(false);
  const s = structure();
  s.blocks = new Array(2);
  expect(() => validateStructure(s)).toThrow();
});

test("aggregate references and deeply nested HTML are bounded", () => {
  const blocks = Array.from({ length: 600 }, (_, i) => ({ id: `b${i}` }));
  const questions = Array.from({ length: 200 }, (_, i) => ({
    id: `q${i}`,
    label: `Câu ${i}`,
    bodyBlockIds: [`b${i}`],
    contextBlockIds: blocks.slice(200).map((b) => b.id),
  }));
  expect(() =>
    validateStructure({ version: 1, blocks, questions }),
  ).not.toThrow();
  const tooMany = Array.from({ length: 300 }, (_, i) => ({
    id: `q${i}`,
    label: `Câu ${i}`,
    bodyBlockIds: [`b${i}`],
    contextBlockIds: blocks.slice(300).map((b) => b.id),
  }));
  tooMany.forEach((q) =>
    q.contextBlockIds.push(
      ...blocks
        .slice(0, 300)
        .filter((b) => b.id !== q.bodyBlockIds[0])
        .map((b) => b.id),
    ),
  );
  expect(() =>
    validateStructure({ version: 1, blocks, questions: tooMany }),
  ).toThrow();
  const g = generation();
  g.blocks[1].html =
    "<div>".repeat(STRUCTURED_LIMITS.htmlDepth + 1) +
    "x" +
    "</div>".repeat(STRUCTURED_LIMITS.htmlDepth + 1);
  expect(() => materializeGeneration(g)).toThrow();
});

test("server independently rejects rewritten, shifted, partial, omitted or combined anchored ranges", () => {
  const { raw, blocks } = blocksFor(parts, true);
  for (const bad of [
    [{ ...blocks[0], start: 1 }, ...blocks.slice(1)],
    [{ ...blocks[0], html: "changed" }, ...blocks.slice(1)],
    blocks.slice(2),
    [{ ...blocks[0], end: raw.length, html: raw }],
    [...blocks, blocks[0]],
    [
      {
        start: parts[0].indexOf("<p>"),
        end: parts[0].indexOf("</p>") + 4,
        html: "<p>Đề kiểm tra</p>",
        text: "x",
      },
      ...blocks.slice(1),
    ],
  ])
    expect(() => nativeCandidates(raw, bad, structure())).toThrow();
  expect(() => nativeCandidates(raw + " lost", blocks, structure())).toThrow();
});
