import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const booking = { startsAt: "2026-11-02T05:00:00.000Z", duration: 30, name: "Visitor", email: "visitor@example.com", guests: [], timezone: "Asia/Kolkata", subject: "Discuss work" }
for (const endpoint of ["availability", "create"]) {
  test(endpoint + " returns 503 on freeBusy failure without accepting slots", async () => {
    let created = 0, mailed = 0, generated = 0
    const handlers = await route("src/app/api/booking/" + endpoint + "/route.ts", {
      "@/constants/settings": { SETTINGS: { booking: { defaultDuration: 30, hostTimezone: "Asia/Kolkata" } } },
      "@/lib/booking/providers": { getProvider: () => ({ name: "google", busy: async () => { throw Error("OAuth expired") }, create: async () => { created++ } }) },
      "@/lib/booking/slots": { generateSlots: () => { generated++; return [] }, isSlotBookable: () => { generated++; return true }, formatDateKey: () => "" },
      "@/lib/booking/types": { availabilityQuerySchema: { safeParse: () => ({ success: true, data: { date: "2026-11-02", duration: 30 } }) }, bookingRequestSchema: { safeParse: () => ({ success: true, data: booking }) }, bookingResultSchema: { parse: (value) => value } },
      "@/lib/booking/email": { sendBookingEmails: async () => { mailed++ } },
      "@/lib/booking/rate-limit": { checkRateLimit: () => ({ allowed: true }), clientKey: () => "test" },
      "@/lib/mailer": { isMailConfigured: () => true },
      "@/lib/booking/reservations": { reserveSlot: async () => true, releaseSlot: async () => {} },
    })
    const req = { nextUrl: new URL("https://test/api?date=2026-11-02"), headers: new Headers(), json: async () => booking }
    const res = await handlers[endpoint === "availability" ? "GET" : "POST"](req)
    assert.equal(res.status, 503)
    assert.equal(res.headers.get("cache-control"), "no-store")
    assert.equal(created + mailed, 0)
    assert.equal(generated, endpoint === "create" ? 1 : 0)
  })
}
test("manual provider explicitly uses the working-hours grid", async () => {
  const { GET } = await route("src/app/api/booking/availability/route.ts", {
    "@/constants/settings": { SETTINGS: { booking: { defaultDuration: 30, hostTimezone: "Asia/Kolkata" } } },
    "@/lib/booking/providers": { getProvider: () => ({ name: "manual" }) },
    "@/lib/booking/types": { availabilityQuerySchema: { safeParse: () => ({ success: true, data: { date: "2026-11-02", duration: 30 } }) } },
    "@/lib/booking/slots": { generateSlots: ({ busy }) => { assert.deepEqual(busy, []); return [{ start: booking.startsAt, available: true }] } },
  })
  const res = await GET({ nextUrl: new URL("https://test/api"), headers: new Headers() })
  assert.equal(res.status, 200)
  assert.equal((await res.json()).slots[0].available, true)
})
