"use client"

const Footer = () => {
  return (
    <footer className="py-12 bg-transparent text-center border-t border-white/[0.04] mt-16 relative z-10">
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-white/30">
        &copy; {new Date().getFullYear()} Siser Pratap. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
