/**
 * Math rendering — isomorphic across browser and Node.js.
 *
 * The document stores LaTeX (`$...$` inline, `$$...$$` display), and KaTeX turns
 * it into MathML at render time. Using `parse5` lets server-side exam release
 * rendering and client-side editing share the exact same DOM-free pipeline.
 */
import katex from 'katex';
import { parseFragment, serialize, type DefaultTreeAdapterMap } from 'parse5';

type ChildNode = DefaultTreeAdapterMap['childNode'];
type ParentNode = DefaultTreeAdapterMap['parentNode'];
type Element = DefaultTreeAdapterMap['element'];
type TextNode = DefaultTreeAdapterMap['textNode'];

export type MathSegment =
  | { type: 'text'; value: string }
  | { type: 'math'; latex: string; display: boolean };

const MATH_HINT = /[\\^_=+\-*/<>(){}[\]|]/;
const CURRENCY_PROSE = /^\d[\d,.]*(?:\s+[A-Za-zÀ-ỹ])/u;

/** Splits text into prose and math runs. Handles escapes and guards bare currency `$`. */
export function splitMath(input: string): MathSegment[] {
  const out: MathSegment[] = [];
  let buffer = '';
  let i = 0;

  const flush = () => {
    if (buffer) out.push({ type: 'text', value: buffer });
    buffer = '';
  };

  while (i < input.length) {
    if (input[i] === '\\' && input[i + 1] === '$') {
      buffer += '$';
      i += 2;
      continue;
    }
    if (input[i] === '$') {
      const display = input[i + 1] === '$';
      const open = display ? 2 : 1;
      let j = i + open;
      while (j < input.length) {
        if (input[j] === '\\') {
          j += 2;
          continue;
        }
        if (display ? input.startsWith('$$', j) : input[j] === '$') break;
        j++;
      }
      if (j < input.length) {
        const raw = input.slice(i + open, j);
        const looksLikeCurrencyProse =
          !display &&
          raw.trim().length > 0 &&
          (raw.includes('\n\n') || (CURRENCY_PROSE.test(raw.trim()) && !MATH_HINT.test(raw)));
        if (!looksLikeCurrencyProse && raw.length > 0) {
          flush();
          out.push({ type: 'math', latex: raw, display });
          i = j + open;
          continue;
        }
      }
    }
    buffer += input[i];
    i++;
  }
  flush();
  return out;
}

/** Same options the editor uses; never throws on malformed LaTeX. */
export function renderMath(latex: string, display = false): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: display,
      output: 'mathml',
      strict: 'ignore',
    });
  } catch {
    return escapeHtml(latex);
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SKIP_TAGS = new Set(['math', 'svg', 'script', 'style', 'code', 'pre', 'textarea']);

function isElement(node: ChildNode): node is Element {
  return 'tagName' in node;
}

function isTextNode(node: ChildNode): node is TextNode {
  return node.nodeName === '#text';
}

function hasDocMathClass(el: Element): boolean {
  const cls = el.attrs?.find((a) => a.name.toLowerCase() === 'class')?.value ?? '';
  return /\bdoc-math\b/.test(cls);
}

function walkAndRenderMath(parent: ParentNode): void {
  if (!('childNodes' in parent) || !Array.isArray(parent.childNodes)) return;

  const nextChildren: ChildNode[] = [];
  for (const child of parent.childNodes) {
    if (isTextNode(child)) {
      if (!child.value.includes('$')) {
        nextChildren.push(child);
        continue;
      }
      const segments = splitMath(child.value);
      if (!segments.some((seg) => seg.type === 'math')) {
        nextChildren.push(child);
        continue;
      }
      const html = segments
        .map((seg) => {
          if (seg.type === 'text') return escapeHtml(seg.value);
          const cls = seg.display ? 'doc-math doc-math-display' : 'doc-math';
          const source = seg.display ? `$$${seg.latex}$$` : `$${seg.latex}$`;
          return `<span class="${cls}" contenteditable="false" data-latex="${escapeHtml(source)}">${renderMath(seg.latex, seg.display)}</span>`;
        })
        .join('');
      const parsed = parseFragment(html);
      for (const node of parsed.childNodes) {
        if ('parentNode' in node) node.parentNode = parent;
        nextChildren.push(node);
      }
      continue;
    }

    if (isElement(child)) {
      const tag = child.tagName.toLowerCase();
      if (!SKIP_TAGS.has(tag) && !hasDocMathClass(child)) {
        walkAndRenderMath(child);
      }
    }
    nextChildren.push(child);
  }
  parent.childNodes = nextChildren;
}

/**
 * `$...$` -> inline MathML, `$$...$$` -> display MathML.
 * Works identically in Node.js (SSR/API) and the browser without DOM globals.
 */
export function renderMathInHtml(html: string): string {
  if (!html.includes('$')) return html;
  const fragment = parseFragment(html);
  walkAndRenderMath(fragment);
  return serialize(fragment);
}
