import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"
import { locale as localeParam } from "next/root-params"

import { routing } from "@/i18n/routing"

// The locale comes from the [locale] root segment through next/root-params, so every page stays
// statically prerendered without setRequestLocale in each one. An explicit locale, as in
// getTranslations({ locale }), wins: the OG image route needs it because route handlers cannot
// read root params.
export default getRequestConfig(async ({ locale: explicit }) => {
  const locale = explicit ?? (await localeParam())
  if (!hasLocale(routing.locales, locale)) notFound()

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
