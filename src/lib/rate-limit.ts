/**
 * Tiny in-memory sliding-window rate limiter (no dependencies).
 *
 * SERVERLESS LIMITATION: the counters live in this process's memory. On Vercel each function
 * instance has its own memory and instances are recycled, so the limit is per-instance and
 * best-effort — fine as a first line against casual spam on a low-traffic contact form, but
 * not a hard guarantee. For a strict, global limit move this to a shared store (e.g. Upstash
 * Redis via the Vercel Marketplace, or a Vercel Firewall rate-limit rule) keeping the same API.
 */

type Bucket = number[];

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the next request is allowed (0 when ok). */
  retryAfter: number;
};

export type RateLimiter = {
  check: (key: string) => RateLimitResult;
  reset: (key?: string) => void;
};

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const buckets = new Map<string, Bucket>();
  let lastSweep = 0;

  /** Drop idle keys now and then so memory can't grow without bound. */
  function sweep(now: number) {
    if (now - lastSweep < windowMs) return;
    lastSweep = now;
    for (const [key, hits] of buckets) {
      if (!hits.length || now - hits[hits.length - 1] > windowMs) buckets.delete(key);
    }
  }

  return {
    check(key) {
      const now = Date.now();
      sweep(now);
      const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
      if (hits.length >= limit) {
        buckets.set(key, hits);
        const retryAfter = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
        return { ok: false, limit, remaining: 0, retryAfter };
      }
      hits.push(now);
      buckets.set(key, hits);
      return { ok: true, limit, remaining: limit - hits.length, retryAfter: 0 };
    },
    reset(key) {
      if (key) buckets.delete(key);
      else buckets.clear();
    },
  };
}

/** Best-effort client identifier from proxy headers (Vercel sets x-forwarded-for / x-real-ip). */
export function getClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "anonymous";
}
