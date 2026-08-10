import type { Metadata } from "next"

import { RepoDoc } from "@/components/repo-doc"

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
