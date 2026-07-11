"use client";

import { useState } from "react";
import type { Subscription, BillingCycle } from "@/lib/types";
import {
  monthlyTotal,
  nominalMonthlyPrice,
  groupByPaymentMethod,
  installmentsRemaining,
  isInstallmentFinished,
  formatCurrency,
} from "@/lib/finance";
import FormattedNumberInput from "@/components/FormattedNumberInput";

interface Props {
  subscriptions: Subscription[];
  onAdd: (sub: Omit<Subscription, "id" | "createdAt">) => Promise<void>;
  onUpdate: (id: string, sub: Omit<Subscription, "id" | "createdAt">) => Promise<void>;
  onRemove: (id: string) => void;
}

export default function SubscriptionsCard({ subscriptions, onAdd, onUpdate, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [installmentMonths, setInstallmentMonths] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const total = monthlyTotal(subscriptions);
  const byPaymentMethod = groupByPaymentMethod(subscriptions);
  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => nominalMonthlyPrice(b) - nominalMonthlyPrice(a)
  );

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setCycle("monthly");
    setInstallmentMonths("");
    setPaymentMethod("");
    setErrorMessage("");
  }

  function startAdd() {
    if (showForm && editingId === null) {
      setShowForm(false);
      return;
    }
    resetForm();
    setShowForm(true);
  }

  function startEdit(sub: Subscription) {
    setEditingId(sub.id);
    setName(sub.name);
    setPrice(String(sub.price));
    setCycle(sub.cycle);
    setInstallmentMonths(sub.installmentMonths ? String(sub.installmentMonths) : "");
    setPaymentMethod(sub.paymentMethod ?? "");
    setErrorMessage("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedPrice = Number(price);
    if (!name.trim() || !parsedPrice || parsedPrice <= 0) return;

    const parsedMonths = Number(installmentMonths);
    if (cycle === "installment" && (!parsedMonths || parsedMonths <= 0)) return;

    const payload = {
      name: name.trim(),
      price: parsedPrice,
      cycle,
      paymentMethod: paymentMethod.trim() || undefined,
      installmentMonths: cycle === "installment" ? parsedMonths : undefined,
    };

    setSaving(true);
    setErrorMessage("");
    try {
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onAdd(payload);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Kaydedilemedi, tekrar dener misin?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-[var(--card-border-hover)] transition-colors">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        Aylık Giderler
      </p>

      <div className="flex items-baseline justify-between mt-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          {formatCurrency(total)} <span className="text-lg text-[var(--text-muted)]">TL</span>
        </h2>
        <button
          onClick={startAdd}
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
            placeholder="Gider adı (örn. Netflix, Ayakkabı)"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
          />
          <div className="flex gap-2">
            <FormattedNumberInput
              value={price}
              onChange={setPrice}
              placeholder={cycle === "installment" ? "Toplam tutar" : "Fiyat"}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
            />
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value as BillingCycle)}
              className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--input-border-focus)]"
            >
              <option value="monthly">Aylık</option>
              <option value="yearly">Yıllık</option>
              <option value="installment">Taksit</option>
            </select>
          </div>
          {cycle === "installment" && (
            <input
              value={installmentMonths}
              onChange={(e) => setInstallmentMonths(e.target.value)}
              type="number"
              min="1"
              step="1"
              placeholder="Kaç ay taksit? (örn. 12)"
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
            />
          )}
          <input
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Ödeme aracı (opsiyonel, örn. Garanti Kredi Kartı)"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[var(--cta-bg)] text-[var(--cta-text)] rounded-lg py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
          </button>
          {errorMessage && (
            <p className="text-sm text-[var(--danger)] text-center">{errorMessage}</p>
          )}
        </form>
      )}

      {sortedSubscriptions.length > 0 && (
        <div className="mt-4 text-xs text-[var(--text-muted)] space-y-2 border-t border-[var(--card-border)] pt-3">
          {sortedSubscriptions.map((sub) => {
            const remaining = installmentsRemaining(sub);
            const finished = isInstallmentFinished(sub);
            return (
              <div key={sub.id} className="flex justify-between items-start">
                <div>
                  <div className="text-[var(--text-primary)]">{sub.name}</div>
                  {sub.paymentMethod && (
                    <div className="text-[var(--text-faint)] mt-0.5">{sub.paymentMethod}</div>
                  )}
                  {remaining !== null && (
                    <div className="text-[var(--text-faint)] mt-0.5">
                      {finished
                        ? "Tamamlandı"
                        : `Taksit: ${sub.installmentMonths! - remaining}/${sub.installmentMonths} ay`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-px">
                  <span className={finished ? "text-[var(--text-faint)] line-through" : undefined}>
                    {formatCurrency(nominalMonthlyPrice(sub))} TL
                    {sub.cycle === "yearly" && (
                      <span className="text-[var(--text-faint)]">/ay</span>
                    )}
                  </span>
                  <button
                    onClick={() => startEdit(sub)}
                    aria-label={`${sub.name} kalemini düzenle`}
                    className="text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onRemove(sub.id)}
                    aria-label={`${sub.name} kalemini sil`}
                    className="text-[var(--text-faint)] hover:text-[var(--danger)] transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
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
