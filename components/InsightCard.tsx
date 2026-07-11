import type { Subscription, FocusSession } from "@/lib/types";
import { getInsight } from "@/lib/insight";

interface Props {
  subscriptions: Subscription[];
  sessions: FocusSession[];
}

export default function InsightCard({ subscriptions, sessions }: Props) {
  const message = getInsight(subscriptions, sessions);

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-2xl p-4 flex items-start space-x-3">
      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse" />
      <div>
        <p className="text-xs font-medium text-[#888888]">Asistan Önerisi</p>
        <p className="text-sm text-[#ededed] mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
