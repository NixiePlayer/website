import createMiddleware from "next-intl/middleware"

import { routing } from "@/i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Everything except Next internals, Vercel internals and files with an extension (icons,
  // robots.txt, sitemap.xml, the OG image).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
