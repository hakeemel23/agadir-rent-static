"use client"
import { useState, useRef, useEffect } from "react"
import { LANGS, type Lang } from "@/data/translations"
import { useLang, setLang as saveLang, useT } from "@/lib/lang"

const LABELS: Record<Lang, string> = {
  fr: "FR",
  en: "EN",
  ar: "العربية",
}

export default function LangSwitcher() {
  const currentLang = useLang()
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const changeLang = (newLang: Lang) => {
    saveLang(newLang)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`${t("lang.label")} ${LABELS[currentLang]}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 text-[12px] font-bold text-zinc-700 hover:border-zinc-300"
      >
        <span>{LABELS[currentLang]}</span>
        <span className="text-[10px] opacity-60">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[44px] z-40 min-w-[140px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl rtl:left-0 rtl:right-auto">
          {LANGS.map((l: Lang) => (
            <button
              key={l}
              type="button"
              onClick={() => changeLang(l)}
              aria-current={currentLang === l}
              className={`flex w-full items-center justify-between px-4 py-3 text-start text-[13px] transition hover:bg-zinc-50 ${
                currentLang === l ? "bg-zinc-900 text-white hover:bg-zinc-900" : "text-zinc-700"
              }`}
            >
              <span className="font-medium">{t(`lang.${l}`)}</span>
              {currentLang === l && <span className="text-[12px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}