import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const booking = {
  name: "Test Visitor", email: "VISITOR@example.com", subject: "Discuss work",
  guests: [" GUEST@example.com "], duration: 30,
  startsAt: "2026-11-02T05:00:00.000Z", timezone: "Asia/Kolkata", honeypot: "",
}
const joinUrl = "https://meet.google.com/abc-defg-hij"
const { escapeHtml } = await route("lib/mailer.ts")
const { isSlotBookable } = await route("lib/booking/slots.ts")

async function setup({ url = joinUrl, rejected = [], mailError = false, mailGate, mailConfigured = true, validateSchedule = false, reservation = true, calendarBusy = [], calendarError = false, insertError = false } = {}) {
  const created = [], messages = [], released = [], reserved = []
  const handlers = await route("src/app/api/booking/create/route.ts", {
    "@/lib/booking/providers": { getProvider: () => ({ name: "test", busy: async () => {
      if (calendarError) throw Error("Calendar unavailable")
      return calendarBusy
    }, create: async (input) => {
      created.push(input)
      if (insertError) throw Error("Insert outcome unknown")
      return { joinUrl: url }
    } }) },
    "@/lib/booking/reservations": {
      reserveSlot: async (...args) => {
        reserved.push(args)
        if (reservation instanceof Error) throw reservation
        return reservation
      },
      releaseSlot: async (...args) => { released.push(args) },
    },
    "@/lib/booking/slots": {
      isSlotBookable: (params) => !validateSchedule || isSlotBookable({ ...params, now: new Date("2026-11-01T00:00:00Z") }),
      formatDateKey: () => "2026-11-02",
    },
    "@/lib/booking/rate-limit": { checkRateLimit: () => ({ allowed: true }), clientKey: () => "test" },
    "@/lib/mailer": {
      escapeHtml, isMailConfigured: () => mailConfigured,
      getTransporter: () => ({ sendMail: async (message) => {
        messages.push(message)
        if (mailError) throw Error("SMTP unavailable")
        if (mailGate) await mailGate
        return { rejected, accepted: [message.to, ...(message.cc ?? [])] }
      } }),
    },
  })
  return { created, messages, released, reserved, submit: (payload = booking) => handlers.POST({ json: async () => payload, headers: new Headers() }) }
}

test("filled anti-spam field cannot masquerade as a booking or send emails", async () => {
  const flow = await setup()
  const res = await flow.submit({ ...booking, honeypot: "autofilled-company.example" })
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.ok(body.error)
  assert.equal(body.ok, undefined)
  assert.equal(body.joinUrl, undefined)
  assert.equal(flow.created.length, 0)
  assert.equal(flow.messages.length, 0)
})

test("booking creates a meeting and emails the invitee, CC, and host before confirming", async () => {
  const flow = await setup()
  const res = await flow.submit()
  assert.equal(res.status, 200)
  const result = await res.json()
  assert.equal(result.joinUrl, joinUrl)
  assert.match(result.bookingId, /^bk_/)
  assert.equal(flow.created.length, 1)
  assert.equal(flow.created[0].email, "visitor@example.com")
  assert.deepEqual(flow.created[0].guests, ["guest@example.com"])
  assert.equal(flow.messages.length, 2)
  const invite = flow.messages.find(message => message.to === "visitor@example.com")
  assert.deepEqual(invite.cc, ["guest@example.com"])
  assert.ok(invite.html.includes(`href="${joinUrl}"`))
  assert.ok(invite.text.includes(joinUrl))
  const ics = invite.icalEvent.content.replace(/\r\n[ \t]/g, "")
  assert.ok(ics.includes(`LOCATION:${joinUrl}`))
  assert.ok(ics.includes("mailto:visitor@example.com"))
  assert.ok(ics.includes("mailto:guest@example.com"))
})

test("booking response waits for SMTP instead of queuing a background job", async () => {
  let releaseMail
  const mailGate = new Promise(resolve => { releaseMail = resolve })
  const flow = await setup({ mailGate })
  let settled = false
  const pending = flow.submit().then(response => { settled = true; return response })
  await new Promise(setImmediate)
  assert.equal(flow.created.length, 1)
  assert.equal(flow.messages.length, 2)
  assert.equal(settled, false)
  releaseMail()
  const response = await pending
  assert.equal(response.status, 200)
  assert.equal((await response.json()).emailStatus, undefined)
})

