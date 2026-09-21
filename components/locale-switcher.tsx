"use client"

import { LanguagesIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

// Each language is named in itself, so a reader who cannot read the current page can still find
// their own.
const names: Record<(typeof routing.locales)[number], string> = {
  en: "English",
  it: "Italiano",
}

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("label")}
            disabled={pending}
            className="text-muted-foreground"
          />
        }
      >
        <LanguagesIcon data-icon="inline-start" />
        <span className="font-mono text-xs uppercase">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(next) =>
              // The proxy stores the new locale in a cookie on this navigation, so it sticks. The
              // page is the same one in another language, so the reader keeps their place.
              startTransition(() =>
                router.replace(pathname, { locale: next, scroll: false })
              )
            }
          >
            {routing.locales.map((value) => (
              <DropdownMenuRadioItem key={value} value={value} lang={value}>
                {names[value]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
