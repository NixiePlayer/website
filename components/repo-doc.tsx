import { ArrowUpRight } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { routing } from "@/i18n/routing"
import { getRenderedDoc } from "@/lib/github"
import { blobUrl } from "@/lib/site"

/**
 * A markdown file from the app's repository, rendered by GitHub.
 *
 * The repository is the single source of truth: the page the reader sees and the file shipped
 * with the app are the same document, so neither can drift from the other.
 *
 * On injecting the HTML: the markup is not user input. It is GitHub's rendering of a file in a
 * repository the site owner controls, fetched over HTTPS, and GitHub's markdown pipeline strips
 * scripts and event handlers before returning it. Writing to these files needs the same access
 * as writing to this component, so there is no privilege to escalate. Rendering happens on the
 * server at regeneration time, so nothing here is evaluated in a reader's session that was not
 * already baked into the page.
 */
export async function RepoDoc({
  path,
  title,
  intro,
}: {
  path: string
  title: string
  intro: string
}) {
  const [html, t, locale] = await Promise.all([
    getRenderedDoc(path),
    getTranslations("RepoDoc"),
    getLocale(),
  ])
  const source = blobUrl(path)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="headline text-[clamp(2rem,5vw,3rem)] leading-tight">
        {title}
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {intro}
        {/* The document is the one that ships with the app, which exists in English only. */}
        {locale !== routing.defaultLocale && ` ${t("englishOnly")}`}
      </p>
      <p className="mt-6">
        <a
          href={source}
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {t("onGithub", { path })}
          <ArrowUpRight className="size-3.5" />
        </a>
      </p>

      <hr className="my-10 border-border" />

      {html ? (
        <div
          className="prose max-w-none prose-nixie"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="leading-relaxed">{t("failed")}</p>
          <p className="mt-4">
            <a
              href={source}
              className="inline-flex items-center gap-1 text-primary underline decoration-1 underline-offset-4"
            >
              {t("readOnGithub", { path })}
              <ArrowUpRight className="size-3.5" />
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
