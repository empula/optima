"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/types";
import { monthlyPrice, monthlyTotal, groupByPaymentMethod, formatCurrency } from "@/lib/finance";

interface Props {
  subscriptions: Subscription[];
  onAdd: (sub: Subscription) => void;
  onRemove: (id: string) => void;
}

export default function SubscriptionsCard({ subscriptions, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [paymentMethod, setPaymentMethod] = useState("");

  const total = monthlyTotal(subscriptions);
  const byPaymentMethod = groupByPaymentMethod(subscriptions);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedPrice = Number(price);
    if (!name.trim() || !parsedPrice || parsedPrice <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      price: parsedPrice,
      cycle,
      paymentMethod: paymentMethod.trim() || undefined,
    });

    setName("");
    setPrice("");
    setCycle("monthly");
    setPaymentMethod("");
    setShowForm(false);
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-[var(--card-border-hover)] transition-colors">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        Aylık Abonelikler
      </p>

      <div className="flex items-baseline justify-between mt-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          {formatCurrency(total)} <span className="text-lg text-[var(--text-muted)]">TL</span>
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs bg-[var(--cta-bg)] text-[var(--cta-text)] px-3 py-1.5 rounded-full font-medium hover:opacity-90"
        >
          {showForm ? "Vazgeç" : "Ekle"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-2 border-t border-[var(--card-border)] pt-3"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Abonelik adı (örn. Netflix)"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
          />
          <div className="flex gap-2">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Fiyat"
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
            />
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value as "monthly" | "yearly")}
              className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--input-border-focus)]"
            >
              <option value="monthly">Aylık</option>
              <option value="yearly">Yıllık</option>
            </select>
          </div>
          <input
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Ödeme aracı (opsiyonel, örn. Garanti Kredi Kartı)"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
          />
          <button
            type="submit"
            className="w-full bg-[var(--cta-bg)] text-[var(--cta-text)] rounded-lg py-2 text-sm font-medium hover:opacity-90"
          >
            Kaydet
          </button>
        </form>
      )}

      {subscriptions.length > 0 && (
        <div className="mt-4 text-xs text-[var(--text-muted)] space-y-2 border-t border-[var(--card-border)] pt-3">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="flex justify-between items-start">
              <div>
                <div className="text-[var(--text-primary)]">{sub.name}</div>
                {sub.paymentMethod && (
                  <div className="text-[var(--text-faint)] mt-0.5">{sub.paymentMethod}</div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-px">
                <span>
                  {formatCurrency(monthlyPrice(sub))} TL
                  {sub.cycle === "yearly" && <span className="text-[var(--text-faint)]">/ay</span>}
                </span>
                <button
                  onClick={() => onRemove(sub.id)}
                  aria-label={`${sub.name} aboneliğini sil`}
                  className="text-[var(--text-faint)] hover:text-[var(--danger)] transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {byPaymentMethod.length > 1 && (
        <div className="mt-4 text-xs text-[var(--text-muted)] space-y-1.5 border-t border-[var(--card-border)] pt-3">
          <p className="text-[var(--text-faint)] uppercase tracking-wider">Kart bazında</p>
          {byPaymentMethod.map(({ method, total: methodTotal }) => (
            <div key={method} className="flex justify-between">
              <span>{method}</span>
              <span>{formatCurrency(methodTotal)} TL</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
