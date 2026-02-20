"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  body: string;
  target_type: string;
  target_id: string;
  parent_id: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  addComment: (body: string, parentId?: string) => Promise<void>;
  editComment: (id: string, body: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useComments(
  targetType: string,
  targetId: string
): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ target_type: targetType, target_id: targetId });
      const res = await fetch(`/api/comments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data.items ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(
    async (body: string, parentId?: string) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          parent_id: parentId ?? null,
          body,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
      }
    },
    [targetType, targetId]
  );

  const editComment = useCallback(async (id: string, body: string) => {
    const res = await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, body }),
    });

    if (res.ok) {
      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
    }
  }, []);

  const deleteComment = useCallback(async (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
  }, []);

  return {
    comments,
    isLoading,
    error,
    addComment,
    editComment,
    deleteComment,
    refresh: fetchComments,
  };
}
