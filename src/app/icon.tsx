import { ImageResponse } from "next/og"

// Generated rather than shipped as a static file so the mark stays in sync with
// the brand colours and renders identically everywhere. Next emits the <link>
// tag automatically from this file's presence.
export const runtime = "edge"
export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      // Orange ground rather than the site's near-black: at 16px a white glyph
      // on #0D0505 vanishes into a dark browser tab bar. The accent colour
      // stays legible on light and dark chrome alike.
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #FF4B1F, #FF6A21)",
          borderRadius: 14,
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "-2px",
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
