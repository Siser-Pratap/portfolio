import { ImageResponse } from "next/og"

// 180×180 is the size iOS uses for a home-screen bookmark. Without this, Safari
// screenshots the page instead, which looks broken.
export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #FF4B1F, #FF6A21)",
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: "-4px",
            lineHeight: 1,
          }}
        >
          S
        </span>
      </div>
    ),
    size
  )
}
