import type { BusyWindow, ConfirmedBooking } from "../types"

/**
 * The seam that lets phase 1 ship without Google credentials.
 *
 * Route handlers only ever talk to this interface. Swapping in the real
 * Calendar API later is a matter of adding `google.ts` and letting the factory
 * below pick it up — no route changes.
 */
export interface MeetingProvider {
  readonly name: string

  /** Creates the meeting and returns the link the attendee joins on. */
  create(request: ConfirmedBooking): Promise<{
    joinUrl: string
    externalId?: string
  }>

  /**
   * Windows the host is already committed in. Optional: a provider that cannot
   * see the calendar simply omits it, and availability falls back to working
   * hours alone.
   */
  busy?(from: Date, to: Date): Promise<BusyWindow[]>
}

import { manualProvider } from "./manual"
import { googleProvider } from "./google"

/**
 * Presence of a refresh token is the switch: with Google credentials the real
 * Calendar provider handles links + freebusy; without them everything falls
 * back to the static Meet room and working-hours availability. No route knows
 * which one it got.
 */
export function getProvider(): MeetingProvider {
  if (process.env.GOOGLE_REFRESH_TOKEN) return googleProvider
  return manualProvider
}
