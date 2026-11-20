import { HttpError } from './http';

/**
 * Limits concurrent heavy subprocess or model calls without external services.
 */
export class Semaphore {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly maxConcurrent: number) {}

  async acquire(): Promise<() => void> {
    if (this.active < this.maxConcurrent) {
      this.active += 1;
      return () => this.release();
    }
    return new Promise((resolve) => {
      this.waiters.push(() => {
        this.active += 1;
        resolve(() => this.release());
      });
    });
  }

  private release(): void {
    this.active = Math.max(0, this.active - 1);
    const next = this.waiters.shift();
    if (next) next();
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }
}

type WindowBucket = { count: number; resetAt: number };
const buckets = new Map<string, WindowBucket>();
let lastSweep = 0;

function sweepExpired(now: number): void {
  if (now - lastSweep < 60_000 && buckets.size < 2_000) return;
  lastSweep = now;
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
}

export function enforceRateLimit(
  namespace: string,
  actorKey: string,
  maxRequests: number,
  windowMs: number,
): void {
  const now = Date.now();
  sweepExpired(now);
  const key = `${namespace}:${actorKey}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= maxRequests) {
    throw new HttpError(429, 'Thao tác quá nhanh. Vui lòng đợi giây lát rồi thử lại.', 'rate_limited');
  }
  current.count += 1;
}
