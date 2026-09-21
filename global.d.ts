import type { routing } from "@/i18n/routing"
import type messages from "@/messages/en.json"

// English is the source of truth: a key missing from it, or a typo in a t() call, is a type error.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
