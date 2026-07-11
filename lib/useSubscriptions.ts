"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Subscription } from "./types";

interface SubscriptionRow {
  id: string;
  name: string;
  price: number;
  cycle: "monthly" | "yearly" | "installment";
  payment_method: string | null;
  installment_months: number | null;
  created_at: string;
}

function fromRow(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    cycle: row.cycle,
    paymentMethod: row.payment_method ?? undefined,
    installmentMonths: row.installment_months ?? undefined,
    createdAt: row.created_at,
  };
}

const SUBSCRIPTION_COLUMNS =
  "id, name, price, cycle, payment_method, installment_months, created_at";

export function useSubscriptions(userId: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("subscriptions")
      .select(SUBSCRIPTION_COLUMNS)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setSubscriptions(data.map(fromRow));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const addSubscription = useCallback(
    async (sub: Omit<Subscription, "id" | "createdAt">) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          name: sub.name,
          price: sub.price,
          cycle: sub.cycle,
          payment_method: sub.paymentMethod ?? null,
          installment_months: sub.installmentMonths ?? null,
        })
        .select(SUBSCRIPTION_COLUMNS)
        .single();

      if (error) throw error;
      if (data) setSubscriptions((prev) => [...prev, fromRow(data)]);
    },
    [userId]
  );

  const updateSubscription = useCallback(
    async (id: string, sub: Omit<Subscription, "id" | "createdAt">) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          name: sub.name,
          price: sub.price,
          cycle: sub.cycle,
          payment_method: sub.paymentMethod ?? null,
          installment_months: sub.installmentMonths ?? null,
        })
        .eq("id", id)
        .select(SUBSCRIPTION_COLUMNS)
        .single();

      if (error) throw error;
      if (data) {
        const updated = fromRow(data);
        setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      }
    },
    []
  );

  const removeSubscription = useCallback(async (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("subscriptions").delete().eq("id", id);
  }, []);

  return { subscriptions, loading, addSubscription, updateSubscription, removeSubscription };
}
