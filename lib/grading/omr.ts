/**
 * Optical mark reading for the standard answer sheet.
 *
 * No AI is involved: we know exactly where every bubble should be, so scoring
 * is a geometry problem plus a brightness comparison. That makes this branch
 * fast, free, and far more reliable than asking a model to read circles.
 *
 * The pipeline is:
 *   1. find the four corner registration marks;
 *   2. build the homography that maps template pixels onto photo pixels;
 *   3. for each expected bubble, sample the disc and compare it with the ring
 *      of paper immediately around it — a local comparison, so uneven lighting
 *      across the page does not matter.
 *
 * Bubbles are sampled in place through the inverse mapping rather than warping
 * the whole image: cheaper, and it keeps the original pixels for the teacher.
 */
import jsQR from 'jsqr';
import type { McLetter } from './rubric';
import type { Point, SheetTemplate } from './sheet-template';

export type RgbaImage = {
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
  /** 4 for RGBA (browser) or 1 for a ready-made grayscale buffer. */
  channels?: number;
};

export type Gray = { data: Uint8ClampedArray; width: number; height: number };

export type BubbleReadout = {
  q: number;
  label: McLetter | string;
  fill: number;
  confidence: number;
  /** Centre and sampling radius in image pixels, for the inspector overlay. */
  x?: number;
  y?: number;
  radius?: number;
};

export type QuestionReadout = {
  q: number;
  picked: string | null;
  confidence: number;
  flags: string[];
};

export type SbdReadout = {
  /** Digits read from the grid, with `?` for a column the student left blank. */
  digits: string;
  /** Usable candidate number, or null when any column is undecided. */
  code: string | null;
  /** Lowest per-digit confidence across the grid. */
  confidence: number;
};

export type OmrResult = {
  answers: QuestionReadout[];
  quality: {
    anchorsFound: boolean;
    scale: number;
    skew: number;
    warnings: string[];
    /**
     * Four corners were found, but they do not make the shape of our sheet.
     * The read still returns answers; the flag is what stops them being trusted
     * silently.
     */
    anchorsSuspect?: boolean;
  };
  /** Present only for sheets that carry a candidate-number grid. */
  sbd: SbdReadout | null;
  qr: string | null;
};

/** Filled when the disc is at least this much darker than the surrounding ring. */
const FILL_THRESHOLD = 30;
/** Below this the bubble is reported as uncertain rather than decided. */
const CONFIDENT = 0.55;
/** Anchor side as a fraction of page width: 10mm on a 210mm page. */
const ANCHOR_FRACTION = 10 / 210;

export function toGray(image: RgbaImage): Gray {
  const channels = image.channels ?? 4;
  const pixels = image.width * image.height;
  const out = new Uint8ClampedArray(pixels);
  const source = image.data;

  if (channels === 1) {
    out.set(source.subarray(0, pixels) as Uint8ClampedArray);
    return { data: out, width: image.width, height: image.height };
  }

  for (let i = 0; i < pixels; i += 1) {
    const offset = i * channels;
    // Rec. 601 luma; the exact weights matter little for black-on-white marks.
    out[i] = (source[offset] * 299 + source[offset + 1] * 587 + source[offset + 2] * 114) / 1000;
  }
  return { data: out, width: image.width, height: image.height };
}

/** Box-downsamples to the requested width, which makes blob finding cheap. */
function downscale(gray: Gray, targetWidth: number): { data: Uint8ClampedArray; width: number; height: number; factor: number } {
  if (gray.width <= targetWidth) {
    return { data: gray.data, width: gray.width, height: gray.height, factor: 1 };
  }
  const factor = gray.width / targetWidth;
  const width = Math.round(targetWidth);
  const height = Math.max(1, Math.round(gray.height / factor));
  const out = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y += 1) {
    const y0 = Math.floor(y * factor);
    const y1 = Math.min(gray.height, Math.floor((y + 1) * factor));
    for (let x = 0; x < width; x += 1) {
      const x0 = Math.floor(x * factor);
      const x1 = Math.min(gray.width, Math.floor((x + 1) * factor));
      let sum = 0;
      let count = 0;
      for (let sy = y0; sy < y1; sy += 1) {
        for (let sx = x0; sx < x1; sx += 1) {
          sum += gray.data[sy * gray.width + sx];
          count += 1;
        }
      }
      out[y * width + x] = count === 0 ? 255 : sum / count;
    }
  }

  return { data: out, width, height, factor };
}

type Blob = { x: number; y: number; w: number; h: number; area: number; cx: number; cy: number };

/** Connected components of dark pixels, filtered down to square-ish marks. */
function findMarks(
  image: { data: Uint8ClampedArray; width: number; height: number },
  threshold: number,
): Blob[] {
  const { data, width, height } = image;
  const seen = new Uint8Array(width * height);
  const blobs: Blob[] = [];
  const stack: number[] = [];

  for (let start = 0; start < data.length; start += 1) {
    if (seen[start] || data[start] > threshold) continue;

    stack.length = 0;
    stack.push(start);
    seen[start] = 1;

    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let area = 0;
    let sumX = 0;
    let sumY = 0;

    while (stack.length > 0) {
      const index = stack.pop() as number;
      const x = index % width;
      const y = (index - x) / width;

      area += 1;
      sumX += x;
      sumY += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      // 4-connectivity is enough for printed marks and avoids diagonal bleed.
      if (x > 0) {
        const next = index - 1;
        if (!seen[next] && data[next] <= threshold) {
          seen[next] = 1;
          stack.push(next);
        }
      }
      if (x < width - 1) {
        const next = index + 1;
        if (!seen[next] && data[next] <= threshold) {
          seen[next] = 1;
          stack.push(next);
        }
      }
      if (y > 0) {
        const next = index - width;
        if (!seen[next] && data[next] <= threshold) {
          seen[next] = 1;
          stack.push(next);
        }
      }
      if (y < height - 1) {
        const next = index + width;
        if (!seen[next] && data[next] <= threshold) {
          seen[next] = 1;
          stack.push(next);
        }
      }
    }

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const fill = area / (w * h);
    const aspect = w / h;

    // A registration mark is a solid, square, reasonably sized block.
    if (w >= 3 && h >= 3 && fill > 0.55 && aspect > 0.55 && aspect < 1.8) {
      blobs.push({
        x: minX,
        y: minY,
        w,
        h,
        area,
        cx: sumX / area,
        cy: sumY / area,
      });
    }
  }

  return blobs;
}

