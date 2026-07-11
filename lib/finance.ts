import type { Subscription } from "./types";

function monthsBetween(createdAt: string, at: Date): number {
  const start = new Date(createdAt);
  return (at.getFullYear() - start.getFullYear()) * 12 + (at.getMonth() - start.getMonth());
}

// null when the subscription isn't an installment plan.
export function installmentsRemainingAt(sub: Subscription, at: Date): number | null {
  if (sub.cycle !== "installment" || !sub.installmentMonths) return null;
  return Math.max(0, sub.installmentMonths - monthsBetween(sub.createdAt, at));
}

export function installmentsRemaining(sub: Subscription): number | null {
  return installmentsRemainingAt(sub, new Date());
}

export function isInstallmentFinishedAt(sub: Subscription, at: Date): boolean {
  return installmentsRemainingAt(sub, at) === 0;
}

export function isInstallmentFinished(sub: Subscription): boolean {
  return isInstallmentFinishedAt(sub, new Date());
}

// The nominal monthly rate, regardless of whether an installment plan has finished.
// Used for display purposes so a finished installment still shows what it used to cost.
export function nominalMonthlyPrice(sub: Subscription): number {
  if (sub.cycle === "yearly") return sub.price / 12;
  if (sub.cycle === "installment") return sub.price / (sub.installmentMonths ?? 1);
  return sub.price;
}

export function monthlyPriceAt(sub: Subscription, at: Date): number {
  if (sub.cycle === "installment" && isInstallmentFinishedAt(sub, at)) return 0;
  return nominalMonthlyPrice(sub);
}

export function monthlyPrice(sub: Subscription): number {
  return monthlyPriceAt(sub, new Date());
}

export function monthlyTotalAt(subs: Subscription[], at: Date): number {
  return subs.reduce((sum, sub) => sum + monthlyPriceAt(sub, at), 0);
}

export function monthlyTotal(subs: Subscription[]): number {
  return monthlyTotalAt(subs, new Date());
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
