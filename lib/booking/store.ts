import { redis } from "@/lib/server/redis"
import type { BookingResult, ConfirmedBooking } from "./types"

const PREFIX = "portfolio:booking:"
const QUEUE = PREFIX + "mail"
const RETENTION = 7 * 24 * 60 * 60

export async function claimBooking(id: string, fingerprint: string, booking: ConfirmedBooking, nonce: string) {
  return redis<string>(["EVAL", `
    local fingerprint = redis.call('HGET', KEYS[1], 'fingerprint')
    if fingerprint and fingerprint ~= ARGV[1] then return 'mismatch' end
    local result = redis.call('HGET', KEYS[1], 'result')
    if result then return result end
    if not redis.call('SET', KEYS[2], ARGV[3], 'NX', 'EX', 120) then return 'busy' end
    redis.call('HSET', KEYS[1], 'fingerprint', ARGV[1], 'booking', ARGV[2])
    redis.call('EXPIRE', KEYS[1], ARGV[4])
    redis.call('ZADD', KEYS[3], ARGV[5], ARGV[6])
    return 'claimed'
  `, 3, PREFIX + id, PREFIX + id + ":lock", QUEUE, fingerprint, JSON.stringify(booking), nonce, RETENTION, Date.now() + 120_000, id])
}

export async function releaseBooking(id: string, nonce: string) {
  await redis(["EVAL", "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0", 1, PREFIX + id + ":lock", nonce])
}

export async function completeBooking(id: string, result: BookingResult) {
  await redis(["HSET", PREFIX + id, "result", JSON.stringify(result)])
}

export async function pendingEmailIds(): Promise<string[]> {
  return redis<string[]>(["ZRANGEBYSCORE", QUEUE, "-inf", Date.now(), "LIMIT", 0, 20])
}

export async function deliverEmail(id: string, recover: (booking: ConfirmedBooking) => Promise<BookingResult | null>, send: (booking: ConfirmedBooking, result: BookingResult) => Promise<void>) {
  // Reserve a queue item atomically so workers do not deliver concurrently.
  const claimed = await redis<number>(["EVAL", `
    local score = redis.call('ZSCORE', KEYS[1], ARGV[1])
    if not score or tonumber(score) > tonumber(ARGV[2]) then return 0 end
    redis.call('ZADD', KEYS[1], ARGV[3], ARGV[1])
    return 1
  `, 1, QUEUE, id, Date.now(), Date.now() + 120_000])
  if (!claimed) return
  const raw = await redis<string | null>(["HGET", PREFIX + id, "booking"])
  if (!raw) { await redis(["ZREM", QUEUE, id]); return }
  const stored = JSON.parse(raw) as Omit<ConfirmedBooking, "startsAt"> & { startsAt: string }
  const booking = { ...stored, startsAt: new Date(stored.startsAt) }
  const saved = await redis<string | null>(["HGET", PREFIX + id, "result"])
  const result = saved ? JSON.parse(saved) as BookingResult : await recover(booking)
  // A worker only recovers an existing event; it never creates a booking.
  if (!result) return
  await completeBooking(id, result)
  await send(booking, result)
  await completeBooking(id, { ...result, emailStatus: "sent" })
  await redis(["ZREM", QUEUE, id])
}
