/**
 * In-memory sliding-window limiter.
 *
 * State lives per serverless instance, so it resets on cold start and is not
 * shared across regions. That is deliberate: at this traffic level it costs
 * nothing and still stops the obvious scripted-flood case. Anything stronger
 * would mean adding Redis, which the whole design avoids.
 */
const hits = new Map<string, number[]>()

const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 3

export function checkRateLimit(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = Math.min(...recent)
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((WINDOW_MS - (now - oldest)) / 1000),
    }
  }

  recent.push(now)
  hits.set(key, recent)

  // Opportunistic sweep so the map cannot grow unbounded.
  if (hits.size > 500) {
    for (const [k, timestamps] of hits) {
      if (timestamps.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

/** Best-effort client IP from proxy headers. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headers.get("x-real-ip") ?? "unknown"
}
