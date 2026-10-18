"use client"
import { getWhatsAppLink } from "@/lib/whatsapp"
import { useT } from "@/lib/lang"
import { useBooking } from "@/context/BookingContext"
import { fmtDate } from "@/lib/dates"
import { LOCALES } from "@/lib/i18n"

export default function WhatsAppBar() {
  const { lang, t, tn } = useT()
  const { location, pickup, ret, days } = useBooking()
  const link = getWhatsAppLink(lang, {
    pickupDate: pickup ? fmtDate(pickup, LOCALES[lang]) : undefined,
    returnDate: ret ? fmtDate(ret, LOCALES[lang]) : undefined,
    location: t(`locations.${location}`),
    days: days ? tn("common.days", days) : undefined,
    ref: "sticky-bar",
  })

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-zinc-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <div>
        <p className="text-[14px] font-bold">{t("bar.title")}</p>
        <p className="text-[12px] text-zinc-600">{t("bar.text")}</p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#15803d] px-5 py-3 text-[14px] font-bold text-white transition hover:bg-[#166534]"
      >
        {t("common.whatsapp")}
      </a>
    </div>
  )
}