import { expect, test } from '@playwright/test';
import { buildReleaseVariants } from '../../lib/exam-release/engine';
import { examContentHash } from '../../lib/exam-revision';
import { parseAnswerKeyHtml } from '../../lib/grading/answer-key-html';
import { renderAnswerKeyHtml } from '../../lib/grading/answer-key-render';
import { readSheet, type RgbaImage } from '../../lib/grading/omr';
import { formatTfStatements, type Rubric, type ShortQuestion, type TfQuestion } from '../../lib/grading/rubric';
import { computeSectionScores, scoreShortQuestion, scoreTfQuestion } from '../../lib/grading/scores';
import { MM, buildSheetTemplate, renderSheetHtml } from '../../lib/grading/sheet-template';

const ANCHOR_HALF = (10 * MM) / 2;

function renderExtendedSheet(
  rubric: Rubric,
  filledMc: Record<number, string>,
  filledTf: Record<number, string>,
  filledShort: Record<number, string[]>,
  sbd = '',
): { image: RgbaImage; template: ReturnType<typeof buildSheetTemplate> } {
  const template = buildSheetTemplate(rubric, { title: 'THPT 2025', sbdDigits: 6 });
  const width = Math.round(template.page.width);
  const height = Math.round(template.page.height);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    data[i * 4] = 255;
    data[i * 4 + 1] = 255;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = 255;
  }

  const paintCircle = (cx: number, cy: number, r: number, filled: boolean) => {
    const reach = Math.ceil(r + 2);
    for (let y = Math.floor(cy - reach); y <= Math.ceil(cy + reach); y += 1) {
      for (let x = Math.floor(cx - reach); x <= Math.ceil(cx + reach); x += 1) {
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const dist = Math.hypot(x - cx, y - cy);
        const draw = filled ? dist <= r * 0.85 : Math.abs(dist - r) <= Math.max(1, r * 0.2);
        if (draw) {
          const offset = (y * width + x) * 4;
          data[offset] = 0;
          data[offset + 1] = 0;
          data[offset + 2] = 0;
        }
      }
    }
  };

  for (const anchor of template.anchors) {
    const x0 = Math.floor(anchor.x - ANCHOR_HALF);
    const x1 = Math.ceil(anchor.x + ANCHOR_HALF);
    const y0 = Math.floor(anchor.y - ANCHOR_HALF);
    const y1 = Math.ceil(anchor.y + ANCHOR_HALF);
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        if (x >= 0 && y >= 0 && x < width && y < height) {
          const offset = (y * width + x) * 4;
          data[offset] = 0;
          data[offset + 1] = 0;
          data[offset + 2] = 0;
        }
      }
    }
  }

  for (const b of template.bubbles) {
    paintCircle(b.cx, b.cy, b.r, filledMc[b.q] === b.label);
  }
  for (const b of template.tfBubbles ?? []) {
    const target = filledTf[b.q]?.['abcd'.indexOf(b.sub)];
    paintCircle(b.cx, b.cy, b.r, target === b.choice);
  }
  for (const c of template.shortCells ?? []) {
    const cols = filledShort[c.q] ?? [];
    paintCircle(c.cx, c.cy, c.r, cols[c.column] === c.mark);
  }
  for (const c of template.sbd?.cells ?? []) {
    paintCircle(c.cx, c.cy, c.r, sbd[c.column] === String(c.digit));
  }

  return { image: { data, width, height, channels: 4 }, template };
}

test('moet-2025 TF progressive scoring and short numeric normalization', () => {
  const tf: TfQuestion = {
    no: 1,
    type: 'tf',
    points: 1,
    statements: { a: true, b: false, c: true, d: false },
    scoringRule: 'moet-2025',
  };

  expect(scoreTfQuestion(tf, 'ĐSĐS').points).toBe(1);
  expect(scoreTfQuestion(tf, 'ĐSĐĐ').points).toBe(0.5);
  expect(scoreTfQuestion(tf, 'ĐS').points).toBe(0.25);
  expect(scoreTfQuestion(tf, 'ĐĐSS').points).toBe(0.25);
  expect(scoreTfQuestion(tf, 'ĐĐĐĐ').points).toBe(0.25);
  expect(scoreTfQuestion(tf, 'ĐĐSĐ').points).toBe(0.1);
  expect(scoreTfQuestion(tf, 'SĐSĐ').points).toBe(0);
  expect(scoreTfQuestion(tf, null).flags).toContain('blank');

  const short: ShortQuestion = {
    no: 2,
    type: 'short',
    points: 0.5,
    answer: '-2,5',
  };
  expect(scoreShortQuestion(short, '-2.50').points).toBe(0.5);
  expect(scoreShortQuestion(short, ' -2,5 ').correct).toBe(true);
  expect(scoreShortQuestion(short, '2,5').points).toBe(0);
});

