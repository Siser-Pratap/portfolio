# Booking and confirmation emails

The booking flow runs entirely inside `POST /api/booking/create`. It does not use
cron jobs or a background worker, and does not require a paid cron plan.
Shared Redis is used only for atomic slot reservations and can use an Upstash
free database. Confirmation emails are sent directly during the booking request.

1. Choose a duration, date, and available time, then enter the invitee and guests.
2. The server checks working hours, atomically reserves the full meeting range
   plus buffer in Redis, and checks Google Calendar conflicts again.
3. Google creates the calendar event and a real Meet link. Conference creation is
   briefly polled when Google reports it as pending; placeholder links are rejected.
4. SMTP sends the invitee confirmation, CCs the guests, and notifies the host.
   The attendee email includes the Meet link and an `.ics` calendar invitation.
5. The page shows confirmation only after the email sends complete successfully.

Availability is Monday–Friday, 9 AM–6 PM in `Asia/Kolkata`, excluding 1–2 PM.
Meetings cannot overlap the lunch break or finish after 6 PM. Meeting lengths are
15, 30, 45, and 60 minutes. Existing calendar events and the configured meeting
buffer, minimum notice, and booking horizon are also respected.

## Environment

- Google Calendar: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`.
- Optional: `GOOGLE_CALENDAR_ID` defaults to `primary`.
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- Slot reservations: `UPSTASH_REDIS_REST_URL` (HTTPS) and
  `UPSTASH_REDIS_REST_TOKEN` (write-capable REST token).

Keep these values in `.env.local` for development and in the corresponding Vercel
environment for deployments, including Preview when testing there. All instances
of an environment must use the same Redis database. Use separate databases for
Preview and Production. Redeploy after changing hosted values. No worker or cron
secrets are required.

If Google availability cannot be checked, the request returns 503 without creating
a meeting. Missing SMTP configuration also blocks creation. SMTP failures or
recipient rejections produce an error instead of a false confirmation. Because
the event is created before SMTP runs, a mail failure can leave an event on the
host calendar; check it before submitting another booking. No automatic email
retry is scheduled.

Reservations reject overlapping ranges, including the meeting buffer, across
server instances. A definitive calendar conflict or failed availability read
releases the reservation before returning an error. Once insertion is attempted,
keep the reservation until the meeting ends plus buffer, including an uncertain
insert or SMTP failure. Expired entries are removed on the next reservation
attempt; no scheduler is needed. Storage failures return 503 before event creation.

Without Google credentials the manual provider uses `staticMeetUrl` in settings.
Configure a real Meet room before using that mode; the placeholder is rejected.

The concurrent-request integration tests use a disposable local Redis service.
Enable them with `TEST_REDIS=1`, and set `TEST_REDIS_PORT` when using a nondefault
port. Tests clear only the dedicated `portfolio:test:booking:reservations` key.
Each run appends a unique suffix to that test key. To use an Upstash database for
this isolated-key check, load its REST variables and set `TEST_REDIS_REST=1` too.
Calendar creation and mail delivery are mocked. CI provisions a separate Redis
container. Production booking data is not flushed.

