> **AGENT.md — Sequential Build (Single-Agent Fallback)**
> This file is for single-agent tools (Windsurf, Cursor without multi-file mode, etc.).
> **If you are using Claude Code, use CLAUDE.md instead** — it runs 30 agents in parallel and is significantly faster.

---

# CLAUDE.md — Autonomous Build Engine v4.0

> **You are building PantyHub.**
> **Read docs/CONTEXT.md for all project details.**
> **Execute ALL phase files in docs/phases/ sequentially. Do not stop until all phases are complete.**

---

## Mission

Build a production-ready Next.js application by executing all phases across 9 blocks.
Each phase has its own instruction file in `docs/phases/`.
After each block, run a quality gate. Fix all errors before proceeding.

**Do not ask for permission. Do not wait for input. Do not ask questions. Execute autonomously from Phase 01 to the final phase. The build MUST complete 100% in one session.**


---

## Execution Protocol

### How to Run

1. **Read `docs/PROGRESS.md` FIRST** — check if any phases are already complete
2. If phases are ✅, skip to the first ⬜ phase
3. Read `docs/CONTEXT.md` — understand the project
4. Execute the next incomplete phase from `docs/phases/`
5. After each phase, update `docs/PROGRESS.md`
6. After each block's final phase, run the quality gate
7. If quality gate fails, fix errors and re-run
8. **If context window is getting full:** commit progress, update PROGRESS.md, tell user to continue in next session
9. After all phases are done, tell the user: "PantyHub is built. All phases complete."

### Phase Execution Pattern

For each phase:
```
1. List all files in docs/phases/ directory (ls docs/phases/)
2. Execute each file in alphabetical order (01, 02, 02b, 03, 04, 04b, ...)
3. Sub-phases (02b, 07b, etc.) are NOT optional — execute them immediately after their parent phase
4. Run: npx tsc --noEmit
5. If errors: fix them (max 3 attempts per error)
6. Report: ✓ Phase {filename} complete
7. Proceed to next file
```

### Universal Quality Checks

After EVERY phase, these checks MUST pass — you do NOT need to see them repeated in each phase's checklist:
- `npx tsc --noEmit` — zero type errors
- `npm run build` — successful build
- No broken imports or dead code

