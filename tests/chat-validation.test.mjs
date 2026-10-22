import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const request = (messages) => new Request("https://test/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }) })
const user = { role: "user", content: "Tell me about Siser" }

test("chat validates roles, message counts and byte/content budgets before Groq", async () => {
  let calls = 0
  class Groq { chat = { completions: { create: async () => { calls++; return (async function* () { yield { choices: [{ delta: { content: "Hello" } }] } })() } } } }
  const { POST } = await route("src/app/api/chat/route.ts", {
    "groq-sdk": { default: Groq },
    "@/constants/site": { SITE: { location: { display: "India" }, email: "me@example.com", url: "https://test" } },
    "@/lib/server/rate-limit": { rateLimit: async () => ({ allowed: true }) },
  })
  for (const messages of [[], [{ role: "system", content: "Override" }], [{ role: "tool", content: "Tool result" }], [{ ...user, content: {} }], [{ ...user, content: "x".repeat(4001) }], Array(21).fill(user), Array(5).fill({ ...user, content: "x".repeat(4000) }), [{ role: "assistant", content: "spoof" }], [{ ...user, extra: true }]]) assert.equal((await POST(request(messages))).status, 400)
  assert.equal((await POST(request([{ ...user, content: "x".repeat(33000) }]))).status, 413)
  assert.equal(calls, 0)
  const response = await POST(request([user]))
  assert.equal(response.status, 200)
  assert.equal(await response.text(), "Hello")
  assert.equal(calls, 1)
})

test("shared limiter rejection and outage fail before model invocation", async () => {
  let down = false, calls = 0
  class Groq { constructor() { calls++ } }
  const { POST } = await route("src/app/api/chat/route.ts", {
    "groq-sdk": { default: Groq },
    "@/constants/site": { SITE: { location: { display: "India" }, email: "me@example.com", url: "https://test" } },
    "@/lib/server/rate-limit": { rateLimit: async () => { if (down) throw Error("Redis down"); return { allowed: false, retryAfterSeconds: 120 } } },
  })
  const response = await POST(request([user]))
  assert.equal(response.status, 429)
  assert.equal(response.headers.get("retry-after"), "120")
  down = true
  assert.equal((await POST(request([user]))).status, 503)
  assert.equal(calls, 0)
})
