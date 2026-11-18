/**
 * Replaces the assistant's figure placeholders with real drawings.
 *
 * The model is not asked to produce lines and coordinates — it writes
 * `<figure data-figure-spec='{…}'>` and stops there. This module solves the
 * spec, renders it through TeX, and swaps in the SVG. A spec that cannot exist
 * becomes a visible note instead of a wrong figure.
 */
import { FigureError, solve, type FigureSpec } from '@/lib/geometry/spec';
import { tikzDocument } from '@/lib/geometry/tikz';
import { compileTikz, figurePrefix, namespaceSvgIds } from '@/lib/server/latex';

const MAX_FIGURES = 8;

const PLACEHOLDER =
  /<figure\b[^>]*?data-figure(?:-spec)?\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>[\s\S]*?<\/figure>/gi;

export type EmbedResult = { html: string; warnings: string[] };

export async function embedFigures(
  html: string,
  onProgress?: (done: number, total: number) => void,
): Promise<EmbedResult> {
  const matches = [...html.matchAll(PLACEHOLDER)];
  if (!matches.length) return { html, warnings: [] };

  const warnings: string[] = [];
  const replacements: Array<{ from: string; to: string }> = [];

  const usable = matches.slice(0, MAX_FIGURES);
  if (matches.length > MAX_FIGURES) {
    warnings.push(`Đề có ${matches.length} hình, chỉ dựng ${MAX_FIGURES} hình đầu.`);
  }

  let drawn = 0;
  for (const match of usable) {
    onProgress?.(drawn, usable.length);
    const raw = (match[1] ?? match[2] ?? '').trim();
    const whole = match[0];
    let spec: FigureSpec;
    try {
      spec = JSON.parse(decodeEntities(raw)) as FigureSpec;
    } catch {
      warnings.push('Một hình bị bỏ qua vì mô tả không đọc được.');
      replacements.push({ from: whole, to: failedFigure('Không đọc được mô tả hình.') });
      continue;
    }

    try {
      const scene = solve({ ...spec, params: spec.params ?? {} });
      const svg = namespaceSvgIds(await compileTikz(tikzDocument(scene)), figurePrefix());
      const caption = spec.caption ? `<figcaption>${escapeHtml(spec.caption)}</figcaption>` : '';
      replacements.push({
        from: whole,
        to: `<figure class="doc-figure">${svg}${caption}</figure>`,
      });
    } catch (err) {
      const message =
        err instanceof FigureError
          ? err.message
          : 'Không dựng được hình này (máy chủ chưa cấu hình LaTeX).';
      warnings.push(message);
      replacements.push({ from: whole, to: failedFigure(message) });
    }
    drawn += 1;
    onProgress?.(drawn, usable.length);
  }

  let out = html;
  for (const { from, to } of replacements) {
    out = out.replace(from, to);
  }
  return { html: out, warnings };
}

function failedFigure(message: string): string {
  return `<figure class="doc-figure" data-figure-error="">[Hình vẽ: ${escapeHtml(message)}]</figure>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** The model may escape quotes inside a single-quoted attribute. */
function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