/**
 * Locates the four corner marks.
 *
 * Works in the top-left / top-right / bottom-right / bottom-left quadrants and
 * then checks that the four chosen marks are of similar size — a big dark
 * heading elsewhere on the page is filtered out by that size agreement.
 */
export type AnchorCheck = { ok: boolean; reasons: string[] };

/** Corner names, in the order `template.anchors` stores them. */
const CORNER_NAMES = ['góc trên trái', 'góc trên phải', 'góc dưới phải', 'góc dưới trái'];

const SIDE_TOLERANCE = 1.5;
const ASPECT_TOLERANCE = 1.6;
/** Printed corners are black ink; anything this light is glare, not a mark. */
const INK_LIMIT = 110;

/**
 * Are these four points really the corners of our sheet?
 *
 * `detectAnchors` only asks for four dark blobs, one per quadrant, near each
 * image corner. A photo of a screen, a glare spot over one corner, or a dark
 * window frame will satisfy that while being wrong — and a wrong quad silently
 * shifts every bubble sample onto blank paper. Geometry and ink darkness are
 * cheap to check and catch exactly that case.
 */
export function checkAnchors(
  gray: Gray,
  template: SheetTemplate,
  anchors: Point[],
  options: { skipInk?: number[] } = {},
): AnchorCheck {
  const reasons: string[] = [];
  if (anchors.length !== 4) return { ok: false, reasons: ['Không đủ 4 điểm neo.'] };

  const [tl, tr, br, bl] = anchors;
  const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

  const top = distance(tl, tr);
  const right = distance(tr, br);
  const bottom = distance(bl, br);
  const left = distance(tl, bl);

  if (Math.min(top, right, bottom, left) < 20) {
    reasons.push('4 điểm neo nằm quá sát nhau, không thể là 4 góc phiếu.');
    return { ok: false, reasons };
  }

  // Perspective shortens the far side of a sheet, but never by half.
  const ratio = (a: number, b: number) => Math.max(a, b) / Math.max(1, Math.min(a, b));
  if (ratio(top, bottom) > SIDE_TOLERANCE || ratio(left, right) > SIDE_TOLERANCE) {
    reasons.push('4 điểm neo không tạo thành hình chữ nhật của phiếu (cạnh trên/dưới lệch nhau).');
  }

  const templateTop = distance(template.anchors[0], template.anchors[1]);
  const templateLeft = distance(template.anchors[0], template.anchors[3]);
  const foundAspect = (top + bottom) / 2 / Math.max(1, (left + right) / 2);
  const paperAspect = templateTop / Math.max(1, templateLeft);
  const aspectRatio = Math.max(foundAspect, paperAspect) / Math.max(0.001, Math.min(foundAspect, paperAspect));
  if (aspectRatio > ASPECT_TOLERANCE) {
    reasons.push('Tỉ lệ khung tìm được không giống khổ phiếu A4 (ảnh bị nghiêng hoặc bị che).');
  }

  // A convex quad in corner order; crossed corners mean two marks were swapped.
  const cross = (o: Point, a: Point, b: Point) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const turns = [cross(tl, tr, br), cross(tr, br, bl), cross(br, bl, tl), cross(bl, tl, tr)];
  if (!(turns.every((turn) => turn > 0) || turns.every((turn) => turn < 0))) {
    reasons.push('4 điểm neo bị đảo thứ tự, không phải 4 góc của cùng một tờ.');
  }

  const scale = (top + bottom + left + right) / (templateTop * 2 + templateLeft * 2) || 1;
  const inkRadius = Math.max(2, ANCHOR_FRACTION * ((top + bottom) / 2) * 0.45);
  const skip = new Set(options.skipInk ?? []);
  const faded = anchors
    .map((anchor, index) => ({ index, ink: meanInDisc(gray, anchor.x, anchor.y, inkRadius) }))
    .filter((spot) => spot.ink > INK_LIMIT)
    .filter((spot) => !skip.has(spot.index))
    .map((spot) => CORNER_NAMES[spot.index]);

  if (faded.length > 0) {
    reasons.push(`${faded.join(', ')} không đủ đậm — có thể bị chói hoặc bị che, nên chụp lại.`);
  }

  if (reasons.length === 0 && (scale < 0.02 || scale > 40)) {
    reasons.push('Cỡ phiếu trong ảnh bất thường.');
  }

  return { ok: reasons.length === 0, reasons };
}

function pickQuadBlobs(small: { width: number; height: number; factor: number }, candidates: Blob[]): Point[] | null {
  if (candidates.length < 4) return null;
  const corners: Array<{ x: number; y: number }> = [
    { x: 0, y: 0 },
    { x: small.width, y: 0 },
    { x: small.width, y: small.height },
    { x: 0, y: small.height },
  ];

  const chosen: Blob[] = [];
  for (const corner of corners) {
    const inQuadrant = candidates.filter((mark) => {
      const relativeX = mark.cx / small.width;
      const relativeY = mark.cy / small.height;
      const right = corner.x > 0;
      const bottom = corner.y > 0;
      return (
        (right ? relativeX > 0.45 : relativeX < 0.55) && (bottom ? relativeY > 0.45 : relativeY < 0.55)
      );
    });

    if (inQuadrant.length === 0) return null;

    inQuadrant.sort((a, b) => {
      const da = (a.cx - corner.x) ** 2 + (a.cy - corner.y) ** 2;
      const db = (b.cx - corner.x) ** 2 + (b.cy - corner.y) ** 2;
      return da - db;
    });
    chosen.push(inQuadrant[0]);
  }

  if (chosen.length !== 4) return null;
  const areas = chosen.map((mark) => mark.w * mark.h);
  if (Math.max(...areas) / Math.min(...areas) > 3.2) return null;
  return chosen.map((mark) => ({ x: mark.cx * small.factor, y: mark.cy * small.factor }));
}

function quadrantDarkThreshold(
  small: { data: Uint8ClampedArray; width: number; height: number },
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): number {
  const hist = new Uint32Array(256);
  let total = 0;
  for (let y = y0; y < y1; y += 1) {
    const row = y * small.width;
    for (let x = x0; x < x1; x += 1) {
      hist[small.data[row + x]] += 1;
      total += 1;
    }
  }
  if (!total) return 110;
  let seen = 0;
  let p05 = 0;
  let p50 = 180;
  for (let v = 0; v < 256; v += 1) {
    seen += hist[v];
    if (seen >= total * 0.05 && p05 === 0) p05 = v;
    if (seen >= total * 0.5) {
      p50 = v;
      break;
    }
  }
  return Math.max(55, Math.min(175, Math.round(p05 + (p50 - p05) * 0.45)));
}

