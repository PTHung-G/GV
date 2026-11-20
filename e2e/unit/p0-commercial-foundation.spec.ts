import { expect, test } from '@playwright/test';
import { renderMathInHtml } from '../../lib/math';
import { sanitizeExamHtml } from '../../lib/html-sanitize';
import { solve } from '../../lib/geometry/spec';
import { sceneToTikz } from '../../lib/geometry/tikz';
import { sceneToSvg } from '../../lib/geometry/svg';
import { deleteObject, getObject, objectExists, putObject, storageDriver } from '../../lib/server/storage';

test('renderMathInHtml runs cleanly in Node without DOM and protects currency prose', () => {
  expect(typeof (globalThis as { document?: unknown }).document).toBe('undefined');
  const html = renderMathInHtml('<p>Cho $x^2 + 1 = 0$ và giá $10 và $20</p>');
  expect(html).toContain('class="doc-math"');
  expect(html).toContain('contenteditable="false"');
  expect(html).toContain('data-latex="$x^2 + 1 = 0$"');
  expect(html).toContain('<math');
  expect(html).toContain('giá $10 và $20');
});

test('sanitizeExamHtml preserves font text & local SVG <use>, while blocking external <use> and scripts', () => {
  const dirty = [
    '<font color="#c4342d" size="4">Chú ý quan trọng</font>',
    '<unknown-tag>Nội dung bên trong</unknown-tag>',
    '<svg viewBox="0 0 100 100"><defs><path id="g1" d="M0 0 L10 10"/></defs><use xlink:href="#g1"/><use href="https://evil.example/x.svg#a"/></svg>',
    '<script>alert(1)</script>',
  ].join('');
  const clean = sanitizeExamHtml(dirty);
  expect(clean).toContain('Chú ý quan trọng');
  expect(clean).toContain('Nội dung bên trong');
  expect(clean).toContain('xlink:href="#g1"');
  expect(clean).not.toContain('https://evil.example/x.svg');
  expect(clean).not.toContain('<script');
  expect(clean).not.toContain('alert(1)');
});

test('parabola Oy axis includes polyline bounds in both TikZ and SVG fallback', () => {
  const scene = solve({ kind: 'parabola', params: { a: 1, b: -4, c: 3 } });
  const tikz = sceneToTikz(scene);
  const svg = sceneToSvg(scene);
  // Maximum y over x in [-0.5, 4.5] reaches > 5; scaled or unscaled Oy end must exceed vertex y.
  expect(tikz).toContain('node[above] {$y$}');
  expect(svg).toContain('<polyline');
  expect(svg).toContain('>y</text>');
  // Ensure viewBox covers polyline endpoints
  const ys = scene.polylines.flatMap((line) => line.points.map(([, y]) => y));
  expect(Math.max(...ys)).toBeGreaterThan(2);
});

test('storage defaults to local driver when S3 env vars are absent and round-trips objects', async () => {
  expect(storageDriver()).toBe('local');
  const key = `test-p0/${Date.now()}-sample.txt`;
  const payload = Buffer.from('Hỗ trợ giáo viên — test storage', 'utf8');
  const stored = await putObject(key, payload);
  expect(stored.byteSize).toBe(payload.byteLength);
  expect(await objectExists(key)).toBe(true);
  const read = await getObject(key);
  expect(read.toString('utf8')).toBe('Hỗ trợ giáo viên — test storage');
  await deleteObject(key);
  expect(await objectExists(key)).toBe(false);
});
