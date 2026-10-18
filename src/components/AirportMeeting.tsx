import T from "@/components/t"
import MeetingImage from "@/components/meeting-image"
import { siteConfig } from "@/data/config"

export default function AirportMeeting() {
  const isFree = siteConfig.booking.freeAirportDelivery

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