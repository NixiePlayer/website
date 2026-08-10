import { readFileSync } from "node:fs"
import { join } from "node:path"

import { ImageResponse } from "next/og"

/**
 * The social preview card, generated at build time.
 *
 * The repo banner is 4:1, which every social platform crops or letterboxes, so the card is
 * drawn here at the 1.91:1 both Open Graph and a large Twitter card expect. Next serves this
 * file for og:image and, because no twitter image is set, for twitter:image too.
 */
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt =
  "Nixie: a desktop client for YouTube Music, with loudness normalization and synced lyrics"

// Read at build time: satori has no filesystem and needs the bytes inline.
const icon = readFileSync(join(process.cwd(), "app/icon.png")).toString(
  "base64"
)

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
        background: "#0f0f0f",
        // Linear, not radial: satori renders a radial gradient at low resolution and it
        // comes out in visible rings.
        backgroundImage: "linear-gradient(115deg, #2b0009 0%, #0f0f0f 55%)",
        fontFamily: "sans-serif",
      }}
    >
      <img
        src={`data:image/png;base64,${icon}`}
        alt=""
        width={148}
        height={148}
        style={{ borderRadius: 34 }}
      />
      <div
        style={{
          marginTop: 44,
          fontSize: 82,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: -2,
        }}
      >
        Nixie
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 34,
          lineHeight: 1.35,
          color: "#a6a6a6",
          maxWidth: 900,
        }}
      >
        A desktop client for YouTube Music on macOS. Loudness normalization,
        synced lyrics, and a session that comes back where you left it.
      </div>
      {/* The red edge from the project banner, so the card and the repo read as one thing. */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 10,
          background: "linear-gradient(90deg, #ff0033, #cc0000 55%, #4d0013)",
        }}
      />
    </div>,
    size
  )
}
