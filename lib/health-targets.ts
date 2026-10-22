// Server-owned destinations. Do not accept hostnames or paths from callers.
export const HEALTH_TARGETS = [
  "https://meetpro-siser-pratap.vercel.app/",
  "https://intelai-siser-pratap.vercel.app/",
  "https://www.npmjs.com/package/authence",
  "https://visionweave-siser-pratap.vercel.app/",
] as const

export function healthTarget(input: string | null): string | null {
  if (!input) return null
  try {
    const url = new URL(input)
    if (url.protocol !== "https:" || url.username || url.password || url.hash || url.search) return null
    return HEALTH_TARGETS.find((target) => target === url.href) ?? null
  } catch {
    return null
  }
}
