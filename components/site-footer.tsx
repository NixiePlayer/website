import { useTranslations, type Messages } from "next-intl"

import { Link } from "@/i18n/navigation"
import {
  EXTENSION_REPO_URL,
  LICENSE_URL,
  REPO_URL,
  SPONSOR_URL,
} from "@/lib/site"

// External links are flagged rather than detected from the href, so the internal ones go
// through the locale-aware Link and keep the reader in their language.
type Label = keyof Messages["Footer"]
type FooterLink = { label: Label; href: string; external?: true }

const columns: { heading: Label; links: FooterLink[] }[] = [
  {
    heading: "product",
    links: [
      { href: "/#download", label: "download" },
      { href: "/#features", label: "features" },
      { href: "/changelog", label: "changelog" },
      { href: "/faq", label: "faq" },
    ],
  },
  {
    heading: "legal",
    links: [
      { href: "/privacy", label: "privacy" },
      { href: "/security", label: "security" },
      { href: LICENSE_URL, label: "license", external: true },
    ],
  },
  {
    heading: "project",
    links: [
      { href: REPO_URL, label: "source", external: true },
      {
        href: EXTENSION_REPO_URL,
        label: "extension",
        external: true,
      },
      { href: `${REPO_URL}/issues`, label: "bug", external: true },
      { href: SPONSOR_URL, label: "sponsor", external: true },
    ],
  },
]

const authorLink = (chunks: React.ReactNode) => (
  <a
    href="https://github.com/TheEdoRan"
    className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
  >
    {chunks}
  </a>
)

export function SiteFooter() {
  const t = useTranslations("Footer")

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-4 label text-muted-foreground">
                {t(column.heading)}
              </h2>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="transition-colors hover:text-primary"
                      >
                        {t(link.label)}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-primary"
                      >
                        {t(link.label)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The full disclaimer, in the footer of every page, because the app names a trademark
            it has no relationship with. The short version also sits under the hero, where it is
            actually read. */}
        <div className="mt-14 space-y-4 border-t border-border pt-8 text-xs leading-relaxed text-muted-foreground">
          <p>{t("disclaimer")}</p>
          <p>{t("premium")}</p>
          <p className="font-mono">{t.rich("credit", { link: authorLink })}</p>
        </div>
      </div>
    </footer>
  )
}
