import { airportLocationId, siteConfig } from "./config"
import { BASE_CURRENCY, FOREIGN_CURRENCY, FOREIGN_SYMBOL } from "@/lib/currency"

// CITY_HAS_AIRPORT : la ville a SON aéroport -> on peut l'affirmer (badge, titres, SEO).
// AIRPORT_SERVICE  : on livre / on a un point de rencontre dans un aéroport (le sien ou un voisin)
//                    -> les SERVICES "livraison aéroport" s'affichent toujours.
// HAS_DEL          : pas d'aéroport dans la ville, mais des aéroports de livraison précis
//                    (seo.deliveryAirports) -> ils sont nommés partout (lieux, rendez-vous, landing, FAQ, SEO).
const CITY_HAS_AIRPORT = siteConfig.booking.cityHasAirport
const AIRPORT_SERVICE = siteConfig.booking.airportService

const { city, airport, airportCode, meetingPoint, areas, cityAr, airportAr, meetingPointAr, areasAr, deliveryAirports: DEL } = siteConfig.seo

const sameStr = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

const CITY = city
// Détails d'aéroport : renseignés UNIQUEMENT si la ville a son propre aéroport (sinon vides).
const AIRPORT = airport
const AIRPORT_CODE = airportCode
const MEETING_POINT = meetingPoint
const NEARBY = areas.filter((a) => !sameStr(a, city))
const NEARBY_LIST = NEARBY.length ? NEARBY : [city]
const NEARBY_FIRST = NEARBY_LIST[0]
const NEARBY_SLASH = NEARBY_LIST.join(" / ")
const NEARBY_COMMA = NEARBY_LIST.join(", ")
const NEARBY_FR = NEARBY_LIST.join(" et ")
const NEARBY_EN = NEARBY_LIST.join(" and ")
const elide = (w: string) => (/^[aeiouhàâäéèêëîïôöùûü]/i.test(w) ? "d'" : "de ");
const DE = elide(city)
const DE_AIRPORT = elide(AIRPORT)

// --- Aéroports de livraison (ville sans aéroport) ---
const HAS_DEL = !CITY_HAS_AIRPORT && AIRPORT_SERVICE && DEL.length > 0
const joinList = (items: string[], and: string, sep = ", ") =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(sep)}${and}${items[items.length - 1]}`
const DEL_FR = joinList(DEL.map((a) => a.name), " et ")
const DEL_EN = joinList(DEL.map((a) => a.name), " and ")
const DEL_AR = joinList(DEL.map((a) => a.nameAr), " و", "، ")
const DEL_CODES = DEL.map((a) => a.code).join(" / ")
const CODES_SFX = HAS_DEL ? ` ${DEL_CODES}` : ""

// Libellés des lieux de livraison (un par aéroport de livraison)
const DEL_LOC_FR: Record<string, string> = Object.fromEntries(DEL.map((a) => [airportLocationId(a), `Aéroport ${a.name} (${a.code})`]))
const DEL_LOC_EN: Record<string, string> = Object.fromEntries(DEL.map((a) => [airportLocationId(a), `${a.name} Airport (${a.code})`]))
const DEL_LOC_AR: Record<string, string> = Object.fromEntries(DEL.map((a) => [airportLocationId(a), `مطار ${a.nameAr} (${a.code})`]))

// Formulations réutilisées dans les textes de service
const TO_AP_FR = CITY_HAS_AIRPORT ? `à l'aéroport ${elide(city)}${city}` : HAS_DEL ? `aux aéroports de ${DEL_FR}` : "à l'aéroport"
const AP_EN = CITY_HAS_AIRPORT ? `${city} airport` : HAS_DEL ? `${DEL_EN} airports` : "the airport"
const AP_AR = CITY_HAS_AIRPORT ? `مطار ${cityAr}` : HAS_DEL ? `مطارات ${DEL_AR}` : "المطار"

const CITY_AR = cityAr
const AIRPORT_AR = airportAr
const AIRPORT_FULL_AR = CITY_HAS_AIRPORT ? `${cityAr} ${airportAr}` : ""
const MEETING_POINT_AR = meetingPointAr
const filteredAr = areasAr.filter((a) => !sameStr(a, cityAr))
const NEARBY_LIST_AR = filteredAr.length ? filteredAr : [cityAr]
const NEARBY_FIRST_AR = NEARBY_LIST_AR[0]
const NEARBY_SLASH_AR = NEARBY_LIST_AR.join(" / ")
const NEARBY_COMMA_AR = NEARBY_LIST_AR.join("، ")

const lamPrep = (n: string) => "ل" + (n.startsWith("ال") ? n.slice(1) : n);
const NEARBY_AND_AR_LAM = NEARBY_LIST_AR.map(lamPrep).join(" و");

export type Lang = "fr" | "en" | "ar"
export const LANGS: Lang[] = ["fr", "en", "ar"]
export const DEFAULT_LANG: Lang = "fr"

