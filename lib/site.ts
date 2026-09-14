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

export const blobUrl = (path: string) => `${REPO_URL}/blob/main/${path}`

// The app's own README carries the per-platform install notes and the browser table, so the
// site links there instead of restating them and drifting.
export const INSTALL_DOC_URL = `${REPO_URL}#install`
export const SIGN_IN_DOC_URL = `${REPO_URL}#how-signing-in-works`

// The Nixie Link browser extension. Not on any store: the zip from the latest release is the
// only channel, loaded unpacked, which is why the install steps get their own link.
export const EXTENSION_REPO_URL =
  "https://github.com/NixiePlayer/nixie-link-extension"
export const EXTENSION_DOWNLOAD_URL = `${EXTENSION_REPO_URL}/releases/latest`
export const EXTENSION_INSTALL_URL = `${EXTENSION_REPO_URL}#install`
export const EXTENSION_PRIVACY_URL = `${EXTENSION_REPO_URL}/blob/main/PRIVACY.md`
export const EXTENSION_DOC_URL = blobUrl("docs/extension.md")

export type Asset = { url: string; size: number }

export type Release = {
  version: string
  tag: string
  url: string
  publishedAt: string
  /** GitHub-rendered HTML of the release notes, or null when rendering failed. */
  bodyHtml: string | null
}

/**
 * The one build per platform a person downloads by hand. The zips and blockmaps in every
 * release belong to electron-updater. The suffix is what electron-builder names the file, so
 * a renamed artifact shows up here as a missing asset rather than a wrong link.
 */
export const builds = [
  {
    key: "applesilicon",
    os: "mac",
    name: "macOS",
    detail: "Apple silicon, M1 and later",
    suffix: "-applesilicon.dmg",
  },
  {
    key: "intel",
    os: "mac",
    name: "macOS",
    detail: "Intel",
    suffix: "-intel.dmg",
  },
  {
    key: "windows",
    os: "windows",
    name: "Windows",
    detail: "10 and 11, 64-bit",
    suffix: "-setup.exe",
  },
  {
    key: "linux",
    os: "linux",
    name: "Linux",
    detail: "64-bit AppImage",
    suffix: "-x64.AppImage",
  },
] as const

export type BuildKey = (typeof builds)[number]["key"]

export type LatestRelease = Release & Record<BuildKey, Asset>

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
