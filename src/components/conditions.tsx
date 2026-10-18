"use client"
import { siteConfig } from "@/data/config"
import { translations } from "@/data/translations"
import { useLang } from "@/lib/lang"

const card = "bg-white rounded-2xl p-6 border border-zinc-200"
const list = "text-[13px] text-zinc-600 space-y-2"

export default function Conditions() {
  const lang = useLang();
  const c = translations[lang].conditions || translations.fr.conditions;
  const paymentLast = siteConfig.booking.withCaution ? c.payment.deposit : c.payment.noDeposit;

  return (
    <section id="conditions" className="py-16 bg-[#faf9f6]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[32px] font-black mb-8">{c.title}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className={card}>
            <h3 className="font-bold text-[14px] mb-3">{c.included.title}</h3>
            <ul className={list}>
              {c.included.items.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
          <div className={card}>
            <h3 className="font-bold text-[14px] mb-3">{c.excluded.title}</h3>
            <ul className={list}>
              {c.excluded.items.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
          <div className={card}>
            <h3 className="font-bold text-[14px] mb-3">{c.documents.title}</h3>
            <ul className={list}>
              {c.documents.items.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
          <div className={card}>
            <h3 className="font-bold text-[14px] mb-3">{c.payment.title}</h3>
            <ul className={list}>
              {c.payment.items.map((item, i) => <li key={i}>• {item}</li>)}
              <li>• {paymentLast}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}