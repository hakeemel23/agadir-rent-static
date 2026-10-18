import type { Metadata } from "next";
import { Geist, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { IS_PRODUCTION_SITE, SITE_URL, paymentAcceptedSchema, seoDescription, siteConfig, type Car } from "@/data/config";
import { assertProductionReady } from "@/data/guard";
import { BookingProvider } from "@/context/BookingContext";
import { BASE_CURRENCY, FOREIGN_CURRENCY } from "@/lib/currency";
import { tr } from "@/lib/i18n";
import { DEFAULT_LANG } from "@/data/translations";

// Bloque la production si la config contient des données de démonstration ou non vérifiées.
assertProductionReady();

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const notoKufi = Noto_Kufi_Arabic({ variable: "--font-noto-arabic", subsets: ["arabic"], preload: false });
const BRAND = `${siteConfig.brand.name} ${siteConfig.brand.nameLight}`.trim();
const PAGE_TITLE = `${tr(DEFAULT_LANG, "seo.locationVoiture")} ${siteConfig.seo.city} | ${BRAND}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: seoDescription,
  keywords: siteConfig.seo.keywords,
  alternates: { canonical: SITE_URL },
  icons: { icon: siteConfig.brand.logo, apple: siteConfig.brand.logo },
  // Hors production (preview, build:demo) : jamais indexé.
  robots: IS_PRODUCTION_SITE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { 
    url: SITE_URL, 
    title: PAGE_TITLE, 
    description: seoDescription, 
    type: "website", 
    images: [{ url: "/og-hero.jpg", width: 1200, height: 630 }] 
  },
};

const LANG_BOOT = `(function(){var l;try{l=localStorage.getItem("lang")}catch(e){}if(l!=="fr"&&l!=="en"&&l!=="ar"){var n=(navigator.language||"").slice(0,2);l=n==="ar"?"ar":n==="fr"?"fr":"en"}document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr"})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const phone = siteConfig.contact.phone;
  const brand = BRAND;
  const prices = siteConfig.fleet.cars.map((c: Car) => c.price);
  const priceRange = prices.length ? `${Math.min(...prices)}-${Math.max(...prices)} ${BASE_CURRENCY}` : undefined;
  const { geo, sameAs } = siteConfig.contact;
  const { openingHours, addressCountry, acceptForeignCash } = siteConfig.business;
  const [opens = "00:00", closes = "23:59"] = (openingHours || "").split("-");

  const autoRentalSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${SITE_URL}/#business`,
    name: brand,
    url: SITE_URL,
    telephone: phone,
    image: [`${SITE_URL}${siteConfig.hero.image}`],
    logo: `${SITE_URL}${siteConfig.brand.logo}`,
    description: seoDescription,
    priceRange,
    currenciesAccepted: acceptForeignCash ? `${BASE_CURRENCY}, ${FOREIGN_CURRENCY}` : BASE_CURRENCY,
    ...(paymentAcceptedSchema ? { paymentAccepted: paymentAcceptedSchema } : {}),
    address: { "@type": "PostalAddress", streetAddress: siteConfig.contact.address, addressLocality: siteConfig.seo.city, addressRegion: siteConfig.seo.region, addressCountry },
    geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
    hasMap: siteConfig.contact.googleMapsLink,
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens, closes },
    areaServed: siteConfig.seo.areas.map((name: string) => ({ "@type": "City", name })),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${notoKufi.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(autoRentalSchema).replace(/</g, "\\u003c").replace(/>/g, "\\u003e") }} />
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
