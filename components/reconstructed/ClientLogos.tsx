"use client"

// TODO: Replace placeholder entries with real client/company logos.
// Each logo should be an SVG or PNG in /public/logos/.
// Swap the <div> + <span> blocks with <Image src="..." alt="..." width={120} height={40} />

const logos = [
  { name: "Synapsis Medical" },
  { name: "DC Infotech" },
  { name: "Client Three" },
  { name: "Client Four" },
  { name: "Client Five" },
  { name: "Client Six" },
]

// Duplicated for seamless infinite scroll
const allLogos = [...logos, ...logos]

const ClientLogos = () => {
  return (
    <section className="w-full bg-white py-10 border-b border-[#EAEAEA] overflow-hidden">
      <div className="flex animate-marquee w-max items-center gap-16">
        {allLogos.map((logo, i) => (
          <div
            key={i}
            className="flex items-center gap-3 shrink-0 opacity-40 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300"
          >
            <div className="w-7 h-7 rounded-full bg-[#0D0505]" />
            <span className="text-lg font-black italic tracking-tighter text-black whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ClientLogos
