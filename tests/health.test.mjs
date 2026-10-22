import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

test("health rejects unapproved URLs without making any network request", async () => {
  const { GET } = await route("src/app/api/health/route.ts")
  const original = globalThis.fetch
  let calls = 0
  globalThis.fetch = async () => { calls++; throw Error("Unexpected network") }
  try {
    for (const url of ["http://localhost", "https://127.0.0.1", "https://10.0.0.1", "http://169.254.169.254/latest/meta-data/", "https://example.com", "https://[::1]", "https://meetpro-siser-pratap.vercel.app.evil.com/", "https://meetpro-siser-pratap.vercel.app/private", "https://user:pass@meetpro-siser-pratap.vercel.app/"]) {
      const req = { nextUrl: new URL("https://portfolio.test/api/health?url=" + encodeURIComponent(url)), headers: new Headers() }
      assert.equal((await GET(req)).status, 400, url)
    }
    assert.equal(calls, 0)
  } finally { globalThis.fetch = original }
})

test("health disables redirect following and rate limits approved probes", async () => {
  const { GET } = await route("src/app/api/health/route.ts")
  const original = globalThis.fetch
  let calls = 0
  globalThis.fetch = async (url, options) => {
    calls++
    assert.equal(options.redirect, "manual")
    return new Response(null, { status: 302, headers: { Location: "http://169.254.169.254/" } })
  }
  try {
    const req = { nextUrl: new URL("https://portfolio.test/api/health?url=https%3A%2F%2Fmeetpro-siser-pratap.vercel.app%2F"), headers: new Headers() }
    for (let i = 0; i < 12; i++) assert.equal((await (await GET(req)).json()).ok, false)
    assert.equal((await GET(req)).status, 429)
    assert.equal(calls, 12)
  } finally { globalThis.fetch = original }
})
