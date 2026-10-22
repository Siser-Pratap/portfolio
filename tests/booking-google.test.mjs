import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const booking = {
  bookingId: "bk_test123", name: "Visitor", email: "visitor@example.com",
  guests: ["guest@example.com"], subject: "Discuss work", duration: 30,
  startsAt: new Date("2026-11-02T05:00:00.000Z"), timezone: "Asia/Kolkata",
}
const joinUrl = "https://meet.google.com/abc-defg-hij"

async function setup(t, events) {
  const previous = { ...process.env }
  Object.assign(process.env, { GOOGLE_CLIENT_ID: "test", GOOGLE_CLIENT_SECRET: "test", GOOGLE_REFRESH_TOKEN: "test" })
  for (const key of ["GOOGLE_OAUTH_TOKEN_URL", "GOOGLE_CALENDAR_BASE_URL", "GOOGLE_CALENDAR_ID"]) delete process.env[key]
  t.after(() => {
    for (const key of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_OAUTH_TOKEN_URL", "GOOGLE_CALENDAR_BASE_URL", "GOOGLE_CALENDAR_ID"]) {
      if (previous[key] === undefined) delete process.env[key]
      else process.env[key] = previous[key]
    }
  })
  const calls = []
  t.mock.method(globalThis, "fetch", async (url, init) => {
    if (url === "https://oauth2.googleapis.com/token") return Response.json({ access_token: "test", expires_in: 3600 })
    calls.push({ url, ...init })
    const event = events[Math.min(calls.length - 1, events.length - 1)]
    return Response.json(event)
  })
  const { googleProvider } = await route("lib/booking/providers/google.ts", {
    "node:timers/promises": { setTimeout: async () => {} },
  })
  return { googleProvider, calls }
}

test("Google meeting creation includes the invitee and CC and returns the real room", async (t) => {
  const { googleProvider, calls } = await setup(t, [{ id: "event1", hangoutLink: joinUrl }])
  assert.equal((await googleProvider.create(booking)).joinUrl, joinUrl)
  assert.equal(calls.length, 1)
  const request = JSON.parse(calls[0].body)
  assert.deepEqual(request.attendees.map(person => person.email), [booking.email, ...booking.guests])
})

test("pending Google conference is polled until its real video URL is ready", async (t) => {
  const { googleProvider, calls } = await setup(t, [
    { id: "event1", conferenceData: { createRequest: { status: { statusCode: "pending" } } } },
    { id: "event1", conferenceData: { entryPoints: [{ entryPointType: "video", uri: joinUrl }] } },
  ])
  assert.equal((await googleProvider.create(booking)).joinUrl, joinUrl)
  assert.equal(calls.length, 2)
  assert.equal(calls[1].method, "GET")
  assert.ok(calls[1].url.endsWith("/events/event1"))
})

for (const statusCode of ["failure", "pending"]) {
  test(`Google conference ${statusCode} never returns the placeholder as a real room`, async (t) => {
    const { googleProvider, calls } = await setup(t, [{ id: "event1", conferenceData: { createRequest: { status: { statusCode } } } }])
    await assert.rejects(googleProvider.create(booking), /usable Meet link/)
    assert.equal(calls.length, statusCode === "failure" ? 1 : 6)
  })
}
