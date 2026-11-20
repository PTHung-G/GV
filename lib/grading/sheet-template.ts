/**
 * Printable answer sheet for the "phiếu chuẩn" branch.
 *
 * The sheet is generated from the rubric, and — this is the important part —
 * the same layout pass produces both the printed HTML and the geometry the
 * scanner later samples. If these two ever disagreed, every scan would be
 * subtly wrong, so they are computed once and shared.
 *
 * Units: the JSON is in CSS pixels (96 dpi), the HTML is emitted in millimetres
 * so print output is physically exact regardless of the browser's zoom.
 */
import QRCode from 'qrcode';
import type { McLetter, Rubric, ShortQuestion, TfQuestion } from './rubric';

export const MM = 96 / 25.4;
export const A4_WIDTH = 210 * MM; // 793.7px
export const A4_HEIGHT = 297 * MM; // 1122.5px

export type Point = { x: number; y: number };

export type SheetBubble = { q: number; label: McLetter; cx: number; cy: number; r: number };

export type SheetTfBubble = {
  q: number;
  sub: 'a' | 'b' | 'c' | 'd';
  choice: 'Đ' | 'S';
  cx: number;
  cy: number;
  r: number;
};

export type SheetShortCell = {
  q: number;
  column: number;
  mark: string;
  cx: number;
  cy: number;
  r: number;
};

/**
 * One bubble of the "số báo danh" (candidate number) grid.
 *
 * The grid is the paper's identity: each column is one digit position and each
 * row a digit 0-9, exactly like the official Vietnamese exam sheets. Filling it
 * is what lets a scan find its student without any printed code, so a single
 * blank sheet can serve the whole class.
 */
export type SheetSbdCell = { column: number; digit: number; cx: number; cy: number; r: number };

export type SheetTemplate = {
  version: 1;
  page: { width: number; height: number };
  /** Registration marks: top-left, top-right, bottom-right, bottom-left. */
  anchors: [Point, Point, Point, Point];
  qr: { x: number; y: number; size: number };
  bubbles: SheetBubble[];
  /** Phần II: Trắc nghiệm Đúng/Sai (GDPT 2018 / THPT 2025). */
  tfBubbles?: SheetTfBubble[];
  /** Phần III: Trắc nghiệm Trả lời ngắn (4 cột ký tự - , 0..9). */
  shortCells?: SheetShortCell[];
  /** Khi trang 1 đã kín cho trắc nghiệm, tự luận sang trang 2. */
  essayOnSecondPage?: boolean;
  /** Bảng tô số báo danh. Missing on sheets printed before this existed. */
  sbd?: { digits: number; cells: SheetSbdCell[] };
  /** Essay boxes, so the scanner can report a blank answer area if needed. */
  essayBoxes: Array<{ q: number; x: number; y: number; width: number; height: number }>;
};

export type SheetStudent = { code?: string | null; name: string };

export type SheetOptions = {
  title: string;
  subject?: string | null;
  className?: string | null;
  examCode?: string | null;
  schoolName?: string;
  /** Duration line on the header, e.g. "45 phút". */
  duration?: string | null;
  /** Extra note printed in the instruction box (school-specific rule). */
  note?: string | null;
  columns?: number;
  /** Digits of the candidate number grid. `0` prints no grid at all. */
  sbdDigits?: number;
  /** When provided, one sheet is emitted per student, each with its own QR. */
  students?: SheetStudent[];
  sessionId?: string;
  /** Published identity. Never supplied by legacy sheet endpoints. */
  publishedIdentity?: { variantId: string; token: string };
};

const MARGIN = 12 * MM;
const ANCHOR_SIZE = 10 * MM;
const ANCHOR_CENTER = MARGIN + ANCHOR_SIZE / 2;
const CONTENT_LEFT = MARGIN + ANCHOR_SIZE;
const CONTENT_RIGHT = A4_WIDTH - CONTENT_LEFT;
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;
const CONTENT_TOP = MARGIN + ANCHOR_SIZE;
const CONTENT_BOTTOM = A4_HEIGHT - MARGIN - ANCHOR_SIZE;
const CONTENT_HEIGHT = CONTENT_BOTTOM - CONTENT_TOP;

const QR_SIZE = 26 * MM;
const HEADER_HEIGHT = 34 * MM;
/** Height reserved for the candidate-number block, including its write-in boxes. */
const SBD_BLOCK_HEIGHT = 62 * MM;
const SBD_CELL = 4.6 * MM;
const SBD_ROW = 4.2 * MM;
const SBD_R = 1.65 * MM;
/** Room for the 0-9 row labels to the left of the grid. */
const SBD_LABEL_WIDTH = 9 * MM;
const BUBBLE_R = 2.3 * MM;
const BUBBLE_GAP = 8.4 * MM;
const ROW_HEIGHT = 8.6 * MM;
const NUMBER_WIDTH = 8.5 * MM;
const ANCHOR_SAFE = 4 * MM;

