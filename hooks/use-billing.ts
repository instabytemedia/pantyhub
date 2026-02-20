"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface SubscriptionInfo {
  status: string | null;
  isActive: boolean;
  isPro: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    status: null,
    isActive: false,
    isPro: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

      const status = profile?.subscription_status || null;
      setSubscription({
        status,
        isActive: status === "active" || status === "trialing",
        isPro: status === "active" || status === "trialing",
      });
      setIsLoading(false);
    }

    loadSubscription();
  }, [supabase]);

  async function openCheckout(priceId: string) {
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function openPortal() {
    const res = await fetch("/api/payments/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return { ...subscription, isLoading, openCheckout, openPortal };
}