test("missing SMTP configuration blocks creation before a meeting is inserted", async () => {
  const flow = await setup({ mailConfigured: false })
  assert.equal((await flow.submit()).status, 503)
  assert.equal(flow.created.length + flow.messages.length, 0)
  assert.equal(flow.reserved.length, 0)
})

test("an overlapping reservation blocks event creation and email", async () => {
  const flow = await setup({ reservation: false })
  assert.equal((await flow.submit()).status, 409)
  assert.equal(flow.created.length + flow.messages.length, 0)
})

test("Redis outage fails closed before calendar insertion", async () => {
  const flow = await setup({ reservation: Error("Redis down") })
  assert.equal((await flow.submit()).status, 503)
  assert.equal(flow.created.length + flow.messages.length, 0)
})

test("failed availability lookup releases its uncommitted reservation", async () => {
  const flow = await setup({ calendarError: true })
  assert.equal((await flow.submit()).status, 503)
  assert.equal(flow.released.length, 1)
  assert.equal(flow.created.length + flow.messages.length, 0)
})

test("a definitive calendar conflict releases its reservation", async () => {
  const start = new Date(booking.startsAt)
  const flow = await setup({ validateSchedule: true, calendarBusy: [{ start, end: new Date(start.getTime() + 30 * 60000) }] })
  assert.equal((await flow.submit()).status, 409)
  assert.equal(flow.released.length, 1)
  assert.equal(flow.created.length + flow.messages.length, 0)
})

for (const options of [{ insertError: true }, { mailError: true }, {}]) {
  test(`reservation is retained after ${options.insertError ? "uncertain insertion" : options.mailError ? "SMTP failure" : "successful booking"}`, async () => {
    const flow = await setup(options)
    assert.equal((await flow.submit()).status, options.insertError || options.mailError ? 500 : 200)
    assert.equal(flow.released.length, 0)
    assert.equal(flow.reserved.length, 1)
  })
}

for (const startsAt of [
  "2026-11-07T09:00:00+05:30", // Saturday
  "2026-11-02T08:45:00+05:30", // before opening
  "2026-11-02T12:45:00+05:30", // overlaps lunch
  "2026-11-02T13:00:00+05:30", // during lunch
  "2026-11-02T17:45:00+05:30", // finishes after closing
]) {
  test(`create endpoint rejects an out-of-schedule meeting at ${startsAt}`, async () => {
    const flow = await setup({ validateSchedule: true })
    const response = await flow.submit({ ...booking, startsAt: new Date(startsAt).toISOString() })
    assert.equal(response.status, 409)
    assert.equal(flow.created.length + flow.messages.length, 0)
  })
}

for (const url of ["", "/book", "https://meet.google.com/xxx-xxxx-xxx"]) {
  test(`provider link ${JSON.stringify(url)} cannot be emailed or displayed as success`, async () => {
    const flow = await setup({ url })
    const res = await flow.submit()
    assert.equal(res.status, 500)
    assert.equal((await res.json()).ok, undefined)
    assert.equal(flow.messages.length, 0)
  })
}

for (const options of [{ mailError: true }, { rejected: ["guest@example.com"] }]) {
  test(`SMTP ${options.mailError ? "failure" : "CC rejection"} cannot produce a false confirmation`, async () => {
    const flow = await setup(options)
    const res = await flow.submit()
    assert.equal(res.status, 500)
    assert.equal((await res.json()).ok, undefined)
  })
}

test("client confirmation schema rejects the deployed ignored response and unsafe links", async () => {
  const { bookingResultSchema } = await route("lib/booking/types.ts")
  const valid = { ok: true, bookingId: "bk_123abc", joinUrl, startsAt: booking.startsAt }
  assert.equal(bookingResultSchema.safeParse(valid).success, true)
  assert.equal(bookingResultSchema.safeParse({ ...valid, bookingId: "ignored", joinUrl: "" }).success, false)
  for (const url of ["", "/book", "https://meet.google.com/xxx-xxxx-xxx", "https://meet.google.com.evil.example/abc-defg-hij", "javascript:alert(1)"]) {
    assert.equal(bookingResultSchema.safeParse({ ...valid, joinUrl: url }).success, false)
  }
})
