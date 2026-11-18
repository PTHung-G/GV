import { automaticChoices } from '@/lib/layout';

export type BlockKind = 'title' | 'question' | 'section' | 'text' | 'choices' | 'pagebreak';

export const FORMAT_LABELS = [
  'Tiêu đề cấp 1',
  'Tiêu đề cấp 2',
  'Tiêu đề cấp 3',
  'Văn bản thường',
] as const;

export const FONT_OPTIONS = [
  'Times New Roman',
  'Arial',
  'Inter',
  'Cambria',
  'Courier New',
] as const;

export const SIZE_PRESETS = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24] as const;

export const KIND_FILTERS = ['all', 'title', 'question', 'section'] as const;

export type OutlineItem = { index: number; kind: BlockKind; label: string; level: number };

const HTML_BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'LI', 'TABLE', 'DIV', 'BLOCKQUOTE', 'PRE']);

/**
 * Splits the stored HTML into top-level blocks so the outline, page count and
 * word count can be derived without a full document model.
 */
export function htmlToBlocks(html: string): string[] {
  if (!html.trim() || typeof window === 'undefined') return [];
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const out: string[] = [];
  tpl.content.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (HTML_BLOCK_TAGS.has(el.tagName)) out.push(el.outerHTML);
      else out.push(el.outerHTML);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      out.push(`<p>${escapeHtml(node.textContent)}</p>`);
    }
  });
  return out;
}

export function classifyBlock(html: string): BlockKind {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const el = tpl.content.firstElementChild as HTMLElement | null;
  if (!el) return 'text';
  if (el.classList.contains('page-break')) return 'pagebreak';
  if (el.classList.contains('doc-question')) return 'question';
  // Rubric/answer tables are data, not headings — their cells start with
  // "Câu …" and would otherwise flood the outline.
  if (el.tagName === 'TABLE') return 'text';
  // Option grids read as "A. 7. B. −7. …" in one line; they are answer
  // choices, not outline entries.
  if (el.classList.contains('doc-grid') && automaticChoices(el)) return 'text';
  // Any heading tag is navigable, including the <h3> section titles.
  if (/^H[1-6]$/.test(el.tagName)) {
    return el.tagName === 'H1' ? 'title' : 'section';
  }
  if (/^Câu\s+\d+/.test(el.textContent ?? '')) return 'question';
  return 'text';
}

/** Blocks that are document chrome rather than navigable headings. */
export function isOutlineEntry(kind: BlockKind): boolean {
  return kind === 'title' || kind === 'section' || kind === 'question';
}

export function buildOutline(html: string): OutlineItem[] {
  return htmlToBlocks(html)
    .map((block, index) => {
      const tpl = document.createElement('template');
      tpl.innerHTML = block;
      const el = tpl.content.firstElementChild as HTMLElement | null;
      const kind = classifyBlock(block);
      const text = (el?.textContent ?? '').trim().replace(/\s+/g, ' ');
      const level = el ? Number(el.tagName.replace('H', '')) || 4 : 4;
      return { index, kind, label: text, level };
    })
    .filter((item) => item.label && isOutlineEntry(item.kind));
}

export function countWords(text: string) {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function countPages(blocks: string[]) {
  const breaks = blocks.filter((b) => b.includes('page-break') || b.includes('data-page-break')).length;
  return 1 + breaks;
}

export function plainText(html: string) {
  if (typeof window === 'undefined') return html.replace(/<[^>]+>/g, ' ');
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  return tpl.content.textContent ?? '';
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Minimal sanitiser: keeps formatting tags and strips scripts/handlers. */
export function sanitize(html: string) {
  if (typeof window === 'undefined') return html;
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach((el) => el.remove());
  tpl.content.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || (name === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:'))) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return tpl.innerHTML;
}
