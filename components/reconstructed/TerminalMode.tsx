"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { experiences, skills, portfolioItems } from "@/constants/constant"

// ─── Types ────────────────────────────────────────────────────────────────────

type LineColor = "white" | "dim" | "accent" | "success" | "error" | "header"

type Line = {
  id: number
  text: string
  color: LineColor
  isInput?: boolean // rendered differently (shows prompt prefix)
}

type CommandResult = {
  lines: Line[]
  action?: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _id = 0
const id = () => ++_id

const L = (text: string, color: LineColor = "white"): Line => ({ id: id(), text, color })
const blank = (): Line => L("", "dim")

// ─── Skill categories ─────────────────────────────────────────────────────────

const SKILL_CATEGORIES: Record<string, string[]> = {
  frontend: ["HTML5 + CSS3", "JQUERY + JAVASCRIPT", "BOOTSTRAP", "React.js", "Next.js", "Three.js", "Tailwind CSS"],
  backend:  ["Node.js", "Express.js", "Nest.js", "Springboot", "REST API", "Gen-AI"],
  database: ["SQL", "MongoDB", "PostgreSQL"],
  other:    ["TypeScript"],
}

// ─── Command Engine ───────────────────────────────────────────────────────────

function runCommand(raw: string): CommandResult {
  const parts = raw.trim().split(/\s+/)
  const cmd   = parts[0].toLowerCase()
  const args  = parts.slice(1)

  // ── help ──────────────────────────────────────────────────────────────────
  if (cmd === "help") {
    return {
      lines: [
        blank(),
        L("AVAILABLE COMMANDS", "header"),
        L("──────────────────────────────────────────────", "dim"),
        L("  help                   Show this help", "dim"),
        L("  about                  About Siser Pratap", "white"),
        L("  projects               List all projects", "white"),
        L("  projects [1–4]         Project details", "white"),
        L("  skills                 All skills", "white"),
        L("  skills [category]      frontend · backend · database · other", "white"),
        L("  experience             Work history", "white"),
        L("  contact                Contact information", "white"),
        L("  hire                   Open booking link", "white"),
        L("  clear                  Clear terminal", "white"),
        L("  exit                   Close terminal", "white"),
        blank(),
        L("  Easter eggs? Keep exploring.", "dim"),
        blank(),
      ],
    }
  }

  // ── about ─────────────────────────────────────────────────────────────────
  if (cmd === "about") {
    return {
      lines: [
        blank(),
        L("SISER PRATAP", "header"),
        L("─────────────────────────────────────────────", "dim"),
        L("  Full Stack Developer", "white"),
        L("  New Delhi, India · Available worldwide", "dim"),
        blank(),
        L("  Building scalable web apps from DB schema to deployed product.", "white"),
        L("  Strong bias toward simplicity and shipping fast.", "white"),
        blank(),
        L("  Stack   React · Next.js · Node.js · TypeScript · Three.js · Gen-AI", "accent"),
        L("  GitHub  github.com/Siser-Pratap", "dim"),
        blank(),
      ],
    }
  }

  // ── projects ──────────────────────────────────────────────────────────────
  if (cmd === "projects") {
    if (args.length === 0) {
      return {
        lines: [
          blank(),
          L(`PROJECTS (${portfolioItems.length})`, "header"),
          L("─────────────────────────────────────────────", "dim"),
          ...portfolioItems.map((p, i) =>
            L(
              `  [${i + 1}]  ${p.title.padEnd(14)}${p.category.padEnd(12)}${p.description.slice(0, 44)}…`,
              "white"
            )
          ),
          blank(),
          L("  Type 'projects 2' for details on IntelAI", "dim"),
          blank(),
        ],
      }
    }

    const n = parseInt(args[0])
    if (isNaN(n) || n < 1 || n > portfolioItems.length) {
      return {
        lines: [
          blank(),
          L(`  No project at index ${args[0]}. Try 1–${portfolioItems.length}.`, "error"),
          blank(),
        ],
      }
    }

    const p = portfolioItems[n - 1]
    return {
      lines: [
        blank(),
        L(`${p.title} — ${p.category}`, "header"),
        L("─────────────────────────────────────────────", "dim"),
        L(`  ${p.description}`, "white"),
        blank(),
        L(`  Stack   ${p.technologies.join(" · ")}`, "accent"),
        L(`  Live    ${p.liveUrl}`, "success"),
        L(`  GitHub  ${p.githubUrl}`, "dim"),
        blank(),
      ],
    }
  }

  // ── skills ────────────────────────────────────────────────────────────────
  if (cmd === "skills") {
    const cat = args[0]?.toLowerCase()
    const filtered = cat
      ? skills.filter((s) => SKILL_CATEGORIES[cat]?.includes(s.name))
      : [...skills].sort((a, b) => b.level - a.level)

    if (cat && filtered.length === 0) {
      return {
        lines: [
          blank(),
          L(`  Unknown category '${cat}'. Try: frontend · backend · database · other`, "error"),
          blank(),
        ],
      }
    }

    const title = cat ? `${cat.toUpperCase()} SKILLS` : `ALL SKILLS (${skills.length})`
    return {
      lines: [
        blank(),
        L(title, "header"),
        L("─────────────────────────────────────────────", "dim"),
        ...filtered.map((s) =>
          L(`  ${s.name.padEnd(24)}${s.level}%`, "white")
        ),
        blank(),
        ...(!cat ? [L("  Filter: skills frontend · skills backend · skills database", "dim"), blank()] : []),
      ],
    }
  }

  // ── experience ────────────────────────────────────────────────────────────
  if (cmd === "experience") {
    const lines: Line[] = [blank(), L("WORK HISTORY", "header"), L("─────────────────────────────────────────────", "dim")]
    experiences.forEach((e, i) => {
      lines.push(blank())
      lines.push(L(`  ${e.period}`, "accent"))
      lines.push(L(`  ${e.title}, ${e.company}`, "white"))
      lines.push(L(`  ${e.location}`, "dim"))
      lines.push(L(`  ${e.technologies.join(" · ")}`, "dim"))
      if (i < experiences.length - 1) lines.push(blank())
    })
    lines.push(blank())
    return { lines }
  }

  // ── contact ───────────────────────────────────────────────────────────────
  if (cmd === "contact") {
    return {
      lines: [
        blank(),
        L("CONTACT", "header"),
        L("─────────────────────────────────────────────", "dim"),
        L("  Email      siserinsevoc@gmail.com", "white"),
        L("  LinkedIn   linkedin.com/in/siser", "white"),
        L("  GitHub     github.com/Siser-Pratap", "white"),
        L("  Twitter    @PratapSiser", "white"),
        L("  Instagram  @siser_ins17", "white"),
        blank(),
        L("  Type 'hire' to book a free discovery call", "dim"),
        blank(),
      ],
    }
  }

  // ── hire ──────────────────────────────────────────────────────────────────
  if (cmd === "hire") {
    return {
      lines: [
        blank(),
        L("  Opening calendly.com/siserpratap…", "success"),
        L("  → Redirecting to booking page", "dim"),
        blank(),
      ],
      action: () => window.open("https://calendly.com/siserpratap", "_blank"),
    }
  }

  // ── clear ─────────────────────────────────────────────────────────────────
  if (cmd === "clear") return { lines: [] }    // handled specially in component

  // ── exit ──────────────────────────────────────────────────────────────────
  if (cmd === "exit") return { lines: [] }     // handled specially in component

  // ─────────────────────────────────────────────────────────────────────────
  // Easter eggs
  // ─────────────────────────────────────────────────────────────────────────

  if (raw.trim() === "sudo hire siser") {
    return {
      lines: [
        blank(),
        L("  [sudo] password for visitor: ········", "dim"),
        L("  Verifying credentials…", "dim"),
        L("  Permission granted. ✓", "success"),
        L("  Redirecting to calendly.com/siserpratap…", "success"),
        blank(),
      ],
      action: () => setTimeout(() => window.open("https://calendly.com/siserpratap", "_blank"), 1400),
    }
  }

  if (raw.trim() === "npm install siser-pratap") {
    return {
      lines: [
        blank(),
        L("  npm warn  deprecated legacy-peer-deps", "dim"),
        L("  npm notice created a lockfile as package-lock.json", "dim"),
        blank(),
        L("  + siser-pratap@2.6.0", "success"),
        L("  added 1 package in 0.42s", "dim"),
        blank(),
        L("  1 package  —  Full Stack Developer", "white"),
        L("  ✓ Installation complete. He's ready to ship.", "success"),
        blank(),
      ],
    }
  }

  if (cmd === "whoami") {
    return { lines: [blank(), L("  visitor", "white"), blank()] }
  }

  if (cmd === "pwd") {
    return { lines: [blank(), L("  /siser/portfolio/~", "white"), blank()] }
  }

  if (cmd === "ls") {
    return {
      lines: [
        blank(),
        L("  projects/    experience/    skills/    contact.txt    resume.pdf", "accent"),
        blank(),
      ],
    }
  }

  if (cmd === "cat" && args[0] === "contact.txt") {
    return {
      lines: [
        blank(),
        L("  siserinsevoc@gmail.com", "white"),
        L("  linkedin.com/in/siser", "white"),
        L("  github.com/Siser-Pratap", "white"),
        L("  calendly.com/siserpratap", "white"),
        blank(),
      ],
    }
  }

  if (cmd === "git" && args[0] === "log" && args[1] === "--oneline") {
    return {
      lines: [
        blank(),
        L("  a4f2b1c  feat: shipped IntelAI to production", "white"),
        L("  9c3d2e8  feat: added AI streaming to chat platform", "white"),
        L("  f0a1b2c  fix: improved app performance by 40% at Synapsis", "white"),
        L("  e3c4d5a  feat: published authence to npm", "white"),
        L("  b2a1c0d  init: started freelancing full-time", "white"),
        blank(),
      ],
    }
  }

  if (cmd === "echo") {
    return { lines: [blank(), L(`  ${args.join(" ")}`, "white"), blank()] }
  }

  if (cmd === "uname") {
    return { lines: [blank(), L("  siser-portfolio Darwin arm64", "dim"), blank()] }
  }

  // ── unknown ───────────────────────────────────────────────────────────────
  return {
    lines: [
      blank(),
      L(`  Command not found: ${cmd}. Type 'help' for available commands.`, "error"),
      blank(),
    ],
  }
}

// ─── Welcome lines (shown on first open) ─────────────────────────────────────

const WELCOME: Line[] = [
  L("┌─────────────────────────────────────────────┐", "dim"),
  L("│     SISER.PORTFOLIO / TERMINAL  v1.0.0      │", "accent"),
  L("└─────────────────────────────────────────────┘", "dim"),
  blank(),
  L("  Full Stack Developer · New Delhi, India", "white"),
  L("  Type 'help' to see all commands.", "dim"),
  blank(),
]

// ─── Color mapping ────────────────────────────────────────────────────────────

const COLOR: Record<LineColor, string> = {
  white:   "text-white/90",
  dim:     "text-white/40",
  accent:  "text-[#FF6A21]",
  success: "text-green-400",
  error:   "text-red-400",
  header:  "text-[#FF4B1F] font-semibold tracking-widest",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TerminalMode() {
  const [open, setOpen]           = useState(false)
  const [lines, setLines]         = useState<Line[]>(WELCOME)
  const [input, setInput]         = useState("")
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx]     = useState(-1)
  const [revealing, setRevealing] = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  // Global '/' trigger
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (e.key === "/" && !open && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === "Escape" && open) setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  // Scroll to bottom when lines change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  // Reveal output lines one by one (typewriter line effect)
  const revealLines = useCallback((newLines: Line[], action?: () => void) => {
    setRevealing(true)
    let i = 0
    const next = () => {
      if (i >= newLines.length) {
        setRevealing(false)
        action?.()
        return
      }
      setLines((prev) => [...prev, newLines[i]])
      i++
      setTimeout(next, 32)
    }
    next()
  }, [])

  const submit = () => {
    if (!input.trim() || revealing) return

    const raw = input.trim()

    // Add input line to history display
    setLines((prev) => [
      ...prev,
      { id: id(), text: raw, color: "white", isInput: true },
    ])

    // Store in command history
    setCmdHistory((h) => [raw, ...h.slice(0, 49)])
    setHistIdx(-1)
    setInput("")

    // Handle clear / exit separately
    if (raw === "clear") { setLines([]); return }
    if (raw === "exit")  { setOpen(false); return }

    const result = runCommand(raw)
    revealLines(result.lines, result.action)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submit()
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(next)
      setInput(cmdHistory[next] ?? "")
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) { setHistIdx(-1); setInput(""); return }
      setHistIdx(next)
      setInput(cmdHistory[next] ?? "")
      return
    }
    // Tab auto-complete (top-level commands only)
    if (e.key === "Tab") {
      e.preventDefault()
      const cmds = ["help","about","projects","skills","experience","contact","hire","clear","exit","ls","pwd","whoami","git log --oneline","npm install siser-pratap","sudo hire siser"]
      const match = cmds.find((c) => c.startsWith(input) && c !== input)
      if (match) setInput(match)
    }
  }

  const PROMPT = (
    <span className="text-[#FF4B1F] font-mono select-none shrink-0">
      siser@portfolio:~$&nbsp;
    </span>
  )

  return (
    <>
      {/* Hint badge — visible when terminal is closed */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-8 left-8 z-50 flex items-center gap-2 bg-[#0D0505]/80 backdrop-blur-sm border border-white/10 text-white/50 text-xs font-mono px-3 py-2 rounded-full hover:border-[#FF4B1F]/40 hover:text-white/80 transition-all"
          >
            <span className="text-[#FF4B1F]">/</span>
            <span>terminal</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terminal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-[#050202]/98 backdrop-blur-md flex flex-col font-mono text-sm"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                aria-label="Close terminal"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50" />
              <div className="w-3 h-3 rounded-full bg-green-500 opacity-50" />
              <span className="ml-4 text-white/30 text-xs tracking-widest">
                siser@portfolio — bash
              </span>
              <span className="ml-auto text-white/20 text-xs">
                Press ESC to close
              </span>
            </div>

            {/* Scrollable output area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth">
              {lines.map((line) =>
                line.isInput ? (
                  <div key={line.id} className="flex items-start leading-relaxed py-0.5">
                    {PROMPT}
                    <span className="text-white/90">{line.text}</span>
                  </div>
                ) : (
                  <div
                    key={line.id}
                    className={`leading-relaxed py-[1px] whitespace-pre ${COLOR[line.color]}`}
                  >
                    {line.text || " "}
                  </div>
                )
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input line */}
            <div className="flex items-center px-6 py-4 border-t border-white/[0.06] shrink-0">
              {PROMPT}
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={revealing}
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 bg-transparent text-white/90 outline-none caret-transparent disabled:opacity-60 w-full"
                  aria-label="Terminal input"
                />
                {/* Blinking block cursor */}
                <span
                  className="cursor-blink inline-block w-[8px] h-[15px] bg-[#FF4B1F] ml-[1px] align-middle"
                  style={{ marginTop: "-1px" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
