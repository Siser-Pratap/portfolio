"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3"
import { skills } from "@/constants/constant"

// ─── Graph edges ──────────────────────────────────────────────────────────────

const EDGES = [
  { source: "HTML5 + CSS3",          target: "BOOTSTRAP" },
  { source: "HTML5 + CSS3",          target: "Tailwind CSS" },
  { source: "HTML5 + CSS3",          target: "React.js" },
  { source: "JQUERY + JAVASCRIPT",   target: "TypeScript" },
  { source: "JQUERY + JAVASCRIPT",   target: "React.js" },
  { source: "TypeScript",            target: "React.js" },
  { source: "TypeScript",            target: "Node.js" },
  { source: "TypeScript",            target: "Next.js" },
  { source: "TypeScript",            target: "Nest.js" },
  { source: "React.js",              target: "Next.js" },
  { source: "React.js",              target: "Three.js" },
  { source: "Node.js",               target: "Express.js" },
  { source: "Node.js",               target: "Nest.js" },
  { source: "Node.js",               target: "REST API" },
  { source: "Node.js",               target: "Gen-AI" },
  { source: "Express.js",            target: "MongoDB" },
  { source: "Express.js",            target: "REST API" },
  { source: "SQL",                   target: "PostgreSQL" },
  { source: "SQL",                   target: "Springboot" },
  { source: "PostgreSQL",            target: "Springboot" },
  { source: "Gen-AI",                target: "Next.js" },
  { source: "Gen-AI",                target: "REST API" },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface NodeDatum extends SimulationNodeDatum {
  id: string
  level: number
  r: number
}

type LinkDatum = SimulationLinkDatum<NodeDatum>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const nodeR = (level: number) => 9 + (level / 100) * 17  // 9 → 26

function resolvedXY(n: NodeDatum) {
  return { x: n.x ?? 0, y: n.y ?? 0 }
}

function resolvedNode(ref: string | number | NodeDatum): NodeDatum {
  return ref as NodeDatum
}

// ─── Bar fallback (original Skills view) ─────────────────────────────────────

function BarFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[80px] gap-y-10">
      {skills.map((skill, i) => (
        <motion.div
          key={i}
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
        >
          <div className="flex justify-between items-baseline">
            <span className="text-white text-sm font-semibold tracking-wide">{skill.name}</span>
            <span className="text-white/30 text-xs font-medium tabular-nums">{skill.level}%</span>
          </div>
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 + 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Graph ────────────────────────────────────────────────────────────────────

const SVG_H = 560

function Graph() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const svgRef        = useRef<SVGSVGElement>(null)
  const simRef        = useRef<ReturnType<typeof forceSimulation<NodeDatum, LinkDatum>> | null>(null)
  const nodesRef      = useRef<NodeDatum[]>([])
  const linksRef      = useRef<LinkDatum[]>([])
  const dragRef       = useRef<NodeDatum | null>(null)

  const [, tick]      = useState(0)
  const [hovered, setHovered]   = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [tooltip, setTooltip]   = useState<{ x: number; y: number; node: NodeDatum } | null>(null)
  const [visible, setVisible]   = useState(false)

  // ── Build + start simulation ───────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const W = el.clientWidth || 900

    const nodeArr: NodeDatum[] = skills.map((s) => ({
      id: s.name,
      level: s.level,
      r: nodeR(s.level),
      x: W / 2 + (Math.random() - 0.5) * 180,
      y: SVG_H / 2 + (Math.random() - 0.5) * 180,
    }))
    const byId: Record<string, NodeDatum> = Object.fromEntries(nodeArr.map((n) => [n.id, n]))

    const linkArr: LinkDatum[] = EDGES
      .filter((e) => byId[e.source] && byId[e.target])
      .map((e) => ({ source: e.source, target: e.target }) as LinkDatum)

    nodesRef.current = nodeArr
    linksRef.current = linkArr

    const sim = forceSimulation<NodeDatum, LinkDatum>(nodeArr)
      .force(
        "link",
        forceLink<NodeDatum, LinkDatum>(linkArr)
          .id((d) => d.id)
          .distance(95)
          .strength(0.45),
      )
      .force("charge", forceManyBody<NodeDatum>().strength(-220))
      .force("center", forceCenter(W / 2, SVG_H / 2))
      .force("collide", forceCollide<NodeDatum>((d) => d.r + 10))
      .on("tick", () => tick((t) => t + 1))

    simRef.current = sim
    setVisible(true)

    return () => { sim.stop() }
  }, [])

  // ── Connected-node lookup ──────────────────────────────────────────────────

  const connected = useCallback((id: string): Set<string> => {
    const s = new Set<string>([id])
    linksRef.current.forEach((l) => {
      const src = resolvedNode(l.source)
      const tgt = resolvedNode(l.target)
      if (src.id === id) s.add(tgt.id)
      if (tgt.id === id) s.add(src.id)
    })
    return s
  }, [])

  // ── Pointer handlers ───────────────────────────────────────────────────────

  const onNodeDown = (e: React.PointerEvent, node: NodeDatum) => {
    e.stopPropagation()
    dragRef.current = node
    node.fx = node.x
    node.fy = node.y
    svgRef.current?.setPointerCapture(e.pointerId)
    simRef.current?.alphaTarget(0.3).restart()
  }

  const onSvgMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    dragRef.current.fx = e.clientX - rect.left
    dragRef.current.fy = e.clientY - rect.top
    if (tooltip) setTooltip(null)
  }

  const onSvgUp = () => {
    if (!dragRef.current) return
    dragRef.current.fx = undefined
    dragRef.current.fy = undefined
    dragRef.current = null
    simRef.current?.alphaTarget(0)
  }

  const onNodeEnter = (e: React.PointerEvent, node: NodeDatum) => {
    if (dragRef.current) return
    setHovered(node.id)
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, node })
  }

  const onNodeLeave = () => { setHovered(null); setTooltip(null) }

  const onNodeClick = (id: string) => setSelected((p) => (p === id ? null : id))

  // ── Render helpers ─────────────────────────────────────────────────────────

  const focus     = selected ?? hovered
  const focusSet  = focus ? connected(focus) : null

  const nodeAlpha = (id: string) => (!focusSet ? 1 : focusSet.has(id) ? 1 : 0.12)

  const edgeAlpha = (l: LinkDatum) => {
    if (!focusSet) return 0.22
    const s = resolvedNode(l.source).id
    const t = resolvedNode(l.target).id
    return focusSet.has(s) && focusSet.has(t) ? 0.85 : 0.04
  }

  const nodes = nodesRef.current
  const links = linksRef.current

  const containerW = containerRef.current?.clientWidth ?? 900
  const flipTooltip = tooltip && tooltip.x > containerW * 0.65

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[20px] overflow-hidden border border-white/[0.07]"
      style={{ height: SVG_H, opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={SVG_H}
        onPointerMove={onSvgMove}
        onPointerUp={onSvgUp}
        onPointerLeave={onSvgUp}
        className="touch-none select-none"
      >
        <defs>
          <filter id="sg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sg-glow-hi" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="sg-grad" cx="38%" cy="32%" r="62%">
            <stop offset="0%"   stopColor="#FF7545" />
            <stop offset="100%" stopColor="#FF3510" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {links.map((link, i) => {
          const s = resolvedNode(link.source)
          const t = resolvedNode(link.target)
          const sp = resolvedXY(s)
          const tp = resolvedXY(t)
          return (
            <line
              key={i}
              x1={sp.x} y1={sp.y}
              x2={tp.x} y2={tp.y}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1}
              opacity={edgeAlpha(link)}
              style={{ transition: "opacity 0.18s" }}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const { x, y } = resolvedXY(node)
          const isHov = hovered === node.id
          const isSel = selected === node.id
          const alpha = nodeAlpha(node.id)
          const glowFilter = isSel ? "url(#sg-glow-hi)" : isHov ? "url(#sg-glow)" : undefined

          return (
            <g
              key={node.id}
              transform={`translate(${x},${y})`}
              opacity={alpha}
              style={{ transition: "opacity 0.18s", cursor: "grab" }}
              onPointerDown={(e) => onNodeDown(e, node)}
              onPointerEnter={(e) => onNodeEnter(e, node)}
              onPointerLeave={onNodeLeave}
              onClick={() => onNodeClick(node.id)}
            >
              {/* Selection ring */}
              {isSel && (
                <circle r={node.r + 6} fill="none" stroke="#FF4B1F" strokeWidth={1.5} opacity={0.45} />
              )}
              {/* Node */}
              <circle
                r={node.r}
                fill="url(#sg-grad)"
                opacity={isHov || isSel ? 0.95 : 0.72}
                filter={glowFilter}
                style={{ transition: "opacity 0.18s" }}
              />
              {/* Label */}
              <text
                textAnchor="middle"
                y={node.r + 13}
                fontSize="10.5"
                fontFamily="ui-monospace, 'Cascadia Code', monospace"
                fill={isHov || isSel ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)"}
                style={{ pointerEvents: "none", transition: "fill 0.18s" }}
              >
                {node.id.length > 12 ? node.id.slice(0, 11) + "…" : node.id}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && !dragRef.current && (
        <div
          className="absolute z-20 pointer-events-none bg-[#160808] border border-[#FF4B1F]/25 rounded-xl px-4 py-3 shadow-2xl"
          style={{
            left: flipTooltip ? tooltip.x - 120 : tooltip.x + 14,
            top: Math.max(8, tooltip.y - 36),
          }}
        >
          <p className="text-white text-[13px] font-semibold leading-none mb-1.5">{tooltip.node.id}</p>
          <div className="flex items-center gap-2">
            <div className="h-[2px] rounded-full bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21]" style={{ width: `${tooltip.node.level * 0.6}px` }} />
            <span className="text-[#FF6A21] text-[11px] font-mono">{tooltip.node.level}%</span>
          </div>
        </div>
      )}

      {/* Deselect hint */}
      <AnimatePresence>
        {selected && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            onClick={() => setSelected(null)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/35 text-[11px] font-mono bg-black/40 border border-white/10 rounded-full px-4 py-1.5 hover:text-white/60 transition-colors"
          >
            click again to clear
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SkillGraph() {
  const [view, setView] = useState<"graph" | "bars">("graph")

  return (
    <section id="skills" className="w-full bg-[#0A0404] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="text-white/30 text-sm font-medium italic mb-6 block">{"(/ Skills )"}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-white tracking-tight">
              Tech Stack
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <p className="text-white/35 text-[11px] font-mono leading-relaxed lg:text-right">
              Hover to inspect · Click to highlight connections · Drag to rearrange
            </p>
            {/* View toggle */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
              {(["graph", "bars"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    view === v
                      ? "bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] text-white shadow-md"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {v === "graph" ? "Force Graph" : "Bar View"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "graph" ? (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <Graph />

              {/* Legend */}
              <div className="flex items-center gap-8 mt-6 justify-center flex-wrap">
                {[
                  { label: "High proficiency", r: 13 },
                  { label: "Mid proficiency",  r: 10 },
                  { label: "Foundational",     r: 7  },
                ].map(({ label, r }) => (
                  <div key={label} className="flex items-center gap-2">
                    <svg width={r * 2 + 4} height={r * 2 + 4} style={{ overflow: "visible" }}>
                      <defs>
                        <radialGradient id={`lg-${r}`} cx="38%" cy="32%" r="62%">
                          <stop offset="0%"   stopColor="#FF7545" />
                          <stop offset="100%" stopColor="#FF3510" />
                        </radialGradient>
                      </defs>
                      <circle cx={r + 2} cy={r + 2} r={r} fill={`url(#lg-${r})`} opacity={0.72} />
                    </svg>
                    <span className="text-white/30 text-[11px] font-mono">{label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-white/35" />
                  <span className="text-white/30 text-[11px] font-mono">Relationship</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="bars"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <BarFallback />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
