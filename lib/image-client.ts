'use client';

/**
 * Shrink a photo before it leaves the device.
 *
 * A phone photo is 3–6 MB; the model only needs about 2000 px on the long edge
 * to read handwriting, and the scanner downsamples anyway. Sending the original
 * wastes upload time, disk and tokens — and can exceed a request body limit.
 */

/** Long edge kept for grading; enough for handwriting and for the OMR bubbles. */
const MAX_EDGE = 2000;

/** Below this, re-encoding costs quality for no real gain. */
const SKIP_BYTES = 1_200_000;

const PASSTHROUGH = new Set(['image/gif']);

export function hasExtension(name: string, extension: string): boolean {
  return name.toLowerCase().endsWith(`.${extension}`);
}

export async function shrinkForUpload(file: File, maxEdge = MAX_EDGE): Promise<File> {
  if (PASSTHROUGH.has(file.type)) return file;
  if (!file.type.startsWith('image/')) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Unreadable in this browser (e.g. HEIC on desktop): let the server decide.
    return file;
  }

  try {
    const longEdge = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, maxEdge / longEdge);

    if (scale === 1 && file.size <= SKIP_BYTES) return file;

    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(bitmap, 0, 0, width, height);

    // Screenshots and scans are text: PNG keeps glyph edges clean. Photos are
    // better served by JPEG at a high quality.
    const keepLossless = file.type === 'image/png';
    const type = keepLossless ? 'image/png' : 'image/jpeg';

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, keepLossless ? undefined : 0.9),
    );
    if (!blob) return file;
    if (blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, '') || 'page';
    return new File([blob], `${base}.${keepLossless ? 'png' : 'jpg'}`, { type });
  } finally {
    bitmap.close?.();
  }
}
