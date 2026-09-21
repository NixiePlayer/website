import type { Metadata } from "next"
import { getLocale } from "next-intl/server"

import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

/**
 * Canonical and hreflang links for one page. A relative canonical cannot be used here: English
 * pages are served from "/faq" but rendered at the internal "/en/faq", and "./" would resolve
 * against the latter.
 */
export async function alternates(
  href: string
): Promise<Metadata["alternates"]> {
  const locale = await getLocale()
  const path = (locale: (typeof routing.locales)[number]) =>
    getPathname({ href, locale })

  return {
    canonical: path(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
      "x-default": path(routing.defaultLocale),
    },
  }
}
