import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "it"],
  defaultLocale: "en",
  // English keeps the unprefixed URLs the site has always had; Italian lives under /it. A first
  // visit to / is still redirected to /it when the browser asks for Italian, and the choice made
  // in the switcher is remembered in a cookie after that.
  localePrefix: "as-needed",
})
