import test from "node:test"
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdtemp, readFile, writeFile, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { once } from "node:events"

const script = path.resolve("scripts/google-oauth.mjs")

async function startHelper(t, response) {
  const dir = await mkdtemp(path.join(tmpdir(), "booking-oauth-"))
  await writeFile(path.join(dir, ".env"), "GOOGLE_CLIENT_ID=test-client\nGOOGLE_CLIENT_SECRET=test-secret\n")
  await writeFile(path.join(dir, ".env.local"), "KEEP_ME=unchanged\nGOOGLE_REFRESH_TOKEN=old\nGOOGLE_REFRESH_TOKEN=duplicate\n")
  const preload = `globalThis.fetch = async (url, init) => {
    if (url !== 'https://oauth2.googleapis.com/token') throw Error('Unexpected endpoint');
    if (init.body.get('client_id') !== 'test-client' || init.body.get('client_secret') !== 'test-secret') throw Error('Environment not loaded');
    await new Promise(resolve => setTimeout(resolve, 50));
    return Response.json(${JSON.stringify(response.body)}, {status: ${response.status}});
  }`
  const env = { ...process.env }
  for (const key of Object.keys(env)) {
    if (key.startsWith("GOOGLE_") || key === "__NEXT_PROCESSED_ENV" || key === "NODE_ENV") delete env[key]
  }
  const child = spawn(process.execPath, ["--import", `data:text/javascript,${encodeURIComponent(preload)}`, script], { cwd: dir, env })
  let output = ""
  child.stdout.on("data", (data) => { output += data })
  child.stderr.on("data", (data) => { output += data })
  const exited = once(child, "exit")
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill()
      await exited
    }
    await rm(dir, { recursive: true, force: true })
  })
  const authUrl = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error(`Helper did not start: ${output}`)), 5000)
    const check = () => {
      const match = output.match(/https:\/\/accounts\.google\.com\/\S+/)
      if (match) { clearTimeout(timer); child.stdout.off("data", check); resolve(new URL(match[0])) }
    }
    child.stdout.on("data", check)
    exited.then(() => { clearTimeout(timer); reject(Error(`Helper exited early: ${output}`)) })
  })
  return {
    dir, exited, output: () => output,
    callback: (state = authUrl.searchParams.get("state")) =>
      fetch(`http://localhost:4571/callback?${new URLSearchParams({ code: "test-code", state })}`),
  }
}

test("reconnect rejects an unrelated callback, then saves the token privately", async (t) => {
  const helper = await startHelper(t, { status: 200, body: { refresh_token: "new-private-token", access_token: "private-access-token" } })
  assert.equal((await helper.callback("wrong-state")).status, 400)
  assert.match(await readFile(path.join(helper.dir, ".env.local"), "utf8"), /GOOGLE_REFRESH_TOKEN=old/)
  const res = await helper.callback()
  assert.equal(res.status, 200)
  assert.equal(res.headers.get("cache-control"), "no-store")
  assert.deepEqual(await helper.exited, [0, null])
  assert.equal(await readFile(path.join(helper.dir, ".env.local"), "utf8"), 'KEEP_ME=unchanged\nGOOGLE_REFRESH_TOKEN="new-private-token"\n')
  assert.equal((await stat(path.join(helper.dir, ".env.local"))).mode & 0o777, 0o600)
  assert.doesNotMatch(helper.output(), /new-private-token|private-access-token/)
})

test("duplicate callbacks cannot exchange the same authorization twice", async (t) => {
  const helper = await startHelper(t, { status: 200, body: { refresh_token: "one-token" } })
  const responses = await Promise.all([helper.callback(), helper.callback()])
  assert.deepEqual(responses.map(res => res.status).sort(), [200, 409])
  assert.deepEqual(await helper.exited, [0, null])
})

for (const response of [
  { status: 400, body: { error: "invalid_grant", access_token: "do-not-print" } },
  { status: 200, body: { access_token: "do-not-print" } },
]) {
  test(`unsuccessful token exchange (${response.status}) preserves credentials and exits with failure`, async (t) => {
    const helper = await startHelper(t, response)
    assert.equal((await helper.callback()).status, 500)
    assert.deepEqual(await helper.exited, [1, null])
    assert.match(await readFile(path.join(helper.dir, ".env.local"), "utf8"), /GOOGLE_REFRESH_TOKEN=old/)
    assert.doesNotMatch(helper.output(), /do-not-print/)
  })
}
