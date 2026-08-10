import Image from "next/image"
import Link from "next/link"

import { REPO_URL } from "@/lib/site"

const links = [
  { href: "/#features", label: "Features" },
  { href: "/faq", label: "FAQ" },
  { href: "/changelog", label: "Changelog" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-sm">
          <Image
            src="/icon.png"
            alt=""
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="headline text-lg">Nixie</span>
          <span className="mt-px hidden label text-muted-foreground sm:inline">
            Beta
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-5 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={REPO_URL}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
