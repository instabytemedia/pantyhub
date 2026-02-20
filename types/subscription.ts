/**
 * Subscription — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan_name: string;
  price_amount: number;
  interval: "monthly" | "yearly";
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export type CreateSubscriptionInput = Omit<Subscription, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateSubscriptionInput = Partial<CreateSubscriptionInput>;

export const SubscriptionIntervalValues = ["monthly", "yearly"] as const;
export type SubscriptionInterval = (typeof SubscriptionIntervalValues)[number];

export const SubscriptionStatusValues = ["active", "canceled", "past_due", "trialing", "incomplete"] as const;
export type SubscriptionStatus = (typeof SubscriptionStatusValues)[number];
