import type { MetadataRoute } from "next"
export const dynamic = "force-static";
import { IS_PRODUCTION_SITE, SITE_URL } from "@/data/config"

export default function robots(): MetadataRoute.Robots {
  // Hors production (preview, build:demo) : on interdit l'indexation.
  if (!IS_PRODUCTION_SITE) return { rules: { userAgent: "*", disallow: "/" } }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` }
}
