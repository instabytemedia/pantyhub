/**
 * Payment — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type CreatePaymentInput = Omit<Payment, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdatePaymentInput = Partial<CreatePaymentInput>;

export const PaymentStatusValues = ["pending", "completed", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PaymentStatusValues)[number];
