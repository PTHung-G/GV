import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { readJson, HttpError, jsonError } from '@/lib/server/http';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { buildSheetTemplate, renderSheetHtml } from '@/lib/grading/sheet-template';
import type { Rubric } from '@/lib/grading/rubric';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await requireUser();
    validateAuthRequest(request);
    const body = await readJson<{ title?: unknown; numbers?: unknown }>(request);
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 300 || !Array.isArray(body.numbers) || body.numbers.length < 1 || body.numbers.length > 60 || body.numbers.some(n => !Number.isInteger(n) || n < 1 || n > 999) || new Set(body.numbers).size !== body.numbers.length) {
      throw new HttpError(400, 'Phiếu cần từ 1 đến 60 câu A–D, số câu không được trùng.', 'invalid_sheet');
    }
    // Answers exist only to satisfy the shared layout model. They are never printed,
    // persisted, scored, or returned. This is not a grading rubric or linked session.
    const rubric: Rubric = { version: 1, totalPoints: body.numbers.length, questions: body.numbers.map(no => ({ no, type: 'mc', points: 1, answer: 'A' })) };
    const options = { title: body.title.trim(), schoolName: '', note: 'Phiếu in độc lập, chưa liên kết đợt chấm. Dùng bút chì tô kín một ô A–D ở mỗi câu.' };
    const template = buildSheetTemplate(rubric, options);
    if (template.bubbles.length !== body.numbers.length * 4) throw new HttpError(400, 'Số câu vượt khả năng bố trí phiếu.', 'invalid_sheet');
    const html = await renderSheetHtml(rubric, options);
    return NextResponse.json({ html }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return jsonError(error); }
}
