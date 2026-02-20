/**
 * MediaCloud — TypeScript Types
 * Auto-generated from entity definition
 */

export interface MediaCloud {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "active" | "inactive" | "archived";
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type CreateMediaCloudInput = Omit<MediaCloud, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateMediaCloudInput = Partial<CreateMediaCloudInput>;

export const MediaCloudStatusValues = ["active", "inactive", "archived"] as const;
export type MediaCloudStatus = (typeof MediaCloudStatusValues)[number];
