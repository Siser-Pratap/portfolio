"use client"

import Image from "next/image"
import Link from "next/link"
import { blogPosts } from "@/src/data/blogPosts"
import { motion } from "framer-motion"

const Blogs = () => {
  return (
    <section id="blogs" className="w-full bg-[#FFFFFF] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        <motion.div
          className="flex flex-col mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{"(/ Blogs )"}</span>
          <div className="flex justify-between items-end">
            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight">
              Latest Insights From Siser.
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col group cursor-pointer">
                <div className="w-full aspect-[4/3] relative rounded-[24px] overflow-hidden mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#0D0505] px-4 py-1.5 rounded-full text-xs font-semibold">
                      {post.label}
                    </span>
                  </div>
                </div>
                <span className="text-[#8A8A8A] text-xs font-medium mb-3">{post.date}</span>
                <h3 className="text-[18px] font-[700] text-[#0D0505] leading-[1.4] group-hover:text-[#FF4B1F] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Blogs
