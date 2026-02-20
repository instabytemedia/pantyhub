/**
 * Storage bucket configuration.
 * Defines bucket names, allowed types, and size limits.
 */

export interface BucketConfig {
  name: string;
  public: boolean;
  allowedMimeTypes: string[];
  maxFileSizeMB: number;
}

export const STORAGE_BUCKETS: Record<string, BucketConfig> = {
  avatars: {
    name: "avatars",
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxFileSizeMB: 5,
  },
  media: {
    name: "media",
    public: true,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
    ],
    maxFileSizeMB: 50,
  },
  documents: {
    name: "documents",
    public: false,
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
    ],
    maxFileSizeMB: 25,
  },
  attachments: {
    name: "attachments",
    public: false,
    allowedMimeTypes: ["*/*"],
    maxFileSizeMB: 100,
  },
} as const;

/**
 * Get bucket config by name, or return the attachments bucket as fallback.
 */
export function getBucketConfig(bucketName: string): BucketConfig {
  return STORAGE_BUCKETS[bucketName] ?? STORAGE_BUCKETS.attachments;
}

/**
 * Validate a file against a bucket's constraints.
 */
export function validateFile(
  file: { type: string; size: number },
  bucket: BucketConfig
): { valid: boolean; error?: string } {
  // Check MIME type
  if (
    !bucket.allowedMimeTypes.includes("*/*") &&
    !bucket.allowedMimeTypes.includes(file.type)
  ) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Accepted: ${bucket.allowedMimeTypes.join(", ")}`,
    };
  }

  // Check size
  const maxBytes = bucket.maxFileSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds ${bucket.maxFileSizeMB}MB limit`,
    };
  }

  return { valid: true };
}
