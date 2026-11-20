/**
 * Shared isomorphic HTML sanitizer for exam printing, PDF export and published releases.
 *
 * Uses `parse5` so browser preview/export and Node.js server release generation enforce
 * the exact same security and formatting rules:
 *   - Removes active/dangerous element subtrees (`script`, `iframe`, `style`, ...).
 *   - Converts legacy `<font>` / `<center>` elements into safe styled wrappers instead of
 *     dropping the user's text.
 *   - Unwraps unknown passive tags (preserving inner text).
 *   - Preserves SVG `<use href="#...">` / `<use xlink:href="#...">` local glyph references
 *     so TikZ vertex and axis labels remain visible on PDF/release prints.
 */
import { parseFragment, serialize, type DefaultTreeAdapterMap } from 'parse5';
import { renderMathInHtml } from './math';

type ChildNode = DefaultTreeAdapterMap['childNode'];
type ParentNode = DefaultTreeAdapterMap['parentNode'];
type Element = DefaultTreeAdapterMap['element'];

const TAGS = new Set(
  'svg g path line polyline polygon rect circle ellipse text tspan defs marker clippath use p div span br h1 h2 h3 h4 h5 h6 strong b em i u s mark sub sup ul ol li table thead tbody tfoot tr th td colgroup col blockquote hr figure figcaption img a math semantics mrow mi mn mo mtext mspace mfrac msqrt mroot msup msub msubsup mover munder munderover mtable mtr mtd annotation menclose mpadded mstyle'.split(' '),
);

const DROP_SUBTREE = new Set([
  'script',
  'style',
  'iframe',
  'frame',
  'frameset',
  'object',
  'embed',
  'applet',
  'form',
  'input',
  'button',
  'select',
  'textarea',
  'link',
  'meta',
  'base',
  'foreignobject',
  'noscript',
  'template',
]);

const ATTRS = new Set(
  'class id viewbox xmlns d x y x1 y1 x2 y2 cx cy r rx ry points fill stroke stroke-width stroke-dasharray stroke-linecap stroke-linejoin transform text-anchor dominant-baseline markerwidth markerheight refx refy orient markerunits preserveaspectratio colspan rowspan width height alt display mathvariant encoding columnalign rowspacing columnspacing stretchy fence separator accent accentunder notation scriptlevel data-page-break data-columns style'.split(' '),
);

const SAFE_STYLES = new Set(
  'color background-color text-align font-size font-family font-weight font-style text-decoration line-height vertical-align break-after page-break-after break-inside grid-template-columns column-gap row-gap --header-columns --header-space-after --header-line-height --header-column-gap'.split(' '),
);

const FONT_SIZE_MAP: Record<string, string> = {
  '1': '8pt',
  '2': '10pt',
  '3': '12pt',
  '4': '14pt',
  '5': '18pt',
  '6': '24pt',
  '7': '36pt',
};

const LOCAL_FRAGMENT_REF = /^#[A-Za-z0-9_.:-]+$/;

function isElement(node: ChildNode): node is Element {
  return 'tagName' in node;
}

