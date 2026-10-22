# Booking persistence and email delivery

Configure a shared, persistent Upstash-compatible Redis database with `UPSTASH_REDIS_REST_URL` (HTTPS) and `UPSTASH_REDIS_REST_TOKEN` on every server instance. Missing or unavailable storage fails booking requests with 503 before event creation. Enable persistence/backups and use the same database across all regions.

The browser retains an Idempotency-Key UUID across retries of unchanged details. API clients must also retain their key, including after network errors and 503s. A different payload with an existing key returns 409. Records retain personal booking details for seven days; restrict database access accordingly. Google events use a deterministic ID, so retrying an uncertain insert retrieves the existing event before checking freeBusy.

An intent and email retry job are stored before inserting an event. Creation returns 201 with `emailStatus: pending` when the event exists. SMTP runs independently and cannot turn an existing booking into an HTTP 500.

Set a strong `BOOKING_WORKER_SECRET`. Schedule an authenticated GET to `/api/booking/email-retry` every minute with `Authorization: Bearer <BOOKING_WORKER_SECRET>` using your hosting scheduler. The worker processes at most 20 ready jobs per run and retries failures after two minutes. It recovers uncertain inserts by Google event ID and never inserts events. Monitor its failed count and queue depth; jobs expire with their seven-day booking record. Delivery is at least once: a crash after SMTP succeeds but before acknowledgement may resend mail, but cannot duplicate the calendar event.

Manual mode uses the configured static meeting URL and the same durable request and email records.

