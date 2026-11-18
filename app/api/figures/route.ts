/**
 * Figure rendering — POST /api/figures
 *
 * Takes a small, validated specification (never raw TeX) and returns inline SVG.
 * The assistant writes specs; this endpoint is what turns them into drawings.
 */
import { NextRequest, NextResponse } from 'next/server';
import { FIGURE_KINDS, FIGURE_META, FigureError, solve, type FigureSpec } from '@/lib/geometry/spec';
import { tikzDocument } from '@/lib/geometry/tikz';
import {
  LatexError,
  LatexUnavailableError,
  compileTikz,
  figurePrefix,
  latexAvailable,
  namespaceSvgIds,
} from '@/lib/server/latex';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    kinds: FIGURE_KINDS.map((kind) => ({ kind, ...FIGURE_META[kind] })),
    available: await latexAvailable(),
  });
}

export async function POST(req: NextRequest) {
  let body: { spec?: FigureSpec; format?: 'svg' | 'tikz' };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Dữ liệu gửi lên không hợp lệ.', reason: 'invalid_json' }, { status: 400 });
  }

  const spec = body.spec;
  if (!spec || typeof spec !== 'object' || typeof spec.kind !== 'string') {
    return NextResponse.json({ error: 'Thiếu mô tả hình.', reason: 'missing_spec' }, { status: 400 });
  }

  let scene;
  try {
    scene = solve({ ...spec, params: spec.params ?? {} });
  } catch (err) {
    if (err instanceof FigureError) {
      // A spec that cannot exist is refused before anything is drawn.
      return NextResponse.json({ error: err.message, reason: err.reason }, { status: 422 });
    }
    throw err;
  }

  const source = tikzDocument(scene);

  if (body.format === 'tikz') {
    return NextResponse.json({ source });
  }

  try {
    const svg = await compileTikz(source);
    // Fresh ids per response so several figures can share one document.
    const unique = namespaceSvgIds(svg, figurePrefix());
    return NextResponse.json({ svg: unique, source }, { headers: { 'cache-control': 'no-store' } });
  } catch (err) {
    if (err instanceof LatexUnavailableError) {
      return NextResponse.json({ error: err.message, reason: 'latex_unavailable' }, { status: 503 });
    }
    if (err instanceof LatexError) {
      return NextResponse.json(
        { error: err.message, reason: 'latex_failed', detail: err.log },
        { status: 500 },
      );
    }
    throw err;
  }
}