export function detectAnchors(gray: Gray, template: SheetTemplate): Point[] | null {
  const small = downscale(gray, 380);
  const expected = (ANCHOR_FRACTION * small.width) ** 2;
  const filterBlobs = (marks: Blob[]) =>
    marks.filter((mark) => mark.area > expected * 0.08 && mark.area < expected * 12);

  let fallback: Point[] | null = null;
  for (const threshold of [110, 85, 135, 160]) {
    const candidates = filterBlobs(findMarks(small, threshold));
    const pts = pickQuadBlobs(small, candidates);
    if (!pts) continue;
    if (!fallback) fallback = pts;
    if (checkAnchors(gray, template, pts).ok) return pts;
  }

  // Adaptive per-quadrant local thresholding when lighting across corners is uneven.
  const hw = Math.floor(small.width / 2);
  const hh = Math.floor(small.height / 2);
  const quadBoxes: Array<[number, number, number, number]> = [
    [0, 0, hw + 10, hh + 10],
    [Math.max(0, hw - 10), 0, small.width, hh + 10],
    [Math.max(0, hw - 10), Math.max(0, hh - 10), small.width, small.height],
    [0, Math.max(0, hh - 10), hw + 10, small.height],
  ];
  const adaptivePts: Point[] = [];
  for (const [x0, y0, x1, y1] of quadBoxes) {
    const t = quadrantDarkThreshold(small, x0, y0, x1, y1);
    const blobs = filterBlobs(findMarks(small, t)).filter(
      (b) => b.cx >= x0 && b.cx <= x1 && b.cy >= y0 && b.cy <= y1,
    );
    if (!blobs.length) break;
    const cxTarget = x0 === 0 ? 0 : small.width;
    const cyTarget = y0 === 0 ? 0 : small.height;
    blobs.sort(
      (a, b) =>
        (a.cx - cxTarget) ** 2 + (a.cy - cyTarget) ** 2 -
        ((b.cx - cxTarget) ** 2 + (b.cy - cyTarget) ** 2),
    );
    adaptivePts.push({ x: blobs[0].cx * small.factor, y: blobs[0].cy * small.factor });
  }
  if (adaptivePts.length === 4 && checkAnchors(gray, template, adaptivePts).ok) {
    return adaptivePts;
  }

  return fallback;
}

// ------------------------------------------------------------- homography

function solveLinear(matrix: number[][], vector: number[]): number[] | null {
  const n = vector.length;
  const a = matrix.map((row, index) => [...row, vector[index]]);

  for (let column = 0; column < n; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < n; row += 1) {
      if (Math.abs(a[row][column]) > Math.abs(a[pivot][column])) pivot = row;
    }
    if (Math.abs(a[pivot][column]) < 1e-10) return null;

    [a[column], a[pivot]] = [a[pivot], a[column]];

    for (let row = 0; row < n; row += 1) {
      if (row === column) continue;
      const factor = a[row][column] / a[column][column];
      if (factor === 0) continue;
      for (let k = column; k <= n; k += 1) a[row][k] -= factor * a[column][k];
    }
  }

  return a.map((row, index) => row[n] / row[index]);
}

/** Returns the 8 coefficients mapping `src` onto `dst`, or null if degenerate. */
export function computeHomography(src: Point[], dst: Point[]): number[] | null {
  if (src.length !== 4 || dst.length !== 4) return null;

  const matrix: number[][] = [];
  const vector: number[] = [];

  for (let i = 0; i < 4; i += 1) {
    const { x, y } = src[i];
    const { x: u, y: v } = dst[i];

    matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    vector.push(u);
    matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    vector.push(v);
  }

  return solveLinear(matrix, vector);
}

export function applyHomography(h: number[], point: Point): Point {
  const denominator = h[6] * point.x + h[7] * point.y + 1;
  if (Math.abs(denominator) < 1e-9) return { x: Number.NaN, y: Number.NaN };
  return {
    x: (h[0] * point.x + h[1] * point.y + h[2]) / denominator,
    y: (h[3] * point.x + h[4] * point.y + h[5]) / denominator,
  };
}

// ---------------------------------------------------------------- sampling

function meanInDisc(gray: Gray, cx: number, cy: number, radius: number): number {
  const r = Math.max(1, radius);
  let sum = 0;
  let count = 0;

  const minX = Math.max(0, Math.floor(cx - r));
  const maxX = Math.min(gray.width - 1, Math.ceil(cx + r));
  const minY = Math.max(0, Math.floor(cy - r));
  const maxY = Math.min(gray.height - 1, Math.ceil(cy + r));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > r * r) continue;
      sum += gray.data[y * gray.width + x];
      count += 1;
    }
  }

  return count === 0 ? 255 : sum / count;
}

function meanInRing(gray: Gray, cx: number, cy: number, inner: number, outer: number): number {
  let sum = 0;
  let count = 0;

  const minX = Math.max(0, Math.floor(cx - outer));
  const maxX = Math.min(gray.width - 1, Math.ceil(cx + outer));
  const minY = Math.max(0, Math.floor(cy - outer));
  const maxY = Math.min(gray.height - 1, Math.ceil(cy + outer));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = dx * dx + dy * dy;
      if (distance < inner * inner || distance > outer * outer) continue;
      sum += gray.data[y * gray.width + x];
      count += 1;
    }
  }

  return count === 0 ? 255 : sum / count;
}

