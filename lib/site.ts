/**
 * Constants and formatting shared by server and client code. Everything here is pure, so a
 * client component can import it without dragging the server-only GitHub module along.
 */

export const SITE_URL = "https://nixieplayer.com"

export const REPO = "NixiePlayer/NixieDesktop"
export const REPO_URL = `https://github.com/${REPO}`
export const RELEASES_URL = `${REPO_URL}/releases`
export const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`
export const SPONSOR_URL = "https://github.com/sponsors/TheEdoRan"

// ponytail: no tracking issue exists for Windows and Linux yet, so "planned" points at the
// issue list. Swap this one constant when a real issue is open.
export const PLATFORMS_URL = `${REPO_URL}/issues`

export const blobUrl = (path: string) => `${REPO_URL}/blob/main/${path}`

export type Asset = { url: string; size: number }

export type Release = {
  version: string
  tag: string
  url: string
  publishedAt: string
  /** GitHub-rendered HTML of the release notes, or null when rendering failed. */
  bodyHtml: string | null
}

export type LatestRelease = Release & {
  applesilicon: Asset
  intel: Asset
}

export function formatSize(bytes: number): string {
  return `${Math.round(bytes / 1_000_000)} MB`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}
