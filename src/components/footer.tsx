import Image from "next/image"
import Link from "next/link"
import { showReviews, siteConfig } from "@/data/config"
import { landings, type Landing } from "@/data/landings"
import T from "@/components/t"

type NavLink = { key: string; href: string };

const NAV: NavLink[] = [
  { key: "nav.fleet", href: "/#fleet" },
  { key: "nav.conditions", href: "/#conditions" },
  { key: "nav.reviews", href: "/#reviews" },
].filter((l) => l.key !== "nav.reviews" || showReviews)

const INFO: NavLink[] = [
  { key: "nav.how", href: "/#how-it-works" },
  ...(siteConfig.booking.hasAirport ? [{ key: "meeting.title", href: "/#meeting" }] : []),
  { key: "nav.faq", href: "/#faq" },
]

const hostOf = (url: string) => {
  try { return new URL(url).hostname } catch { return url }
}

export default function Footer() {
  const brand = `${siteConfig.brand.name} ${siteConfig.brand.nameLight}`.trim()
  const phoneCall = siteConfig.contact.phone;
  const socials = siteConfig.contact.sameAs || []

  return (
    <footer className="bg-[#111] text-zinc-400 py-12">
      <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src={siteConfig.brand.logo} alt={brand} width={32} height={32} className="rounded-full bg-white p-[3px]" />
            <span className="font-black text-white tracking-tight">
              {siteConfig.brand.name}
              <span className="font-light">{siteConfig.brand.nameLight}</span>
            </span>
          </Link>
          <p className="text-[13px] mt-4 leading-relaxed">
            <T k="footer.description" />
          </p>
          {socials.length > 0 && (
            <div className="flex gap-2 mt-5">
              {socials.map((url) => {
                const isFb = url.includes("facebook")
                const isIg = url.includes("instagram")
                const isTk = url.includes("tiktok")
                const label = isFb ? "FB" : isIg ? "IG" : isTk ? "TK" : "↗"
                const name = isFb ? "Facebook" : isIg ? "Instagram" : isTk ? "TikTok" : hostOf(url)
                return (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[11px] font-bold hover:bg-white hover:text-black transition"
                  >
                    {label}
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-white font-bold text-[13px] mb-3">
            <T k="footer.navTitle" />
          </h2>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="block text-[13px] py-1 hover:text-white">
              <T k={l.key} />
            </Link>
          ))}
          {landings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-1">
              {landings.map((l: Landing) => (
                <Link key={l.slug} href={`/${l.slug}`} className="block text-[12px] py-1 hover:text-white">
                  <T k={`landings.${l.id}.footerLabel`} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-white font-bold text-[13px] mb-3">
            <T k="footer.infoTitle" />
          </h2>
          {INFO.map((l) => (
            <Link key={l.href} href={l.href} className="block text-[13px] py-1 hover:text-white">
              <T k={l.key} />
            </Link>
          ))}
        </div>

        <div>
          <h2 className="text-white font-bold text-[13px] mb-3">
            <T k="footer.contactTitle" />
          </h2>
          <p className="text-[13px]">
            <a href={`tel:${phoneCall.replace(/\s+/g, '')}`} className="hover:text-white">
              <bdi dir="ltr">{siteConfig.contact.phoneDisplay}</bdi>
            </a>
          </p>
          <p className="text-[13px] mt-1">{siteConfig.contact.address}</p>
          <a href={siteConfig.contact.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-[12px] underline mt-2 inline-block hover:text-white">
            <T k="footer.seeMap" />
          </a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 mt-10 pt-6 border-t border-zinc-800 text-[11px] text-center">
        <T k="footer.rights" vars={{ year: siteConfig.website.contentUpdated.substring(0, 4), brand }} />
      </div>
    </footer>
  )
}