export function readBubbles(
  gray: Gray,
  template: SheetTemplate,
  anchors: Point[],
): {
  readouts: BubbleReadout[];
  answers: QuestionReadout[];
  sbd: SbdReadout | null;
  scale: number;
  warnings: string[];
} {
  const homography = computeHomography(template.anchors, anchors);
  if (!homography) {
    return {
      readouts: [],
      answers: [],
      sbd: null,
      scale: 1,
      warnings: ['Không dựng được phép biến đổi phối cảnh.'],
    };
  }

  // Scale tells us how many image pixels one template pixel became, which is
  // what the sampling radius has to follow.
  const origin = applyHomography(homography, { x: 0, y: 0 });
  const unitX = applyHomography(homography, { x: 100, y: 0 });
  const unitY = applyHomography(homography, { x: 0, y: 100 });
  const scaleX = Math.hypot(unitX.x - origin.x, unitX.y - origin.y) / 100;
  const scaleY = Math.hypot(unitY.x - origin.x, unitY.y - origin.y) / 100;
  const scale = (scaleX + scaleY) / 2 || 1;

  const warnings: string[] = [];
  if (scale < 0.6) warnings.push('Ảnh quá nhỏ so với phiếu, nên chụp gần hơn.');

  const readouts: BubbleReadout[] = [];
  for (const bubble of template.bubbles) {
    const center = applyHomography(homography, { x: bubble.cx, y: bubble.cy });
    if (!Number.isFinite(center.x) || !Number.isFinite(center.y)) continue;
    if (center.x < 0 || center.y < 0 || center.x >= gray.width || center.y >= gray.height) continue;

    const radius = bubble.r * scale;
    const paper = meanInRing(gray, center.x, center.y, radius * 1.6, radius * 2.6);
    const disc = meanInDisc(gray, center.x, center.y, radius * 0.8);
    const fill = paper - disc;

    readouts.push({
      q: bubble.q,
      label: bubble.label,
      fill,
      confidence: Math.min(1, Math.max(0, Math.abs(fill) / 70)),
      x: center.x,
      y: center.y,
      radius,
    });
  }

  // Group per question: one clear mark wins, two marks is ambiguous, none means
  // the student left it blank.
  const byQuestion = new Map<number, BubbleReadout[]>();
  for (const readout of readouts) {
    const list = byQuestion.get(readout.q) ?? [];
    list.push(readout);
    byQuestion.set(readout.q, list);
  }

  const answers: QuestionReadout[] = [];
  for (const [q, list] of [...byQuestion.entries()].sort((a, b) => a[0] - b[0])) {
    const filled = list.filter((readout) => readout.fill > FILL_THRESHOLD);

    if (filled.length === 0) {
      answers.push({ q, picked: null, confidence: 0, flags: ['blank'] });
      continue;
    }

    if (filled.length > 1) {
      answers.push({
        q,
        picked: filled.map((readout) => readout.label).join(''),
        confidence: 0.2,
        flags: ['double-mark'],
      });
      continue;
    }

    const winner = filled[0];
    const confidence = Math.min(1, Math.max(0, winner.confidence));
    answers.push({
      q,
      picked: winner.label,
      confidence,
      flags: confidence < CONFIDENT ? ['low-confidence'] : [],
    });
  }

  // ---- Part II: True/False Đ/S grid
  if (template.tfBubbles?.length) {
    const tfByQ = new Map<number, typeof template.tfBubbles>();
    for (const item of template.tfBubbles) {
      const list = tfByQ.get(item.q) ?? [];
      list.push(item);
      tfByQ.set(item.q, list);
    }
    for (const [q, items] of [...tfByQ.entries()].sort((a, b) => a[0] - b[0])) {
      const subOrder: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd'];
      let chars = '';
      let minConf = 1;
      let anyBlank = false;
      let anyDouble = false;
      let filledTotal = 0;

      for (const sub of subOrder) {
        const pair = items.filter((b) => b.sub === sub);
        const sampled = pair
          .map((b) => {
            const center = applyHomography(homography, { x: b.cx, y: b.cy });
            if (!Number.isFinite(center.x) || !Number.isFinite(center.y)) return null;
            if (center.x < 0 || center.y < 0 || center.x >= gray.width || center.y >= gray.height) {
              return null;
            }
            const radius = b.r * scale;
            const paper = meanInRing(gray, center.x, center.y, radius * 1.45, radius * 2.25);
            const disc = meanInDisc(gray, center.x, center.y, radius * 0.78);
            const fill = paper - disc;
            const confidence = Math.min(1, Math.max(0, Math.abs(fill) / 70));
            readouts.push({
              q,
              label: `${sub}:${b.choice}`,
              fill,
              confidence,
              x: center.x,
              y: center.y,
              radius,
            });
            return { choice: b.choice, fill, confidence };
          })
          .filter((x): x is { choice: 'Đ' | 'S'; fill: number; confidence: number } => x !== null);

        const filled = sampled.filter((s) => s.fill > FILL_THRESHOLD);
        if (filled.length === 1) {
          chars += filled[0].choice;
          filledTotal += 1;
          minConf = Math.min(minConf, filled[0].confidence);
        } else if (filled.length > 1) {
          chars += '!';
          filledTotal += 1;
          anyDouble = true;
          minConf = Math.min(minConf, 0.2);
        } else {
          chars += '?';
          anyBlank = true;
          minConf = Math.min(minConf, 0.35);
        }
      }

      if (filledTotal === 0) {
        answers.push({ q, picked: null, confidence: 0, flags: ['blank'] });
      } else {
        const flags: string[] = [];
        if (anyDouble) flags.push('double-mark');
        if (anyBlank || minConf < CONFIDENT) flags.push('low-confidence');
        answers.push({ q, picked: chars, confidence: minConf, flags });
      }
    }
  }

  // ---- Part III: Short-answer 4-column numeric grid (- , 0..9)
  if (template.shortCells?.length) {
    const shortByQ = new Map<number, typeof template.shortCells>();
    for (const item of template.shortCells) {
      const list = shortByQ.get(item.q) ?? [];
      list.push(item);
      shortByQ.set(item.q, list);
    }
    for (const [q, items] of [...shortByQ.entries()].sort((a, b) => a[0] - b[0])) {
      let colStr = '';
      let minConf = 1;
      let anyDouble = false;
      let anyFilled = false;

      for (let col = 0; col < 4; col += 1) {
        const colItems = items.filter((b) => b.column === col);
        const samples = colItems
          .map((b) => {
            const center = applyHomography(homography, { x: b.cx, y: b.cy });
            if (!Number.isFinite(center.x) || !Number.isFinite(center.y)) return null;
            if (center.x < 0 || center.y < 0 || center.x >= gray.width || center.y >= gray.height) {
              return null;
            }
            const radius = b.r * scale;
            const ring = meanInRing(gray, center.x, center.y, radius * 1.15, radius * 1.45);
            const disc = meanInDisc(gray, center.x, center.y, radius * 0.78);
            return { mark: b.mark, x: center.x, y: center.y, radius, disc, ring };
          })
          .filter(
            (x): x is { mark: string; x: number; y: number; radius: number; disc: number; ring: number } =>
              x !== null,
          );

        if (!samples.length) continue;
        const sortedDisc = [...samples].map((s) => s.disc).sort((a, b) => a - b);
        const colPaper = sortedDisc[Math.floor(sortedDisc.length / 2)] ?? 255;
        const withFill = samples.map((s) => {
          const fill = Math.max(s.ring, colPaper) - s.disc;
          const confidence = Math.min(1, Math.max(0, fill / 70));
          readouts.push({
            q,
            label: `${col}:${s.mark}`,
            fill,
            confidence,
            x: s.x,
            y: s.y,
            radius: s.radius,
          });
          return { mark: s.mark, fill, confidence };
        });

        const filled = withFill.filter((s) => s.fill > FILL_THRESHOLD).sort((a, b) => b.fill - a.fill);
        if (filled.length === 1) {
          colStr += filled[0].mark;
          anyFilled = true;
          minConf = Math.min(minConf, filled[0].confidence);
        } else if (filled.length > 1) {
          // If one mark is overwhelmingly darker than spurious edge mark, still flag only when close.
          if (filled[0].fill - filled[1].fill > 25) {
            colStr += filled[0].mark;
            anyFilled = true;
            minConf = Math.min(minConf, filled[0].confidence * 0.8);
          } else {
            colStr += '?';
            anyFilled = true;
            anyDouble = true;
            minConf = Math.min(minConf, 0.2);
          }
        }
      }

      if (!anyFilled) {
        answers.push({ q, picked: null, confidence: 0, flags: ['blank'] });
      } else {
        const flags: string[] = [];
        if (anyDouble) flags.push('double-mark');
        if (minConf < CONFIDENT) flags.push('low-confidence');
        answers.push({
          q,
          picked: colStr.trim() || null,
          confidence: minConf,
          flags,
        });
      }
    }
  }

  return {
    readouts,
    answers: answers.sort((a, b) => a.q - b.q),
    sbd: readSbdGrid(gray, template, homography, scale),
    scale,
    warnings,
  };
}

