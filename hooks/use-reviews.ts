"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface ReviewsMeta {
  avg_rating: number | null;
  total: number;
  limit: number;
  offset: number;
}

interface SubmitReviewInput {
  rating: number;
  title?: string;
  content?: string;
}

export function useReviews(targetType: string, targetId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<ReviewsMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!targetType || !targetId) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ target_type: targetType, target_id: targetId });
      const res = await fetch(`/api/reviews?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to fetch reviews");
      setReviews(json.data || []);
      setMeta(json.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submit = useCallback(async (input: SubmitReviewInput): Promise<Review | null> => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, ...input }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to submit review");
      const review: Review = json.data;
      setReviews((prev) => [review, ...prev]);
      setMeta((prev) =>
        prev
          ? {
              ...prev,
              total: prev.total + 1,
              avg_rating:
                prev.avg_rating !== null
                  ? Math.round(((prev.avg_rating * prev.total + input.rating) / (prev.total + 1)) * 10) / 10
                  : input.rating,
            }
          : null
      );
      return review;
    } catch (err) {
      console.error("Failed to submit review:", err);
      return null;
    }
  }, [targetType, targetId]);

  const deleteReview = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete review");
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setMeta((prev) => prev ? { ...prev, total: Math.max(0, prev.total - 1) } : null);
      return true;
    } catch (err) {
      console.error("Failed to delete review:", err);
      return false;
    }
  }, []);

  return { reviews, meta, isLoading, error, submit, deleteReview, refresh: fetchReviews };
}
