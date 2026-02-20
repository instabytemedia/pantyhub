"use client";

import { useState, useEffect, useCallback } from "react";

interface ReactionGroup {
  emoji: string;
  count: number;
  user_ids: string[];
}

interface UseReactionsReturn {
  reactions: ReactionGroup[];
  isLoading: boolean;
  error: string | null;
  toggle: (emoji: string) => Promise<void>;
  hasReacted: (emoji: string, userId: string) => boolean;
  refresh: () => void;
}

export function useReactions(
  targetType: string,
  targetId: string
): UseReactionsReturn {
  const [reactions, setReactions] = useState<ReactionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ target_type: targetType, target_id: targetId });
      const res = await fetch(`/api/reactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch reactions");
      const data = await res.json();
      setReactions(data.reactions ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const toggle = useCallback(
    async (emoji: string) => {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          emoji,
        }),
      });

      if (res.ok) {
        // Refetch to get accurate counts
        fetchReactions();
      }
    },
    [targetType, targetId, fetchReactions]
  );

  const hasReacted = useCallback(
    (emoji: string, userId: string) => {
      const group = reactions.find((r) => r.emoji === emoji);
      return group?.user_ids.includes(userId) ?? false;
    },
    [reactions]
  );

  return { reactions, isLoading, error, toggle, hasReacted, refresh: fetchReactions };
}
