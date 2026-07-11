import type { Subscription } from "./types";
import { monthlyPrice, monthlyTotal, groupByPaymentMethod, formatCurrency } from "./finance";

// Simple rule-based tips — no external AI call needed for the MVP.
export function getInsight(subs: Subscription[], income: number): string {
  if (subs.length === 0) {
    return "Başlamak için bir gider ekle, aylık ne kadar harcadığını gör.";
  }

  const total = monthlyTotal(subs);

  const topMethod = groupByPaymentMethod(subs)[0];
  const methodCount = subs.filter((s) => s.paymentMethod?.trim() === topMethod?.method).length;
  if (topMethod && methodCount >= 2) {
    return `"${topMethod.method}" üzerinden ${methodCount} gider ödüyorsun, aylık toplam ${formatCurrency(topMethod.total)} TL. Hepsini gerçekten kullanıyor musun?`;
  }

  if (income > 0) {
    const ratio = total / income;
    if (ratio >= 0.5) {
      return `Giderlerin gelirinin %${Math.round(ratio * 100)}'ini götürüyor. Bir gözden geçirsen iyi olabilir.`;
    }
  }

  const priciest = [...subs].sort((a, b) => b.price - a.price)[0];
  if (priciest) {
    return `"${priciest.name}" için ayda ${formatCurrency(monthlyPrice(priciest))} TL ödüyorsun. Gerçekten kullanıyor musun?`;
  }

  return "Giderlerini takip etmeye devam et, örüntüler zamanla netleşir.";
}
