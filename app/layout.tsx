import type { Metadata } from "next"
import { DM_Mono, Instrument_Sans, Inter } from "next/font/google"

import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

// Three faces, three jobs: Instrument Sans sets headlines, Inter sets prose and matches the
// app's own face, DM Mono sets every measured value on the site: LUFS targets, versions,
// file sizes, dB.
const display = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})

const description =
  "Nixie is a desktop client for YouTube Music on macOS. Loudness normalization you can set, time-synced lyrics, and a session that comes back where you left it. Free, MIT licensed, no telemetry."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nixie: a desktop client for YouTube Music",
    template: "%s · Nixie",
  },
  description,
  applicationName: "Nixie",
  // Relative, so every route inherits this and resolves it against its own path.
  alternates: { canonical: "./" },
  keywords: [
    "YouTube Music desktop",
    "YouTube Music client macOS",
    "loudness normalization",
    "LUFS",
    "synced lyrics",
  ],
  openGraph: {
    type: "website",
    siteName: "Nixie",
    title: "Nixie: a desktop client for YouTube Music",
    description,
    url: SITE_URL,
    images: [{ url: "/og.png", width: 2400, height: 600, alt: "Nixie" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nixie: a desktop client for YouTube Music",
    description,
    images: ["/og.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        display.variable,
        sans.variable,
        mono.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
