import type { MetadataRoute } from "next"

import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { SITE_URL } from "@/lib/site"

const routes = ["/", "/faq", "/changelog", "/privacy", "/security"] as const

const url = (href: string, locale: (typeof routing.locales)[number]) =>
  `${SITE_URL}${getPathname({ href, locale }).replace(/\/$/, "")}`

// One entry per page, in English, with every language version listed as an alternate so search
// engines pair them up.
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: url(route, routing.defaultLocale),
    changeFrequency: route === "/changelog" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, url(route, locale)])
      ),
    },
  }))
}
