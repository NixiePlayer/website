import { createNavigation } from "next-intl/navigation"

import { routing } from "@/i18n/routing"

// Locale-aware wrappers around next/link and next/navigation: an href of "/faq" renders as
// "/it/faq" on an Italian page.
export const { Link, usePathname, useRouter, getPathname } =
  createNavigation(routing)
