import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const request = { name: "Visitor", email: "visitor@example.com", subject: "A call", guests: [], startsAt: "2026-11-02T05:00:00.000Z", duration: 30, timezone: "Asia/Kolkata" }
const reservationMocks = { "./reservations": { reserveSlot: async () => true, releaseSlot: async () => {} }, "@/constants/settings": { SETTINGS: { booking: { bufferMinutes: 10 } } } }

test("persisted retries return the same event; key reuse with different details is rejected", async () => {
  const records = new Map()
  let inserts = 0
  const store = {
    claimBooking: async (id, fingerprint) => {
      const record = records.get(id)
      if (record?.fingerprint !== undefined && record.fingerprint !== fingerprint) return "mismatch"
      if (record?.result) return JSON.stringify(record.result)
      records.set(id, { fingerprint })
      return "claimed"
    },
    completeBooking: async (id, result) => { records.get(id).result = result },
    releaseBooking: async () => {},
  }
  const { createBooking } = await route("lib/booking/service.ts", {
    ...reservationMocks,
    "./providers": { getProvider: () => ({ name: "google", find: async () => null, busy: async () => [], create: async () => { inserts++; return { joinUrl: "https://meet.google.com/test" } } }) },
    "./slots": { isSlotBookable: () => true },
    "./store": store,
  })
  const first = await createBooking(request, "stable-key")
  assert.equal(first.emailStatus, "pending")
  assert.deepEqual(await createBooking(request, "stable-key"), first)
  assert.equal(inserts, 1)
  await assert.rejects(createBooking({ ...request, name: "Someone else" }, "stable-key"), (error) => error.status === 409)
})

test("uncertain inserts recover by ID without another insert or a freeBusy check", async () => {
  let inserted = 0, busy = 0
  const { createBooking } = await route("lib/booking/service.ts", {
    ...reservationMocks,
    "./providers": { getProvider: () => ({ find: async () => ({ joinUrl: "https://meet.google.com/existing" }), busy: async () => { busy++; return [] }, create: async () => { inserted++ } }) },
    "./slots": { isSlotBookable: () => true },
    "./store": { claimBooking: async () => "claimed", completeBooking: async () => {}, releaseBooking: async () => {} },
  })
  const result = await createBooking(request, "stable-key")
  assert.equal(result.joinUrl, "https://meet.google.com/existing")
  assert.equal(inserted + busy, 0)
})

test("SMTP failure leaves an independently retryable email job", async () => {
  let queued = true, sent = 0
  const saved = { ok: true, bookingId: "id", joinUrl: "https://meet.google.com/existing", startsAt: request.startsAt, emailStatus: "pending" }
  const { deliverEmail } = await route("lib/booking/store.ts", {
    "@/lib/server/redis": { redis: async ([command, ...args]) => {
      if (command === "EVAL") return queued ? 1 : 0
      if (command === "HGET") return JSON.stringify(args[1] === "booking" ? { ...request, bookingId: "id" } : saved)
      if (command === "ZREM") queued = false
      return 1
    } },
  })
  await assert.rejects(deliverEmail("id", async () => null, async () => { throw Error("SMTP down") }), /SMTP down/)
  assert.equal(queued, true)
  await deliverEmail("id", async () => null, async () => { sent++ })
  assert.equal(sent, 1)
  assert.equal(queued, false)
})

test("calendar outages fail closed before event creation", async () => {
  let inserted = 0
  const { createBooking } = await route("lib/booking/service.ts", {
    ...reservationMocks,
    "./providers": { getProvider: () => ({ busy: async () => { throw Error("Calendar down") }, create: async () => { inserted++ } }) },
    "./slots": { isSlotBookable: () => true },
    "./store": { claimBooking: async () => "claimed", completeBooking: async () => {}, releaseBooking: async () => {} },
  })
  await assert.rejects(createBooking(request, "stable-key"), (error) => error.status === 503)
  assert.equal(inserted, 0)
})

test("manual recovery never confirms an uncommitted or rejected intent", async () => {
  let created = 0
  const { recoverBooking } = await route("lib/booking/service.ts", {
    "./providers": { getProvider: () => ({ name: "manual", create: async () => { created++; return { joinUrl: "static" } } }) },
    "./slots": { isSlotBookable: () => false },
    "./store": { claimBooking: async () => "claimed", completeBooking: async () => {}, releaseBooking: async () => {} },
    "./reservations": { reserveSlot: async () => true, releaseSlot: async () => {} },
    "@/constants/settings": { SETTINGS: { booking: { bufferMinutes: 10 } } },
  })
  assert.equal(await recoverBooking({ ...request, startsAt: new Date(request.startsAt), bookingId: "id" }), null)
  assert.equal(created, 0)
})
