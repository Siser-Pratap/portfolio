"use client"

const ClientLogos = () => {
  return (
    <section className="w-full bg-white py-10 border-b border-[#EAEAEA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-10 flex justify-between items-center opacity-60 grayscale gap-8 overflow-x-auto no-scrollbar">
        {/* Placeholder Logos (Using text for now) */}
        {["LOGOIPSUM", "LOGOIPSUM", "LOGOIPSUM", "LOGOIPSUM", "LOGOIPSUM", "LOGOIPSUM"].map((logo, i) => (
          <div key={i} className="text-2xl font-black italic tracking-tighter text-black flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black"></div>
            {logo}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ClientLogos