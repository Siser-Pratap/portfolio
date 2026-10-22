import { NextRequest, NextResponse } from "next/server"
import { healthTarget } from "@/lib/health-targets"

export const dynamic = "force-dynamic"

const requests = new Map<string, { count: number; expires: number }>()
let total = { count: 0, expires: 0 }

function limited(headers: Headers): boolean {
  const now = Date.now()
  for (const [key, value] of requests) if (value.expires <= now) requests.delete(key)
  if (total.expires <= now) total = { count: 0, expires: now + 60_000 }
  if (++total.count > 120) return true
  const key = headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  const value = requests.get(key) ?? { count: 0, expires: now + 60_000 }
  if (requests.size >= 1000 && !requests.has(key)) return true
  requests.set(key, value)
  return ++value.count > 12
}

export async function GET(req: NextRequest) {
  const url = healthTarget(req.nextUrl.searchParams.get("url"))
  if (!url) return NextResponse.json({ error: "Unknown health target" }, { status: 400 })
  if (limited(req.headers)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } })
  }

  try {
    const start = Date.now()
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "portfolio-health/1.0" },
    })
    // Never follow redirects, even from an approved deployment.
    return NextResponse.json({ ok: res.ok, status: res.status, latency: Date.now() - start })
  } catch {
    return NextResponse.json({ ok: false, status: 0, latency: 0 })
  }
}
