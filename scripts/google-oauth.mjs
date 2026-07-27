#!/usr/bin/env node
/**
 * One-time helper to mint a Google Calendar refresh token for the /book
 * scheduler. Zero dependencies — uses Node's built-in http server for the
 * OAuth loopback (Google removed the old out-of-band flow).
 *
 * Prerequisites (Google Cloud Console → APIs & Services):
 *   1. Enable the "Google Calendar API".
 *   2. Create an OAuth 2.0 Client ID of type "Web application".
 *   3. Add  http://localhost:4571/callback  as an authorized redirect URI.
 *   4. On the OAuth consent screen, add yourself as a test user — and to avoid
 *      the refresh token expiring after 7 days, PUBLISH the app (Testing-status
 *      tokens are short-lived).
 *
 * Run:
 *   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/google-oauth.mjs
 *
 * Then paste the printed GOOGLE_REFRESH_TOKEN into your .env.
 */

import http from "node:http"
import { URL } from "node:url"

const PORT = 4571
const REDIRECT_URI = `http://localhost:${PORT}/callback`
const SCOPE = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly"

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before running.")
  process.exit(1)
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
authUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: SCOPE,
  access_type: "offline", // required to receive a refresh token
  prompt: "consent", // force a refresh token even on re-auth
}).toString()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== "/callback") {
    res.writeHead(404).end()
    return
  }

  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/plain" }).end(`Authorization failed: ${error ?? "no code"}`)
    console.error("Authorization failed:", error ?? "no code returned")
    server.close()
    process.exit(1)
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })

    const data = await tokenRes.json()

    if (!tokenRes.ok || !data.refresh_token) {
      res.writeHead(500, { "Content-Type": "text/plain" }).end("Token exchange failed — see terminal.")
      console.error("Token exchange failed:", JSON.stringify(data, null, 2))
      if (!data.refresh_token) {
        console.error(
          "\nNo refresh_token returned. Google only sends one on first consent — revoke prior access at\n" +
            "https://myaccount.google.com/permissions and run again (prompt=consent is already set).",
        )
      }
      server.close()
      process.exit(1)
    }

    res
      .writeHead(200, { "Content-Type": "text/html" })
      .end("<h2>Done. You can close this tab and return to the terminal.</h2>")

    console.log("\n✓ Success. Add these to your .env:\n")
    console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}`)
    console.log(`# GOOGLE_CALENDAR_ID=primary   (or a specific calendar id)\n`)
  } catch (err) {
    console.error("Token exchange error:", err)
  } finally {
    server.close()
    process.exit(0)
  }
})

server.listen(PORT, () => {
  console.log("\nOpen this URL in your browser to authorize:\n")
  console.log(authUrl.toString())
  console.log(`\nWaiting for the redirect to ${REDIRECT_URI} …`)
})
