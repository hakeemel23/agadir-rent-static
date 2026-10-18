import { BRAND, siteConfig } from "@/data/config"
import { type Lang, DEFAULT_LANG } from "@/data/translations"
import { tr } from "@/lib/i18n"
import { BASE_CURRENCY, formatPrice } from "@/lib/currency"

type WhatsAppData = {
  car?: string
  pickupDate?: string
  returnDate?: string
  location?: string
  days?: string
  pricePerDay?: number
  total?: number
  ref?: string
}

function getT(lang: string) {
  const l = (["fr", "en", "ar"].includes(lang) ? lang : DEFAULT_LANG) as Lang
  return (k: string, vars?: Record<string, string | number>) => tr(l, k, vars)
}

export function getWhatsAppMessage(lang: string, data: WhatsAppData): string {
  const t = getT(lang)
  const lines: string[] = []

  lines.push(t("wa.hello", { brand: BRAND }))
  lines.push("")
  if (data.car) lines.push(t("wa.car", { car: data.car }))

  if (data.pickupDate && data.returnDate) {
    lines.push(t("wa.dates", { from: data.pickupDate, to: data.returnDate }))
  } else if (data.pickupDate) {
    lines.push(t("wa.date", { date: data.pickupDate }))
  } else if (data.returnDate) {
    lines.push(t("wa.date", { date: data.returnDate }))
  }

  if (data.location) lines.push(t("wa.place", { place: data.location }))
  if (data.days) lines.push(t("wa.duration", { duration: data.days }))
  if (data.pricePerDay) lines.push(t("wa.price", { price: formatPrice(data.pricePerDay, BASE_CURRENCY) }))
  if (data.total && data.days) lines.push(t("wa.total", { total: formatPrice(data.total, BASE_CURRENCY) }))

  lines.push("")
  lines.push(t("wa.ask"))
  lines.push(t("wa.thanks"))
  if (data.ref) {
    lines.push("")
    lines.push(`_Ref: ${data.ref}_`)
  }
  return lines.join("\n")
}

export function getWhatsAppLink(lang: string, data: WhatsAppData): string {
  const message = getWhatsAppMessage(lang, data)
  const phone = siteConfig.contact.whatsapp.replace(/\D/g, "")
  const safeMessage = Array.from(message).slice(0, 1500).join("")

  return `https://wa.me/${phone}?text=${encodeURIComponent(safeMessage)}`
}