"use client"
import T from "@/components/t"
import MeetingImage from "@/components/meeting-image"
import { siteConfig } from "@/data/config"
import { useT } from "@/lib/lang"

export default function AirportMeeting() {
  const { t, lang } = useT()
  const isFree = siteConfig.booking.freeAirportDelivery
  // Ville sans aéroport : on liste les aéroports vers lesquels l'agence livre.
  const airports = siteConfig.booking.cityHasAirport ? [] : siteConfig.seo.deliveryAirports

  return (
    <section id="meeting" className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="bg-white rounded-[24px] border border-zinc-100 overflow-hidden grid md:grid-cols-2">
        <div className="p-8 md:p-10">
          <h2 className="text-[22px] font-bold tracking-tight">
            <T k="meeting.title" />
          </h2>
          <p className="text-[13px] text-zinc-500 mt-2 leading-relaxed">
            <T k="meeting.text" />
          </p>
          {airports.length > 0 && (
            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase text-zinc-500">{t("meeting.airportsTitle")}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {airports.map((a) => (
                  <li key={a.code} className="rounded-full border border-zinc-200 bg-[#faf9f6] px-3 py-1.5 text-[12px] font-semibold text-zinc-800">
                    ✈️ {lang === "ar" ? a.nameAr : a.name} <bdi dir="ltr" className="text-zinc-500">({a.code})</bdi>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ul className="mt-5 space-y-2 text-[13px] text-zinc-700">
            <li><T k="meeting.item1" /></li>
            <li><T k={isFree ? "meeting.item2Free" : "meeting.item2Paid"} /></li>
            <li><T k="meeting.item3" /></li>
          </ul>
        </div>
        <div className="relative h-[260px] md:h-auto">
          <MeetingImage />
        </div>
      </div>
    </section>
  )
}