import test from "node:test"
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { route } from "./helpers/load-module.mjs"

const exec = promisify(execFile)
test("separate instances share an atomic client quota; untrusted XFF cannot bypass it", { skip: process.env.TEST_REDIS !== "1" }, async () => {
  const original = process.env.TRUSTED_CLIENT_IP_HEADER
  delete process.env.TRUSTED_CLIENT_IP_HEADER
  try {
    const mocks = { "./redis": { redis: async (command) => JSON.parse((await exec("redis-cli", ["--json", ...command.map(String)])).stdout) } }
    const a = await route("lib/server/rate-limit.ts", mocks)
    const b = await route("lib/server/rate-limit.ts", mocks)
    const scope = "test-" + crypto.randomUUID()
    const results = await Promise.all(Array.from({ length: 30 }, (_, i) => (i % 2 ? a : b).rateLimit(new Headers({ "x-forwarded-for": "spoof-" + i }), scope, 15, 300)))
    assert.equal(results.filter((result) => result.allowed).length, 15)
    assert.ok(results.filter((result) => !result.allowed).every((result) => result.retryAfterSeconds > 0))
  } finally {
    if (original === undefined) delete process.env.TRUSTED_CLIENT_IP_HEADER
    else process.env.TRUSTED_CLIENT_IP_HEADER = original
  }
})

test("a shared global quota also applies across distinct trusted clients", { skip: process.env.TEST_REDIS !== "1" }, async () => {
  const original = process.env.TRUSTED_CLIENT_IP_HEADER
  process.env.TRUSTED_CLIENT_IP_HEADER = "x-host-client-ip"
  try {
    const { rateLimit } = await route("lib/server/rate-limit.ts", { "./redis": { redis: async (command) => JSON.parse((await exec("redis-cli", ["--json", ...command.map(String)])).stdout) } })
    const scope = "global-test-" + crypto.randomUUID()
    const results = await Promise.all(Array.from({ length: 20 }, (_, i) => rateLimit(new Headers({ "x-host-client-ip": "client-" + i }), scope, 100, 10)))
    assert.equal(results.filter((result) => result.allowed).length, 10)
  } finally {
    if (original === undefined) delete process.env.TRUSTED_CLIENT_IP_HEADER
    else process.env.TRUSTED_CLIENT_IP_HEADER = original
  }
})
