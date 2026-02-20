# PantyHub - Build Orchestration

> **Fully Automated App Build with Claude Code**
> Read this file and execute all phases in order.

---

## ⚠️ CRITICAL: Read CONTEXT.md First!

Before starting ANY phase, read **`CONTEXT.md`** which contains:
- Tech Stack (Next.js, Supabase, shadcn/ui, etc.)
- Enabled Features
- Data Model (Entities)
- Design System
- API Conventions

**This is mandatory for consistent builds.**

---

## Instructions for Claude Code

You are about to build **PantyHub**. This document orchestrates the entire build process.

### How it works:

1. **Read CONTEXT.md first** - understand the tech stack and features
2. **Read this file completely**
3. **Work through phase by phase** (from Phase 0 to the end)
4. **Per phase:** Open the specified MD file under `docs/`
5. **Execute ALL tasks in the MD file**
6. **Mark tasks as done** (checkboxes in the MD file)
7. **Checkpoint:** Verify everything works at the end of each phase
8. **Only when phase is complete:** Move to the next phase
9. **On errors:** Stop, fix, then continue

---

## Project Overview

| Metric | Value |
|--------|-------|
| **Total Phases** | 10 |
| **Total Agents** | 19 |
| **Estimated Tasks** | ~118 |
| **Parallel Phases** | 3 |

---

## Quality & Recovery (always active)

### Self-Healing Agent
Automatically detects and fixes common errors during the build process.
- **Tier 1:** Auto-fix TypeScript imports, type mismatches
- **Tier 2:** Semi-auto fix for env vars, port conflicts
- **Tier 3:** Manual guidance for DB/Auth issues
- **Tier 4:** Escalation for major issues

**On any error:** Consult `docs/99-self-healing.md` for recovery strategies.

### Quality Supervisor
Runs automated quality checks after each phase.
- TypeScript: 0 errors required
- ESLint: Auto-fix, max 5 warnings
- Bundle: < 500KB first load
- Security: No hardcoded secrets, RLS enabled

**After each phase:** Run quality checks from `docs/98-quality-report.md`.

---

## Execution Plan

### Phase 1: Initialize Project
⏳ *Sequential*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 🏗️ | **Setup Agent** | `docs/01-setup.md` | ~8 |

**Action:** Read `docs/01-setup.md` and execute all tasks.

### Phase 2: Database + UI Components
⚡ *Can run in parallel*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 🗄️ | **Database Agent** | `docs/02-database.md` | ~6 |
| 🎨 | **UI Components Agent** | `docs/04-ui-components.md` | ~12 |

**Action:** Read `docs/02-database.md` and execute all tasks.

### Phase 3: Authentication
⏳ *Sequential*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 🔐 | **Auth Agent** | `docs/03-auth.md` | ~10 |

**Action:** Read `docs/03-auth.md` and execute all tasks.

### Phase 4: App Layout
⏳ *Sequential*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 📐 | **Layout Agent** | `docs/05-layout.md` | ~6 |

**Action:** Read `docs/05-layout.md` and execute all tasks.

### Phase 5: Entity CRUD
⏳ *Sequential*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 📦 | **Entities Agent** | `docs/06-entities.md` | ~20 |

**Action:** Read `docs/06-entities.md` and execute all tasks.

### Phase 6: Dashboard, Forms, Landing Page
⚡ *Can run in parallel*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 📊 | **Dashboard Agent** | `docs/07-dashboard.md` | ~5 |
| 📝 | **Forms Agent** | `docs/08-forms.md` | ~8 |
| 🏠 | **Landing Page Agent** | `docs/09-landing.md` | ~8 |

**Action:** Read `docs/07-dashboard.md` and execute all tasks.

### Phase 7: SEO
⏳ *Sequential*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 🔍 | **SEO Agent** | `docs/10-seo.md` | ~4 |

**Action:** Read `docs/10-seo.md` and execute all tasks.

### Phase 8: Optional Features
⚡ *Can run in parallel*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 💳 | **Payments Agent** | `docs/optional/payments.md` | ~10 |
| 📁 | **File Upload Agent** | `docs/optional/uploads.md` | ~6 |
| ⚡ | **Realtime Agent** | `docs/optional/realtime.md` | ~5 |





**Action:** Read `docs/optional/payments.md` and execute all tasks.

