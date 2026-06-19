import { NextRequest, NextResponse } from "next/server"

type CommitData = {
  sha: string
  message: string
  date: string
}

// In-memory cache — resets per server instance, prevents GitHub rate-limit abuse
const cache = new Map<string, { data: CommitData; expiresAt: number }>()
const TTL = 10 * 60 * 1000 // 10 minutes

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get("repo")
  if (!repo) return NextResponse.json({ error: "Missing repo" }, { status: 400 })

  const hit = cache.get(repo)
  if (hit && Date.now() < hit.expiresAt) {
    return NextResponse.json(hit.data, { headers: { "X-Cache": "HIT" } })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(
      `https://api.github.com/repos/Siser-Pratap/${repo}/commits?per_page=1`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "portfolio-site/1.0",
          // Optional: set GITHUB_TOKEN env var to raise rate limit from 60 to 5000 req/hr
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    )
    clearTimeout(timer)

    if (!res.ok) {
      return NextResponse.json({ error: `GitHub ${res.status}` }, { status: 502 })
    }

    const [commit] = (await res.json()) as {
      sha: string
      commit: { message: string; author: { date: string } }
    }[]

    const data: CommitData = {
      sha: commit.sha.slice(0, 7),
      message: commit.commit.message.split("\n")[0].slice(0, 72),
      date: commit.commit.author.date,
    }

    cache.set(repo, { data, expiresAt: Date.now() + TTL })
    return NextResponse.json(data)
  } catch {
    clearTimeout(timer)
    return NextResponse.json({ error: "Upstream timeout" }, { status: 504 })
  }
}
