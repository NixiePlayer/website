"use client"

import { ArrowDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { ButtonLink } from "@/components/ui/button-link"
import {
  archFromRenderer,
  osFromUserAgent,
  type Arch,
  type Os,
} from "@/lib/detect-platform"
import { formatSize, LATEST_RELEASE_URL, type LatestRelease } from "@/lib/site"

/**
 * Ask the browser which architecture it is running on. Only Macs need this: Windows and Linux
 * ship one build each.
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

type Detected = { os: Os | null; arch: Arch }

const inlineLink =
  "underline decoration-1 underline-offset-4 transition-colors hover:text-primary"

export function Download({ release }: { release: LatestRelease | null }) {
  // ponytail: the first render assumes an Apple silicon Mac, which is both the common case and
  // the safe one: an Apple silicon Mac runs the Intel build under Rosetta, while an Intel Mac
  // cannot open the arm64 build at all. Server-side detection would need headers() and would
  // cost the page its static rendering, for a guess this component already names on the button.
  const [detected, setDetected] = useState<Detected>({ os: "mac", arch: "arm" })

  useEffect(() => {
    let active = true

    const os = osFromUserAgent(navigator.userAgent, navigator.maxTouchPoints)

    // Only a Mac needs the architecture; the other platforms resolve at once.
    const arch = os === "mac" ? detectArch() : Promise.resolve(null)

    arch.then((arch) => {
      if (active) setDetected({ os, arch: arch ?? "arm" })
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
          macOS · Windows · Linux
        </p>
      </div>
    )
  }

  if (!detected.os) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-lg">
          <span className="font-medium">Nixie is a desktop app.</span>{" "}
          <span className="text-muted-foreground">
            It runs on macOS, Windows and Linux.
          </span>
        </p>
        <Link href="/#download" className={`text-sm ${inlineLink}`}>
          See every build
        </Link>
      </div>
    )
  }

  if (detected.os === "mac") {
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
          <a href={release[other].url} className={inlineLink}>
            Get the {names[other]} build instead
          </a>
          <span className="text-muted-foreground"> · </span>
          <Link href="/#download" className={inlineLink}>
            Windows and Linux
          </Link>
        </p>
      </div>
    )
  }

  const windows = detected.os === "windows"
  const asset = windows ? release.windows : release.linux

  return (
    <div className="flex flex-col items-start gap-3">
      <ButtonLink href={asset.url} className="h-12 gap-2 px-5 text-[0.95rem]">
        <ArrowDown />
        Download for {windows ? "Windows" : "Linux"}
      </ButtonLink>

      <p className="font-mono text-xs text-muted-foreground">
        v{release.version} · {formatSize(asset.size)} ·{" "}
        {windows ? "Windows 10 and 11, 64-bit" : "AppImage, 64-bit"}
      </p>

      <p className="text-sm">
        {windows ? (
          <>
            <span className="text-muted-foreground">
              Signing in with Chrome?
            </span>{" "}
            <Link href="/#extension" className={inlineLink}>
              You will also need Nixie Link
            </Link>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">
              Mark it executable, then run it.
            </span>{" "}
            <Link href="/#download" className={inlineLink}>
              Install notes
            </Link>
          </>
        )}
        <span className="text-muted-foreground"> · </span>
        <Link href="/#download" className={inlineLink}>
          Other platforms
        </Link>
      </p>
    </div>
  )
}
