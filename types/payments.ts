export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded"
  | "canceled";

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customerId: string;
  metadata: Record<string, string>;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bank_account" | "other";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface CheckoutSessionParams {
  amount: number;
  currency: string;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  mode: "payment" | "subscription";
  metadata?: Record<string, string>;
  lineItems?: Array<{
    name: string;
    amount: number;
    quantity: number;
    recurring?: {
      interval: "month" | "year";
    };
  }>;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface RefundParams {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResult {
  id: string;
  amount: number;
  status: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: "active" | "past_due" | "canceled" | "trialing" | "incomplete";
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}
