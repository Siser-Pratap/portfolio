"use client"

// TODO: Replace the placeholder entries below with real client/company logos.
// Each logo should be an SVG or PNG added to /public/logos/.
// Replace `text` with <Image src="/logos/client-name.svg" alt="Client Name" width={120} height={40} />

const logos = [
  { name: "Synapsis Medical" },
  { name: "DC Infotech" },
  { name: "Client Three" },
  { name: "Client Four" },
  { name: "Client Five" },
  { name: "Client Six" },
]

const ClientLogos = () => {
  return (
    <section className="w-full bg-white py-10 border-b border-[#EAEAEA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-10 flex justify-between items-center opacity-50 grayscale gap-8 overflow-x-auto no-scrollbar">
        {logos.map((logo, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#0D0505]"></div>
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
