import { useTranslations } from "next-intl"
import Image from "next/image"

import icon from "@/app/icon.png"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { Link } from "@/i18n/navigation"
import { REPO_URL } from "@/lib/site"

const links = [
  { href: "/#features", key: "features" },
  { href: "/faq", key: "faq" },
  { href: "/changelog", key: "changelog" },
] as const

export function SiteHeader() {
  const t = useTranslations("Header")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          aria-label={t("home")}
          className="flex items-center gap-2.5 rounded-sm"
        >
          {/* The same file the app's favicon comes from, so the two can never drift. */}
          <Image
            src={icon}
            alt=""
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="headline text-lg">Nixie</span>
          <span className="mt-px hidden label text-muted-foreground sm:inline">
            {t("beta")}
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-5 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              {t(link.key)}
            </Link>
          ))}
          <a
            href={REPO_URL}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("github")}
          </a>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  )
}
