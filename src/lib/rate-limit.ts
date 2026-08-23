type Bucket = { count: number; resetAt: number }

// In-memory token buckets. Suitable for single-instance dev/small prod;
// swap for Upstash Redis (same interface) when running multi-instance.
const globalForLimiter = globalThis as unknown as {
  __internedgeRateLimiter?: Map<string, Bucket>
}

const buckets: Map<string, Bucket> =
  globalForLimiter.__internedgeRateLimiter ?? new Map()
globalForLimiter.__internedgeRateLimiter = buckets

/**
 * Fixed-window rate limiter.
 * Returns false when the caller exceeded `limit` within `windowMs`.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    // Opportunistic cleanup to keep the map bounded.
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k)
      }
    }
    return true
  }

  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}
