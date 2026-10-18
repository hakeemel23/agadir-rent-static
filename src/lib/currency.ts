import { siteConfig } from "@/data/config"

export type Currency = string;

export const BASE_CURRENCY: Currency = siteConfig.currency.base;
export const FOREIGN_CURRENCY: Currency = siteConfig.currency.foreign;
export const DEFAULT_CURRENCY: Currency = BASE_CURRENCY;
export const BASE_TO_FOREIGN_RATE: number = siteConfig.currency.rate;

const SYMBOLS: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" }
export const FOREIGN_SYMBOL: string = SYMBOLS[FOREIGN_CURRENCY] ?? FOREIGN_CURRENCY;

export function nextCurrency(c: Currency): Currency {
  return c === BASE_CURRENCY ? FOREIGN_CURRENCY : BASE_CURRENCY;
}

export function convertPrice(priceBase: number, currency: Currency): number {
  if (currency === FOREIGN_CURRENCY) return priceBase * BASE_TO_FOREIGN_RATE;
  return priceBase;
}

export function formatPrice(priceBase: number, currency: Currency): string {
  if (currency === FOREIGN_CURRENCY) {
    const converted = convertPrice(priceBase, FOREIGN_CURRENCY);
    return `${converted.toFixed(2)} ${FOREIGN_SYMBOL}`;
  }
  return `${priceBase} ${BASE_CURRENCY}`;
}

export function formatPriceDual(priceBase: number): { base: string; foreign: string } {
  return {
    base: formatPrice(priceBase, BASE_CURRENCY),
    foreign: `~${formatPrice(priceBase, FOREIGN_CURRENCY)}`,
  }
}

export function formatTotal(priceBase: number, days: number, currency: Currency): string {
  return formatPrice(priceBase * days, currency);
}