/**
 * Listing — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Listing {
  id: string;
  user_id: string;
  title: string; // The title of the listing
  description: string; // The description of the listing
  price: number; // The price of the listing
  status: "available" | "sold"; // The status of the listing
  created_at: string;
  updated_at: string;
}

export type CreateListingInput = Omit<Listing, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateListingInput = Partial<CreateListingInput>;

export const ListingStatusValues = ["available", "sold"] as const;
export type ListingStatus = (typeof ListingStatusValues)[number];
