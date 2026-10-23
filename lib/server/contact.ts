import { z } from "zod"
import { SITE } from "@/constants/site"

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80).regex(/^[^\r\n]+$/),
  email: z.string().trim().max(254).email(),
  phone: z.string().trim().max(40).default(""),
  company: z.string().trim().max(100).regex(/^[^\r\n]*$/).default(""),
  message: z.string().trim().min(10).max(5000),
  honeypot: z.string().max(200).optional(),
  turnstileToken: z.string().min(1).max(2048),
}).strict()

export async function verifyContactToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) throw new Error("Spam protection is not configured")
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error("Spam verification unavailable")
  const result = await response.json() as { success?: boolean; action?: string; hostname?: string }
  const hosts = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? new URL(SITE.url).hostname).split(",").map((host) => host.trim())
  return result.success === true && result.action === "contact" && typeof result.hostname === "string" && hosts.includes(result.hostname)
}
