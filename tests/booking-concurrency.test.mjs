import test from "node:test"
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { route } from "./helpers/load-module.mjs"

const exec = promisify(execFile)
const integration = process.env.TEST_REDIS === "1"
const redis = async (command) => {
  const { stdout } = await exec("redis-cli", ["--json", ...command.map(String)])
  return JSON.parse(stdout)
}

test("20 simultaneous requests for one slot insert exactly one event", { skip: !integration }, async () => {
  await redis(["FLUSHDB"])
  const mocks = { "@/lib/server/redis": { redis } }
  const store = await route("lib/booking/store.ts", mocks)
  const reservations = await route("lib/booking/reservations.ts", mocks)
  let inserted = 0, checked = 0
  const { createBooking } = await route("lib/booking/service.ts", {
    "@/constants/settings": { SETTINGS: { booking: { bufferMinutes: 10 } } },
    "./store": { ...store }, "./reservations": { ...reservations },
    "./slots": { isSlotBookable: () => true },
    "./providers": { getProvider: () => ({ name: "google", find: async () => null, busy: async () => { checked++; return [] }, create: async () => { inserted++; return { joinUrl: "https://meet.google.com/test" } } }) },
  })
  const request = { name: "Visitor", email: "visitor@example.com", subject: "A call", guests: [], startsAt: new Date(Date.now() + 86400000).toISOString(), duration: 30, timezone: "Asia/Kolkata" }
  const results = await Promise.allSettled(Array.from({ length: 20 }, (_, i) => createBooking(request, "key-" + i)))
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1)
  assert.equal(inserted, 1)
  assert.equal(checked, 1)
  for (const result of results.filter((result) => result.status === "rejected")) assert.equal(result.reason.status, 409)
})

test("reservations protect overlapping durations and buffers, retain uncertain inserts", { skip: !integration }, async () => {
  await redis(["FLUSHDB"])
  const { reserveSlot, releaseSlot } = await route("lib/booking/reservations.ts", { "@/lib/server/redis": { redis } })
  const start = Date.now() + 86400000, minute = 60000
  assert.equal(await reserveSlot("a", start, start + 30 * minute, 10 * minute), true)
  assert.equal(await reserveSlot("a", start, start + 30 * minute, 10 * minute), true)
  assert.equal(await reserveSlot("b", start + 15 * minute, start + 60 * minute, 10 * minute), false)
  assert.equal(await reserveSlot("b", start + 35 * minute, start + 60 * minute, 10 * minute), false)
  assert.equal(await reserveSlot("b", start + 40 * minute, start + 60 * minute, 10 * minute), true)
  await releaseSlot("a", start, start + 30 * minute)
  assert.equal(await reserveSlot("c", start, start + 30 * minute, 10 * minute), true)
})
