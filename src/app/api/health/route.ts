import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)

  try {
    const start = Date.now()
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "User-Agent": "portfolio-health/1.0" },
    })
    clearTimeout(timer)
    const latency = Date.now() - start
    return NextResponse.json({ ok: res.ok || res.status < 400, status: res.status, latency })
  } catch {
    clearTimeout(timer)
    return NextResponse.json({ ok: false, status: 0, latency: 0 })
  }
}
