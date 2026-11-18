/**
 * Document layout: auto-column option grids and A4 pagination.
 *
 * Both algorithms are ported from the original bundle
 * (source-mirror/js/1twhdx9v_bid8.js, chunk 952907 / 411929 / 731530):
 *
 *   automaticChoices(node)  — is this grid a list of "A. …" choices?
 *   measureChoiceGrid(el)   — how many columns fit?
 *   measureColumns(...)     — which blocks fit on this A4 page?
 *
 * They run in the browser because they read real layout metrics.
 */

/** A4 geometry, matching the original's `PAGE_MM` / 96dpi constants. */
export const PAGE = {
  heightPx: (297 * 96) / 25.4, // 1122.52
  padTop: 75.59,
  padBottom: 75.59,
} as const;

export const CONTENT_HEIGHT = PAGE.heightPx - PAGE.padTop - PAGE.padBottom;

/**
 * Their `automaticChoices`: a grid of 2..26 children each starting with a
 * letter marker ("A. ", "B) ", …) is treated as an option list.
 */
export function automaticChoices(root: Element): boolean {
  if (root.getAttribute('data-auto-columns') === 'false') return false;
  if (root.getAttribute('data-auto-columns') === 'true') return true;

  const cells = Array.from(root.children);
  if (cells.length < 2 || cells.length > 26) return false;

  return cells.every((cell, i) => {
    const text = (cell.textContent ?? '').trimStart();
    return new RegExp(`^${String.fromCharCode(65 + i)}[.)]\\s`).test(text);
  });
}

/**
 * Their `measureChoiceGrid`: try the widest column count that fits every cell
 * at its intrinsic width. Returns 1 when any cell is multi-line or holds a
 * display formula (it would need the full column width).
 */
export function measureChoiceGrid(el: HTMLElement): number {
  const width = el.clientWidth;
  if (width <= 0) return 1;

  const cells = Array.from(el.children) as HTMLElement[];
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
  const scale = el.getBoundingClientRect().width / el.offsetWidth || 1;

  // Multi-line content cannot be measured at intrinsic width.
  if (
    cells.some(
      (c) =>
        c.children.length > 1 ||
        c.querySelector('br:not(.ProseMirror-trailingBreak), .doc-math-display'),
    )
  ) {
    return 1;
  }

  el.classList.add('doc-grid-measuring');
  try {
    const widths = cells.map((c) => Math.max(c.scrollWidth, c.getBoundingClientRect().width / scale));
    if (!widths.length || width <= 0 || widths.some((w) => !Number.isFinite(w))) return 1;

    for (let cols = widths.length; cols > 1; cols--) {
      if (widths.length % cols !== 0) continue;
      const each = (width - gap * (cols - 1)) / cols;
      // +2px tolerance, as in the original.
      if (widths.every((w) => w + 2 <= each)) return cols;
    }
    return 1;
  } finally {
    el.classList.remove('doc-grid-measuring');
  }
}

/** Applies the measured column count to every option grid under `root`. */
export function layoutChoiceGrids(root: HTMLElement): void {
  for (const grid of Array.from(root.querySelectorAll<HTMLElement>('.doc-grid'))) {
    const auto = grid.hasAttribute('data-auto-columns')
      ? grid.getAttribute('data-auto-columns') === 'true'
      : null;
    if (auto === false) continue;

    let cols = Number(grid.dataset.columns ?? 0);
    if (auto === true || automaticChoices(grid)) {
      cols = measureChoiceGrid(grid);
    }
    if (!cols || cols < 1) continue;

    const template = `repeat(${cols}, minmax(0, 1fr))`;
    if (grid.style.gridTemplateColumns !== template) {
      grid.style.gridTemplateColumns = template;
    }
    grid.dataset.columns = String(cols);
  }
}


/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

/** Overflow in px allowed before a new page is forced (their `m+.5`). */
const EPS = 0.5;
