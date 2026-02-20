"use client";

import { useState, useEffect, useCallback } from "react";

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string | null;
  folder: string;
  created_at: string;
}

interface UseMediaOptions {
  search?: string;
  folder?: string | null;
}

export function useMedia(options: UseMediaOptions = {}) {
  const { search, folder } = options;
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (folder) params.set("folder", folder);

      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) throw new Error("Failed to fetch media");
      const data = await res.json();
      setMediaFiles(data.files ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [search, folder]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const deleteMediaFile = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        setMediaFiles((prev) => prev.filter((f) => f.id !== id));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      }
    },
    []
  );

  return {
    mediaFiles,
    loading,
    error,
    refetch: fetchMedia,
    deleteMediaFile,
  };
}
