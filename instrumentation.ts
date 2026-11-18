/**
 * Next.js instrumentation hook — runs once when the server process starts.
 *
 * This is where the grading worker is launched, so papers are processed even
 * when nobody has a page open.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  try {
    const { startWorker } = await import('./lib/server/jobs');
    startWorker();
  } catch (error) {
    console.error('[instrumentation] không khởi động được worker:', error);
  }
}
