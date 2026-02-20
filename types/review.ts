/**
 * Review — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Review {
  id: string;
  user_id: string;
  rating: number; // The rating of the review
  feedback: string; // The feedback of the review
  created_at: string;
  updated_at: string;
}

export type CreateReviewInput = Omit<Review, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateReviewInput = Partial<CreateReviewInput>;


