/**
 * Conversation — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  is_group: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export type CreateConversationInput = Omit<Conversation, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateConversationInput = Partial<CreateConversationInput>;


