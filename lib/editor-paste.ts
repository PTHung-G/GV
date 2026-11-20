/**
 * Paste cleaner for the A4 exam editor.
 *
 * Strips Microsoft Word / Google Docs XML junk (`MsoNormal`, `o:p`, `mso-*`,
 * comments, style blocks) while preserving meaningful exam semantics (`b`, `i`,
 * `u`, `sub`, `sup`, headings, lists, explicit `<table><tbody>`, `<br>`, `$...$`).
 */
import { parseFragment, serialize, type DefaultTreeAdapterMap } from 'parse5';
import { escapeHtml } from './math';

type ChildNode = DefaultTreeAdapterMap['childNode'];
type ParentNode = DefaultTreeAdapterMap['parentNode'];
type Element = DefaultTreeAdapterMap['element'];

const DROP_SUBTREES = new Set(['script', 'style', 'meta', 'link', 'xml', 'title', 'iframe', 'object', 'embed']);
const KEEP_TAGS = new Set([
  'p',
  'div',
  'span',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'sub',
  'sup',
  'ul',
  'ol',
  'li',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'blockquote',
  'img',
]);

const SAFE_PASTE_STYLE_PROPS = new Set(['text-align', 'font-weight', 'font-style', 'text-decoration']);

function isElement(node: ChildNode): node is Element {
  return 'tagName' in node;
}

function cleanStyle(raw: string): string {
  const kept: string[] = [];
  for (const part of raw.split(';')) {
    const idx = part.indexOf(':');
    if (idx <= 0) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();
    if (!prop || !val || prop.startsWith('mso-')) continue;
    if (SAFE_PASTE_STYLE_PROPS.has(prop) && !/[<>@{}\\]|url\s*\(/i.test(val)) {
      kept.push(`${prop}:${val}`);
    }
  }
  return kept.join(';');
}

function normalizeElement(el: Element): void {
  const tag = el.tagName.toLowerCase();
  if (tag === 'font') {
    el.tagName = 'span';
    el.nodeName = 'span';
  }
  const attrs: Element['attrs'] = [];
  for (const attr of el.attrs ?? []) {
    const name = attr.name.toLowerCase();
    if (name === 'style') {
      const cleaned = cleanStyle(attr.value);
      if (cleaned) attrs.push({ name: 'style', value: cleaned });
      continue;
    }
    if (name === 'colspan' || name === 'rowspan') {
      if (/^\d+$/.test(attr.value.trim())) attrs.push({ name, value: attr.value.trim() });
      continue;
    }
    if (el.tagName === 'img' && name === 'src') {
      const src = attr.value.trim();
      if (/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(src) || /^https?:\/\//i.test(src)) {
        attrs.push({ name: 'src', value: src });
      }
      continue;
    }
    if (el.tagName === 'img' && name === 'alt') {
      attrs.push({ name: 'alt', value: attr.value.slice(0, 200) });
      continue;
    }
    if (name === 'class') {
      const safeCls = attr.value
        .split(/\s+/)
        .filter((c) => /^doc-(?:header|header-col|grid|grid-cell|question|boxed)$/.test(c))
        .join(' ');
      if (safeCls) attrs.push({ name: 'class', value: safeCls });
    }
  }
  el.attrs = attrs;
}

function cleanTree(parent: ParentNode): void {
  if (!('childNodes' in parent) || !Array.isArray(parent.childNodes)) return;
  const out: ChildNode[] = [];
  for (const child of parent.childNodes) {
    if (!isElement(child)) {
      if (child.nodeName !== '#comment') out.push(child);
      continue;
    }
    const rawTag = child.tagName.toLowerCase();
    // Office namespaced tags like <o:p>, <w:sdt>, <v:shape> or dropped trees
    if (DROP_SUBTREES.has(rawTag) || rawTag.includes(':')) {
      if (rawTag.startsWith('o:') && rawTag !== 'o:p') continue;
      if (DROP_SUBTREES.has(rawTag)) continue;
      cleanTree(child);
      for (const grand of child.childNodes ?? []) {
        if ('parentNode' in grand) grand.parentNode = parent;
        out.push(grand);
      }
      continue;
    }

    normalizeElement(child);
    const tag = child.tagName.toLowerCase();
    cleanTree(child);

    if (!KEEP_TAGS.has(tag)) {
      for (const grand of child.childNodes ?? []) {
        if ('parentNode' in grand) grand.parentNode = parent;
        out.push(grand);
      }
      continue;
    }

    // Wrap direct <tr> children inside explicit <tbody> so StructuredExam HTML checks stay valid
    if (tag === 'table') {
      const hasSection = (child.childNodes ?? []).some(
        (c) => isElement(c) && ['tbody', 'thead', 'tfoot'].includes(c.tagName.toLowerCase()),
      );
      const rows = (child.childNodes ?? []).filter(
        (c) => isElement(c) && c.tagName.toLowerCase() === 'tr',
      );
      if (!hasSection && rows.length > 0) {
        const tbody: Element = {
          nodeName: 'tbody',
          tagName: 'tbody',
          attrs: [],
          namespaceURI: child.namespaceURI,
          childNodes: rows,
          parentNode: child,
        };
        for (const r of rows) {
          if ('parentNode' in r) r.parentNode = tbody;
        }
        child.childNodes = [tbody];
      }
    }

    // Unwrap empty meaningless <span> without attributes
    if (tag === 'span' && (!child.attrs || child.attrs.length === 0)) {
      for (const grand of child.childNodes ?? []) {
        if ('parentNode' in grand) grand.parentNode = parent;
        out.push(grand);
      }
      continue;
    }

    out.push(child);
  }
  parent.childNodes = out;
}

export function cleanPastedHtml(clipboardHtml: string, clipboardText: string): string {
  const raw = clipboardHtml.trim();
  if (raw) {
    // Strip Word conditional comments like <!--[if gte mso 9]>...<![endif]-->
    const withoutConditionals = raw
      .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '')
      .replace(/<!--StartFragment-->|<!--EndFragment-->/gi, '');
    const fragment = parseFragment(withoutConditionals);
    cleanTree(fragment);
    const cleaned = serialize(fragment).trim();
    if (cleaned) return cleaned;
  }

  const plain = clipboardText.replace(/\r\n/g, '\n').trim();
  if (!plain) return '';
  const paragraphs = plain.split(/\n{2,}/);
  if (paragraphs.length === 1 && !plain.includes('\n')) {
    return escapeHtml(plain);
  }
  return paragraphs
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
}
