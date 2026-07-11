"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { FocusSession } from "./types";

interface FocusSessionRow {
  id: string;
  minutes: number;
  completed_at: string;
}

function fromRow(row: FocusSessionRow): FocusSession {
  return {
    id: row.id,
    minutes: row.minutes,
    completedAt: row.completed_at,
  };
}

export function useFocusSessions(userId: string) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("focus_sessions")
      .select("id, minutes, completed_at")
      .order("completed_at", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setSessions(data.map(fromRow));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const addSession = useCallback(
    async (session: Omit<FocusSession, "id">) => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
          user_id: userId,
          minutes: session.minutes,
          completed_at: session.completedAt,
        })
        .select("id, minutes, completed_at")
        .single();

      if (!error && data) setSessions((prev) => [...prev, fromRow(data)]);
    },
    [userId]
  );

  return { sessions, loading, addSession };
}