test('renderAnswerKeyHtml + parseAnswerKeyHtml round-trips 4 GDPT 2018 sections cleanly', async ({ page }) => {
  const input = [
    { label: 'Câu 1', type: 'mc' as const, sectionNo: 1, displayNo: 1, answer: 'B', points: '0.5' },
    {
      label: 'Câu 1',
      type: 'tf' as const,
      sectionNo: 2,
      displayNo: 1,
      answer: 'ĐSĐS',
      statements: { a: true, b: false, c: true, d: false },
      points: '1',
    },
    { label: 'Câu 1', type: 'short' as const, sectionNo: 3, displayNo: 1, answer: '-2,5', points: '0.5' },
    {
      label: 'Câu 1',
      type: 'essay' as const,
      sectionNo: 4,
      displayNo: 1,
      answer: 'x = 3',
      points: '2',
      steps: [{ text: 'Biến đổi đúng', points: '2' }],
    },
  ];

  const html = await page.evaluate(
    ({ source, qs }) => {
      const fn = new Function('return ' + source)();
      return fn(qs, document) as string;
    },
    { source: renderAnswerKeyHtml.toString(), qs: input },
  );
  expect(html).toContain('data-answer-grid');
  expect(html).toContain('data-tf-grid');
  expect(html).toContain('data-short-grid');
  expect(html).toContain('data-rubric');

  const parsed = parseAnswerKeyHtml(html);
  expect(parsed).toHaveLength(4);
  expect(parsed.map((q) => q.type ?? 'mc')).toEqual(['mc', 'tf', 'short', 'essay']);
  expect(parsed[1].answer).toBe('ĐSĐS');
  expect(parsed[2].answer).toBe('-2,5');
});

test('release engine handles <p><b>PHẦN...</b></p> restarts, TF a–d shuffle and context slicing', () => {
  const html = [
    '<p><b>PHẦN I. Trắc nghiệm</b></p>',
    '<p><b>Câu 1.</b> Số 1+1=</p><div class="doc-grid"><div class="doc-grid-cell"><p>A. 1</p></div><div class="doc-grid-cell"><p>B. 2</p></div><div class="doc-grid-cell"><p>C. 3</p></div><div class="doc-grid-cell"><p>D. 4</p></div></div>',
    '<p><b>Câu 2.</b> Số 2+2=</p><div class="doc-grid"><div class="doc-grid-cell"><p>A. 2</p></div><div class="doc-grid-cell"><p>B. 3</p></div><div class="doc-grid-cell"><p>C. 4</p></div><div class="doc-grid-cell"><p>D. 5</p></div></div>',
    '<p><b>PHẦN II. Đúng sai</b></p>',
    '<p><b>Câu 1.</b> Xét mệnh đề sau:</p><div class="doc-tf-list"><p>a) Mệnh đề 1</p><p>b) Mệnh đề 2</p><p>c) Mệnh đề 3</p><p>d) Mệnh đề 4</p></div>',
    '<p><b>PHẦN III. Trả lời ngắn</b></p>',
    '<p><b>Câu 1 (2,0 điểm).</b> Tính -5/2.</p>',
    '<p>Dựa vào dữ liệu chung sau để trả lời câu tiếp theo.</p>',
    '<p><b>Câu 2.</b> Giá trị biểu thức là?</p>',
  ].join('');

  const build = buildReleaseVariants({
    sourceExamId: 'ex-thpt2025',
    title: 'Đề THPT 2025',
    content: html,
    sourceContentHash: examContentHash(html),
    reviewed: true,
    codes: ['101', '102'],
    seed: 'thpt-2025-seed',
    shuffleQuestions: true,
    shuffleOptions: true,
    groups: [{ questionNos: [5] }],
    answerKey: [
      { label: 'Câu 1', type: 'mc', answer: 'B', points: '0.25' },
      { label: 'Câu 2', type: 'mc', answer: 'C', points: '0.25' },
      {
        label: 'Câu 1',
        type: 'tf',
        answer: 'ĐSĐS',
        statements: { a: true, b: false, c: true, d: false },
        points: '1',
      },
      { label: 'Câu 1', type: 'short', answer: '-2,5', points: '2' },
      { label: 'Câu 2', type: 'short', answer: '4', points: '1' },
    ],
  });

  expect(build.variants).toHaveLength(2);
  for (const v of build.variants) {
    // Question 3 (global no 3, displayed as Câu 1 in Phần II) has its TF statements mapped cleanly.
    const tfMap = v.mapping.find((m) => m.sourceNo === 3)!;
    expect(tfMap.optionOrder).toHaveLength(4);
    const tfKey = v.answerKey.find((k) => k.sectionNo === 2)!;
    const orig = [true, false, true, false];
    const expectedOrder = tfMap.optionOrder!.map((ch) => orig['abcd'.indexOf(ch)]);
    expect(tfKey.answer).toBe(
      formatTfStatements({
        a: expectedOrder[0],
        b: expectedOrder[1],
        c: expectedOrder[2],
        d: expectedOrder[3],
      }),
    );
    expect(v.rubric.totalPoints).toBe(4.5);
    expect(v.examHtml).toContain('Dựa vào dữ liệu chung sau');
  }
});

