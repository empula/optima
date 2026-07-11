"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const timeout = setTimeout(update, 0);
    const interval = setInterval(update, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  if (!now) return null;

  const time = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  return (
    <div className="text-right">
      <p className="text-sm font-medium text-[var(--text-primary)] tabular-nums">{time}</p>
      <p className="text-[10px] text-[var(--text-faint)]">{date}</p>
    </div>
  );
}
