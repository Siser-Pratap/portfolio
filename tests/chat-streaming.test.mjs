import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

test("bold filtering is invariant across every split and single-character deltas", async () => {
  const { createBoldMarkerFilter } = await route("lib/chat/plain-text.ts")
  for (const input of ["**bold**", "a **bold** and *single* star", "***three***", "trailing*", "", "**😊**\nnext"]) {
    const expected = input.replace(/\*\*/g, "")
    for (let i = 0; i <= input.length; i++) {
      const filter = createBoldMarkerFilter()
      assert.equal(filter.push(input.slice(0, i)) + filter.push(input.slice(i)) + filter.finish(), expected)
    }
    const filter = createBoldMarkerFilter()
    assert.equal(Array.from(input).map((chunk) => filter.push(chunk)).join("") + filter.finish(), expected)
    assert.equal(filter.finish(), "")
  }
})

test("the actual route normalizes markers across model deltas", async () => {
  class Groq { chat = { completions: { create: async () => (async function* () { for (const content of ["*", "*bo", "ld*", "* and a single", "*"]) yield { choices: [{ delta: { content } }] } })() } } }
  const { POST } = await route("src/app/api/chat/route.ts", {
    "groq-sdk": { default: Groq },
    "@/constants/site": { SITE: { location: { display: "India" }, email: "me@example.com", url: "https://test" } },
    "@/lib/server/rate-limit": { rateLimit: async () => ({ allowed: true }) },
  })
  const response = await POST(new Request("https://test/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }) }))
  assert.equal(response.status, 200)
  assert.equal(await response.text(), "bold and a single*")
})
