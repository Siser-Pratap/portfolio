import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const valid = { name: "Visitor", email: "visitor@example.com", phone: "", company: "", message: "I'd like to discuss a project.", turnstileToken: "test-token" }
const request = (body) => new Request("https://test/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })

test("contact rejects invalid and oversized inputs before sending mail", async () => {
  let sent = 0
  const { POST } = await route("src/app/api/contact/route.ts", {
    "@/lib/mailer": { escapeHtml: (value) => value, getTransporter: () => ({ sendMail: async () => { sent++ } }) },
    "@/lib/server/rate-limit": { rateLimit: async () => ({ allowed: true }) },
    "@/constants/site": { SITE: { url: "https://siserpratap.in" } },
  })
  for (const body of [{ ...valid, name: 2 }, { ...valid, email: "bad" }, { ...valid, message: "x".repeat(5001) }, { ...valid, name: "Header\r\nInjection" }, { ...valid, company: {} }]) assert.equal((await POST(request(body))).status, 400)
  assert.equal((await POST(request({ ...valid, message: "x".repeat(17000) }))).status, 413)
  assert.equal(sent, 0)
})

test("rate limit, spam failure and verification outage never send SMTP", async () => {
  let sent = 0, allowed = false, verified = false, outage = false
  const { POST } = await route("src/app/api/contact/route.ts", {
    "@/lib/mailer": { escapeHtml: (value) => value, getTransporter: () => ({ sendMail: async () => { sent++ } }) },
    "@/lib/server/rate-limit": { rateLimit: async () => ({ allowed, retryAfterSeconds: 60 }) },
    "@/lib/server/contact": { ...(await route("lib/server/contact.ts", { "@/constants/site": { SITE: { url: "https://siserpratap.in" } } })), verifyContactToken: async () => { if (outage) throw Error("down"); return verified } },
  })
  const blocked = await POST(request(valid))
  assert.equal(blocked.status, 429)
  assert.equal(blocked.headers.get("retry-after"), "60")
  allowed = true
  assert.equal((await POST(request(valid))).status, 400)
  outage = true
  assert.equal((await POST(request(valid))).status, 503)
  assert.equal(sent, 0)
  outage = false; verified = true
  assert.equal((await POST(request({ ...valid, honeypot: "bot" }))).status, 200)
  assert.equal(sent, 0)
  assert.equal((await POST(request(valid))).status, 200)
  assert.equal(sent, 1)
})

test("actual byte limit applies without Content-Length, including multibyte data", async () => {
  const { readJson } = await route("lib/server/request.ts")
  const req = request({ text: "😊".repeat(100) })
  assert.equal(req.headers.has("content-length"), false)
  await assert.rejects(readJson(req, 100), (error) => error.status === 413)
})
