import { siteConfig } from "@/data/config"
import { DEFAULT_LANG } from "@/data/translations"
import { tr } from "@/lib/i18n"

export type LandingId = "airport" | "airportDelivery" | "deposit" | "nearby"
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

  const { cityHasAirport, airportService, unlimitedKm } = siteConfig.booking

  if (cityHasAirport) {
    all.push({
      id: "airport",
      slug: `${prefix}-${slugify(t("seo.slugAirport"))}-${citySlug}`,
      title: t("landings.airport.metaTitle"),
      description: `${t("landings.airport.metaDescription")}${unlimitedKm ? " " + t("landings.airport.metaKm") : ""}`,
    })
  } else if (airportService) {
    all.push({
      id: "airportDelivery",
      slug: `${prefix}-${citySlug}-${slugify(t("seo.slugAirportDelivery"))}`,
      title: t("landings.airportDelivery.metaTitle"),
      description: `${t("landings.airportDelivery.metaDescription")}${unlimitedKm ? " " + t("landings.airportDelivery.metaKm") : ""}`,
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

  // Toujours générer "nearby" s'il y a des zones voisines OU si aucune autre landing n'est active
  // (évite un tableau vide dans generateStaticParams avec output: "export").
  if (nearby.length > 0 || all.length === 0) {
    const targetSlug = slugify(nearby[0] || city)
    all.push({
      id: "nearby",
      slug: `${prefix}-${targetSlug}`,
      title: t("landings.nearby.metaTitle"),
      description: t("landings.nearby.metaDescription"),
    })
  }

  return all
}

export const landings = buildLandings()