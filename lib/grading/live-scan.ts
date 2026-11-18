/**
 * Frame handling for the live scanner.
 *
 * The phone keeps the camera open and asks one question several times a second:
 * "is a whole sheet in front of me right now?" That check must stay cheap, so it
 * runs on a small frame and only looks for the four registration marks. The
 * expensive read happens once, on the frame that is actually captured.
 */
import { detectAnchors, toGray, type RgbaImage } from './omr';
import type { SheetTemplate } from './sheet-template';

export type Frame = RgbaImage;

export type Shot = {
  frame: Frame;
  blob: Blob | null;
};

/** Draws video frames into one reused canvas, at whatever size is asked for. */
export class FrameGrabber {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private context(width: number, height: number): CanvasRenderingContext2D | null {
    if (typeof document === 'undefined') return null;
    if (!this.canvas) this.canvas = document.createElement('canvas');
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      // The size change invalidates the context, so it is rebuilt below.
      this.ctx = null;
    }
    if (!this.ctx) {
      // willReadFrequently keeps the canvas on the CPU: reading pixels back from
      // a GPU-backed canvas stalls the frame and makes the preview stutter.
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }
    return this.ctx;
  }

  /** Pixels only — used by the cheap "is a sheet visible" loop. */
  grab(video: HTMLVideoElement, maxEdge: number): Frame | null {
    const { width, height } = fit(video.videoWidth, video.videoHeight, maxEdge);
    if (!width || !height) return null;

    const ctx = this.context(width, height);
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, width, height);

    const image = ctx.getImageData(0, 0, width, height);
    return { width, height, data: image.data, channels: 4 };
  }

  /**
   * Pixels and a compressed copy in one pass, so the frame the reader inspects is
   * exactly the frame that gets uploaded.
   */
  async grabShot(video: HTMLVideoElement, maxEdge: number): Promise<Shot | null> {
    const { width, height } = fit(video.videoWidth, video.videoHeight, maxEdge);
    if (!width || !height) return null;

    const ctx = this.context(width, height);
    if (!ctx || !this.canvas) return null;
    ctx.drawImage(video, 0, 0, width, height);

    const image = ctx.getImageData(0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => {
      this.canvas!.toBlob((value) => resolve(value), 'image/jpeg', 0.9);
    });

    return { frame: { width, height, data: image.data, channels: 4 }, blob };
  }
}

function fit(width: number, height: number, maxEdge: number): { width: number; height: number } {
  if (!width || !height) return { width: 0, height: 0 };
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export type Preview = {
  found: boolean;
  /**
   * How much of the frame the printed sheet covers, 0..1, measured across the
   * registration marks. Those sit 17 mm inside the paper, so a sheet that fills
   * the frame reads about 0.84, not 1. Small means "move closer".
   */
  coverage: number;
  center: { x: number; y: number };
  /** Rough squareness: a sheet seen at a steep angle reads badly. */
  squareness: number;
};

export const NOT_FOUND: Preview = {
  found: false,
  coverage: 0,
  center: { x: 0.5, y: 0.5 },
  squareness: 0,
};

export function inspectFrame(frame: Frame, template: SheetTemplate): Preview {
  const anchors = detectAnchors(toGray(frame), template);
  if (!anchors) return NOT_FOUND;

  const xs = anchors.map((point) => point.x);
  const ys = anchors.map((point) => point.y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return NOT_FOUND;

  // The printed sheet is 210x297; deviation from that ratio means the phone is
  // tilted or the corners were picked up wrongly.
  const ratio = width / height;
  const squareness = Math.min(ratio, 0.7071) / Math.max(ratio, 0.7071);

  return {
    found: true,
    coverage: Math.min(width / frame.width, height / frame.height),
    center: { x: (left + right) / 2 / frame.width, y: (top + bottom) / 2 / frame.height },
    squareness,
  };
}

export type GateSettings = {
  /** The sheet must fill at least this much of the frame before shooting. */
  minCoverage: number;
  minSquareness: number;
  /** Consecutive good frames required, so a hand wobble does not trigger a shot. */
  frames: number;
  /** Quiet time after a shot, while the confirmation is on screen. */
  cooldownMs: number;
};

export const DEFAULT_GATE: GateSettings = {
  minCoverage: 0.45,
  minSquareness: 0.55,
  // Three good frames already cost ~660 ms, so the cooldown only has to cover
  // the confirmation flash; anything longer just throttles a fast teacher.
  frames: 3,
  cooldownMs: 600,
};

export type GateInput = {
  preview: Preview;
  /** How many consecutive frames have been good. */
  heldFrames: number;
  /** Milliseconds since the previous shot, or Infinity if there was none. */
  sinceLastShotMs: number;
  /** False right after a shot until the sheet has left the frame. */
  armed: boolean;
  settings?: GateSettings;
};

/**
 * Decides whether to take the picture now.
 *
 * Pure on purpose: the "feels instant" part of the scanner is this rule, and it
 * is the part that is easiest to get subtly wrong.
 */
export function shouldFire({ preview, heldFrames, sinceLastShotMs, armed, settings = DEFAULT_GATE }: GateInput): boolean {
  if (!armed) return false;
  if (sinceLastShotMs < settings.cooldownMs) return false;
  if (!preview.found) return false;
  if (preview.coverage < settings.minCoverage) return false;
  if (preview.squareness < settings.minSquareness) return false;
  return heldFrames >= settings.frames;
}

export type Guidance = {
  tone: 'idle' | 'aim' | 'closer' | 'steady' | 'ready';
  text: string;
};

/** What the teacher is told while aiming, in the order that actually helps. */
export function guideFor(preview: Preview, heldFrames: number, settings: GateSettings = DEFAULT_GATE): Guidance {
  if (!preview.found) return { tone: 'aim', text: 'Đưa 4 góc đen của phiếu vào khung' };
  if (preview.coverage < settings.minCoverage) return { tone: 'closer', text: 'Đưa máy lại gần hơn' };
  if (preview.squareness < settings.minSquareness) return { tone: 'aim', text: 'Giữ máy thẳng, đừng nghiêng' };
  if (heldFrames < settings.frames) return { tone: 'steady', text: 'Giữ yên…' };
  return { tone: 'ready', text: 'Đang nhận phiếu…' };
}
