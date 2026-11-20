import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { jsonError, requireDatabase } from '@/lib/server/http';
import { getReleaseGradebook } from '@/lib/exam-release/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const user = await requireUser();
    const data = await getReleaseGradebook(user.id, (await params).id);
    const format = new URL(req.url).searchParams.get('format');
    if (format === 'csv') {
      const asciiSlug =
        data.release.title
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/gi, 'd')
          .replace(/[^a-zA-Z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase()
          .slice(0, 80) || 'lop';
      const utf8FileName = `bang-diem-${
        data.release.title.replace(/[^\p{L}\p{N}_.-]+/gu, '-').replace(/^-|-$/g, '').slice(0, 80) || 'lop'
      }.csv`;
      return new NextResponse(data.csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="bang-diem-${asciiSlug}.csv"; filename*=UTF-8''${encodeURIComponent(utf8FileName)}`,
          'Cache-Control': 'no-store',
        },
      });
    }
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}
