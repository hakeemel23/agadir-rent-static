import { siteConfig } from "@/data/config"
import { DEFAULT_LANG } from "@/data/translations"
import { tr } from "@/lib/i18n"

export type LandingId = "airport" | "deposit" | "nearby"
export type Landing = { id: LandingId; slug: string; title: string; description: string }

const slugify = (v: string) =>
  v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

export function buildLandings(): Landing[] {
  const { city, areas } = siteConfig.seo
  const t = (k: string) => tr(DEFAULT_LANG, k)
  const nearby = areas.filter((a) => a.trim().toLowerCase() !== city.trim().toLowerCase())
  const prefix = slugify(t("seo.locationVoiture"))
  const citySlug = slugify(city)

  const all: Landing[] = []

  if (siteConfig.booking.hasAirport) {
    all.push({
      id: "airport",
      slug: `${prefix}-${slugify(t("seo.slugAirport"))}-${citySlug}`,
      title: t("landings.airport.metaTitle"),
      description: `${t("landings.airport.metaDescription")}${siteConfig.booking.unlimitedKm ? " " + t("landings.airport.metaKm") : ""}`,
    })
  }

  if (!siteConfig.booking.withCaution) {
    all.push({
      id: "deposit",
      slug: `${prefix}-${slugify(t("seo.slugDeposit"))}-${citySlug}`,
      title: t("landings.deposit.metaTitle"),
      description: t("landings.deposit.metaDescription"),
    })
  }

  if (nearby.length > 0) {
    all.push({
      id: "nearby",
      slug: `${prefix}-${slugify(nearby[0])}`,
      title: t("landings.nearby.metaTitle"),
      description: t("landings.nearby.metaDescription"),
    })
  }

  return all
}

export const landings = buildLandings()