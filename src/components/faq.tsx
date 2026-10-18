"use client"
import { useState } from "react"
import { faqKeys } from "@/data/config"
import { useT } from "@/lib/lang"

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { t } = useT()

  return (
    <section id="faq" className="bg-white py-16">
      <div className="mx-auto max-w-[800px] px-6">
        <h2 className="text-center text-[32px] font-black text-zinc-900">{t("faq.title")}</h2>
        <p className="mt-2 text-center text-[14px] text-zinc-500">{t("faq.subtitle")}</p>
        <div className="mt-8 space-y-3">
          {faqKeys.map((k, i) => {
            const isOpen = open === i
            return (
              <div key={k} className="rounded-2xl border border-zinc-200 bg-[#faf9f6]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${k}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-start"
                >
                  <span className="pe-4 text-[14px] font-semibold text-zinc-900">{t(`faq.${k}.q`)}</span>
                  <span className="shrink-0 text-[18px] text-zinc-400">{isOpen ? "−" : "+"}</span>
                </button>
                <div
                  id={`faq-answer-${k}`}
                  className={`px-5 pb-5 text-[13px] leading-relaxed text-zinc-600 ${isOpen ? "block" : "hidden"}`}
                >
                  {t(`faq.${k}.a`)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}