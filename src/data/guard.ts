import { existsSync, statSync } from "node:fs"
import { join } from "node:path"
import { IS_PRODUCTION_SITE, SITE_URL, siteConfig as c } from "@/data/config"
import { landings } from "@/data/landings"
import { translations as T } from "@/data/translations"

const PLACEHOLDER = /CHANGE-ME|YOUR\s*BRAND/i
const DEMO_WHATSAPP = "212600000000"
const DEMO_PHONE = "+212600000000"
const HOURS_REGEX = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/
const isHttps = (u: string) => /^https:\/\/\S+$/i.test(u)

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
      if (!(k in ra) || (!(k in rb))) out.push(`translations ${p} (clé absente)`)
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

  if (!isHttps(c.contact.googleMapsLink)) errors.push("contact.googleMapsLink doit commencer par https://")
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
  if (!/^https:\/\/[^/]+\.[a-z]{2,}$/i.test(SITE_URL)) errors.push("website.url invalide")

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
  if (c.booking.hasAirport && (!s.airport.trim() || !s.airportCode.trim() || !s.meetingPoint.trim() || !s.airportAr.trim() || !s.meetingPointAr.trim())) {
    errors.push("seo.airport, airportCode et meetingPoint (FR/AR) sont obligatoires quand hasAirport = true")
  }

  if (T.fr && T.en && T.ar) {
    compareShape(T.fr, T.en, "", errors)
    compareShape(T.fr, T.ar, "", errors)
    scanBrokenText(T, "", errors)
  }

  const slugs = landings.map((l) => l.slug)
  if (slugs.some((x) => !x) || new Set(slugs).size !== slugs.length) errors.push("landings : slug vide ou en double")

  if (process.env.NEXT_PHASE === "phase-production-build") {
    const files = [
      c.hero.image, 
      c.brand.logo, 
      ...(c.booking.hasAirport ? [c.contact.meetingPointPhoto] : []), 
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