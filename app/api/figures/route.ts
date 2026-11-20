/**
 * Figure rendering — POST /api/figures
 *
 * Takes a small, validated specification (never raw TeX) and returns inline SVG.
 * Uses TikZ when TeX is available, falling back seamlessly to our pure-TS SVG
 * solver so geometry figures always work in every environment.
 */
import { NextRequest, NextResponse } from 'next/server';
import { FIGURE_KINDS, FIGURE_META, FigureError, solve, type FigureSpec } from '@/lib/geometry/spec';
import { sceneToSvg } from '@/lib/geometry/svg';
import { tikzDocument } from '@/lib/geometry/tikz';
import { requireUser } from '@/lib/server/auth';
import { isDatabaseConfigured } from '@/lib/server/db';
import { jsonError } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
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
    available: true,
    latexAvailable: await latexAvailable(),
  });
}

export async function POST(req: NextRequest) {
  try {
    if (isDatabaseConfigured()) {
      const user = await requireUser();
      enforceRateLimit('figures', user.id, 40, 60_000);
    }

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
        return NextResponse.json({ error: err.message, reason: err.reason }, { status: 422 });
      }
      throw err;
    }

    const source = tikzDocument(scene);
    if (body.format === 'tikz') {
      return NextResponse.json({ source });
    }

    let rawSvg: string;
    try {
      rawSvg = await compileTikz(source);
    } catch (err) {
      if (err instanceof LatexUnavailableError) {
        rawSvg = sceneToSvg(scene);
      } else if (err instanceof LatexError) {
        return NextResponse.json(
          { error: err.message, reason: 'latex_failed', detail: err.log },
          { status: 500 },
        );
      } else {
        throw err;
      }
    }

    const unique = namespaceSvgIds(rawSvg, figurePrefix());
    return NextResponse.json({ svg: unique, source }, { headers: { 'cache-control': 'no-store' } });
  } catch (err) {
    return jsonError(err);
  }
}
