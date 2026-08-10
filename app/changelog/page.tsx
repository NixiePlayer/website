import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"

import { getReleases } from "@/lib/github"
import { formatDate, RELEASES_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every Nixie release, and what changed in it.",
}

export default async function Page() {
  const releases = await getReleases()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="headline text-[clamp(2rem,5vw,3rem)] leading-tight">
        Changelog
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Every release, newest first. Nixie updates itself, so you are normally
        reading this out of curiosity rather than necessity.
      </p>

      {releases.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <p className="leading-relaxed">
            The release list could not be loaded from GitHub just now.
          </p>
          <p className="mt-4">
            <a
              href={RELEASES_URL}
              className="inline-flex items-center gap-1 text-primary underline decoration-1 underline-offset-4"
            >
              Read it on GitHub
              <ArrowUpRight className="size-3.5" />
            </a>
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-12">
          {releases.map((release) => (
            <article
              key={release.tag}
              className="border-t border-border pt-8 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="headline text-2xl">{release.tag}</h2>
                <time
                  dateTime={release.publishedAt}
                  className="font-mono text-xs text-muted-foreground"
                >
                  {formatDate(release.publishedAt)}
                </time>
                <a
                  href={release.url}
                  className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Assets
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>

              {/* Release notes are generated from the repo's own commits and rendered by
                  GitHub's sanitizing markdown endpoint. See components/repo-doc.tsx for the
                  full reasoning on injecting this HTML. */}
              {release.bodyHtml ? (
                <div
                  className="prose prose-sm mt-5 max-w-none prose-nixie"
                  dangerouslySetInnerHTML={{ __html: release.bodyHtml }}
                />
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">
                  No notes for this release.
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
