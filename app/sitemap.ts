import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

const routes = ["", "/faq", "/changelog", "/privacy", "/security"]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "/changelog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }))
}
