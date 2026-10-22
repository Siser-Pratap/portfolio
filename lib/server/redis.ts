/** Shared Redis REST connection (Upstash-compatible). Never fall back to process memory. */
export async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token || new URL(url).protocol !== "https:") throw new Error("Shared Redis is not configured")
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`Redis unavailable (${response.status})`)
  const body = await response.json() as { result: T; error?: string }
  if (body.error) throw new Error("Redis command failed")
  return body.result
}
