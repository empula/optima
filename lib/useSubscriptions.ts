"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Subscription } from "./types";

interface SubscriptionRow {
  id: string;
  name: string;
  price: number;
  cycle: "monthly" | "yearly";
  payment_method: string | null;
}

function fromRow(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    cycle: row.cycle,
    paymentMethod: row.payment_method ?? undefined,
  };
}

export function useSubscriptions(userId: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("subscriptions")
      .select("id, name, price, cycle, payment_method")
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
    async (sub: Omit<Subscription, "id">) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          name: sub.name,
          price: sub.price,
          cycle: sub.cycle,
          payment_method: sub.paymentMethod ?? null,
        })
        .select("id, name, price, cycle, payment_method")
        .single();

      if (!error && data) setSubscriptions((prev) => [...prev, fromRow(data)]);
    },
    [userId]
  );

  const removeSubscription = useCallback(async (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("subscriptions").delete().eq("id", id);
  }, []);

  return { subscriptions, loading, addSubscription, removeSubscription };
}
