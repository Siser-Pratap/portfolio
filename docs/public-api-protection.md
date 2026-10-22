# Public API protection

Contact requires a persistent shared Redis REST database. Set UPSTASH_REDIS_REST_URL (HTTPS) and UPSTASH_REDIS_REST_TOKEN on all instances; these are the same settings used by reliable booking. Missing or unavailable storage returns 503 before sending mail.

Set TRUSTED_CLIENT_IP_HEADER only to a client-IP header your hosting platform overwrites and authenticates, for example Netlify's x-nf-client-connection-ip. Do not point it at arbitrary client headers or an appended X-Forwarded-For chain. If omitted, all clients share one restrictive anonymous bucket. Redis stores SHA-256 client identifiers, not raw IP addresses. Limits apply atomically across instances; a separate global bucket caps total outbound work.

Create a Cloudflare Turnstile widget for your site. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY (public widget key) and TURNSTILE_SECRET_KEY (server only). Set TURNSTILE_ALLOWED_HOSTNAMES to a comma-separated list of explicitly approved production/preview hostnames if different from the canonical site hostname. The server verifies success, action=contact and hostname before SMTP. Missing configuration or verification outages return 503; invalid tokens return 400. The UI uses email as the fallback when no widget is configured.

Contact accepts at most 16 KiB of JSON: name 2–80, email ≤254, phone ≤40, company ≤100, message 10–5000 characters. Each trusted client gets 3 attempts/hour and the application allows at most 60/hour. An inaccessible honeypot catches simple form-filling bots; Turnstile supplies the server-verified abuse check.
