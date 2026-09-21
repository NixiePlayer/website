import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/i18n/metadata"
import { routing } from "@/i18n/routing"

const routes = ["/", "/faq", "/changelog", "/privacy", "/security"] as const

// One entry per page per language, each listing every language version, itself included, so
// search engines pair them up. Google ignores hreflang pairs that are not listed from both sides.
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(route, locale),
      changeFrequency: route === "/changelog" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [l, absoluteUrl(route, l)])
          ),
          "x-default": absoluteUrl(route, routing.defaultLocale),
        },
      },
    }))
  )
}
