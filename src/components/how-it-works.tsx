"use client"
import { translations } from "@/data/translations"
import { useLang } from "@/lib/lang"

export default function HowItWorks() {
  const lang = useLang();
  const how = translations[lang].how || translations.fr.how;

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[32px] font-black text-zinc-900">{how.title}</h2>
        <p className="text-zinc-500 mt-2">{how.subtitle}</p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {how.steps.map((step, i) => (
            <div key={i} className="bg-[#faf9f6] border border-zinc-100 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[14px] mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-[15px] text-zinc-900">{step.title}</h3>
              <p className="text-[13px] text-zinc-500 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}