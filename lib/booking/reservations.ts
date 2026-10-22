import { redis } from "@/lib/server/redis"

const KEY = "portfolio:booking:reservations"

/** Atomic across instances and across different durations/grid start times. */
export async function reserveSlot(id: string, start: number, end: number, buffer: number): Promise<boolean> {
  return (await redis<number>(["EVAL", `
    redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[5])
    local candidates = redis.call('ZRANGEBYSCORE', KEYS[1], ARGV[2] - ARGV[4], '+inf')
    for _, value in ipairs(candidates) do
      local other = cjson.decode(value)
      if other.id ~= ARGV[1] and other.start < tonumber(ARGV[3]) + tonumber(ARGV[4]) and other.finish > tonumber(ARGV[2]) - tonumber(ARGV[4]) then
        return 0
      end
    end
    redis.call('ZADD', KEYS[1], ARGV[3] + ARGV[4], ARGV[6])
    return 1
  `, 1, KEY, id, start, end, buffer, Date.now(), JSON.stringify({ id, start, finish: end })])) === 1
}

export async function releaseSlot(id: string, start: number, end: number) {
  await redis(["ZREM", KEY, JSON.stringify({ id, start, finish: end })])
}
