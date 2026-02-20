# Extending PantyHub

## Adding a New Entity

1. Type: `types/{entity}.ts`
2. Schema: `lib/schemas/{entity}.ts`
3. API List: `app/api/{entities}/route.ts`
4. API Detail: `app/api/{entities}/[id]/route.ts`
5. Hook: `hooks/use-{entities}.ts`
6. List Page: `app/(app)/{entities}/page.tsx`
7. Detail Page: `app/(app)/{entities}/[id]/page.tsx`
8. Create Page: `app/(app)/{entities}/new/page.tsx`
9. Edit Page: `app/(app)/{entities}/[id]/edit/page.tsx`
10. Form: `components/{entity}/{entity}-form.tsx`
11. Card: `components/{entity}/{entity}-card.tsx`
12. Nav: Update `components/layout/header.tsx`

## Adding a Page

1. Page: `app/(app)/{name}/page.tsx`
2. Loading: `app/(app)/{name}/loading.tsx`
3. Add to navigation

## API Route Pattern

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  // ... query
}
```

## Copy, Don't Invent

Read existing files. Copy patterns. Maintain consistency.
