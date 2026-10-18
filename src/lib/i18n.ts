import { DEFAULT_LANG, translations, type Lang } from "@/data/translations"

export type Vars = Record<string, string | number>

export const LOCALES: Record<Lang, string> = { fr: "fr-FR", en: "en-GB", ar: "ar-MA" }

function lookup(dict: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => {
    if (o && typeof o === "object") return (o as Record<string, unknown>)[k]
    return undefined
  }, dict)
}

function fill(s: string, vars?: Vars): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, n: string) => (n in vars ? String(vars[n]) : `{${n}}`))
}

export function tr(lang: Lang, path: string, vars?: Vars): string {
  let v = lookup(translations[lang], path)
  if (typeof v !== "string") v = lookup(translations[DEFAULT_LANG], path)
  if (typeof v !== "string") {
    if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
      console.warn(`i18n: missing key "${path}"`)
    }
    return path
  }
  return fill(v, vars)
}

function pluralCategory(lang: Lang, n: number): "one" | "two" | "few" | "other" {
  if (n === 1) return "one"
  if (lang === "ar") {
    if (n === 2) return "two"
    if (n >= 3 && n <= 10) return "few"
  }
  return "other"
}

export function trn(lang: Lang, path: string, n: number): string {
  let forms = lookup(translations[lang], path)
  if (!forms || typeof forms !== "object") forms = lookup(translations[DEFAULT_LANG], path)
  if (!forms || typeof forms !== "object") return path
  const f = forms as Record<string, string>
  return fill(f[pluralCategory(lang, n)] ?? f.other ?? path, { n })
}