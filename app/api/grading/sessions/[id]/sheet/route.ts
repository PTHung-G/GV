/**
 * GET /api/grading/sessions/[id]/sheet — the printable answer sheet.
 *
 * Returns a complete HTML document (one page per student when the class has a
 * roster) so the teacher can print it directly, or the raw template geometry
 * with `?format=json` for the scanner.
 */
import { query, queryOne } from '@/lib/server/db';
import { NextResponse } from 'next/server';
import { jsonError, requireDatabase } from '@/lib/server/http';
import { authorizeTeacher } from '@/lib/grading/access';
import { rubricFromStored } from '@/lib/grading/rubric';
import { renderSheetHtml } from '@/lib/grading/sheet-template';
import { buildSheetTemplate } from '@/lib/grading/sheet-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    await authorizeTeacher(id);
    const published=await queryOne<{sheet_html:string;template:unknown}>('select sheet_html,template from exam_release_variants where session_id=$1',[id]);
    if(published){
      if(new URL(req.url).searchParams.get('format')==='json')return NextResponse.json({success:true,template:published.template});
      return new NextResponse(published.sheet_html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    }

    const session = await queryOne<{
      title: string;
      class_name: string | null;
      class_id: string | null;
      subject: string | null;
      payload: unknown;
      sheet_template: unknown;
    }>(
      `select s.title, s.class_name, s.class_id, snap.subject, r.payload, s.sheet_template
         from grading_sessions s
         join exam_snapshots snap on snap.id = s.snapshot_id
         join rubric_revisions r on r.id = s.rubric_revision_id
        where s.id = $1`,
      [id],
    );
    if (!session) return NextResponse.json({ error: 'Không tìm thấy đợt chấm.' }, { status: 404 });

    const rubric = rubricFromStored(session.payload);
    const format = new URL(req.url).searchParams.get('format');

    // The HTML below is always rebuilt from the current builder, so the geometry
    // must be too: serving a template frozen by an older build would make the
    // scanner sample bubbles that the printed page does not draw.
    const template = buildSheetTemplate(rubric, {
      title: session.title,
      subject: session.subject,
      className: session.class_name,
    });

    if (JSON.stringify(template) !== JSON.stringify(session.sheet_template)) {
      // Best-effort: a read-only replica still prints correctly, it just keeps
      // recomputing the geometry.
      await query(`update grading_sessions set sheet_template = $2 where id = $1`, [
        id,
        JSON.stringify(template),
      ]).catch(() => undefined);
    }

    if (format === 'json') {
      return NextResponse.json({ success: true, template });
    }

    // One blank sheet by default: the student writes their name and bubbles their
    // candidate number, so a class shares a single printed page. `?perStudent=1`
    // keeps the older behaviour of pre-printing one sheet per roster entry.
    const perStudent = new URL(req.url).searchParams.get('perStudent') === '1';
    const students =
      perStudent && session.class_id
        ? await query<{ code: string | null; name: string }>(
            `select code, name from students where class_id = $1 order by sort_index, name`,
            [session.class_id],
          )
        : [];

    const html = await renderSheetHtml(rubric, {
      title: session.title,
      subject: session.subject,
      className: session.class_name,
      sessionId: id,
      students,
    });

    return new NextResponse(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
