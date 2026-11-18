import type { AnswerKeyQuestion } from './grading/rubric';
import { examContentHash } from './exam-revision';
import { renderMathInHtml } from './math';

export type ExportSnapshot = {
  sourceExamId?: string;
  title: string;
  content: string;
  subject?: string;
  capturedAt?: string;
  answerKey?: { content: string; sourceContentHash?: string; answerKeyQuestions?: AnswerKeyQuestion[] };
};

export function exportKeyStatus(snapshot: ExportSnapshot): 'missing' | 'unverified' | 'stale' | 'current' {
  if (!snapshot.answerKey) return 'missing';
  if (!snapshot.answerKey.sourceContentHash) return 'unverified';
  return snapshot.answerKey.sourceContentHash === examContentHash(snapshot.content) ? 'current' : 'stale';
}

/** Only single A–D answers are recognized: true/false and essays must never become MC silently. */
export function exportMcNumbers(questions: AnswerKeyQuestion[]): number[] {
  const numbers = questions.flatMap((q, index) => {
    if (q.type === 'essay' || q.steps?.length || !/^[A-D]$/i.test(q.answer.trim())) return [];
    return [Number(/\d+/.exec(q.label)?.[0] ?? index + 1)];
  });
  if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 999) || new Set(numbers).size !== numbers.length) return [];
  return numbers;
}

const TAGS = new Set('svg g path line polyline polygon rect circle ellipse text tspan defs marker clippath use p div span br h1 h2 h3 h4 h5 h6 strong b em i u s sub sup ul ol li table thead tbody tfoot tr th td colgroup col blockquote hr figure figcaption img a math semantics mrow mi mn mo mtext mspace mfrac msqrt mroot msup msub msubsup mover munder munderover mtable mtr mtd annotation menclose mpadded mstyle'.split(' '));
const ATTRS = new Set('class id viewbox xmlns d x y x1 y1 x2 y2 cx cy r rx ry points fill stroke stroke-width stroke-dasharray stroke-linecap stroke-linejoin transform text-anchor dominant-baseline markerwidth markerheight refx refy orient markerunits preserveaspectratio colspan rowspan width height alt display mathvariant encoding columnalign rowspacing columnspacing stretchy fence separator accent accentunder notation scriptlevel data-page-break data-columns'.split(' '));
const SAFE_STYLES = new Set('text-align font-size font-family font-weight font-style text-decoration line-height vertical-align grid-template-columns column-gap row-gap --header-columns --header-space-after --header-line-height --header-column-gap'.split(' '));

/** Browser-only strict allowlist: no scripts, event handlers, frames, active URLs or raw CSS. */
export function safeExportHtml(content: string): string {
  const template = document.createElement('template');
  template.innerHTML = renderMathInHtml(content);
  const clean = (node: Element) => {
    if (!TAGS.has(node.tagName.toLowerCase())) { node.remove(); return; }
    for (const attr of [...node.attributes]) {
      if (attr.name === 'style') {
        const parsed = document.createElement('span'); parsed.setAttribute('style', attr.value);
        const safe: string[] = [];
        for (const name of [...parsed.style]) {
          const value = parsed.style.getPropertyValue(name);
          if (SAFE_STYLES.has(name) && !/url\s*\(|expression|[<>@\\]/i.test(value)) safe.push(`${name}:${value}`);
        }
        if (safe.length) node.setAttribute('style', safe.join(';')); else node.removeAttribute('style');
        continue;
      }
      if (node.tagName.toLowerCase() === 'img' && attr.name === 'src') {
        try {
          const url = new URL(attr.value, location.origin);
          if ((url.origin === location.origin && /^https?:$/.test(url.protocol)) || /^data:image\/(png|jpeg|gif|webp);base64,/i.test(attr.value)) {
            node.setAttribute('src', url.href); continue;
          }
        } catch { /* remove invalid URLs */ }
      }
      if (!ATTRS.has(attr.name.toLowerCase())) node.removeAttribute(attr.name);
    }
    for (const child of [...node.children]) clean(child);
  };
  for (const child of [...template.content.children]) clean(child);
  return template.innerHTML;
}

export function exportPrintHtml(title: string, content: string): string {
  const heading = document.createElement('span'); heading.textContent = title;
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${heading.innerHTML}</title><style>
@page{size:A4;margin:18mm 16mm}*{box-sizing:border-box}body{margin:0;background:#fff;color:#000;font:13pt/1.5 'Times New Roman',serif}h1{text-align:center;font-size:18pt}h2{font-size:15pt}h3{font-size:14pt}p{margin:.35em 0}img{max-width:100%;max-height:240mm;object-fit:contain}table{border-collapse:collapse;width:100%;margin:.5em 0}td,th{border:1px solid #777;padding:4px 8px;vertical-align:top}tr,figure{break-inside:avoid}ul,ol{padding-left:1.5em}.page-break,[data-page-break]{break-after:page;height:0}.doc-math-display{display:block;text-align:center;margin:.4em 0}.option-grid,.options-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.doc-header{display:grid;grid-template-columns:var(--header-columns,1fr 1.4fr);align-items:start;padding-bottom:var(--header-space-after,6px)}.doc-header-col{min-width:0;line-height:var(--header-line-height,1.45)}.doc-header-col:first-child{padding-right:var(--header-column-gap,12px)}.doc-header-col p:not([style*='text-align']){text-align:center}.doc-grid{display:grid;column-gap:12px;break-inside:avoid}.doc-grid[data-columns='2']{grid-template-columns:repeat(2,minmax(0,1fr))}.doc-grid[data-columns='4']{grid-template-columns:repeat(4,minmax(0,1fr))}.doc-grid-cell{min-width:0}.q-correct{color:inherit;font-weight:inherit}@media screen{body{max-width:210mm;padding:18mm 16mm;margin:auto}}
</style></head><body>${safeExportHtml(content)}</body></html>`;
}
