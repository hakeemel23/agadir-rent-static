
import Shell from "@/components/shell"
import Hero from "@/components/hero"
import Fleet from "@/components/fleet"
import TrustStrip from "@/components/trust-strip"
import AirportMeeting from "@/components/AirportMeeting"
import HowItWorks from "@/components/how-it-works"
import Conditions from "@/components/conditions"
import Reviews from "@/components/reviews"
import Faq from "@/components/faq"
import { siteConfig } from "@/data/config"

export default function Home() {
  return (
    <Shell>
      <Hero />
      <Fleet />
      <TrustStrip />
      {siteConfig.booking.airportService && <AirportMeeting />}
      <HowItWorks />
      <Conditions />
      <Reviews />
      <Faq />
    </Shell>
  )
}