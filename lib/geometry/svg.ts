/**
 * Pure TypeScript Scene → inline SVG fallback renderer.
 *
 * Used automatically whenever `pdflatex` / `pdftocairo` binaries are not
 * available on the server host, keeping geometry figures functional and crisp
 * across development and serverless environments without ever inventing coordinates.
 */
import { escapeHtml } from '@/lib/math';
import type { Anchor, Scene } from './spec';

const MAX_WIDTH_CM = 8.2;
const MAX_HEIGHT_CM = 6.2;
const LABEL_MARGIN_CM = 1.1;
const PX_PER_CM = 96 / 2.54; // ~37.795 px/cm

const n = (v: number) => {
  const fixed = v.toFixed(2);
  return fixed.replace(/\.?0+$/, '') || '0';
};

function fitScale(scene: Scene): number {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const p of Object.values(scene.points)) {
    xs.push(p.x);
    ys.push(p.y);
  }
  for (const c of scene.circles) {
    const center = scene.points[c.center];
    if (!center) continue;
    xs.push(center.x - c.radius, center.x + c.radius);
    ys.push(center.y - c.radius, center.y + c.radius);
  }
  for (const line of scene.polylines) {
    for (const [x, y] of line.points) {
      xs.push(x);
      ys.push(y);
    }
  }
  if (!xs.length) return 1;
  const width = Math.max(...xs) - Math.min(...xs) + LABEL_MARGIN_CM;
  const height = Math.max(...ys) - Math.min(...ys) + LABEL_MARGIN_CM;
  const byWidth = width > 0 ? MAX_WIDTH_CM / width : Infinity;
  const byHeight = height > 0 ? MAX_HEIGHT_CM / height : Infinity;
  return Math.min(1, byWidth, byHeight);
}

function anchorOffset(anchor: Anchor): { dx: number; dy: number; textAnchor: 'start' | 'middle' | 'end'; baseline: string } {
  switch (anchor) {
    case 'above':
      return { dx: 0, dy: -7, textAnchor: 'middle', baseline: 'auto' };
    case 'below':
      return { dx: 0, dy: 14, textAnchor: 'middle', baseline: 'auto' };
    case 'left':
      return { dx: -7, dy: 4, textAnchor: 'end', baseline: 'auto' };
    case 'right':
      return { dx: 7, dy: 4, textAnchor: 'start', baseline: 'auto' };
    case 'above left':
      return { dx: -6, dy: -6, textAnchor: 'end', baseline: 'auto' };
    case 'above right':
      return { dx: 6, dy: -6, textAnchor: 'start', baseline: 'auto' };
    case 'below left':
      return { dx: -6, dy: 14, textAnchor: 'end', baseline: 'auto' };
    case 'below right':
      return { dx: 6, dy: 14, textAnchor: 'start', baseline: 'auto' };
  }
}

