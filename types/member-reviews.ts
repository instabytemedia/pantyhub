/**
 * MemberReviews — TypeScript Types
 * Auto-generated from entity definition
 */

export interface MemberReviews {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "active" | "inactive" | "archived";
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type CreateMemberReviewsInput = Omit<MemberReviews, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateMemberReviewsInput = Partial<CreateMemberReviewsInput>;

export const MemberReviewsStatusValues = ["active", "inactive", "archived"] as const;
export type MemberReviewsStatus = (typeof MemberReviewsStatusValues)[number];
