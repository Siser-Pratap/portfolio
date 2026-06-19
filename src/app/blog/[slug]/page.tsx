import { blogPosts, getPostBySlug } from "@/src/data/blogPosts"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Siser Pratap`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <main className="bg-[#FFFFFF] min-h-screen">
      {/* Header */}
      <header className="w-full bg-[#0D0505] py-6 px-10">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-white text-xl font-bold italic tracking-tight">
            Siser.
          </Link>
          <Link href="/#blogs" className="text-white/60 text-sm hover:text-white transition-colors">
            ← Back to portfolio
          </Link>
        </div>
      </header>

      {/* Hero image */}
      <div className="w-full h-[420px] relative">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <article className="max-w-[800px] mx-auto px-10 pb-[120px]">
        <div className="flex items-center gap-4 mb-6 -mt-2">
          <span className="bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] text-white px-4 py-1.5 rounded-full text-xs font-semibold">
            {post.label}
          </span>
          <span className="text-[#8A8A8A] text-sm">{post.date}</span>
        </div>

        <h1 className="text-[clamp(28px,4vw,48px)] font-[800] text-[#0D0505] leading-[1.1] tracking-tight mb-8">
          {post.title}
        </h1>

        <p className="text-[#0D0505]/60 text-lg leading-relaxed mb-12 border-l-4 border-[#FF4B1F] pl-6">
          {post.excerpt}
        </p>

        <div
          className="prose prose-lg max-w-none text-[#0D0505]/80 leading-relaxed
            [&_h2]:text-[#0D0505] [&_h2]:text-2xl [&_h2]:font-[700] [&_h2]:mt-12 [&_h2]:mb-4
            [&_p]:mb-6 [&_p]:text-[16px] [&_p]:leading-[1.85]
            [&_code]:bg-[#F7F7F7] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#FF4B1F] [&_code]:text-sm [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer navigation */}
        <div className="mt-20 pt-10 border-t border-[#EAEAEA]">
          <Link
            href="/#blogs"
            className="flex items-center gap-3 text-[#0D0505] font-semibold hover:text-[#FF4B1F] transition-colors"
          >
            ← More writing
          </Link>
        </div>
      </article>
    </main>
  )
}
