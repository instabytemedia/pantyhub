# Feature: Auth — PantyHub

> **Feature Type:** DYNAMIC (custom feature — no pre-defined entities)
> **Complexity:** Low–Medium
> **Dependencies:** Auth, Database
> **Goal:** Implement "Auth" as a fully functional feature

---

## Tasks

### Task 1: Define Data Model

Review the project requirements and define what data "Auth" needs:
- What tables are needed? Create them in `supabase/schema.sql`
- Add `id`, `user_id`, `created_at`, `updated_at` columns at minimum
- Set up RLS policies: users own their data
- Add appropriate indexes

### Task 2: API / Repository Layer

Create API routes in `app/api/auth/`:
- `GET` — list (paginated)
- `POST` — create (with Zod validation)
- `GET /[id]` — detail
- `PUT /[id]` — update
- `DELETE /[id]` — delete

### Task 3: UI Screens

Create pages:
- `app/(app)/auth/page.tsx` — list with pagination and empty state
- `app/(app)/auth/new/page.tsx` — create form
- `app/(app)/auth/[id]/page.tsx` — detail
- `app/(app)/auth/[id]/edit/page.tsx` — edit form

### Task 4: Navigation

Add "Auth" to the sidebar/navigation so users can access it.

---

## Checkpoint

- [ ] Database table(s) exist with RLS
- [ ] CRUD operations work
- [ ] List + form + detail pages render correctly
- [ ] Navigation link present
- [ ] `npm run build` passes


---

> **🎨 Design:** Follow `docs/DESIGN_SYSTEM.md` for colors, typography, component patterns, and hover states. NEVER hardcode colors — use CSS variables.
