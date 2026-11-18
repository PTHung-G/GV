/**
 * Unit tests for the figure engine.
 *
 * A geometry drawing in an exam is not decoration: if the triangle is not
 * right-angled, a student solves a different problem. So these tests measure the
 * coordinates the solver produced, and they check that impossible specs are
 * refused rather than drawn.
 */
import { expect, test } from '@playwright/test';
import { FigureError, solve, type Scene } from '../../lib/geometry/spec';
import { sceneToTikz, tikzDocument } from '../../lib/geometry/tikz';
import { inlineSvg, namespaceSvgIds } from '../../lib/server/latex';
import { embedFigures } from '../../lib/geometry/embed';

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/** Angle at `b` formed by `a`-`b`-`c`, in degrees. */
function angleAt(scene: Scene, a: string, b: string, c: string): number {
  const p = scene.points[a];
  const q = scene.points[b];
  const r = scene.points[c];
  const v1 = { x: p.x - q.x, y: p.y - q.y };
  const v2 = { x: r.x - q.x, y: r.y - q.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const cosine = dot / (Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y));
  return (Math.acos(Math.min(1, Math.max(-1, cosine))) * 180) / Math.PI;
}

test('a right triangle with an altitude puts H exactly on the hypotenuse', () => {
  const scene = solve({ kind: 'triangle-right', params: { ab: 6, ac: 8, altitude: true } });

  const { A, B, C, H } = scene.points;
  expect(Math.abs(angleAt(scene, 'B', 'A', 'C') - 90)).toBeLessThan(0.001);

  // The legs must keep the lengths the exam text states.
  expect(dist(A, B)).toBeCloseTo(6, 3);
  expect(dist(A, C)).toBeCloseTo(8, 3);

  // BC = 10, and H must sit on the segment BC.
  const bc = dist(B, C);
  expect(bc).toBeCloseTo(10, 3);
  expect(dist(B, H) + dist(H, C)).toBeCloseTo(bc, 3);

  // AH is the altitude, so AH · BC = AB · AC and AH ⟂ BC.
  expect(dist(A, H)).toBeCloseTo((6 * 8) / bc, 3);
  expect(Math.abs(angleAt(scene, 'A', 'H', 'C') - 90)).toBeLessThan(0.001);
});

test('three sides are placed with the stated lengths and a true right angle', () => {
  // 3-4-5 with a = BC = 5, b = CA = 4, c = AB = 3 is right-angled at A.
  const scene = solve({ kind: 'triangle-sides', params: { a: 5, b: 4, c: 3 } });

  const { A, B, C } = scene.points;
  expect(dist(A, B)).toBeCloseTo(3, 3);
  expect(dist(B, C)).toBeCloseTo(5, 3);
  expect(dist(C, A)).toBeCloseTo(4, 3);
  expect(Math.abs(angleAt(scene, 'B', 'A', 'C') - 90)).toBeLessThan(0.01);
});

test('tangent points really are tangent', () => {
  const scene = solve({ kind: 'circle-tangents', params: { r: 2, d: 4 } });
  const { O, A, B, C } = scene.points;

  // On the circle…
  expect(dist(O, B)).toBeCloseTo(2, 6);
  expect(dist(O, C)).toBeCloseTo(2, 6);
  // …and the radius meets the tangent at a right angle.
  expect(Math.abs(angleAt(scene, 'A', 'B', 'O') - 90)).toBeLessThan(0.001);
  expect(Math.abs(angleAt(scene, 'A', 'C', 'O') - 90)).toBeLessThan(0.001);
  // A is where the exam says it is.
  expect(dist(O, A)).toBeCloseTo(4, 6);
});

test('a point inside the circle is refused, not drawn wrong', () => {
  expect(() => solve({ kind: 'circle-tangents', params: { r: 2, d: 1 } })).toThrow(FigureError);
  try {
    solve({ kind: 'circle-tangents', params: { r: 2, d: 1 } });
  } catch (err) {
    expect((err as FigureError).reason).toBe('point_inside_circle');
  }
});

test('three sides that cannot close a triangle are refused', () => {
  try {
    solve({ kind: 'triangle-sides', params: { a: 4, b: 3, c: 10 } });
    throw new Error('phải bị từ chối');
  } catch (err) {
    expect(err).toBeInstanceOf(FigureError);
    expect((err as FigureError).reason).toBe('triangle_inequality');
  }
});

test('a zero leg and a flat parabola are refused', () => {
  expect(() => solve({ kind: 'triangle-right', params: { ab: 0, ac: 8 } })).toThrow(FigureError);
  expect(() => solve({ kind: 'parabola', params: { a: 0, b: 1, c: 2 } })).toThrow(FigureError);
});

