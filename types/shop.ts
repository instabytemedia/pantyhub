/**
 * Shop — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Shop {
  id: string;
  user_id: string;
  name: string; // The name of the shop
  description: string; // The description of the shop
  created_at: string;
  updated_at: string;
}

export type CreateShopInput = Omit<Shop, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateShopInput = Partial<CreateShopInput>;