/** The QR plus the landmarks that are actually precise, in image pixels. */
export type QrLocation = {
  text: string;
  corners: Point[];
  /** Centre of each finder pattern: exact to a fraction of a module. */
  finders: { tl: Point; tr: Point; bl: Point };
  version: number;
};

function decodeQrDetailed(image: RgbaImage): QrLocation | null {
  const channels = image.channels ?? 4;
  if (channels !== 4) return null;

  try {
    const result = jsQR(image.data as Uint8ClampedArray, image.width, image.height, {
      inversionAttempts: 'dontInvert',
    });
    if (!result) return null;
    const {
      topLeftCorner,
      topRightCorner,
      bottomRightCorner,
      bottomLeftCorner,
      topLeftFinderPattern,
      topRightFinderPattern,
      bottomLeftFinderPattern,
    } = result.location;
    const asPoint = (point: { x: number; y: number }): Point => ({ x: point.x, y: point.y });
    return {
      text: result.data,
      corners: [topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner].map(asPoint),
      finders: {
        tl: asPoint(topLeftFinderPattern),
        tr: asPoint(topRightFinderPattern),
        bl: asPoint(bottomLeftFinderPattern),
      },
      version: result.version,
    };
  } catch {
    return null;
  }
}

/** Reads the QR printed in the sheet corner, when the image is sharp enough. */
function decodeQrPixels(image: RgbaImage): string | null {
  return decodeQrDetailed(image)?.text ?? null;
}

/**
 * Find the QR anywhere in the frame, with its corners.
 *
 * The code is printed by us at a known size in a known place, which makes it a
 * far better landmark than the four corner squares: three finder patterns and a
 * timing grid give the decoder an exact outline, while a corner square can be
 * washed out by glare or confused with a dark window frame.
 */
export function locateQr(image: RgbaImage): QrLocation | null {
  const shrunk = shrinkRgb(image, 1400);
  const step = shrunk.width === image.width ? 1 : Math.ceil(Math.max(image.width, image.height) / 1400);

  const rescale = (location: QrLocation, factor: number): QrLocation => ({
    text: location.text,
    version: location.version,
    corners: location.corners.map((corner) => ({ x: corner.x * factor, y: corner.y * factor })),
    finders: {
      tl: { x: location.finders.tl.x * factor, y: location.finders.tl.y * factor },
      tr: { x: location.finders.tr.x * factor, y: location.finders.tr.y * factor },
      bl: { x: location.finders.bl.x * factor, y: location.finders.bl.y * factor },
    },
  });

  const found = decodeQrDetailed(shrunk);
  if (found) return step === 1 ? found : rescale(found, step);

  return step === 1 ? null : decodeQrDetailed(image);
}

/** Solves a 3x3 linear system; null when the points are collinear. */
function solve3(matrix: number[][], rhs: number[]): number[] | null {
  const rows = matrix.map((row, index) => [...row, rhs[index]]);

  for (let pivot = 0; pivot < 3; pivot += 1) {
    let best = pivot;
    for (let row = pivot + 1; row < 3; row += 1) {
      if (Math.abs(rows[row][pivot]) > Math.abs(rows[best][pivot])) best = row;
    }
    if (Math.abs(rows[best][pivot]) < 1e-9) return null;
    [rows[pivot], rows[best]] = [rows[best], rows[pivot]];

    for (let row = 0; row < 3; row += 1) {
      if (row === pivot) continue;
      const factor = rows[row][pivot] / rows[pivot][pivot];
      for (let column = pivot; column < 4; column += 1) rows[row][column] -= factor * rows[pivot][column];
    }
  }

  return rows.map((row, index) => row[3] / row[index]);
}

/**
 * Affine map from three point pairs — rotation, scale and shear, no perspective.
 *
 * Three finder patterns are enough and, crucially, they are the part of a QR
 * that the decoder locates precisely. `location.bottomRightCorner` is the
 * alignment pattern rather than the symbol corner, so building the map from the
 * four reported corners compresses the whole sheet by about a quarter.
 */
export function affineFromPoints(from: Point[], to: Point[]): number[] | null {
  if (from.length < 3 || to.length < 3) return null;
  const basis = from.slice(0, 3).map((point) => [point.x, point.y, 1]);
  const xs = solve3(basis, to.slice(0, 3).map((point) => point.x));
  const ys = solve3(basis, to.slice(0, 3).map((point) => point.y));
  if (!xs || !ys) return null;
  return [xs[0], xs[1], xs[2], ys[0], ys[1], ys[2], 0, 0];
}

/** Maps the QR's own landmarks onto where the template says they are printed. */
export function affineFromQr(template: SheetTemplate, qr: QrLocation): number[] | null {
  const rect = template.qr;
  const modules = 17 + 4 * qr.version;
  const module = rect.size / modules;
  const inset = 3.5 * module;

  const from = [
    { x: rect.x + inset, y: rect.y + inset },
    { x: rect.x + rect.size - inset, y: rect.y + inset },
    { x: rect.x + inset, y: rect.y + rect.size - inset },
  ];
  const to = [qr.finders.tl, qr.finders.tr, qr.finders.bl];

  return affineFromPoints(from, to);
}

