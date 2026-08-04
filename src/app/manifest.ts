import type { MetadataRoute } from "next"
import { SITE } from "@/constants/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.jobTitle}`,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0D0505",
    // Matches the app surface rather than the orange accent — in standalone
    // mode this colours the title bar, and orange chrome above a near-black
    // page reads as a rendering bug rather than branding.
    theme_color: "#0D0505",
    categories: ["portfolio", "technology", "business"],
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  }
}
