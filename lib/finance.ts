import type { Subscription } from "./types";

export function monthlyPrice(sub: Subscription): number {
  return sub.cycle === "yearly" ? sub.price / 12 : sub.price;
}

export function monthlyTotal(subs: Subscription[]): number {
  return subs.reduce((sum, sub) => sum + monthlyPrice(sub), 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
