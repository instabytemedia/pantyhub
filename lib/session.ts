import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
};

/**
 * Get the current session user or null.
 * Uses supabase.auth.getUser() which validates the JWT against Supabase,
 * making it safe for server-side authorization.
 *
 * Use in Server Components and Route Handlers.
 */
export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    user_metadata: user.user_metadata ?? {},
  };
}

/**
 * Get the current session user or redirect to login.
 * Use in protected Server Components to guarantee the user is authenticated.
 *
 * @param redirectTo - Path to redirect to after login (defaults to current page)
 */
export async function requireSession(redirectTo?: string): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    const loginPath = redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login";
    redirect(loginPath);
  }
  return session;
}
