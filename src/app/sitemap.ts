import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/constants/site"
import { blogPosts } from "@/src/data/blogPosts"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/book"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  const postRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
    // Posts store a display date ("May 12, 2025"). Fall back to now if a future
    // entry uses a format Date can't parse, so a typo never breaks the sitemap.
    const parsed = new Date(post.date)
    return {
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: Number.isNaN(parsed.getTime()) ? now : parsed,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }
  })

  return [...staticRoutes, ...postRoutes]
}