export const TF_SUBS: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd'];
export const TF_CHOICES: Array<'Đ' | 'S'> = ['Đ', 'S'];
export const SHORT_MARKS = ['-', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const TF_ROW_H = 5.4 * MM;
const TF_R = 1.8 * MM;
const SHORT_ROW_H = 3.8 * MM;
const SHORT_CELL_W = 4.6 * MM;
const SHORT_R = 1.5 * MM;

function mcOf(rubric: Rubric) {
  return rubric.questions.filter((question) => question.type === 'mc');
}

function tfOf(rubric: Rubric): TfQuestion[] {
  return rubric.questions.filter((question): question is TfQuestion => question.type === 'tf');
}

function shortOf(rubric: Rubric): ShortQuestion[] {
  return rubric.questions.filter((question): question is ShortQuestion => question.type === 'short');
}

function essayOf(rubric: Rubric) {
  return rubric.questions.filter((question) => question.type === 'essay');
}

/**
 * Decides how many answer columns are needed so a long paper still fits on one
 * page: the grid may not eat into the space reserved for essay answers or Part II/III.
 */
function chooseColumns(
  mcCount: number,
  essayCount: number,
  requested?: number,
  reservedTop = 0,
  reservedExtra = 0,
): number {
  if (requested && requested >= 1 && requested <= 4) return Math.floor(requested);
  const essaySpace = essayCount > 0 ? 60 * MM : 0;
  const available = Math.max(
    24 * MM,
    CONTENT_HEIGHT - HEADER_HEIGHT - reservedTop - essaySpace - reservedExtra - 18 * MM,
  );
  const maxRows = Math.max(1, Math.floor(available / (ROW_HEIGHT * 1.15)));
  if (mcCount <= maxRows) return 1;
  if (mcCount <= maxRows * 2) return 2;
  if (mcCount <= maxRows * 3) return 3;
  return 4;
}

/** The single layout pass both outputs are built from. */
export function buildSheetTemplate(rubric: Rubric, options: SheetOptions): SheetTemplate {
  const multichoice = mcOf(rubric);
  const tfs = tfOf(rubric);
  const shorts = shortOf(rubric);
  const essays = essayOf(rubric);
  const hasObjectiveExt = tfs.length > 0 || shorts.length > 0;
  const sbdDigits = Math.max(0, Math.min(8, Math.floor(options.sbdDigits ?? 6)));
  const reservedTop = sbdDigits > 0 ? SBD_BLOCK_HEIGHT : 0;
  const tfBlockH = tfs.length > 0 ? Math.ceil(tfs.length / 4) * (7 * MM + 4 * TF_ROW_H) + 6 * MM : 0;
  const shortBlockH = shorts.length > 0 ? Math.ceil(shorts.length / 6) * (12 * SHORT_ROW_H + 11 * MM) + 7 * MM : 0;
  const columns = chooseColumns(
    multichoice.length,
    hasObjectiveExt ? 0 : essays.length,
    options.columns,
    reservedTop,
    tfBlockH + shortBlockH,
  );

  const anchors: [Point, Point, Point, Point] = [
    { x: ANCHOR_CENTER, y: ANCHOR_CENTER },
    { x: A4_WIDTH - ANCHOR_CENTER, y: ANCHOR_CENTER },
    { x: A4_WIDTH - ANCHOR_CENTER, y: A4_HEIGHT - ANCHOR_CENTER },
    { x: ANCHOR_CENTER, y: A4_HEIGHT - ANCHOR_CENTER },
  ];

  // Keep the code clear of the corner anchors: at CONTENT_TOP it touched the
  // top-right anchor, and a QR with margin 0 has no quiet zone to absorb that.
  const QR_GAP = 5 * MM;
  const qr = { x: CONTENT_RIGHT - QR_SIZE, y: CONTENT_TOP + QR_GAP, size: QR_SIZE };

  // ---- candidate number grid, drawn first because the answer grid starts below it
  const sbdTop = CONTENT_TOP + HEADER_HEIGHT + 15 * MM;
  const sbdCells: SheetSbdCell[] = [];
  if (sbdDigits > 0) {
    for (let column = 0; column < sbdDigits; column += 1) {
      for (let digit = 0; digit < 10; digit += 1) {
        sbdCells.push({
          column,
          digit,
          cx: CONTENT_LEFT + SBD_LABEL_WIDTH + column * SBD_CELL + SBD_CELL / 2,
          cy: sbdTop + digit * SBD_ROW,
          r: SBD_R,
        });
      }
    }
  }

  // ---- multiple-choice grid
  const gridTop = CONTENT_TOP + HEADER_HEIGHT + reservedTop + 6 * MM;
  const columnWidth = CONTENT_WIDTH / columns;
  const rows = multichoice.length === 0 ? 0 : Math.ceil(multichoice.length / columns);
  const mcRowH = hasObjectiveExt && rows > 8 ? 6.8 * MM : ROW_HEIGHT;
  const mcBubbleR = hasObjectiveExt && rows > 8 ? 2.0 * MM : BUBBLE_R;
  const bubbles: SheetBubble[] = [];

  multichoice.forEach((question, index) => {
    const column = Math.floor(index / rows);
    const row = index % rows;
    const columnLeft = CONTENT_LEFT + column * columnWidth;
    const numberX = columnLeft + NUMBER_WIDTH / 2;
    const cx0 = columnLeft + NUMBER_WIDTH + BUBBLE_GAP / 2.4;

    (['A', 'B', 'C', 'D'] as McLetter[]).forEach((label, optionIndex) => {
      bubbles.push({
        q: question.no,
        label,
        cx: cx0 + optionIndex * BUBBLE_GAP,
        cy: gridTop + row * mcRowH + mcRowH / 2,
        r: mcBubbleR,
      });
    });

    // `numberX` keeps the intent explicit; the number is drawn by the renderer.
    void numberX;
  });

  let cursorY = multichoice.length > 0 ? gridTop + rows * mcRowH : gridTop - 6 * MM;

  // ---- Part II: True/False Đ/S grid
  const tfBubbles: SheetTfBubble[] = [];
  if (tfs.length > 0) {
    const tfTop = cursorY + 7 * MM;
    const tfCols = 4;
    const tfColW = CONTENT_WIDTH / tfCols;
    const rowPitch = 7 * MM + 4 * TF_ROW_H;
    tfs.forEach((question, idx) => {
      const col = idx % tfCols;
      const band = Math.floor(idx / tfCols);
      const bx = CONTENT_LEFT + col * tfColW;
      const by = tfTop + band * rowPitch + 6 * MM;
      TF_SUBS.forEach((sub, sIdx) => {
        TF_CHOICES.forEach((choice, cIdx) => {
          tfBubbles.push({
            q: question.no,
            sub,
            choice,
            cx: bx + 14 * MM + cIdx * 7.2 * MM,
            cy: by + sIdx * TF_ROW_H + TF_ROW_H / 2,
            r: TF_R,
          });
        });
      });
    });
    cursorY = tfTop + Math.ceil(tfs.length / tfCols) * rowPitch;
  }

  // ---- Part III: Short-answer numeric grid (- , 0..9 across 4 digit columns)
  const shortCells: SheetShortCell[] = [];
  if (shorts.length > 0) {
    const shortTop = cursorY + 7 * MM;
    const shortCols = 6;
    const blockW = CONTENT_WIDTH / shortCols;
    const bandH = 11 * MM + SHORT_MARKS.length * SHORT_ROW_H;
    shorts.forEach((question, idx) => {
      const col = idx % shortCols;
      const band = Math.floor(idx / shortCols);
      const bx = CONTENT_LEFT + col * blockW;
      const gridLeft = bx + 5.2 * MM;
      const gridY = shortTop + band * bandH + 10.5 * MM;
      for (let dCol = 0; dCol < 4; dCol += 1) {
        SHORT_MARKS.forEach((mark, rIdx) => {
          shortCells.push({
            q: question.no,
            column: dCol,
            mark,
            cx: gridLeft + dCol * SHORT_CELL_W + SHORT_CELL_W / 2,
            cy: gridY + rIdx * SHORT_ROW_H + SHORT_ROW_H / 2,
            r: SHORT_R,
          });
        });
      }
    });
    cursorY = shortTop + Math.ceil(shorts.length / shortCols) * bandH;
  }

  // ---- essay boxes fill Page 1 if >= 28mm clear, otherwise move cleanly to Page 2
  const pageSafeBottom = CONTENT_BOTTOM - ANCHOR_SAFE;
  const gridBottom = cursorY;
  const essayTop = gridBottom + (hasObjectiveExt ? 8 * MM : 14 * MM);
  const essaySpace = Math.max(0, pageSafeBottom - essayTop);
  const essayBoxes: SheetTemplate['essayBoxes'] = [];
  let essayOnSecondPage = false;

  if (essays.length > 0) {
    const totalWeight = essays.reduce((sum, question) => sum + Math.max(1, question.points), 0);
    const boxGap = 5 * MM;
    const minNeeded = essays.length * 24 * MM + boxGap * (essays.length - 1);
    const putOnPage2 = essaySpace < Math.min(minNeeded, 32 * MM);
    if (putOnPage2) {
      essayOnSecondPage = true;
      const p2Top = CONTENT_TOP + 18 * MM;
      const p2Usable = pageSafeBottom - p2Top - boxGap * (essays.length - 1);
      let y = p2Top;
      essays.forEach((question) => {
        const weight = Math.max(1, question.points) / totalWeight;
        const height = Math.max(26 * MM, p2Usable * weight);
        essayBoxes.push({
          q: question.no,
          x: CONTENT_LEFT,
          y,
          width: CONTENT_WIDTH,
          height,
        });
        y += height + boxGap;
      });
    } else if (essaySpace > 0) {
      const usable = essaySpace - boxGap * (essays.length - 1);
      let y = essayTop;

      essays.forEach((question) => {
        const weight = Math.max(1, question.points) / totalWeight;
        const height = Math.max(24 * MM, usable * weight);
        essayBoxes.push({
          q: question.no,
          x: CONTENT_LEFT,
          y,
          width: CONTENT_WIDTH,
          height,
        });
        y += height + boxGap;
      });
    }
  }

  return {
    version: 1,
    page: { width: A4_WIDTH, height: A4_HEIGHT },
    anchors,
    qr,
    bubbles,
    ...(tfBubbles.length > 0 ? { tfBubbles } : {}),
    ...(shortCells.length > 0 ? { shortCells } : {}),
    ...(essayOnSecondPage ? { essayOnSecondPage: true } : {}),
    ...(sbdDigits > 0 ? { sbd: { digits: sbdDigits, cells: sbdCells } } : {}),
    essayBoxes,
  };
}

// ------------------------------------------------------------------- print

function mm(value: number): string {
  return `${(value / MM).toFixed(2)}mm`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Payload a scanner can read back to know which session (and student) it has. */
export function qrPayload(options: SheetOptions, student?: SheetStudent): string {
  if (options.publishedIdentity) return JSON.stringify({ v: 2, sid: options.sessionId, vid: options.publishedIdentity.variantId, t: options.publishedIdentity.token });
  return JSON.stringify({
    v: 1,
    sid: options.sessionId ?? null,
    code: student?.code ?? null,
  });
}

async function qrDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, { margin: 0, width: 240, errorCorrectionLevel: 'M' });
  } catch {
    return '';
  }
}

