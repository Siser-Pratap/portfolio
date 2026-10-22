import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const profile = { public_repos: 5, followers: 10, following: 3 }
const repo = { name: "portfolio", html_url: "https://github.com/Siser-Pratap/portfolio", updated_at: "2026-10-22", stargazers_count: 1, forks_count: 0 }
for (const status of [403, 404, 429]) for (const target of ["profile", "repo"]) {
  test(target + " upstream " + status + " returns an uncached error", async () => {
    const { GET } = await route("src/app/api/github-repos/route.ts")
    const original = globalThis.fetch
    let calls = 0, fail = true
    globalThis.fetch = async (url, options) => {
      calls++
      assert.equal(options.cache, "no-store")
      const isProfile = url.includes("/users/")
      return Response.json(fail && (target === "profile") === isProfile ? { message: "Upstream failure" } : isProfile ? profile : repo, { status: fail && (target === "profile") === isProfile ? status : 200 })
    }
    try {
      const req = { nextUrl: new URL("https://test/api?repos=portfolio") }
      const error = await GET(req)
      assert.equal(error.status, status === 404 ? 502 : 503)
      assert.equal(error.headers.get("cache-control"), "no-store")
      fail = false
      assert.equal((await GET(req)).status, 200)
      assert.equal(calls, 4)
      assert.equal((await GET(req)).headers.get("x-cache"), "HIT")
      assert.equal(calls, 4)
    } finally { globalThis.fetch = original }
  })
}
test("a malformed success body is never cached", async () => {
  const { GET } = await route("src/app/api/github-repos/route.ts")
  const original = globalThis.fetch
  let calls = 0
  globalThis.fetch = async () => { calls++; return Response.json({ message: "invalid" }) }
  try {
    const req = { nextUrl: new URL("https://test/api?repos=portfolio") }
    assert.equal((await GET(req)).status, 502)
    assert.equal((await GET(req)).status, 502)
    assert.equal(calls, 4)
  } finally { globalThis.fetch = original }
})
