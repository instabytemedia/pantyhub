"use client";

import { useEffect, useState, useCallback } from "react";

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_popular: boolean;
  sort_order: number;
}

export function usePlans() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/plans");
      if (!res.ok) throw new Error("Failed to fetch plans");

      const json = await res.json();
      setPlans(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
}
