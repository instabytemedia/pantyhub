/**
 * Channel — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Channel {
  id: string;
  user_id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export type CreateChannelInput = Omit<Channel, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateChannelInput = Partial<CreateChannelInput>;