const fr = {
  seo: { locationVoiture: "Location voiture", slugAirport: "aeroport", slugAirportDelivery: "livraison-aeroport", slugDeposit: "sans-caution" },
  lang: { label: "Langue", fr: "Français", en: "English", ar: "العربية" },
  common: {
    whatsapp: "WhatsApp",
    call: "Appeler",
    perDay: "/ jour",
    close: "Fermer",
    menu: "Menu",
    showEur: `Voir les prix en ${FOREIGN_SYMBOL}`,
    showMad: `Voir les prix en ${BASE_CURRENCY}`,
    days: { one: "{n} jour", other: "{n} jours" } as Record<string, string>,
  },
  nav: { fleet: "Nos voitures", conditions: "Conditions", how: "Comment ça marche", reviews: "Avis", faq: "FAQ" },
  hero: {
    airportBadge: CITY_HAS_AIRPORT ? `Aéroport ${AIRPORT_CODE}` : `Livraison aéroport${CODES_SFX}`,
    priceBadge: "Dès {price} / jour",
    title: "Location voiture",
    titleAccent: CITY_HAS_AIRPORT ? `${CITY} Aéroport.` : `${CITY}.`,
    description: AIRPORT_SERVICE
      ? `Réservation simple sur WhatsApp, prix annoncés à l'avance et livraison ${TO_AP_FR}.`
      : `Prix annoncés à l'avance, livraison à ${CITY} et réservation simple sur WhatsApp.`,
    imageAlt: CITY_HAS_AIRPORT ? `Location voiture aéroport ${AIRPORT}` : `Location voiture ${CITY}`,
    features: { noDeposit: "Sans caution", unlimitedKm: "Km illimité", freeAirport: "Livraison aéroport gratuite" },
    location: "Lieu",
    pickup: "Départ",
    return: "Retour",
    pickupPlaceholder: "Date départ",
    returnPlaceholder: "Date retour",
    pickFirst: "Choisissez d'abord le départ",
    carOptional: "Voiture (optionnel)",
    chooseCar: "Choisir une voiture",
    cta: "Voir les voitures disponibles",
    waCta: "Vérifier sur WhatsApp",
    direct: "Ou demander directement sur WhatsApp",
    reply: "Disponibilité confirmée sur WhatsApp",
  },
  calendar: { prev: "Mois précédent", next: "Mois suivant", weekdays: "L,M,M,J,V,S,D" },
  locations: {
    airport: CITY_HAS_AIRPORT ? `Aéroport ${CITY} (${AIRPORT_CODE})` : `Livraison aéroport`,
    city: `${CITY} Ville`,
    nearby: `${NEARBY_SLASH}`,
    ...DEL_LOC_FR,
  } as Record<string, string>,
  trust: {
    contractTitle: "Contrat + photos WhatsApp",
    contractText: "État des lieux avant/après",
    priceTitle: "Prix annoncés à l'avance",
    priceText: "Prix final confirmé avant la réservation",
    meetingTitle: AIRPORT_SERVICE ? "Point de rencontre Aéroport" : "Lieu de livraison exact",
    meetingLink: "Voir sur Google Maps",
    whatsappTitle: "Réservation par WhatsApp",
    whatsappText: "Envoyez votre demande, nous répondons dès que possible",
  },
  fleet: {
    title: "Notre flotte",
    subtitle: AIRPORT_SERVICE ? "Des voitures entretenues, prêtes à récupérer à l'aéroport." : "Des voitures entretenues, prêtes à récupérer.",
    categories: { all: "Tous", eco: "Économique", auto: "Automatique", suv: "SUV & 4x4", family: "Familial" },
    popular: "POPULAIRE",
    seats: "{n} pl",
    auto: "Auto",
    manual: "Manuelle",
    diesel: "Diesel",
    petrol: "Essence",
    advance: "Acompte : {amount}",
    freeCancel: "Annulation gratuite",
    book: "Réserver",
    note: `Conversion en ${FOREIGN_SYMBOL} indicative. Prix final confirmé sur WhatsApp.`,
  },
  conditions: {
    title: "Ce qui est inclus. Ce qui ne l'est pas.",
    included: {
      title: "✅ Inclus",
      items: [
        siteConfig.booking.insuranceIncluded ? "Assurance incluse (au contrat)" : "Assurance de base (franchise applicable)",
        siteConfig.booking.unlimitedKm ? "Kilométrage illimité" : "Kilométrage selon contrat",
        ...(AIRPORT_SERVICE ? [siteConfig.booking.freeAirportDelivery ? (CITY_HAS_AIRPORT ? `Livraison Aéroport ${CITY} gratuite` : `Livraison aéroport${CODES_SFX} gratuite`) : (CITY_HAS_AIRPORT ? `Livraison Aéroport (frais applicables)` : `Livraison aéroport${CODES_SFX} (frais applicables)`)] : []),
        siteConfig.booking.freeCityDelivery ? `Livraison ${CITY} ville gratuite` : `Livraison ville (frais applicables)`,
        "Assistance par WhatsApp en cas de problème",
        "Contrat + photos état des lieux",
      ],
    },
    excluded: {
      title: "❌ Non inclus / Exclusions",
      items: [
        "Pneus, vitres, sous-châssis (sauf option)",
        "Pistes non goudronnées",
        "Carburant (plein/plein)",
        "Amendes (PV) et lavage excessif",
      ],
    },
    documents: {
      title: "📋 Documents",
      items: [
        "Passeport (ou CIN Maroc)",
        "Permis de conduire valide",
        "Conditions d'âge selon le contrat",
        ...(AIRPORT_SERVICE ? ["N° de vol demandé pour la livraison à l'aéroport"] : []),
      ],
    },
    payment: {
      title: "💳 Paiement",
      items: [
        ...(siteConfig.business.payments.includes("cash") ? [siteConfig.business.acceptForeignCash ? `Espèces ${BASE_CURRENCY} / ${FOREIGN_CURRENCY}` : `Espèces ${BASE_CURRENCY} uniquement`] : []),
        ...(siteConfig.business.payments.includes("transfer") ? ["Virement bancaire"] : []),
        ...(siteConfig.business.payments.includes("card") ? ["Carte bancaire (TPE)"] : []),
        "Reçu remis pour chaque paiement",
      ],
      noDeposit: "Sans caution : aucune carte bancaire bloquée",
      deposit: "Caution demandée (montant indiqué avant la réservation)",
    },
  },
  how: {
    title: "Comment ça marche",
    subtitle: "3 étapes simples",
    steps: [
      { title: "Choisissez vos dates", desc: AIRPORT_SERVICE ? "Dates et lieu - Aéroport ou ville" : "Dates et lieu de livraison" },
      { title: "Recevez la confirmation", desc: AIRPORT_SERVICE ? "Sur WhatsApp, avec la photo du point de rencontre" : "Sur WhatsApp, avec le point de livraison exact" },
      { title: "Récupérez votre voiture", desc: "Contrat + photos état des lieux, puis vous partez" },
    ],
  },
  meeting: {
    title: CITY_HAS_AIRPORT ? `Point de rendez-vous Aéroport ${AIRPORT_CODE}` : HAS_DEL ? `Rendez-vous à l'aéroport : ${DEL_CODES}` : `Rendez-vous à l'aéroport`,
    text: CITY_HAS_AIRPORT
      ? `Rendez-vous : ${MEETING_POINT} (Meeting Point). Livraison directe à l'aéroport ${AIRPORT}. Les horaires de livraison sont confirmés sur WhatsApp.`
      : HAS_DEL
        ? `Livraison directe aux aéroports de ${DEL_FR}. Le point de rencontre exact et les horaires de livraison sont confirmés sur WhatsApp.`
        : `Livraison directe à l'aéroport. Le point de rencontre exact et les horaires de livraison sont confirmés sur WhatsApp.`,
    item1: CITY_HAS_AIRPORT ? `📍 ${MEETING_POINT} • Aéroport ${AIRPORT}` : HAS_DEL ? `📍 Point de rencontre dans chaque aéroport (précisé sur WhatsApp)` : `📍 Point de rencontre à l'aéroport (précisé sur WhatsApp)`,
    item2Free: "🚗 Livraison gratuite à l'aéroport",
    item2Paid: "🚗 Livraison à l'aéroport (frais selon lieu)",
    item3: "📸 Photo du point exact envoyée sur WhatsApp",
    airportsTitle: "Aéroports desservis",
    imageAlt: CITY_HAS_AIRPORT ? `Point de rendez-vous ${MEETING_POINT}, aéroport ${DE_AIRPORT}${AIRPORT}` : `Point de rendez-vous à l'aéroport`,
  },
  reviews: { title: "Avis de nos clients", subtitle: "Quelques retours de clients, publiés tels quels.", cta: "Voir tous les avis sur Google" },
  faq: {
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir avant de réserver",
    delivery: {
      q: "La livraison à l'aéroport est-elle gratuite ?",
      a: CITY_HAS_AIRPORT
        ? `Oui, la livraison à l'aéroport est gratuite. Rendez-vous : ${MEETING_POINT} à votre arrivée.`
        : HAS_DEL
          ? `Oui, la livraison aux aéroports de ${DEL_FR} est gratuite. Le point de rencontre vous est confirmé sur WhatsApp.`
          : "Oui, la livraison à l'aéroport est gratuite. Le point de rencontre vous est confirmé sur WhatsApp.",
    },
    deliveryPaid: {
      q: "Y a-t-il des frais de livraison à l'aéroport ?",
      a: HAS_DEL
        ? `Oui, des frais de livraison s'appliquent (aéroports de ${DEL_FR}). Leur montant, selon l'aéroport, vous est confirmé sur WhatsApp avant la réservation.`
        : "Oui, des frais de livraison s'appliquent. Leur montant vous est confirmé sur WhatsApp avant la réservation.",
    },
    deposit: { q: "Faut-il verser une caution ?", a: "Non, aucune carte bancaire n'est bloquée. Vous signez un contrat, nous faisons des photos avant/après et nous vérifions votre pièce d'identité." },
    depositYes: { q: "Faut-il verser une caution ?", a: "Oui, une caution est demandée. Son montant vous est indiqué avant la réservation." },
    km: { q: "Kilométrage illimité ?", a: "Oui, partout au Maroc sauf pistes non goudronnées." },
    booking: { q: "Comment se passe la réservation ?", a: "Choisissez vos dates et envoyez votre demande sur WhatsApp. La disponibilité et le prix final vous sont confirmés avant toute réservation." },
    docs: { q: "Quels documents faut-il ?", a: AIRPORT_SERVICE ? "Passeport + permis valide + n° de vol si livraison à l'aéroport." : "Passeport et permis de conduire valide." },
  },
  footer: {
    description: CITY_HAS_AIRPORT
      ? `Location de voiture à l'aéroport ${DE}${CITY}. Contrat écrit, photos de l'état des lieux et assistance par WhatsApp.`
      : AIRPORT_SERVICE
        ? `Location de voiture à ${CITY} avec livraison ${TO_AP_FR}. Contrat écrit, photos de l'état des lieux et assistance par WhatsApp.`
        : `Location de voiture à ${CITY}. Contrat écrit, photos de l'état des lieux et assistance par WhatsApp.`,
    navTitle: "Navigation",
    infoTitle: "Infos pratiques",
    contactTitle: "Contact",
    seeMap: "Voir sur Maps",
    legalNotice: "Aucun paiement en ligne ni carte bancaire requise sur ce site. Vos données de réservation sont transmises uniquement via WhatsApp (Loi 09-08).",
    rights: CITY_HAS_AIRPORT
      ? `© {year} {brand} - Tous droits réservés - Location voiture ${CITY} Aéroport`
      : `© {year} {brand} - Tous droits réservés - Location voiture ${CITY}`,
  },
  bar: { title: "Besoin d'une voiture ?", text: "Réponse rapide sur WhatsApp" },
  landing: { carsTitle: "Nos voitures", book: "Réserver sur WhatsApp", seeFleet: "Voir la flotte" },
  landings: {
    airport: {
      footerLabel: `Aéroport ${CITY}`,
      metaTitle: `Location voiture Aéroport ${AIRPORT} (${AIRPORT_CODE})`,
      metaDescription: `Récupérez votre voiture de location à l'aéroport ${DE_AIRPORT}${AIRPORT}. Réservation sur WhatsApp.`,
      metaKm: "Kilométrage illimité.",
      h1: `Location de voiture à l'aéroport ${DE_AIRPORT}${AIRPORT}`,
      intro: `Vous atterrissez à ${AIRPORT} (${AIRPORT_CODE}) ? Nous vous retrouvons à l'aéroport avec votre voiture, le contrat et les photos de l'état des lieux. Indiquez simplement votre numéro de vol sur WhatsApp.`,
      points: [`Point de rencontre à l'aéroport ${AIRPORT_CODE}`, "Indiquez votre numéro de vol sur WhatsApp", ...(siteConfig.booking.unlimitedKm ? ["Kilométrage illimité"] : []), "Réservation et confirmation par WhatsApp"],
    },
    airportDelivery: {
      footerLabel: "Livraison aéroport",
      metaTitle: `Location voiture ${CITY} avec livraison ${TO_AP_FR}`,
      metaDescription: `Louez votre voiture à ${CITY} et recevez-la ${TO_AP_FR}. Réservation sur WhatsApp.`,
      metaKm: "Kilométrage illimité.",
      h1: `Location de voiture ${CITY} avec livraison ${TO_AP_FR}`,
      intro: `Vous arrivez en avion ? Nous vous livrons votre voiture ${TO_AP_FR}, avec le contrat et les photos de l'état des lieux. Indiquez simplement l'aéroport et votre numéro de vol sur WhatsApp.`,
      points: [
        ...(HAS_DEL ? DEL.map((a) => `Livraison à l'aéroport ${a.name} (${a.code})`) : ["Livraison à l'aéroport"]),
        "Indiquez l'aéroport et votre numéro de vol sur WhatsApp",
        ...(siteConfig.booking.unlimitedKm ? ["Kilométrage illimité"] : []),
        "Réservation et confirmation par WhatsApp",
      ],
    },
    deposit: {
      footerLabel: "Sans caution",
      metaTitle: `Location voiture sans caution à ${CITY}`,
      metaDescription: `Louez une voiture à ${CITY} sans blocage de carte bancaire. Prix annoncés à l'avance, contrat et photos avant/après.`,
      h1: `Location de voiture sans caution à ${CITY}`,
      intro: "Pas de blocage sur votre carte bancaire : un contrat clair, un état des lieux en photos avant et après la location, et un prix annoncé dès le départ. Consultez les conditions exactes avant de réserver.",
      points: ["Pas de carte bancaire bloquée", "Contrat écrit et photos avant/après", "Prix annoncé à l'avance", "Conditions et exclusions détaillées sur le site"],
    },
    nearby: {
      footerLabel: `${NEARBY_FIRST}`,
      metaTitle: `Location voiture ${NEARBY_COMMA} et ${CITY}`,
      metaDescription: AIRPORT_SERVICE
        ? `Voiture de location pour ${NEARBY_FR} et la région autour ${DE}${CITY}. Livraison à l'aéroport ou en ville.`
        : `Voiture de location pour ${NEARBY_FR} et la région autour ${DE}${CITY}. Livraison en ville et aux alentours.`,
      h1: `Location de voiture pour ${NEARBY_FR}`,
      intro: AIRPORT_SERVICE
        ? `Visites, déplacements et villages aux alentours : une voiture vous permet de vous déplacer à votre rythme. Livraison ${TO_AP_FR}, en ville, ou à ${NEARBY_SLASH}.`
        : `Visites, déplacements et villages aux alentours : une voiture vous permet de vous déplacer à votre rythme. Livraison à ${CITY} ou à ${NEARBY_SLASH}.`,
      points: [`Livraison à ${NEARBY_SLASH}`, "Citadines, SUV et véhicules entretenus", "Assistance par WhatsApp"],
    },
  },
  wa: {
    hello: `Bonjour *{brand}* ! Je souhaite louer une voiture à ${CITY}.`,
    car: "*Voiture :* {car}",
    date: "*Date :* {date}",
    dates: "*Dates :* Du {from} au {to}",
    duration: "*Durée :* {duration}",
    place: "*Lieu :* {place}",
    price: "*Prix :* {price}/jour",
    total: "*Total : {total} (estimation, prix final confirmé sur WhatsApp)*",
    ask: "Pouvez-vous confirmer la disponibilité et le prix final ?",
    thanks: "Merci !",
  },
  error: { title: "Une erreur est survenue", text: "Nous sommes désolés, une erreur technique inattendue s'est produite.", retry: "Réessayer", home: "Accueil" },
  notFound: { title: "Page introuvable", text: "La page que vous recherchez n'existe pas ou a été déplacée.", back: "Retour à l'accueil" }
}

