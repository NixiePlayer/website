import { unstable_cache } from "next/cache"

import { REPO, REVALIDATE, type LatestRelease, type Release } from "@/lib/site"

type ApiAsset = { name: string; size: number; browser_download_url: string }
type ApiRelease = {
  tag_name: string
  html_url: string
  published_at: string
  body: string | null
  assets: ApiAsset[]
}

/**
 * A single GET against the GitHub API.
 *
 * Returns null on any failure instead of throwing, because every caller has a fallback and a
 * rate-limited or renamed endpoint should degrade the page, not break the build. The token is
 * optional: it is only needed while the repo is private, and the site's handful of hourly
 * requests sit well inside the anonymous limit once it is public.
 */
async function gh<T>(path: string, accept: string): Promise<T | null> {
  const token = process.env.GITHUB_TOKEN

  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: accept,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: REVALIDATE },
    })

    if (!res.ok) return null

    return accept === "application/json"
      ? ((await res.json()) as T)
      : ((await res.text()) as T)
  } catch {
    return null
  }
}

/**
 * Release notes are markdown, and the only way to render them the way GitHub does is GitHub's
 * own endpoint. That endpoint is a POST, which Next's fetch cache does not cover, so the result
 * is cached here instead — otherwise every request to /changelog would spend an API call.
 */
const renderMarkdown = unstable_cache(
  async (text: string): Promise<string | null> => {
    if (!text.trim()) return null

    try {
      const res = await fetch("https://api.github.com/markdown", {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ text, mode: "gfm", context: REPO }),
        cache: "no-store",
      })

      return res.ok ? await res.text() : null
    } catch {
      return null
    }
  },
  ["github-markdown"],
  { revalidate: REVALIDATE }
)

async function toRelease(r: ApiRelease): Promise<Release> {
  return {
    version: r.tag_name.replace(/^v/, ""),
    tag: r.tag_name,
    url: r.html_url,
    publishedAt: r.published_at,
    bodyHtml: await renderMarkdown(r.body ?? ""),
  }
}

/**
 * The newest release, with the two disk images a person actually wants. The zips and blockmaps
 * in every release belong to electron-updater, not to anyone reading this site.
 *
 * Returns null when the release exists but is missing either disk image, because a download
 * block that can only offer one architecture is worse than one that sends you to GitHub.
 */
export async function getLatestRelease(): Promise<LatestRelease | null> {
  const release = await gh<ApiRelease>(
    `/repos/${REPO}/releases/latest`,
    "application/json"
  )
  if (!release) return null

  const find = (suffix: string) => {
    const asset = release.assets.find((a) => a.name.endsWith(suffix))
    return asset ? { url: asset.browser_download_url, size: asset.size } : null
  }

  const applesilicon = find("-applesilicon.dmg")
  const intel = find("-intel.dmg")
  if (!applesilicon || !intel) return null

  return { ...(await toRelease(release)), applesilicon, intel }
}

/** Every release, newest first, for the changelog. */
export async function getReleases(): Promise<Release[]> {
  const releases = await gh<ApiRelease[]>(
    `/repos/${REPO}/releases?per_page=100`,
    "application/json"
  )
  if (!releases) return []

  return Promise.all(releases.map(toRelease))
}

/**
 * Every document opens with an h1 naming itself — "Privacy", "Security" — and the page that
 * renders it has already said the same word in its own h1. Dropping GitHub's leaves one h1 per
 * page. Hiding it in CSS would not do: it would still be in the document for a crawler to read.
 *
 * If GitHub ever changes this markup the pattern stops matching and the heading simply appears
 * twice, which is visible on the page rather than silently wrong underneath it.
 */
function stripLeadingHeading(html: string): string {
  return html.replace(
    /<div class="markdown-heading"[^>]*>\s*<h1\b[\s\S]*?<\/div>/,
    ""
  )
}

/**
 * A markdown file from the repo, rendered to HTML by GitHub. This media type turns the contents
 * endpoint into a plain cacheable GET that already handles GitHub's alerts and tables, which is
 * why the site carries no markdown parser.
 */
export async function getRenderedDoc(path: string): Promise<string | null> {
  const html = await gh<string>(
    `/repos/${REPO}/contents/${path}`,
    "application/vnd.github.html"
  )

  return html === null ? null : stripLeadingHeading(html)
}
