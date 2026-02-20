/**
 * Upload — TypeScript Types
 * Auto-generated from entity definition
 */

export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  alt_text: string;
  created_at: string;
  updated_at: string;
}

export type CreateUploadInput = Omit<Upload, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateUploadInput = Partial<CreateUploadInput>;


