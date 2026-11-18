import { expect, test } from '@playwright/test';
import { BANK_LIMITS, type BankNode, type BankSource, type SourceBlock } from '../../lib/question-bank/types';
import { BankError, descendantIds, questionHtml, validateBlocks, validateCandidates, validateTree } from '../../lib/question-bank/validation';

const fragments = [
  '<p>Đọc đoạn chung: vận tốc v = 2 m/s.</p>',
  '<p>Câu 1. Tính quãng đường.</p>',
  '<figure><img src="/synthetic.svg"><figcaption>Hình chung</figcaption></figure>',
  '<p>Câu 2. a) Giải thích. b) Tính <math><mi>x</mi></math>.</p>',
  '<p>Chú thích cuối nguồn.</p>',
];
const rawHtml = `<section class="exam">\n${fragments.join('\n')}\n</section>`;
const blocks: SourceBlock[] = fragments.map(html => ({ start: rawHtml.indexOf(html), end: rawHtml.indexOf(html) + html.length, html, text: html.replace(/<[^>]*>/g, '') }));
const model = () => ({ questions: [
  { label: 'Câu 1', bodyBlockIds: [1], contextBlockIds: [0, 2] },
  { label: 'Câu 2', bodyBlockIds: [3], contextBlockIds: [0, 2] },
] });
const source = (): BankSource => ({ id: 's1', operationKey: 'op1', docId: 'd1', title: 'Synthetic', rawHtml, hash: 'synthetic', blocks, createdAt: '', status: 'review', candidates: [], previewVersion: 'v1', confirmedIds: [], attempts: 0, answerKey: null });
const nodes: BankNode[] = [
  { id: 'root', label: 'Kho', parentId: null },
  { id: 'physics', label: 'Vật lý', parentId: 'root' },
  { id: 'motion', label: 'Chuyển động', parentId: 'physics' },
  { id: 'math', label: 'Toán', parentId: 'root' },
];
function fails(fn: () => unknown, status = 400) {
  let error: unknown;
  try { fn(); } catch (caught) { error = caught; }
  expect(error).toBeInstanceOf(BankError);
  expect(error).toMatchObject({ status, code: expect.any(String) });
}

test('exact source ranges preserve composite source and harmless outer wrappers', () => {
  validateBlocks(rawHtml, blocks);
  validateBlocks('<p>  </p><div><p>A</p></div>', [{ start: 14, end: 22, html: '<p>A</p>', text: 'A' }]);
  expect(source().answerKey).toBeNull();
});

test('reject offsets, html rewrites, overlaps, empty ranges and missing meaningful source', () => {
  fails(() => validateBlocks(rawHtml, [{ ...blocks[0], start: blocks[0].start + 1 }, ...blocks.slice(1)]));
  fails(() => validateBlocks(rawHtml, [{ ...blocks[0], html: '<p>Changed</p>' }, ...blocks.slice(1)]));
  fails(() => validateBlocks(rawHtml, [blocks[1], blocks[0], ...blocks.slice(2)]));
  fails(() => validateBlocks(rawHtml, [blocks[0], blocks[0], ...blocks.slice(1)]));
  fails(() => validateBlocks(rawHtml, blocks.slice(1)));
  const lostImage = '<img src="lost.svg">';
  fails(() => validateBlocks(lostImage + rawHtml, blocks.map(b => ({ ...b, start: b.start + lostImage.length, end: b.end + lostImage.length }))));
  fails(() => validateBlocks('<p></p>', [{ start: 3, end: 3, html: '', text: '' }]));
  fails(() => validateBlocks('', []));
  fails(() => validateBlocks('x'.repeat(BANK_LIMITS.sourceChars + 1), []), 413);
});

test('reject uncovered figures, formulas, hidden attributes and source suffixes', () => {
  for (const suffix of ['<img src="x">', '<math><mi>x</mi></math>', '<div data-question="lost"></div>', 'lost', '<!-- lost -->']) {
    fails(() => validateBlocks(rawHtml + suffix, blocks));
  }
});

test('candidates retain conservative dependencies, never invent HTML or missing metadata', () => {
  const input = model();
  const before = JSON.stringify(input);
  const result = validateCandidates(blocks, input);
  expect(result).toHaveLength(2);
  expect(new Set(result.map(q => q.id)).size).toBe(2);
  expect(result[0]).toEqual({ id: expect.any(String), label: 'Câu 1', bodyBlockIds: [1], contextBlockIds: [0, 2, 4] });
  expect(result[1].contextBlockIds).toEqual([0, 2, 4]);
  expect(JSON.stringify(input)).toBe(before);
  expect(Object.keys(result[0]).sort()).toEqual(['bodyBlockIds', 'contextBlockIds', 'id', 'label']);
  const snapshot = source();
  expect(questionHtml(snapshot, result[0])).toBe([0, 1, 2, 4].map(i => fragments[i]).join(''));
  expect(snapshot.answerKey).toBeNull();
  const sharedBody = model();
  sharedBody.questions[0].contextBlockIds.push(3);
  expect(validateCandidates(blocks, sharedBody)[0].contextBlockIds).toEqual([0, 2, 3, 4]);
});

