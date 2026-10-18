"use client"
import Image from "next/image"
import { siteConfig } from "@/data/config"
import { useT } from "@/lib/lang"

export default function MeetingImage() {
  const { t } = useT()
  return (
    <Image 
      src={siteConfig.contact.meetingPointPhoto} 
      alt={t("meeting.imageAlt")} 
      fill 
      sizes="(max-width: 768px) 100vw, 50vw" 
      className="object-cover"
    />
  )
}