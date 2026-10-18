import { showReviews, siteConfig } from "@/data/config"
import T from "@/components/t"

export default function Reviews() {
  if (!showReviews) return null
  return (
    <section id="reviews" className="py-16 bg-[#faf9f6]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[32px] font-black text-zinc-900"><T k="reviews.title" /></h2>
        <p className="text-zinc-500 mt-2"><T k="reviews.subtitle" /></p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {siteConfig.reviews.items.map((r, i) => (
            <div key={r.name + i} className="bg-white border border-zinc-200 rounded-2xl p-5">
              <p className="font-bold text-[14px] text-zinc-900">{r.name}</p>
              <p lang={r.lang} dir="auto" className="text-[13px] text-zinc-600 mt-3 leading-relaxed">&quot;{r.text}&quot;</p>
              <p aria-label={`${r.rating} / 5`} className="text-[11px] text-amber-500 mt-3">
                  {"★".repeat(Math.max(1, Math.min(5, Math.round(r.rating || 5))))}
              </p>
            </div>
          ))}
        </div>

        {siteConfig.reviews.googleMapsLink && siteConfig.reviews.googleMapsLink !== "CHANGE-ME" && (
          <div className="text-center mt-8">
            <a href={siteConfig.reviews.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3 text-[13px] font-bold text-zinc-800 hover:border-zinc-900 transition">
              <T k="reviews.cta" /> <span className="inline-block rtl:rotate-180">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}