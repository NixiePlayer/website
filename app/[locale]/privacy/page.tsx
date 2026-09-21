import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { RepoDoc } from "@/components/repo-doc"
import { pageMetadata } from "@/i18n/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy")
  return pageMetadata("/privacy", {
    title: t("title"),
    description: t("metaDescription"),
  })
}

export default async function Page() {
  const t = await getTranslations("Privacy")
  return <RepoDoc path="PRIVACY.md" title={t("title")} intro={t("intro")} />
}
