export type CarCategory = "eco" | "auto" | "suv" | "family";
export type FuelType = "diesel" | "petrol";
export type LocationId = string;
export type PaymentMethod = "cash" | "transfer" | "card";

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  popular: boolean;
  price: number;
  image: string;
  seats: number;
  auto: boolean;
  fuel: FuelType;
}

export interface DeliveryAirport {
  name: string;
  nameAr: string;
  code: string;
}

export type Review = { name: string; lang: string; rating: number; text: string };

export const CITY_HAS_AIRPORT = true;
export const AIRPORT_SERVICE = true;

const seo = {
  city: "Casablanca",
  region: "Casablanca-Settat",
  areas: ["Casablanca", "Mohammedia", "Dar Bouazza"],
  airport: CITY_HAS_AIRPORT ? "Casablanca Mohammed V" : "",
  airportCode: CITY_HAS_AIRPORT ? "CMN" : "",
  meetingPoint: CITY_HAS_AIRPORT ? "Parking P2" : "",
  deliveryAirports: (CITY_HAS_AIRPORT ? [] : [
    { name: "Casablanca Mohammed V", nameAr: "الدار البيضاء محمد الخامس", code: "CMN" },
    { name: "Marrakech Menara", nameAr: "مراكش المنارة", code: "RAK" },
    { name: "Agadir Al Massira", nameAr: "أكادير المسيرة", code: "AGA" },
  ]) as DeliveryAirport[],
  cityAr: "الدار البيضاء",
  airportAr: CITY_HAS_AIRPORT ? "محمد الخامس" : "",
  meetingPointAr: CITY_HAS_AIRPORT ? "الموقف P2" : "",
  areasAr: ["الدار البيضاء", "المحمدية", "دار بوعزة"],
  keywords: ["location voiture", "car rental", "rent a car"],
};

export const airportLocationId = (a: DeliveryAirport): LocationId => `airport-${a.code.trim().toLowerCase()}`;

const hasNearbyAreas = seo.areas.some((a) => a.trim().toLowerCase() !== seo.city.trim().toLowerCase());

const airportLocations: LocationId[] = !AIRPORT_SERVICE
  ? []
  : CITY_HAS_AIRPORT || seo.deliveryAirports.length === 0
    ? ["airport"]
    : seo.deliveryAirports.map(airportLocationId);

const locations: LocationId[] = [
  ...airportLocations,
  "city",
  ...(hasNearbyAreas ? (["nearby"] as LocationId[]) : []),
];

const cars: Car[] = [
  { id: "logan", name: "Dacia Logan", category: "eco", popular: true, price: 250, image: "/fleet/logan.webp", seats: 5, auto: false, fuel: "diesel" },
  { id: "clio", name: "Renault Clio 5", category: "eco", popular: false, price: 300, image: "/fleet/clio5.webp", seats: 5, auto: false, fuel: "petrol" },
  { id: "sandero", name: "Dacia Sandero Stepway", category: "eco", popular: false, price: 270, image: "/fleet/sandero.webp", seats: 5, auto: false, fuel: "petrol" },
  { id: "duster", name: "Dacia Duster", category: "suv", popular: true, price: 400, image: "/fleet/duster.webp", seats: 5, auto: false, fuel: "diesel" },
  { id: "golf8", name: "VW Golf 8", category: "auto", popular: false, price: 500, image: "/fleet/golf8.webp", seats: 5, auto: true, fuel: "diesel" },
  { id: "jogger", name: "Dacia Jogger", category: "family", popular: true, price: 450, image: "/fleet/jogger.webp", seats: 7, auto: false, fuel: "diesel" },
];

export const siteConfig = {
  website: {
    url: "https://agadir-rent-demo.pages.dev",
    contentUpdated: "2026-10-14",
  },
  verified: {
    businessInfo: false,
    legalClaims: false,
    fleet: false,
    seo: false,
  },
  brand: { name: "YOUR", nameLight: "BRAND", logo: "/logo.png" },
  seo,
  contact: {
    whatsapp: "212600000000",
    phone: "+212600000000",
    phoneDisplay: "+212 6 00 00 00 00",
    address: "CHANGE-ME",
    geo: { lat: 0, lng: 0 },
    sameAs: [] as string[],
    googleMapsLink: "https://CHANGE-ME",
    meetingPointPhoto: "/meeting-point.webp",
  },
  booking: {
    cityHasAirport: CITY_HAS_AIRPORT,
    airportService: AIRPORT_SERVICE,
    locations,
    withCaution: true,
    advancePaymentDh: null as number | null,
    freeCancellation: false,
    unlimitedKm: false,
    freeAirportDelivery: false,
    freeCityDelivery: false,
    insuranceIncluded: false,
  },
  currency: { base: "MAD", foreign: "EUR", rate: 0.092 },
  business: {
    openingHours: "00:00-23:59",
    timezone: "Africa/Casablanca",
    payments: ["cash", "transfer"] as PaymentMethod[],
    acceptForeignCash: true,
    addressCountry: "MA",
    legal: {
      ice: "",
      rc: "",
    },
  },
  tracking: {
    gaId: "",
    metaPixelId: "",
  },
  hero: { image: "/hero.webp" },
  fleet: { cars },
  reviews: { googleMapsLink: "", items: [] as Review[] },
};

export const BRAND = `${siteConfig.brand.name} ${siteConfig.brand.nameLight}`.trim();

const b = siteConfig.booking;

export const showReviews = siteConfig.reviews.items.length > 0;

export const faqKeys = [
  ...(b.airportService ? [b.freeAirportDelivery ? "delivery" : "deliveryPaid"] : []),
  b.withCaution ? "depositYes" : "deposit",
  ...(b.unlimitedKm ? ["km"] : []),
  "booking",
  "docs",
] as const;

export const SITE_URL = siteConfig.website.url.replace(/\/+$/, "");

export const IS_PRODUCTION_SITE =
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_PLACEHOLDER_CONFIG !== "true";

const PAYMENT_SCHEMA_LABEL: Record<PaymentMethod, string> = {
  cash: "Cash",
  transfer: "Bank Transfer",
  card: "Credit Card",
};
export const paymentAcceptedSchema = siteConfig.business.payments.map((m) => PAYMENT_SCHEMA_LABEL[m]).join(", ");

const deliveryNamesFr = (() => {
  const n = siteConfig.seo.deliveryAirports.map((a) => a.name);
  return n.length < 2 ? n.join("") : `${n.slice(0, -1).join(", ")} et ${n[n.length - 1]}`;
})();

const airportSeoPart = (() => {
  const free = b.freeAirportDelivery ? "gratuite " : "";
  if (b.cityHasAirport) return `livraison ${free}à l'aéroport ${siteConfig.seo.airport}`;
  if (siteConfig.seo.deliveryAirports.length > 0) return `livraison ${free}aux aéroports de ${deliveryNamesFr}`;
  return `livraison ${free}à l'aéroport`;
})();

export const seoDescription = [
  `Location voiture ${siteConfig.seo.city}${b.withCaution ? "" : " sans caution"}`,
  b.airportService
    ? airportSeoPart
    : `livraison ${b.freeCityDelivery ? "gratuite " : ""}à ${siteConfig.seo.city}`,
  b.unlimitedKm ? "kilométrage illimité" : null,
  "réservation rapide sur WhatsApp",
].filter(Boolean).join(", ") + ".";