import type { MetadataRoute } from "next"
import { SITE, absoluteUrl } from "@/constants/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes return JSON and have no search value; crawling them only
      // burns crawl budget and can trip the booking/chat rate limiters.
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  }
}
