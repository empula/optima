export type BillingCycle = "monthly" | "yearly";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  cycle: BillingCycle;
}

export interface FocusSession {
  id: string;
  minutes: number;
  completedAt: string; // ISO date string
}
