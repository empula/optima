import type { Subscription, FocusSession } from "./types";
import { monthlyTotal, groupByPaymentMethod, formatCurrency } from "./finance";
import { todayMinutes } from "./focus";

// Simple rule-based tips — no external AI call needed for the MVP.
export function getInsight(subs: Subscription[], sessions: FocusSession[]): string {
  const total = monthlyTotal(subs);
  const minutes = todayMinutes(sessions);

  if (subs.length === 0 && sessions.length === 0) {
    return "Başlamak için bir abonelik ekle ya da ilk odaklanma seansını başlat.";
  }

  if (subs.length === 0 && minutes > 0) {
    return "Aboneliklerini eklersen aylık ne kadar harcadığını da tek ekranda görebilirsin.";
  }

  const topMethod = groupByPaymentMethod(subs)[0];
  const methodCount = subs.filter((s) => s.paymentMethod?.trim() === topMethod?.method).length;
  if (topMethod && methodCount >= 2) {
    return `"${topMethod.method}" üzerinden ${methodCount} abonelik ödüyorsun, aylık toplam ${formatCurrency(topMethod.total)} TL. Hepsini gerçekten kullanıyor musun?`;
  }

  if (subs.length >= 2 && minutes === 0) {
    return `Aylık ${formatCurrency(total)} TL abonelik ödüyorsun ama bugün hiç odaklanmadın. Kısa bir seansla başlasan?`;
  }

  const expensive = [...subs].sort((a, b) => b.price - a.price)[0];
  if (expensive && subs.length >= 3) {
    return `En pahalı aboneliğin "${expensive.name}". Gerçekten kullanıyor musun, bir düşün.`;
  }

  if (minutes >= 60) {
    return `Bugün ${minutes} dakika odaklandın, harika gidiyor.`;
  }

  return "Aboneliklerini ve odaklanma sürelerini takip etmeye devam et, örüntüler zamanla netleşir.";
}
