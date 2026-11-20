/**
 * Splitting text blocks across A4 sheets on screen.
 *
 * Ported from the original `measureColumns`
 * (source-mirror/js/1twhdx9v_bid8.pretty.js, module 731530): when a text block
 * would cross the page boundary, binary-search the longest prefix that fits,
 * then walk back to the nearest whitespace (at most 80 characters) so a word is
 * never cut in half. The remainder becomes a new block on the next sheet.
 *
 * Only works on plain text blocks. Blocks containing inline markup we cannot
 * safely slice (math, links, images, grids) are left whole and simply overflow.
 */

/** Elements whose inline content we refuse to slice. */
const UNSAFE_SELECTOR = [
  '.doc-math',
  'math',
  'img',
  'svg',
  'table',
  '.doc-grid',
  '.doc-header',
  'a',
  'code',
  'pre',
].join(',');

/** Tags whose splitting is safe (a clone keeps the same semantics). */
const SPLITTABLE = new Set(['P', 'LI', 'BLOCKQUOTE', 'DIV']);

/** Attribute marking a block created by a split, so we can undo it. */
const SPLIT_ATTR = 'data-split-part';

function isSplittable(el: HTMLElement): boolean {
  if (!SPLITTABLE.has(el.tagName)) return false;
  if (el.matches(UNSAFE_SELECTOR)) return false;
  if (el.querySelector(UNSAFE_SELECTOR)) return false;
  if (el.hasAttribute('data-page-spacer')) return false;
  // Plain text nodes only: slicing via textContent would otherwise erase <b>, <i>, <u>, or math tags.
  return Array.from(el.childNodes).every((n) => n.nodeType === Node.TEXT_NODE);
}

/**
 * Undoes every split by merging each tail back into its head, so no text is
 * ever dropped and the next pagination pass starts from whole paragraphs.
 */
export function unsplitText(root: HTMLElement): void {
  for (const head of Array.from(root.querySelectorAll<HTMLElement>(`[${SPLIT_ATTR}="h"]`))) {
    const tail = head.nextElementSibling;
    if (tail?.getAttribute(SPLIT_ATTR) === 't') {
      head.textContent = `${head.textContent ?? ''} ${tail.textContent ?? ''}`.replace(/\s+/g, ' ');
      tail.remove();
    }
    head.removeAttribute(SPLIT_ATTR);
  }
  // Orphans (a tail whose head vanished) are folded into the previous block.
  for (const tail of Array.from(root.querySelectorAll<HTMLElement>(`[${SPLIT_ATTR}="t"]`))) {
    const prev = tail.previousElementSibling;
    if (prev && !prev.hasAttribute('data-page-spacer')) {
      prev.textContent = `${prev.textContent ?? ''} ${tail.textContent ?? ''}`.replace(/\s+/g, ' ');
    }
    tail.remove();
  }
}

/**
 * Splits text blocks that cross a page boundary.
 *
 * Walks the children once. A block that crosses the boundary is replaced by a
 * head (what fits) plus a tail (the rest). The tail is then considered as the
 * next block, so a long paragraph can span more than two sheets.
 */
export function splitAcrossPages(
  root: HTMLElement,
  budget: number,
  rebuild: (block: HTMLElement, text: string) => HTMLElement,
): number {
  // Flush layout so every measurement below is current.
  void root.offsetHeight;

  let used = 0;
  let splits = 0;
  let queue = Array.from(root.children) as HTMLElement[];
  // `anchor` is the node each replacement is inserted before, so untouched
  // blocks keep their identity (listeners, focus, KaTeX DOM).
  const results: Array<{ anchor: HTMLElement; head: HTMLElement; tail: HTMLElement }> = [];

  while (queue.length) {
    const block = queue.shift() as HTMLElement;
    if (block.hasAttribute('data-page-spacer')) continue;

    const h = block.getBoundingClientRect().height;
    const room = budget - used;

    // Fits on this sheet (or nothing is placed yet): keep it whole.
    if (used === 0 || h <= room) {
      used += h;
      continue;
    }

    // Crosses the boundary: try to cut it at a word break.
    const parts = isSplittable(block) ? splitBlock(block, room, rebuild) : null;
    if (!parts) {
      // Not splittable, or no room at all: let it overflow the sheet.
      used += h;
      continue;
    }

    const [head, tail] = parts;
    head.setAttribute(SPLIT_ATTR, 'h');
    tail.setAttribute(SPLIT_ATTR, 't');
    results.push({ anchor: block, head, tail });
    splits++;
    // Start a new sheet and reconsider the remainder.
    used = 0;
    queue.unshift(tail);
  }

  // Apply the replacements once the walk is done.
  for (const { anchor, head, tail } of results) {
    anchor.replaceWith(head, tail);
  }
  return splits;
}

/**
 * Finds the longest prefix of `block`'s text that fits in `room` px, cutting at
 * whitespace. Returns `[head, tail]` clones, or null when nothing fits.
 */
function splitBlock(
  block: HTMLElement,
  room: number,
  rebuild: (block: HTMLElement, text: string) => HTMLElement,
): [HTMLElement, HTMLElement] | null {
  const text = block.textContent ?? '';
  if (text.trim().length < 2) return null;

  const boxWidth = block.getBoundingClientRect().width;
  const host = document.createElement('div');
  host.className = 'doc-page doc-surface';
  host.style.position = 'absolute';
  host.style.visibility = 'hidden';
  host.style.pointerEvents = 'none';
  host.style.left = '-99999px';
  host.style.top = '0';
  host.style.width = `${boxWidth}px`;
  host.style.padding = '0';
  host.style.margin = '0';
  (document.body ?? block.parentElement ?? block).appendChild(host);

  const measure = (candidate: string) => {
    const probe = rebuild(block, candidate);
    probe.style.width = `${boxWidth}px`;
    probe.style.marginTop = '0';
    host.appendChild(probe);
    const height = probe.getBoundingClientRect().height;
    probe.remove();
    return height;
  };

  try {
    // Binary search the largest character count that still fits.
    let lo = 1;
    let hi = text.length;
    let best = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (measure(text.slice(0, mid)) <= room) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best <= 0) return null;

    // Walk back to whitespace, at most 80 characters (same bound as the original).
    let cut = best;
    while (cut > 1 && cut > best - 80 && !/\s/.test(text[cut - 1])) cut--;
    if (cut > 1 && /\s/.test(text[cut - 1])) cut--;

    const headText = text.slice(0, cut);
    const tailText = text.slice(cut).replace(/^\s+/, '');
    if (!headText.trim() || !tailText.trim()) return null;

    const head = rebuild(block, headText);
    const tail = rebuild(block, tailText);
    return [head, tail];
  } finally {
    host.remove();
  }
}
