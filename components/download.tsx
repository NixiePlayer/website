"use client"

import { ArrowDown, ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"

import { ButtonLink } from "@/components/ui/button-link"
import { archFromRenderer, isMac, type Arch } from "@/lib/detect-arch"
import {
  formatSize,
  LATEST_RELEASE_URL,
  PLATFORMS_URL,
  type LatestRelease,
} from "@/lib/site"

/**
 * Ask the browser which architecture it is running on.
 *
 * Chromium answers directly. Everything else has to be inferred from the GPU, because every Mac
 * browser reports "Intel Mac OS X" in its user agent whatever the chip.
 */
async function detectArch(): Promise<Arch | null> {
  const uaData = (
    navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues: (
          hints: string[]
        ) => Promise<{ architecture?: string }>
      }
    }
  ).userAgentData

  if (uaData) {
    try {
      const { architecture } = await uaData.getHighEntropyValues([
        "architecture",
      ])
      if (architecture === "arm") return "arm"
      if (architecture === "x86") return "x86"
    } catch {
      // Fall through to the GPU string.
    }
  }

  try {
    const gl = document.createElement("canvas").getContext("webgl")
    const ext = gl?.getExtension("WEBGL_debug_renderer_info")
    if (gl && ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
      if (typeof renderer === "string") return archFromRenderer(renderer)
    }
  } catch {
    // No WebGL, no signal.
  }

  return null
}

type Detected = { mac: boolean; arch: Arch }

export function Download({ release }: { release: LatestRelease | null }) {
  // ponytail: the first render assumes an Apple silicon Mac, which is both the common case and
  // the safe one — an Apple silicon Mac runs the Intel build under Rosetta, while an Intel Mac
  // cannot open the arm64 build at all. Server-side detection would need headers() and would
  // cost the page its static rendering, for a guess this component already names on the button.
  const [detected, setDetected] = useState<Detected>({ mac: true, arch: "arm" })

  useEffect(() => {
    let active = true

    const mac = isMac(navigator.userAgent, navigator.maxTouchPoints)

    detectArch().then((arch) => {
      if (active) setDetected({ mac, arch: arch ?? "arm" })
    })

    return () => {
      active = false
    }
  }, [])

  // No release data means the API was unreachable or the build names changed. Send people to
  // the page that is always right rather than to a link built out of guesses.
  if (!release) {
    return (
      <div className="flex flex-col items-start gap-3">
        <ButtonLink
          href={LATEST_RELEASE_URL}
          className="h-12 gap-2 px-5 text-[0.95rem]"
        >
          <ArrowDown />
          Download from GitHub
        </ButtonLink>
        <p className="font-mono text-xs text-muted-foreground">
          macOS · Apple silicon and Intel
        </p>
      </div>
    )
  }

  if (!detected.mac) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-lg">
          <span className="font-medium">macOS only for now.</span>{" "}
          <span className="text-muted-foreground">
            Windows and Linux are planned, with no date attached.
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <ButtonLink
            href={PLATFORMS_URL}
            variant="outline"
            className="h-10 gap-1.5 px-4"
          >
            Follow along on GitHub
            <ArrowUpRight />
          </ButtonLink>
          <a
            href="#download"
            className="text-sm text-muted-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
          >
            Get the Mac builds anyway
          </a>
        </div>
      </div>
    )
  }

  const primary = detected.arch === "arm" ? "applesilicon" : "intel"
  const other = detected.arch === "arm" ? "intel" : "applesilicon"
  const names = { applesilicon: "Apple silicon", intel: "Intel" } as const

  return (
    <div className="flex flex-col items-start gap-3">
      <ButtonLink
        href={release[primary].url}
        className="h-12 gap-2 px-5 text-[0.95rem]"
      >
        <ArrowDown />
        Download for {names[primary]}
      </ButtonLink>

      <p className="font-mono text-xs text-muted-foreground">
        v{release.version} · {formatSize(release[primary].size)} · signed and
        notarized
      </p>

      {/* The architecture is a guess, so the other build is always one click away and never
          hidden behind a menu. */}
      <p className="text-sm">
        <span className="text-muted-foreground">
          {detected.arch === "arm" ? "Intel Mac?" : "Apple silicon Mac?"}
        </span>{" "}
        <a
          href={release[other].url}
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
        >
          Get the {names[other]} build instead
        </a>
      </p>
    </div>
  )
}