function sheetBody(
  rubric: Rubric,
  template: SheetTemplate,
  options: SheetOptions,
  student: SheetStudent | undefined,
  qrImage: string,
): string {
  const multichoice = mcOf(rubric);
  const tfs = tfOf(rubric);
  const shorts = shortOf(rubric);
  const essays = essayOf(rubric);
  const hasObjectiveExt = tfs.length > 0 || shorts.length > 0;
  const reservedTop = template.sbd ? SBD_BLOCK_HEIGHT : 0;
  const tfBlockH = tfs.length > 0 ? Math.ceil(tfs.length / 4) * (7 * MM + 4 * TF_ROW_H) + 6 * MM : 0;
  const shortBlockH = shorts.length > 0 ? Math.ceil(shorts.length / 6) * (12 * SHORT_ROW_H + 11 * MM) + 7 * MM : 0;
  const columns = chooseColumns(
    multichoice.length,
    hasObjectiveExt ? 0 : essays.length,
    options.columns,
    reservedTop,
    tfBlockH + shortBlockH,
  );
  const rows = multichoice.length === 0 ? 0 : Math.ceil(multichoice.length / columns);
  const mcRowH = hasObjectiveExt && rows > 8 ? 6.8 * MM : ROW_HEIGHT;
  const columnWidth = CONTENT_WIDTH / columns;
  const gridTop = CONTENT_TOP + HEADER_HEIGHT + reservedTop + 6 * MM;

  const anchors = template.anchors
    .map(
      (anchor) =>
        `<rect x="${mm(anchor.x - ANCHOR_SIZE / 2)}" y="${mm(anchor.y - ANCHOR_SIZE / 2)}" ` +
        `width="${mm(ANCHOR_SIZE)}" height="${mm(ANCHOR_SIZE)}" fill="#000" />`,
    )
    .join('');

  // The A/B/C/D letters above the grid are derived from the first bubble of each
  // column, so they can never drift away from the circles they label.
  const columnLabels = Array.from({ length: columns }, (_, column) => {
    const question = multichoice[column * rows];
    if (!question) return '';
    return template.bubbles
      .filter((bubble) => bubble.q === question.no)
      .map(
        (bubble) =>
          `<text x="${mm(bubble.cx)}" y="${mm(gridTop - 2.2 * MM)}" text-anchor="middle" ` +
          `dominant-baseline="central" class="opt">${bubble.label}</text>`,
      )
      .join('');
  }).join('');

  const numberCells = multichoice
    .map((question, index) => {
      const column = Math.floor(index / rows);
      const row = index % rows;
      const x = CONTENT_LEFT + column * columnWidth + NUMBER_WIDTH - 2 * MM;
      const y = gridTop + row * mcRowH + mcRowH / 2;
      const disp = question.displayNo ?? question.no;
      return `<text x="${mm(x)}" y="${mm(y)}" text-anchor="end" dominant-baseline="central" class="qn">${disp}</text>`;
    })
    .join('');

  const bubbles = template.bubbles
    .map(
      (bubble) =>
        `<circle cx="${mm(bubble.cx)}" cy="${mm(bubble.cy)}" r="${mm(bubble.r)}" class="bubble" />` +
        `<text x="${mm(bubble.cx)}" y="${mm(bubble.cy)}" text-anchor="middle" dominant-baseline="central" class="opt">${bubble.label}</text>`,
    )
    .join('');

  // ---- Part II (True/False) SVG layer & headers
  const tfItems = template.tfBubbles ?? [];
  let tfLayer = '';
  let tfTitle = '';
  if (tfItems.length > 0 && tfs.length > 0) {
    const minY = Math.min(...tfItems.map((b) => b.cy));
    tfTitle = `<div class="section-title" style="top:${mm(minY - 12 * MM)}">PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI</div>`;
    const headers = tfs
      .map((q) => {
        const qb = tfItems.filter((b) => b.q === q.no);
        if (!qb.length) return '';
        const xĐ = qb.find((b) => b.sub === 'a' && b.choice === 'Đ')?.cx ?? 0;
        const xS = qb.find((b) => b.sub === 'a' && b.choice === 'S')?.cx ?? 0;
        const yTop = qb[0].cy - 5.2 * MM;
        const subRows = TF_SUBS.map((sub) => {
          const item = qb.find((b) => b.sub === sub && b.choice === 'Đ');
          return item
            ? `<text x="${mm(item.cx - 7 * MM)}" y="${mm(item.cy)}" dominant-baseline="central" class="qn">${sub})</text>`
            : '';
        }).join('');
        return (
          `<text x="${mm(xĐ - 9 * MM)}" y="${mm(yTop)}" class="qn" font-weight="700">Câu ${q.displayNo ?? q.no}</text>` +
          `<text x="${mm(xĐ)}" y="${mm(yTop)}" text-anchor="middle" class="opt">Đ</text>` +
          `<text x="${mm(xS)}" y="${mm(yTop)}" text-anchor="middle" class="opt">S</text>` +
          subRows
        );
      })
      .join('');
    const circles = tfItems
      .map(
        (b) =>
          `<circle cx="${mm(b.cx)}" cy="${mm(b.cy)}" r="${mm(b.r)}" class="bubble" />` +
          `<text x="${mm(b.cx)}" y="${mm(b.cy)}" text-anchor="middle" dominant-baseline="central" class="opt">${b.choice}</text>`,
      )
      .join('');
    tfLayer = headers + circles;
  }

  // ---- Part III (Short-answer numeric grid) SVG layer & headers
  const shortItems = template.shortCells ?? [];
  let shortLayer = '';
  let shortHtml = '';
  if (shortItems.length > 0 && shorts.length > 0) {
    const minY = Math.min(...shortItems.map((b) => b.cy));
    shortHtml += `<div class="section-title" style="top:${mm(minY - 14.5 * MM)}">PHẦN III. TRẢ LỜI NGẮN</div>`;
    const headers = shorts
      .map((q) => {
        const qb = shortItems.filter((b) => b.q === q.no);
        if (!qb.length) return '';
        const col0Top = qb.find((b) => b.column === 0 && b.mark === '-');
        if (!col0Top) return '';
        const titleY = col0Top.cy - 9.8 * MM;
        shortHtml += `<div class="short-boxes" style="left:${mm(col0Top.cx - SHORT_CELL_W / 2)};top:${mm(col0Top.cy - 6.8 * MM)}"><i></i><i></i><i></i><i></i></div>`;
        const rowLabels = SHORT_MARKS.map((mark) => {
          const c = qb.find((b) => b.column === 0 && b.mark === mark);
          return c
            ? `<text x="${mm(c.cx - 3.6 * MM)}" y="${mm(c.cy)}" text-anchor="end" dominant-baseline="central" class="opt">${mark}</text>`
            : '';
        }).join('');
        return (
          `<text x="${mm(col0Top.cx - 3 * MM)}" y="${mm(titleY)}" class="qn" font-weight="700">Câu ${q.displayNo ?? q.no}</text>` +
          rowLabels
        );
      })
      .join('');
    const circles = shortItems
      .map(
        (b) =>
          `<circle cx="${mm(b.cx)}" cy="${mm(b.cy)}" r="${mm(b.r)}" class="bubble" />` +
          `<text x="${mm(b.cx)}" y="${mm(b.cy)}" text-anchor="middle" dominant-baseline="central" class="opt-sm">${b.mark}</text>`,
      )
      .join('');
    shortLayer = headers + circles;
  }

  // ---- candidate number grid
  const sbd = template.sbd;
  let sbdLayer = '';
  let sbdHeader = '';
  if (sbd && sbd.cells.length > 0) {
    const first = sbd.cells.find((cell) => cell.column === 0 && cell.digit === 0) ?? sbd.cells[0];
    const gridLeft = first.cx - SBD_CELL / 2;
    const gridTopSbd = first.cy - SBD_R;
    const boxTop = gridTopSbd - 9 * MM;
    // Narrower than the column pitch, otherwise neighbouring boxes overlap and
    // the row looks ragged instead of like a strip of six cells.
    const boxSize = SBD_CELL - 0.6 * MM;

    // Written digits above the grid: the student copies their number here first,
    // so a human can still check the paper when the marks are ambiguous.
    const boxes = Array.from({ length: sbd.digits }, (_, column) => {
      const cell = sbd.cells.find((entry) => entry.column === column && entry.digit === 0);
      const x = (cell ? cell.cx : gridLeft + column * SBD_CELL + SBD_CELL / 2) - boxSize / 2;
      const printed = student?.code ? (student.code.replace(/\D/g, '')[column] ?? '') : '';
      return (
        `<div class="sbd-box" style="left:${mm(x)};top:${mm(boxTop)};width:${mm(boxSize)};height:${mm(boxSize)}">` +
        `${escapeHtml(printed)}</div>`
      );
    }).join('');

    const rowLabels = Array.from({ length: 10 }, (_, digit) => {
      const cell = sbd.cells.find((entry) => entry.digit === digit && entry.column === 0);
      if (!cell) return '';
      return `<div class="sbd-row" style="left:${mm(CONTENT_LEFT)};top:${mm(cell.cy - 2 * MM)};width:${mm(SBD_LABEL_WIDTH - 2.5 * MM)}">${digit}</div>`;
    }).join('');

    const cells = sbd.cells
      .map(
        (cell) =>
          `<circle cx="${mm(cell.cx)}" cy="${mm(cell.cy)}" r="${mm(cell.r)}" class="bubble" />`,
      )
      .join('');

    sbdLayer = cells;
    sbdHeader =
      `<div class="sbd-title" style="left:${mm(CONTENT_LEFT)};top:${mm(gridTopSbd - 15 * MM)}">SỐ BÁO DANH</div>` +
      boxes +
      rowLabels;
  }

  // Fills the space left over on a multiple-choice-only paper with the block a
  // real exam sheet carries, instead of a blank half page.
  const scoreBlockTop = gridTop + rows * mcRowH + 6 * MM;
  const scoreBlockBottom = scoreBlockTop + 18 * MM;
  const scoreBlock =
    !hasObjectiveExt && essays.length === 0 && scoreBlockBottom < CONTENT_BOTTOM - ANCHOR_SAFE
      ? `<div class="score" style="left:${mm(CONTENT_LEFT)};top:${mm(scoreBlockTop)};width:${mm(CONTENT_WIDTH)};height:${mm(18 * MM)}">
           <div class="score-left">
             <div class="score-title">ĐIỂM BÀI THI</div>
             <div class="score-cells"><i></i><i></i><i></i></div>
             <div class="score-note">Bằng số / Bằng chữ</div>
           </div>
           <div class="score-right">
             <div class="sign"><span>Giám khảo 1</span><i></i></div>
             <div class="sign"><span>Giám khảo 2</span><i></i></div>
             <div class="sign"><span>Họ tên thí sinh ký</span><i></i></div>
           </div>
         </div>`
      : '';

  const essayBoxes = template.essayBoxes
    .map((box) => {
      const question = essays.find((entry) => entry.no === box.q);
      const disp = question?.displayNo ?? box.q;
      const label = question ? `Câu ${disp} (${question.points} điểm)` : `Câu ${disp}`;
      return (
        `<div class="essay" style="left:${mm(box.x)};top:${mm(box.y)};width:${mm(box.width)};height:${mm(box.height)}">` +
        `<span class="essay-label">${escapeHtml(label)}</span></div>`
      );
    })
    .join('');

  const page1EssayTitleTop = template.essayBoxes.length
    ? template.essayBoxes[0].y - 8 * MM
    : gridTop + rows * mcRowH + 4 * MM;

  const instructions = [
    'Dùng bút chì hoặc bút mực tô kín một ô tròn cho mỗi câu.',
    'Tô số báo danh của mình vào bảng bên trái, mỗi cột một chữ số.',
    'Câu tô hai ô sẽ không được tính điểm cho tới khi giáo viên xác nhận.',
    options.note ? escapeHtml(options.note) : 'Không viết vào ô đen ở bốn góc phiếu.',
  ];

  // SVG shapes are ignored unless they sit inside an <svg> element. Without
  // this wrapper the 4 corner anchors and every bubble silently disappear from
  // the printed page, which leaves the scanner nothing to find.
  const frame =
    `<rect x="${mm(6 * MM)}" y="${mm(6 * MM)}" width="${mm(A4_WIDTH - 12 * MM)}" ` +
    `height="${mm(A4_HEIGHT - 12 * MM)}" fill="none" stroke="#000" stroke-width="0.4mm" />`;

  const layer =
    `<svg xmlns="http://www.w3.org/2000/svg"` +
    ` width="${mm(template.page.width)}" height="${mm(template.page.height)}"` +
    ` viewBox="0 0 ${template.page.width} ${template.page.height}"` +
    ` style="position:absolute;left:0;top:0;overflow:visible">` +
    frame +
    anchors +
    sbdLayer +
    (multichoice.length > 0 ? columnLabels + numberCells + bubbles : '') +
    tfLayer +
    shortLayer +
    `</svg>`;

  const secondPage =
    template.essayOnSecondPage && essayBoxes
      ? `
  <section class="sheet sheet-essay">
    <svg xmlns="http://www.w3.org/2000/svg" width="${mm(template.page.width)}" height="${mm(template.page.height)}" viewBox="0 0 ${template.page.width} ${template.page.height}" style="position:absolute;left:0;top:0;overflow:visible">${frame}</svg>
    <div class="header" style="width:${mm(CONTENT_WIDTH - ANCHOR_SAFE)}">
      <div class="school">${escapeHtml(options.schoolName ?? 'TRƯỜNG THCS')} · TRANG 2 (PHẦN TỰ LUẬN)</div>
      <div class="meta">${escapeHtml(options.title)}${student ? ` · Thí sinh: <b>${escapeHtml(student.name)}</b>` : ''}${student?.code ? ` · SBD: <b>${escapeHtml(student.code)}</b>` : ''}</div>
    </div>
    ${essayBoxes}
    <div class="footnote">Trang 2 — Phần bài làm tự luận.</div>
  </section>`
      : '';

  // The QR box carries page coordinates, so it must sit on `.sheet` rather than
  // inside `.header` — nesting it in the header added the header offset on top
  // and pushed the code past the right margin.
  return `
  <section class="sheet">
    ${layer}
    <div class="qr" style="left:${mm(template.qr.x)};top:${mm(template.qr.y)};width:${mm(template.qr.size)};height:${mm(template.qr.size)}">
      ${qrImage ? `<img src="${qrImage}" alt="" />` : '<div class="qr-empty">QR</div>'}
    </div>

    <div class="header">
      <div class="school">${escapeHtml(options.schoolName ?? 'TRƯỜNG THCS')}</div>
      <div class="title">PHIẾU TRẢ LỜI TRẮC NGHIỆM</div>
      <div class="meta">${escapeHtml(options.title)}${
        options.subject ? ` · Môn ${escapeHtml(options.subject)}` : ''
      }${options.duration ? ` · Thời gian ${escapeHtml(options.duration)}` : ''}${
        options.className ? ` · Lớp ${escapeHtml(options.className)}` : ''
      }</div>
    </div>

    ${sbdHeader}

    <div class="cand" style="left:${mm(CONTENT_LEFT + SBD_LABEL_WIDTH + 6 * SBD_CELL + 9 * MM)};top:${mm(CONTENT_TOP + HEADER_HEIGHT + 2 * MM)}">
      <div class="cand-row"><span>Họ và tên thí sinh:</span>${
        student ? `<b>${escapeHtml(student.name)}</b>` : '<i></i>'
      }</div>
      <div class="cand-row"><span>Lớp:</span><i class="short"></i><span class="gap">Ngày sinh:</span><i class="short"></i></div>
      ${
        student?.code
          ? `<div class="cand-row"><span>Số báo danh:</span><b>${escapeHtml(student.code)}</b></div>`
          : ''
      }
      ${options.examCode ? `<div class="cand-row"><span>Mã đề:</span><b>${escapeHtml(options.examCode)}</b></div>` : ''}
      <div class="instr">
        ${instructions.map((line) => `<div>• ${line}</div>`).join('')}
      </div>
    </div>

    ${
      multichoice.length > 0
        ? `<div class="section-title" style="top:${mm(gridTop - 7 * MM)}">${hasObjectiveExt ? 'PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN' : 'PHẦN TRẢ LỜI TRẮC NGHIỆM'}</div>`
        : ''
    }

    ${tfTitle}
    ${shortHtml}

    ${
      essayBoxes && !template.essayOnSecondPage
        ? `<div class="section-title" style="top:${mm(page1EssayTitleTop)}">PHẦN TỰ LUẬN</div>${essayBoxes}`
        : scoreBlock
    }

    <div class="footnote">Bài làm gồm ${rubric.questions.length} câu · ${rubric.totalPoints} điểm.${template.essayOnSecondPage ? ' Phần tự luận xem ở trang 2.' : ' Tô kín ô, không tô hai ô.'}</div>
  </section>${secondPage}`;
}

