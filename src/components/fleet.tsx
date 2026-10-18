"use client"
import Image from "next/image"
import { useMemo, useState } from "react"
import { siteConfig, type Car, type CarCategory } from "@/data/config"
import { useBooking } from "@/context/BookingContext"
import { BASE_CURRENCY, formatPrice, formatPriceDual, formatTotal } from "@/lib/currency"
import { fmtDate } from "@/lib/dates"
import { LOCALES } from "@/lib/i18n"
import { getWhatsAppLink } from "@/lib/whatsapp"
import { useT } from "@/lib/lang"

export default function Fleet() {
  const { t, tn, lang } = useT()
  const { location, pickup, ret, days, currency } = useBooking()
  const [cat, setCat] = useState<CarCategory | "all">("all")
  const locale = LOCALES[lang]

  const availableCategories = ["all", ...Array.from(new Set(siteConfig.fleet.cars.map((c: Car) => c.category)))];

  const filtered = useMemo(() => {
    if (cat === "all") return siteConfig.fleet.cars
    return siteConfig.fleet.cars.filter((c: Car) => c.category === cat)
  }, [cat])

  return (
    <section id="fleet" className="bg-white px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-black leading-none">{t("fleet.title")}</h2>
            <p className="mt-2 text-[14px] text-zinc-600">{t("fleet.subtitle")}</p>
          </div>
          <div className="flex gap-2 overflow-auto pb-1 scrollbar-hide">
            {availableCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c as CarCategory | "all")}
                aria-pressed={cat === c}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-[12px] font-bold transition ${cat === c ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"}`}
              >
                {t(`fleet.categories.${c}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((car: Car) => {
            const dual = formatPriceDual(car.price)
            const totalMad = car.price * (days || 0)
            const dualTotal = formatPriceDual(totalMad)
            const waLink = getWhatsAppLink(lang, {
              car: car.name,
              pickupDate: pickup ? fmtDate(pickup, locale) : undefined,
              returnDate: ret ? fmtDate(ret, locale) : undefined,
              location: t(`locations.${location}`),
              days: days > 0 ? tn("common.days", days) : undefined,
              pricePerDay: car.price,
              total: days > 0 ? totalMad : undefined,
              ref: `fleet-${car.id}`,
            })

            return (
              <div key={car.id} className="overflow-hidden rounded-[24px] border border-zinc-200 bg-[#faf9f6]">
                <div className="relative aspect-[16/10] bg-white">
                  <Image src={car.image} alt={car.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-4" />
                  {car.popular && <span className="absolute start-4 top-4 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold text-white">{t("fleet.popular")}</span>}
                  <span className="absolute end-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-bold border border-zinc-100">{car.auto ? t("fleet.auto") : t("fleet.manual")} • {t("fleet.seats", { n: car.seats })}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-[18px] font-bold leading-tight">{car.name}</h3>
                  <p className="mt-1 text-[12px] text-zinc-500">{car.fuel === "diesel" ? t("fleet.diesel") : t("fleet.petrol")}</p>
                  <div className="mt-4 flex items-baseline justify-between">
                    <div className="flex flex-col">
                      <span className="text-[20px] font-black leading-none">{formatPrice(car.price, currency)}</span>
                      <span className="mt-1 text-[11px] text-zinc-500">{currency === BASE_CURRENCY ? dual.foreign : `~${dual.base}`} {t("common.perDay")}</span>
                    </div>
                    {days > 1 && (
                      <div className="text-end">
                        <div className="text-[13px] font-semibold">{formatTotal(car.price, days, currency)}</div>
                        <div className="text-[11px] text-zinc-500">{currency === BASE_CURRENCY ? dualTotal.foreign : `~${dualTotal.base}`} • {tn("common.days", days)}</div>
                      </div>
                    )}
                  </div>
                  {days > 0 && (siteConfig.booking.advancePaymentDh !== null || siteConfig.booking.freeCancellation) && (
                    <p className="mt-3 text-[11px] font-medium text-emerald-700">
                      {[
                        siteConfig.booking.advancePaymentDh !== null ? t("fleet.advance", { amount: formatPrice(siteConfig.booking.advancePaymentDh, BASE_CURRENCY) }) : null,
                        siteConfig.booking.freeCancellation ? t("fleet.freeCancel") : null,
                      ].filter(Boolean).join(" • ")}
                    </p>
                  )}
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center rounded-full bg-zinc-900 py-3 text-[14px] font-bold text-white hover:bg-black transition">
                    {t("fleet.book")} <span className="inline-block ms-1 rtl:rotate-180">→</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-6 text-center text-[11px] text-zinc-500">{t("fleet.note")}</p>
      </div>
    </section>
  )
}