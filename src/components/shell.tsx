import type { ReactNode } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppBar from "@/components/whatsapp-bar"

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="min-h-screen bg-[#faf9f6] pb-[84px] md:pb-0">
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppBar />
    </div>
  )
}