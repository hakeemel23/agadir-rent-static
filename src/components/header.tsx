"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { showReviews, siteConfig } from "@/data/config"
import { getWhatsAppLink } from "@/lib/whatsapp"
import { BASE_CURRENCY, nextCurrency } from "@/lib/currency"
import { useBooking } from "@/context/BookingContext"
import { useT } from "@/lib/lang"
import LangSwitcher from "@/components/lang-switcher"

type NavLink = { key: string; href: string };
const LINKS: NavLink[] = [
  { key: "nav.fleet", href: "/#fleet" },
  { key: "nav.conditions", href: "/#conditions" },
  { key: "nav.how", href: "/#how-it-works" },
  { key: "nav.reviews", href: "/#reviews" },
  { key: "nav.faq", href: "/#faq" },
].filter((l) => l.key !== "nav.reviews" || showReviews);

export default function Header() {
  const [open, setOpen] = useState(false)
  const { currency, setCurrency } = useBooking()
  const { lang, t } = useT()
  const brand = `${siteConfig.brand.name} ${siteConfig.brand.nameLight}`.trim()
  const whatsappLink = getWhatsAppLink(lang, { ref: "header-desktop" })
  const whatsappMobile = getWhatsAppLink(lang, { ref: "header-mobile" })
  const phoneCall = siteConfig.contact.phone;
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#faf9f6]/90 backdrop-blur-xl border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight min-w-0">
          <Image src={siteConfig.brand.logo} alt={brand} width={32} height={32} className="rounded-full object-cover shrink-0" />
          <span className="text-[17px] text-zinc-900 truncate">{siteConfig.brand.name}<span className="font-light text-zinc-500">{siteConfig.brand.nameLight}</span></span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map((l: { href: string; key: string }) => (
            <Link key={l.href} href={l.href} className="text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition">{t(l.key)}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            <button type="button" onClick={() => setCurrency(nextCurrency(currency))} className="text-[11px] font-bold tracking-wide border border-zinc-200 rounded-full px-4 py-2 hover:bg-white transition">
              {currency === BASE_CURRENCY ? t("common.showEur") : t("common.showMad")}
            </button>
            <a href={`tel:${phoneCall.replace(/\s+/g, '')}`} className="hidden text-[11px] text-zinc-500 xl:block hover:text-zinc-900"><bdi dir="ltr">{siteConfig.contact.phoneDisplay}</bdi></a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] text-white rounded-full px-5 py-2.5 text-[13px] font-bold hover:bg-black transition">{t("common.whatsapp")}</a>
          </div>
          <LangSwitcher />
          <button type="button" aria-controls="mobile-menu" aria-label={t("common.menu")} aria-expanded={open} onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center">{open ? "✕" : "☰"}</button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label={t("common.menu")} className="lg:hidden border-t border-zinc-100 bg-white px-6 py-4 space-y-3">
          {LINKS.map((l: NavLink) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-[14px] font-medium py-2">{t(l.key)}</Link>
          ))}
          <button type="button" onClick={() => setCurrency(nextCurrency(currency))} className="w-full rounded-full border border-zinc-200 py-2.5 text-[12px] font-bold">{currency === BASE_CURRENCY ? t("common.showEur") : t("common.showMad")}</button>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <a href={`tel:${phoneCall.replace(/\s+/g, '')}`} className="bg-zinc-100 text-zinc-900 rounded-full py-3 text-center text-[14px] font-bold block">{t("common.call")}</a>
            <a href={whatsappMobile} target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] text-white rounded-full py-3 text-center text-[14px] font-bold block">{t("common.whatsapp")}</a>
          </div>
        </nav>
      )}
    </header>
  )
}