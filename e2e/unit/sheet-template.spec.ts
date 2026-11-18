/**
 * Unit tests for the printable answer sheet.
 *
 * The contract that matters: the geometry returned as JSON must be the same
 * geometry the HTML positions elements with, otherwise every scan is wrong in a
 * way nobody would notice until marks were disputed.
 */
import { expect, test } from '@playwright/test';
import {
  A4_HEIGHT,
  A4_WIDTH,
  MM,
  buildSheetTemplate,
  renderSheetHtml,
} from '../../lib/grading/sheet-template';
import type { Rubric } from '../../lib/grading/rubric';

const MIXED: Rubric = {
  version: 1,
  totalPoints: 3,
  questions: [
    { no: 1, type: 'mc', points: 0.5, answer: 'B' },
    { no: 2, type: 'mc', points: 0.5, answer: 'D' },
    {
      no: 3,
      type: 'essay',
      points: 2,
      steps: [
        { key: 's1', text: 'Đưa về phương trình bậc hai', points: 1 },
        { key: 's2', text: 'Tìm đúng hai nghiệm', points: 1 },
      ],
    },
  ],
};

const ESSAY_ONLY: Rubric = {
  version: 1,
  totalPoints: 2,
  questions: [
    {
      no: 1,
      type: 'essay',
      points: 2,
      steps: [{ key: 's1', text: 'Lập luận đúng', points: 2 }],
    },
  ],
};

const OPTIONS = { title: 'Kiểm tra giữa kỳ Toán 9', subject: 'Toán', className: '9A' };

test('the template covers A4 and stays inside the page', () => {
  const template = buildSheetTemplate(MIXED, OPTIONS);

  expect(template.page.width).toBeCloseTo(A4_WIDTH, 1);
  expect(template.page.height).toBeCloseTo(A4_HEIGHT, 1);
  expect(template.anchors).toHaveLength(4);

  for (const anchor of template.anchors) {
    expect(anchor.x).toBeGreaterThan(0);
    expect(anchor.y).toBeGreaterThan(0);
    expect(anchor.x).toBeLessThan(A4_WIDTH);
    expect(anchor.y).toBeLessThan(A4_HEIGHT);
  }

  // The four marks must sit in their own corners, or the homography is unstable.
  const [tl, tr, br, bl] = template.anchors;
  expect(tl.x).toBeLessThan(tr.x);
  expect(tr.y).toBeLessThan(br.y);
  expect(br.x).toBeGreaterThan(bl.x);
  expect(bl.y).toBeGreaterThan(tl.y);

  const qr = template.qr;
  expect(qr.x).toBeGreaterThan(0);
  expect(qr.y).toBeGreaterThan(0);
  expect(qr.x + qr.size).toBeLessThan(A4_WIDTH);
  expect(qr.y + qr.size).toBeLessThan(A4_HEIGHT);
});

test('every multiple-choice question gets four bubbles inside the page', () => {
  const template = buildSheetTemplate(MIXED, OPTIONS);

  expect(template.bubbles).toHaveLength(2 * 4);
  for (const bubble of template.bubbles) {
    expect(bubble.cx).toBeGreaterThan(0);
    expect(bubble.cy).toBeGreaterThan(0);
    expect(bubble.cx).toBeLessThan(A4_WIDTH);
    expect(bubble.cy).toBeLessThan(A4_HEIGHT);
    expect(bubble.r).toBeGreaterThan(0);
  }

  const first = template.bubbles.filter((bubble) => bubble.q === 1);
  expect(first.map((bubble) => bubble.label)).toEqual(['A', 'B', 'C', 'D']);
  // Options of one question sit on the same row.
  expect(new Set(first.map((bubble) => Math.round(bubble.cy))).size).toBe(1);
});

test('an essay-only paper has no bubbles but still reserves writing space', () => {
  const template = buildSheetTemplate(ESSAY_ONLY, OPTIONS);

  expect(template.bubbles).toHaveLength(0);
  expect(template.essayBoxes).toHaveLength(1);
  expect(template.essayBoxes[0].height).toBeGreaterThan(0);
});

