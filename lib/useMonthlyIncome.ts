"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useMonthlyIncome(userId: string) {
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("profiles")
      .select("monthly_income")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setIncome(data.monthly_income);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const updateIncome = useCallback(
    async (value: number) => {
      const { error } = await supabase.from("profiles").upsert({
        user_id: userId,
        monthly_income: value,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setIncome(value);
    },
    [userId]
  );

  return { income, loading, updateIncome };
}
