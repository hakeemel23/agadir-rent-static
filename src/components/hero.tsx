"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { siteConfig, type Car, type LocationId } from "@/data/config"
import { getWhatsAppLink } from "@/lib/whatsapp"
import { useBooking } from "@/context/BookingContext"
import { formatPrice, BASE_CURRENCY } from "@/lib/currency"
import { addDaysISO, fmtDate, todayInZone } from "@/lib/dates"
import { LOCALES } from "@/lib/i18n"
import { useT } from "@/lib/lang"

type DPProps = { value: string; onChange: (v: string) => void; placeholder: string; minDate?: string; disabledMessage?: string }

function DatePicker({ value, onChange, placeholder, minDate, disabledMessage }: DPProps) {
  const { lang, t } = useT()
  const locale = LOCALES[lang]
  const weekdays = t("calendar.weekdays").split(",")
  const [open, setOpen] = useState(false)

  const monthOf = (iso: string) => { const [y, m] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, 1)) }
  const base = () => (value ? monthOf(value) : minDate ? monthOf(minDate) : new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)))
  const [month, setMonth] = useState<Date>(base)
  const y = month.getUTCFullYear()
  const m = month.getUTCMonth()
  const offset = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7
  const count = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <div className="relative">
      <button 
        type="button" 
        disabled={!!disabledMessage} 
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => { if (!open) setMonth(base()); setOpen(!open) }} 
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-start text-[14px] disabled:opacity-50"
      >
        {value ? fmtDate(value, locale) : placeholder}
      </button>
      {disabledMessage && <p className="mt-1 text-[11px] text-zinc-500">{disabledMessage}</p>}
      {open && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <div 
            role="dialog" 
            aria-modal="true" 
            aria-label={placeholder}
            className="fixed left-1/2 top-1/2 z-[70] w-[92vw] max-w-[340px] max-h-[90dvh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-zinc-200 bg-white p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <button type="button" aria-label={t("calendar.prev")} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-zinc-100" onClick={() => setMonth(new Date(Date.UTC(y, m - 1, 1)))}><span className="inline-block rtl:rotate-180">‹</span></button>
              <span className="text-[14px] font-bold capitalize" aria-live="polite">{month.toLocaleDateString(locale, { timeZone: "UTC", month: "long", year: "numeric" })}</span>
              <button type="button" aria-label={t("calendar.next")} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-zinc-100" onClick={() => setMonth(new Date(Date.UTC(y, m + 1, 1)))}><span className="inline-block rtl:rotate-180">›</span></button>
            </div>
            <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-medium text-zinc-500" aria-hidden="true">{weekdays.map((d: string, i: number) => <span key={i} className="py-1">{d}</span>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: offset }, (_: unknown, i: number) => <div key={`e${i}`} />)}
              {Array.from({ length: count }, (_: unknown, i: number) => {
                const dateObj = new Date(Date.UTC(y, m, i + 1));
                const iso = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(2, "0")}`;
                const disabled = minDate ? iso < minDate : false
                const isSelected = value === iso
                const fullDateAria = dateObj.toLocaleDateString(locale, { timeZone: "UTC", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                
                return (
                  <button 
                    key={iso} 
                    type="button" 
                    disabled={disabled} 
                    aria-pressed={isSelected} 
                    aria-label={fullDateAria}
                    onClick={() => { onChange(iso); setOpen(false) }} 
                    className={`h-10 rounded-full text-[13px] font-medium transition ${isSelected ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"} disabled:opacity-30`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <button type="button" onClick={() => setOpen(false)} className="mt-4 w-full rounded-full bg-zinc-100 py-2.5 text-[13px] font-semibold">{t("common.close")}</button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Hero() {
  const { location, setLocation, pickup, setPickup, ret, setReturn, days, currency } = useBooking()
  const { lang, t, tn } = useT()
  const [selectedCar, setSelectedCar] = useState<string>("")
  const minPrice = siteConfig.fleet.cars.length > 0 ? Math.min(...siteConfig.fleet.cars.map((c: Car) => c.price)) : 0;
  const todayISO = todayInZone(siteConfig.business.timezone)
  const locale = LOCALES[lang]

  const features = [
    ...(!siteConfig.booking.withCaution ? ["hero.features.noDeposit"] : []),
    ...(siteConfig.booking.unlimitedKm ? ["hero.features.unlimitedKm"] : []),
    ...(siteConfig.booking.hasAirport && siteConfig.booking.freeAirportDelivery ? ["hero.features.freeAirport"] : []),
  ];

  const hasDates = !!(pickup && ret)
  const hasCar = !!selectedCar
  const carObj = siteConfig.fleet.cars.find((c: Car) => c.id === selectedCar)

  const directLink = getWhatsAppLink(lang, {
    car: carObj?.name,
    pickupDate: pickup ? fmtDate(pickup, locale) : undefined,
    returnDate: ret ? fmtDate(ret, locale) : undefined,
    location: t(`locations.${location}`),
    days: days > 0 ? tn("common.days", days) : undefined,
    pricePerDay: carObj?.price,
    total: days > 0 && carObj ? carObj.price * days : undefined,
    ref: hasDates && hasCar ? "hero-whatsapp-direct" : "hero-search",
  })

  const handleMainCta = () => {
    if (hasDates && hasCar) {
      window.open(directLink, "_blank", "noopener,noreferrer")
    } else {
      document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative bg-[#faf9f6]">
      <div className="relative aspect-video w-full md:absolute md:inset-0 md:aspect-auto">
        <Image src={siteConfig.hero.image} alt={t("hero.imageAlt")} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/60 to-transparent md:block rtl:bg-gradient-to-l" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-6 py-8 md:min-h-[640px] md:py-14">
        <div className="md:max-w-[520px]">
          <div className="mb-4 flex flex-wrap gap-2">
            {siteConfig.booking.hasAirport && (
              <span className="rounded-full border bg-white px-3 py-1 text-[11px]">{t("hero.airportBadge")}</span>
            )}
            <span className="rounded-full border bg-white px-3 py-1 text-[11px] font-bold">{t("hero.priceBadge", { price: formatPrice(minPrice, currency) })}</span>
          </div>
          <h1 className="text-[36px] font-black leading-[0.95] md:text-[44px]">
            {t("hero.title")}<br />
            <span className="text-zinc-500">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mt-4 text-[14px] text-zinc-700">{t("hero.description")}</p>
          <div className="mt-3 flex flex-wrap gap-2">{features.map((f: string) => <span key={f} className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] text-white">{t(f)}</span>)}</div>

          <div className="mt-8 rounded-[22px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-2 block text-[11px] font-semibold uppercase">{t("hero.location")}</label>
                <select aria-label={t("hero.location")} value={location} onChange={(e) => setLocation(e.target.value as LocationId)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[14px] font-medium">
                  {siteConfig.booking.locations.map((l: string) => <option key={l} value={l}>{t(`locations.${l}`)}</option>)}
                </select>
              </div>
              <div><span className="mb-2 block text-[11px] font-semibold uppercase">{t("hero.pickup")}</span><DatePicker value={pickup} onChange={setPickup} placeholder={t("hero.pickupPlaceholder")} minDate={todayISO} /></div>
              <div><span className="mb-2 block text-[11px] font-semibold uppercase">{t("hero.return")}</span><DatePicker value={ret} onChange={setReturn} placeholder={t("hero.returnPlaceholder")} minDate={pickup ? addDaysISO(pickup, 1) : todayISO} disabledMessage={!pickup ? t("hero.pickFirst") : undefined} /></div>
              <div className="col-span-2">
                <label className="mb-2 block text-[11px] font-semibold uppercase">{t("hero.carOptional")}</label>
                <select aria-label={t("hero.carOptional")} value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[14px] font-medium">
                  <option value="">{t("hero.chooseCar")}</option>
                  {siteConfig.fleet.cars.map((c: Car) => <option key={c.id} value={c.id}>{c.name} - {formatPrice(c.price, currency)} {t("common.perDay")}</option>)}
                </select>
              </div>
            </div>
            <button type="button" onClick={handleMainCta} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] py-4 text-[15px] font-bold text-white hover:bg-black transition">
              {hasDates && hasCar ? t("hero.waCta") : t("hero.cta")}
              {days > 0 ? ` • ${tn("common.days", days)}` : ""} <span className="inline-block ms-1 rtl:rotate-180">→</span>
            </button>
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              {[
                siteConfig.booking.advancePaymentDh !== null ? t("fleet.advance", { amount: formatPrice(siteConfig.booking.advancePaymentDh, BASE_CURRENCY) }) : null,
                siteConfig.booking.freeCancellation ? t("fleet.freeCancel") : null,
                t("hero.reply")
              ].filter(Boolean).join(" • ")}
            </p>
            <a href={directLink} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-[12px] text-zinc-600 underline hover:text-zinc-900">{t("hero.direct")}</a>
          </div>
        </div>
      </div>
    </section>
  )
}