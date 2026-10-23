"use client"
import { getWhatsAppLink } from "@/lib/whatsapp"
import { useT } from "@/lib/lang"
import { useBooking } from "@/context/BookingContext"
import { fmtDate } from "@/lib/dates"
import { LOCALES } from "@/lib/i18n"
import { siteConfig, type LocationId } from "@/data/config"

type WaCtaProps = {
  source: string
  className?: string
  defaultLocation?: LocationId
  car?: string
  pricePerDay?: number
  children?: React.ReactNode
}

export default function WaCta({ source, className = "", defaultLocation, car, pricePerDay, children }: WaCtaProps) {
  const { lang, t, tn } = useT()
  const { location, pickup, ret, days } = useBooking()
  const locale = LOCALES[lang]

  const effectiveLocation =
    defaultLocation && siteConfig.booking.locations.includes(defaultLocation)
      ? defaultLocation
      : location

  const link = getWhatsAppLink(lang, {
    car,
    pricePerDay,
    total: days > 0 && pricePerDay ? pricePerDay * days : undefined,
    pickupDate: pickup ? fmtDate(pickup, locale) : undefined,
    returnDate: ret ? fmtDate(ret, locale) : undefined,
    location: t(`locations.${effectiveLocation}`),
    days: days > 0 ? tn("common.days", days) : undefined,
    ref: source,
  })

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className={className}>
      {children ?? t("landing.book")}
    </a>
  )
}