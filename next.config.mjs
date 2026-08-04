/** @type {import('next').NextConfig} */

// The canonical origin. Kept as a literal because next.config runs outside the
// TS path aliases and cannot import from constants/site.ts.
const CANONICAL_HOST = "siserpratap.in"

// Hosts that serve the same app but must not accumulate their own ranking
// signals. Redirecting (rather than noindex-ing) forwards any link equity these
// URLs have already earned to the canonical domain.
const DUPLICATE_HOSTS = ["www.siserpratap.in", "portfolio-siser-pratap.vercel.app"]

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // GitHub contribution chart rendered in <GitHubActivity />.
      { protocol: "https", hostname: "ghchart.rshah.org" },
    ],
  },

  // Preview deployments get their own generated hostnames, so they never match
  // these rules and stay reachable.
  async redirects() {
    return DUPLICATE_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: `https://${CANONICAL_HOST}/:path*`,
      permanent: true, // 308
    }))
  },
}

export default nextConfig
