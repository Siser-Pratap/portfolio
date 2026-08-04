import { ImageResponse } from "next/og"
import { getPostBySlug, blogPosts } from "@/src/data/blogPosts"
import { SITE } from "@/constants/site"

export const runtime = "edge"
export const alt = "Article by Siser Pratap"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export default function BlogOGImage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  const title = post?.title ?? "Writing"
  const label = post?.label ?? "Article"
  const date = post?.date ?? ""

  // Long headlines need to step down a size or they overflow the card.
  const fontSize = title.length > 70 ? 52 : title.length > 45 ? 64 : 76

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0505",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: Logo + category */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#ffffff", fontSize: 36, fontWeight: 800, fontStyle: "italic", letterSpacing: "-2px" }}>
            Siser.
          </span>
          <span
            style={{
              background: "rgba(255,75,31,0.15)",
              border: "1px solid rgba(255,75,31,0.4)",
              color: "#FF6A21",
              fontSize: 15,
              fontWeight: 600,
              padding: "8px 22px",
              borderRadius: 9999,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>

        {/* Middle: Headline */}
        <h1
          style={{
            color: "#ffffff",
            fontSize,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            margin: 0,
            display: "flex",
          }}
        >
          {title}
        </h1>

        {/* Bottom: byline + accent bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(to right, #FF4B1F, #FF6A21)",
              borderRadius: 9999,
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
            {SITE.name}
            {date ? ` · ${date}` : ""} · {SITE.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    ),
    size
  )
}
