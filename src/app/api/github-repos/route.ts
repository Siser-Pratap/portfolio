import { NextRequest, NextResponse } from "next/server"

const cache = new Map<string, { data: unknown; expiresAt: number }>()
const TTL = 10 * 60 * 1000 // 10 minutes

class UpstreamError extends Error {
  status: number
  constructor(status: number) { super("GitHub upstream request failed"); this.status = status }
}

async function checkedJson(response: Response) {
  if (!response.ok) throw new UpstreamError(response.status)
  return response.json()
}

const ghHeaders = () => ({
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-site/1.0",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
})

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get("repos")?.split(",").filter(Boolean) ?? []

  if (slugs.length > 20 || slugs.some((slug) => !/^[A-Za-z0-9_.-]{1,100}$/.test(slug))) {
    return NextResponse.json({ error: "Invalid repository list" }, { status: 400 })
  }

  const cacheKey = `repos:${[...slugs].sort().join(",")}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() < hit.expiresAt) {
    return NextResponse.json(hit.data, { headers: { "X-Cache": "HIT" } })
  }

  try {
    const headers = ghHeaders()
    const [profileRes, ...repoResponses] = await Promise.all([
      fetch("https://api.github.com/users/Siser-Pratap", { headers, cache: "no-store" }),
      ...slugs.map((slug) =>
        fetch(`https://api.github.com/repos/Siser-Pratap/${slug}`, { headers, cache: "no-store" })
      ),
    ])

    const profile = await checkedJson(profileRes)
    const repos = await Promise.all(repoResponses.map(checkedJson))
    if (!profile || !["public_repos", "followers", "following"].every((key) => typeof profile[key] === "number") ||
        repos.some((repo) => !repo || typeof repo.name !== "string" || typeof repo.html_url !== "string" || typeof repo.updated_at !== "string" || typeof repo.stargazers_count !== "number" || typeof repo.forks_count !== "number")) {
      throw new UpstreamError(502)
    }

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

    if (cache.size >= 100) cache.clear()
    cache.set(cacheKey, { data, expiresAt: Date.now() + TTL })
    return NextResponse.json(data)
  } catch (error) {
    const rateLimited = error instanceof UpstreamError && [403, 429].includes(error.status)
    return NextResponse.json(
      { error: rateLimited ? "GitHub is temporarily rate limited. Please try again later." : "Failed to fetch valid GitHub data" },
      { status: rateLimited ? 503 : 502, headers: { "Cache-Control": "no-store", ...(rateLimited ? { "Retry-After": "60" } : {}) } },
    )
  }
}
