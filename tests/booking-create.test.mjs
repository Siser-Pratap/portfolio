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

async function setup({ url = joinUrl, rejected = [], mailError = false } = {}) {
  const created = [], messages = []
  const handlers = await route("src/app/api/booking/create/route.ts", {
    "@/lib/booking/providers": { getProvider: () => ({ name: "test", create: async (input) => {
      created.push(input)
      return { joinUrl: url }
    } }) },
    "@/lib/booking/slots": { isSlotBookable: () => true, formatDateKey: () => "2026-11-02" },
    "@/lib/booking/rate-limit": { checkRateLimit: () => ({ allowed: true }), clientKey: () => "test" },
    "@/lib/mailer": {
      escapeHtml, isMailConfigured: () => true,
      getTransporter: () => ({ sendMail: async (message) => {
        messages.push(message)
        if (mailError) throw Error("SMTP unavailable")
        return { rejected, accepted: [message.to, ...(message.cc ?? [])] }
      } }),
    },
  })
  return { created, messages, submit: (payload = booking) => handlers.POST({ json: async () => payload, headers: new Headers() }) }
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
