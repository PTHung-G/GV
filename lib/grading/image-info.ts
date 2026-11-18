/**
 * Reads pixel dimensions straight from the file header.
 *
 * Uploads are validated by content, not by the declared MIME type, and knowing
 * the real size lets the UI warn about a photo that is too small to read
 * without decoding the whole image on the server.
 */
export type ImageSize = { width: number; height: number; mimeType: string };

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** Sniffs the magic bytes; the browser's declared type is not trusted. */
export function sniffImageType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') return 'image/webp';

  return null;
}

export function readImageSize(buffer: Buffer): ImageSize | null {
  const mimeType = sniffImageType(buffer);
  if (!mimeType) return null;

  if (mimeType === 'image/png') {
    // IHDR is always the first chunk: width and height are big-endian at 16..24.
    if (buffer.length < 24) return null;
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), mimeType };
  }

  if (mimeType === 'image/jpeg') {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      // Start-of-frame markers carry the dimensions; the rest are skipped.
      const isStartOfFrame =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      const segmentLength = buffer.readUInt16BE(offset + 2);
      if (isStartOfFrame) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
          mimeType,
        };
      }
      offset += 2 + segmentLength;
    }
    return null;
  }

  // WebP: three container variants, all reachable from the VP8/VP8L/VP8X chunk.
  const fourCc = buffer.toString('ascii', 12, 16);
  if (fourCc === 'VP8X' && buffer.length >= 30) {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
      mimeType,
    };
  }
  if (fourCc === 'VP8 ' && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
      mimeType,
    };
  }
  if (fourCc === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
      mimeType,
    };
  }

  return null;
}

export function extensionFor(mimeType: string): string {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}
