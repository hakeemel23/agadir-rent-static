import { existsSync, statSync } from "node:fs"
import { join } from "node:path"
import { IS_PRODUCTION_SITE, SITE_URL, seoDescription, siteConfig as c } from "@/data/config"
import { landings } from "@/data/landings"
import { translations as T } from "@/data/translations"

const PLACEHOLDER = /CHANGE-ME|YOUR\s*BRAND/i
const DEMO_URL_PATTERN = /agadir-rent-demo|example\.com|localhost/i
const DEMO_WHATSAPP = "212600000000"
const DEMO_PHONE = "+212600000000"
const HOURS_REGEX = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/

function isHttps(u: string): boolean {
  if (!/^https:\/\/\S+$/i.test(u)) return false
  try {
    const parsed = new URL(u)
    return parsed.protocol === "https:" && Boolean(parsed.hostname)
  } catch {
    return false
  }
}

function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

function isExistingFile(publicPath: string): boolean {
  if (!publicPath || !publicPath.startsWith("/") || publicPath.length < 2) return false
  const full = join(process.cwd(), "public", publicPath)
  try {
    return existsSync(full) && statSync(full).isFile()
  } catch {
    return false
  }
}

function scanPlaceholders(v: unknown, path: string, out: string[]) {
  if (typeof v === "string") {
    if (PLACEHOLDER.test(v)) out.push(`${path} (valeur de démonstration)`)
  } else if (Array.isArray(v)) {
    v.forEach((x, i) => scanPlaceholders(x, `${path}[${i}]`, out))
  } else if (v && typeof v === "object") {
    Object.entries(v).forEach(([k, x]) => scanPlaceholders(x, `${path}.${k}`, out))
  }
}

function compareShape(a: unknown, b: unknown, path: string, out: string[]) {
  if (path === "common.days") return
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) out.push(`translations ${path} (longueur différente)`)
    else a.forEach((x, i) => compareShape(x, b[i], `${path}[${i}]`, out))
    return
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ra = a as Record<string, unknown>
    const rb = b as Record<string, unknown>
    new Set([...Object.keys(ra), ...Object.keys(rb)]).forEach((k) => {
      const p = path ? `${path}.${k}` : k
      if (!(k in ra) || !(k in rb)) out.push(`translations ${p} (clé absente)`)
      else compareShape(ra[k], rb[k], p, out)
    })
    return
  }
}

