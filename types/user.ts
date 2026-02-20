/**
 * User — TypeScript Types
 * Auto-generated from entity definition
 */

export interface User {
  id: string;
  user_id: string;
  username: string; // The user's username
  email: string; // The user's email address
  password: string; // The user's password
  role: "buyer" | "seller"; // The user's role on the platform
  created_at: string;
  updated_at: string;
}

export type CreateUserInput = Omit<User, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateUserInput = Partial<CreateUserInput>;

export const UserRoleValues = ["buyer", "seller"] as const;
export type UserRole = (typeof UserRoleValues)[number];
