#!/usr/bin/env node
/**
 * Rebuild readable ES modules from Turbopack chunks.
 *
 * A chunk looks like:
 *   (globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?...void 0,
 *     146480, (e,n,t)=>{...},
 *     247167, (e)=>{...},
 *     ...])
 *
 * For every (id, factory) pair we emit source-mirror/extracted/modules/<chunk>__<id>.ts with:
 *   - `e.i(N)` / `e.r(N)` dependency reads rewritten to the local alias `m<N>`
 *   - `e.s([...])` export registrations turned into real `export { local as "Name" }`
 *   - chunk-local facet declarations (`var a,b,c;`) dropped
 *
 * Token indices stay consistent because every helper works on ONE token array per
 * source string (comments removed, whitespace kept) and uses `sig()` to skip ws.
 */
import fs from 'node:fs';
import path from 'node:path';
import { tokenize } from './jstokens.mjs';

const PAIRS = { '(': ')', '[': ']', '{': '}' };

export function sig(toks, k) {
  while (toks[k] && (toks[k].type === 'ws' || toks[k].type === 'comment')) k++;
  while (toks[k]?.type === 'ws') k++;
  return k;
}

/** Previous non-ws token index before k. */
export function sigBack(toks, k) {
  let j = k - 1;
  while (j >= 0 && (toks[j].type === 'ws' || toks[j].type === 'comment')) j--;
  return j;
}

export function closeOf(toks, k) {
  const i0 = sig(toks, k);
  const open = toks[i0]?.value;
  const close = PAIRS[open];
  if (!close) return -1;
  let depth = 0;
  for (let i = i0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type !== 'punct') continue;
    if (t.value === open) depth++;
    else if (t.value === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

export const toksOf = (src) => tokenize(src).filter((t) => t.type !== 'comment');

/** Split a chunk into its top-level push-payload entries (source slices). */
export function splitChunk(src) {
  const toks = toksOf(src);
  let k = -1;
  for (let i = 0; i < toks.length; i++) {
    if (toks[i].type === 'ident' && toks[i].value === 'push' && toks[i + 1]?.value === '(' && toks[i + 2]?.value === '[') {
      k = i + 2;
      break;
    }
  }
  if (k < 0) return [];
  const end = closeOf(toks, k);
  if (end < 0) return [];
  const entries = [];
  let first = k + 1;
  const stack = [];
  for (let i = k + 1; i <= end; i++) {
    const t = toks[i];
    if (i < end && t.type === 'punct') {
      if ('([{'.includes(t.value)) stack.push(t.value);
      else if (')]}'.includes(t.value)) stack.pop();
      if (t.value === ',' && stack.length === 0) {
        entries.push(src.slice(toks[first].start, t.start).trim());
        first = i + 1;
        continue;
      }
    }
  }
  if (first < end) entries.push(src.slice(toks[first].start, toks[end - 1].end).trim());
  if (entries.length && /^"object"\s*==\s*typeof\s+document/.test(entries[0])) entries.shift();
  return entries;
}

/** Bounds of a factory's body `{ ... }` inside its source slice. */
export function bodyBounds(src) {
  const toks = toksOf(src);
  let i = sig(toks, 0);
  if (toks[i]?.value === 'async') i = sig(toks, i + 1);
  if (toks[i]?.value === '(') {
    const c = closeOf(toks, i);
    if (c < 0) return null;
    i = sig(toks, c + 1);
  }
  else if (toks[i]?.type === 'ident') i = sig(toks, i + 1);
  else return null;
  if (toks[i]?.value !== '=>') return null;
  i = sig(toks, i + 1);
  if (toks[i]?.value !== '{') return null;
  const close = closeOf(toks, i);
  if (close < 0) return null;
  return { openStart: toks[i].start, openEnd: toks[i].end, closeStart: toks[close].start };
}

/** Rewrite a factory body. */
export function rewrite(body) {
  const toks = toksOf(body);
  const edits = [];
  const exports = [];
  const deps = new Set();
  const edit = (start, end, text) => edits.push({ start, end, text });

  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type !== 'ident' || t.value !== 'e') continue;
    const prev = toks[sigBack(toks, i)];
    const dot = sig(toks, i + 1);
    if (prev?.value === '.' || toks[dot]?.value !== '.') continue;
    const member = toks[sig(toks, dot + 1)];
    const call = sig(toks, sig(toks, dot + 1) + 1);
    if (toks[call]?.value !== '(') continue;
    const close = closeOf(toks, call);
    if (close < 0) continue;
    const a = sig(toks, call + 1);
    const z = sig(toks, close - 1);
    const argSrc = body.slice(toks[a]?.start, toks[z]?.end);

    if (member?.value === 'i' || member?.value === 'r') {
      deps.add(argSrc);
      edit(t.start, toks[close].end, `m${argSrc}`);
      i = close;
      continue;
    }
    if (member?.value === 'x') {
      edit(t.start, toks[close].end, argSrc);
      i = close;
      continue;
    }
    if (member?.value === 's') {
      const first = sig(toks, call + 1);
      if (toks[first]?.value === '[') {
        const arrClose = closeOf(toks, first);
        const items = [];
        const stack = [];
        let cur = [];
        for (let j = first + 1; j < arrClose; j++) {
          const x = toks[j];
          if (x.type === 'ws') continue;
          if (x.type === 'punct') {
            if ('([{'.includes(x.value)) stack.push(x.value);
            else if (')]}'.includes(x.value)) stack.pop();
            if (x.value === ',' && stack.length === 0) {
              items.push(cur);
              cur = [];
              continue;
            }
          }
          cur.push(x);
        }
        if (cur.length) items.push(cur);
        // registrations are flat triples: "Name", 0, <value>
        for (let j = 0; j + 2 <= items.length - 1; j += 3) {
          const nameTok = items[j];
          if (nameTok.length === 1 && nameTok[0].type === 'str') {
            const val = items[j + 2];
            const valueSrc = body.slice(val[0].start, val[val.length - 1].end);
            exports.push({ name: nameTok[0].value, valueSrc: valueSrc.replace(/\s+/g, ' ') });
          }
        }
      }
      edit(t.start, toks[close].end, '');
      i = close;
    }
  }

  if (exports.length && toks[0]?.value === 'use') {
    // keep "use strict" prologue clean
  }

  // Drop chunk-local facet declarations: var a,b,c;  /  let x,y,z;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type !== 'ident' || !['var', 'let', 'const'].includes(t.value)) continue;
    let j = sig(toks, i + 1);
    const names = [];
    let ok = true;
    while (toks[j]?.type === 'ident') {
      if (toks[j].value.length !== 1) {
        ok = false;
        break;
      }
      names.push(toks[j]);
      const n = sig(toks, j + 1);
      if (toks[n]?.value === ',') {
        j = sig(toks, n + 1);
        continue;
      }
      j = n;
      break;
    }
    if (ok && names.length && toks[j]?.value === ';') edit(t.start, toks[j].end, '');
  }

  edits.sort((x, y) => x.start - y.start);
  let out = '';
  let pos = 0;
  for (const e of edits) {
    if (e.start < pos) continue;
    out += body.slice(pos, e.start) + e.text;
    pos = e.end;
  }
  out += body.slice(pos);
  return { code: out.trim(), exports, deps: [...deps] };
}

