import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Siser Pratap — Full Stack Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
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
        {/* Top: Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#ffffff", fontSize: 36, fontWeight: 800, fontStyle: "italic", letterSpacing: "-2px" }}>
            Siser.
          </span>
        </div>

        {/* Middle: Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ color: "#FF4B1F", fontSize: 20, fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase" }}>
            Full Stack Developer
          </span>
          <h1
            style={{
              color: "#ffffff",
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 0.88,
              letterSpacing: "-4px",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            CREATIVE<br />DEVELOPER
          </h1>
        </div>

        {/* Bottom: Tags + accent bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(to right, #FF4B1F, #FF6A21)",
              borderRadius: 9999,
            }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            {["React", "Next.js", "Node.js", "TypeScript", "Three.js"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,75,31,0.15)",
                  border: "1px solid rgba(255,75,31,0.4)",
                  color: "#FF6A21",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "6px 18px",
                  borderRadius: 9999,
                  letterSpacing: "1px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
            siserpratap.dev · siserinsevoc@gmail.com
          </span>
        </div>
      </div>
    ),
    size
  )
}