If a phase checklist lists these items, skip them (they're already covered here).

### Environment Variables Strategy

**Blocks A-D (Phases 01-27) require ZERO environment variables.** Everything compiles and runs with stubs.

- Phase 04 creates Supabase client stubs that return mock data when env vars are missing
- All API routes use the pattern: `if (!supabase) return NextResponse.json({ data: [] })`
- The landing page, all UI pages, and all entity pages work without any backend
- `npm run dev` shows a fully functional frontend with mock data

**Block E (Phases 28-33) is where env vars are needed.**
- Before Phase 28: the user sets up Supabase + fills .env.local
- Phases 28-33 wire up the real database, RLS, and auth
- If env vars are STILL missing: skip DB operations, keep stubs, add to TODO.md

**This means the app always compiles. Always renders. Always looks premium. Backend is the last layer.**

### Context Window Management

If you notice the context window is filling up:
1. **Commit all current work:** `git add -A && git commit -m "Progress: Block X complete"`
2. **Update PROGRESS.md** with exact status of every phase
3. **Tell the user:** "Block X complete. Continue in next session — I'll pick up from Phase NN."
4. The next session reads PROGRESS.md and continues from where you left off
5. **NEVER leave uncommitted work** — always save before stopping

---

## 9 Blocks

### Block A: Foundation (Phases 01-04) — NO env vars needed
```
01 - Project Init (Next.js, TypeScript)
02 - Dependencies + shadcn (init + components)
03 - Design System (globals.css, theme, tokens)
04 - Supabase Stubs + Env (mock fallback when env missing)
── Quality Gate A: npx tsc --noEmit && npm run build ──
```

### Block B: Visual Shell (Phases 05-11) — NO env vars needed
```
05 - Root Layout (html, fonts, Toaster)
06 - Landing Page (hero, features, CTA) — MUST work standalone
07 - Public Layout + Nav (header, footer)
08 - App Layout (authenticated shell, sidebar)
09 - Global Pages (404, loading, error)
10 - Legal Pages (imprint, privacy, terms)
11 - Dark Mode (CSS variables, toggle)
── Quality Gate B: npx tsc --noEmit && npm run build && npm run dev (verify landing renders) ──
```

### Block C: Entity System (Phases 12-21) — NO env vars needed (uses stubs)
```
12 - Entity Types + Schemas (TypeScript interfaces, Zod)
13 - API Routes (List, Create, Read, Update, Delete) — stub returns if no Supabase
14 - Hooks (SWR hooks for all entities)
15 - List Pages + Cards (with empty/loading states)
16 - Detail Pages (with not-found)
17 - Forms + Delete (create/edit forms, delete confirmation)
18 - Dashboard (stat cards, recent items)
19 - Dashboard States (loading skeleton, empty state)
20 - Settings Page (profile, theme, API route)
21 - Search + Pagination
── Quality Gate C: npx tsc --noEmit && npm run build ──
```

### Block D: UX Polish (Phases 22-27) — NO env vars needed
```
22 - Error States (boundaries at every level)
23 - Toasts (sonner notifications)
24 - Form UX (field errors, submit states)
25 - Loading Skeletons (per page)
26 - Mobile Responsive Pass
27 - Accessibility (ARIA, keyboard, contrast)
── Quality Gate D: npx tsc --noEmit && npm run build ──
```

### Block E: Infrastructure (Phases 28-33) — ⚠️ ENV VARS NEEDED HERE
```
⚠️ THIS IS THE ONLY BLOCK THAT NEEDS ENV VARS.
Before Phase 28, tell the user:
"Set up Supabase now. Follow docs/ENV_SETUP.md, then say 'continue'."

If the user has NOT set up env vars yet:
- Build Auth pages (32, 32b) anyway — they're just UI
- Create schema.sql as a file — user runs it later
- Skip RLS/Triggers (29, 30) — add to TODO.md
- Create auth middleware with env check fallback
- The app must STILL compile without env vars

28 - Database Schema (CREATE TABLE — generates SQL file)
29 - Row Level Security (RLS policies)
30 - Database Triggers (updated_at, profile creation)
31 - Auth Middleware (route protection — with stub fallback)
32 - Auth Pages (Login + Signup) — pure UI, no env needed
33 - Auth Callback + Signout (code exchange, button)
── Quality Gate E: npx tsc --noEmit && npm run build ──
```

### Block F: Production (Phases 34-38) — NO env vars needed
```
34 - Security + Rate Limiting (CSP, HSTS, rate limits)
35 - SEO + Sitemap (per-page metadata, robots.txt)
36 - Performance + Caching (dynamic imports, SWR config, Image)
37 - Developer Guide + README
38 - CI/CD + Deployment (GitHub Actions, health check)
── Quality Gate F: npx tsc --noEmit && npm run build ──
```

### Block G: Quality Assurance (Phases 39-45) — Final safety net
```
39 - Full Audit + Fix (visual, functional, code quality, design consistency)
39f - Design Polish (CRITICAL: elevate every page to premium quality)
40 - Final Build + Report (BUILD_REPORT.md)
41 - Gap Closer (fix ALL remaining TODOs, stubs, and issues)
42 - MVP Completeness Loop (LOOP: entities + features + navigation → fix → verify → repeat until ALL pass)
     ⚠️ ENFORCES: entity CRUD files, enabled feature implementations, sidebar navigation links
     ⚠️ For each enabled feature: READ docs/features/{feature}.md and implement ALL tasks
     ⚠️ Does NOT exit until ALL entities have all 10 files AND all features are implemented
43 - Premium UI Loop (LOOP: audit → polish → verify → repeat until premium)
44 - Smoke Test (start dev server, curl every route, fix 500s/404s)
45 - Git Init + First Commit (gitignore, secret check, clean commit, ready to push)
── Quality Gate G: npx tsc --noEmit && npm run build (MUST pass with zero errors) ──
```

### Block H: Build Proof (Phases 46-48) — Verification
```
46 - Build Proof (run ALL checks: typecheck, lint, build, placeholders, routes, smoke)
47 - Repair Loop (fix all failures from phase 46, max 4 cycles)
48 - Proof Pack (generate proof-summary.json with all check results)
── Quality Gate H: ALL proof checks must PASS (zero blockers) ──
```

### Block I: ShipGate (Phase 49) — Final Authority
```
49 - ShipGate (read proof-summary.json → SHIP_READY or SHIP_BLOCKED)
     If SHIP_BLOCKED: list specific blockers, fix them, re-run phase 46
     If SHIP_READY: the app is production-ready
── ShipGate: Binary verdict. No exceptions. ──
```

---

## Feature Integration Protocol

**This project has 7 feature(s).** Feature instructions are in `docs/features/`.

### Execution Rule

After completing a block's quality gate, check if any features are scheduled for that block:

1. Read `docs/CONTEXT.md` → Feature Registry table
2. For each feature whose "Execute After" matches the block you just completed:
   - Read the feature file (e.g., `docs/features/payments.md`)
   - Execute ALL tasks in the feature file
   - Run `npx tsc --noEmit` to verify no errors
3. Only then proceed to the next block

### Feature Schedule

**Block C (Entity System):**
  → Read `docs/features/payments.md`
  → Read `docs/features/uploads.md`
  → Read `docs/features/realtime.md`
  → Read `docs/features/search.md`
  → Read `docs/features/notifications.md`
  → Read `docs/features/messaging.md`
  → Read `docs/features/reviews.md`

### Phase-Level Feature Hooks

Some phases contain a `## Feature Integration` section at the bottom.
These are short hints like "If payments is enabled, also add Stripe columns."
Follow these hints as you encounter them — they ensure features integrate
at the right time rather than requiring retroactive changes.

When you later read the full feature file (e.g., `docs/features/payments.md`),
skip any tasks that were already completed via phase hooks.


---

## Universal Features

This project includes **21 always-on features** documented in `docs/UNIVERSAL_FEATURES.md`.

### When to Read
- **After Phase 01 (Project Init):** Read the Feature Index to understand the full scope
- **During each phase:** Check if any universal features affect that phase (use the "Affects Phases" field)
- Each spec tells you exactly what to build, which files to create, and how to verify

### Rule
These features are **NOT optional**. They are part of every build.
Do NOT skip them. The Feature Index in `docs/UNIVERSAL_FEATURES.md` maps each feature to its affected phases.

### Domains
1. **Identity & Access** (5 features): auth-email, auth-social, rbac, profile, account-settings
2. **Core Data** (5 features): crud-engine, validation, file-storage, audit-trail, data-export
3. **Interaction & Communication** (5 features): notifications, email, realtime, search, comments
4. **Monetization** (5 features): stripe-checkout, subscriptions, pricing, metering, invoices
5. **Intelligence & Automation** (5 features): analytics, errors, jobs, webhooks, ai
6. **Operations, Trust & Scale** (5 features): rate-limit, moderation, i18n, seo, dark-mode

---

## Phase Governance Protocol

**Every phase you execute must be documented with these 3 items in PROGRESS.md:**

### 1. Decision Log (per phase)

After completing a phase, record what was decided:

```markdown
### Phase {NN} — {Name}
**Decisions Made:**
- [DECISION] What: chose X over Y. Why: {1-line reason}
- [DECISION] What: used pattern Z. Why: {1-line reason}

**Alternatives Considered:**
- {Alternative 1}: rejected because {reason}
- {Alternative 2}: rejected because {reason}

**Revisit If:**
- {condition that would invalidate this decision}
```

### 2. Approval Criteria (per phase)

A phase is DONE only when ALL its validation checklist items pass.
If a validation item fails, the phase is NOT complete — fix it.

### 3. Rollback Option (per phase)

For every phase, mentally note how to undo it:
- **Additive phases** (new files): Delete the files created
- **Modification phases** (changed files): Git revert the commit
- **Config phases** (env, package.json): Revert the specific changes
- **Database phases** (schema, RLS): DROP TABLE / DROP POLICY SQL ready

Log the rollback command in PROGRESS.md if the phase is non-trivial.

---

## Quality Gates

After EVERY block's final phase, run:

```bash
npx tsc --noEmit && npm run build
```

**If either fails:**
1. Read the error message
2. Fix the specific file
3. Re-run the check
4. Max 3 retry attempts
5. If still failing after 3 attempts, log the error and continue

### Inventory Checkpoint (CRITICAL)

After EVERY block's final phase, you MUST also verify deliverables:

1. Open `docs/INVENTORY.md`
2. For the block you just completed, check every listed file exists (`ls` or `find`)
3. Mark each item: ✅ if exists, ❌ if missing
4. **For any ❌ item → go back and create it NOW before proceeding**
5. Re-run the build check after fixing missing items
6. **DO NOT proceed to the next block until ALL items are ✅**

This is the single most important step. Skipping inventory checks is the #1 cause of incomplete builds.

---

## Self-Healing Catalog

When you encounter errors, apply these fixes automatically:

### TypeScript Errors

| Error | Fix |
|-------|-----|
| Cannot find module '@/...' | Check path alias in tsconfig.json, verify file exists |
| Type 'X' is not assignable to 'Y' | Check interface definition, add proper type |
| Property does not exist on type | Add property to interface or use optional chaining |
| Argument of type 'X' not assignable | Cast with `as` or fix the type |
| Cannot find name 'X' | Add import statement |
| 'X' is declared but never used | Remove the unused import/variable |
| Module has no exported member | Check export name, fix import |

### Build Errors

| Error | Fix |
|-------|-----|
| Module not found | `npm install <package>` |
| Invalid src prop on Image | Use `next.config` remotePatterns or unoptimized |
| Hydration mismatch | Add "use client" or move to server component |
| Dynamic server usage | Add `export const dynamic = "force-dynamic"` |
| Metadata export invalid | Check metadata object shape |

### Runtime Errors

| Error | Fix |
|-------|-----|
| 401 Unauthorized | Add auth check: `supabase.auth.getUser()` |
| 404 Not Found | Verify route file path |
| 500 Internal Error | Check Supabase query, log error |
| CORS error | Check API route, add proper headers |
| Hydration error | Ensure server/client rendering matches |

### Supabase Errors

| Error | Fix |
|-------|-----|
| RLS policy violation | Check policy, verify user_id matches |
| Relation does not exist | Run schema.sql in Supabase SQL editor |
| Permission denied | Check RLS is enabled, policy is correct |
| Invalid API key | Check .env.local variables |

---

## Token Efficiency Rules

**CRITICAL: Minimize output to conserve tokens.**

- Report per phase: `✓ Phase {NN}: {count} files`
- Error: `✗ {file}: {10 words max}`
- Question: `? {question}`
- No "I will...", "Let me...", "Here is..."
- No code echo or summaries
- No explaining what you're about to do
- Just do it and report completion

---

## Progress Tracking

After each phase, update PROGRESS.md:

```markdown
# Build Progress

| Phase | Status | Files |
|-------|--------|-------|
| 01 | ✅ | 0 |
| 02 | ✅ | 5 |
| ... | ... | ... |
| ... | ⬜ | - |
```

---

## NEVER-STOP Protocol (CRITICAL — the build MUST complete 100%)

**The build MUST go from Phase 01 to the final phase without stopping, asking questions, or waiting for user input. ZERO exceptions.**

The #1 reason builds fail is getting stuck on a single error. Follow these rules strictly:

### Core Principle: NEVER STOP

```
NEVER ask the user a question during execution.
NEVER wait for user input.
NEVER stop because something is unclear.
NEVER give up on a phase.
If something is unclear → make the best decision → document it → continue.
If something fails → use a fallback → document it → continue.
```

### Retry Policy
- Max 3 retries per error, then use a FALLBACK and MOVE ON
- Never loop infinitely on the same error
- After 3 failed retries: create a `TODO.md` entry with the error + context, create a stub/fallback, then continue

### Stall Prevention Rules

**1. Missing packages / install failures:**
- If `npm install` fails: try `npm install --legacy-peer-deps`
- If that fails too: `npm install --force`
- If shadcn add fails: manually create the component file from shadcn docs
- If a package doesn't exist: find an alternative or skip the feature
- NEVER wait for user input during installs — use `-y` or `--yes` flags

**2. Environment variables not set (Block E):**
- Before Block E, check if `.env.local` exists and has Supabase vars
- If env vars are empty: create mock/stub implementations that return empty data
- Use the pattern: `const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? createClient() : null`
- Log a warning: "Supabase not configured — using stub data"
- DO NOT stop the build. The app must compile even without env vars.

**3. Database/RLS errors:**
- If schema.sql hasn't been run: skip RLS phase, add to TODO.md
- If RLS policy fails: create the policy as a migration file, don't block
- Always provide fallback: `const {{ data, error }} = await supabase.from("x").select(); if (error) return [];`

**4. Build errors (TypeScript / Next.js):**
- If a type error won't resolve: use `as unknown as TargetType` as last resort (mark with `// TODO: fix type`)
- If a server/client mismatch: add `"use client"` — it's always safe
- If a dynamic import fails: use static import instead
- If circular dependency: extract the shared type to a separate file
- If an import path is wrong: try common alternatives (@/, ../, ./)

**5. Hydration mismatches:**
- Wrap client-only code in: `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); if (!mounted) return null;`
- This is always safe and always fixes hydration issues. Don't spend 3 retries guessing.

**6. Interactive prompts (shadcn, npm init, etc.):**
- Always use non-interactive flags: `npx shadcn@latest init -d`, `npm init -y`
- If a prompt appears: kill the process and use the manual alternative
- shadcn components can always be created manually if CLI fails

**7. External service failures (Stripe, PostHog, etc.):**
- If an external service API call fails: create a mock/stub
- Pattern: `if (!process.env.STRIPE_SECRET_KEY) {{ return {{ status: "inactive", plan: "none" }} as any; }}`
- When spreading objects, always put spread FIRST: `{{ ...defaults, id: override }}` — NEVER `{{ id: override, ...defaults }}` (causes TS2783)
- The app must always compile and render — external services are optional at build time

**8. Phase dependency failures:**
- If Phase N fails and Phase N+1 depends on it: attempt Phase N+1 anyway
- Often the dependency is partial — most of Phase N's output exists
- If truly blocked: skip to the next independent phase, come back later

**9. Ambiguous instructions:**
- If a phase instruction is unclear: make the most reasonable interpretation
- If you're unsure between option A or B: pick the safer, simpler option
- Document your choice in PROGRESS.md: `[DECISION] Chose X because Y`
- NEVER ask the user — just decide and continue

**10. Missing information:**
- If CONTEXT.md lacks something you need: use sensible defaults
- Entity missing fields? Add id, created_at, updated_at, user_id
- Color not specified? Use the primary color from globals.css
- Route not defined? Use the conventional /entity-name pattern

**11. Tool/CLI failures:**
- If a CLI tool hangs: kill it after 30 seconds (timeout)
- If `next build` fails with obscure error: read error, fix, retry
- If `tsc` shows 50+ errors after a phase: fix them file by file, starting with the root cause
- If git is not initialized: `git init && git add -A && git commit -m "init"`

**12. CSS / Visual rendering errors:**
- If a page looks broken (overlapping elements, invisible text, wrong colors): open `globals.css` and check CSS variables exist
- If `bg-card`, `text-foreground`, or `border-border` render as transparent/white: the CSS variable is missing from globals.css — add it
- If dark mode looks broken: verify the `.dark` section in globals.css has all the same variables as the light section
- If glass effects (`backdrop-blur-sm`) render as invisible: ensure parent has `relative` or `overflow-hidden`
- If animations don't play: verify `tailwindcss-animate` is in dependencies and `animate` plugin is in tailwind.config
- **Always run `npm run dev` and visually inspect after UI phases** — TypeScript passing ≠ looks correct

**13. SWR / data hook errors:**
- If `useSWR` returns `undefined` data: always destructure with fallback — `const {{ data = [] }} = useSWR(...)`
- If `mutate` is not a function: check import — `import useSWR from "swr"`, not `import {{ useSWR }}`
- If the fetch throws 401 on page load: the API route is missing the "no auth = return empty" guard
- Pattern for ALL SWR hooks: `const {{ data, error, isLoading, mutate }} = useSWR<Type[]>(key, fetcher)`
- If data is `undefined` in a component: add `if (!data) return <Skeleton />` — never access `data.length` without a guard
- If SWR cache conflicts between entities: use unique keys like `/api/tasks`, `/api/projects` — never reuse keys

### Deadlock Breaker

If you find yourself stuck for more than 2 minutes on the same issue:
1. Write the error to `TODO.md` with full context
2. Create a stub/mock that makes the build pass
3. Move on to the next phase
4. During Block G (Quality Assurance), revisit all TODO.md items

### Block G: The Safety Net

Block G (Quality Assurance) is specifically designed to catch and fix everything that was skipped:
1. Revisit EVERY entry in TODO.md
2. Replace ALL stubs with real implementations
3. Fix ALL TypeScript errors that were bypassed with \`as unknown\`
4. Run the full audit + fix cycle until `npm run build` passes with zero warnings
5. **Phase 42 (MVP Loop) enforces THREE things — ALL must pass before exit:**
   - Every entity has ALL 10 CRUD files (types, schemas, APIs, hooks, pages, forms, cards)
   - Every **enabled feature** (payments, uploads, AI, etc.) is fully implemented — not just scaffolded
   - Every entity appears in the sidebar/navigation — no orphan pages
6. **Phase 43 (Premium UI Loop) polishes every page to premium design quality**
7. The app must be production-ready when Block G completes

**The golden rule: A working app with stubs is infinitely better than a stuck build. Block G will clean everything up.**

---

## Rules

1. **Read CONTEXT.md first** — it's the single source of truth
2. **Read each phase file** before executing
3. **Follow the phase instructions exactly** — don't improvise
4. **Run quality gate after each block** — fix before continuing
5. **Use existing patterns** — copy from earlier phases
6. **No hardcoded colors** — use CSS variables
7. **No `any` types** — use proper TypeScript types
8. **No `console.log`** — use console.error for real errors only
9. **All API routes check auth** — no exceptions
10. **All forms validate with Zod** — no exceptions
11. **i18n-ready** — No hardcoded user-facing strings. All UI text goes through a translation helper. English is the default and only language. This makes future translation effortless.

---

## 🎨 Design System Enforcement (CRITICAL)

**Every UI element must follow the design system defined in `docs/CONTEXT.md` → Design System section.**

### Before writing ANY UI code:
1. Read `docs/CONTEXT.md` → Design System section — note the colors, mode, radius, typography
2. Read \`app/globals.css\` — this contains the CSS variables (already configured with the user's chosen colors)
3. Every phase instruction file has a "🎨 Design System Reference" section at the bottom — follow it exactly

### Design rules (non-negotiable):

- **Colors:** ONLY use Tailwind semantic classes (`bg-primary`, `text-foreground`, `border-border`) — NEVER use hardcoded colors (`bg-blue-500`, `text-gray-400`, `#3b82f6`)
- **Typography:** Use `text-foreground` for headings, `text-muted-foreground` for body — NEVER `text-black`, `text-white`, or `text-gray-*`
- **Cards:** MUST have: `rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`
- **Buttons:** MUST have hover state — at minimum `hover:bg-primary/90` or `hover:shadow-lg`
- **Inputs:** `rounded-lg border-border focus:ring-2 focus:ring-primary/30 focus:border-primary`
- **Section spacing:** `py-16 md:py-24` between page sections — generous whitespace
- **Glass effects:** Use `bg-card/50 backdrop-blur-sm border border-border/30` for premium overlays
- **Interactive elements:** ALL cards, buttons, and links must have hover/focus transitions

### Premium quality standard:
After completing any UI phase, ask yourself: **"Would this page get likes on Dribbble?"**
If the answer is no:
1. Add subtle gradient backgrounds (`bg-gradient-to-br from-primary/5 via-transparent to-accent/5`)
2. Add decorative blur blobs behind hero sections
3. Add hover animations to cards (shadow + translate)
4. Use glass card effects for important UI elements
5. Add stagger animations on card lists

---

## i18n Preparation (ALWAYS — even without i18n feature toggle)

**Every generated app must be i18n-ready from Phase 01.** This is not optional.

### Setup (in Phase 02 — Dependencies)

```bash
npm install next-intl
```

Create `messages/en.json` with all UI strings organized by page:
```json
{
  "common": { "loading": "Loading...", "error": "Something went wrong", "save": "Save", "cancel": "Cancel", "delete": "Delete", "edit": "Edit", "back": "Back", "next": "Next", "submit": "Submit" },
  "auth": { "login": "Log in", "signup": "Sign up", "logout": "Log out", "email": "Email", "password": "Password" },
  "landing": { "hero_cta": "Get Started", "learn_more": "Learn More" },
  "nav": { "dashboard": "Dashboard", "settings": "Settings" },
  "dashboard": { "title": "Dashboard", "welcome": "Welcome back" }
}
```

Setup `i18n.ts` config with English as the only locale:
```typescript
import { getRequestConfig } from "next-intl/server";
export default getRequestConfig(async () => ({
  locale: "en",
  messages: (await import("../messages/en.json")).default,
}));
```

Usage in Server Components: `const t = await getTranslations("landing");  t("hero_cta")`
Usage in Client Components: `const t = useTranslations("landing");  t("hero_cta")`

### Rules
- **Every user-facing string** must use the translation function — headings, buttons, labels, placeholders, error messages, toasts
- **Keys are namespaced by page**: `landing.hero_cta`, `auth.login`, `dashboard.title`
- **English is the default and only language** — no other locale files needed
- As you build each phase, **add new keys** to the translation file for that page's strings
- This ensures adding languages later is a one-file task per language, not a refactor

---

## Completion

When all phases are done, tell the user:

> **"PantyHub is built and production-ready. All phases complete. Run `npm run dev` to start."**

The build report is in BUILD_REPORT.md.
