/**
 * Keeps the palette honest.
 *
 * The interface must take every colour from the tokens declared in
 * `app/globals.css`; a hex value written straight into a component is how the
 * old design drifted into 66 near-duplicate greys and a purple tint.
 */
import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['app', 'components'];

/** Third-party marks and document content keep their own colours. */
const ALLOWED_VALUES = new Set([
  '#4285f4', // Google mark
  '#34a853',
  '#fbbc05',
  '#ea4335',
  '#c4342d', // document text colour a teacher can pick
  '#fdecc8', // document highlight
  '#f1eef7', // document shading
  '#ffffff', // declared once for the browser chrome in layout.tsx
]);

const ALLOWED_FILES = new Set(['app/globals.css', 'app/layout.tsx']);

function walk(dir: string, found: string[] = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, found);
    else if (/\.(tsx?|css)$/.test(entry)) found.push(full);
  }
  return found;
}

test('every colour comes from a token', () => {
  const offenders: string[] = [];

  for (const root of ROOTS) {
    for (const file of walk(root)) {
      const normalised = file.replace(/\\/g, '/');
      if (ALLOWED_FILES.has(normalised)) continue;

      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
        if (ALLOWED_VALUES.has(match[0].toLowerCase())) continue;
        const line = source.slice(0, match.index).split('\n').length;
        offenders.push(`${normalised}:${line} ${match[0]}`);
      }
    }
  }

  expect(offenders, `hard-coded colours:\n${offenders.join('\n')}`).toEqual([]);
});

test('the palette stays neutral: no purple, one accent', () => {
  const css = readFileSync('app/globals.css', 'utf8');
  const declared = [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)];

  // A purple would show as blue clearly above green in its channels.
  const purple = declared.filter(([, , hex]) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return b - g > 30 && r > g + 10 && b > 120;
  });
  expect(purple.map(([, name]) => name)).toEqual([]);

  expect(declared.some(([, name]) => name === 'accent')).toBe(true);
});

test('corner radii stay within three steps', () => {
  const steps = new Set<string>();
  for (const root of ROOTS) {
    for (const file of walk(root)) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/\brounded(?:-[trblse]{1,2})?-(3xl|2xl|xl|lg|md|sm)\b/g)) {
        steps.add(match[1]);
      }
    }
  }
  expect([...steps].sort()).toEqual(['lg', 'md', 'sm']);
});

test('no borrowed Tailwind palette colours', () => {
  // `text-neutral-700` is as much a hard-coded colour as `#17171a`; the hex
  // guard above cannot see it, so it gets its own check.
  const borrowed = /(?<![\w-])(?:text|bg|border|ring|fill|stroke|divide|placeholder|from|via|to)-(?:neutral|gray|zinc|slate|stone|indigo|violet|purple|fuchsia)(?:-\d{2,3})?\b/g;
  const offenders: string[] = [];

  for (const root of ROOTS) {
    for (const file of walk(root)) {
      const normalised = file.replace(/\\/g, '/');
      if (ALLOWED_FILES.has(normalised)) continue;
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(borrowed)) {
        const line = source.slice(0, match.index).split('\n').length;
        offenders.push(`${normalised}:${line} ${match[0]}`);
      }
    }
  }
  expect(offenders, `borrowed palette colours:\n${offenders.join('\n')}`).toEqual([]);
});
