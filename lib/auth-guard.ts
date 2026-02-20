import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Server-side auth guard for API route handlers.
 * Returns the authenticated user or a 401 JSON response.
 *
 * Usage in route handlers:
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const { user, error } = await withAuth(request);
 *   if (error) return error;
 *   // user is guaranteed to exist here
 *   return NextResponse.json({ userId: user.id });
 * }
 * ```
 */
export async function withAuth(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Route handlers cannot set cookies in responses this way;
          // cookie refresh is handled by middleware.
        },
      },
    }
  );

  // IMPORTANT: Use getUser() not getSession() for server-side validation.
  // getUser() sends a request to Supabase to validate the JWT,
  // while getSession() only reads from cookies and can be spoofed.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      ),
    };
  }

  return { user, error: null };
}