export function sceneToSvg(scene: Scene): string {
  const s = fitScale(scene) * PX_PER_CM;
  const toSvg = (p: { x: number; y: number }) => ({ x: p.x * s, y: -p.y * s });

  const allX: number[] = [];
  const allY: number[] = [];
  const track = (x: number, y: number, pad = 16) => {
    allX.push(x - pad, x + pad);
    allY.push(y - pad, y + pad);
  };

  for (const p of Object.values(scene.points)) {
    const pt = toSvg(p);
    track(pt.x, pt.y);
  }
  for (const c of scene.circles) {
    const center = scene.points[c.center];
    if (!center) continue;
    const pt = toSvg(center);
    const r = c.radius * s;
    track(pt.x - r, pt.y - r, 10);
    track(pt.x + r, pt.y + r, 10);
  }
  for (const line of scene.polylines) {
    for (const [x, y] of line.points) {
      const pt = toSvg({ x, y });
      track(pt.x, pt.y, 12);
    }
  }

  let axisMarkup = '';
  if (scene.axes) {
    const [xLo, xHi] = scene.axes.xRange;
    const yAt = -scene.axes.yAt * s;
    const ys = [
      ...Object.values(scene.points).map((p) => p.y * s),
      ...scene.polylines.flatMap((line) => line.points.map(([, y]) => y * s)),
      ...scene.circles.flatMap((circle) => {
        const c = scene.points[circle.center];
        return c ? [(c.y - circle.radius) * s, (c.y + circle.radius) * s] : [];
      }),
    ];
    const yLo = -(Math.min(...ys, 0) - 0.4 * PX_PER_CM);
    const yHi = -(Math.max(...ys, 0) + 0.4 * PX_PER_CM);
    track(xLo * s, yAt, 20);
    track(xHi * s, yAt, 24);
    track(0, yLo, 20);
    track(0, yHi, 24);
    axisMarkup += `<line x1="${n(xLo * s)}" y1="${n(yAt)}" x2="${n(xHi * s)}" y2="${n(yAt)}" stroke="#111" stroke-width="1.1" marker-end="url(#axis-arrow)"/>`;
    axisMarkup += `<text x="${n(xHi * s + 6)}" y="${n(yAt + 4)}" font-family="'Times New Roman', serif" font-style="italic" font-size="13" fill="#111">x</text>`;
    axisMarkup += `<line x1="0" y1="${n(yLo)}" x2="0" y2="${n(yHi)}" stroke="#111" stroke-width="1.1" marker-end="url(#axis-arrow)"/>`;
    axisMarkup += `<text x="6" y="${n(yHi - 2)}" font-family="'Times New Roman', serif" font-style="italic" font-size="13" fill="#111">y</text>`;
  }

  const elements: string[] = [];
  if (axisMarkup) elements.push(axisMarkup);

  for (const c of scene.circles) {
    const center = scene.points[c.center];
    if (!center) continue;
    const pt = toSvg(center);
    elements.push(`<circle cx="${n(pt.x)}" cy="${n(pt.y)}" r="${n(c.radius * s)}" fill="none" stroke="#111" stroke-width="1.25"/>`);
    elements.push(`<circle cx="${n(pt.x)}" cy="${n(pt.y)}" r="1.8" fill="#111"/>`);
  }

  for (const [from, to] of scene.segments) {
    const a = scene.points[from];
    const b = scene.points[to];
    if (!a || !b) continue;
    const p1 = toSvg(a);
    const p2 = toSvg(b);
    elements.push(`<line x1="${n(p1.x)}" y1="${n(p1.y)}" x2="${n(p2.x)}" y2="${n(p2.y)}" stroke="#111" stroke-width="1.25" stroke-linecap="round"/>`);
  }

  for (const [from, to] of scene.dashed) {
    const a = scene.points[from];
    const b = scene.points[to];
    if (!a || !b) continue;
    const p1 = toSvg(a);
    const p2 = toSvg(b);
    elements.push(`<line x1="${n(p1.x)}" y1="${n(p1.y)}" x2="${n(p2.x)}" y2="${n(p2.y)}" stroke="#111" stroke-width="1.1" stroke-dasharray="4 3" stroke-linecap="round"/>`);
  }

  for (const angle of scene.rightAngles) {
    const at = scene.points[angle.at];
    const from = scene.points[angle.from];
    const to = scene.points[angle.to];
    if (!at || !from || !to) continue;
    const pAt = toSvg(at);
    const pFrom = toSvg(from);
    const pTo = toSvg(to);
    const len1 = Math.hypot(pFrom.x - pAt.x, pFrom.y - pAt.y) || 1;
    const len2 = Math.hypot(pTo.x - pAt.x, pTo.y - pAt.y) || 1;
    const size = Math.max(7.5, (angle.size ?? 0.32) * s);
    const u1 = { x: ((pFrom.x - pAt.x) / len1) * size, y: ((pFrom.y - pAt.y) / len1) * size };
    const u2 = { x: ((pTo.x - pAt.x) / len2) * size, y: ((pTo.y - pAt.y) / len2) * size };
    const a = `${n(pAt.x + u1.x)},${n(pAt.y + u1.y)}`;
    const b = `${n(pAt.x + u1.x + u2.x)},${n(pAt.y + u1.y + u2.y)}`;
    const c = `${n(pAt.x + u2.x)},${n(pAt.y + u2.y)}`;
    elements.push(`<polyline points="${a} ${b} ${c}" fill="none" stroke="#111" stroke-width="1"/>`);
  }

  for (const line of scene.polylines) {
    if (!line.points.length) continue;
    const pts = line.points
      .map(([x, y]) => {
        const pt = toSvg({ x, y });
        return `${n(pt.x)},${n(pt.y)}`;
      })
      .join(' ');
    elements.push(`<polyline points="${pts}" fill="none" stroke="#111" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round"/>`);
  }

  for (const label of scene.labels) {
    const p = scene.points[label.name];
    if (!p) continue;
    const pt = toSvg(p);
    const { dx, dy, textAnchor } = anchorOffset(label.anchor);
    const text = escapeHtml(label.text ?? label.name);
    elements.push(
      `<text x="${n(pt.x + dx)}" y="${n(pt.y + dy)}" text-anchor="${textAnchor}" font-family="'Times New Roman', serif" font-style="italic" font-size="13.5" fill="#111">${text}</text>`,
    );
  }

  const minX = allX.length ? Math.min(...allX) : -20;
  const minY = allY.length ? Math.min(...allY) : -20;
  const maxX = allX.length ? Math.max(...allX) : 100;
  const maxY = allY.length ? Math.max(...allY) : 100;
  const width = Math.max(40, maxX - minX);
  const height = Math.max(40, maxY - minY);

  const defs = scene.axes
    ? `<defs><marker id="axis-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth"><path d="M0,1 L7,3.5 L0,6 L1.5,3.5 Z" fill="#111"/></marker></defs>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(minX)} ${n(minY)} ${n(width)} ${n(height)}">${defs}${elements.join('')}</svg>`;
}
