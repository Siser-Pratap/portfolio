import { createHash } from "crypto"
import { redis } from "./redis"

/** Set only to a header that your hosting proxy overwrites, never one it appends. */
export function clientIdentity(headers: Headers): string {
  const header = process.env.TRUSTED_CLIENT_IP_HEADER
  const value = header ? headers.get(header)?.trim() : null
  // Without a trusted proxy identity, all callers share the restrictive bucket.
  return value && value.length <= 128 ? value : "anonymous"
}

export async function rateLimit(headers: Headers, scope: string, clientMax: number, globalMax: number, seconds = 3600) {
  const hash = createHash("sha256").update(clientIdentity(headers)).digest("hex")
  const result = await redis<[number, number]>(["EVAL", `
    local retry = 0
    for i = 1, 2 do
      local count = redis.call('INCR', KEYS[i])
      if count == 1 then redis.call('EXPIRE', KEYS[i], ARGV[3]) end
      if count > tonumber(ARGV[i]) then retry = math.max(retry, redis.call('TTL', KEYS[i])) end
    end
    return {retry == 0 and 1 or 0, retry}
  `, 2, 'portfolio:limit:' + scope + ':' + hash, 'portfolio:limit:' + scope + ':global', clientMax, globalMax, seconds])
  return { allowed: result[0] === 1, retryAfterSeconds: Math.max(1, result[1]) }
}
