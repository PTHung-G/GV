/**
 * Unit tests for the optical mark reader.
 *
 * The image is rendered directly from the template, so this proves the two
 * halves agree: whatever the layout puts on paper is exactly what the reader
 * comes back to look for. Real photographs add blur, skew and uneven light —
 * those are covered by the fallback to vision, not by these tests.
 */
import { expect, test } from '@playwright/test';
import {
  applyHomography,
  computeHomography,
  detectAnchors,
  readSheet,
  toGray,
  type RgbaImage,
} from '../../lib/grading/omr';
import { MM, buildSheetTemplate, type SheetTemplate } from '../../lib/grading/sheet-template';
import type { Rubric } from '../../lib/grading/rubric';

const RUBRIC: Rubric = {
  version: 1,
  totalPoints: 3,
  questions: [
    { no: 1, type: 'mc', points: 0.5, answer: 'B' },
    { no: 2, type: 'mc', points: 0.5, answer: 'D' },
    { no: 3, type: 'mc', points: 1, answer: 'A' },
    { no: 4, type: 'mc', points: 1, answer: 'C' },
  ],
};

const ANCHOR_HALF = (10 * MM) / 2;

/** Draws the sheet exactly as the printer would, filling the chosen bubbles. */
function render(template: SheetTemplate, filled: string[], scale = 1, sbd = ''): RgbaImage {
  const width = Math.round(template.page.width * scale);
  const height = Math.round(template.page.height * scale);
  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i += 1) {
    data[i * 4] = 255;
    data[i * 4 + 1] = 255;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = 255;
  }

  const black = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const offset = (y * width + x) * 4;
    data[offset] = 0;
    data[offset + 1] = 0;
    data[offset + 2] = 0;
  };

  // Registration marks.
  for (const anchor of template.anchors) {
    const x0 = Math.floor(anchor.x * scale - ANCHOR_HALF * scale);
    const x1 = Math.ceil(anchor.x * scale + ANCHOR_HALF * scale);
    const y0 = Math.floor(anchor.y * scale - ANCHOR_HALF * scale);
    const y1 = Math.ceil(anchor.y * scale + ANCHOR_HALF * scale);
    for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) black(x, y);
  }

  // Bubbles: outline when empty, solid when marked.
  for (const bubble of template.bubbles) {
    const cx = bubble.cx * scale;
    const cy = bubble.cy * scale;
    const r = bubble.r * scale;
    const isFilled = filled.includes(`${bubble.q}${bubble.label}`);
    const reach = Math.ceil(r + 3);

    for (let y = Math.floor(cy - reach); y <= Math.ceil(cy + reach); y += 1) {
      for (let x = Math.floor(cx - reach); x <= Math.ceil(cx + reach); x += 1) {
        const distance = Math.hypot(x - cx, y - cy);
        if (isFilled) {
          if (distance <= r * 0.85) black(x, y);
        } else if (Math.abs(distance - r) <= Math.max(1, r * 0.2)) {
          black(x, y);
        }
      }
    }
  }

  // Candidate-number grid: one filled circle per column, the rest left empty.
  for (const cell of template.sbd?.cells ?? []) {
    const cx = cell.cx * scale;
    const cy = cell.cy * scale;
    const r = cell.r * scale;
    const isFilled = sbd[cell.column] === String(cell.digit);
    const reach = Math.ceil(r + 3);

    for (let y = Math.floor(cy - reach); y <= Math.ceil(cy + reach); y += 1) {
      for (let x = Math.floor(cx - reach); x <= Math.ceil(cx + reach); x += 1) {
        const distance = Math.hypot(x - cx, y - cy);
        if (isFilled) {
          if (distance <= r * 0.85) black(x, y);
        } else if (Math.abs(distance - r) <= Math.max(1, r * 0.2)) {
          black(x, y);
        }
      }
    }
  }

  return { data, width, height, channels: 4 };
}

test('the four registration marks are found', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử' });
  const image = render(template, []);
  const anchors = detectAnchors(toGray(image), template);

  expect(anchors).not.toBeNull();
  expect(anchors).toHaveLength(4);

  anchors!.forEach((point, index) => {
    expect(point.x).toBeCloseTo(template.anchors[index].x, -1);
    expect(point.y).toBeCloseTo(template.anchors[index].y, -1);
  });
});

test('the homography maps template corners onto themselves', () => {
  const src = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 200 },
    { x: 0, y: 200 },
  ];
  const h = computeHomography(src, src);

  expect(h).not.toBeNull();
  for (const point of src) {
    const mapped = applyHomography(h!, point);
    expect(mapped.x).toBeCloseTo(point.x, 4);
    expect(mapped.y).toBeCloseTo(point.y, 4);
  }
});

test('marked bubbles are read back, untouched ones stay blank', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử' });
  const image = render(template, ['1B', '2D', '3A']);
  const result = readSheet(image, template);

  expect(result.quality.anchorsFound).toBe(true);

  const answers = new Map(result.answers.map((answer) => [answer.q, answer]));
  expect(answers.get(1)?.picked).toBe('B');
  expect(answers.get(2)?.picked).toBe('D');
  expect(answers.get(3)?.picked).toBe('A');

  // Question 4 was left empty on purpose.
  expect(answers.get(4)?.picked).toBeNull();
  expect(answers.get(4)?.flags).toContain('blank');
});

test('two marks on one question are reported as ambiguous, not guessed', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử' });
  const image = render(template, ['1A', '1C']);
  const result = readSheet(image, template);

  const question1 = result.answers.find((answer) => answer.q === 1);
  expect(question1?.flags).toContain('double-mark');
  expect(question1?.picked).toContain('A');
  expect(question1?.picked).toContain('C');
});

test('reading is stable when the photo is smaller than the page', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử' });
  // Simulates a phone that saved a downscaled copy.
  const image = render(template, ['1B', '2D', '3A', '4C'], 0.5);
  const result = readSheet(image, template);

  expect(result.quality.anchorsFound).toBe(true);
  const picked = result.answers.map((answer) => answer.picked).join('');
  expect(picked).toBe('BDAC');
});

test('a photo with no sheet in it is rejected instead of guessed', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử' });
  const blank: RgbaImage = {
    data: new Uint8ClampedArray(400 * 400 * 4).fill(255),
    width: 400,
    height: 400,
    channels: 4,
  };

  const result = readSheet(blank, template);
  expect(result.quality.anchorsFound).toBe(false);
  expect(result.answers).toHaveLength(0);
  expect(result.quality.warnings.join(' ')).toContain('điểm neo');
});

test('the candidate number is read back from the grid', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử', sbdDigits: 6 });
  const image = render(template, [], 0.6, '000123');
  const result = readSheet(image, template);

  expect(result.sbd?.digits).toBe('000123');
  expect(result.sbd?.code).toBe('000123');
});

test('a column left blank makes the whole candidate number unusable', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử', sbdDigits: 6 });
  // Second digit never filled, so the paper could belong to ten different students.
  const image = render(template, [], 0.6, '0?0123');
  const result = readSheet(image, template);

  expect(result.sbd?.code).toBeNull();
  expect(result.sbd?.digits).toContain('?');
});

test('a sheet printed without a grid reports no candidate number', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Đề thử', sbdDigits: 0 });
  const result = readSheet(render(template, []), template);

  expect(template.sbd).toBeUndefined();
  expect(result.sbd).toBeNull();
});
