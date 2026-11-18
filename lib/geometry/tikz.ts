/**
 * Scene → TikZ.
 *
 * Every coordinate in the scene was computed by `solve()`; this file only
 * writes them down. TeX is a renderer here, not a geometry engine, which is why
 * a wrong figure cannot slip through as a successful compile.
 *
 * Sizing: a 6 x 8 cm triangle drawn to scale is 9.2 cm tall once the labels are
 * added, which eats a third of an A4 sheet. The drawing is therefore fitted into
 * a fixed box — the *geometry* shrinks, the label type does not, so every figure
 * in a paper carries the same readable 10 pt lettering.
 */
import type { Scene } from './spec';

/** Box a drawing must fit into, in centimetres. */
const MAX_WIDTH = 8.2;
const MAX_HEIGHT = 6.2;

/**
 * Room reserved for vertex letters and the standalone border.
 *
 * `fitScale` measures the geometry, but the finished SVG is always a little
 * larger than its points: the labels sit outside them. Without this allowance a
 * "6.2 cm" figure comes out at 7.4 cm and the box means nothing.
 */
const LABEL_MARGIN = 1.1;

const n = (value: number): string => {
  const fixed = value.toFixed(3);
  return fixed.replace(/\.?0+$/, '') || '0';
};

const point = (p: { x: number; y: number }): string => `(${n(p.x)},${n(p.y)})`;

/** Uniform scale that puts the whole drawing inside the box, never enlarging. */
function fitScale(scene: Scene): number {
  const xs: number[] = [];
  const ys: number[] = [];

  for (const p of Object.values(scene.points)) {
    xs.push(p.x);
    ys.push(p.y);
  }
  for (const circle of scene.circles) {
    const c = scene.points[circle.center];
    if (!c) continue;
    xs.push(c.x - circle.radius, c.x + circle.radius);
    ys.push(c.y - circle.radius, c.y + circle.radius);
  }
  for (const line of scene.polylines) {
    for (const [x, y] of line.points) {
      xs.push(x);
      ys.push(y);
    }
  }
  if (!xs.length) return 1;

  const width = Math.max(...xs) - Math.min(...xs) + LABEL_MARGIN;
  const height = Math.max(...ys) - Math.min(...ys) + LABEL_MARGIN;
  if (width <= 0 && height <= 0) return 1;

  const byWidth = width > 0 ? MAX_WIDTH / width : Infinity;
  const byHeight = height > 0 ? MAX_HEIGHT / height : Infinity;
  return Math.min(1, byWidth, byHeight);
}

/** Right-angle mark: the corner of a small square at `at`, between the two arms. */
function rightAnglePath(
  at: { x: number; y: number },
  from: { x: number; y: number },
  to: { x: number; y: number },
  size: number,
): string {
  const u1 = norm(from, at);
  const u2 = norm(to, at);
  const a = { x: at.x + u1.x * size, y: at.y + u1.y * size };
  const b = { x: a.x + u2.x * size, y: a.y + u2.y * size };
  const c = { x: at.x + u2.x * size, y: at.y + u2.y * size };
  return `${point(a)} -- ${point(b)} -- ${point(c)}`;
}

function norm(target: { x: number; y: number }, origin: { x: number; y: number }) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

export function sceneToTikz(scene: Scene): string {
  const lines: string[] = [];
  const s = fitScale(scene);

  const at = (name: string) => {
    const p = scene.points[name];
    if (!p) throw new Error(`Điểm "${name}" không tồn tại trong hình.`);
    return { x: p.x * s, y: p.y * s };
  };

  for (const circle of scene.circles) {
    lines.push(`  \\draw ${point(at(circle.center))} circle (${n(circle.radius * s)});`);
    // Centre marker, as in a textbook.
    lines.push(`  \\fill ${point(at(circle.center))} circle (0.9pt);`);
  }

  if (scene.axes) {
    const [xLo, xHi] = scene.axes.xRange;
    const yAt = scene.axes.yAt * s;
    lines.push(
      `  \\draw[-{Stealth[length=4pt]}] (${n(xLo * s)},${n(yAt)}) -- (${n(xHi * s)},${n(yAt)}) node[right] {$x$};`,
    );
    const ys = Object.values(scene.points).map((p) => p.y * s);
    const yLo = Math.min(...ys, 0) - 0.4;
    const yHi = Math.max(...ys, 0) + 0.4;
    lines.push(
      `  \\draw[-{Stealth[length=4pt]}] (0,${n(yLo)}) -- (0,${n(yHi)}) node[above] {$y$};`,
    );
  }

  for (const [from, to] of scene.segments) {
    lines.push(`  \\draw ${point(at(from))} -- ${point(at(to))};`);
  }

  for (const [from, to] of scene.dashed) {
    lines.push(`  \\draw[dashed] ${point(at(from))} -- ${point(at(to))};`);
  }

  for (const angle of scene.rightAngles) {
    // The mark scales with the drawing but keeps a floor, so a fitted figure
    // still shows a legible square rather than a dot.
    const size = Math.max(0.2, (angle.size ?? 0.32) * s);
    lines.push(`  \\draw ${rightAnglePath(at(angle.at), at(angle.from), at(angle.to), size)};`);
  }

  for (const line of scene.polylines) {
    const coords = line.points.map(([x, y]) => point({ x: x * s, y: y * s })).join(' -- ');
    lines.push(`  \\draw ${coords};`);
  }

  for (const label of scene.labels) {
    const text = label.text ?? label.name;
    lines.push(`  \\node[${label.anchor}] at ${point(at(label.name))} {$${text}$};`);
  }

  return ['\\begin{tikzpicture}', ...lines, '\\end{tikzpicture}'].join('\n');
}

/**
 * A complete, self-contained document. Only packages that ship with a base TeX
 * install are used, so the renderer does not depend on anything exotic.
 */
export function tikzDocument(scene: Scene): string {
  return [
    '\\documentclass[border=3pt]{standalone}',
    '\\usepackage{tikz}',
    '\\usetikzlibrary{arrows.meta}',
    '\\begin{document}',
    sceneToTikz(scene),
    '\\end{document}',
    '',
  ].join('\n');
}
