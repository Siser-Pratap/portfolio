import { NextRequest, NextResponse } from "next/server"

type DeployData = {
  deployedAt: string
}

const cache = new Map<string, { data: DeployData; expiresAt: number }>()
const TTL = 10 * 60 * 1000 // 10 minutes

export async function GET(req: NextRequest) {
  const project = req.nextUrl.searchParams.get("project")
  if (!project) return NextResponse.json({ error: "Missing project" }, { status: 400 })

  const token = process.env.VERCEL_TOKEN
  if (!token) return NextResponse.json({ error: "VERCEL_TOKEN not configured" }, { status: 503 })

  const hit = cache.get(project)
  if (hit && Date.now() < hit.expiresAt) {
    return NextResponse.json(hit.data, { headers: { "X-Cache": "HIT" } })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?app=${encodeURIComponent(project)}&state=READY&limit=1`,
      {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    clearTimeout(timer)

    if (!res.ok) {
      return NextResponse.json({ error: `Vercel ${res.status}` }, { status: 502 })
    }

    const body = await res.json() as { deployments?: { readyAt?: number; createdAt?: number }[] }
    const deployment = body.deployments?.[0]

    if (!deployment) {
      return NextResponse.json({ error: "No deployments found" }, { status: 404 })
    }

    const ms = deployment.readyAt ?? deployment.createdAt
    const deployedAt = ms ? new Date(ms).toISOString() : null

    if (!deployedAt) {
      return NextResponse.json({ error: "No timestamp on deployment" }, { status: 404 })
    }

    const data: DeployData = { deployedAt }
    cache.set(project, { data, expiresAt: Date.now() + TTL })
    return NextResponse.json(data)
  } catch {
    clearTimeout(timer)
    return NextResponse.json({ error: "Upstream timeout" }, { status: 504 })
  }
}
