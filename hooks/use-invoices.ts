"use client";

import { useEffect, useState, useCallback } from "react";

export interface Invoice {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  stripe_invoice_id: string;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/invoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");

      const json = await res.json();
      setInvoices(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, refetch: fetchInvoices };
}
