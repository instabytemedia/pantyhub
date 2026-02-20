# Optional: Reviews & Ratings — PantyHub

> **Feature Type:** OPTIONAL
> **Complexity:** Medium
> **Dependencies:** Auth, Database, Entity CRUD
> **Goal:** User reviews and ratings with star display and averages

---

## Tasks

### Task RV.1: Database Schema

```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX idx_reviews_entity ON reviews(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(entity_type, entity_id, rating);
```

**RLS:** Users can create/edit/delete own reviews. All reviews are publicly readable.

### Task RV.2: Review API

- `POST /api/reviews` — create or update review (`{ entity_type, entity_id, rating, title?, body? }`)
  - Upsert on `(user_id, entity_type, entity_id)`
  - Zod: rating `z.number().int().min(1).max(5)`
- `GET /api/reviews?entity_type=...&entity_id=...` — list reviews for entity (paginated, newest first)
- `DELETE /api/reviews/[id]` — delete own review
- `GET /api/reviews/average?entity_type=...&entity_id=...` — returns `{ average, count }`

### Task RV.3: Star Rating Component

- Reusable `StarRating` component
- Props: `rating` (display mode) or `onRatingChange` (interactive mode)
- Display: filled/half/empty stars using Lucide icons
- Sizes: small (inline) and large (form input)

### Task RV.4: Review Form Component

- Modal or inline form with:
  - Star rating selector (required)
  - Title input (optional)
  - Body textarea (optional)
  - Submit button with loading state
- Show current user's existing review for editing
- Success toast on submit

### Task RV.5: Average Rating Display

- Inline component: stars + "4.2 (18 reviews)"
- Place on entity cards and detail page headers
- Fetch via `/api/reviews/average` or compute client-side from loaded reviews

### Task RV.6: Review List on Entity Pages

- Display on entity detail pages below content
- Each review: user avatar + name + stars + title + body + relative time
- Sort: newest first (option for highest/lowest rated)
- Pagination: "Load more" button
- Empty state: "No reviews yet. Be the first!"

---

## Checkpoint

- [ ] Reviews table exists with RLS and unique constraint
- [ ] Star rating component works (display + interactive)
- [ ] Users can submit, edit, and delete reviews
- [ ] Average rating displayed on entity cards and detail pages
- [ ] Review list shows on entity detail pages
- [ ] `npm run build` passes


---

> **🎨 Design:** Follow `docs/DESIGN_SYSTEM.md` for colors, typography, component patterns, and hover states. NEVER hardcode colors — use CSS variables.
