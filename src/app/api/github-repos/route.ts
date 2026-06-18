import { NextRequest, NextResponse } from "next/server"

const cache = new Map<string, { data: unknown; expiresAt: number }>()
const TTL = 10 * 60 * 1000 // 10 minutes

const ghHeaders = () => ({
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-site/1.0",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
})

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get("repos")?.split(",").filter(Boolean) ?? []

  const cacheKey = `repos:${[...slugs].sort().join(",")}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() < hit.expiresAt) {
    return NextResponse.json(hit.data, { headers: { "X-Cache": "HIT" } })
  }

  try {
    const headers = ghHeaders()
    const [profileRes, ...repoResponses] = await Promise.all([
      fetch("https://api.github.com/users/Siser-Pratap", { headers }),
      ...slugs.map((slug) =>
        fetch(`https://api.github.com/repos/Siser-Pratap/${slug}`, { headers })
      ),
    ])

    const profile = await profileRes.json()
    const repos = await Promise.all(repoResponses.map((r) => r.json()))

    const data = {
      profile: {
        public_repos: profile.public_repos as number,
        followers: profile.followers as number,
        following: profile.following as number,
      },
      repos: repos.map((r) => ({
        name: r.name as string,
        description: (r.description as string | null) ?? null,
        stars: r.stargazers_count as number,
        forks: r.forks_count as number,
        language: (r.language as string | null) ?? null,
        updated_at: r.updated_at as string,
        topics: (r.topics as string[]) ?? [],
        html_url: r.html_url as string,
      })),
    }

    cache.set(cacheKey, { data, expiresAt: Date.now() + TTL })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 502 })
  }
}
