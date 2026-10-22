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
 *   npm run booking:authorize
 *
 * Loads Next.js environment files and saves the token to .env.local.
 */

import http from "node:http"
import { randomBytes } from "node:crypto"
import { readFile, writeFile, rename, rm } from "node:fs/promises"
import { URL } from "node:url"
import nextEnv from "@next/env"

nextEnv.loadEnvConfig(process.cwd(), true)

const PORT = 4571
const REDIRECT_URI = `http://localhost:${PORT}/callback`
const SCOPE = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly"
const state = randomBytes(32).toString("hex")

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
  state,
}).toString()

async function saveToken(token) {
  const target = ".env.local"
  const temporary = `${target}.${randomBytes(8).toString("hex")}.tmp`
  const existing = await readFile(target, "utf8").catch((err) => {
    if (err.code === "ENOENT") return ""
    throw err
  })
  // Replace all old entries so a duplicate cannot override the new token.
  const rest = existing.replace(/^(?:export\s+)?GOOGLE_REFRESH_TOKEN\s*=.*(?:\r?\n|$)/gm, "")
  const contents = `${rest}${rest && !rest.endsWith("\n") ? "\n" : ""}GOOGLE_REFRESH_TOKEN=${JSON.stringify(token)}\n`
  try {
    await writeFile(temporary, contents, { mode: 0o600, flag: "wx" })
    await rename(temporary, target)
  } finally {
    await rm(temporary, { force: true })
  }
}

let processing = false
const server = http.createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store")
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== "/callback") {
    res.writeHead(404).end()
    return
  }

  if (req.method !== "GET" || url.searchParams.get("state") !== state) {
    res.writeHead(400).end("Invalid authorization state. Use the authorization link from this terminal.")
    return
  }

  // A reload or back-navigation must not run two exchanges for one consent.
  if (processing) {
    res.writeHead(409).end("Authorization is already being processed. Return to the terminal.")
    return
  }
  processing = true

  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/plain" }).end(`Authorization failed: ${error ?? "no code"}`)
    console.error("Authorization failed:", error ?? "no code returned")
    process.exitCode = 1
    server.close()
    return
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

    if (!tokenRes.ok || typeof data.refresh_token !== "string" || !data.refresh_token) {
      res.writeHead(500, { "Content-Type": "text/plain" }).end("Token exchange failed — see terminal.")
      console.error("Token exchange failed:", data.error ?? "no refresh token returned")
      if (!data.refresh_token) {
        console.error(
          "\nNo refresh_token returned. Google only sends one on first consent — revoke prior access at\n" +
            "https://myaccount.google.com/permissions and run again (prompt=consent is already set).",
        )
      }
      process.exitCode = 1
      return
    }

    await saveToken(data.refresh_token)

    res
      .writeHead(200, { "Content-Type": "text/html" })
      .end("<h2>Calendar reconnected. Token saved to .env.local. Return to the terminal.</h2>")

    console.log("\nCalendar reconnected. GOOGLE_REFRESH_TOKEN saved to .env.local (not printed).")
    console.log("Restart the dev server, then retry /book. Update GOOGLE_REFRESH_TOKEN in your hosting environment and redeploy for production.\n")
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" }).end("Could not reconnect the calendar. See terminal.")
    console.error("Calendar reconnect failed:", err.message)
    process.exitCode = 1
  } finally {
    server.close()
  }
})

server.on("error", (err) => {
  console.error(`Could not start authorization callback: ${err.message}`)
  process.exitCode = 1
})

server.listen(PORT, "localhost", () => {
  console.log("\nOpen this URL in your browser to authorize:\n")
  console.log(authUrl.toString())
  console.log(`\nWaiting for the redirect to ${REDIRECT_URI} …`)
})