test('candidate validation rejects invalid model shape, metadata, indices and overlapping bodies', () => {
  for (const input of [null, [], {}, { questions: [] }, { questions: null }, { questions: [null] },
    { questions: [{ label: 'A', bodyBlockIds: [], contextBlockIds: [] }] },
    { questions: [{ label: 'A', bodyBlockIds: [99], contextBlockIds: [] }] },
    { questions: [{ label: 'A', bodyBlockIds: [1.5], contextBlockIds: [] }] },
    { questions: [{ label: 'A', bodyBlockIds: ['1'], contextBlockIds: [] }] },
    { questions: [{ label: 'A', bodyBlockIds: [1], contextBlockIds: [-1] }] },
    { questions: [{ label: 'A', bodyBlockIds: [1, 1], contextBlockIds: [] }] },
    { questions: [{ label: 'A', bodyBlockIds: [1], contextBlockIds: [1] }] },
    { questions: [{ label: ' ', bodyBlockIds: [1], contextBlockIds: [] }] },
    { questions: [{ label: 'A', bodyBlockIds: [1], contextBlockIds: [], answer: 'invented' }] },
    { questions: [{ label: 'A', bodyBlockIds: [1], contextBlockIds: [] }, { label: 'B', bodyBlockIds: [1], contextBlockIds: [] }] },
    JSON.parse('{"questions":[],"__proto__":{"polluted":true}}'),
    Object.create({ questions: model().questions }),
  ]) fails(() => validateCandidates(blocks, input));
  fails(() => validateCandidates(blocks, { questions: Array.from({ length: BANK_LIMITS.questions + 1 }, () => model().questions[0]) }), 413);
  fails(() => validateCandidates(blocks, { questions: [{ ...model().questions[0], label: 'x'.repeat(101) }] }), 413);
});

test('explicit extraction covers source without broadcasting unrelated context', () => {
  const input = { ...model(), ignoredBlockIds: [] as number[] };
  input.questions[0].contextBlockIds.push(4);
  const before = JSON.stringify(input);
  const result = validateCandidates(blocks, input, 'explicit');
  expect(result[0].contextBlockIds).toEqual([0, 2, 4]);
  expect(result[1].contextBlockIds).toEqual([0, 2]);
  expect(questionHtml(source(), result[1])).toBe([0, 2, 3].map(i => fragments[i]).join(''));
  expect(JSON.stringify(input)).toBe(before);
  expect(validateCandidates(blocks, { questions: input.questions }, 'explicit')).toEqual(result);
  // Missing substantive coverage fails closed, rather than dropping or broadcasting.
  fails(() => validateCandidates(blocks, { ...model(), ignoredBlockIds: [] }, 'explicit'));
  fails(() => validateCandidates(blocks, model(), 'explicit'));
});

test('explicit ignored chrome is disjoint, bounded and never an implicit dependency', () => {
  const input = { ...model(), ignoredBlockIds: [4] };
  const result = validateCandidates(blocks, input, 'explicit');
  expect(result.map(q => q.contextBlockIds)).toEqual([[0, 2], [0, 2]]);
  for (const ignoredBlockIds of [[4, 4], [-1], [99], [1], [0], [2]]) {
    fails(() => validateCandidates(blocks, { ...model(), ignoredBlockIds }, 'explicit'));
  }
  // Even unreferenced non-text media/formulas cannot be called chrome.
  fails(() => validateCandidates(blocks, { questions: [
    { label: 'Whole', bodyBlockIds: [0, 1, 3, 4], contextBlockIds: [] },
  ], ignoredBlockIds: [2] }, 'explicit'));
});

