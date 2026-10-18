import type { MetadataRoute } from "next"
export const dynamic = "force-static";
import { IS_PRODUCTION_SITE, SITE_URL, siteConfig } from "@/data/config"
import { landings, type Landing } from "@/data/landings"

export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_PRODUCTION_SITE) return []

  const lastModified = new Date(siteConfig.website.contentUpdated)
  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    ...landings.map((l: Landing) => ({ url: `${SITE_URL}/${l.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
  ]
}