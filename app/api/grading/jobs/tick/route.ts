/**
 * POST /api/grading/jobs/tick — run the queue by hand.
 *
 * The background worker already polls; this exists so a teacher can push a
 * stuck paper through immediately and so tests can grade deterministically
 * instead of waiting for the interval.
 */
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { jsonError, requireDatabase } from '@/lib/server/http';
import { drainJobs } from '@/lib/server/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    requireDatabase();
    await requireUser();

    const limit = Number(new URL(req.url).searchParams.get('limit') ?? '5');
    const processed = await drainJobs(Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 5);

    return NextResponse.json({ success: true, processed });
  } catch (error) {
    return jsonError(error);
  }
}
