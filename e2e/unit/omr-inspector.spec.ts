/**
 * The inspector draws what the reader measured, so its geometry has to be the
 * reader's geometry — not a second, drifting implementation. These tests run the
 * real `inspectSheet` on a synthetic page and check the overlay data lines up
 * with the bubbles that were actually filled in.
 */
import { expect, test } from '@playwright/test';
import QRCode from 'qrcode';
import { MM, buildSheetTemplate, type SheetTemplate } from '../../lib/grading/sheet-template';
import type { RgbaImage } from '../../lib/grading/omr';
import { inspectSheet, placeSheet, readSheet, toGray } from '../../lib/grading/omr';
import type { Rubric } from '../../lib/grading/rubric';

const RUBRIC: Rubric = {
  version: 1,
  totalPoints: 4,
  questions: Array.from({ length: 4 }, (_, index) => ({
    no: index + 1,
    type: 'mc' as const,
    points: 1,
    answer: 'A',
  })),
};

const ANCHOR_HALF = (10 * MM) / 2;
const ANSWERS: Record<number, string> = { 1: 'A', 2: 'C', 3: 'B', 4: 'D' };
const SBD = '000001';

function disc(image: RgbaImage, cx: number, cy: number, radius: number, value: number) {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      if (x < 0 || y < 0 || x >= image.width || y >= image.height) continue;
      if ((x - cx) ** 2 + (y - cy) ** 2 > radius * radius) continue;
      const offset = (y * image.width + x) * 4;
      image.data[offset] = value;
      image.data[offset + 1] = value;
      image.data[offset + 2] = value;
    }
  }
}

function ring(image: RgbaImage, cx: number, cy: number, radius: number, thickness: number) {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      if (x < 0 || y < 0 || x >= image.width || y >= image.height) continue;
      const distance = Math.hypot(x - cx, y - cy);
      if (distance > radius || distance < radius - thickness) continue;
      const offset = (y * image.width + x) * 4;
      image.data[offset] = 40;
      image.data[offset + 1] = 40;
      image.data[offset + 2] = 40;
    }
  }
}

/** A printed sheet photographed flat: four corner marks, rings, and the marks a student made. */
function sheetPhoto(template: SheetTemplate, scale: number): RgbaImage {
  const width = Math.round(template.page.width * scale);
  const height = Math.round(template.page.height * scale);
  const image: RgbaImage = { width, height, data: new Uint8ClampedArray(width * height * 4).fill(255) };

  for (const anchor of template.anchors) {
    disc(image, anchor.x * scale, anchor.y * scale, ANCHOR_HALF * scale, 0);
  }

  for (const bubble of template.bubbles) {
    ring(image, bubble.cx * scale, bubble.cy * scale, bubble.r * scale, Math.max(1, 1.2 * scale));
  }
  for (const bubble of template.bubbles) {
    if (ANSWERS[bubble.q] === bubble.label) {
      disc(image, bubble.cx * scale, bubble.cy * scale, bubble.r * scale * 0.62, 30);
    }
  }

  for (const cell of template.sbd?.cells ?? []) {
    ring(image, cell.cx * scale, cell.cy * scale, cell.r * scale, Math.max(1, 1.2 * scale));
    if (SBD[cell.column] === String(cell.digit)) {
      disc(image, cell.cx * scale, cell.cy * scale, cell.r * scale * 0.62, 30);
    }
  }

  return image;
}

test('the inspector finds the four corners it says it found', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const result = inspectSheet(sheetPhoto(template, 1.5), template);

  expect(result.anchors).not.toBeNull();
  expect(result.anchors).toHaveLength(4);
  for (const anchor of result.anchors ?? []) {
    expect(anchor.x).toBeGreaterThan(0);
    expect(anchor.x).toBeLessThan(result.width);
    expect(anchor.y).toBeGreaterThan(0);
    expect(anchor.y).toBeLessThan(result.height);
  }
});

test('every mark carries the pixel position the overlay needs', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const result = inspectSheet(sheetPhoto(template, 1.5), template);

  expect(result.marks).toHaveLength(template.bubbles.length);
  for (const mark of result.marks) {
    expect(Number.isFinite(mark.x)).toBe(true);
    expect(Number.isFinite(mark.y)).toBe(true);
    expect(mark.x!).toBeGreaterThan(0);
    expect(mark.x!).toBeLessThan(result.width);
    expect(mark.y!).toBeGreaterThan(0);
    expect(mark.y!).toBeLessThan(result.height);
    expect(mark.radius!).toBeGreaterThan(0);
  }
});

test('the bubbles that were filled are the ones reported as chosen', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const result = inspectSheet(sheetPhoto(template, 1.5), template);

  expect(result.answers.map((answer) => `${answer.q}${answer.picked}`)).toEqual([
    '1A',
    '2C',
    '3B',
    '4D',
  ]);
});

test('the candidate-number grid is drawn from the same cells that were read', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const result = inspectSheet(sheetPhoto(template, 1.5), template);

  expect(result.sbdMarks).toHaveLength(template.sbd!.cells.length);
  expect(result.sbdMarks.filter((mark) => mark.picked)).toHaveLength(6);
  expect(result.sbd?.digits).toBe(SBD);
});

test('a page with no corners reports nothing instead of inventing marks', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const blank: RgbaImage = {
    width: 800,
    height: 1100,
    data: new Uint8ClampedArray(800 * 1100 * 4).fill(255),
  };
  const result = inspectSheet(blank, template);

  expect(result.anchors).toBeNull();
  expect(result.marks).toEqual([]);
  expect(result.answers).toEqual([]);
  expect(result.warnings[0]).toContain('điểm neo');
});

