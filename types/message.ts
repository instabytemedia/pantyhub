/**
 * Message — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Message {
  id: string;
  user_id: string;
  content: string;
  conversation_id: string;
  sender_id: string;
  message_type: "text" | "image" | "file" | "system";
  read_at: string;
  created_at: string;
  updated_at: string;
}

export type CreateMessageInput = Omit<Message, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateMessageInput = Partial<CreateMessageInput>;

export const MessageMessageTypeValues = ["text", "image", "file", "system"] as const;
export type MessageMessageType = (typeof MessageMessageTypeValues)[number];
