"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/finance";
import FormattedNumberInput from "@/components/FormattedNumberInput";
import RingMeter from "@/components/RingMeter";
import AnimatedNumber from "@/components/AnimatedNumber";

interface Props {
  income: number;
  expenses: number;
  onUpdateIncome: (value: number) => Promise<void>;
}

export default function NetIncomeCard({ income, expenses, onUpdateIncome }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(income ? String(income) : "");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const net = income - expenses;
  const hasIncome = income > 0;
  const isNegative = hasIncome && net < 0;
  const ratio = hasIncome ? expenses / income : 0;
  const ratioPercent = ratio * 100;

  const bandColor = !hasIncome
    ? "var(--text-faint)"
    : isNegative
      ? "var(--danger)"
      : ratio >= 0.75
        ? "var(--status-serious)"
        : ratio >= 0.5
          ? "var(--status-warning)"
          : "var(--status-good)";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(value);
    if (!parsed || parsed <= 0) return;

    setSaving(true);
    setErrorMessage("");
    try {
      await onUpdateIncome(parsed);
      setEditing(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Kaydedilemedi, tekrar dener misin?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-[var(--card-border-hover)] transition-colors">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        Net Durum
      </p>

      <div className="flex items-center justify-between mt-2 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {hasIncome && (
            <RingMeter percent={ratioPercent} color={bandColor} size={60} strokeWidth={6}>
              <span className="text-[10px] font-bold" style={{ color: bandColor }}>
                %{Math.round(ratioPercent)}
              </span>
            </RingMeter>
          )}
          <h2
            className={`text-3xl font-semibold tracking-tight ${
              isNegative ? "text-[var(--danger)]" : ""
            }`}
          >
            {hasIncome ? (
              <>
                <AnimatedNumber value={net} />{" "}
                <span className="text-lg text-[var(--text-muted)] font-normal">TL</span>
              </>
            ) : (
              <span className="text-base text-[var(--text-muted)] font-normal">
                Gelirini girince net kalanını görürsün
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-xs bg-[var(--cta-bg)] text-[var(--cta-text)] px-3 py-1.5 rounded-full font-medium hover:opacity-90 shrink-0"
        >
          {editing ? "Vazgeç" : hasIncome ? "Düzenle" : "Gelir gir"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2 border-t border-[var(--card-border)] pt-3">
          <FormattedNumberInput
            autoFocus
            value={value}
            onChange={setValue}
            placeholder="Aylık net gelirin"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[var(--cta-bg)] text-[var(--cta-text)] rounded-lg py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          {errorMessage && (
            <p className="text-sm text-[var(--danger)] text-center">{errorMessage}</p>
          )}
        </form>
      ) : (
        hasIncome && (
          <div className="mt-4 text-xs text-[var(--text-muted)] space-y-1.5 border-t border-[var(--card-border)] pt-3">
            <div className="flex justify-between">
              <span>Gelir</span>
              <span>{formatCurrency(income)} TL</span>
            </div>
            <div className="flex justify-between">
              <span>Giderler</span>
              <span>{formatCurrency(expenses)} TL</span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
