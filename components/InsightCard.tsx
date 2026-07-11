import type { Subscription, FocusSession } from "@/lib/types";
import { getInsight } from "@/lib/insight";

interface Props {
  subscriptions: Subscription[];
  sessions: FocusSession[];
}

export default function InsightCard({ subscriptions, sessions }: Props) {
  const message = getInsight(subscriptions, sessions);

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex items-start space-x-3">
      <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0 animate-pulse" />
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)]">Asistan Önerisi</p>
        <p className="text-sm text-[var(--text-primary)] mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