### Phase 9: Testing & Build
⏳ *Sequential*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| 🧪 | **Testing Agent** | `docs/11-testing.md` | ~6 |

**Action:** Read `docs/11-testing.md` and execute all tasks.

### Phase 10: Quality Report & Gates
⏳ *Sequential*

| Icon | Agent | File | Tasks |
|------|-------|------|-------|
| ✅ | **Quality Supervisor** | `docs/98-quality-report.md` | ~4 |

**Action:** Read `docs/98-quality-report.md` and execute all tasks.


---

## Detailed Agent Descriptions

### 🏗️ Setup Agent

**File:** `docs/01-setup.md`
**Dependencies:** None (can start immediately)

Initializes the project, installs dependencies, creates base structure

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 🗄️ Database Agent

**File:** `docs/02-database.md`
**Dependencies:** setup

Creates Supabase Schema, Tables, RLS Policies, Triggers

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 🔐 Auth Agent

**File:** `docs/03-auth.md`
**Dependencies:** database

Implements Authentication: Middleware, Login, Signup, Session

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 🎨 UI Components Agent

**File:** `docs/04-ui-components.md`
**Dependencies:** setup

Creates all base UI components (Button, Input, Card, etc.)

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 📐 Layout Agent

**File:** `docs/05-layout.md`
**Dependencies:** ui-components, auth

Creates App Layout, Header, Navigation, Footer

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 📦 Entities Agent

**File:** `docs/06-entities.md`
**Dependencies:** layout, database

Creates CRUD for all Entities: Types, Schemas, API Routes, Pages, Hooks

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 📊 Dashboard Agent

**File:** `docs/07-dashboard.md`
**Dependencies:** entities

Creates the Dashboard with Stats, Recent Items, Quick Actions

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 📝 Forms Agent

**File:** `docs/08-forms.md`
**Dependencies:** entities, ui-components

Creates all forms with validation (react-hook-form + Zod)

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 🏠 Landing Page Agent

**File:** `docs/09-landing.md`
**Dependencies:** ui-components

Creates the Landing Page: Hero, Features, FAQ, CTA

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 🔍 SEO Agent

**File:** `docs/10-seo.md`
**Dependencies:** landing

Implements SEO: Metadata, Sitemap, Robots.txt, OpenGraph

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 🧪 Testing Agent

**File:** `docs/11-testing.md`
**Dependencies:** entities, forms, dashboard

Creates tests, runs build, checks for errors

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 💳 Payments Agent

**File:** `docs/optional/payments.md`
**Dependencies:** auth, database

Implements Stripe: Checkout, Webhooks, Subscription Management

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### 📁 File Upload Agent

**File:** `docs/optional/uploads.md`
**Dependencies:** auth, database

Implements Supabase Storage: Upload Component, Policies

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### ⚡ Realtime Agent

**File:** `docs/optional/realtime.md`
**Dependencies:** entities

Implements Supabase Realtime: Subscriptions, Live Updates

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors

---

### ✅ Quality Supervisor

**File:** `docs/98-quality-report.md`
**Dependencies:** None (can start immediately)

Runs quality checks after each phase: TypeScript, ESLint, Bundle Size, Security. Generates quality reports and recommendations.

**After completion, verify:**
- All checkboxes in the MD file are checked
- No TypeScript errors
- App runs without console errors


---

## Important Rules

### DO:
- ✅ Process tasks in the specified order
- ✅ Create code exactly as described in the MD files
- ✅ When unclear: Ask instead of guessing
- ✅ Regularly check `npm run dev`
- ✅ Fix TypeScript errors immediately

### DON'T:
- ❌ Skip phases
- ❌ Skip tasks
- ❌ Add your own "improvements"
- ❌ Change dependencies without reason
- ❌ Continue on errors

---

## Checkpoint Questions (after each phase)

Answer these questions before moving to the next phase:

1. **Are all tasks in the phase checked off?**
2. **Does `npm run dev` run without errors?**
3. **Are there TypeScript errors?** (if yes: fix them)
4. **Does the feature work as expected?**

Only when all answers are positive → Move to the next phase.

---

## Start Build

**Now:** Open `docs/phases/01-project-init.md` and begin with Phase 1!

```
npm run dev
```

At the end, the complete app should run with:
- ✅ Auth (Login, Signup, Logout)
- ✅ Dashboard
- ✅ Entity CRUD
- ✅ Landing Page
- ✅ SEO

**Let's start building!**
