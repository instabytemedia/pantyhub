import { createClient } from "@/lib/supabase/client";
import { getBucketConfig, validateFile } from "./storage-config";

export interface UploadResult {
  path: string;
  url: string;
  fullPath: string;
}

export interface StorageError {
  code: string;
  message: string;
}

/**
 * Generate a unique file path with timestamp prefix.
 */
function generatePath(filename: string, folder?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const prefix = folder ? `${folder}/` : "";
  return `${prefix}${timestamp}-${random}-${sanitized}`;
}

/**
 * Upload a file to Supabase Storage.
 */
export async function uploadFile(
  file: File,
  bucketName: string,
  options?: {
    folder?: string;
    upsert?: boolean;
  }
): Promise<{ data: UploadResult | null; error: StorageError | null }> {
  const bucket = getBucketConfig(bucketName);

  // Validate
  const validation = validateFile(
    { type: file.type, size: file.size },
    bucket
  );
  if (!validation.valid) {
    return {
      data: null,
      error: { code: "VALIDATION", message: validation.error! },
    };
  }

  const supabase = createClient();
  const path = generatePath(file.name, options?.folder);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: options?.upsert ?? false,
      contentType: file.type,
    });

  if (error) {
    return {
      data: null,
      error: { code: "UPLOAD_FAILED", message: error.message },
    };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(data.path);

  return {
    data: {
      path: data.path,
      url: publicUrl,
      fullPath: data.fullPath ?? `${bucketName}/${data.path}`,
    },
    error: null,
  };
}

/**
 * Download a file as a Blob.
 */
export async function downloadFile(
  bucketName: string,
  path: string
): Promise<{ data: Blob | null; error: StorageError | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(path);

  if (error) {
    return {
      data: null,
      error: { code: "DOWNLOAD_FAILED", message: error.message },
    };
  }

  return { data, error: null };
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(
  bucketName: string,
  path: string
): Promise<{ error: StorageError | null }> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucketName).remove([path]);

  if (error) {
    return { error: { code: "DELETE_FAILED", message: error.message } };
  }

  return { error: null };
}

/**
 * Delete multiple files from storage.
 */
export async function deleteFiles(
  bucketName: string,
  paths: string[]
): Promise<{ error: StorageError | null }> {
  if (paths.length === 0) return { error: null };

  const supabase = createClient();

  const { error } = await supabase.storage.from(bucketName).remove(paths);

  if (error) {
    return { error: { code: "DELETE_FAILED", message: error.message } };
  }

  return { error: null };
}

/**
 * Get a public URL for a file.
 */
export function getPublicUrl(bucketName: string, path: string): string {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(path);
  return publicUrl;
}

/**
 * List files in a storage path.
 */
export async function listFiles(
  bucketName: string,
  folder?: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  data: Array<{
    name: string;
    id: string;
    created_at: string;
    metadata: Record<string, unknown>;
  }> | null;
  error: StorageError | null;
}> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folder ?? "", {
      limit: options?.limit ?? 100,
      offset: options?.offset ?? 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    return {
      data: null,
      error: { code: "LIST_FAILED", message: error.message },
    };
  }

  return { data: data as any, error: null };
}
