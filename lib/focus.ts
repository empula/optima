import type { FocusSession } from "./types";

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function todayMinutes(sessions: FocusSession[]): number {
  return sessions
    .filter((s) => isToday(s.completedAt))
    .reduce((sum, s) => sum + s.minutes, 0);
}
