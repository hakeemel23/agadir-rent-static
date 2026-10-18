import { siteConfig } from "@/data/config"
import T from "@/components/t"

export default function TrustStrip() {
  return (
    <section className="bg-white border-y border-zinc-100 py-6">
      <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-4 gap-4 text-[12px]">
        <div className="flex gap-3 items-start">
          <span className="text-[20px]" aria-hidden="true">📄</span>
          <div>
            <p className="font-bold text-zinc-900"><T k="trust.contractTitle" /></p>
            <p className="text-zinc-500"><T k="trust.contractText" /></p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-[20px]" aria-hidden="true">💰</span>
          <div>
            <p className="font-bold text-zinc-900"><T k="trust.priceTitle" /></p>
            <p className="text-zinc-500"><T k="trust.priceText" /></p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-[20px]" aria-hidden="true">📍</span>
          <div>
            <p className="font-bold text-zinc-900"><T k="trust.meetingTitle" /></p>
            <a href={siteConfig.contact.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              <T k="trust.meetingLink" />
            </a>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-[20px]" aria-hidden="true">💬</span>
          <div>
            <p className="font-bold text-zinc-900"><T k="trust.whatsappTitle" /></p>
            <p className="text-zinc-500"><T k="trust.whatsappText" /></p>
          </div>
        </div>
      </div>
    </section>
  )
}