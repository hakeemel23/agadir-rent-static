import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { landings, type Landing } from "@/data/landings"
import { SITE_URL, siteConfig, type Car, type LocationId } from "@/data/config"
import { translations } from "@/data/translations"
import { formatPriceDual } from "@/lib/currency"
import Shell from "@/components/shell"
import T from "@/components/t"
import WaCta from "@/components/wa-cta"

export const dynamicParams = false;

export function generateStaticParams() {
  return landings.map((l: Landing) => ({ slug: l.slug }))
}

type Props = { params: Promise<{ slug: string }> }
const brand = `${siteConfig.brand.name} ${siteConfig.brand.nameLight}`.trim()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const l = landings.find((x: Landing) => x.slug === slug)
  if (!l) return {}
  const title = `${l.title} | ${brand}`
  const canonicalUrl = `${SITE_URL}/${l.slug}`

  return { 
    title, 
    description: l.description, 
    alternates: { canonical: canonicalUrl }, 
    openGraph: { 
      title, 
      description: l.description, 
      url: canonicalUrl, 
      type: "website", 
      images: [{ url: "/og-hero.jpg", width: 1200, height: 630 }] 
    } 
  }
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params
  const l = landings.find((x: Landing) => x.slug === slug)
  if (!l) notFound()

  type LandingKey = keyof typeof translations.fr.landings
  const pointCount = translations.fr.landings[l.id as LandingKey].points.length
  const landingLocation: LocationId =
    l.id === "nearby" ? "nearby" : l.id === "deposit" ? "city" : (siteConfig.booking.locations[0] ?? "city")

  return (
    <Shell>
      <section className="mx-auto max-w-[900px] px-6 py-12">
        <h1 className="text-[34px] font-black"><T k={`landings.${l.id}.h1`} /></h1>
        <p className="mt-4 text-[15px]"><T k={`landings.${l.id}.intro`} /></p>
        <ul className="mt-6 space-y-2 text-[14px]">
          {Array.from({ length: pointCount }).map((_, i) => (
            <li key={i}>✓ <T k={`landings.${l.id}.points.${i}`} /></li>
          ))}
        </ul>
        <h2 className="mt-10 text-[22px] font-black"><T k="landing.carsTitle" /></h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {siteConfig.fleet.cars.map((c: Car) => {
            const dual = formatPriceDual(c.price)
            return (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-14 w-20 shrink-0 rounded-xl bg-[#faf9f6]">
                    <Image src={c.image} alt={c.name} fill sizes="80px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate text-[14px] font-bold text-zinc-900">{c.name}</span>
                    <span className="block text-[11px] text-zinc-500">
                      <T k={c.auto ? "fleet.auto" : "fleet.manual"} /> • <T k="fleet.seats" vars={{ n: c.seats }} />
                    </span>
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <span className="block text-[13px] font-bold">{dual.base} <T k="common.perDay" /></span>
                  <span className="block text-[11px] text-zinc-500">{dual.foreign} <T k="common.perDay" /></span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <WaCta
            source={`landing-${l.slug}`}
            defaultLocation={landingLocation}
            className="rounded-full bg-[#15803d] px-6 py-3 text-[14px] font-bold text-white transition hover:bg-[#166534]"
          />
          <Link href="/#fleet" className="rounded-full border px-6 py-3 text-[14px] font-bold">
            <T k="landing.seeFleet" />
          </Link>
        </div>
      </section>
    </Shell>
  )
}