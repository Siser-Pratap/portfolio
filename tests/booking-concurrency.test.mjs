import test from "node:test"
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { route } from "./helpers/load-module.mjs"
import { randomUUID } from "node:crypto"

const exec = promisify(execFile)
const integration = process.env.TEST_REDIS === "1"
const key = `portfolio:test:booking:reservations:${randomUUID()}`
const redis = async (command) => {
  // Never flush a database or touch the application's actual reservation key.
  const args = command.map(value => String(value === "portfolio:booking:reservations" ? key : value))
  if (process.env.TEST_REDIS_REST === "1") {
    const endpoint = new URL(process.env.UPSTASH_REDIS_REST_URL)
    assert.equal(endpoint.protocol, "https:")
    assert.ok(endpoint.hostname.endsWith(".upstash.io"))
    const response = await fetch(endpoint, {
      method: "POST", headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([command[0], ...args.slice(1)]), signal: AbortSignal.timeout(10000),
    })
    assert.ok(response.ok, `Redis returned HTTP ${response.status}`)
    const result = await response.json()
    assert.equal(result.error, undefined)
    return result.result
  }
  const container = process.env.TEST_REDIS_CONTAINER
  const host = process.env.TEST_REDIS_HOST ?? "127.0.0.1"
  assert.ok(["127.0.0.1", "localhost"].includes(host), "Integration tests require local disposable Redis")
  const cli = ["redis-cli", "-h", host, "-p", process.env.TEST_REDIS_PORT ?? "6379", "--json", ...args]
  const { stdout } = await exec(container ? "docker" : cli[0], container ? ["exec", container, ...cli] : cli.slice(1))
  return JSON.parse(stdout)
}

async function setup(t) {
  await redis(["DEL", key])
  t.after(() => redis(["DEL", key]))
  return route("lib/booking/reservations.ts", { "@/lib/server/redis": { redis } })
}

test("20 concurrent booking requests insert one event and send one confirmation", { skip: !integration }, async (t) => {
  const reservations = await setup(t)
  let inserted = 0, checked = 0, mailed = 0
  const { POST } = await route("src/app/api/booking/create/route.ts", {
    "@/lib/booking/reservations": { ...reservations },
    "@/lib/booking/slots": { isSlotBookable: () => true, formatDateKey: () => "test" },
    "@/lib/booking/rate-limit": { checkRateLimit: () => ({ allowed: true }), clientKey: () => "test" },
    "@/lib/mailer": { isMailConfigured: () => true },
    "@/lib/booking/email": { sendBookingEmails: async () => { mailed++ } },
    "@/lib/booking/providers": { getProvider: () => ({
      name: "google", busy: async () => { checked++; return [] },
      create: async () => { inserted++; return { joinUrl: "https://meet.google.com/abc-defg-hij" } },
    }) },
  })
  const booking = { name: "Visitor", email: "visitor@example.com", subject: "A call", guests: [], startsAt: new Date(Date.now() + 86400000).toISOString(), duration: 30, timezone: "Asia/Kolkata" }
  const responses = await Promise.all(Array.from({ length: 20 }, () => POST({ json: async () => booking, headers: new Headers() })))
  assert.equal(responses.filter(response => response.status === 200).length, 1)
  assert.equal(responses.filter(response => response.status === 409).length, 19)
  assert.equal(inserted, 1)
  assert.equal(checked, 1)
  assert.equal(mailed, 1)
})

test("reservations protect overlapping durations and buffers until explicitly released", { skip: !integration }, async (t) => {
  const { reserveSlot, releaseSlot } = await setup(t)
  const start = Date.now() + 86400000, minute = 60000
  assert.equal(await reserveSlot("a", start, start + 30 * minute, 10 * minute), true)
  assert.equal(await reserveSlot("a", start, start + 30 * minute, 10 * minute), true)
  assert.equal(await reserveSlot("b", start + 15 * minute, start + 60 * minute, 10 * minute), false)
  assert.equal(await reserveSlot("b", start + 35 * minute, start + 60 * minute, 10 * minute), false)
  assert.equal(await reserveSlot("b", start + 40 * minute, start + 60 * minute, 10 * minute), true)
  await releaseSlot("a", start, start + 30 * minute)
  assert.equal(await reserveSlot("c", start, start + 30 * minute, 10 * minute), true)
})

test("expired reservations are pruned without a cron worker", { skip: !integration }, async (t) => {
  const { reserveSlot } = await setup(t)
  const now = Date.now(), minute = 60000
  assert.equal(await reserveSlot("expired", now - 60 * minute, now - 30 * minute, 10 * minute), true)
  assert.equal(await reserveSlot("new", now + minute, now + 30 * minute, 10 * minute), true)
  assert.equal(await redis(["ZCARD", key]), 1)
})
