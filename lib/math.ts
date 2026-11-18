/**
 * Math rendering — mirrors how the original renders formulas.
 *
 * Source (js/12q7obohwerum.js, the Tiptap `math` node view):
 *
 *   const latex = String(node.attrs.latex ?? '')
 *   katex.renderToString(latex, {
 *     throwOnError: false,
 *     displayMode: !!node.attrs.display,
 *     output: 'mathml',
 *     strict: 'ignore',
 *   })
 *   -> <span className="doc-math" | "doc-math doc-math-display">
 *
 * So the document stores LaTeX, and KaTeX turns it into MathML at render time.
 * We keep the same convention: `$...$` inline, `$$...$$` display.
 */
import katex from 'katex';

export type MathSegment =
  | { type: 'text'; value: string }
  | { type: 'math'; latex: string; display: boolean };

/** Splits text into prose and math runs. Handles escapes and nested braces. */
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
        flush();
        out.push({ type: 'math', latex: input.slice(i + open, j), display });
        i = j + open;
        continue;
      }
    }
    buffer += input[i];
    i++;
  }
  flush();
  return out;
}

/** Same options the original passes; never throws on bad LaTeX. */
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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * `$...$` -> inline MathML, `$$...$$` -> display MathML.
 * Text outside math is left untouched (HTML tags are preserved).
 */
export function renderMathInHtml(html: string): string {
  if (!html.includes('$')) return html;

  // Work on text nodes only. Splitting on /<[^>]+>/ would mistake the entities
  // `&gt;` / `&lt;` for tag delimiters and corrupt them.
  const container = document.createElement('div');
  container.innerHTML = html;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const value = node.nodeValue ?? '';
    if (!value.includes('$')) continue;
    const frag = document.createDocumentFragment();
    for (const seg of splitMath(value)) {
      if (seg.type === 'text') {
        frag.appendChild(document.createTextNode(seg.value));
      } else {
        const span = document.createElement('span');
        span.className = seg.display ? 'doc-math doc-math-display' : 'doc-math';
        span.dataset.latex = seg.display ? `$$${seg.latex}$$` : `$${seg.latex}$`;
        span.innerHTML = renderMath(seg.latex, seg.display);
        frag.appendChild(span);
      }
    }
    node.parentNode?.replaceChild(frag, node);
  }
  return container.innerHTML;
}
