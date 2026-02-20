/**
 * Profile type definition.
 * Represents a row in the `profiles` table linked to auth.users.
 */
export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}