export function renderModule({ id, chunk, rw }) {
  const header = [
    `// Reconstructed from ${chunk}.js, module ${id}.`,
    `// deps: ${rw.deps.map((d) => `m${d}`).join(', ') || 'none'}`,
    `// exports: ${rw.exports.map((e) => e.name).join(', ') || 'none'}`,
    '',
  ].join('\n');
  const exportsSrc = rw.exports
    .map(({ name, valueSrc }) =>
      valueSrc === '0' ? `// ${name}: anonymous registration` : `export { ${valueSrc} as ${JSON.stringify(name)} };`)
    .join('\n');
  return `${header}${exportsSrc}\n\n${rw.code}\n`;
}

async function main() {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const chunksDir = path.join(root, 'source-mirror/js');
  const outDir = path.join(root, 'source-mirror/extracted');
  const mods = path.join(outDir, 'modules');
  fs.mkdirSync(mods, { recursive: true });
  const index = {};
  let ok = 0;
  let bad = 0;
  const files = fs.readdirSync(chunksDir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const chunk = file.replace(/\.js$/, '');
    const src = fs.readFileSync(path.join(chunksDir, file), 'utf8');
    const entries = splitChunk(src);
    const list = [];
    for (let k = 0; k + 1 < entries.length; k += 2) {
      const id = entries[k];
      if (!/^\d+$/.test(id)) continue;
      const b = bodyBounds(entries[k + 1]);
      if (!b) {
        bad++;
        list.push({ id, error: 'factory-parse' });
        continue;
      }
      const body = entries[k + 1].slice(b.openEnd, b.closeStart);
      const rw = rewrite(body);
      const name = `${chunk}__${id}.ts`;
      fs.writeFileSync(path.join(mods, name), renderModule({ id, chunk, rw }));
      ok++;
      list.push({
        id,
        file: name,
        exports: rw.exports.map((e) => e.name),
        deps: rw.deps,
        bytes: rw.code.length,
        strings: [...new Set(rw.code.match(/"(?:[^"\\]|\\.){4,}"/g) || [])]
          .map((s) => { try { return JSON.parse(s); } catch { return null; } })
          .filter(Boolean),
      });
    }
    index[chunk] = list;
  }
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 1));
  console.log(`chunks=${files.length} modules=${ok} failed=${bad}`);
}

if (process.argv[1] && process.argv[1].endsWith('extract-modules.mjs')) main();
