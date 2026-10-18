"use client"
import { useSyncExternalStore } from "react"
import { DEFAULT_LANG, type Lang } from "@/data/translations"
import { tr, trn } from "./i18n"

let currentLang: Lang = DEFAULT_LANG
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): Lang {
  return currentLang
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG
}

if (typeof window !== "undefined") {
  let stored: Lang | null = null
  try {
    stored = localStorage.getItem("lang") as Lang
  } catch {}

  if (stored === "fr" || stored === "en" || stored === "ar") {
    currentLang = stored
  } else {
    const nav = (navigator.language || "").slice(0, 2)
    currentLang = nav === "ar" ? "ar" : nav === "fr" ? "fr" : "en"
  }
  document.documentElement.lang = currentLang
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr"

  window.addEventListener("storage", (e) => {
    if (e.key === "lang" && e.newValue) {
      const l = e.newValue as Lang
      if (l === "fr" || l === "en" || l === "ar") {
        currentLang = l
        document.documentElement.lang = l
        document.documentElement.dir = l === "ar" ? "rtl" : "ltr"
        listeners.forEach((fn) => fn())
      }
    }
  })
}

export function setLang(lang: Lang) {
  currentLang = lang
  if (typeof window !== "undefined") {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    try {
      localStorage.setItem("lang", lang)
    } catch {}
  }
  listeners.forEach((fn) => fn())
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useT() {
  const lang = useLang()
  return {
    lang,
    t: (path: string, vars?: Record<string, string | number>) => tr(lang, path, vars),
    tn: (path: string, n: number) => trn(lang, path, n)
  }
}