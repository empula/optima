"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusSession } from "@/lib/types";
import { todayMinutes } from "@/lib/focus";

const FOCUS_MINUTES = 25;
const FOCUS_SECONDS = FOCUS_MINUTES * 60;

interface Props {
  sessions: FocusSession[];
  onComplete: (session: FocusSession) => void;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function FocusCard({ sessions, onComplete }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          onComplete({
            id: crypto.randomUUID(),
            minutes: FOCUS_MINUTES,
            completedAt: new Date().toISOString(),
          });
          return FOCUS_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function reset() {
    setRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
  }

  const minutesToday = todayMinutes(sessions);

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 hover:border-[#333333] transition-all">
      <p className="text-xs font-medium text-[#888888] uppercase tracking-wider">
        Odaklanma Modu
      </p>
      <div className="flex items-center justify-between mt-3">
        <div>
          <h2 className="text-4xl font-mono font-medium tracking-tight">
            {formatTime(secondsLeft)}
          </h2>
          <p className="text-xs text-[#888888] mt-1">Bugün: {minutesToday} dk odaklanıldı</p>
        </div>
        <div className="flex gap-2">
          {secondsLeft !== FOCUS_SECONDS && (
            <button
              onClick={reset}
              aria-label="Sıfırla"
              className="bg-[#1d1d1f] border border-[#333333] text-[#888888] w-11 h-11 rounded-xl text-sm hover:bg-[#222222]"
            >
              ↺
            </button>
          )}
          <button
            onClick={() => setRunning((r) => !r)}
            className="bg-[#1d1d1f] border border-[#333333] text-[#ededed] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#222222]"
          >
            {running ? "Duraklat" : "Başlat"}
          </button>
        </div>
      </div>
    </div>
  );
}
