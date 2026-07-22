// ─── Site-wide settings ───────────────────────────────────────────────────────
// Edit this file to update links, contact info, and other configurable values
// without touching individual components.

export const SETTINGS = {
  // Resume — paste the Google Drive share link here
  resumeViewUrl:
    "https://drive.google.com/file/d/1BaLEqSKQdJxYWMMQYy3_d3TF2p7CxuP5/view",
  resumeDownloadUrl:
    "https://drive.google.com/uc?export=download&id=1BaLEqSKQdJxYWMMQYy3_d3TF2p7CxuP5",


    

  // ─── In-house meeting scheduler (/book) ───────────────────────────────────
  booking: {
    // Your timezone. Working hours below are interpreted in it.
    hostTimezone: "Asia/Kolkata",

    // 0 = Sunday … 6 = Saturday
    workingDays: [1, 2, 3, 4, 5],
    workingHours: { start: "10:00", end: "19:00" },

    // Slot grid granularity, and the gap kept clear around every meeting.
    slotIntervalMinutes: 15,
    bufferMinutes: 10,

    // Booking window
    minNoticeHours: 4,
    maxDaysAhead: 60,

    // Meeting lengths offered to the visitor
    durations: [15, 30, 45, 60],
    defaultDuration: 30,

    maxGuests: 10,

    // Dates to keep closed, as "YYYY-MM-DD" in hostTimezone
    blockedDates: [] as string[],

    // Phase 1 fallback room. Phase 2 replaces this with a per-meeting Meet
    // link generated through the Google Calendar API.
    staticMeetUrl: "https://meet.google.com/xxx-xxxx-xxx",
  },

  // Contact info (used in Contact.tsx and Footer.tsx)
  phone: "+91 63074 77481",      // e.g. "+91 98765 43210"
  location: "Gurugram, India",
  email: "siserinsevoc@gmail.com",
}
