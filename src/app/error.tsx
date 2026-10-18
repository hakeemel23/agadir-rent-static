"use client"
import { useEffect } from "react"
import Link from "next/link"
import { useT } from "@/lib/lang"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useT();

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] px-6 text-center">
      <h2 className="text-[24px] font-bold text-zinc-900">{t("error.title")}</h2>
      <p className="mt-2 text-[15px] text-zinc-500">
        {t("error.text")}
      </p>
      <div className="mt-8 flex gap-4">
        <button onClick={() => reset()} className="rounded-full bg-zinc-900 px-8 py-3.5 text-[14px] font-bold text-white transition hover:bg-black">
          {t("error.retry")}
        </button>
        <Link href="/" className="rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-[14px] font-bold text-zinc-800 transition hover:border-zinc-300">
          {t("error.home")}
        </Link>
      </div>
    </div>
  )
}