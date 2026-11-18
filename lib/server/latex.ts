/**
 * TikZ → SVG on the server.
 *
 * Compiling TeX is the slowest step in the figure pipeline (~0.5s), so results
 * are cached by the exact source. The same figure in twenty exams is compiled
 * once.
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

const COMPILE_TIMEOUT_MS = 15_000;
const CACHE_LIMIT = 300;

const cache = new Map<string, string>();

export class LatexUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LatexUnavailableError';
  }
}

export class LatexError extends Error {
  constructor(
    message: string,
    readonly log: string,
  ) {
    super(message);
    this.name = 'LatexError';
  }
}

/** Trimmed SVG of a PDF page, ready to inline into the document HTML. */
export async function compileTikz(source: string): Promise<string> {
  const key = createHash('sha256').update(source).digest('hex');
  const hit = cache.get(key);
  if (hit) return hit;

  const dir = await mkdtemp(join(tmpdir(), 'sdt-fig-'));
  try {
    await writeFile(join(dir, 'fig.tex'), source, 'utf8');

    try {
      await run('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', 'fig.tex'], {
        cwd: dir,
        timeout: COMPILE_TIMEOUT_MS,
        maxBuffer: 8 * 1024 * 1024,
      });
    } catch (err) {
      if (isMissingBinary(err)) {
        throw new LatexUnavailableError('Máy chủ chưa cài LaTeX (pdflatex) nên chưa vẽ được hình.');
      }
      const log = await readFile(join(dir, 'fig.log'), 'utf8').catch(() => '');
      throw new LatexError('Không biên dịch được hình.', firstError(log));
    }

    try {
      await run('pdftocairo', ['-svg', 'fig.pdf', 'fig.svg'], {
        cwd: dir,
        timeout: COMPILE_TIMEOUT_MS,
      });
    } catch (err) {
      if (isMissingBinary(err)) {
        throw new LatexUnavailableError('Máy chủ chưa cài pdftocairo nên chưa xuất được hình.');
      }
      throw new LatexError('Không xuất được SVG từ hình.', '');
    }

    const raw = await readFile(join(dir, 'fig.svg'), 'utf8');
    const svg = inlineSvg(raw);
    remember(key, svg);
    return svg;
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Detects a missing binary rather than a real compile failure. */
function isMissingBinary(err: unknown): boolean {
  return (err as NodeJS.ErrnoException)?.code === 'ENOENT';
}

function firstError(log: string): string {
  const line = log
    .split('\n')
    .find((row) => row.startsWith('!'));
  return line ? line.slice(0, 200) : '';
}

function remember(key: string, svg: string) {
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, svg);
}

/**
 * pdftocairo emits an XML prolog, a DOCTYPE and a standalone width/height. The
 * document only wants the `<svg>` element, sized by CSS.
 */
export function inlineSvg(raw: string): string {
  const CLOSE = '</svg>';
  const start = raw.indexOf('<svg');
  const end = raw.lastIndexOf(CLOSE);
  if (start < 0 || end < 0) throw new LatexError('SVG sinh ra không hợp lệ.', '');
  // + CLOSE.length, not a hand-counted 5: without the trailing ">" the element
  // never closes and the browser swallows whatever follows into the drawing.
  const svg = raw.slice(start, end + CLOSE.length);

  const cleaned = svg
    .replace(/\s(width|height)="[^"]*"/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '');

  // pdftocairo omits units, which a browser reads as pixels. The drawing was
  // made in centimetres, so re-state its size in points and let CSS cap it.
  const viewBox = /viewBox="([^"]+)"/.exec(cleaned);
  if (!viewBox) return cleaned;
  const parts = viewBox[1].trim().split(/\s+/);
  const width = Number(parts[2]);
  const height = Number(parts[3]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return cleaned;

  return cleaned.replace('<svg ', `<svg width="${width}pt" height="${height}pt" `);
}

/**
 * Gives every id in the drawing a unique prefix.
 *
 * A compiled figure carries ids such as `glyph-0-0`. Two figures pasted into the
 * same document would repeat them, and `<use>` resolves document-wide — the
 * second figure would borrow the first one's glyphs and print the wrong letters.
 */
export function namespaceSvgIds(svg: string, prefix: string): string {
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  let out = svg;
  for (const id of ids) {
    out = out.split(`id="${id}"`).join(`id="${prefix}${id}"`);
    out = out.split(`href="#${id}"`).join(`href="#${prefix}${id}"`);
  }
  return out;
}

/** A short, collision-free prefix for one insertion. */
export function figurePrefix(): string {
  return `f${Math.random().toString(36).slice(2, 8)}-`;
}

/** Whether this machine can render figures at all. */
export async function latexAvailable(): Promise<boolean> {
  try {
    await run('pdflatex', ['--version'], { timeout: 5000 });
    await run('pdftocairo', ['-v'], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