/**
 * Renders the printable document. One sheet per student when a roster is given,
 * otherwise a single blank sheet.
 */
export async function renderSheetHtml(rubric: Rubric, options: SheetOptions): Promise<string> {
  const template = buildSheetTemplate(rubric, options);
  const students = options.students && options.students.length > 0 ? options.students : [undefined];

  const sheets: string[] = [];
  for (const student of students) {
    const qrImage = await qrDataUrl(qrPayload(options, student));
    sheets.push(sheetBody(rubric, template, options, student, qrImage));
  }

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>Phiếu trả lời — ${escapeHtml(options.title)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { font-family: "Times New Roman", Times, serif; color: #000; background: #fff; }
  .sheet {
    position: relative;
    width: ${mm(A4_WIDTH)};
    height: ${mm(A4_HEIGHT)};
    page-break-after: always;
    overflow: hidden;
  }
  .sheet:last-child { page-break-after: auto; }
  .header { position: absolute; left: ${mm(CONTENT_LEFT + ANCHOR_SAFE)}; top: ${mm(CONTENT_TOP)}; width: ${mm(CONTENT_WIDTH - QR_SIZE - ANCHOR_SAFE - 6 * MM)}; }
  .school { font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.02em; }
  .title { font-size: 14pt; font-weight: 700; margin-top: 1mm; letter-spacing: 0.04em; }
  .meta { font-size: 8.5pt; margin-top: 0.8mm; }
  .sbd-title { position: absolute; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.08em; }
  .sbd-box { position: absolute; border: 0.3mm solid #000; font-size: 10pt; font-weight: 700; text-align: center; line-height: 5.6mm; }
  .sbd-row { position: absolute; font-size: 7pt; text-align: right; line-height: 4mm; }
  .short-boxes { position: absolute; display: flex; gap: 0.4mm; }
  .short-boxes i { display: inline-block; width: ${mm(SHORT_CELL_W - 0.4 * MM)}; height: 4.4mm; border: 0.25mm solid #000; }
  .opt-sm { font-size: 4.8pt; fill: #000; }
  .cand { position: absolute; width: ${mm(CONTENT_RIGHT - (CONTENT_LEFT + SBD_LABEL_WIDTH + 6 * SBD_CELL + 9 * MM))}; }
  .cand-row { display: flex; align-items: flex-end; gap: 1.5mm; font-size: 9pt; margin-bottom: 2.6mm; }
  .cand-row i { flex: 1; border-bottom: 0.25mm dotted #000; height: 4mm; }
  .cand-row i.short { flex: 0 0 34mm; }
  .cand-row .gap { margin-left: 4mm; }
  .instr { margin-top: 2.4mm; border: 0.25mm solid #000; padding: 2mm 2.5mm; font-size: 7.5pt; line-height: 1.55; }
  .qr { position: absolute; }
  .qr img { width: 100%; height: 100%; }
  .qr-empty { width: 100%; height: 100%; border: 0.3mm solid #000; display: flex; align-items: center; justify-content: center; font-size: 9pt; }
  .section-title { position: absolute; left: ${mm(CONTENT_LEFT)}; font-size: 9pt; font-weight: 700; letter-spacing: 0.06em; }
  .qn { font-size: 9pt; }
  .bubble { fill: none; stroke: #000; stroke-width: 0.25mm; }
  .opt { font-size: 6.5pt; fill: #000; }
  .essay { position: absolute; border: 0.3mm solid #000; }
  .essay-label { position: absolute; left: 2mm; top: -2.6mm; background: #fff; padding: 0 1mm; font-size: 8pt; }
  .score { position: absolute; border: 0.3mm solid #000; display: flex; }
  .score-left { width: 58mm; border-right: 0.3mm solid #000; padding: 1.8mm 2.5mm; }
  .score-title { font-size: 8pt; font-weight: 700; letter-spacing: 0.08em; }
  .score-cells { display: flex; gap: 1.2mm; margin-top: 1.8mm; }
  .score-cells i { flex: 1; height: 6.5mm; border: 0.25mm solid #000; }
  .score-note { font-size: 6.5pt; margin-top: 1.6mm; }
  .score-right { flex: 1; padding: 1.8mm 2.5mm; display: flex; flex-direction: column; justify-content: space-between; }
  .sign { display: flex; align-items: flex-end; gap: 2mm; font-size: 7.5pt; }
  .sign span { white-space: nowrap; }
  .sign i { flex: 1; border-bottom: 0.25mm dotted #000; height: 4mm; }
  .footnote { position: absolute; left: ${mm(CONTENT_LEFT + 14 * MM)}; width: ${mm(CONTENT_WIDTH - 28 * MM)}; bottom: ${mm(MARGIN - 4 * MM)}; font-size: 7.5pt; font-style: italic; text-align: center; }
</style>
</head>
<body>
${sheets.join('\n')}
</body>
</html>`;
}
