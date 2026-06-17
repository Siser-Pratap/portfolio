"use client"

import Image from "next/image"

const blogs = [
  {
    label: "Tech",
    image: "/visionweave.jpg",
    date: "May 12, 2025",
    title: "Why I Reach for Next.js First: Server Components, Caching, and the App Router",
    href: "#",
  },
  {
    label: "Web",
    image: "/meetPro.jpg",
    date: "March 28, 2025",
    title: "Building Real-Time Features with WebSockets and Stream SDK",
    href: "#",
  },
  {
    label: "AI",
    image: "/intelai.jpg",
    date: "January 15, 2025",
    title: "Shipping an AI Chat Platform: Lessons from Building IntelAI",
    href: "#",
  },
]

const Blogs = () => {
  return (
    <section id="blogs" className="w-full bg-[#FFFFFF] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        <div className="flex flex-col mb-16">
          <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{'(/ Blogs )'}</span>
          <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight">
            Latest Insights From Siser.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
          {blogs.map((blog, index) => (
            <a key={index} href={blog.href} className="flex flex-col group cursor-pointer">
              <div className="w-full aspect-[4/3] relative rounded-[24px] overflow-hidden mb-6">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[#0D0505] px-4 py-1.5 rounded-full text-xs font-semibold capitalize">
                    {blog.label}
                  </span>
                </div>
              </div>
              <span className="text-[#8A8A8A] text-xs font-medium mb-3">{blog.date}</span>
              <h3 className="text-[18px] font-[700] text-[#0D0505] leading-[1.4] group-hover:text-[#FF4B1F] transition-colors">
                {blog.title}
              </h3>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Blogs
