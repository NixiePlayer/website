import type { Metadata } from "next"

import { RepoDoc } from "@/components/repo-doc"

// Next requires this to be a literal, so it cannot read REVALIDATE from lib/site. Keep the two
// in step: one hour.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Nixie is built to hold a browser session safely, and how to report a vulnerability.",
}

export default function Page() {
  return (
    <RepoDoc
      path="SECURITY.md"
      title="Security"
      intro="Nixie holds a live YouTube session, so how it is built matters. This is the document that ships with the app, including how to report a vulnerability."
    />
  )
}
