'use client';

/**
 * Optical mark reading in the browser.
 *
 * The photo is already decoded for the preview, so sampling it here costs
 * nothing and keeps the pixel work on the device. Only the resulting marks are
 * sent to the server, which still re-checks them against the frozen rubric.
 */
import { readSheet, type OmrResult, type RgbaImage } from './omr';
import type { SheetTemplate } from './sheet-template';

/** Enough resolution for an 8.7px bubble to survive, without huge buffers. */
const MAX_EDGE = 2200;

export async function imageFromFile(file: File): Promise<RgbaImage> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Trình duyệt không hỗ trợ đọc ảnh.');

    context.drawImage(bitmap, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);
    return { data: pixels.data, width, height, channels: 4 };
  } finally {
    bitmap.close?.();
  }
}

export async function readSheetFromFile(file: File, template: SheetTemplate): Promise<OmrResult> {
  const image = await imageFromFile(file);
  return readSheet(image, template);
}

/** Human summary for the capture screen, in Vietnamese. */
export function describeOmr(result: OmrResult): string {
  if (!result.quality.anchorsFound) return 'Không nhận ra phiếu chuẩn, sẽ chấm bằng AI.';

  if (result.quality.anchorsSuspect) {
    const why = result.quality.warnings[0] ?? '4 góc không khớp khổ phiếu.';
    return `Nghi ngờ đọc lệch: ${why} Trang này đã bị đánh dấu cần xem lại.`;
  }

  const read = result.answers.filter((answer) => answer.picked !== null).length;
  const doubtful = result.answers.filter((answer) => answer.flags.length > 0).length;

  const sbd = result.sbd
    ? result.sbd.code
      ? `SBD ${result.sbd.code}. `
      : `Chưa đọc được SBD (${result.sbd.digits}). `
    : '';

  if (read === 0) return `${sbd}Phiếu trống hoặc chưa tô, sẽ chấm bằng AI.`;
  if (doubtful > 0) return `${sbd}Đọc được ${read} câu, ${doubtful} câu cần kiểm tra lại.`;
  return `${sbd}Đọc được ${read} câu trắc nghiệm.`;
}
