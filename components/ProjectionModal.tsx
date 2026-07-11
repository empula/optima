"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/types";
import {
  monthlyTotalAt,
  monthlyPriceAt,
  isInstallmentFinishedAt,
  formatCurrency,
} from "@/lib/finance";

interface Props {
  subscriptions: Subscription[];
  income: number;
  onClose: () => void;
}

const MONTH_NAMES = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const MONTHS_AHEAD = 12;

type ViewMode = "single" | "list";

function monthLabel(now: Date, offset: number): string {
  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export default function ProjectionModal({ subscriptions, income, onClose }: Props) {
  const [view, setView] = useState<ViewMode>("single");
  const [offset, setOffset] = useState(0);

  const now = new Date();
  const hasIncome = income > 0;

  const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const expenses = monthlyTotalAt(subscriptions, targetDate);
  const net = income - expenses;

  const items = subscriptions
    .map((sub) => ({
      sub,
      price: monthlyPriceAt(sub, targetDate),
      finished: sub.cycle === "installment" && isInstallmentFinishedAt(sub, targetDate),
    }))
    .sort((a, b) => b.price - a.price);

  const months = Array.from({ length: MONTHS_AHEAD }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      offset: i,
      label: monthLabel(now, i),
      net: income - monthlyTotalAt(subscriptions, date),
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Gelecek Ay Tahmini
          </p>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("single")}
            className={`flex-1 text-xs py-1.5 rounded-full font-medium transition-colors ${
              view === "single"
                ? "bg-[var(--cta-bg)] text-[var(--cta-text)]"
                : "bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--input-border)]"
            }`}
          >
            Tek Ay
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex-1 text-xs py-1.5 rounded-full font-medium transition-colors ${
              view === "list"
                ? "bg-[var(--cta-bg)] text-[var(--cta-text)]"
                : "bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--input-border)]"
            }`}
          >
            Tüm Aylar
          </button>
        </div>

        {view === "single" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setOffset((o) => Math.max(0, o - 1))}
                disabled={offset === 0}
                aria-label="Önceki ay"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--card-border)] text-[var(--text-muted)] disabled:opacity-30 hover:border-[var(--card-border-hover)] transition-colors"
              >
                ‹
              </button>
              <h2 className="text-lg font-semibold tracking-tight">
                {monthLabel(now, offset)}
              </h2>
              <button
                onClick={() => setOffset((o) => o + 1)}
                aria-label="Sonraki ay"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--card-border-hover)] transition-colors"
              >
                ›
              </button>
            </div>

            <div className="text-center py-4 border-y border-[var(--card-border)]">
              {hasIncome ? (
                <>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    Net Kalan
                  </p>
                  <p
                    className={`text-3xl font-semibold tracking-tight ${
                      net < 0 ? "text-[var(--danger)]" : ""
                    }`}
                  >
                    {formatCurrency(net)}{" "}
                    <span className="text-lg text-[var(--text-muted)]">TL</span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  Net kalanı görmek için önce aylık gelirini girmelisin.
                </p>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-4 text-xs text-[var(--text-muted)] space-y-2">
                {items.map(({ sub, price, finished }) => (
                  <div key={sub.id} className="flex justify-between">
                    <span
                      className={
                        finished
                          ? "text-[var(--text-faint)] line-through"
                          : "text-[var(--text-primary)]"
                      }
                    >
                      {sub.name}
                    </span>
                    <span className={finished ? "text-[var(--text-faint)] line-through" : undefined}>
                      {finished ? "Bitti" : `${formatCurrency(price)} TL`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-1.5">
            {months.map((month) => (
              <button
                key={month.offset}
                onClick={() => {
                  setOffset(month.offset);
                  setView("single");
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--input-bg)] transition-colors text-left"
              >
                <span className="text-sm text-[var(--text-primary)]">{month.label}</span>
                {hasIncome ? (
                  <span
                    className={`text-sm font-medium ${
                      month.net < 0 ? "text-[var(--danger)]" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {formatCurrency(month.net)} TL
                  </span>
                ) : (
                  <span className="text-xs text-[var(--text-faint)]">Gelir yok</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
