#!/usr/bin/env node
/**
 * Tokenizer for minified JavaScript bundles.
 *
 * Splits source into tokens that know their kind: string, template, number, ident,
 * punctuator or regex. String / template / comment contents are opaque, so patterns
 * never match inside string literals.
 *
 * Token: { type, value, start, end }
 *   type: 'ws' | 'str' | 'tpl' | 'num' | 'ident' | 'punct' | 'regex' | 'comment'
 *   For 'str' the value is the *decoded* string; for the rest, the raw text.
 */
const PUNCTUATORS = [
  '=>', '>>>=', '...', '===', '===', '!==', '**=', '<<=', '>>=', '>>>', '&&=', '||=', '??=',
  '==', '!=', '<=', '>=', '&&', '||', '??', '?.', '++', '--', '+=', '-=', '*=', '/=', '%=',
  '&=', '|=', '^=', '**', '<<', '>>',
];
const KEYWORDS_BEFORE_REGEX = new Set([
  'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw',
  'case', 'do', 'else', 'yield', 'await',
]);

export function tokenize(src) {
  const tokens = [];
  const n = src.length;
  let i = 0;
  const push = (type, start, end) => {
    const raw = src.slice(start, end);
    tokens.push({ type, value: type === 'str' ? decode(raw) : raw, start, end });
  };
  const lastSignificant = () => {
    for (let k = tokens.length - 1; k >= 0; k--) {
      const t = tokens[k];
      if (t.type !== 'ws' && t.type !== 'comment') return t;
    }
    return null;
  };
  while (i < n) {
    const c = src[i];
    // whitespace & comments
    if (c === ' ' || c === '\n' || c === '\t' || c === '\r') { const s = i; while (i < n && ' \n\t\r'.includes(src[i])) i++; push('ws', s, i); continue; }
    if (c === '/' && src[i + 1] === '/') { const s = i; while (i < n && src[i] !== '\n') i++; push('comment', s, i); continue; }
    if (c === '/' && src[i + 1] === '*') { const s = i; i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; push('comment', s, i); continue; }
    // strings
    if (c === '"' || c === "'") {
      const s = i; i++;
      while (i < n && src[i] !== c) { if (src[i] === '\\') i++; i++; }
      i++;
      push('str', s, i);
      continue;
    }
    if (c === '`') {
      const s = i; i++;
      while (i < n && src[i] !== '`') { if (src[i] === '\\') i++; i++; }
      i++;
      push('tpl', s, i);
      continue;
    }
    // numbers
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1]))) {
      const s = i; i++;
      while (i < n && /[0-9a-fA-FxXoObBeE._]/.test(src[i])) i++;
      push('num', s, i);
      continue;
    }
    // identifiers
    if (/[A-Za-z_$\u00a0-\uffff]/.test(c)) {
      const s = i; i++;
      while (i < n && /[\w$\u00a0-\uffff]/.test(src[i])) i++;
      push('ident', s, i);
      continue;
    }
    // regex or division
    if (c === '/') {
      const prev = lastSignificant();
      const regexOk = !prev || (prev.type === 'punct' && !')]}'.includes(prev.value)) || (prev.type === 'ident' && KEYWORDS_BEFORE_REGEX.has(prev.value));
      if (regexOk) {
        const s = i; i++;
        let inClass = false;
        while (i < n) {
          const ch = src[i];
          if (ch === '\\') { i += 2; continue; }
          if (ch === '[') inClass = true;
          else if (ch === ']') inClass = false;
          else if (ch === '/' && !inClass) break;
          else if (ch === '\n') break;
          i++;
        }
        i++;
        while (i < n && /[a-z]/.test(src[i])) i++;
        push('regex', s, i);
        continue;
      }
      push('punct', i, i + 1); i++;
      continue;
    }
    // punctuators
    let matched = null;
    for (const p of PUNCTUATORS) if (src.startsWith(p, i)) { matched = p; break; }
    if (matched) { push('punct', i, i + matched.length); i += matched.length; continue; }
    push('punct', i, i + 1); i++;
  }
  return tokens;
}

function decode(raw) {
  const inner = raw.slice(1, -1);
  try { return JSON.parse('"' + inner.replace(/\\'/g, "'").replace(/"/g, '\\"').replace(/\\\\"/g, '\\"') + '"'); }
  catch { return inner; }
}

/** Significant tokens only. */
export function significant(tokens) {
  return tokens.filter(t => t.type !== 'ws' && t.type !== 'comment');
}

/** Find matching closer for an opener at index k (over significant tokens). */
export function matchClose(sig, k) {
  // Works on either significant-only tokens or a full token stream (ws kept).
  const toks = sig.filter((t) => t.type !== 'comment');
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const nextSig = (n) => { while (toks[n] && toks[n].type === 'ws') n++; return n; };
  const i0 = nextSig(k);
  const open = toks[i0]?.value;
  const close = pairs[open];
  if (!close) return -1;
  let depth = 0;
  for (let i = i0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type === 'ws' || t.type !== 'punct') continue;
    if (t.value === open) depth++;
    else if (t.value === close) { depth--; if (depth === 0) return i; }
  }
  return -1;
}