test('layout is deterministic', () => {
  const a = buildSheetTemplate(MIXED, OPTIONS);
  const b = buildSheetTemplate(MIXED, OPTIONS);
  expect(a).toEqual(b);
});

test('the printed HTML positions bubbles with the same numbers as the template', async () => {
  const template = buildSheetTemplate(MIXED, OPTIONS);
  const html = await renderSheetHtml(MIXED, OPTIONS);

  const firstBubble = template.bubbles[0];
  const expectedX = `${(firstBubble.cx / MM).toFixed(2)}mm`;
  const expectedY = `${(firstBubble.cy / MM).toFixed(2)}mm`;

  expect(html).toContain(`cx="${expectedX}"`);
  expect(html).toContain(`cy="${expectedY}"`);
  expect(html).toContain('@page { size: A4; margin: 0; }');
  expect(html).toContain('PHIẾU TRẢ LỜI');
});

test('one sheet is printed per student, each carrying its own code', async () => {
  const html = await renderSheetHtml(MIXED, {
    ...OPTIONS,
    sessionId: 'session-1',
    students: [
      { code: '09001', name: 'Nguyễn Văn An' },
      { code: '09002', name: 'Trần Minh Anh' },
    ],
  });

  expect(html.match(/class="sheet"/g)).toHaveLength(2);
  expect(html).toContain('Nguyễn Văn An');
  expect(html).toContain('09002');
});

test('the candidate-number boxes sit exactly above their columns', () => {
  const rubric: Rubric = {
    version: 1,
    totalPoints: 4,
    questions: [1, 2, 3, 4].map((no) => ({
      no,
      type: 'mc' as const,
      points: 1,
      answer: 'A' as const,
    })),
  };
  const template = buildSheetTemplate(rubric, { title: 'Đề thử', sbdDigits: 6 });
  expect(template.sbd?.digits).toBe(6);
  expect(template.sbd?.cells).toHaveLength(60);

  // Every box in the write-in strip must be centred on the bubbles below it,
  // otherwise the student writes a digit in one column and bubbles another.
  const firstRow = [0, 1, 2, 3, 4, 5].map(
    (column) => template.sbd!.cells.find((c) => c.column === column && c.digit === 0)!,
  );
  const pitch = firstRow[1].cx - firstRow[0].cx;
  expect(pitch).toBeGreaterThan(0);
  firstRow.forEach((cell, index) => {
    expect(cell.cx).toBeCloseTo(firstRow[0].cx + index * pitch, 5);
  });

  // The grid must stay clear of the answer grid underneath it.
  const gridBottom = Math.max(...template.sbd!.cells.map((c) => c.cy + c.r));
  const answersTop = Math.min(...template.bubbles.map((b) => b.cy - b.r));
  expect(gridBottom).toBeLessThan(answersTop);
  const pageBottom = Math.max(...template.bubbles.map((b) => b.cy + b.r));
  expect(pageBottom).toBeLessThan(A4_HEIGHT);
});

test('the printed boxes line up with the template columns', async () => {
  const rubric: Rubric = {
    version: 1,
    totalPoints: 4,
    questions: [1, 2, 3, 4].map((no) => ({
      no,
      type: 'mc' as const,
      points: 1,
      answer: 'A' as const,
    })),
  };
  const template = buildSheetTemplate(rubric, { title: 'Đề thử', sbdDigits: 6 });
  const html = await renderSheetHtml(rubric, { title: 'Đề thử', sbdDigits: 6 });

  const boxes = [...html.matchAll(/class="sbd-box" style="left:([\d.]+)mm[^"]*width:([\d.]+)mm/g)];
  expect(boxes).toHaveLength(6);

  const centers = boxes.map((match) => Number(match[1]) + Number(match[2]) / 2);
  const firstRow = template.sbd!.cells.filter((c) => c.digit === 0).map((c) => c.cx);
  // The template stores page pixels, the HTML emits millimetres.
  centers.forEach((center, index) => {
    expect(center * MM).toBeCloseTo(firstRow[index], 1);
  });
});
