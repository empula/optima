import type { Subscription } from "./types";

export function monthlyPrice(sub: Subscription): number {
  return sub.cycle === "yearly" ? sub.price / 12 : sub.price;
}

export function monthlyTotal(subs: Subscription[]): number {
  return subs.reduce((sum, sub) => sum + monthlyPrice(sub), 0);
}

export interface PaymentMethodTotal {
  method: string;
  total: number;
}

export function groupByPaymentMethod(subs: Subscription[]): PaymentMethodTotal[] {
  const totals = new Map<string, number>();

  for (const sub of subs) {
    const method = sub.paymentMethod?.trim();
    if (!method) continue;
    totals.set(method, (totals.get(method) ?? 0) + monthlyPrice(sub));
  }

  return [...totals.entries()]
    .map(([method, total]) => ({ method, total }))
    .sort((a, b) => b.total - a.total);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
