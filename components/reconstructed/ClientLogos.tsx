"use client"

// TODO: Replace placeholder entries with real client/company logos.
// Each logo should be an SVG or PNG in /public/logos/.
// Swap the <div> + <span> blocks with <Image src="..." alt="..." width={120} height={40} />

const logos = [
  { name: "Synapsis Medical Technologies" },
  { name: "M37Labs" },
  { name: "Authence" },
]

// The CSS keyframe moves -50% of total width. Each "half" must be wider than the viewport
// so there's never empty space. 8 copies × ~300 px each ≈ 2400 px per half — covers any screen.
const allLogos = Array.from({ length: 8 }, () => logos).flat()

const ClientLogos = () => {
  return (
    <section className="w-full bg-[#F7F7F7] dark:bg-[#0D0505] py-10 border-b border-[#0D0505]/10 dark:border-white/10 overflow-hidden">
      <div className="flex animate-marquee w-max items-center gap-16">
        {allLogos.map((logo, i) => (
          <div
            key={i}
            className="flex items-center gap-3 shrink-0 group cursor-default"
          >
            {/* Pulsing ring — opacity kept off the parent so ping is not dampened */}
            <span className="relative flex h-4 w-4 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4B1F] opacity-60" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-[#FF4B1F]" />
            </span>
            <span className="text-lg font-black italic tracking-tighter text-[#0D0505]/40 dark:text-white/40 whitespace-nowrap group-hover:text-[#0D0505]/80 dark:group-hover:text-white/80 transition-colors duration-300">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ClientLogos
