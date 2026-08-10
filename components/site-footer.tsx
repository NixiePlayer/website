import type { Route } from "next"
import Link from "next/link"

import { LICENSE_URL, REPO_URL, SPONSOR_URL } from "@/lib/site"

// External links are flagged rather than detected from the href, so the internal ones stay
// plain route literals and a typo in one is a type error.
type FooterLink =
  | { label: string; href: Route }
  | { label: string; href: string; external: true }

const columns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/#download", label: "Download" },
      { href: "/#features", label: "Features" },
      { href: "/changelog", label: "Changelog" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/security", label: "Security" },
      { href: LICENSE_URL, label: "MIT license", external: true },
    ],
  },
  {
    heading: "Project",
    links: [
      { href: REPO_URL, label: "Source on GitHub", external: true },
      { href: `${REPO_URL}/issues`, label: "Report a bug", external: true },
      { href: SPONSOR_URL, label: "Sponsor", external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-4 label text-muted-foreground">
                {column.heading}
              </h2>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link ? (
                      <a
                        href={link.href}
                        className="transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-primary"
                      >
                        {link.label}
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
          <p>
            Nixie is an independent, unofficial client. It is not affiliated
            with, endorsed by, or sponsored by YouTube, Google, Spotify, LRCLIB
            or NetEase Cloud Music. YouTube and YouTube Music are trademarks of
            Google LLC, used here only to say what Nixie connects to. No name,
            logo or interface of theirs is copied or imitated. You need your own
            YouTube Music account to use Nixie, and your use of that account
            remains subject to YouTube&apos;s terms.
          </p>
          <p>
            Nixie requires a YouTube Music Premium subscription. It is not a way
            to get Premium features without Premium.
          </p>
          <p className="font-mono">
            MIT licensed. Built by{" "}
            <a
              href="https://github.com/TheEdoRan"
              className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
            >
              TheEdoRan
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
