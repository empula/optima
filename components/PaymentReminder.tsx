import type { Subscription } from "@/lib/types";
import { isDueToday, nominalMonthlyPrice, formatCurrency } from "@/lib/finance";

interface Props {
  subscriptions: Subscription[];
}

export default function PaymentReminder({ subscriptions }: Props) {
  const dueToday = subscriptions.filter(isDueToday);

  if (dueToday.length === 0) return null;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--accent)] rounded-2xl p-4 flex items-start gap-3">
      <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0 animate-pulse" />
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)]">Bugün ödemesi gelenler</p>
        <p className="text-sm text-[var(--text-primary)] mt-0.5 leading-relaxed">
          {dueToday
            .map((sub) => `${sub.name} (${formatCurrency(nominalMonthlyPrice(sub))} TL)`)
            .join(", ")}
        </p>
      </div>
    </div>
  );
}