/** Falls back to the four reported corners when no finder centres came back. */
export function homographyFromQr(template: SheetTemplate, corners: Point[]): number[] | null {
  const rect = template.qr;
  const templateCorners = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.size, y: rect.y },
    { x: rect.x + rect.size, y: rect.y + rect.size },
    { x: rect.x, y: rect.y + rect.size },
  ];
  return computeHomography(templateCorners, corners);
}

/**
 * Finds the printed square near where the QR says it should be.
 *
 * Centroid of the dark pixels in a small window: the window is narrow enough
 * that page text and the QR itself stay out, which is why this is only safe
 * once we already know roughly where to look.
 */
export function refineAnchor(
  gray: Gray,
  predicted: Point,
  expectedSize: number,
): { point: Point; ink: number } | null {
  // Two passes: a wide one so a slightly-off seed still finds the square, then a
  // narrow one centred on it, so nearby text cannot drag the centroid away.
  const filled = expectedSize * expectedSize;
  const rough = centroidOfInk(gray, predicted, Math.max(4, expectedSize * 0.75), filled * 0.35);
  if (!rough) return null;
  return centroidOfInk(gray, rough.point, Math.max(3, expectedSize * 0.55), filled * 0.45) ?? rough;
}

function centroidOfInk(
  gray: Gray,
  predicted: Point,
  window: number,
  minCount: number,
): { point: Point; ink: number } | null {
  const x0 = Math.max(0, Math.floor(predicted.x - window));
  const x1 = Math.min(gray.width - 1, Math.ceil(predicted.x + window));
  const y0 = Math.max(0, Math.floor(predicted.y - window));
  const y1 = Math.min(gray.height - 1, Math.ceil(predicted.y + window));
  if (x1 <= x0 || y1 <= y0) return null;

  let sumX = 0;
  let sumY = 0;
  let sumInk = 0;
  let count = 0;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const value = gray.data[y * gray.width + x];
      if (value > 150) continue;
      sumX += x;
      sumY += y;
      sumInk += value;
      count += 1;
    }
  }

  // Too little dark area means the corner really is missing, not merely pale.
  if (count < minCount) return null;
  return { point: { x: sumX / count, y: sumY / count }, ink: sumInk / count };
}

/** Shrinks by whole-pixel steps. jsQR only needs a few pixels per module. */
function shrinkRgb(image: RgbaImage, maxEdge: number): RgbaImage {
  const longest = Math.max(image.width, image.height);
  if (longest <= maxEdge) return image;

  const step = Math.ceil(longest / maxEdge);
  const width = Math.floor(image.width / step);
  const height = Math.floor(image.height / step);
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      // Averaging a small block beats nearest-neighbour: jsQR thresholds on
      // local contrast, and a jagged edge costs it the finder patterns.
      let r = 0;
      let g = 0;
      let b = 0;
      for (let dy = 0; dy < step; dy += 1) {
        const row = ((y * step + dy) * image.width + x * step) * 4;
        for (let dx = 0; dx < step; dx += 1) {
          const offset = row + dx * 4;
          r += image.data[offset];
          g += image.data[offset + 1];
          b += image.data[offset + 2];
        }
      }
      const count = step * step;
      const out = (y * width + x) * 4;
      data[out] = r / count;
      data[out + 1] = g / count;
      data[out + 2] = b / count;
      data[out + 3] = 255;
    }
  }

  return { width, height, data, channels: 4 };
}

/**
 * Crops the strip that must contain the code, using where the anchors landed.
 *
 * Scanning the whole page for a QR costs 230-470 ms — it dominated the entire
 * read. The four registration marks already say where the page is, so the code
 * can only be inside this quad, which is a few percent of the pixels.
 */
function cropQrRegion(
  image: RgbaImage,
  homography: number[],
  rect: { x: number; y: number; size: number },
): RgbaImage | null {
  const corners = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.size, y: rect.y },
    { x: rect.x + rect.size, y: rect.y + rect.size },
    { x: rect.x, y: rect.y + rect.size },
  ].map((point) => applyHomography(homography, point));

  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  // Keep a quiet zone around the code; a QR with no margin is unreadable.
  const padX = (Math.max(...xs) - Math.min(...xs)) * 0.3;
  const padY = (Math.max(...ys) - Math.min(...ys)) * 0.3;
  const x0 = Math.max(0, Math.floor(Math.min(...xs) - padX));
  const y0 = Math.max(0, Math.floor(Math.min(...ys) - padY));
  const x1 = Math.min(image.width - 1, Math.ceil(Math.max(...xs) + padX));
  const y1 = Math.min(image.height - 1, Math.ceil(Math.max(...ys) + padY));

  const width = x1 - x0 + 1;
  const height = y1 - y0 + 1;
  if (width < 24 || height < 24) return null;

  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const start = ((y0 + y) * image.width + x0) * 4;
    data.set(image.data.subarray(start, start + width * 4), y * width * 4);
  }

  return { width, height, data, channels: 4 };
}

/**
 * Reads the code printed on a sheet.
 *
 * With the page located, only the code's own patch is scanned; without it the
 * page is shrunk first, because the scan cost is what the teacher feels.
 */
export function decodeSheetQr(
  image: RgbaImage,
  template?: SheetTemplate,
  homography?: number[],
): string | null {
  if (template && homography) {
    const cropped = cropQrRegion(image, homography, template.qr);
    if (cropped) {
      const text = decodeQrPixels(cropped);
      if (text) return text;
    }
  }

  return decodeQrPixels(shrinkRgb(image, 1400));
}

/** Full pipeline: find the marks, then read every bubble. */
/**
 * Reads the candidate-number grid.
 *
 * Each column is one digit position, so the digit is the darkest bubble in that
 * column. A column with no filled bubble is reported as `?` and the whole code
 * becomes null: guessing a digit would file the paper under a random student.
 */
