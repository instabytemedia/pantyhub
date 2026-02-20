"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Client-side hook that tracks the current Supabase auth session.
 * Subscribes to onAuthStateChange for real-time session updates
 * (login, logout, token refresh, password recovery).
 */
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial user (validates JWT with Supabase server)
    supabase.auth.getUser().then(({ data: { user: initialUser } }) => {
      setUser(initialUser);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
}
