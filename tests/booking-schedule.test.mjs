import test from "node:test"
import assert from "node:assert/strict"
import { route } from "./helpers/load-module.mjs"

const { generateSlots, isSlotBookable } = await route("lib/booking/slots.ts")
const now = new Date("2026-11-01T00:00:00Z")

for (const durationMinutes of [15, 30, 45, 60]) {
  test(`${durationMinutes}-minute weekday meetings stay within 9–6 and avoid the 1–2 PM IST break`, () => {
    for (const dateKey of ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"]) {
      const instant = (time) => new Date(`${dateKey}T${time}:00+05:30`)
      const slots = generateSlots({ dateKey, durationMinutes, now })
      assert.equal(slots[0].start, instant("09:00").toISOString())
      assert.equal(new Date(slots.at(-1).start).getTime() + durationMinutes * 60_000, instant("18:00").getTime())
      for (const slot of slots) {
        const start = new Date(slot.start).getTime()
        const end = start + durationMinutes * 60_000
        assert.ok(end <= instant("13:00").getTime() || start >= instant("14:00").getTime())
      }
      const bookable = (startsAt) => isSlotBookable({ startsAt, durationMinutes, now })
      assert.equal(bookable(new Date(instant("13:00").getTime() - durationMinutes * 60_000)), true)
      assert.equal(bookable(instant("14:00")), true)
      assert.equal(bookable(instant("13:00")), false)
      assert.equal(bookable(instant("13:45")), false)
      if (durationMinutes > 15) assert.equal(bookable(instant("12:45")), false)
    }
  })
}

test("weekends remain closed", () => {
  for (const dateKey of ["2026-11-07", "2026-11-08"]) {
    assert.deepEqual(generateSlots({ dateKey, durationMinutes: 30, now }), [])
  }
})