function readSbdGrid(
  gray: Gray,
  template: SheetTemplate,
  homography: number[],
  scale: number,
): SbdReadout | null {
  if (!template.sbd || template.sbd.cells.length === 0) return null;

  const columns = new Map<number, Array<{ digit: number; fill: number }>>();
  for (const cell of template.sbd.cells) {
    const center = applyHomography(homography, { x: cell.cx, y: cell.cy });
    if (!Number.isFinite(center.x) || !Number.isFinite(center.y)) continue;
    if (center.x < 0 || center.y < 0 || center.x >= gray.width || center.y >= gray.height) continue;

    const radius = cell.r * scale;
    const paper = meanInRing(gray, center.x, center.y, radius * 1.6, radius * 2.6);
    const disc = meanInDisc(gray, center.x, center.y, radius * 0.8);

    const list = columns.get(cell.column) ?? [];
    list.push({ digit: cell.digit, fill: paper - disc });
    columns.set(cell.column, list);
  }

  let digits = '';
  let confidence = 1;
  for (let column = 0; column < template.sbd.digits; column += 1) {
    const list = (columns.get(column) ?? []).sort((a, b) => b.fill - a.fill);
    const best = list[0];
    if (!best || best.fill <= FILL_THRESHOLD) {
      digits += '?';
      confidence = 0;
      continue;
    }
    const runnerUp = list[1]?.fill ?? 0;
    digits += String(best.digit);
    confidence = Math.min(confidence, Math.min(1, Math.max(0, (best.fill - runnerUp) / 40)));
  }

  return { digits, code: digits.includes('?') ? null : digits, confidence };
}

/**
 * How much of its box the QR symbol actually covers.
 *
 * The printed image carries a white quiet zone, so the symbol is smaller than
 * the 26 mm box and a map built as if the symbol filled it comes out compressed.
 * How wide that margin is depends on the options used when the sheet was made,
 * so instead of assuming one, search for the factor that lands the four
 * predicted corner squares on ink.
 */
const QR_SCALE_CANDIDATES = Array.from({ length: 21 }, (_, index) => 0.62 + index * 0.02);

function withScaleAbout(map: number[], about: Point, factor: number): number[] {
  // Same map, but template coordinates are first pulled toward the QR centre.
  const scaled = (point: Point): Point => ({
    x: about.x + (point.x - about.x) * factor,
    y: about.y + (point.y - about.y) * factor,
  });
  const basis = [about, { x: about.x + 1, y: about.y }, { x: about.x, y: about.y + 1 }];
  return (
    affineFromPoints(
      basis,
      basis.map((point) => applyHomography(map, scaled(point))),
    ) ?? map
  );
}

function inkAt(gray: Gray, point: Point, radius: number): number {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return 255;
  return meanInDisc(gray, point.x, point.y, radius);
}

/** Picks the symbol-to-box ratio that best explains the printed corner squares. */
export function calibrateQrScale(
  gray: Gray,
  template: SheetTemplate,
  qrMap: number[],
): { map: number[]; scale: number } {
  const about = { x: template.qr.x + template.qr.size / 2, y: template.qr.y + template.qr.size / 2 };
  const probe = Math.max(2, (ANCHOR_FRACTION * template.page.width) / 6);

  let best = { map: qrMap, scale: 1, hits: 0, ink: Number.POSITIVE_INFINITY };
  for (const candidate of QR_SCALE_CANDIDATES) {
    const map = withScaleAbout(qrMap, about, candidate);
    const predicted = template.anchors.map((corner) => applyHomography(map, corner));
    const inks = predicted.map((point) => inkAt(gray, point, probe)).sort((a, b) => a - b);

    // One corner may be sitting under glare, so score on the corners that do
    // land on ink: prefer the candidate that explains the most of them, then the
    // one with the darkest ink where it does land.
    const onInk = inks.filter((ink) => ink <= 150);
    if (onInk.length < 3) continue;
    const score = onInk.slice(0, 3).reduce((sum, ink) => sum + ink, 0);
    if (onInk.length > best.hits || (onInk.length === best.hits && score < best.ink)) {
      best = { map, scale: candidate, hits: onInk.length, ink: score };
    }
  }

  return { map: best.map, scale: best.scale };
}

export type SheetPlacement = {
  anchors: Point[] | null;
  /** 'corners' when the printed squares were found; 'qr' when the code located the sheet. */
  source: 'corners' | 'qr' | 'none';
  /** Corner indices the QR had to stand in for, because no ink was found there. */
  substituted: number[];
  qrCorners: Point[] | null;
  qrText: string | null;
  warnings: string[];
  reasons: string[];
};

/**
 * Works out where the sheet is in the frame.
 *
 * Corner squares first, because they span the whole page and pin the mapping
 * most accurately. When they are missing or do not form an A4 rectangle — glare
 * over one corner, a dark window frame mistaken for a mark — the QR code takes
 * over: we printed it at a known size in a known spot, so its four decoded
 * corners give an exact correspondence, and the corner squares only have to be
 * found again inside a small window around the predicted position.
 */
export function placeSheet(image: RgbaImage, gray: Gray, template: SheetTemplate): SheetPlacement {
  const found = detectAnchors(gray, template);
  const direct = found
    ? checkAnchors(gray, template, found)
    : { ok: false, reasons: ['Không tìm thấy 4 điểm neo của phiếu.'] };

  if (found && direct.ok) {
    return {
      anchors: found,
      source: 'corners',
      substituted: [],
      qrCorners: null,
      qrText: null,
      warnings: [],
      reasons: [],
    };
  }

  const qr = locateQr(image);
  // Finder patterns first: they are what the decoder actually locks onto. The
  // four reported corners are only a fallback, and a coarse one.
  const qrSeed = qr ? (affineFromQr(template, qr) ?? homographyFromQr(template, qr.corners)) : null;
  const qrMap = qrSeed ? calibrateQrScale(gray, template, qrSeed).map : null;

  if (qr && qrMap) {
    const predicted = template.anchors.map((corner) => applyHomography(qrMap, corner));
    const scaleX = Math.hypot(qrMap[0], qrMap[3]);
    const scaleY = Math.hypot(qrMap[1], qrMap[4]);
    const pixelsPerUnit = (scaleX + scaleY) / 2;
    const expectedSize = ANCHOR_FRACTION * template.page.width * pixelsPerUnit;

    const anchors: Point[] = [];
    const substituted: number[] = [];
    predicted.forEach((point, index) => {
      const refined = refineAnchor(gray, point, expectedSize);
      if (refined) {
        anchors.push(refined.point);
      } else {
        anchors.push(point);
        substituted.push(index);
      }
    });

    // A corner we could not see is still on the page, and the seed map is only an
    // affine fit of three finder patterns: its residual grows toward the far
    // sides of the sheet. With three corners measured, the correction they imply
    // can be carried over to the fourth instead of keeping the raw prediction.
    if (substituted.length > 0 && substituted.length < 4) {
      const known = predicted
        .map((point, index) => ({ predicted: point, refined: anchors[index], index }))
        .filter((entry) => !substituted.includes(entry.index));
      const correction =
        known.length >= 3
          ? affineFromPoints(
              known.map((entry) => entry.predicted),
              known.map((entry) => entry.refined),
            )
          : null;
      if (correction) {
        for (const index of substituted) {
          anchors[index] = applyHomography(correction, predicted[index]);
        }
      }
    }

    const check = checkAnchors(gray, template, anchors, { skipInk: substituted });
    if (check.ok) {
      const warnings = substituted.map(
        (index) => `${CORNER_NAMES[index]} bị chói hoặc mất, đã định vị lại bằng mã QR.`,
      );
      return {
        anchors,
        source: 'qr',
        substituted,
        qrCorners: qr.corners,
        qrText: qr.text,
        warnings,
        reasons: [],
      };
    }
  }

  return {
    anchors: found,
    source: 'none',
    substituted: [],
    qrCorners: qr?.corners ?? null,
    qrText: qr?.text ?? null,
    warnings: [],
    reasons: direct.reasons,
  };
}

