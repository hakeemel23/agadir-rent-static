"use client"
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { siteConfig, type LocationId } from "@/data/config"
import { daysBetween } from "@/lib/dates"
import { DEFAULT_CURRENCY, type Currency } from "@/lib/currency"

export type { Currency }

interface BookingState {
  location: LocationId
  pickup: string
  ret: string
  days: number
  currency: Currency
  setLocation: (v: LocationId) => void
  setPickup: (v: string) => void
  setReturn: (v: string) => void
  setCurrency: (c: Currency) => void
}

const BookingContext = createContext<BookingState | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationId>(siteConfig.booking.locations[0] as LocationId)
  const [pickup, setPickupState] = useState("")
  const [ret, setRetState] = useState("")
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY)

  const setPickup = useCallback((v: string) => {
    setPickupState(v)
    setRetState((r) => (r && r < v ? "" : r))
  }, [])

  const setReturn = useCallback((v: string) => {
    if (v && pickup && v < pickup) {
      setRetState("")
      return
    }
    setRetState(v)
  }, [pickup])

  const days = useMemo(() => {
    if (!pickup || !ret || ret < pickup) return 0
    return daysBetween(pickup, ret)
  }, [pickup, ret])

  const value = useMemo(
    () => ({
      location,
      pickup,
      ret,
      days,
      currency,
      setLocation,
      setPickup,
      setReturn,
      setCurrency,
    }),
    [location, pickup, ret, days, currency, setLocation, setPickup, setReturn, setCurrency]
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider")
  return ctx
}