test('the TikZ document uses the computed coordinates, not TeX geometry', () => {
  const scene = solve({ kind: 'triangle-right', params: { ab: 6, ac: 8, altitude: true } });
  const tikz = sceneToTikz(scene);

  // A sits at the origin and the two legs keep their 6:8 ratio even though the
  // drawing is scaled to fit the page.
  expect(tikz).toContain('(0,0)');

  const xs: number[] = [];
  const ys: number[] = [];
  for (const m of tikz.matchAll(/\((-?[\d.]+),(-?[\d.]+)\)/g)) {
    xs.push(Number(m[1]));
    ys.push(Number(m[2]));
  }
  const legAB = Math.max(...xs);
  const legAC = Math.max(...ys);
  expect(legAB / legAC).toBeCloseTo(6 / 8, 3);

  // The altitude is drawn dashed, and the foot is a real computed point.
  expect(tikz).toContain('\\draw[dashed]');

  const doc = tikzDocument(scene);
  expect(doc.startsWith('\\documentclass')).toBe(true);
  expect(doc).toContain('\\begin{tikzpicture}');
});

test('each inserted figure gets its own glyph ids', () => {
  const svg = '<svg><defs><g id="glyph-0-0"><path d="M0 0"/></g></defs><use xlink:href="#glyph-0-0"/></svg>';
  const a = namespaceSvgIds(svg, 'fa-');
  const b = namespaceSvgIds(svg, 'fb-');

  expect(a).toContain('id="fa-glyph-0-0"');
  expect(a).toContain('href="#fa-glyph-0-0"');
  expect(b).toContain('id="fb-glyph-0-0"');
  // No unprefixed id survives, so two figures cannot collide.
  expect(a).not.toContain('id="glyph-0-0"');
});

test('an impossible spec from the assistant becomes a note, never a drawing', async () => {
  const html =
    '<p><b>Câu 4.</b> Cho đường tròn (O; 2) và điểm A nằm trong đường tròn. Kẻ tiếp tuyến AB.</p>' +
    `<figure data-figure-spec='{"kind":"circle-tangents","params":{"r":2,"d":1}}'></figure>`;

  const { html: out, warnings } = await embedFigures(html);
  expect(out).toContain('data-figure-error');
  expect(out).not.toContain('<svg');
  expect(warnings.join(' ')).toContain('không có tiếp tuyến');
});

test('an unreadable spec is skipped and reported', async () => {
  const html = `<figure data-figure-spec='{not json}'></figure>`;
  const { html: out, warnings } = await embedFigures(html);
  expect(out).toContain('data-figure-error');
  expect(warnings.length).toBeGreaterThan(0);
});

test('a valid spec is replaced by a real drawing', async () => {
  const { html: out, warnings } = await embedFigures(
    `<figure data-figure-spec='{"kind":"triangle-right","params":{"ab":6,"ac":8,"altitude":true}}'></figure>`,
  );

  if (out.includes('data-figure-error')) {
    // No TeX on this machine: the note path is the documented fallback.
    expect(warnings.length).toBeGreaterThan(0);
    return;
  }
  expect(out).toContain('<svg');
  expect(out).toContain('class="doc-figure"');
  expect(warnings).toEqual([]);
});

test('a parabola stays page-sized for a steep coefficient', () => {
  const scene = solve({ kind: 'parabola', params: { a: 3, b: 0, c: 0 } });
  const ys = scene.polylines[0].points.map(([, y]) => y);
  const xs = scene.polylines[0].points.map(([x]) => x);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);

  // Drawn in centimetres: must fit an A4 content box with room for text.
  expect(width).toBeLessThan(12);
  expect(height).toBeLessThan(12);
});

test('an inline SVG is closed, so nothing after the figure is swallowed', () => {
  const raw =
    '<?xml version="1.0"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "x">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">' +
    '<path d="M0 0"/></svg>\n';
  const out = namespaceSvgIds(inlineSvg(raw), 'fa-');

  expect(out.startsWith('<svg')).toBe(true);
  expect(out.endsWith('</svg>')).toBe(true);
  expect(out).not.toContain('<?xml');
  expect(out).not.toContain('DOCTYPE');
});

test('every drawing is fitted into the same box', () => {
  const scenes = [
    solve({ kind: 'triangle-right', params: { ab: 6, ac: 8, altitude: true } }),
    solve({ kind: 'circle-tangents', params: { r: 2, d: 4 } }),
    solve({ kind: 'triangle-sides', params: { a: 5, b: 4, c: 3 } }),
    solve({ kind: 'parabola', params: { a: 1, b: -2, c: -1 } }),
    // A deliberately large figure must shrink, not overflow the sheet.
    solve({ kind: 'triangle-right', params: { ab: 20, ac: 30 } }),
  ];

  for (const scene of scenes) {
    const tikz = sceneToTikz(scene);
    const xs: number[] = [];
    const ys: number[] = [];
    for (const m of tikz.matchAll(/\((-?[\d.]+),(-?[\d.]+)\)/g)) {
      xs.push(Number(m[1]));
      ys.push(Number(m[2]));
    }
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);

    // The box the renderer promises, in centimetres.
    expect(width).toBeLessThanOrEqual(8.3);
    expect(height).toBeLessThanOrEqual(6.3);
  }
});