export type Dict = typeof fr

const en: Dict = {
  seo: { locationVoiture: "Car rental", slugAirport: "airport", slugAirportDelivery: "airport-delivery", slugDeposit: "no-deposit" },
  lang: { label: "Language", fr: "Français", en: "English", ar: "العربية" },
  common: {
    whatsapp: "WhatsApp",
    call: "Call",
    perDay: "/ day",
    close: "Close",
    menu: "Menu",
    showEur: `Show prices in ${FOREIGN_SYMBOL}`,
    showMad: `Show prices in ${BASE_CURRENCY}`,
    days: { one: "{n} day", other: "{n} days" },
  },
  nav: { fleet: "Our cars", conditions: "Conditions", how: "How it works", reviews: "Reviews", faq: "FAQ" },
  hero: {
    airportBadge: CITY_HAS_AIRPORT ? `${AIRPORT_CODE} Airport` : `Airport delivery${CODES_SFX}`,
    priceBadge: "From {price} / day",
    title: "Car rental",
    titleAccent: CITY_HAS_AIRPORT ? `${CITY} Airport.` : `${CITY}.`,
    description: AIRPORT_SERVICE
      ? `Prices shown upfront, delivery at ${AP_EN} and easy booking on WhatsApp.`
      : `Prices shown upfront, delivery in ${CITY} and easy booking on WhatsApp.`,
    imageAlt: CITY_HAS_AIRPORT ? `Car rental at ${AIRPORT} airport` : `Car rental in ${CITY}`,
    features: { noDeposit: "No deposit", unlimitedKm: "Unlimited km", freeAirport: "Free airport delivery" },
    location: "Location",
    pickup: "Pick-up",
    return: "Return",
    pickupPlaceholder: "Pick-up date",
    returnPlaceholder: "Return date",
    pickFirst: "Choose the pick-up date first",
    carOptional: "Car (optional)",
    chooseCar: "Choose a car",
    cta: "See available cars",
    waCta: "Check on WhatsApp",
    direct: "Or ask directly on WhatsApp",
    reply: "Availability confirmed on WhatsApp",
  },
  calendar: { prev: "Previous month", next: "Next month", weekdays: "M,T,W,T,F,S,S" },
  locations: {
    airport: CITY_HAS_AIRPORT ? `${CITY} Airport (${AIRPORT_CODE})` : `Airport delivery`,
    city: `${CITY} City`,
    nearby: `${NEARBY_SLASH}`,
    ...DEL_LOC_EN,
  } as Record<string, string>,
  trust: {
    contractTitle: "Contract + WhatsApp photos",
    contractText: "Before/after condition report",
    priceTitle: "Prices shown upfront",
    priceText: "Final price confirmed before booking",
    meetingTitle: AIRPORT_SERVICE ? "Airport meeting point" : "Delivery location",
    meetingLink: "View on Google Maps",
    whatsappTitle: "Booking by WhatsApp",
    whatsappText: "Send your request, we reply as soon as possible",
  },
  fleet: {
    title: "Our fleet",
    subtitle: AIRPORT_SERVICE ? "Well-maintained cars, ready to pick up at the airport." : "Well-maintained cars, ready to pick up.",
    categories: { all: "All", eco: "Economy", auto: "Automatic", suv: "SUV & 4x4", family: "Family" },
    popular: "POPULAR",
    seats: "{n} seats",
    auto: "Automatic",
    manual: "Manual",
    diesel: "Diesel",
    petrol: "Petrol",
    advance: "Advance payment: {amount}",
    freeCancel: "Free cancellation",
    book: "Book",
    note: `Conversion in ${FOREIGN_SYMBOL} is indicative. Final price confirmed on WhatsApp.`,
  },
  conditions: {
    title: "What's included. What's not.",
    included: {
      title: "✅ Included",
      items: [
        siteConfig.booking.insuranceIncluded ? "Insurance included (details in the contract)" : "Basic insurance (excess applies)",
        siteConfig.booking.unlimitedKm ? "Unlimited mileage" : "Mileage according to contract",
        ...(AIRPORT_SERVICE ? [siteConfig.booking.freeAirportDelivery ? (CITY_HAS_AIRPORT ? `Free ${CITY} Airport delivery` : `Free airport delivery${CODES_SFX}`) : (CITY_HAS_AIRPORT ? `Delivery to ${CITY} Airport (fees apply)` : `Airport delivery${CODES_SFX} (fees apply)`)] : []),
        siteConfig.booking.freeCityDelivery ? `Free ${CITY} city delivery` : `City delivery (fees apply)`,
        "Assistance by WhatsApp if there is a problem",
        "Contract + condition photos",
      ],
    },
    excluded: {
      title: "❌ Not included / Exclusions",
      items: [
        "Tyres, windows, underbody (unless optional cover)",
        "Unpaved tracks",
        "Fuel (full/full)",
        "Fines and excessive cleaning",
      ],
    },
    documents: {
      title: "📋 Documents",
      items: [
        "Passport (or Moroccan ID card)",
        "Valid driving licence",
        "Age conditions according to contract",
        ...(AIRPORT_SERVICE ? ["Flight number requested for airport delivery"] : []),
      ],
    },
    payment: {
      title: "💳 Payment",
      items: [
        ...(siteConfig.business.payments.includes("cash") ? [siteConfig.business.acceptForeignCash ? `Cash ${BASE_CURRENCY} / ${FOREIGN_CURRENCY}` : `Cash ${BASE_CURRENCY} only`] : []),
        ...(siteConfig.business.payments.includes("transfer") ? ["Bank Transfer"] : []),
        ...(siteConfig.business.payments.includes("card") ? ["Credit/Debit Card"] : []),
        "Receipt given for every payment",
      ],
      noDeposit: "No deposit: no bank card is blocked",
      deposit: "Deposit required (amount shown before booking)",
    },
  },
  how: {
    title: "How it works",
    subtitle: "3 simple steps",
    steps: [
      { title: "Choose your dates", desc: AIRPORT_SERVICE ? "Dates and place - airport or city" : "Dates and delivery location" },
      { title: "Get your confirmation", desc: AIRPORT_SERVICE ? "On WhatsApp, with a photo of the meeting point" : "On WhatsApp, with the exact delivery spot" },
      { title: "Pick up your car", desc: "Contract + condition photos, then you drive away" },
    ],
  },
  meeting: {
    title: CITY_HAS_AIRPORT ? `${AIRPORT_CODE} airport meeting point` : HAS_DEL ? `Airport meeting points: ${DEL_CODES}` : `Airport meeting point`,
    text: CITY_HAS_AIRPORT
      ? `Meet us at ${MEETING_POINT} (Meeting Point). Direct delivery at ${AIRPORT} airport. Delivery times are confirmed on WhatsApp.`
      : HAS_DEL
        ? `Direct delivery at ${DEL_EN} airports. The exact meeting point and delivery times are confirmed on WhatsApp.`
        : `Direct delivery at the airport. The exact meeting point and delivery times are confirmed on WhatsApp.`,
    item1: CITY_HAS_AIRPORT ? `📍 ${MEETING_POINT} • ${AIRPORT} Airport` : HAS_DEL ? `📍 Meeting point at each airport (confirmed on WhatsApp)` : `📍 Airport meeting point (confirmed on WhatsApp)`,
    item2Free: "🚗 Free delivery at the airport",
    item2Paid: "🚗 Airport delivery (fees depending on location)",
    item3: "📸 Photo of the exact spot sent on WhatsApp",
    airportsTitle: "Airports we deliver to",
    imageAlt: CITY_HAS_AIRPORT ? `${MEETING_POINT} meeting point, ${AIRPORT} airport` : `Airport meeting point`,
  },
  reviews: { title: "Customer reviews", subtitle: "A few customer comments, shown as written.", cta: "See all reviews on Google" },
  faq: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know before booking",
    delivery: {
      q: "Is airport delivery free?",
      a: CITY_HAS_AIRPORT
        ? `Yes, airport delivery is free. Meet us at ${MEETING_POINT} when you land.`
        : HAS_DEL
          ? `Yes, delivery at ${DEL_EN} airports is free. The meeting point is confirmed on WhatsApp.`
          : "Yes, airport delivery is free. The meeting point is confirmed on WhatsApp.",
    },
    deliveryPaid: {
      q: "Is there a delivery fee at the airport?",
      a: HAS_DEL
        ? `Yes, a delivery fee applies (${DEL_EN} airports). The amount, depending on the airport, is confirmed on WhatsApp before you book.`
        : "Yes, a delivery fee applies. The amount is confirmed on WhatsApp before you book.",
    },
    deposit: { q: "Do I need to pay a deposit?", a: "No, no bank card is blocked. You sign a contract, we take photos before/after and we check your ID." },
    depositYes: { q: "Do I need to pay a deposit?", a: "Yes, a deposit is required. The amount is shown to you before booking." },
    km: { q: "Unlimited mileage?", a: "Yes, anywhere in Morocco except unpaved tracks." },
    booking: { q: "How does booking work?", a: "Choose your dates and send your request on WhatsApp. Availability and the final price are confirmed to you before any booking." },
    docs: { q: "Which documents do I need?", a: AIRPORT_SERVICE ? "Passport + valid driving licence + flight number for airport delivery." : "Passport and valid driving licence." },
  },
  footer: {
    description: CITY_HAS_AIRPORT
      ? `Car rental at ${CITY} airport. Written contract, condition photos and assistance by WhatsApp.`
      : AIRPORT_SERVICE
        ? `Car rental in ${CITY} with delivery at ${AP_EN}. Written contract, condition photos and assistance by WhatsApp.`
        : `Car rental in ${CITY}. Written contract, condition photos and assistance by WhatsApp.`,
    navTitle: "Navigation",
    infoTitle: "Useful info",
    contactTitle: "Contact",
    seeMap: "View on Maps",
    legalNotice: "No online payment or credit card required on this website. Your booking details are shared exclusively via WhatsApp (Law 09-08).",
    rights: CITY_HAS_AIRPORT ? `© {year} {brand} - All rights reserved - Car rental ${CITY} Airport` : `© {year} {brand} - All rights reserved - Car rental ${CITY}`,
  },
  bar: { title: "Need a car?", text: "Quick reply on WhatsApp" },
  landing: { carsTitle: "Our cars", book: "Book on WhatsApp", seeFleet: "See the fleet" },
  landings: {
    airport: {
      footerLabel: `${CITY} Airport`,
      metaTitle: `Car rental ${AIRPORT} Airport (${AIRPORT_CODE})`,
      metaDescription: `Pick up your rental car at ${AIRPORT} airport. Booking on WhatsApp.`,
      metaKm: "Unlimited mileage.",
      h1: `Car rental at ${AIRPORT} Airport`,
      intro: `Landing at ${AIRPORT} (${AIRPORT_CODE})? We meet you at the airport with your car, the contract and the condition photos. Just send your flight number on WhatsApp.`,
      points: [`Meeting point at ${AIRPORT_CODE} airport`, "Send your flight number on WhatsApp", ...(siteConfig.booking.unlimitedKm ? ["Unlimited mileage"] : []), "Booking and confirmation by WhatsApp"],
    },
    airportDelivery: {
      footerLabel: "Airport delivery",
      metaTitle: `Car rental ${CITY} with delivery at ${AP_EN}`,
      metaDescription: `Rent your car in ${CITY} and get it delivered at ${AP_EN}. Booking on WhatsApp.`,
      metaKm: "Unlimited mileage.",
      h1: `Car rental ${CITY} with delivery at ${AP_EN}`,
      intro: `Flying in? We deliver your car at ${AP_EN}, with the contract and the condition photos. Just send the airport and your flight number on WhatsApp.`,
      points: [
        ...(HAS_DEL ? DEL.map((a) => `Delivery at ${a.name} airport (${a.code})`) : ["Delivery at the airport"]),
        "Send the airport and your flight number on WhatsApp",
        ...(siteConfig.booking.unlimitedKm ? ["Unlimited mileage"] : []),
        "Booking and confirmation by WhatsApp",
      ],
    },
    deposit: {
      footerLabel: "No deposit",
      metaTitle: `Car rental with no deposit in ${CITY}`,
      metaDescription: `Rent a car in ${CITY} with no card hold. Prices shown upfront, contract and before/after photos.`,
      h1: `Car rental in ${CITY} with no deposit`,
      intro: "No hold on your bank card: a clear contract, before and after photos of the car, and a price shown upfront. Please read the exact conditions before booking.",
      points: ["No bank card blocked", "Written contract and before/after photos", "Price shown upfront", "Conditions and exclusions detailed on the site"],
    },
    nearby: {
      footerLabel: `${NEARBY_FIRST}`,
      metaTitle: `Car rental ${NEARBY_COMMA} and ${CITY}`,
      metaDescription: AIRPORT_SERVICE
        ? `Rental car for ${NEARBY_EN} and the area around ${CITY}. Delivery at the airport or in the city.`
        : `Rental car for ${NEARBY_EN} and the area around ${CITY}. Delivery in the city and nearby areas.`,
      h1: `Car rental for ${NEARBY_EN}`,
      intro: AIRPORT_SERVICE
        ? `Visiting and discovering nearby towns and villages: a car lets you move at your pace. Delivery at ${AP_EN}, in the city, or in ${NEARBY_SLASH}.`
        : `Visiting and discovering nearby towns and villages: a car lets you move at your pace. Delivery in ${CITY} or in ${NEARBY_SLASH}.`,
      points: [`Delivery to ${NEARBY_SLASH}`, "City cars, SUVs and maintained vehicles", "Assistance by WhatsApp"],
    },
  },
  wa: {
    hello: `Hello *{brand}*! I would like to rent a car in ${CITY}.`,
    car: "*Car:* {car}",
    date: "*Date:* {date}",
    dates: "*Dates:* From {from} to {to}",
    duration: "*Duration:* {duration}",
    place: "*Location:* {place}",
    price: "*Price:* {price}/day",
    total: "*Total: {total} (estimate, final price confirmed on WhatsApp)*",
    ask: "Can you confirm availability and the final price?",
    thanks: "Thank you!",
  },
  error: { title: "An error occurred", text: "We are sorry, an unexpected technical error has occurred.", retry: "Try again", home: "Home" },
  notFound: { title: "Page not found", text: "The page you are looking for does not exist or has been moved.", back: "Back to home" }
}