export function readSheet(image: RgbaImage, template: SheetTemplate): OmrResult {
  const gray = toGray(image);
  const placement = placeSheet(image, gray, template);

  if (!placement.anchors) {
    return {
      answers: [],
      quality: {
        anchorsFound: false,
        scale: 0,
        skew: 0,
        warnings: ['Không tìm thấy 4 điểm neo của phiếu. Hãy chụp đủ 4 góc, đủ sáng.'],
      },
      sbd: null,
      qr: placement.qrText ?? decodeSheetQr(image),
    };
  }

  const anchors = placement.anchors;
  const homography = computeHomography(template.anchors, anchors);
  const { answers, sbd, scale, warnings } = readBubbles(gray, template, anchors);

  // A wrong quad still produces answers, and wrong answers still produce a
  // score. Flag every mark so the paper lands in the review queue instead of
  // being trusted.
  const check = checkAnchors(gray, template, anchors, { skipInk: placement.substituted });
  const flagged = check.ok
    ? answers
    : answers.map((answer) => ({ ...answer, flags: [...answer.flags, 'unstable-anchors'] }));

  return {
    answers: flagged,
    quality: {
      anchorsFound: true,
      scale,
      skew: 0,
      warnings: [...placement.warnings, ...(check.ok ? [] : check.reasons), ...warnings],
      anchorsSuspect: !check.ok,
    },
    sbd,
    qr: placement.qrText ?? decodeSheetQr(image, template, homography ?? undefined),
  };
}

export type SheetInspection = {
  width: number;
  height: number;
  /** The four corner marks the reader locked onto, in image pixels. */
  anchors: Point[] | null;
  marks: BubbleReadout[];
  answers: QuestionReadout[];
  sbd: SbdReadout | null;
  qr: string | null;
  /** True when the four corners do not look like the corners of this sheet. */
  anchorsSuspect: boolean;
  anchorReasons: string[];
  /** Where the corners came from: the printed squares, or the QR code. */
  anchorSource: 'corners' | 'qr' | 'none';
  /** Corner indices reconstructed from the QR because no ink was found there. */
  substitutedCorners: number[];
  /** The QR outline the reader locked onto, when it had to fall back to it. */
  qrCorners: Point[] | null;
  /** Candidate-number cells, so the grid can be drawn the same way. */
  sbdMarks: { column: number; digit: number; x: number; y: number; radius: number; picked: boolean }[];
  scale: number;
  warnings: string[];
};

/**
 * Everything `readSheet` computes, plus the geometry behind it.
 *
 * The grading itself only needs the answers, but a teacher who suspects a bad
 * read needs to see which bubbles the machine sampled and how dark each one
 * looked. Same measurement code, so what the inspector draws is exactly what
 * produced the mark.
 */
export function inspectSheet(image: RgbaImage, template: SheetTemplate): SheetInspection {
  const gray = toGray(image);
  const placement = placeSheet(image, gray, template);

  if (!placement.anchors) {
    return {
      width: image.width,
      height: image.height,
      anchors: null,
      marks: [],
      answers: [],
      sbd: null,
      qr: placement.qrText ?? decodeSheetQr(image),
      anchorsSuspect: true,
      anchorReasons: placement.reasons,
      anchorSource: placement.source,
      substitutedCorners: [],
      qrCorners: placement.qrCorners,
      sbdMarks: [],
      scale: 0,
      warnings: placement.reasons,
    };
  }

  const anchors = placement.anchors;
  const homography = computeHomography(template.anchors, anchors);
  const { readouts, answers, sbd, scale, warnings } = readBubbles(gray, template, anchors);
  const check = checkAnchors(gray, template, anchors, { skipInk: placement.substituted });

  return {
    width: image.width,
    height: image.height,
    anchors,
    marks: readouts,
    answers,
    sbd,
    qr: placement.qrText ?? decodeSheetQr(image, template, homography ?? undefined),
    anchorsSuspect: !check.ok,
    anchorReasons: check.reasons,
    anchorSource: placement.source,
    substitutedCorners: placement.substituted,
    qrCorners: placement.qrCorners,
    sbdMarks: homography
      ? (template.sbd?.cells ?? [])
          .map((cell) => {
            const point = applyHomography(homography, { x: cell.cx, y: cell.cy });
            const picked =
              sbd !== null &&
              sbd.digits[cell.column] !== '?' &&
              Number(sbd.digits[cell.column]) === cell.digit;
            return {
              column: cell.column,
              digit: cell.digit,
              x: point.x,
              y: point.y,
              radius: cell.r * scale,
              picked,
            };
          })
          .filter((mark) => Number.isFinite(mark.x) && Number.isFinite(mark.y))
      : [],
    scale,
    warnings: [...placement.warnings, ...warnings],
  };
}

/** Quiz payload shape, parsed defensively because it comes off a printed code. */
export function parseSheetQr(payload: string | null): { sessionId: string | null; studentCode: string | null } {
  if (!payload) return { sessionId: null, studentCode: null };
  try {
    const parsed = JSON.parse(payload) as { sid?: unknown; code?: unknown };
    return {
      sessionId: typeof parsed.sid === 'string' ? parsed.sid : null,
      studentCode: typeof parsed.code === 'string' ? parsed.code : null,
    };
  } catch {
    return { sessionId: null, studentCode: null };
  }
}
