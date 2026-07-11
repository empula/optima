import type { Subscription } from "./types";

function monthsElapsed(createdAt: string): number {
  const start = new Date(createdAt);
  const now = new Date();
  return (
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  );
}

// null when the subscription isn't an installment plan.
export function installmentsRemaining(sub: Subscription): number | null {
  if (sub.cycle !== "installment" || !sub.installmentMonths) return null;
  return Math.max(0, sub.installmentMonths - monthsElapsed(sub.createdAt));
}

export function isInstallmentFinished(sub: Subscription): boolean {
  return installmentsRemaining(sub) === 0;
}

// The nominal monthly rate, regardless of whether an installment plan has finished.
// Used for display purposes so a finished installment still shows what it used to cost.
export function nominalMonthlyPrice(sub: Subscription): number {
  if (sub.cycle === "yearly") return sub.price / 12;
  if (sub.cycle === "installment") return sub.price / (sub.installmentMonths ?? 1);
  return sub.price;
}

export function monthlyPrice(sub: Subscription): number {
  if (sub.cycle === "installment" && isInstallmentFinished(sub)) return 0;
  return nominalMonthlyPrice(sub);
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
