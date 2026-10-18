"use client"
import { useT } from "@/lib/lang"
import type { Vars } from "@/lib/i18n"


export default function T({ k, vars }: { k: string; vars?: Vars }) {
  const { t } = useT()
  return <>{t(k, vars)}</>
}
