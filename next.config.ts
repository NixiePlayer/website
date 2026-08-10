import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Every route here is prerendered, and the only request-time work is the GitHub data, which
  // sits behind "use cache". See lib/github.ts for the lifetimes.
  cacheComponents: true,

  // Catches a typo in an internal href at build time instead of at 404 time.
  typedRoutes: true,

  cacheLife: {
    // What `export const revalidate = 3600` used to mean. The built-in "hours" profile is the
    // same hourly refresh but expires after a day, and this site can go a day without a visitor:
    // the next one would then wait on GitHub instead of being served the last good render. An
    // entry that never expires keeps every page instant and leaves the refresh in the background.
    github: { stale: 300, revalidate: 3600, expire: 31_536_000 },
  },

  images: {
    // Every optimized image on the site is a static import, so its URL carries a content hash
    // and changes whenever the file does. That makes the result immutable and safe to cache for
    // a year, instead of re-running the optimizer every four hours: on Vercel's free tier each
    // re-optimization is a billed transformation.
    minimumCacheTTL: 31_536_000,
  },
}

export default nextConfig
