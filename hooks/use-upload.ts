"use client";

import { useState, useCallback, useRef } from "react";
import { uploadFile } from "@/lib/storage";

export interface UploadItem {
  id: string;
  file: File;
  preview: string | null;
  status: "pending" | "uploading" | "complete" | "error";
  progress: number;
  url: string | null;
  error: string | null;
}

interface UseUploadOptions {
  bucket: string;
  folder?: string;
  onAllComplete?: (urls: string[]) => void;
}

export function useUpload(options: UseUploadOptions) {
  const { bucket, folder, onAllComplete } = options;
  const [items, setItems] = useState<UploadItem[]>([]);
  const completedUrlsRef = useRef<string[]>([]);

  const addFiles = useCallback((files: File[]) => {
    const newItems: UploadItem[] = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        id: crypto.randomUUID(),
        file,
        preview: isImage ? URL.createObjectURL(file) : null,
        status: "pending" as const,
        progress: 0,
        url: null,
        error: null,
      };
    });
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const uploadSingle = useCallback(
    async (item: UploadItem) => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "uploading" as const, progress: 10 } : i
        )
      );

      // Simulate progress
      const progressInterval = setInterval(() => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && i.status === "uploading"
              ? { ...i, progress: Math.min(i.progress + 15, 90) }
              : i
          )
        );
      }, 200);

      try {
        const result = await uploadFile(item.file, bucket, { folder });

        clearInterval(progressInterval);

        if (result.error) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "error" as const, progress: 0, error: result.error!.message }
                : i
            )
          );
        } else {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "complete" as const, progress: 100, url: result.data!.url }
                : i
            )
          );
          completedUrlsRef.current.push(result.data!.url);
        }
      } catch (err) {
        clearInterval(progressInterval);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "error" as const,
                  progress: 0,
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : i
          )
        );
      }
    },
    [bucket, folder]
  );

  const uploadAll = useCallback(async () => {
    const pending = items.filter((i) => i.status === "pending");
    completedUrlsRef.current = [];

    await Promise.all(pending.map(uploadSingle));

    if (completedUrlsRef.current.length > 0) {
      onAllComplete?.(completedUrlsRef.current);
    }
  }, [items, uploadSingle, onAllComplete]);

  const clearCompleted = useCallback(() => {
    setItems((prev) => {
      for (const item of prev) {
        if (item.status === "complete" && item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      }
      return prev.filter((i) => i.status !== "complete");
    });
  }, []);

  return {
    items,
    addFiles,
    removeItem,
    uploadAll,
    clearCompleted,
    isUploading: items.some((i) => i.status === "uploading"),
    completedCount: items.filter((i) => i.status === "complete").length,
    totalCount: items.length,
  };
}
