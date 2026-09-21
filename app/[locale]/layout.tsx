import { cn } from "cn"
import type { Metadata, Viewport } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages, getTranslations } from "next-intl/server"

import "../globals.css"
import { DM_Mono, Instrument_Sans, Inter } from "next/font/google"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { routing } from "@/i18n/routing"
import { SITE_URL } from "@/lib/site"

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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata")
  const { Metadata: m } = await getMessages()
  const title = t("title")
  const description = t("description")

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s · Nixie" },
    description,
    applicationName: "Nixie",
    keywords: m.keywords,
    authors: [
      { name: "Edoardo Ranghieri", url: "https://github.com/TheEdoRan" },
    ],
    creator: "Edoardo Ranghieri",
    // No image here, and none under twitter: opengraph-image.tsx supplies both, at the ratio
    // social platforms actually crop to.
    openGraph: {
      type: "website",
      siteName: "Nixie",
      title,
      description,
      url: SITE_URL,
      locale: t("ogLocale"),
    },
    twitter: { card: "summary_large_image", title, description },
  }
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
}

// With Cache Components every root param needs at least one value at build time, and listing
// them all prerenders every page in both languages.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      // globals.css sets smooth scrolling for in-page links; this tells Next.js to suspend it
      // during route transitions, so a navigation jumps instead of animating from mid-page.
      data-scroll-behavior="smooth"
      className={cn(
        "antialiased",
        display.variable,
        sans.variable,
        mono.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        {/* Only what client components read goes to the browser. The rest of the copy is
            rendered on the server and would be dead weight in every page's payload. */}
        <NextIntlClientProvider
          messages={{
            Download: messages.Download,
            LocaleSwitcher: messages.LocaleSwitcher,
          }}
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
