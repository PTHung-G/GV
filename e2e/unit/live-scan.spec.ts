/**
 * Unit tests for the live scanner's aiming rule.
 *
 * The scanner shoots by itself, so this rule is what stands between a working
 * queue and a queue full of the same sheet photographed six times. It is pure,
 * which is the only reason it can be tested without a camera.
 */
import { expect, test } from '@playwright/test';
import { MM, buildSheetTemplate, type SheetTemplate } from '../../lib/grading/sheet-template';
import type { RgbaImage } from '../../lib/grading/omr';
import type { Rubric } from '../../lib/grading/rubric';
import {
  DEFAULT_GATE,
  NOT_FOUND,
  guideFor,
  inspectFrame,
  shouldFire,
} from '../../lib/grading/live-scan';

const RUBRIC: Rubric = {
  version: 1,
  totalPoints: 5,
  questions: Array.from({ length: 5 }, (_, index) => ({
    no: index + 1,
    type: 'mc' as const,
    points: 1,
    answer: 'A',
  })),
};

const ANCHOR_HALF = (10 * MM) / 2;

/**
 * A camera frame: a white background with the printed sheet lying in it at
 * `scale`, centred. Same shape as the aiming loop sees from a phone.
 */
function view(template: SheetTemplate, scale: number, frameW: number, frameH: number): RgbaImage {
  // Pixel buffers are indexed by whole pixels; a fractional frame size would
  // silently truncate the buffer and everything downstream would read zeroes.
  const frameWidth = Math.round(frameW);
  const frameHeight = Math.round(frameH);
  const data = new Uint8ClampedArray(frameWidth * frameHeight * 4).fill(255);
  const left = Math.round((frameWidth - template.page.width * scale) / 2);
  const top = Math.round((frameHeight - template.page.height * scale) / 2);

  for (const anchor of template.anchors) {
    const cx = left + anchor.x * scale;
    const cy = top + anchor.y * scale;
    const half = ANCHOR_HALF * scale;
    for (let y = Math.floor(cy - half); y < Math.ceil(cy + half); y += 1) {
      for (let x = Math.floor(cx - half); x < Math.ceil(cx + half); x += 1) {
        if (x < 0 || y < 0 || x >= frameWidth || y >= frameHeight) continue;
        const offset = (y * frameWidth + x) * 4;
        data[offset] = 0;
        data[offset + 1] = 0;
        data[offset + 2] = 0;
      }
    }
  }

  return { width: frameWidth, height: frameHeight, data, channels: 4 };
}

const template = buildSheetTemplate(RUBRIC, { title: 'Phiếu thử', sbdDigits: 6 });

test('a sheet filling the frame is reported as found and square', () => {
  const preview = inspectFrame(view(template, 1, template.page.width, template.page.height), template);

  expect(preview.found).toBe(true);
  // Coverage is measured across the registration marks, which sit 17 mm inside
  // the paper, so a full-frame sheet reads about 0.84 rather than 1.
  expect(preview.coverage).toBeGreaterThan(0.8);
  expect(preview.squareness).toBeGreaterThan(0.9);
  expect(preview.center.x).toBeCloseTo(0.5, 1);
  expect(preview.center.y).toBeCloseTo(0.5, 1);
});

test('an empty frame reports nothing rather than guessing', () => {
  const empty: RgbaImage = {
    width: 800,
    height: 1000,
    data: new Uint8ClampedArray(800 * 1000 * 4).fill(255),
    channels: 4,
  };

  expect(inspectFrame(empty, template)).toEqual(NOT_FOUND);
});

test('a sheet that is too far away is not shot', () => {
  const preview = inspectFrame(view(template, 0.6, 1200, 1600), template);

  expect(preview.found).toBe(true);
  expect(preview.coverage).toBeLessThan(DEFAULT_GATE.minCoverage);
  expect(shouldFire({ preview, heldFrames: 10, sinceLastShotMs: 10_000, armed: true })).toBe(false);
  expect(guideFor(preview, 10).tone).toBe('closer');
});

test('the shot waits for the sheet to be held still', () => {
  const preview = inspectFrame(view(template, 1, template.page.width, template.page.height), template);
  const base = { preview, sinceLastShotMs: 10_000, armed: true };

  expect(shouldFire({ ...base, heldFrames: 0 })).toBe(false);
  expect(shouldFire({ ...base, heldFrames: DEFAULT_GATE.frames - 1 })).toBe(false);
  expect(shouldFire({ ...base, heldFrames: DEFAULT_GATE.frames })).toBe(true);
  expect(guideFor(preview, 0).tone).toBe('steady');
  expect(guideFor(preview, DEFAULT_GATE.frames).tone).toBe('ready');
});

test('nothing is shot again until the sheet has left the frame', () => {
  const preview = inspectFrame(view(template, 1, template.page.width, template.page.height), template);
  const base = { preview, heldFrames: 10, sinceLastShotMs: 10_000 };

  // The same sheet, still in place, right after being filed: this is the case
  // that would otherwise file one paper twice.
  expect(shouldFire({ ...base, armed: false })).toBe(false);
  expect(shouldFire({ ...base, armed: true })).toBe(true);
});

test('the cooldown covers the moment the confirmation is on screen', () => {
  const preview = inspectFrame(view(template, 1, template.page.width, template.page.height), template);
  const base = { preview, heldFrames: 10, armed: true };

  expect(shouldFire({ ...base, sinceLastShotMs: DEFAULT_GATE.cooldownMs - 1 })).toBe(false);
  expect(shouldFire({ ...base, sinceLastShotMs: DEFAULT_GATE.cooldownMs })).toBe(true);
});

test('the teacher is told to aim before being told anything else', () => {
  expect(guideFor(NOT_FOUND, 0)).toEqual({ tone: 'aim', text: 'Đưa 4 góc đen của phiếu vào khung' });
});
