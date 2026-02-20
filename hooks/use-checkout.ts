"use client";

import { useState, useCallback } from "react";

export type CheckoutStep = "review" | "payment" | "confirmation";

interface CheckoutItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface UseCheckoutOptions {
  items?: CheckoutItem[];
}

export function useCheckout(options?: UseCheckoutOptions) {
  const [step, setStep] = useState<CheckoutStep>("review");
  const [items, setItems] = useState<CheckoutItem[]>(options?.items ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const addItem = useCallback((item: CheckoutItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  }, []);

  const processCheckout = useCallback(async (metadata?: Record<string, string>) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            amount: item.unitPrice,
            quantity: item.quantity,
          })),
          metadata,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Checkout failed");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        setStep("confirmation");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }, [items]);

  return {
    step,
    setStep,
    items,
    total,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    processCheckout,
  };
}
