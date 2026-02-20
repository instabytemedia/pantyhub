/**
 * Notification — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "mention" | "follow" | "like";
  read: boolean;
  action_url: string;
  sender_id: string;
  created_at: string;
  updated_at: string;
}

export type CreateNotificationInput = Omit<Notification, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateNotificationInput = Partial<CreateNotificationInput>;

export const NotificationTypeValues = ["info", "success", "warning", "error", "mention", "follow", "like"] as const;
export type NotificationType = (typeof NotificationTypeValues)[number];
