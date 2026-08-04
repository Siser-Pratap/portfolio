import { SETTINGS } from "@/constants/settings"
import { SITE } from "@/constants/site"
import type { BusyWindow, ConfirmedBooking } from "../types"
import type { MeetingProvider } from "./index"

/**
 * Phase 2 provider — talks to the Google Calendar REST API directly with
 * `fetch`, the same no-dependency stance as the rest of the booking lib
 * (Intl for timezones, hand-rolled ICS). The `googleapis` npm package would
 * pull ~15MB to do what three fetches do.
 *
 * It does two things the manual provider can't:
 *   1. `busy()` — a real freebusy query, so taken times disappear from the grid.
 *   2. `create()` — inserts an event with a per-meeting Google Meet link.
 *
 * The event is created with `sendUpdates=none`: Google records it on the host
 * calendar (which is what keeps freebusy accurate) and mints the Meet link, but
 * does NOT email anyone. All attendee mail stays on our own branded path in
 * `email.ts`, so the guest never gets two invites — identical to phase 1.
 */

// Defaults are the real Google endpoints; the env overrides exist only so a
// test harness can point these at a local stub. Unset in production.
const TOKEN_URL = process.env.GOOGLE_OAUTH_TOKEN_URL || "https://oauth2.googleapis.com/token"
const CALENDAR_BASE = process.env.GOOGLE_CALENDAR_BASE_URL || "https://www.googleapis.com/calendar/v3"

function calendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || "primary"
}

// ── access-token cache ───────────────────────────────────────────────────────
// Access tokens live ~1h; refresh a minute early to avoid edge-of-expiry 401s.
let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google provider is missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN")
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`Google token refresh failed (${res.status}): ${detail}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return cachedToken.value
}

/** Exposed for tests — lets a suite clear the module-level token cache. */
export function __resetTokenCache() {
  cachedToken = null
}

async function authedFetch(url: string, init: RequestInit): Promise<Response> {
  const token = await getAccessToken()
  return fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const googleProvider: MeetingProvider = {
  name: "google",

  async busy(from: Date, to: Date): Promise<BusyWindow[]> {
    const res = await authedFetch(`${CALENDAR_BASE}/freeBusy`, {
      method: "POST",
      body: JSON.stringify({
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
        items: [{ id: calendarId() }],
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`freeBusy query failed (${res.status}): ${detail}`)
    }

    const data = (await res.json()) as {
      calendars: Record<string, { busy?: Array<{ start: string; end: string }>; errors?: unknown[] }>
    }

    const calendar = data.calendars?.[calendarId()]
    if (calendar?.errors?.length) {
      throw new Error(`freeBusy returned calendar errors: ${JSON.stringify(calendar.errors)}`)
    }

    return (calendar?.busy ?? []).map((window) => ({
      start: new Date(window.start),
      end: new Date(window.end),
    }))
  },

  async create(booking: ConfirmedBooking): Promise<{ joinUrl: string; externalId?: string }> {
    const end = new Date(booking.startsAt.getTime() + booking.duration * 60_000)
    const tz = SETTINGS.booking.hostTimezone

    const description = [booking.notes?.trim(), `Booked via ${SITE.url}/book`]
      .filter(Boolean)
      .join("\n\n")

    const res = await authedFetch(
      // conferenceDataVersion=1 is required for Meet-link creation to take effect.
      // sendUpdates=none keeps Google from emailing — our mailer owns that.
      `${CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId())}/events?conferenceDataVersion=1&sendUpdates=none`,
      {
        method: "POST",
        body: JSON.stringify({
          summary: booking.subject,
          description,
          start: { dateTime: booking.startsAt.toISOString(), timeZone: tz },
          end: { dateTime: end.toISOString(), timeZone: tz },
          attendees: [
            { email: booking.email, displayName: booking.name },
            ...booking.guests.map((email) => ({ email })),
          ],
          conferenceData: {
            createRequest: {
              // Idempotency key — a retry with the same bookingId won't spawn a
              // second Meet room.
              requestId: booking.bookingId,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      },
    )

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`Calendar event insert failed (${res.status}): ${detail}`)
    }

    const event = (await res.json()) as {
      id?: string
      hangoutLink?: string
      conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> }
    }

    const videoEntry = event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")
    // hangoutLink is the canonical field; the entryPoint is a fallback for the
    // brief window before Google backfills it. staticMeetUrl is the last resort
    // so a booking never lands without *some* link.
    const joinUrl = event.hangoutLink || videoEntry?.uri || SETTINGS.booking.staticMeetUrl

    return { joinUrl, externalId: event.id }
  },
}