function sanitizeStyleValue(raw: string): string {
  const safe: string[] = [];
  for (const decl of raw.split(';')) {
    const colon = decl.indexOf(':');
    if (colon <= 0) continue;
    const prop = decl.slice(0, colon).trim().toLowerCase();
    const val = decl.slice(colon + 1).trim();
    if (!prop || !val) continue;
    if (SAFE_STYLES.has(prop) && !/url\s*\(|expression|[<>@{}\\]/i.test(val)) {
      safe.push(`${prop}:${val}`);
    }
  }
  return safe.join(';');
}

function isSafeImgSrc(raw: string, origin?: string): string | null {
  const value = raw.trim();
  if (/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(value)) {
    return value;
  }
  if (/^\/(?!\/)/.test(value) && !/[<>\\]/.test(value)) {
    return value;
  }
  if (origin) {
    try {
      const url = new URL(value, origin);
      if (url.origin === origin && /^https?:$/.test(url.protocol)) {
        return url.href;
      }
    } catch {
      return null;
    }
  }
  return null;
}

function translateLegacyTag(el: Element): void {
  const tag = el.tagName.toLowerCase();
  if (tag === 'font') {
    const extraStyles: string[] = [];
    const keptAttrs = [];
    for (const attr of el.attrs ?? []) {
      const name = attr.name.toLowerCase();
      if (name === 'color' && attr.value.trim()) extraStyles.push(`color:${attr.value.trim()}`);
      else if (name === 'face' && attr.value.trim()) extraStyles.push(`font-family:${attr.value.trim()}`);
      else if (name === 'size' && FONT_SIZE_MAP[attr.value.trim()]) {
        extraStyles.push(`font-size:${FONT_SIZE_MAP[attr.value.trim()]}`);
      } else if (name === 'style' && attr.value.trim()) {
        extraStyles.push(attr.value.trim());
      } else if (name === 'class' || name === 'id') {
        keptAttrs.push(attr);
      }
    }
    el.tagName = 'span';
    el.nodeName = 'span';
    if (extraStyles.length) {
      keptAttrs.push({ name: 'style', value: extraStyles.join(';') });
    }
    el.attrs = keptAttrs;
    return;
  }

  if (tag === 'center') {
    el.tagName = 'div';
    el.nodeName = 'div';
    const existingStyle = el.attrs?.find((a) => a.name.toLowerCase() === 'style')?.value ?? '';
    const merged = [existingStyle, 'text-align:center'].filter(Boolean).join(';');
    el.attrs = [
      ...(el.attrs ?? []).filter((a) => a.name.toLowerCase() !== 'style'),
      { name: 'style', value: merged },
    ];
  }
}

function sanitizeAttrs(el: Element, origin?: string): void {
  const tag = el.tagName.toLowerCase();
  const nextAttrs: Element['attrs'] = [];

  for (const attr of el.attrs ?? []) {
    const lower = attr.name.toLowerCase();

    if (lower === 'style') {
      const cleaned = sanitizeStyleValue(attr.value);
      if (cleaned) nextAttrs.push({ name: 'style', value: cleaned });
      continue;
    }

    if (tag === 'img' && lower === 'src') {
      const safeSrc = isSafeImgSrc(attr.value, origin);
      if (safeSrc) nextAttrs.push({ name: 'src', value: safeSrc });
      continue;
    }

    if (tag === 'use' && (lower === 'href' || lower === 'xlink:href')) {
      const ref = attr.value.trim();
      if (LOCAL_FRAGMENT_REF.test(ref)) {
        nextAttrs.push({ ...attr, value: ref });
      }
      continue;
    }

    if (ATTRS.has(lower)) {
      nextAttrs.push(attr);
    }
  }

  el.attrs = nextAttrs;
}

function walkClean(parent: ParentNode, origin?: string): void {
  if (!('childNodes' in parent) || !Array.isArray(parent.childNodes)) return;

  const cleaned: ChildNode[] = [];
  for (const child of parent.childNodes) {
    if (!isElement(child)) {
      // Drop HTML comments to keep output clean.
      if (child.nodeName !== '#comment') cleaned.push(child);
      continue;
    }

    const rawTag = child.tagName.toLowerCase();
    if (DROP_SUBTREE.has(rawTag)) {
      continue;
    }

    translateLegacyTag(child);
    const tag = child.tagName.toLowerCase();

    if (!TAGS.has(tag)) {
      // Unwrap unknown passive tags instead of deleting user text.
      walkClean(child, origin);
      for (const grand of child.childNodes ?? []) {
        if ('parentNode' in grand) grand.parentNode = parent;
        cleaned.push(grand);
      }
      continue;
    }

    sanitizeAttrs(child, origin);
    walkClean(child, origin);
    cleaned.push(child);
  }

  parent.childNodes = cleaned;
}

export function sanitizeExamHtml(content: string, options: { origin?: string; renderMath?: boolean } = {}): string {
  const withMath = options.renderMath === false ? content : renderMathInHtml(content);
  const fragment = parseFragment(withMath);
  walkClean(fragment, options.origin);
  return serialize(fragment);
}

/**
 * Compacts heavy inline SVGs inside `<figure>` into compact `data-figure-spec`
 * placeholders before sending exam HTML to LLMs (saves ~85% context tokens).
 */
export function compactHtmlForAi(html: string): string {
  if (!html) return '';
  return html
    .replace(
      /<figure\b[^>]*?data-figure\s*=\s*(["'])([\s\S]*?)\1[^>]*>[\s\S]*?<\/figure>/gi,
      (_match, quote: string, rawSpec: string) =>
        `<figure data-figure-spec=${quote}${rawSpec}${quote}></figure>`,
    )
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '<svg data-omitted="true"></svg>');
}

export const PRINT_SHARED_CSS = `@page{size:A4;margin:18mm 16mm}*{box-sizing:border-box}body{margin:0;background:#fff;color:#000;font:13pt/1.5 'Times New Roman',serif}h1{text-align:center;font-size:18pt}h2{font-size:15pt}h3{font-size:14pt}p{margin:.35em 0}img,svg{max-width:100%;max-height:240mm;object-fit:contain}table{border-collapse:collapse;width:100%;margin:.5em 0}td,th{border:1px solid #777;padding:4px 8px;vertical-align:top}tr,figure,.doc-grid{break-inside:avoid}ul,ol{padding-left:1.5em}.doc-boxed{border:1px solid #333;padding:8px 12px;margin:.5em 0}.page-break,[data-page-break],[style*='page-break-after:always'],[style*='break-after:page']{break-after:page;page-break-after:always;height:0}.doc-math-display{display:block;text-align:center;margin:.4em 0}.option-grid,.options-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.doc-header{display:grid;grid-template-columns:var(--header-columns,1fr 1.4fr);align-items:start;padding-bottom:var(--header-space-after,6px)}.doc-header-col{min-width:0;line-height:var(--header-line-height,1.45)}.doc-header-col:first-child{padding-right:var(--header-column-gap,12px)}.doc-header-col p:not([style*='text-align']){text-align:center}.doc-grid{display:grid;column-gap:12px;break-inside:avoid}.doc-grid[data-columns='1']{grid-template-columns:minmax(0,1fr)}.doc-grid[data-columns='2']{grid-template-columns:repeat(2,minmax(0,1fr))}.doc-grid[data-columns='3']{grid-template-columns:repeat(3,minmax(0,1fr))}.doc-grid:not([data-columns]),.doc-grid[data-columns='4']{grid-template-columns:repeat(4,minmax(0,1fr))}.doc-grid-cell{min-width:0}.q-correct{color:inherit;font-weight:inherit}@media screen{body{max-width:210mm;padding:18mm 16mm;margin:auto}}`;
