/**
 * GET /api/grading/sessions/[id]/events — live progress over SSE.
 *
 * The desktop workspace subscribes while papers are being scanned on a phone,
 * so counts and statuses move without polling from the browser.
 */
import { jsonError, requireDatabase } from '@/lib/server/http';
import { authorizeSession } from '@/lib/grading/access';
import { queryOne } from '@/lib/server/db';
import { sessionProgress } from '@/lib/grading/submissions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const POLL_MS = 2_000;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    await authorizeSession(id);

    const encoder = new TextEncoder();
    let timer: ReturnType<typeof setInterval> | null = null;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let lastPayload = '';

        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        const tick = async () => {
          try {
            const counts = await sessionProgress(id);
            const changed = await queryOne<{ revision: string }>(
              `select concat(s.updated_at::text, ':', coalesce((select max(sub.updated_at)::text from submissions sub where sub.session_id = s.id), '')) as revision from grading_sessions s where s.id = $1`, [id],
            );
            const progress = { ...counts, revision: changed?.revision ?? '' };
            const payload = JSON.stringify(progress);
            // Only push when something actually changed.
            if (payload !== lastPayload) {
              lastPayload = payload;
              send('progress', progress);
            }
          } catch {
            // A transient database error must not kill the stream.
          }
        };

        const close = () => {
          if (timer) clearInterval(timer);
          timer = null;
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        };

        req.signal.addEventListener('abort', close);

        send('hello', { sessionId: id });
        await tick();
        timer = setInterval(tick, POLL_MS);
      },
      cancel() {
        if (timer) clearInterval(timer);
        timer = null;
      },
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
