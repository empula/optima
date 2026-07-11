"use client";

import { useLocalStorage } from "@/lib/useLocalStorage";
import type { Subscription, FocusSession } from "@/lib/types";
import SubscriptionsCard from "@/components/SubscriptionsCard";
import FocusCard from "@/components/FocusCard";
import InsightCard from "@/components/InsightCard";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>(
    "optima:subscriptions",
    []
  );
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>(
    "optima:focus-sessions",
    []
  );

  return (
    <div className="min-h-screen bg-[#060606] text-[#ededed] p-6 font-sans">
      <header className="max-w-md mx-auto mb-8 pt-4">
        <h1 className="text-xl font-medium tracking-tight text-[#888888]">Özet</h1>
      </header>

      <main className="max-w-md mx-auto space-y-4">
        <SubscriptionsCard
          subscriptions={subscriptions}
          onAdd={(sub) => setSubscriptions((prev) => [...prev, sub])}
          onRemove={(id) => setSubscriptions((prev) => prev.filter((s) => s.id !== id))}
        />

        <FocusCard
          sessions={sessions}
          onComplete={(session) => setSessions((prev) => [...prev, session])}
        />

        <InsightCard subscriptions={subscriptions} sessions={sessions} />
      </main>
    </div>
  );
}
