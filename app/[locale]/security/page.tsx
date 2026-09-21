import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { RepoDoc } from "@/components/repo-doc"
import { alternates } from "@/i18n/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Security")
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: await alternates("/security"),
  }
}

export default async function Page() {
  const t = await getTranslations("Security")
  return <RepoDoc path="SECURITY.md" title={t("title")} intro={t("intro")} />
}
