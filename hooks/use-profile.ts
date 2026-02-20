"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";

export type { Profile };

/**
 * Client-side hook for fetching and updating the current user's profile.
 * Automatically fetches the profile on mount using the authenticated user's ID.
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        // If profile doesn't exist yet, that's not necessarily an error for new users
        if (fetchError.code === "PGRST116") {
          setError(null);
        } else {
          setError(fetchError.message);
        }
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [supabase]);

  const updateProfile = useCallback(
    async (updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>) => {
      if (!profile) return { error: "No profile loaded" };

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", profile.id);

      if (updateError) return { error: updateError.message };

      setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
      return { error: null };
    },
    [profile, supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (!profile?.id) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .single();
    if (data) setProfile(data);
  }, [profile?.id, supabase]);

  return { profile, loading, error, updateProfile, refreshProfile };
}
