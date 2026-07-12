"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/types";
import { monthlyTotalAt, formatCurrency } from "@/lib/finance";

interface Props {
  subscriptions: Subscription[];
}

const MONTH_ABBR = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

const BAR_AREA_HEIGHT = 80;

export default function TrendChart({ subscriptions }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (subscriptions.length === 0) return null;

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const offset = i - 5;
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return {
      label: MONTH_ABBR[date.getMonth()],
      total: monthlyTotalAt(subscriptions, date),
    };
  });

  const max = Math.max(...months.map((m) => m.total), 1);
  const lastIndex = months.length - 1;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-[var(--card-border-hover)] transition-colors">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4">
        Son 6 Ay
      </p>

      <div className="flex items-end justify-between gap-2">
        {months.map((month, i) => {
          const heightPercent = Math.max((month.total / max) * 100, 4);
          const isLast = i === lastIndex;
          const showLabel = hovered === i || isLast;

          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(hovered === i ? null : i)}
              className="flex-1 flex flex-col items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer"
            >
              <div
                className="relative w-full flex items-end justify-center"
                style={{ height: BAR_AREA_HEIGHT }}
              >
                {showLabel && (
                  <span className="absolute -top-5 text-[10px] font-medium text-[var(--text-primary)] whitespace-nowrap">
                    {formatCurrency(month.total)}
                  </span>
                )}
                <div
                  className="w-full rounded-t-[4px]"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isLast ? "var(--accent)" : "var(--card-border-hover)",
                    transition: "height 0.5s ease",
                  }}
                />
              </div>
              <span className="text-[10px] text-[var(--text-faint)]">{month.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
