const pad = (n: number) => String(n).padStart(2, "0")

export function toISO(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

export function todayInZone(timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date())
    const get = (type: string) => parts.find((p) => p.type === type)?.value
    const y = get("year"), m = get("month"), d = get("day")
    if (y && m && d) return `${y}-${m}-${d}`
  } catch (e) {
    console.warn("Timezone fallback:", e)
  }
  return toISO(new Date())
}

export function fromISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
}

export function fmtDate(d: string | Date, locale: string): string {
  const date = typeof d === "string" ? fromISO(d) : d
  if (isNaN(date.getTime())) return ""
  return date.toLocaleDateString(locale, { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" })
}

export function daysBetween(a: string, b: string): number {
  const dateA = fromISO(a).getTime()
  const dateB = fromISO(b).getTime()
  if (isNaN(dateA) || isNaN(dateB)) return 0
  const diff = dateB - dateA
  return Math.max(1, Math.round(diff / 86400000))
}

export function addDaysISO(value: string, days: number): string {
  const date = fromISO(value)
  date.setUTCDate(date.getUTCDate() + days)
  return toISO(date)
}