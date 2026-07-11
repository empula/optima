"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

function getServerSnapshot() {
  return null;
}

// SSR-safe localStorage-backed state via useSyncExternalStore: renders
// initialValue on the server and first paint, then syncs to the real
// stored value once mounted on the client.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (callback: Listener) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      const set = listeners.get(key)!;
      set.add(callback);
      return () => set.delete(callback);
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    return window.localStorage.getItem(key);
  }, [key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = raw !== null ? (JSON.parse(raw) as T) : initialValue;

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const currentRaw = window.localStorage.getItem(key);
      const current = currentRaw !== null ? (JSON.parse(currentRaw) as T) : initialValue;
      const next =
        typeof updater === "function" ? (updater as (prev: T) => T)(current) : updater;
      window.localStorage.setItem(key, JSON.stringify(next));
      emit(key);
    },
    [key, initialValue]
  );

  return [value, setValue] as const;
}
