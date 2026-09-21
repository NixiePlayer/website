import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { alternates } from "@/i18n/metadata"
import { Link } from "@/i18n/navigation"
import {
  EXTENSION_INSTALL_URL,
  INSTALL_DOC_URL,
  LICENSE_URL,
  REPO_URL,
  SIGN_IN_DOC_URL,
  SPONSOR_URL,
} from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Faq")
  return {
    title: "FAQ",
    description: t("metaDescription"),
    alternates: await alternates("/faq"),
  }
}

// Plain headings and paragraphs, all of it visible. An accordion would hide answers from readers
// and from search engines to save scrolling nobody minds.
const groups = [
  {
    key: "before",
    questions: [
      "premium",
      "official",
      "cost",
      "platforms",
      "warnings",
      "language",
      "finished",
    ],
  },
  {
    key: "signIn",
    questions: ["password", "browsers", "extension", "cookies", "risk"],
  },
  {
    key: "using",
    questions: [
      "normalization",
      "noLyrics",
      "podcasts",
      "updates",
      "tracking",
      "bugs",
      "source",
    ],
  },
] as const

const link = "text-primary underline decoration-1 underline-offset-4"

// Every tag an answer may use. Each answer picks the ones it needs; the rest go unused.
const external = (href: string) => (chunks: React.ReactNode) => (
  <a href={href} className={link}>
    {chunks}
  </a>
)
const internal =
  (href: "/#extension" | "/privacy") => (chunks: React.ReactNode) => (
    <Link href={href} className={link}>
      {chunks}
    </Link>
  )
const tags = {
  p: (chunks: React.ReactNode) => <p>{chunks}</p>,
  license: external(LICENSE_URL),
  sponsor: external(SPONSOR_URL),
  install: external(INSTALL_DOC_URL),
  issues: external(`${REPO_URL}/issues`),
  signin: external(SIGN_IN_DOC_URL),
  extInstall: external(EXTENSION_INSTALL_URL),
  repo: external(REPO_URL),
  extension: internal("/#extension"),
  privacy: internal("/privacy"),
}

export default async function Page() {
  const t = await getTranslations("Faq")

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="headline text-[clamp(2rem,5vw,3rem)] leading-tight">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">{t("intro")}</p>

      <div className="mt-14 space-y-14">
        {groups.map((group) => (
          <section key={group.key}>
            <h2 className="mb-8 border-b border-border pb-3 label text-primary">
              {t(`groups.${group.key}`)}
            </h2>
            <div className="space-y-9">
              {group.questions.map((id) => (
                <div key={id}>
                  <h3 className="headline text-lg leading-snug">
                    {t(`questions.${id}.q`)}
                  </h3>
                  <div className="mt-3 space-y-3 leading-relaxed [&_p]:text-[0.9375rem]">
                    {t.rich(`questions.${id}.a`, tags)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
