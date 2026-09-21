import { ArrowDown, ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import { getLocale, getMessages, getTranslations } from "next-intl/server"

import explore from "@/assets/explore.png"
import home from "@/assets/home.png"
import lyrics from "@/assets/lyrics.png"
import { Download } from "@/components/download"
import { LufsScale } from "@/components/lufs-scale"
import { Shot } from "@/components/shot"
import { ButtonLink } from "@/components/ui/button-link"
import { absoluteUrl, pageMetadata } from "@/i18n/metadata"
import { Link } from "@/i18n/navigation"
import { getLatestRelease } from "@/lib/github"
import {
  builds,
  EXTENSION_DOWNLOAD_URL,
  EXTENSION_INSTALL_URL,
  EXTENSION_PRIVACY_URL,
  formatSize,
  INSTALL_DOC_URL,
  LICENSE_URL,
  RELEASES_URL,
  REPO_URL,
  SIGN_IN_DOC_URL,
  SITE_URL,
  SPONSOR_URL,
} from "@/lib/site"

const inlineLink =
  "underline decoration-1 underline-offset-4 transition-colors hover:text-primary"

// Rich-text tags used by the messages below. Defined once here rather than inline, so they are
// not recreated on every render.
const accent = (chunks: React.ReactNode) => (
  <span className="text-primary">{chunks}</span>
)
const extensionLink = (chunks: React.ReactNode) => (
  <Link href="/#extension" className={inlineLink}>
    {chunks}
  </Link>
)
const installLink = (chunks: React.ReactNode) => (
  <a href={INSTALL_DOC_URL} className={inlineLink}>
    {chunks}
  </a>
)

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/")
}

