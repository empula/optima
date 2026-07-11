import type { Subscription } from "./types";
import { monthlyPrice, monthlyTotal, groupByPaymentMethod, formatCurrency } from "./finance";

// Deterministic pick so the same data always yields the same message
// (no flicker on unrelated re-renders), while different data naturally varies.
function pick(templates: string[], seed: number): string {
  const index = Math.abs(Math.floor(seed)) % templates.length;
  return templates[index];
}

const EMPTY_MESSAGES = [
  "Başlamak için bir gider ekle, aylık ne kadar harcadığını görelim.",
  "Henüz hiç gider yok. İlk kalemi ekleyince işler netleşmeye başlayacak.",
  "Boş bir sayfa gibi duruyor — ilk gideri ekleyip başlayalım mı?",
];

const FALLBACK_MESSAGES = [
  "Giderlerini takip etmeye devam et, örüntüler zamanla netleşir.",
  "Düzenli takip iyi bir alışkanlık — böyle devam et.",
  "Her şey kontrol altında görünüyor, takibe devam.",
];

// Simple rule-based tips — no external AI call needed for the MVP.
export function getInsight(subs: Subscription[], income: number): string {
  if (subs.length === 0) {
    return pick(EMPTY_MESSAGES, subs.length + income);
  }

  const total = monthlyTotal(subs);
  const seed = Math.round(total);

  const topMethod = groupByPaymentMethod(subs)[0];
  const methodCount = subs.filter((s) => s.paymentMethod?.trim() === topMethod?.method).length;
  if (topMethod && methodCount >= 3) {
    return pick(
      [
        `Vay be, "${topMethod.method}" üzerinden tam ${methodCount} farklı gider gidiyor! Toplamda ayda ${formatCurrency(topMethod.total)} TL. Hepsine gerçekten ihtiyacın var mı?`,
        `"${topMethod.method}" kartın epey yükleniyor: ${methodCount} gider, ayda toplam ${formatCurrency(topMethod.total)} TL. Bir gözden geçirsen şaşırabilirsin.`,
      ],
      seed
    );
  }
  if (topMethod && methodCount === 2) {
    return pick(
      [
        `"${topMethod.method}" üzerinden 2 gider ödüyorsun, aylık toplam ${formatCurrency(topMethod.total)} TL. İkisini de kullanıyor musun?`,
        `Dikkatimi çekti: "${topMethod.method}" kartından iki ayrı ödeme gidiyor, toplam ${formatCurrency(topMethod.total)} TL.`,
      ],
      seed
    );
  }

  if (income > 0) {
    const ratio = total / income;
    const percent = Math.round(ratio * 100);

    if (ratio >= 0.8) {
      return pick(
        [
          `Dur biraz — giderlerin gelirinin %${percent}'ini götürüyor! Bu gerçekten yüksek, bir gözden geçirmelisin.`,
          `Bu rakam beni şaşırttı: gelirinin %${percent}'i giderlere gidiyor. Acil bir gözden geçirme zamanı olabilir.`,
        ],
        seed
      );
    }
    if (ratio >= 0.5) {
      return pick(
        [
          `Giderlerin gelirinin %${percent}'ini oluşturuyor. Biraz fazla gibi, bir bakmakta fayda var.`,
          `Gelirinin yarısından fazlası (%${percent}) giderlere gidiyor. Nefes alacak alanın daralıyor olabilir.`,
        ],
        seed
      );
    }
    if (ratio < 0.2) {
      return pick(
        [
          `Harika gidiyorsun! Giderlerin gelirinin sadece %${percent}'i — oldukça sağlıklı bir tablo.`,
          `Etkileyici: gelirinin yalnızca %${percent}'i giderlere gidiyor. Bu dengeyi koru.`,
        ],
        seed
      );
    }
  }

  const priciest = [...subs].sort((a, b) => b.price - a.price)[0];
  if (priciest) {
    return pick(
      [
        `"${priciest.name}" tek başına ayda ${formatCurrency(monthlyPrice(priciest))} TL! Buna değiyor mu, bir düşün.`,
        `En çok "${priciest.name}" için ödüyorsun: ayda ${formatCurrency(monthlyPrice(priciest))} TL. Gerçekten kullanıyor musun?`,
        `"${priciest.name}" cebinden ayda ${formatCurrency(monthlyPrice(priciest))} TL çekiyor. Karşılığını alıyor musun?`,
      ],
      seed
    );
  }

  return pick(FALLBACK_MESSAGES, seed);
}
