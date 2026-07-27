import { SETTINGS } from "@/constants/settings"
import type { MeetingProvider } from "./index"

/**
 * Phase 1 provider: hands back the host's standing Google Meet room.
 *
 * The booking is still real — the visitor gets a confirmation with a valid
 * .ics invitation, and the host gets a notification. What is missing versus
 * phase 2 is a per-meeting link and calendar-backed conflict detection, so
 * `busy` is deliberately not implemented.
 */
export const manualProvider: MeetingProvider = {
  name: "manual",

  async create() {
    return { joinUrl: SETTINGS.booking.staticMeetUrl }
  },
}