const ar: Dict = {
  seo: { locationVoiture: "كراء السيارات", slugAirport: "matar", slugAirportDelivery: "tawsil-matar", slugDeposit: "bidoun-daman" },
  lang: { label: "اللغة", fr: "Français", en: "English", ar: "العربية" },
  common: {
    whatsapp: "واتساب",
    call: "اتصال",
    perDay: "/ اليوم",
    close: "إغلاق",
    menu: "القائمة",
    showEur: `عرض الأسعار بـ ${FOREIGN_SYMBOL}`,
    showMad: `عرض الأسعار بـ ${BASE_CURRENCY}`,
    days: { one: "يوم واحد", two: "يومان", few: "{n} أيام", other: "{n} يومًا" },
  },
  nav: { fleet: "سياراتنا", conditions: "الشروط", how: "كيف تعمل الخدمة", reviews: "آراء الزبناء", faq: "الأسئلة الشائعة" },
    hero: {
    airportBadge: CITY_HAS_AIRPORT ? `مطار ${AIRPORT_CODE}` : `التوصيل إلى المطار${CODES_SFX}`,
    priceBadge: "ابتداءً من {price} / اليوم",
    title: "كراء السيارات",
    titleAccent: CITY_HAS_AIRPORT ? `مطار ${CITY_AR}.` : `${CITY_AR}.`,
    description: AIRPORT_SERVICE
      ? `أسعار معلنة مسبقًا، تسليم السيارة في ${AP_AR}، وحجز سهل عبر واتساب.`
      : `أسعار معلنة مسبقًا، تسليم السيارة في ${CITY_AR}، وحجز سهل عبر واتساب.`,
    imageAlt: CITY_HAS_AIRPORT ? `كراء السيارات في مطار ${AIRPORT_FULL_AR}` : `كراء السيارات في ${CITY_AR}`,
    features: { noDeposit: "بدون ضمانة", unlimitedKm: "كيلومترات غير محدودة", freeAirport: "تسليم مجاني في المطار" },
    location: "المكان",
    pickup: "الاستلام",
    return: "الإرجاع",
    pickupPlaceholder: "تاريخ الاستلام",
    returnPlaceholder: "تاريخ الإرجاع",
    pickFirst: "اختر تاريخ الاستلام أولًا",
    carOptional: "السيارة (اختياري)",
    chooseCar: "اختر سيارة",
    cta: "عرض السيارات المتوفرة",
    waCta: "تأكيد عبر واتساب",
    direct: "أو اطلب مباشرة عبر واتساب",
    reply: "نؤكد لك التوفر عبر واتساب",
  },
  calendar: { prev: "الشهر السابق", next: "الشهر التالي", weekdays: "ن,ث,ر,خ,ج,س,ح" },
  locations: {
    airport: CITY_HAS_AIRPORT ? `مطار ${CITY_AR} (${AIRPORT_CODE})` : `التوصيل إلى المطار`,
    city: `مدينة ${CITY_AR}`,
    nearby: `${NEARBY_SLASH_AR}`,
    ...DEL_LOC_AR,
  } as Record<string, string>,
  trust: {
    contractTitle: "عقد + صور عبر واتساب",
    contractText: "معاينة السيارة قبل وبعد الكراء",
    priceTitle: "أسعار معلنة مسبقًا",
    priceText: "الثمن النهائي يتم تأكيده قبل الحجز",
    meetingTitle: AIRPORT_SERVICE ? "نقطة اللقاء في المطار" : "مكان التسليم",
    meetingLink: "عرض على Google Maps",
    whatsappTitle: "الحجز عبر واتساب",
    whatsappText: "أرسل طلبك وسنجيبك في أقرب وقت",
  },
  fleet: {
    title: "أسطولنا",
    subtitle: AIRPORT_SERVICE ? "سيارات مصانة، جاهزة للاستلام في المطار." : "سيارات مصانة، جاهزة للاستلام.",
    categories: { all: "الكل", eco: "اقتصادية", auto: "أوتوماتيك", suv: "SUV و 4x4", family: "عائلية" },
    popular: "الأكثر طلبًا",
    seats: "{n} مقاعد",
    auto: "أوتوماتيك",
    manual: "عادي",
    diesel: "ديزل",
    petrol: "بنزين",
    advance: "التسبيق: {amount}",
    freeCancel: "إلغاء مجاني",
    book: "احجز",
    note: "التحويل تقريبي. الثمن النهائي مؤكد عبر واتساب.",
  },
  conditions: {
    title: "ما هو مشمول. وما هو غير مشمول.",
    included: {
      title: "✅ مشمول",
      items: [
        siteConfig.booking.insuranceIncluded ? "التأمين مشمول (التفاصيل في العقد)" : "تأمين أساسي (تُطبق نسبة اقتطاع / Franchise)",
        siteConfig.booking.unlimitedKm ? "كيلومترات غير محدودة" : "كيلومترات محددة بالعقد",
        ...(AIRPORT_SERVICE ? [siteConfig.booking.freeAirportDelivery ? (CITY_HAS_AIRPORT ? `التسليم مجاني في مطار ${CITY_AR}` : `التسليم مجاني في المطار${CODES_SFX}`) : (CITY_HAS_AIRPORT ? `التسليم في مطار ${CITY_AR} (رسوم إضافية)` : `التسليم في المطار${CODES_SFX} (رسوم إضافية)`)] : []),
        siteConfig.booking.freeCityDelivery ? `التسليم مجاني في مدينة ${CITY_AR}` : `التسليم في المدينة (رسوم إضافية)`,
        "مساعدة عبر واتساب في حالة وجود مشكل",
        "عقد + صور معاينة السيارة",
      ],
    },
    excluded: {
      title: "❌ غير مشمول / استثناءات",
      items: [
        "العجلات والزجاج وأسفل السيارة (إلا بخيار إضافي)",
        "المسالك غير المعبدة",
        "الوقود (خزان ممتلئ عند الاستلام والإرجاع)",
        "المخالفات والتنظيف المفرط",
      ],
    },
    documents: {
      title: "📋 الوثائق",
      items: [
        "جواز السفر (أو البطاقة الوطنية)",
        "رخصة سياقة سارية المفعول",
        "شروط السن حسب العقد",
        ...(AIRPORT_SERVICE ? ["رقم الرحلة مطلوب للتسليم في المطار"] : []),
      ],
    },
    payment: {
      title: "💳 الأداء",
      items: [
        ...(siteConfig.business.payments.includes("cash") ? [siteConfig.business.acceptForeignCash ? `نقدًا ${BASE_CURRENCY} / ${FOREIGN_CURRENCY}` : `نقدًا ${BASE_CURRENCY} فقط`] : []),
        ...(siteConfig.business.payments.includes("transfer") ? ["تحويل بنكي"] : []),
        ...(siteConfig.business.payments.includes("card") ? ["البطاقة البنكية"] : []),
        "تسليم وصل عن كل أداء",
      ],
      noDeposit: "بدون ضمانة: لا يتم حجز أي مبلغ من بطاقتك البنكية",
      deposit: "ضمانة مطلوبة (يتم إخبارك بالمبلغ قبل الحجز)",
    },
  },
  how: {
    title: "كيف تعمل الخدمة",
    subtitle: "3 خطوات بسيطة",
    steps: [
      { title: "اختر تواريخك", desc: AIRPORT_SERVICE ? "التواريخ والمكان - المطار أو المدينة" : "التواريخ ومكان التسليم" },
      { title: "احصل على التأكيد", desc: AIRPORT_SERVICE ? "عبر واتساب، مع صورة نقطة اللقاء" : "عبر واتساب، مع تحديد مكان التسليم بدقة" },
      { title: "استلم سيارتك", desc: "عقد + صور المعاينة، ثم تنطلق" },
    ],
  },
  meeting: {
    title: CITY_HAS_AIRPORT ? `نقطة اللقاء في مطار ${AIRPORT_CODE}` : HAS_DEL ? `نقطة اللقاء في المطار: ${DEL_CODES}` : `نقطة اللقاء في المطار`,
    text: CITY_HAS_AIRPORT
      ? `نلتقي في ${MEETING_POINT_AR} (نقطة اللقاء). تسليم مباشر في مطار ${AIRPORT_AR}. مواعيد التسليم يتم تأكيدها عبر واتساب.`
      : HAS_DEL
        ? `تسليم مباشر في ${AP_AR}. نقطة اللقاء الدقيقة ومواعيد التسليم يتم تأكيدها عبر واتساب.`
        : `تسليم مباشر في المطار. نقطة اللقاء الدقيقة ومواعيد التسليم يتم تأكيدها عبر واتساب.`,
    item1: CITY_HAS_AIRPORT ? `📍 ${MEETING_POINT_AR} • مطار ${AIRPORT_FULL_AR}` : HAS_DEL ? `📍 نقطة اللقاء في كل مطار (تُحدَّد عبر واتساب)` : `📍 نقطة اللقاء في المطار (تُحدَّد عبر واتساب)`,
    item2Free: "🚗 تسليم مجاني في المطار",
    item2Paid: "🚗 تسليم في المطار (رسوم حسب المكان)",
    item3: "📸 صورة المكان بالضبط ترسل عبر واتساب",
    airportsTitle: "المطارات التي نسلّم فيها",
    imageAlt: CITY_HAS_AIRPORT ? `نقطة اللقاء ${MEETING_POINT_AR}، مطار ${AIRPORT_FULL_AR}` : `نقطة اللقاء في المطار`,
  },
  reviews: { title: "آراء زبنائنا", subtitle: "بعض آراء الزبناء كما كتبوها.", cta: "عرض جميع التقييمات على Google" },
  faq: {
    title: "الأسئلة الشائعة",
    subtitle: "كل ما تحتاج معرفته قبل الحجز",
    delivery: {
      q: "هل التوصيل إلى المطار مجاني؟",
      a: CITY_HAS_AIRPORT
        ? `نعم، التوصيل إلى المطار مجاني. نلتقي بكم في ${MEETING_POINT_AR} عند وصولكم.`
        : HAS_DEL
          ? `نعم، التوصيل إلى ${AP_AR} مجاني. يتم تأكيد نقطة اللقاء عبر واتساب.`
          : "نعم، التوصيل إلى المطار مجاني. يتم تأكيد نقطة اللقاء عبر واتساب.",
    },
    deliveryPaid: {
      q: "هل هناك رسوم للتوصيل إلى المطار؟",
      a: HAS_DEL
        ? `نعم، تُطبّق رسوم توصيل (${AP_AR})، ويتم تأكيد مبلغها حسب المطار عبر واتساب قبل الحجز.`
        : "نعم، تُطبّق رسوم توصيل، ويتم تأكيد مبلغها عبر واتساب قبل الحجز.",
    },
    deposit: { q: "هل يجب دفع ضمانة؟", a: "لا، لا يتم حجز أي مبلغ من بطاقتك البنكية. توقع عقدًا، ونأخذ صورًا قبل وبعد الكراء، ونتحقق من وثيقة هويتك." },
    depositYes: { q: "هل يجب دفع ضمانة؟", a: "نعم، الضمانة مطلوبة. يتم إخبارك بمبلغها قبل الحجز." },
    km: { q: "هل الكيلومترات غير محدودة؟", a: "نعم، في جميع أنحاء المغرب باستثناء المسالك غير المعبدة." },
    booking: { q: "كيف يتم الحجز؟", a: "اختر تواريخك وأرسل طلبك عبر واتساب. يتم تأكيد التوفر والثمن النهائي قبل أي حجز." },
    docs: { q: "ما هي الوثائق المطلوبة؟", a: AIRPORT_SERVICE ? "جواز السفر + رخصة سياقة سارية + رقم الرحلة للتسليم في المطار." : "جواز السفر ورخصة سياقة سارية المفعول." },
  },
  footer: {
    description: CITY_HAS_AIRPORT
      ? `كراء السيارات في مطار ${CITY_AR}. عقد مكتوب، صور معاينة السيارة، ومساعدة عبر واتساب.`
      : AIRPORT_SERVICE
        ? `كراء السيارات في ${CITY_AR} مع التسليم في ${AP_AR}. عقد مكتوب، صور معاينة السيارة، ومساعدة عبر واتساب.`
        : `كراء السيارات في ${CITY_AR}. عقد مكتوب، صور معاينة السيارة، ومساعدة عبر واتساب.`,
    navTitle: "التنقل",
    infoTitle: "معلومات مفيدة",
    contactTitle: "التواصل",
    seeMap: "عرض على Maps",
    legalNotice: "لا يُطلب أي أداء إلكتروني أو بطاقة بنكية عبر الموقع. تُرسل معلومات الحجز حصريًا عبر واتساب لتأكيد طلبكم (القانون 09-08).",
    rights: CITY_HAS_AIRPORT
      ? `© {year} {brand} - جميع الحقوق محفوظة - كراء السيارات في مطار ${CITY_AR}`
      : `© {year} {brand} - جميع الحقوق محفوظة - كراء السيارات في ${CITY_AR}`,
  },
  bar: { title: "تحتاج سيارة؟", text: "جواب سريع عبر واتساب" },
  landing: { carsTitle: "سياراتنا", book: "احجز عبر واتساب", seeFleet: "عرض الأسطول" },
  landings: {
    airport: {
      footerLabel: `مطار ${CITY_AR}`,
      metaTitle: `كراء السيارات في مطار ${AIRPORT_FULL_AR} (${AIRPORT_CODE})`,
      metaDescription: `استلم سيارتك في مطار ${AIRPORT_FULL_AR}. الحجز عبر واتساب.`,
      metaKm: "كيلومترات غير محدودة.",
      h1: `كراء السيارات في مطار ${AIRPORT_FULL_AR}`,
      intro: `ستحط الطائرة في ${AIRPORT_FULL_AR} (${AIRPORT_CODE})؟ نلتقي بك في المطار مع سيارتك والعقد وصور معاينة السيارة. فقط أرسل رقم رحلتك عبر واتساب.`,
      points: [`نقطة اللقاء في مطار ${AIRPORT_CODE}`, "أرسل رقم رحلتك عبر واتساب", ...(siteConfig.booking.unlimitedKm ? ["كيلومترات غير محدودة"] : []), "الحجز والتأكيد عبر واتساب"],
    },
    airportDelivery: {
      footerLabel: "التوصيل إلى المطار",
      metaTitle: `كراء السيارات في ${CITY_AR} مع التوصيل إلى ${AP_AR}`,
      metaDescription: `اكترِ سيارتك في ${CITY_AR} واستلمها في ${AP_AR}. الحجز عبر واتساب.`,
      metaKm: "كيلومترات غير محدودة.",
      h1: `كراء السيارات في ${CITY_AR} مع التوصيل إلى ${AP_AR}`,
      intro: `ستصل عبر الطائرة؟ نسلّمك السيارة في ${AP_AR} مع العقد وصور معاينة السيارة. فقط أرسل اسم المطار ورقم رحلتك عبر واتساب.`,
      points: [
        ...(HAS_DEL ? DEL.map((a) => `التسليم في مطار ${a.nameAr} (${a.code})`) : ["التسليم في المطار"]),
        "أرسل اسم المطار ورقم رحلتك عبر واتساب",
        ...(siteConfig.booking.unlimitedKm ? ["كيلومترات غير محدودة"] : []),
        "الحجز والتأكيد عبر واتساب",
      ],
    },
    deposit: {
      footerLabel: "بدون ضمانة",
      metaTitle: `كراء السيارات في ${CITY_AR} بدون ضمانة`,
      metaDescription: `اكترِ سيارة في ${CITY_AR} دون حجز مبلغ على البطاقة البنكية. أسعار معلنة مسبقًا، عقد وصور قبل/بعد.`,
      h1: `كراء السيارات في ${CITY_AR} بدون ضمانة`,
      intro: "لا يتم حجز أي مبلغ من بطاقتك البنكية: عقد واضح، صور للسيارة قبل وبعد الكراء، وثمن معلن مسبقًا. المرجو قراءة الشروط بدقة قبل الحجز.",
      points: ["لا يتم حجز البطاقة البنكية", "عقد مكتوب وصور قبل وبعد", "ثمن معلن مسبقًا", "الشروط والاستثناءات مفصلة في الموقع"],
    },
    nearby: {
      footerLabel: `${NEARBY_FIRST_AR}`,
      metaTitle: `كراء السيارات في ${NEARBY_COMMA_AR} و${CITY_AR}`,
      metaDescription: AIRPORT_SERVICE
        ? `سيارة للكراء في نواحي ${CITY_AR}. التسليم في المطار أو في المدينة.`
        : `سيارة للكراء في نواحي ${CITY_AR}. التسليم في المدينة والنواحي.`,
      h1: `كراء السيارات ${NEARBY_AND_AR_LAM}`,
      intro: AIRPORT_SERVICE
        ? `زيارة واكتشاف المدن والبلدات المجاورة: السيارة تمنحك حرية التنقل على راحتك. التسليم في ${AP_AR} أو في المدينة أو في ${NEARBY_SLASH_AR}.`
        : `زيارة واكتشاف المدن والبلدات المجاورة: السيارة تمنحك حرية التنقل على راحتك. التسليم في ${CITY_AR} أو في ${NEARBY_SLASH_AR}.`,
      points: [`التسليم في ${NEARBY_SLASH_AR}`, "سيارات المدينة وSUV مصانة", "مساعدة عبر واتساب"],
    },
  },
  wa: {
    hello: `مرحبا *{brand}* ! أرغب في كراء سيارة في ${CITY_AR}.`,
    car: "*السيارة:* {car}",
    date: "*التاريخ:* {date}",
    dates: "*التواريخ:* من {from} إلى {to}",
    duration: "*المدة:* {duration}",
    place: "*المكان:* {place}",
    price: "*الثمن:* {price}/اليوم",
    total: "*المجموع: {total} (تقدير، الثمن النهائي مؤكد عبر واتساب)*",
    ask: "هل يمكنكم تأكيد التوفر والثمن النهائي؟",
    thanks: "شكرًا !",
  },
  error: { title: "حدث خطأ", text: "نعتذر، حدث خطأ تقني غير متوقع.", retry: "إعادة المحاولة", home: "الرئيسية" },
  notFound: { title: "الصفحة غير موجودة", text: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", back: "العودة للرئيسية" }
}

export const translations: Record<Lang, Dict> = { fr, en, ar }