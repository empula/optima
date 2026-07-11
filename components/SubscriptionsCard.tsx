"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/types";
import { monthlyPrice, monthlyTotal, formatCurrency } from "@/lib/finance";

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

  const total = monthlyTotal(subscriptions);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedPrice = Number(price);
    if (!name.trim() || !parsedPrice || parsedPrice <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      price: parsedPrice,
      cycle,
    });

    setName("");
    setPrice("");
    setCycle("monthly");
    setShowForm(false);
  }

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 hover:border-[#333333] transition-all">
      <p className="text-xs font-medium text-[#888888] uppercase tracking-wider">
        Aylık Abonelikler
      </p>

      <div className="flex items-baseline justify-between mt-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          {formatCurrency(total)} <span className="text-lg text-[#888888]">TL</span>
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs bg-[#ededed] text-[#060606] px-3 py-1.5 rounded-full font-medium hover:opacity-90"
        >
          {showForm ? "Vazgeç" : "Ekle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2 border-t border-[#222222] pt-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Abonelik adı (örn. Netflix)"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm placeholder:text-[#666666] focus:outline-none focus:border-[#444444]"
          />
          <div className="flex gap-2">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Fiyat"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm placeholder:text-[#666666] focus:outline-none focus:border-[#444444]"
            />
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value as "monthly" | "yearly")}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#444444]"
            >
              <option value="monthly">Aylık</option>
              <option value="yearly">Yıllık</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#ededed] text-[#060606] rounded-lg py-2 text-sm font-medium hover:opacity-90"
          >
            Kaydet
          </button>
        </form>
      )}

      {subscriptions.length > 0 && (
        <div className="mt-4 text-xs text-[#888888] space-y-1.5 border-t border-[#222222] pt-3">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="flex justify-between items-center group">
              <span className="text-[#cccccc]">{sub.name}</span>
              <div className="flex items-center gap-2">
                <span>
                  {formatCurrency(monthlyPrice(sub))} TL
                  {sub.cycle === "yearly" && <span className="text-[#555555]">/ay</span>}
                </span>
                <button
                  onClick={() => onRemove(sub.id)}
                  aria-label={`${sub.name} aboneliğini sil`}
                  className="text-[#555555] hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
