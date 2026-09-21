import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { RepoDoc } from "@/components/repo-doc"
import { alternates } from "@/i18n/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy")
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: await alternates("/privacy"),
  }
}

export default async function Page() {
  const t = await getTranslations("Privacy")
  return <RepoDoc path="PRIVACY.md" title={t("title")} intro={t("intro")} />
}