function scanBrokenText(v: unknown, path: string, out: string[]) {
  if (typeof v === "string") {
    if (/undefined|NaN|\[object/.test(v)) out.push(`translations ${path} (texte cassé)`)
  } else if (Array.isArray(v)) {
    v.forEach((x, i) => scanBrokenText(x, `${path}[${i}]`, out))
  } else if (v && typeof v === "object") {
    Object.entries(v).forEach(([k, x]) => scanBrokenText(x, path ? `${path}.${k}` : k, out))
  }
}

const norm = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim()

function airportClaimPatterns(city: string, cityAr: string): string[] {
  const c = norm(city)
  return [
    `aeroport ${c}`, `${c} aeroport`, `aeroport de ${c}`, `aeroport d'${c}`, `aeroport d’${c}`,
    `airport ${c}`, `${c} airport`, `airport of ${c}`,
    `مطار ${norm(cityAr)}`,
  ]
}

function hasAirportClaim(text: string, patterns: string[]): boolean {
  const n = norm(text)
  return patterns.some((p) => n.includes(p))
}

function collectAirportClaims(v: unknown, path: string, patterns: string[], out: string[]) {
  if (path.endsWith(".landings.airport")) return
  if (typeof v === "string") {
    if (hasAirportClaim(v, patterns)) out.push(`${path} : affirme que la ville a un aéroport alors que CITY_HAS_AIRPORT = false`)
  } else if (Array.isArray(v)) {
    v.forEach((x, i) => collectAirportClaims(x, `${path}[${i}]`, patterns, out))
  } else if (v && typeof v === "object") {
    Object.entries(v).forEach(([k, x]) => collectAirportClaims(x, `${path}.${k}`, patterns, out))
  }
}

export function assertProductionReady() {
  if (!IS_PRODUCTION_SITE) return

  const errors: string[] = []

  if (!c.verified.businessInfo) errors.push("verified.businessInfo = false")
  if (!c.verified.legalClaims) errors.push("verified.legalClaims = false")
  if (!c.verified.fleet) errors.push("verified.fleet = false (Flotte et images non vérifiées)")
  if (!c.verified.seo) errors.push("verified.seo = false (ville, aéroport, point de rencontre, zones)")

  if (!isValidISODate(c.website.contentUpdated)) {
    errors.push("website.contentUpdated invalide (doit être une vraie date YYYY-MM-DD)")
  }

  if (!c.brand.name.trim()) errors.push("brand.name est vide")
  if (!c.contact.address.trim()) errors.push("contact.address est vide")

  if (!Number.isFinite(c.contact.geo.lat) || c.contact.geo.lat < -90 || c.contact.geo.lat > 90 ||
      !Number.isFinite(c.contact.geo.lng) || c.contact.geo.lng < -180 || c.contact.geo.lng > 180 ||
      (c.contact.geo.lat === 0 && c.contact.geo.lng === 0)) {
    errors.push("contact.geo (Coordonnées GPS hors limites ou non configurées)")
  }

  if (!isHttps(c.contact.googleMapsLink)) errors.push("contact.googleMapsLink doit être une URL https:// valide")
  if (c.reviews.googleMapsLink && !isHttps(c.reviews.googleMapsLink)) errors.push("reviews.googleMapsLink invalide")
  c.contact.sameAs.forEach((u) => { if (!isHttps(u)) errors.push(`sameAs invalide : ${u}`) })

  const adv = c.booking.advancePaymentDh
  if (adv !== null && (!Number.isFinite(adv) || adv <= 0)) errors.push("booking.advancePaymentDh doit être un nombre fini > 0")

  c.reviews.items.forEach((r, idx) => {
    if (!r.name.trim() || !r.text.trim()) errors.push(`avis #${idx + 1} : nom ou texte vide`)
    if (!Number.isInteger(r.rating) || r.rating < 1 || r.rating > 5) errors.push(`rating invalide pour l'avis de ${r.name || idx + 1}`)
  })

  scanPlaceholders(c, "siteConfig", errors)
  if (PLACEHOLDER.test(`${c.brand.name} ${c.brand.nameLight}`)) errors.push("brand.name contient des valeurs démo")
  if (!isHttps(SITE_URL) || !/^https:\/\/[^/]+\.[a-z]{2,}$/i.test(SITE_URL)) errors.push("website.url invalide")
  if (DEMO_URL_PATTERN.test(SITE_URL)) errors.push("website.url contient encore l'URL de démonstration")
  if (SITE_URL.includes(".pages.dev")) {
    errors.push("website.url contient '.pages.dev' - Vous devez configurer le vrai domaine du client pour la production")
  }

  if (c.tracking.gaId && !/^G-[A-Z0-9]+$/i.test(c.tracking.gaId.trim())) {
    errors.push("tracking.gaId invalide (format attendu : G-XXXXXXXXXX)")
  }
  if (c.tracking.metaPixelId && !/^\d{10,20}$/.test(c.tracking.metaPixelId.trim())) {
    errors.push("tracking.metaPixelId invalide (doit contenir uniquement des chiffres)")
  }

  if (c.contact.whatsapp === DEMO_WHATSAPP || !/^212[5-7]\d{8}$/.test(c.contact.whatsapp)) errors.push("contact.whatsapp invalide")
  if (c.contact.phone === DEMO_PHONE || !/^\+212[5-7]\d{8}$/.test(c.contact.phone)) errors.push("contact.phone invalide")
  if (c.contact.phone.replace(/\D/g, "") !== c.contact.phoneDisplay.replace(/\D/g, "")) errors.push("contact.phone et phoneDisplay ne correspondent pas")

  if (!HOURS_REGEX.test(c.business.openingHours)) errors.push("business.openingHours format invalide (HH:MM-HH:MM)")
  try { new Intl.DateTimeFormat("en-US", { timeZone: c.business.timezone }) } catch { errors.push("business.timezone invalide") }
  if (c.business.payments.length === 0) errors.push("business.payments doit contenir au moins un moyen de paiement")

  if (!Number.isFinite(c.currency.rate) || c.currency.rate <= 0) errors.push("currency.rate doit être un nombre fini > 0")

  if (c.fleet.cars.length === 0) errors.push("fleet.cars est vide")
  const ids = c.fleet.cars.map((x) => x.id.trim())
  if (ids.some((x) => !x) || new Set(ids).size !== ids.length) errors.push("fleet.cars contient des IDs vides ou en double")

  c.fleet.cars.forEach((car) => {
    if (!car.name.trim()) errors.push(`Nom vide pour le véhicule ${car.id}`)
    if (!Number.isFinite(car.price) || car.price <= 0) errors.push(`Prix invalide pour le véhicule ${car.id}`)
    if (!Number.isInteger(car.seats) || car.seats <= 0) errors.push(`Nombre de places invalide pour ${car.id}`)
  })

  const s = c.seo
  const slugifyArea = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  if (s.areas.some((a) => !slugifyArea(a))) {
    errors.push("seo.areas doit contenir des noms avec des caractères latins valides pour les URLs (ex: Mohammedia)")
  }
  if (!s.city.trim() || !s.cityAr.trim() || !s.region.trim()) {
    errors.push("seo.city, cityAr et region sont obligatoires")
  }
  if (s.areas.length === 0 || s.areas.some((a) => !a.trim()) || s.areasAr.some((a) => !a.trim())) {
    errors.push("seo.areas et areasAr ne peuvent pas être vides")
  }
  if (s.areas.length !== s.areasAr.length) {
    errors.push("seo.areas et areasAr n'ont pas la même taille")
  }

  if (c.booking.cityHasAirport && !c.booking.airportService) {
    errors.push("CITY_HAS_AIRPORT = true exige AIRPORT_SERVICE = true")
  }
  if (c.booking.cityHasAirport &&
      (!s.airport.trim() || !s.airportCode.trim() || !s.meetingPoint.trim() || !s.airportAr.trim() || !s.meetingPointAr.trim())) {
    errors.push("seo.airport, airportCode et meetingPoint (FR/AR) sont obligatoires quand CITY_HAS_AIRPORT = true")
  }
  if (!c.booking.cityHasAirport) {
    const claims = airportClaimPatterns(s.city, s.cityAr)
    const publicTexts: [string, string][] = [["seoDescription", seoDescription], ["seo.keywords", s.keywords.join(" ")]]
    landings.forEach((l) => publicTexts.push([`landing ${l.id}`, `${l.slug.replace(/-/g, " ")} ${l.title} ${l.description}`]))
    publicTexts.forEach(([where, text]) => { if (hasAirportClaim(text, claims)) errors.push(`${where} : affirme que la ville a un aéroport alors que CITY_HAS_AIRPORT = false`) })
    collectAirportClaims(T, "translations", claims, errors)

    if (c.booking.airportService) {
      const list = s.deliveryAirports
      if (list.length === 0) {
        errors.push("seo.deliveryAirports est obligatoire quand CITY_HAS_AIRPORT = false et AIRPORT_SERVICE = true (ex: CMN, RAK, AGA)")
      }
      list.forEach((a, i) => {
        if (!a.name.trim() || !a.nameAr.trim() || !a.code.trim()) {
          errors.push(`seo.deliveryAirports[${i}] : name, nameAr et code sont obligatoires`)
        }
        if (a.name.trim() && norm(a.name).includes(norm(s.city))) {
          errors.push(`seo.deliveryAirports[${i}] (${a.name}) : contient le nom de la ville alors que CITY_HAS_AIRPORT = false`)
        }
        if (a.nameAr.trim() && norm(a.nameAr).includes(norm(s.cityAr))) {
          errors.push(`seo.deliveryAirports[${i}] (${a.nameAr}) : contient le nom de la ville alors que CITY_HAS_AIRPORT = false`)
        }
      })
      const codes = list.map((a) => a.code.trim().toUpperCase())
      if (new Set(codes).size !== codes.length) errors.push("seo.deliveryAirports : codes d'aéroport en double")
      if (codes.some((x) => !/^[A-Z]{3}$/.test(x))) errors.push("seo.deliveryAirports : code IATA invalide (3 lettres, ex: CMN)")
    }
  }

  if (T.fr && T.en && T.ar) {
    compareShape(T.fr, T.en, "", errors)
    compareShape(T.fr, T.ar, "", errors)
    scanBrokenText(T, "", errors)
  }

  const slugs = landings.map((l) => l.slug)
  if (slugs.length === 0 || slugs.some((x) => !x) || new Set(slugs).size !== slugs.length) {
    errors.push("landings : aucune page générée, ou slug vide / en double")
  }

  if (process.env.NEXT_PHASE === "phase-production-build") {
    const files = [
      c.hero.image,
      c.brand.logo,
      ...(c.booking.airportService ? [c.contact.meetingPointPhoto] : []),
      "/og-hero.jpg",
      ...c.fleet.cars.map((x) => x.image)
    ]
    Array.from(new Set(files)).forEach((f) => {
      if (!isExistingFile(f)) errors.push(`fichier manquant ou invalide : public${f}`)
    })
  }

  if (errors.length) {
    throw new Error(`\n🚨 [Build Guard] Build de production refusé. Erreurs:\n- ${errors.join("\n- ")}\n`)
  }
}