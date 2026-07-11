import type { Subscription } from "@/lib/types";
import { getInsight } from "@/lib/insight";

interface Props {
  subscriptions: Subscription[];
  income: number;
}

export default function InsightCard({ subscriptions, income }: Props) {
  const message = getInsight(subscriptions, income);

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex items-start space-x-3">
      <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0 animate-pulse" />
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)]">Tally Önerisi</p>
        <p className="text-sm text-[var(--text-primary)] mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
