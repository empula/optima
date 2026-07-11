"use client";

import { useAuth } from "@/lib/useAuth";
import { useSubscriptions } from "@/lib/useSubscriptions";
import { useFocusSessions } from "@/lib/useFocusSessions";
import { signOut } from "@/lib/auth";
import SubscriptionsCard from "@/components/SubscriptionsCard";
import FocusCard from "@/components/FocusCard";
import InsightCard from "@/components/InsightCard";
import ThemeToggle from "@/components/ThemeToggle";
import Login from "@/components/Login";
import Footer from "@/components/Footer";

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
  const { subscriptions, addSubscription, removeSubscription } = useSubscriptions(userId);
  const { sessions, addSession } = useFocusSessions(userId);

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
        <div className="flex items-center gap-2">
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
      </header>

      <main className="max-w-md mx-auto space-y-4">
        <SubscriptionsCard
          subscriptions={subscriptions}
          onAdd={addSubscription}
          onRemove={removeSubscription}
        />

        <FocusCard sessions={sessions} onComplete={addSession} />

        <InsightCard subscriptions={subscriptions} sessions={sessions} />
      </main>

      <Footer />
    </div>
  );
}