export default async function Page() {
  const [release, t, tBuilds, messages, locale] = await Promise.all([
    getLatestRelease(),
    getTranslations("Home"),
    getTranslations("Builds"),
    getMessages(),
    getLocale(),
  ])
  // Lists of plain sentences are read straight from the messages: they carry no arguments and no
  // markup, so there is nothing for the formatter to do.
  const m = messages.Home

  // Structured data for the one thing this site is about. Written from the same constants the
  // page renders, so a changed URL or version cannot leave the markup lying.
  // ponytail: no FAQPage on /faq. Google dropped those rich results for everyone except
  // government and health sites in 2023, so it would be markup nobody reads.
  const url = (href: string) => absoluteUrl(href, locale)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nixie Player",
    url: url("/"),
    inLanguage: locale,
    description: t("jsonLdDescription"),
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Music player",
    operatingSystem: "macOS, Windows, Linux",
    softwareVersion: release?.version,
    downloadUrl: release?.applesilicon.url ?? RELEASES_URL,
    releaseNotes: url("/changelog"),
    softwareHelp: url("/faq"),
    license: LICENSE_URL,
    isAccessibleForFree: true,
    screenshot: [home, lyrics, explore].map(
      (image) => `${SITE_URL}${image.src}`
    ),
    // No aggregateRating: there are no ratings to report, and inventing them is what gets
    // structured data ignored.
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      name: "Edoardo Ranghieri",
      url: "https://github.com/TheEdoRan",
    },
    codeRepository: REPO_URL,
  }

  return (
    <>
      <script
        type="application/ld+json"
        // Version and URLs come from the GitHub API, so escape "<" and a release tag can never
        // close this script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24">
        <h1 className="headline text-[clamp(2.5rem,7.5vw,4.75rem)] leading-[0.95]">
          {t.rich("hero.title", { accent })}
        </h1>

        <p className="mt-9 max-w-2xl text-lg leading-relaxed sm:text-xl">
          {t("hero.lead")}
        </p>

        <div className="mt-9">
          <Download release={release} />
        </div>

        {/* The short version of the disclaimer, where it is actually read. The full text is
            in the footer of every page. */}
        <p className="mt-9 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("hero.disclaimer")}
        </p>
      </section>

      {/* The app itself, before any argument about it. */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
        <Shot src={home} alt={t("hero.shotAlt")} priority />
      </section>

      {/* Why it exists. Each reason is a specific complaint and the specific thing built to
          answer it. The order and pairing come from the project's own README. */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl space-y-20 px-6 py-20 sm:space-y-28 sm:py-28">
          <div>
            <blockquote className="mb-6 border-l-2 border-primary pl-5">
              <p className="max-w-xl text-lg text-muted-foreground">
                {t("loudness.complaint")}
              </p>
            </blockquote>
            <h2 className="max-w-2xl headline text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
              {t("loudness.title")}
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed">
              {t("loudness.body")}
            </p>
            <div className="mt-10">
              <LufsScale />
            </div>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <blockquote className="mb-6 border-l-2 border-primary pl-5">
                <p className="text-lg text-muted-foreground">
                  {t("restore.complaint")}
                </p>
              </blockquote>
              <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
                {t("restore.title")}
              </h2>
              <p className="mt-5 leading-relaxed">{t("restore.body")}</p>
            </div>
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {m.restore.items.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 px-5 py-3 font-mono text-sm"
                >
                  <span className="text-primary" aria-hidden>
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <blockquote className="mb-6 border-l-2 border-primary pl-5">
                <p className="text-lg text-muted-foreground">
                  {t("lyrics.complaint")}
                </p>
              </blockquote>
              <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
                {t("lyrics.title")}
              </h2>
              <p className="mt-5 leading-relaxed">{t("lyrics.body")}</p>
            </div>
            <Shot src={lyrics} alt={t("lyrics.shotAlt")} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
            {t("features.title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {t("features.intro")}
          </p>

          <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {m.features.groups.map((group) => (
              <div key={group.heading}>
                <h3 className="mb-5 border-b border-border pb-3 label text-primary">
                  {group.heading}
                </h3>
                <ul className="space-y-4 text-sm leading-relaxed">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Shot src={explore} alt={t("features.shotAlt")} />
          </div>
        </div>
      </section>

      {/* Signing in. The single biggest surprise in the app, so it is explained here rather than
          discovered at first launch. */}
      <section id="signing-in" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {t("signIn.title")}
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed">
              <p>{t("signIn.p1")}</p>
              <p>{t.rich("signIn.p2", { extension: extensionLink })}</p>
              <p>{t("signIn.p3")}</p>
              <p>{t("signIn.p4")}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/privacy" className={`text-sm ${inlineLink}`}>
                {t("signIn.privacy")}
              </Link>
              <a href={SIGN_IN_DOC_URL} className={`text-sm ${inlineLink}`}>
                {t("signIn.browsers")}
              </a>
              <Link href="/faq" className={`text-sm ${inlineLink}`}>
                {t("signIn.faq")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The extension. It exists for one platform and one browser, so the page says exactly
          when it is needed rather than presenting it as a general step. */}
      <section id="extension" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
                {t("extension.title")}
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed">
                <p>{t("extension.p1")}</p>
                <p>{t("extension.p2")}</p>
                <p className="text-muted-foreground">{t("extension.p3")}</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <ButtonLink
                  href={EXTENSION_DOWNLOAD_URL}
                  variant="outline"
                  className="h-10 gap-1.5 px-4"
                >
                  <ArrowDown />
                  {t("extension.get")}
                </ButtonLink>
                <a
                  href={EXTENSION_INSTALL_URL}
                  className={`text-sm ${inlineLink}`}
                >
                  {t("extension.install")}
                </a>
                <a
                  href={EXTENSION_PRIVACY_URL}
                  className={`text-sm ${inlineLink}`}
                >
                  {t("extension.privacy")}
                </a>
              </div>
            </div>
            {/* Where the Nixie Link extension stands on each platform. The Windows column is
                decided by how the browser encrypts its cookie store, not by its name, which is
                why Chrome is called out. */}
            <dl className="divide-y divide-border rounded-xl border border-border bg-card">
              {m.extension.matrix.map((row) => (
                <div key={row.label} className="px-5 py-4">
                  <dt className="mb-1.5 label text-primary">{row.label}</dt>
                  <dd className="text-sm leading-relaxed">{row.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
            {t("download.title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {t("download.intro")}
          </p>

          {release ? (
            <>
              <ul className="mt-10 max-w-2xl divide-y divide-border rounded-xl border border-border">
                {builds.map((build) => (
                  <li
                    key={build.key}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{build.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {tBuilds(build.key)} ·{" "}
                        {formatSize(release[build.key].size)}
                      </p>
                    </div>
                    <ButtonLink
                      href={release[build.key].url}
                      variant="outline"
                      className="h-9 gap-1.5 px-3.5"
                    >
                      <ArrowDown />
                      {t("download.button")}
                    </ButtonLink>
                  </li>
                ))}
              </ul>

              <dl className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
                <div>
                  <dt className="mb-2 label text-muted-foreground">macOS</dt>
                  <dd className="text-sm leading-relaxed">
                    {t("download.macos")}
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 label text-muted-foreground">Windows</dt>
                  <dd className="text-sm leading-relaxed">
                    {t.rich("download.windows", { extension: extensionLink })}
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 label text-muted-foreground">Linux</dt>
                  <dd className="text-sm leading-relaxed">
                    {t("download.linux")}
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 label text-muted-foreground">
                    {t("download.updatesLabel")}
                  </dt>
                  <dd className="text-sm leading-relaxed">
                    {t.rich("download.updates", { install: installLink })}
                  </dd>
                </div>
              </dl>

              <p className="mt-10 text-sm">
                <a
                  href={release.url}
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("download.allAssets", { tag: release.tag })}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </p>
            </>
          ) : (
            <div className="mt-10">
              <ButtonLink href={RELEASES_URL} className="h-11 gap-2 px-5">
                <ArrowDown />
                {t("download.releases")}
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      {/* Sponsoring, in the project's own register: it buys nothing. */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {t("sponsor.title")}
            </h2>
            <p className="mt-6 leading-relaxed">{t("sponsor.p1")}</p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {t("sponsor.p2")}
            </p>
            <div className="mt-8">
              <ButtonLink
                href={SPONSOR_URL}
                variant="outline"
                className="h-10 gap-1.5 px-4"
              >
                {t("sponsor.button")}
                <ArrowUpRight />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
