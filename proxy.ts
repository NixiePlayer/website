import createMiddleware from "next-intl/middleware"

import { routing } from "@/i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Everything except Next internals, Vercel internals, files with an extension (icons,
  // robots.txt, sitemap.xml) and the OG images. Next links those as /en/opengraph-image/… and
  // /it/opengraph-image/…, and the proxy would redirect the English one to an unprefixed URL
  // that social scrapers then have to follow.
  matcher: "/((?!api|_next|_vercel|.*/opengraph-image|.*\\..*).*)",
}