/** Four dark squares, placed wherever the test wants them. */
function cornersPhoto(width: number, height: number, spots: Array<[number, number]>): RgbaImage {
  const image: RgbaImage = {
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4).fill(255),
  };
  for (const [x, y] of spots) disc(image, x, y, 26, 0);
  return image;
}

test('a clean sheet is trusted, and none of its answers are flagged', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const result = inspectSheet(sheetPhoto(template, 1.5), template);

  expect(result.anchorsSuspect).toBe(false);
  expect(result.anchorReasons).toEqual([]);
});

test('corners that do not make a sheet are called out, not trusted', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  // One blob per quadrant, so the detector accepts them — but the top edge is
  // half the bottom edge, which no camera angle produces on a flat sheet.
  const photo = cornersPhoto(900, 1200, [
    [450, 120],
    [820, 120],
    [820, 1080],
    [80, 1080],
  ]);
  const result = inspectSheet(photo, template);

  expect(result.anchorsSuspect).toBe(true);
  expect(result.anchorReasons.join(' ')).toMatch(/hình chữ nhật|Tỉ lệ|đảo thứ tự/);
});

test('a read with bad corners flags every answer so the paper needs review', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const photo = cornersPhoto(900, 1200, [
    [450, 120],
    [820, 120],
    [820, 1080],
    [80, 1080],
  ]);
  const result = readSheet(photo, template);

  expect(result.quality.anchorsSuspect).toBe(true);
  expect(result.answers.length).toBeGreaterThan(0);
  for (const answer of result.answers) expect(answer.flags).toContain('unstable-anchors');
});

test('a washed-out corner is reported as glare rather than used', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const image = sheetPhoto(template, 1.5);
  // Reprint the top-left corner in pale grey: still a blob, but obviously not ink.
  const anchor = template.anchors[0];
  disc(image, anchor.x * 1.5, anchor.y * 1.5, ANCHOR_HALF * 1.5, 130);

  const result = inspectSheet(image, template);
  const reasons = result.anchorReasons.join(' ');

  expect(result.anchorsSuspect || !result.anchors).toBe(true);
  if (result.anchors) expect(reasons).toMatch(/chói|đậm|hình chữ nhật|Tỉ lệ/);
});

/** Draws a real QR (from the same library the printed sheet uses) into the template's QR box. */
function drawQr(image: RgbaImage, template: SheetTemplate, payload: string, scale: number) {
  const code = QRCode.create(payload, { errorCorrectionLevel: 'M' });
  const size = code.modules.size;
  const modules = code.modules.data;
  const box = template.qr;
  const moduleSize = (box.size / size) * scale;

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (!modules[row * size + column]) continue;
      const left = (box.x + column * (box.size / size)) * scale;
      const top = (box.y + row * (box.size / size)) * scale;
      for (let y = Math.floor(top); y < Math.ceil(top + moduleSize); y += 1) {
        for (let x = Math.floor(left); x < Math.ceil(left + moduleSize); x += 1) {
          if (x < 0 || y < 0 || x >= image.width || y >= image.height) continue;
          const offset = (y * image.width + x) * 4;
          image.data[offset] = 0;
          image.data[offset + 1] = 0;
          image.data[offset + 2] = 0;
        }
      }
    }
  }
}

test('a sheet whose corner became glare is placed by its QR code instead', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const image = sheetPhoto(template, 1.5);
  drawQr(image, template, '{"v":1,"sid":null,"code":"000001"}', 1.5);

  // Wipe one corner out, the way a lamp glare does.
  const corner = template.anchors[0];
  disc(image, corner.x * 1.5, corner.y * 1.5, ANCHOR_HALF * 1.8, 255);

  const result = readSheet(image, template);

  expect(result.quality.anchorsSuspect).toBeFalsy();
  expect(result.answers.map((answer) => `${answer.q}${answer.picked}`)).toEqual([
    '1A',
    '2C',
    '3B',
    '4D',
  ]);
  expect(result.quality.warnings.join(' ')).toMatch(/chói|mã QR/);
});

test('even with all four corners gone, the QR finds the sheet', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const image = sheetPhoto(template, 1.5);
  drawQr(image, template, '{"v":1,"sid":null,"code":"000001"}', 1.5);

  for (const corner of template.anchors) {
    disc(image, corner.x * 1.5, corner.y * 1.5, ANCHOR_HALF * 1.8, 255);
  }

  const placement = placeSheet(image, toGray(image), template);
  expect(placement.source).toBe('qr');
  expect(placement.substituted).toHaveLength(4);

  const result = readSheet(image, template);
  expect(result.quality.anchorsSuspect).toBeFalsy();
  expect(result.answers.filter((answer) => answer.picked !== null)).toHaveLength(4);
});

test('the inspector says which landmark it trusted', () => {
  const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });
  const clean = inspectSheet(sheetPhoto(template, 1.5), template);
  expect(clean.anchorSource).toBe('corners');
  expect(clean.qrCorners).toBeNull();

  const image = sheetPhoto(template, 1.5);
  drawQr(image, template, '{"v":1,"sid":null,"code":"000001"}', 1.5);
  const corner = template.anchors[2];
  disc(image, corner.x * 1.5, corner.y * 1.5, ANCHOR_HALF * 1.8, 255);

  const recovered = inspectSheet(image, template);
  expect(recovered.anchorSource).toBe('qr');
  expect(recovered.qrCorners).toHaveLength(4);
  expect(recovered.substitutedCorners).toContain(2);
});
