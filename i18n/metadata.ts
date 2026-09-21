import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { SITE_URL } from "@/lib/site"

type Locale = (typeof routing.locales)[number]

/** The full URL of a page in one language, without a trailing slash: "https://…/it/faq". */
export const absoluteUrl = (href: string, locale: Locale) =>
  `${SITE_URL}${getPathname({ href, locale }).replace(/\/$/, "")}`

/**
 * Metadata for one page: title, description, canonical and hreflang links, and the Open Graph
 * and Twitter tags that go with them. The page is `href`; leave out `title` and `description` for
 * the site-wide ones.
 *
 * Every page needs the whole set because Next.js merges metadata shallowly: a page that sets
 * `openGraph` at all replaces the layout's, and one that does not shares the layout's og:url and
 * og:title with every other page.
 *
 * A relative canonical cannot be used here: English pages are served from "/faq" but rendered at
 * the internal "/en/faq", and "./" would resolve against the latter.
 */
export async function pageMetadata(
  href: string,
  page?: { title: string; description: string }
): Promise<Metadata> {
  const [locale, t, tImage] = await Promise.all([
    getLocale(),
    getTranslations("Metadata"),
    getTranslations("OpenGraph"),
  ])
  const path = (locale: Locale) => getPathname({ href, locale })

  // The document title gets " · Nixie" from the layout's template; social cards do not, so they
  // carry it themselves.
  const title = page ? `${page.title} · Nixie` : t("title")
  const description = page?.description ?? t("description")
  // The card from app/[locale]/opengraph-image.tsx. Next.js adds it on its own only when no page
  // sets openGraph, so it is named here; its id and size must match that file. The proxy leaves
  // these URLs alone, so the English one is not redirected.
  const image = {
    url: `/${locale}/opengraph-image/card`,
    width: 1200,
    height: 630,
    alt: tImage("alt"),
    type: "image/png",
  }

  return {
    ...(page && { title: page.title, description }),
    alternates: {
      canonical: path(locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
        "x-default": path(routing.defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Nixie",
      title,
      description,
      url: path(locale),
      locale: t("ogLocale"),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
