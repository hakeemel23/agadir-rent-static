"use client"
import { getWhatsAppLink } from "@/lib/whatsapp"
import { useT } from "@/lib/lang"
import { useBooking } from "@/context/BookingContext"
import { fmtDate } from "@/lib/dates"
import { LOCALES } from "@/lib/i18n"

export default function WaCta({ source, className = "" }: { source: string; className?: string }) {
  const { lang, t, tn } = useT()
  const { location, pickup, ret, days } = useBooking()
  const locale = LOCALES[lang]

  const link = getWhatsAppLink(lang, {
    pickupDate: pickup ? fmtDate(pickup, locale) : undefined,
    returnDate: ret ? fmtDate(ret, locale) : undefined,
    location: t(`locations.${location}`),
    days: days > 0 ? tn("common.days", days) : undefined,
    ref: source,
  })

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className={className}>
      {t("landing.book")}
    </a>
  )
}