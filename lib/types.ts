export type BillingCycle = "monthly" | "yearly" | "installment";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  cycle: BillingCycle;
  paymentMethod?: string;
  installmentMonths?: number;
  createdAt: string; // ISO date string, used to compute remaining installments
}
