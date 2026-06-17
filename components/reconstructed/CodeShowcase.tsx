"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"

SyntaxHighlighter.registerLanguage("typescript", ts)

// ─── Snippets ─────────────────────────────────────────────────────────────────

const SNIPPETS = [
  {
    title: "LLM Streaming",
    file: "api/chat/route.ts",
    annotation:
      "Token-by-token ReadableStream — the UI updates in real time without buffering the full completion in memory.",
    code: `// Groq streams tokens as they're generated; we pipe each chunk
// directly to the client instead of waiting for the full response.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 })
  }

  const { messages } = await req.json()
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    stream: true,
    max_tokens: 512,
  })

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content ?? ""
        if (text) controller.enqueue(enc.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}`,
  },
  {
    title: "TTL Cache",
    file: "api/github-commit/route.ts",
    annotation:
      "Server-side Map with expiry — one Next.js instance caches GitHub responses across all concurrent visitors, staying within the 60 req/hr public rate limit.",
    code: `// Single in-memory cache shared across all requests to this route handler.
// Resets on redeploy — cheap, zero infra, correct for this use case.
const cache = new Map<string, { data: CommitData; expiresAt: number }>()
const TTL = 10 * 60 * 1000 // 10 minutes

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get("repo")!

  const hit = cache.get(repo)
  if (hit && Date.now() < hit.expiresAt) {
    return NextResponse.json(hit.data, { headers: { "X-Cache": "HIT" } })
  }

  const res = await fetch(
    \`https://api.github.com/repos/Siser-Pratap/\${repo}/commits?per_page=1\`,
    { headers: { Accept: "application/vnd.github+json" } }
  )
  const [commit] = await res.json()

  const data: CommitData = {
    sha:     commit.sha.slice(0, 7),
    message: commit.commit.message.split("\\n")[0],
    date:    commit.commit.author.date,
  }

  cache.set(repo, { data, expiresAt: Date.now() + TTL })
  return NextResponse.json(data)
}`,
  },
  {
    title: "Command Parser",
    file: "TerminalMode.tsx",
    annotation:
      "Pure function dispatch — every command is isolated and independently testable; side-effects (open URL, clear screen) are returned as data, not executed inline.",
    code: `// Commands return { lines, action? } — they describe what should happen,
// the component decides when and whether to run it.
type CommandResult = { lines: Line[]; action?: () => void }

function runCommand(raw: string): CommandResult {
  const [cmd, ...args] = raw.trim().split(/\\s+/)

  if (cmd === "projects" && args.length > 0) {
    const n = parseInt(args[0])
    const p = portfolioItems[n - 1]
    if (!p) return { lines: [L(\`No project at index \${n}.\`, "error")] }
    return {
      lines: [
        L(\`\${p.title} — \${p.category}\`, "header"),
        L(\`  Stack   \${p.technologies.join(" · ")}\`, "accent"),
        L(\`  Live    \${p.liveUrl}\`, "success"),
        L(\`  GitHub  \${p.githubUrl}\`, "dim"),
      ],
    }
  }

  if (cmd === "hire") {
    return {
      lines: [L("  Opening calendly.com/siserpratap…", "success")],
      action: () => window.open("https://calendly.com/siserpratap", "_blank"),
    }
  }

  return { lines: [L(\`Command not found: \${cmd}\`, "error")] }
}`,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function CodeShowcase() {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)

  const snippet = SNIPPETS[active]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <section className="w-full bg-[#0D0505] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        {/* Section header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="text-white/40 text-sm font-medium italic mb-6 block">{"(/ Code )"}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-white tracking-tight">
              How I Build
            </h2>
          </div>
          <p className="text-white/50 text-base leading-relaxed max-w-[460px] lg:text-right">
            Real snippets from this portfolio. Each solves a specific problem —
            the annotation explains the <em>why</em>, not the what.
          </p>
        </motion.div>

        {/* Tab row */}
        <motion.div
          className="flex gap-1 mb-6 overflow-x-auto no-scrollbar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {SNIPPETS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active === i
                  ? "bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] text-white shadow-[0_4px_20px_rgba(255,75,31,0.3)]"
                  : "text-white/50 bg-white/5 hover:text-white/80 hover:bg-white/10"
              }`}
            >
              {s.title}
            </button>
          ))}
        </motion.div>

        {/* Annotation */}
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-white/40 text-sm font-mono mb-6 leading-relaxed"
          >
            // {snippet.annotation}
          </motion.p>
        </AnimatePresence>

        {/* Code card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[20px] overflow-hidden border border-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        >
          {/* macOS chrome */}
          <div className="flex items-center justify-between bg-[#1A0D0D] px-5 py-3.5 border-b border-white/[0.07]">
            {/* Traffic lights */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 text-white/30 text-xs font-mono">{snippet.file}</span>
            </div>

            {/* Right: language + copy */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#FF6A21] bg-[#FF4B1F]/10 border border-[#FF4B1F]/20 px-2.5 py-0.5 rounded-full">
                TypeScript
              </span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-xs font-mono"
                aria-label="Copy code"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className="flex items-center gap-1 text-green-400"
                    >
                      <Check size={13} />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Copy size={13} />
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Code body */}
          <div className="overflow-x-auto bg-[#120808]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  showLineNumbers
                  lineNumberStyle={{
                    color: "rgba(255,255,255,0.18)",
                    paddingRight: "1.5rem",
                    userSelect: "none",
                    fontSize: "0.75rem",
                    minWidth: "2.5rem",
                  }}
                  customStyle={{
                    background: "transparent",
                    margin: 0,
                    padding: "1.75rem 1.5rem",
                    fontSize: "0.8125rem",
                    lineHeight: "1.7",
                  }}
                  codeTagProps={{ style: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace" } }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
