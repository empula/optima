"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { useSubscriptions } from "@/lib/useSubscriptions";
import { useMonthlyIncome } from "@/lib/useMonthlyIncome";
import { monthlyTotal } from "@/lib/finance";
import { signOut } from "@/lib/auth";
import NetIncomeCard from "@/components/NetIncomeCard";
import SubscriptionsCard from "@/components/SubscriptionsCard";
import TrendChart from "@/components/TrendChart";
import InsightCard from "@/components/InsightCard";
import ThemeToggle from "@/components/ThemeToggle";
import Clock from "@/components/Clock";
import Login from "@/components/Login";
import ProjectionModal from "@/components/ProjectionModal";

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] text-[var(--text-muted)]">
        Yükleniyor...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard userId={user.id} userEmail={user.email ?? ""} />;
}

function Dashboard({ userId, userEmail }: { userId: string; userEmail: string }) {
  const { subscriptions, addSubscription, updateSubscription, removeSubscription } =
    useSubscriptions(userId);
  const { income, updateIncome } = useMonthlyIncome(userId);
  const [showProjection, setShowProjection] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] p-6 font-sans transition-colors">
      <header className="max-w-md mx-auto mb-8 pt-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)]" />
            <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
              Tally
            </span>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-[var(--text-muted)] mt-1">
            Özet
          </h1>
          <p className="text-xs text-[var(--text-faint)] mt-0.5">{userEmail}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Clock />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProjection(true)}
              aria-label="Gelecek ay tahmini"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:border-[var(--card-border-hover)] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              onClick={() => signOut()}
              aria-label="Çıkış yap"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:border-[var(--card-border-hover)] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-4">
        <div className="animate-card-in" style={{ animationDelay: "0ms" }}>
          <NetIncomeCard
            income={income}
            expenses={monthlyTotal(subscriptions)}
            onUpdateIncome={updateIncome}
          />
        </div>

        <div className="animate-card-in" style={{ animationDelay: "60ms" }}>
          <SubscriptionsCard
            subscriptions={subscriptions}
            onAdd={addSubscription}
            onUpdate={updateSubscription}
            onRemove={removeSubscription}
          />
        </div>

        <div className="animate-card-in" style={{ animationDelay: "120ms" }}>
          <TrendChart subscriptions={subscriptions} />
        </div>

        <div className="animate-card-in" style={{ animationDelay: "180ms" }}>
          <InsightCard subscriptions={subscriptions} income={income} />
        </div>
      </main>

      <div className="text-center mt-8">
        <Link
          href="/hakkinda"
          className="text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
        >
          Hakkında
        </Link>
      </div>

      {showProjection && (
        <ProjectionModal
          subscriptions={subscriptions}
          income={income}
          onClose={() => setShowProjection(false)}
        />
      )}
    </div>
  );
}