test('OMR reads MC + TF + Short + SBD on extended THPT 2025 sheet and moves essay to page 2 when crowded', async () => {
  const rubric: Rubric = {
    version: 1,
    totalPoints: 10,
    questions: [
      { no: 1, type: 'mc', points: 0.5, answer: 'B', sectionNo: 1, displayNo: 1 },
      { no: 2, type: 'mc', points: 0.5, answer: 'C', sectionNo: 1, displayNo: 2 },
      {
        no: 3,
        type: 'tf',
        points: 1,
        statements: { a: true, b: false, c: true, d: false },
        scoringRule: 'moet-2025',
        sectionNo: 2,
        displayNo: 1,
      },
      { no: 4, type: 'short', points: 1, answer: '-2,5', sectionNo: 3, displayNo: 1 },
      {
        no: 5,
        type: 'essay',
        points: 7,
        sectionNo: 4,
        displayNo: 1,
        steps: [{ key: 's1', text: 'Lời giải', points: 7 }],
      },
    ],
  };

  const { image, template } = renderExtendedSheet(
    rubric,
    { 1: 'B', 2: 'A' },
    { 3: 'ĐSĐS' },
    { 4: ['-', '2', ',', '5'] },
    '123456',
  );

  const omr = readSheet(image, template);
  expect(omr.quality.anchorsFound).toBe(true);
  expect(omr.sbd?.code).toBe('123456');

  const q1 = omr.answers.find((a) => a.q === 1);
  const q2 = omr.answers.find((a) => a.q === 2);
  const q3 = omr.answers.find((a) => a.q === 3);
  const q4 = omr.answers.find((a) => a.q === 4);
  expect(q1?.picked).toBe('B');
  expect(q2?.picked).toBe('A');
  expect(q3?.picked).toBe('ĐSĐS');
  expect(q4?.picked).toBe('-2,5');

  const scored = computeSectionScores({
    rubric,
    mcAnswers: omr.answers.map((a) => ({ questionNo: a.q, picked: a.picked, flags: a.flags })),
    criteria: [],
    mcStatus: 'confirmed',
    essayStatus: 'pending',
  });
  expect(scored.mc).toBe(2.5);

  // Verify dense mixed exam cleanly spills essay to Page 2 when Page 1 is packed.
  const denseRubric: Rubric = {
    version: 1,
    totalPoints: 10,
    questions: [
      ...Array.from({ length: 16 }, (_, i) => ({
        no: i + 1,
        type: 'mc' as const,
        points: 0.25,
        answer: 'A' as const,
        sectionNo: 1,
        displayNo: i + 1,
      })),
      {
        no: 17,
        type: 'tf' as const,
        points: 1,
        statements: { a: true, b: true, c: false, d: false },
        sectionNo: 2,
        displayNo: 1,
      },
      { no: 18, type: 'short' as const, points: 1, answer: '12', sectionNo: 3, displayNo: 1 },
      {
        no: 19,
        type: 'essay' as const,
        points: 4,
        sectionNo: 4,
        displayNo: 1,
        steps: [{ key: 's1', text: 'Chứng minh', points: 4 }],
      },
    ],
  };
  const denseTpl = buildSheetTemplate(denseRubric, { title: 'Dense THPT 2025' });
  expect(denseTpl.essayOnSecondPage).toBe(true);
  const denseHtml = await renderSheetHtml(denseRubric, { title: 'Dense THPT 2025' });
  expect(denseHtml).toContain('sheet-essay');
});
