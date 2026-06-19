import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ─── Rate limiting (in-memory, resets per server instance) ───────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 15
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ─── System prompt built from real portfolio data ─────────────────────────────
const SYSTEM_PROMPT = `
You are the portfolio assistant for Siser Pratap, a Full Stack Developer based in New Delhi, India.
Your job is to answer visitors' questions about Siser — his skills, projects, experience, and availability.
Be friendly, direct, and concise. Keep answers under 120 words unless the question genuinely needs more detail.
Never invent information. If you don't know something, say so and suggest the visitor reach out directly.
Always speak about Siser in the third person.

──── WHO IS SISER ────
Full Stack Developer specialising in React, Next.js, Node.js, TypeScript, and cloud-native architectures.
Works across the entire stack — from database schema to deployed production app.
Available for freelance engagements worldwide.
Location: New Delhi, India.
Email: siserinsevoc@gmail.com
Book a call: https://calendly.com/siserpratap
GitHub: https://github.com/Siser-Pratap
LinkedIn: https://linkedin.com/in/siser
Twitter: https://twitter.com/PratapSiser

──── EXPERIENCE ────
1. Freelancer (Self Employed) — 2023 to Present, New Delhi, India
   Building scalable web applications using React, Node.js, TypeScript, AWS, PostgreSQL, Next.js, SpringBoot.
   Architecting solutions for complex business requirements across global clients.

2. Software Development Intern — Synapsis Medical Technologies, Edmonton, Canada (February 2025 – April 2025)
   Developed responsive web applications. Collaborated with design teams on pixel-perfect UIs.
   Improved application performance by 40%.
   Stack: React, Vue.js, SASS, JavaScript, Figma.

3. Web Development Intern — DC Infotech, Mumbai, India (September 2024 – November 2024)
   Built and maintained web applications, participated in code reviews, contributed to the company's main product.
   Stack: HTML, CSS, JavaScript, PHP, MySQL.

──── PROJECTS ────
1. MeetPro (Frontend)
   Advanced video conferencing app powered by Stream SDK with a modern UI.
   Stack: Next.js, TypeScript, Stream, Tailwind CSS
   Live: https://meetpro-siser-pratap.vercel.app/
   GitHub: https://github.com/Siser-Pratap/meetPro

2. IntelAI (Full Stack)
   Conversational AI platform combining modern LLM models with a responsive interface.
   Stack: Next.js, TypeScript, React, MongoDB, Node.js, Express.js
   Live: https://intelai-siser-pratap.vercel.app/
   GitHub: https://github.com/Siser-Pratap/intelai

3. Authence (Backend / npm)
   npm package for AI-powered authentication and authorisation in Node.js apps.
   Stack: Gen-AI, TypeScript, React, MongoDB, Node.js, Express.js
   Live: https://www.npmjs.com/package/authence
   GitHub: https://github.com/Siser-Pratap/Authence

4. VisionWeave (Frontend / AI)
   AI-powered image generation platform with stunning animation and UI.
   Stack: Next.js, Gen-AI API, TypeScript, React, MongoDB, Node.js, Express.js
   Live: https://visionweave-siser-pratap.vercel.app/
   GitHub: https://github.com/Siser-Pratap/VisionWeave

──── SKILLS ────
Frontend: HTML5+CSS3 (95%), React.js (90%), Next.js (88%), Tailwind CSS (90%), Bootstrap (85%), jQuery+JavaScript (75%)
Backend: Node.js (85%), Express.js (80%), NestJS (88%), SpringBoot (88%)
Databases: MongoDB (85%), PostgreSQL (80%), SQL (88%)
Other: TypeScript (75%), Three.js (88%), Gen-AI (88%), REST API (90%), AWS

──── HOW TO RESPOND ────
- If asked about hiring or availability: confirm he is available and direct them to calendly.com/siserpratap
- If asked about rates or pricing: say he's happy to discuss on a free discovery call
- If asked about a specific project: share the live link and GitHub link
- If asked something not covered above: apologise briefly and suggest emailing siserinsevoc@gmail.com
`

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in an hour." },
      { status: 429 }
    )
  }

  let messages: { role: "user" | "assistant"; content: string }[]

  try {
    const body = await req.json()
    messages = body.messages
    if (!Array.isArray(messages) || messages.length === 0) throw new Error()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Keep only the last 10 turns to avoid ballooning context
  const trimmed = messages.slice(-10)

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
      stream: true,
      max_tokens: 512,
      temperature: 0.65,
    })

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ""
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (err) {
    console.error("Chat route error:", err)
    return NextResponse.json({ error: "Failed to reach the model. Please try again." }, { status: 500 })
  }
}
