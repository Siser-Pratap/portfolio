# Booking persistence and email delivery

Configure a shared, persistent Upstash-compatible Redis database with `UPSTASH_REDIS_REST_URL` (HTTPS) and `UPSTASH_REDIS_REST_TOKEN` on every server instance. Missing or unavailable storage fails booking requests with 503 before event creation. Enable persistence/backups and use the same database across all regions.

The browser retains an Idempotency-Key UUID across retries of unchanged details. API clients must also retain their key, including after network errors and 503s. A different payload with an existing key returns 409. Records retain personal booking details for seven days; restrict database access accordingly. Google events use a deterministic ID, so retrying an uncertain insert retrieves the existing event before checking freeBusy.

An intent and email retry job are stored before inserting an event. Creation returns 201 with `emailStatus: pending` when the event exists. SMTP runs independently and cannot turn an existing booking into an HTTP 500.

Set a strong `BOOKING_WORKER_SECRET`. Schedule an authenticated GET to `/api/booking/email-retry` every minute with `Authorization: Bearer <BOOKING_WORKER_SECRET>` using your hosting scheduler. The worker processes at most 20 ready jobs per run and retries failures after two minutes. It recovers uncertain inserts by Google event ID and never inserts events. Monitor its failed count and queue depth; jobs expire with their seven-day booking record. Delivery is at least once: a crash after SMTP succeeds but before acknowledgement may resend mail, but cannot duplicate the calendar event.

Manual mode uses the configured static meeting URL and the same durable request and email records.

Slot protection uses an atomic Redis Lua operation over actual time ranges, including the configured meeting buffer. Reserve before reading freeBusy and keep that reservation through event creation and until the meeting ends. Different durations or grid start times cannot bypass an overlapping reservation. Definitively unavailable slots release their reservation. Calendar/storage timeouts retain it conservatively because an insertion may have succeeded; retry the same key to recover, or inspect the calendar before an operator removes a reservation. There is no expiring slot lock that can reopen a slot while a slow event insertion is still running.

Use a dedicated disposable Redis database for integration tests: `TEST_REDIS=1 node --experimental-vm-modules tests/booking-concurrency.test.mjs`. These tests call FLUSHDB. CI provisions an isolated Redis service for them.