test('explicit coverage retains connected subparts and scopes a second exercise setup', () => {
  const pieces = ['<p>Case A setup</p>', '<p>A.a establish claim</p>', '<p>A.b use claim</p>', '<p>Case B setup</p>', '<p>B task</p>', '<p>Page 1</p>'];
  const ranges = pieces.map((html, i) => ({ html, text: html, start: i * 100, end: i * 100 + html.length }));
  const result = validateCandidates(ranges, { questions: [
    { label: 'Case A', bodyBlockIds: [1, 2], contextBlockIds: [0] },
    { label: 'Case B', bodyBlockIds: [4], contextBlockIds: [3] },
  ], ignoredBlockIds: [5] }, 'explicit');
  expect(result.map(q => [...q.bodyBlockIds, ...q.contextBlockIds])).toEqual([[1, 2, 0], [4, 3]]);
  for (const ignoredBlockIds of [null, '5', [5.5], ['5']]) {
    fails(() => validateCandidates(ranges, { questions: [
      { label: 'Whole', bodyBlockIds: [0, 1, 2, 3, 4], contextBlockIds: [] },
    ], ignoredBlockIds }, 'explicit'));
  }
  for (const html of ['<math><mi>x</mi></math>', '<svg></svg>', '<table><tr><td>3</td></tr></table>', '<span data-latex="x">x</span>']) {
    fails(() => validateCandidates([{ ...ranges[0], html }, ranges[1]], {
      questions: [{ label: 'Task', bodyBlockIds: [1], contextBlockIds: [] }], ignoredBlockIds: [0],
    }, 'explicit'));
  }
});

test('question HTML is exact, ordered, deduplicated and rejects invalid references', () => {
  expect(questionHtml(source(), { bodyBlockIds: [3, 1], contextBlockIds: [2, 0, 1, 2] })).toBe(fragments.slice(0, 4).join(''));
  fails(() => questionHtml(source(), { bodyBlockIds: [100], contextBlockIds: [] }));
  fails(() => questionHtml(source(), { bodyBlockIds: [], contextBlockIds: [0] }));
});

test('valid tree supports parent/root assignments and moving a question exactly once', () => {
  validateTree(nodes, [{ id: 'q1', topicId: 'root' }, { id: 'q2', topicId: 'motion' }]);
  validateTree(nodes, [{ id: 'q1', topicId: 'physics' }, { id: 'q2', topicId: 'math' }]);
  expect(descendantIds(nodes, 'physics')).toEqual(new Set(['physics', 'motion']));
  expect(descendantIds(nodes, 'root')).toEqual(new Set(nodes.map(n => n.id)));
  expect(descendantIds(nodes, 'missing')).toEqual(new Set());
});

test('tree rejects extra roots, invalid parents, cycles, duplicate IDs and sibling labels', () => {
  const bad: BankNode[][] = [[], nodes.slice(1), [...nodes, { id: 'other', label: 'Other', parentId: null }],
    nodes.map(n => n.id === 'physics' ? { ...n, parentId: 'missing' } : n),
    nodes.map(n => n.id === 'physics' ? { ...n, parentId: 'motion' } : n),
    nodes.map(n => n.id === 'root' ? { ...n, parentId: 'math' } : n),
    [...nodes, { id: 'physics', label: 'Duplicate', parentId: 'root' }],
    [...nodes, { id: 'duplicate', label: '  VẬT LÝ ', parentId: 'root' }],
    [...nodes, { id: 'empty', label: ' ', parentId: 'root' }],
  ];
  for (const tree of bad) fails(() => validateTree(tree, []));
  fails(() => validateTree(nodes, [{ id: 'q1', topicId: 'missing' }]));
  fails(() => validateTree(nodes, [{ id: 'q1', topicId: 'root' }, { id: 'q1', topicId: 'math' }]));
});

test('malicious IDs cannot address object prototypes or pollute state', () => {
  for (const id of ['__proto__', 'constructor', 'prototype', '', '../root', '<script>']) {
    fails(() => validateTree([...nodes, { id, label: 'Unsafe', parentId: 'root' }], []));
    fails(() => validateTree(nodes, [{ id, topicId: 'root' }]));
  }
  fails(() => validateTree(nodes, [{ id: 'q1', topicId: '__proto__' }]));
  expect(({} as Record<string, unknown>).polluted).toBeUndefined();
});

test('tree limits include node/question/label quotas and depth 12 boundary', () => {
  const chain = Array.from({ length: 13 }, (_, i) => ({ id: i ? `n${i}` : 'root', label: `${i}`, parentId: i ? (i === 1 ? 'root' : `n${i - 1}`) : null }));
  validateTree(chain, []);
  fails(() => validateTree([...chain, { id: 'n13', label: '13', parentId: 'n12' }], []), 413);
  fails(() => validateTree(Array.from({ length: 201 }, (_, i) => ({ id: i ? `n${i}` : 'root', label: `${i}`, parentId: i ? 'root' : null })), []), 413);
  fails(() => validateTree([{ id: 'root', label: 'x'.repeat(101), parentId: null }], []), 413);
  fails(() => validateTree(nodes, Array.from({ length: 2001 }, (_, i) => ({ id: `q${i}`, topicId: 'root' }))), 413);
});
