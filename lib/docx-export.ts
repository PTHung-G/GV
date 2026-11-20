/**
 * OpenXML (.docx) exporter for Vietnamese K-12 exams and answer keys.
 *
 * Converts the A4 exam HTML AST (`parse5`) into Microsoft Word OpenXML using `docx`:
 *   - A4 page size (210mm x 297mm = 11906 x 16838 twips) and Times New Roman 13pt.
 *   - `.doc-header` -> borderless 2-column table.
 *   - `.doc-grid` -> borderless 1/2/3/4-column choice table.
 *   - `<table>` -> bordered grid table (answer key & rubric tables).
 *   - `.doc-math` / `$...$` / `$$...$$` -> native Word OMML equations via `latexToMath`.
 *   - `<figure><svg>` -> SVG + 300-DPI PNG fallback (`canvas` in browser); `<img data:...>` -> raster `ImageRun`.
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableBorders,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type IParagraphOptions,
  type ParagraphChild,
} from 'docx';
import { latexToMath, Math as DocxMath, MathRun } from 'docx/math';
import { parseFragment, serialize, type DefaultTreeAdapterMap } from 'parse5';
import { splitMath } from './math';

type ChildNode = DefaultTreeAdapterMap['childNode'];
type Element = DefaultTreeAdapterMap['element'];
type TextNode = DefaultTreeAdapterMap['textNode'];

const A4_TWIPS_W = 11906; // 210mm
const A4_TWIPS_H = 16838; // 297mm
const MARGIN_TOP = 1020; // ~18mm
const MARGIN_BOTTOM = 1020; // ~18mm
const MARGIN_LEFT = 1134; // ~20mm
const MARGIN_RIGHT = 850; // ~15mm

const FONT_NAME = 'Times New Roman';
const DEFAULT_HALF_PT = 26; // 13pt
const TWIPS_LINE = 312; // ~1.3 line spacing

// 1x1 transparent PNG used only when running outside a browser canvas (e.g. Node unit tests).
const TRANSPARENT_1X1_PNG = Uint8Array.from([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0,
  0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 120, 156, 99, 96, 0, 2, 0, 0, 5, 0, 1, 13,
  10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
]);

type RunStyle = {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  strike?: boolean;
  superScript?: boolean;
  subScript?: boolean;
  color?: string;
  sizeHalfPt?: number;
};

type DocxBlock = Paragraph | Table;

function isElement(node: ChildNode): node is Element {
  return 'tagName' in node;
}

function isTextNode(node: ChildNode): node is TextNode {
  return node.nodeName === '#text';
}

function attrOf(el: Element, name: string): string {
  return el.attrs?.find((a) => a.name.toLowerCase() === name.toLowerCase())?.value ?? '';
}

function classesOf(el: Element): Set<string> {
  return new Set(attrOf(el, 'class').split(/\s+/).filter(Boolean));
}

function textContent(node: ChildNode): string {
  if (isTextNode(node)) return node.value;
  if ('childNodes' in node && Array.isArray(node.childNodes)) {
    return node.childNodes.map(textContent).join('');
  }
  return '';
}

function styleProp(styleAttr: string, prop: string): string {
  for (const part of styleAttr.split(';')) {
    const idx = part.indexOf(':');
    if (idx <= 0) continue;
    if (part.slice(0, idx).trim().toLowerCase() === prop.toLowerCase()) {
      return part.slice(idx + 1).trim();
    }
  }
  return '';
}

function hexColor(raw: string): string | undefined {
  const m = /^#([0-9a-fA-F]{6})$/.exec(raw.trim());
  if (m) return m[1].toUpperCase();
  const rgb = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(raw.trim());
  if (rgb) {
    return [rgb[1], rgb[2], rgb[3]]
      .map((v) => Math.max(0, Math.min(255, Number(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }
  return undefined;
}

function alignmentFromStyle(styleAttr: string, defaultAlign?: (typeof AlignmentType)[keyof typeof AlignmentType]) {
  const align = styleProp(styleAttr, 'text-align').toLowerCase();
  if (align === 'center') return AlignmentType.CENTER;
  if (align === 'right' || align === 'end') return AlignmentType.END;
  if (align === 'justify') return AlignmentType.BOTH;
  if (align === 'left' || align === 'start') return AlignmentType.START;
  return defaultAlign;
}

function mathChildrenForLatex(rawLatex: string): ParagraphChild[] {
  const stripped = rawLatex.replace(/^\$\$?|\$\$?$/g, '').trim();
  if (!stripped) return [];
  try {
    const components = latexToMath(stripped);
    return [new DocxMath({ children: [...components] })];
  } catch {
    return [new DocxMath({ children: [new MathRun(stripped)] })];
  }
}

function makeTextRun(text: string, style: RunStyle): TextRun {
  return new TextRun({
    text,
    font: FONT_NAME,
    size: style.sizeHalfPt ?? DEFAULT_HALF_PT,
    bold: style.bold,
    italics: style.italics,
    underline: style.underline ? {} : undefined,
    strike: style.strike,
    superScript: style.superScript,
    subScript: style.subScript,
    color: style.color,
  });
}

function collectInlineRuns(nodes: ChildNode[], style: RunStyle): ParagraphChild[] {
  const out: ParagraphChild[] = [];
  for (const node of nodes) {
    if (isTextNode(node)) {
      const value = node.value.replace(/\u00a0/g, ' ');
      if (!value) continue;
      if (!value.includes('$')) {
        out.push(makeTextRun(value, style));
        continue;
      }
      for (const seg of splitMath(value)) {
        if (seg.type === 'text') {
          if (seg.value) out.push(makeTextRun(seg.value, style));
        } else {
          out.push(...mathChildrenForLatex(seg.latex));
        }
      }
      continue;
    }

    if (!isElement(node)) continue;
    const tag = node.tagName.toLowerCase();
    const cls = classesOf(node);

    if (tag === 'br') {
      out.push(new TextRun({ break: 1, font: FONT_NAME, size: style.sizeHalfPt ?? DEFAULT_HALF_PT }));
      continue;
    }

    if (cls.has('doc-math') || tag === 'math') {
      const dataLatex = attrOf(node, 'data-latex');
      const tex = dataLatex || textContent(node);
      if (tex.trim()) {
        out.push(...mathChildrenForLatex(tex));
      }
      continue;
    }

    const css = attrOf(node, 'style');
    const color = hexColor(styleProp(css, 'color') || attrOf(node, 'color'));
    const nextStyle: RunStyle = {
      ...style,
      bold: style.bold || tag === 'b' || tag === 'strong' || styleProp(css, 'font-weight') === 'bold',
      italics: style.italics || tag === 'i' || tag === 'em' || styleProp(css, 'font-style') === 'italic',
      underline: style.underline || tag === 'u' || styleProp(css, 'text-decoration').includes('underline'),
      strike: style.strike || tag === 's' || tag === 'del',
      superScript: style.superScript || tag === 'sup',
      subScript: style.subScript || tag === 'sub',
      ...(color ? { color } : {}),
    };

    out.push(...collectInlineRuns(node.childNodes ?? [], nextStyle));
  }
  return out;
}

function hasPageBreak(el: Element): boolean {
  if (classesOf(el).has('page-break') || el.attrs?.some((a) => a.name.toLowerCase() === 'data-page-break')) {
    return true;
  }
  const style = attrOf(el, 'style').toLowerCase().replace(/\s+/g, '');
  return style.includes('page-break-after:always') || style.includes('break-after:page');
}

function parseSvgDimensions(svgEl: Element): { width: number; height: number } {
  const wAttr = parseFloat(attrOf(svgEl, 'width'));
  const hAttr = parseFloat(attrOf(svgEl, 'height'));
  const vb = attrOf(svgEl, 'viewBox')
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const rawW = Number.isFinite(wAttr) && wAttr > 0 ? wAttr : vb.length === 4 && vb[2] > 0 ? vb[2] : 280;
  const rawH = Number.isFinite(hAttr) && hAttr > 0 ? hAttr : vb.length === 4 && vb[3] > 0 ? vb[3] : 200;
  const maxWidth = 340;
  const scale = rawW > maxWidth ? maxWidth / rawW : 1;
  return {
    width: Math.max(80, Math.round(rawW * scale)),
    height: Math.max(60, Math.round(rawH * scale)),
  };
}

async function svgToPngFallback(svgMarkup: string, width: number, height: number): Promise<Uint8Array> {
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    return TRANSPARENT_1X1_PNG;
  }
  try {
    const dpiScale = 3;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('svg_load_error'));
        el.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * dpiScale));
      canvas.height = Math.max(1, Math.round(height * dpiScale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return TRANSPARENT_1X1_PNG;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!pngBlob) return TRANSPARENT_1X1_PNG;
      return new Uint8Array(await pngBlob.arrayBuffer());
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return TRANSPARENT_1X1_PNG;
  }
}

function findElement(root: Element, predicate: (el: Element) => boolean): Element | null {
  for (const child of root.childNodes ?? []) {
    if (!isElement(child)) continue;
    if (predicate(child)) return child;
    const nested = findElement(child, predicate);
    if (nested) return nested;
  }
  return null;
}

function decodeDataUrl(src: string): { type: 'png' | 'jpg' | 'gif'; bytes: Uint8Array } | null {
  const m = /^data:image\/(png|jpeg|jpg|gif|webp);base64,([A-Za-z0-9+/=\s]+)$/i.exec(src.trim());
  if (!m) return null;
  const rawType = m[1].toLowerCase();
  const type = rawType === 'jpeg' || rawType === 'jpg' ? 'jpg' : rawType === 'gif' ? 'gif' : 'png';
  const cleaned = m[2].replace(/\s+/g, '');
  if (typeof atob === 'function') {
    const bin = atob(cleaned);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return { type, bytes };
  }
  return { type, bytes: new Uint8Array(Buffer.from(cleaned, 'base64')) };
}

function makeParagraph(
  children: ParagraphChild[],
  opts: Omit<IParagraphOptions, 'children'> = {},
): Paragraph {
  return new Paragraph({
    spacing: { before: 40, after: 80, line: TWIPS_LINE, ...opts.spacing },
    ...opts,
    children: children.length ? children : [makeTextRun('', {})],
  });
}

async function convertFigure(el: Element): Promise<DocxBlock[]> {
  const blocks: DocxBlock[] = [];
  const svgEl = el.tagName.toLowerCase() === 'svg' ? el : findElement(el, (c) => c.tagName.toLowerCase() === 'svg');
  const imgEl = el.tagName.toLowerCase() === 'img' ? el : findElement(el, (c) => c.tagName.toLowerCase() === 'img');

  if (svgEl) {
    if (!svgEl.attrs?.some((a) => a.name.toLowerCase() === 'xmlns')) {
      svgEl.attrs = [...(svgEl.attrs ?? []), { name: 'xmlns', value: 'http://www.w3.org/2000/svg' }];
    }
    const svgMarkup = serialize({
      nodeName: '#document-fragment',
      childNodes: [svgEl],
    } as DefaultTreeAdapterMap['documentFragment']);
    const { width, height } = parseSvgDimensions(svgEl);
    const fallbackPng = await svgToPngFallback(svgMarkup, width, height);
    blocks.push(
      makeParagraph(
        [
          new ImageRun({
            type: 'svg',
            data: new TextEncoder().encode(svgMarkup),
            fallback: { type: 'png', data: fallbackPng },
            transformation: { width, height },
          }),
        ],
        { alignment: AlignmentType.CENTER, spacing: { before: 80, after: 60 } },
      ),
    );
  } else if (imgEl) {
    const decoded = decodeDataUrl(attrOf(imgEl, 'src'));
    if (decoded) {
      blocks.push(
        makeParagraph(
          [
            new ImageRun({
              type: decoded.type,
              data: decoded.bytes,
              transformation: { width: 320, height: 220 },
            }),
          ],
          { alignment: AlignmentType.CENTER, spacing: { before: 80, after: 60 } },
        ),
      );
    }
  }

  const captionEl = findElement(el, (c) => c.tagName.toLowerCase() === 'figcaption');
  if (captionEl) {
    const capText = textContent(captionEl).trim();
    if (capText) {
      blocks.push(
        makeParagraph([makeTextRun(capText, { italics: true, sizeHalfPt: 22 })], {
          alignment: AlignmentType.CENTER,
        }),
      );
    }
  }
  return blocks;
}

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

const GRID_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: '555555' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: '555555' },
  left: { style: BorderStyle.SINGLE, size: 4, color: '555555' },
  right: { style: BorderStyle.SINGLE, size: 4, color: '555555' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '555555' },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '555555' },
};

async function convertHeaderGrid(el: Element): Promise<DocxBlock[]> {
  const cols = (el.childNodes ?? []).filter(
    (c): c is Element => isElement(c) && classesOf(c).has('doc-header-col'),
  );
  if (!cols.length) return convertElementList(el.childNodes ?? []);

  const cells: TableCell[] = [];
  for (const col of cols.slice(0, 2)) {
    const ps: Paragraph[] = [];
    for (const child of col.childNodes ?? []) {
      if (isElement(child) && ['p', 'div', 'h1', 'h2', 'h3'].includes(child.tagName.toLowerCase())) {
        const align = alignmentFromStyle(attrOf(child, 'style'), AlignmentType.CENTER);
        ps.push(
          makeParagraph(collectInlineRuns(child.childNodes ?? [], {}), {
            alignment: align,
            spacing: { before: 20, after: 40, line: TWIPS_LINE },
          }),
        );
      } else if (isTextNode(child) && child.value.trim()) {
        ps.push(
          makeParagraph([makeTextRun(child.value.trim(), {})], {
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 40 },
          }),
        );
      }
    }
    cells.push(
      new TableCell({
        borders: NO_BORDERS,
        width: { size: cols.length === 2 ? 50 : 100, type: WidthType.PERCENTAGE },
        children: ps.length ? ps : [makeParagraph([])],
      }),
    );
  }

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      rows: [new TableRow({ children: cells })],
    }),
  ];
}

async function convertChoiceGrid(el: Element): Promise<DocxBlock[]> {
  const cells = (el.childNodes ?? []).filter(
    (c): c is Element => isElement(c) && (classesOf(c).has('doc-grid-cell') || c.tagName.toLowerCase() === 'div' || c.tagName.toLowerCase() === 'p'),
  );
  if (!cells.length) return [];

  const attrCols = Number(attrOf(el, 'data-columns'));
  const maxLen = Math.max(...cells.map((c) => textContent(c).trim().length), 1);
  const cols =
    Number.isInteger(attrCols) && attrCols >= 1 && attrCols <= 6
      ? attrCols
      : maxLen <= 18 && cells.length >= 4
        ? 4
        : maxLen <= 42 && cells.length >= 2
          ? 2
          : 1;

  const rows: TableRow[] = [];
  for (let i = 0; i < cells.length; i += cols) {
    const slice = cells.slice(i, i + cols);
    const rowCells: TableCell[] = slice.map((cell) => {
      const ps = collectInlineRuns(cell.childNodes ?? [], {});
      return new TableCell({
        borders: NO_BORDERS,
        width: { size: Math.floor(100 / cols), type: WidthType.PERCENTAGE },
        children: [makeParagraph(ps, { spacing: { before: 20, after: 40, line: TWIPS_LINE } })],
      });
    });
    while (rowCells.length < cols) {
      rowCells.push(
        new TableCell({
          borders: NO_BORDERS,
          width: { size: Math.floor(100 / cols), type: WidthType.PERCENTAGE },
          children: [makeParagraph([])],
        }),
      );
    }
    rows.push(new TableRow({ children: rowCells }));
  }

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      rows,
    }),
  ];
}

async function convertHtmlTable(el: Element): Promise<DocxBlock[]> {
  const trs: Array<{ row: Element; isHeader: boolean }> = [];
  for (const section of el.childNodes ?? []) {
    if (!isElement(section)) continue;
    const tag = section.tagName.toLowerCase();
    if (tag === 'tr') {
      trs.push({ row: section, isHeader: false });
    } else if (tag === 'thead' || tag === 'tbody' || tag === 'tfoot') {
      for (const child of section.childNodes ?? []) {
        if (isElement(child) && child.tagName.toLowerCase() === 'tr') {
          trs.push({ row: child, isHeader: tag === 'thead' });
        }
      }
    }
  }
  if (!trs.length) return [];

  const rows: TableRow[] = [];
  for (const { row, isHeader } of trs) {
    const cellNodes = (row.childNodes ?? []).filter(
      (c): c is Element => isElement(c) && ['td', 'th'].includes(c.tagName.toLowerCase()),
    );
    if (!cellNodes.length) continue;
    const tableCells: TableCell[] = [];
    for (const cell of cellNodes) {
      const boldCell = isHeader || cell.tagName.toLowerCase() === 'th';
      const innerBlocks = await convertElementList(cell.childNodes ?? [], { bold: boldCell });
      const paragraphs = innerBlocks.filter((b): b is Paragraph => b instanceof Paragraph);
      const colSpan = Number(attrOf(cell, 'colspan'));
      const rowSpan = Number(attrOf(cell, 'rowspan'));
      tableCells.push(
        new TableCell({
          borders: GRID_BORDERS,
          columnSpan: Number.isInteger(colSpan) && colSpan > 1 ? colSpan : undefined,
          rowSpan: Number.isInteger(rowSpan) && rowSpan > 1 ? rowSpan : undefined,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: paragraphs.length ? paragraphs : [makeParagraph(collectInlineRuns(cell.childNodes ?? [], { bold: boldCell }))],
        }),
      );
    }
    rows.push(new TableRow({ children: tableCells, tableHeader: isHeader }));
  }

  return rows.length
    ? [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: TableBorders.NONE,
          rows,
        }),
      ]
    : [];
}

async function convertElementList(nodes: ChildNode[], inheritedStyle: RunStyle = {}): Promise<DocxBlock[]> {
  const blocks: DocxBlock[] = [];
  let inlineBuffer: ChildNode[] = [];

  const flushInline = () => {
    if (!inlineBuffer.length) return;
    const runs = collectInlineRuns(inlineBuffer, inheritedStyle);
    inlineBuffer = [];
    if (runs.length) blocks.push(makeParagraph(runs));
  };

  for (const node of nodes) {
    if (isTextNode(node)) {
      if (node.value.trim()) inlineBuffer.push(node);
      continue;
    }
    if (!isElement(node)) continue;

    const tag = node.tagName.toLowerCase();
    const cls = classesOf(node);

    if (cls.has('doc-header')) {
      flushInline();
      blocks.push(...(await convertHeaderGrid(node)));
      continue;
    }

    if (cls.has('doc-grid')) {
      flushInline();
      blocks.push(...(await convertChoiceGrid(node)));
      continue;
    }

    if (hasPageBreak(node)) {
      flushInline();
      blocks.push(new Paragraph({ children: [new PageBreak()] }));
      continue;
    }

    if (tag === 'figure' || tag === 'svg' || tag === 'img') {
      flushInline();
      blocks.push(...(await convertFigure(node)));
      continue;
    }

    if (tag === 'table') {
      flushInline();
      blocks.push(...(await convertHtmlTable(node)));
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      flushInline();
      let idx = 1;
      for (const child of node.childNodes ?? []) {
        if (!isElement(child) || child.tagName.toLowerCase() !== 'li') continue;
        const prefix = tag === 'ol' ? `${idx}. ` : '• ';
        idx += 1;
        const runs = [makeTextRun(prefix, inheritedStyle), ...collectInlineRuns(child.childNodes ?? [], inheritedStyle)];
        blocks.push(
          makeParagraph(runs, {
            indent: { left: 420 },
            spacing: { before: 20, after: 60, line: TWIPS_LINE },
          }),
        );
      }
      continue;
    }

    if (/^h[1-6]$/.test(tag)) {
      flushInline();
      const sizeHalfPt = tag === 'h1' ? 32 : tag === 'h2' ? 28 : 26;
      const defaultAlign = tag === 'h1' ? AlignmentType.CENTER : undefined;
      const alignment = alignmentFromStyle(attrOf(node, 'style'), defaultAlign);
      const runs = collectInlineRuns(node.childNodes ?? [], {
        ...inheritedStyle,
        bold: true,
        sizeHalfPt,
      });
      blocks.push(
        makeParagraph(runs, {
          alignment,
          spacing: { before: 140, after: 100, line: TWIPS_LINE },
        }),
      );
      continue;
    }

    if (tag === 'p' || tag === 'blockquote' || tag === 'div') {
      // Recurse into generic container divs that wrap multiple block elements
      const hasBlockChildren = (node.childNodes ?? []).some(
        (c) =>
          isElement(c) &&
          ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'table', 'figure', 'svg', 'ul', 'ol'].includes(
            c.tagName.toLowerCase(),
          ),
      );
      if ((tag === 'div' || tag === 'blockquote') && hasBlockChildren) {
        flushInline();
        blocks.push(...(await convertElementList(node.childNodes ?? [], inheritedStyle)));
        continue;
      }

      flushInline();
      const css = attrOf(node, 'style');
      const alignment = alignmentFromStyle(css);
      const boxed = cls.has('doc-boxed');
      const runs = collectInlineRuns(node.childNodes ?? [], inheritedStyle);
      blocks.push(
        makeParagraph(runs, {
          alignment,
          indent: tag === 'blockquote' ? { left: 480 } : undefined,
          border: boxed
            ? {
                top: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
                bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
                left: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
                right: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
              }
            : undefined,
        }),
      );
      continue;
    }

    inlineBuffer.push(node);
  }

  flushInline();
  return blocks;
}

export async function buildDocxDocument(options: { title: string; html: string }): Promise<Document> {
  const fragment = parseFragment(options.html || '');
  const children = await convertElementList(fragment.childNodes ?? []);
  if (!children.length && options.title.trim()) {
    children.push(
      makeParagraph([makeTextRun(options.title.trim(), { bold: true, sizeHalfPt: 32 })], {
        alignment: AlignmentType.CENTER,
      }),
    );
  }

  return new Document({
    title: options.title,
    creator: 'Hỗ trợ giáo viên',
    sections: [
      {
        properties: {
          page: {
            size: { width: A4_TWIPS_W, height: A4_TWIPS_H },
            margin: {
              top: MARGIN_TOP,
              bottom: MARGIN_BOTTOM,
              left: MARGIN_LEFT,
              right: MARGIN_RIGHT,
            },
          },
        },
        children,
      },
    ],
  });
}

export async function exportDocxBuffer(options: { title: string; html: string }): Promise<Uint8Array> {
  const doc = await buildDocxDocument(options);
  return Packer.toBuffer(doc);
}

export async function exportDocxBlob(options: { title: string; html: string }): Promise<Blob> {
  const doc = await buildDocxDocument(options);
  return Packer.toBlob(doc);
}

export function safeDocxFilename(title: string): string {
  const cleaned = title
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, ' ');
  return `${cleaned || 'de-thi'}.docx`;
}

export async function downloadDocx(options: {
  title: string;
  html: string;
  filename?: string;
}): Promise<void> {
  const blob = await exportDocxBlob({ title: options.title, html: options.html });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = options.filename ?? safeDocxFilename(options.title);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
