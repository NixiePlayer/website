import type { Metadata } from "next"

import { RepoDoc } from "@/components/repo-doc"

// Next requires this to be a literal, so it cannot read REVALIDATE from lib/site. Keep the two
// in step: one hour.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Exactly what Nixie stores on your machine and what leaves it. No account, no backend, no telemetry, no analytics, no crash uploader.",
}

export default function Page() {
  return (
    <RepoDoc
      path="PRIVACY.md"
      title="Privacy"
      intro="Nixie has no account, no backend and no telemetry. This is the document that ships with the app, listing exactly what is stored on your machine and what leaves it."
    />
  )
}
