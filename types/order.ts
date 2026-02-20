/**
 * Order — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Order {
  id: string;
  user_id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | "refunded";
  payment_intent_id: string;
  created_at: string;
  updated_at: string;
}

export type CreateOrderInput = Omit<Order, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateOrderInput = Partial<CreateOrderInput>;

export const OrderStatusValues = ["pending", "paid", "shipped", "completed", "cancelled", "refunded"] as const;
export type OrderStatus = (typeof OrderStatusValues)[number];
