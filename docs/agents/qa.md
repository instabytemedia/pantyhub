# Quality Assurance Agent — Build Agent

> **Product:** PantyHub
> **Agent ID:** qa
> **Phases:** 12 | **Est. Time:** ~15 min
> **Dependencies:** security, devops

Full audit, fix rounds, final build, MVP loop, design polish, git init. Reviews all TODO.md items and BUILD_STATE warnings.

---


> **POLISH:** Primary buttons should have `hover:brightness-110 active:scale-[0.98] transition-all` for tactile feedback.

## Pre-Flight Check

Before executing any phases, verify ALL prerequisites:

```bash
test -e "app/(app)/*/page.tsx" && echo "✓ app/(app)/*/page.tsx" || echo "✗ MISSING: app/(app)/*/page.tsx"
test -e "middleware.ts" && echo "✓ middleware.ts" || echo "✗ MISSING: middleware.ts"
test -e "supabase/schema.sql" && echo "✓ supabase/schema.sql" || echo "✗ MISSING: supabase/schema.sql"
```

**Context handoff:** Read per-agent state files to understand what previous agents produced:
- `docs/build-state/security.json` — decisions, warnings, files created
- `docs/build-state/devops.json` — decisions, warnings, files created

Also read `docs/BUILD_STATE.json` for the global overview (conflict zones, tier progress).

**Cross-agent types:** Read `docs/contracts/shared-types.json` for entity definitions, naming conventions, and design tokens. Do NOT deviate from these conventions.
**Route safety:** Check `routeOverrides` in shared-types.json. If your entity route conflicts with a reserved/feature route, use the override path (e.g., `manage-reviews` instead of `reviews`).

**Dependency hashes:** Record hashes of input files for change detection:
```bash
# app/(app)/*/page.tsx — skip hash (glob pattern)
md5sum "middleware.ts" 2>/dev/null || echo "N/A middleware.ts"
md5sum "supabase/schema.sql" 2>/dev/null || echo "N/A supabase/schema.sql"
```
Store these in `agents.qa.inputHashes` in BUILD_STATE.json.

**Build check:** Run `npx tsc --noEmit` — must pass before starting.

**Rollback preparation:** Before starting, create a restore point:
```bash
git add -A && git stash push -m "pre-qa"
git stash pop
```
If this agent fails catastrophically, you can rollback with `git stash pop`.

All checks passed? Proceed to Phase 1.

---

## Context

> Extracted from `docs/CONTEXT.md` — only sections relevant to this agent.
> For full details, read `docs/CONTEXT.md`.

## Entities

- **User**: A buyer or seller on the platform
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `role` (enum(buyer, seller), required)
- **Listing**: A used panty or other item for sale
  - `title` (string, required)
  - `description` (text, required)
  - `price` (number, required)
  - `status` (enum(available, sold), required)
- **Review**: A review of a listing
  - `rating` (number, required)
  - `feedback` (text, required)
- **Shop**: A seller's own shop system
  - `name` (string, required)
  - `description` (text, required)
- **Order**: Purchase transaction
  - `listing_id` (uuid, required)
  - `buyer_id` (uuid, required)
  - `seller_id` (uuid, required)
  - `amount` (number, required)
  - `status` (enum(pending, paid, shipped, completed, cancelled, refunded), required)
  - `payment_intent_id` (string, required)
- **Payment**: Payment transactions and history
  - `stripe_payment_id` (string, required)
  - `amount` (number, required)
  - `currency` (string, required)
  - `status` (enum(pending, completed, failed, refunded), required)
  - `payment_method` (string, required)
  - `description` (text, required)
- **Subscription**: User subscription plans (Stripe)
  - `stripe_customer_id` (string, required)
  - `stripe_subscription_id` (string, required)
  - `plan_name` (string, required)
  - `price_amount` (number, required)
  - `interval` (enum(monthly, yearly), required)
  - `status` (enum(active, canceled, past_due, trialing, incomplete), required)
  - `current_period_end` (datetime, required)
- **Upload**: File uploads and media
  - `file_name` (string, required)
  - `file_url` (string, required)
  - `file_type` (string, required)
  - `file_size` (number, required)
  - `storage_path` (string, required)
  - `alt_text` (string, required)
- **Channel**: Chat channels / rooms
  - `name` (string, required)
  - `type` (string, required)
- **Notification**: User notifications (in-app, email, push)
  - `title` (string, required)
  - `message` (text, required)
  - `type` (enum(info, success, warning, error, mention, follow, like), required)
  - `read` (boolean, required)
  - `action_url` (string, required)
  - `sender_id` (uuid, required)
- **Conversation**: Chat conversations between users
  - `title` (string, required)
  - `is_group` (boolean, required)
  - `last_message_at` (datetime, required)
- **Message**: Individual messages within conversations
  - `content` (text, required)
  - `conversation_id` (uuid, required)
  - `sender_id` (uuid, required)
  - `message_type` (enum(text, image, file, system), required)
  - `read_at` (datetime, required)
- **GlobalSearchFeature**: Data entity for the global search feature feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **SafeTransactions**: Data entity for the safe transactions feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **OwnShopSystem**: Data entity for the own shop system feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **SetYourOwnPrices**: Data entity for the set your own prices feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **NoTransactionFees**: Data entity for the no transaction fees feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **MessagesAndChatSystem**: Data entity for the messages and chat system feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **ClassifiedAdMarket**: Data entity for the classified ad market feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **MemberReviews**: Data entity for the member reviews feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **PrivacyFunctions**: Data entity for the privacy functions feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **MediaCloud**: Data entity for the media cloud feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **UserBlockingSystem**: Data entity for the user blocking system feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **HumanOperatedFakeCheck**: Data entity for the human operated fake check feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **MemberReviewsAndRatings**: Data entity for the member reviews and ratings feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **FullFeaturedProfiles**: Data entity for the full featured profiles feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **SellerRatingsAndBuyerReviews**: Data entity for the seller ratings and buyer reviews feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **UserRankingList**: Data entity for the user ranking list feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **FriendsAndFansSystem**: Data entity for the friends and fans system feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **CustomVideoClips**: Data entity for the custom video clips feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **PrivatePhotosets**: Data entity for the private photosets feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)
- **WhatsappAndSkypeChats**: Data entity for the whatsapp and skype chats feature
  - `title` (string, required)
  - `description` (text, required)
  - `status` (enum(active, inactive, archived), required)
  - `metadata` (json, required)

### Entity Relationships

- **Order** → **Listing** (many-to-one via `listing_id`)
- **Message** → **Conversation** (many-to-one via `conversation_id`)

## Feature Registry

| Feature | Instruction File | Execute After | Depends On | Affects Phases |
|---------|-----------------|---------------|------------|----------------|
| Payments (Stripe) | `docs/features/payments.md` | Block C (Entity System) | Auth, Database | 28, 18, 06 |
| File Uploads | `docs/features/uploads.md` | Block C (Entity System) | Auth, Database | 28, 17, 15 |
| Realtime | `docs/features/realtime.md` | Block C (Entity System) | Database | 30, 14 |
| Full-Text Search | `docs/features/search.md` | Block C (Entity System) | Database | 14, 21 |
| Notifications | `docs/features/notifications.md` | Block C (Entity System) | Auth, Database | 30, 07, 18 |
| Direct Messaging | `docs/features/messaging.md` | Block C (Entity System) | Auth, Database | 28, 14, 30 |
| Reviews & Ratings | `docs/features/reviews.md` | Block C (Entity System) | Auth, Database | 28, 14 |

**IMPORTANT:** After completing each block's quality gate, check the Feature Schedule below.
Read each scheduled feature file and integrate its instructions before proceeding to the next block.

## Design System

| Property | Value |
|----------|-------|
| **Mode** | dark |
| **Primary Color** | #660033 |
| **Border Radius** | 0.3 |
| **Style** | The design should create a sense of allure and seduction, drawing users into a world of forbidden pleasures and secret desires. The layout should be dark and moody, with bold typography and striking imagery to create a sense of drama and intrigue. The color palette should feature deep, rich colors such as burgundy, navy blue, and black, with subtle accents of red or pink to hint at the sensual nature of the platform. |
| **Color Scheme** | Deep, rich colors with bold accents |
| **Typography** | Bold, dramatic fonts with a mix of serif and sans-serif |
| **Components** | Bold, attention-grabbing buttons and cards with sharp corners and dramatic shadows |
| **Palette** | Primary: #660033, Secondary: #330033, Accent: #FF0033, Background: #09090b |
| **Imagery Style** | Sensual, provocative images and illustrations |
| **Animation Level** | Dramatic, attention-grabbing animations to enhance the user experience |

## Tech

| Field | Value |
|-------|-------|
| **Stack Profile** | Next.js + Supabase |
| **Framework** | Next.js |
| **Language** | TypeScript |
| **UI Library** | shadcn/ui |
| **State** | SWR |
| **Routing** | App Router |
| **Database** | supabase |
| **Deploy** | vercel |
| **Scale** | prototype |

---

## Idempotency Rules

This agent MUST be safely re-runnable. Follow these rules:

1. **Before creating any file:** Check if it already exists. If it does, verify its contents match expectations — update if needed, don't duplicate
2. **Database schema:** Use `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`
3. **Package installs:** Only install if not already in package.json
4. **Component registration:** Check if already registered before adding
5. **Config updates:** Read current config, merge changes, don't overwrite

---

## ⚠️ File Ownership — DO NOT MODIFY

These files are **owned by other agents**. Do NOT create, modify, or overwrite them:

- `app/page.tsx` → **Pages Agent**
- `app/(public)/about/page.tsx` → **Pages Agent**
- `app/(public)/terms/page.tsx` → **Pages Agent**
- `supabase/schema.sql` → **Schema Agent**
- `components/error-boundary.tsx` → **Error Handling Agent**
- `components/loading-skeleton.tsx` → **Responsive Agent**
- `app/sitemap.ts` → **DevOps Agent**
- `app/robots.ts` → **DevOps Agent**
- `.github/workflows/ci.yml` → **DevOps Agent**
- `README.md` → **DevOps Agent**
- `docs/SMOKE_TEST_REPORT.md` → **Smoke Test Agent**
- `docs/PROOF_PACK.md` → **Build Proof Agent**
- `docs/SHIPGATE_VERDICT.md` → **ShipGate Agent**
- `lib/payments.ts` → **Payments (Stripe) Agent**
- `lib/uploads.ts` → **File Uploads Agent**
- `lib/realtime.ts` → **Realtime Agent**
- `lib/search.ts` → **Full-Text Search Agent**
- `lib/notifications.ts` → **Notifications Agent**
- `lib/messaging.ts` → **Direct Messaging Agent**
- `lib/reviews.ts` → **Reviews & Ratings Agent**

**Your files** (only modify these):
- `docs/BUILD_REPORT.md`

If you need something from another agent's file, read it but DO NOT write to it. If the file is missing or has wrong content, log it as a dependency error in BUILD_STATE.json.

---

## Instructions

Execute all phases below in order. After each phase:
1. Run `npx tsc --noEmit` — fix any errors before continuing
2. Verify the phase's tasks are complete
3. Move to the next phase

---

## Phase 1: 39 - Visual Audit with QA Matrix

> Source: `docs/phases/39-full-audit.md`

# 39 - Visual Audit with QA Matrix

> **Purpose:** Systematic page-by-page visual audit using a complete QA matrix
> **Block:** J — Quality Assurance Loop
> **Approach:** Fill in the QA matrix below — every cell must be checked
> **Output:** List of visual issues for Phase 39e

---

## CRITICAL: Code-Level Audit (Agent-Executable)

Since you're an AI agent, you **cannot** visually inspect pages. Instead, use these concrete commands to audit the codebase systematically:

### Step 1: Verify all pages exist (no missing routes)
```bash
# Check all page files exist
find app -name "page.tsx" | sort
# Compare against expected routes — flag any missing
```

### Step 2: Responsive breakpoints audit
```bash
# Check for responsive classes (should exist on layout containers)
grep -rn "md:\|lg:\|sm:\|xl:" app/ components/ --include="*.tsx" | head -30

# Flag components WITHOUT responsive classes
grep -rLn "md:\|lg:\|sm:" components/ --include="*.tsx"
```

### Step 3: Dark mode audit
```bash
# Check for hardcoded colors (should use CSS variables or dark: prefix)
grep -rn "bg-white\|bg-gray\|text-black\|text-gray" app/ components/ --include="*.tsx" | grep -v "dark:" | head -20

# Verify dark mode classes exist
grep -rn "dark:" app/ components/ --include="*.tsx" | wc -l
```

### Step 4: Loading/Empty/Error state audit
```bash
# Check for loading states (skeleton or spinner)
grep -rn "isLoading\|Skeleton\|Spinner\|loading" app/ components/ --include="*.tsx" | head -20

# Check for empty states
grep -rn "empty\|no.*found\|no.*yet\|EmptyState" app/ components/ --include="*.tsx" | head -20

# Check error boundaries exist
find app -name "error.tsx" | sort
```

### Step 5: Then fill in the QA matrix below based on findings

---

## QA Matrix

| Page | Desktop (1280px) | Tablet (768px) | Mobile (375px) | Dark Mode | Loading State | Empty State | Error State |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| / (Landing) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /login | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /signup | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /dashboard | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /users | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /users/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /users/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /listings | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /listings/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /listings/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /reviews | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /reviews/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /reviews/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /shops | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /shops/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /shops/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /orders | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /orders/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /orders/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /payments | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /payments/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /payments/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /subscriptions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /subscriptions/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /subscriptions/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /uploads | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /uploads/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /uploads/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /channels | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /channels/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /channels/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /notifications | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /notifications/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /notifications/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /conversations | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /conversations/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /conversations/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /messages | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /messages/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /messages/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /global-search-features | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /global-search-features/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /global-search-features/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /safe-transactions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /safe-transactions/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /safe-transactions/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /own-shop-systems | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /own-shop-systems/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /own-shop-systems/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /set-your-own-prices | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /set-your-own-prices/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /set-your-own-prices/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /no-transaction-fees | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /no-transaction-fees/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /no-transaction-fees/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /messages-and-chat-systems | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /messages-and-chat-systems/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /messages-and-chat-systems/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /classified-ad-markets | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /classified-ad-markets/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /classified-ad-markets/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /member-reviews | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /member-reviews/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /member-reviews/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /privacy-functions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /privacy-functions/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /privacy-functions/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /media-clouds | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /media-clouds/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /media-clouds/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /user-blocking-systems | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /user-blocking-systems/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /user-blocking-systems/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /human-operated-fake-checks | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /human-operated-fake-checks/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /human-operated-fake-checks/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /member-reviews-and-ratings | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /member-reviews-and-ratings/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /member-reviews-and-ratings/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /full-featured-profiles | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /full-featured-profiles/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /full-featured-profiles/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /seller-ratings-and-buyer-reviews | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /seller-ratings-and-buyer-reviews/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /seller-ratings-and-buyer-reviews/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /user-ranking-lists | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /user-ranking-lists/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /user-ranking-lists/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /friends-and-fans-systems | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /friends-and-fans-systems/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /friends-and-fans-systems/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /custom-video-clips | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /custom-video-clips/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /custom-video-clips/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /private-photosets | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /private-photosets/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /private-photosets/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /whatsapp-and-skype-chats | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /whatsapp-and-skype-chats/new | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /whatsapp-and-skype-chats/[id] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /settings | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| /404 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Legend:** [ ] = unchecked, [x] = passed, [!] = issue found

---

## What to Check Per Cell

### Desktop / Tablet / Mobile
- Layout doesn't break or overflow
- Text is readable (no truncation issues)
- Buttons are clickable (not too small on mobile)
- Cards stack correctly on small screens
- Sidebar collapses on mobile
- Forms are usable on all sizes
- Tables scroll horizontally on mobile

### Dark Mode
- No white backgrounds on dark
- No invisible text (white on white)
- Borders visible (not too subtle)
- Icons have correct colors
- Charts/images have dark mode variants

### Loading State
- Skeleton matches actual layout
- No layout shift when data loads
- Loading state shows immediately

### Empty State
- Clear message + CTA button
- Icon is contextual
- Looks designed, not broken

### Error State
- Error boundary catches and shows message
- "Try Again" button works
- Error doesn't crash the app

---

## Global Elements Check

- [ ] Header: consistent on all pages, active nav highlighted
- [ ] Mobile nav: hamburger visible at 768px, sheet opens/closes
- [ ] User menu: dropdown aligned, all items clickable
- [ ] Toaster: positioned correctly, visible on all pages
- [ ] Offline banner: appears when disconnected (Phase 20)
- [ ] Theme toggle: works, persists across navigation

---

## Issue Recording Format

```
VISUAL ISSUES:
1. [PAGE] [VIEWPORT] [SEVERITY] - Description
   /dashboard MOBILE HIGH - Stat cards overflow horizontally
2. [PAGE] [STATE] [SEVERITY] - Description
   /posts EMPTY MEDIUM - No icon in empty state
3. [PAGE] [MODE] [SEVERITY] - Description
   /settings DARK LOW - Border barely visible
```

Severity:
- **HIGH** — Broken layout, unusable, invisible content
- **MEDIUM** — Inconsistent, ugly, confusing
- **LOW** — Cosmetic, minor spacing, nice-to-have

---

## Validation

- [ ] Every cell in the QA matrix is checked
- [ ] All pages verified at 3 viewports
- [ ] Dark mode verified on every page
- [ ] All states checked (loading, empty, error, data)
- [ ] All issues recorded with page + viewport + severity
- [ ] Issues saved for Phase 39e



---

> **🎨 Design:** Follow `docs/DESIGN_SYSTEM.md` for colors, typography, component patterns, and hover states. NEVER hardcode colors — use CSS variables.

---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 2: 39b - Functional Audit with Test Matrix

> Source: `docs/phases/39b-functional-audit.md`

# 39b - Functional Audit with Test Matrix

> **Purpose:** Systematic test of every interaction — forms, links, CRUD, auth flows, edge cases
> **Block:** J — Quality Assurance Loop
> **Approach:** Walk through the test matrix below — every row must be verified
> **Output:** List of functional issues for Phase 39e

---

## CRITICAL: Code-Level Functional Audit (Agent-Executable)

Since you're an AI agent, verify functional correctness through code inspection and automated commands:

### Step 1: API route completeness
```bash
# List all API routes
find app/api -name "route.ts" | sort

# Verify each entity has CRUD endpoints
# Expected per entity: GET (list), POST (create), GET [id], PATCH [id], DELETE [id]
```

### Step 2: Auth protection audit
```bash
# Find API routes WITHOUT auth checks
grep -rL "getServerSession\|auth()\|createClient\|getUser" app/api/ --include="route.ts"

# Find protected pages WITHOUT middleware/auth check
grep -rL "redirect.*login\|getServerSession\|auth()" app/\(app\)/ --include="page.tsx"
```

### Step 3: Zod validation audit
```bash
# Find API routes WITHOUT Zod validation
grep -rL "z\.object\|z\.string\|schema\.parse\|schema\.safeParse" app/api/ --include="route.ts"
```

### Step 4: Error handling audit
```bash
# Find try/catch blocks without proper error handling
grep -rn "catch.*{" app/api/ --include="route.ts" -A 3 | head -30

# Find routes that return raw error messages (security risk)
grep -rn "error\.message" app/api/ --include="route.ts" | head -20
```

### Step 5: Then verify each row in the test matrix below by reading the relevant code

---

## Test Matrix — Authentication

| Test | Route | Action | Expected Result | Status |
|------|-------|--------|-----------------|--------|
| Signup (valid) | /signup | Submit with valid email + password | Account created, redirect to dashboard | |
| Signup (empty) | /signup | Submit empty form | Validation errors on all fields | |
| Signup (invalid email) | /signup | Submit with "notanemail" | Email validation error | |
| Signup (short password) | /signup | Submit with < 6 char password | Password validation error | |
| Signup (duplicate) | /signup | Submit with existing email | Error: account already exists | |
| Login (valid) | /login | Submit with correct credentials | Redirect to dashboard, session set | |
| Login (empty) | /login | Submit empty form | Validation errors | |
| Login (wrong password) | /login | Submit with wrong password | Error message (not "500") | |
| Login (nonexistent) | /login | Submit with unknown email | Error message | |
| Session persistence | /dashboard | Refresh page after login | Still logged in | |
| Logout | — | Click sign out | Redirect to login, session cleared | |
| Route protection | /dashboard | Visit without login | Redirect to /login | |
| Route protection | /users | Visit without login | Redirect to /login | |
| Route protection | /listings | Visit without login | Redirect to /login | |
| Route protection | /reviews | Visit without login | Redirect to /login | |
| Route protection | /shops | Visit without login | Redirect to /login | |
| Route protection | /orders | Visit without login | Redirect to /login | |
| Route protection | /payments | Visit without login | Redirect to /login | |
| Route protection | /subscriptions | Visit without login | Redirect to /login | |
| Route protection | /uploads | Visit without login | Redirect to /login | |
| Route protection | /channels | Visit without login | Redirect to /login | |
| Route protection | /notifications | Visit without login | Redirect to /login | |
| Route protection | /conversations | Visit without login | Redirect to /login | |
| Route protection | /messages | Visit without login | Redirect to /login | |
| Route protection | /global-search-features | Visit without login | Redirect to /login | |
| Route protection | /safe-transactions | Visit without login | Redirect to /login | |
| Route protection | /own-shop-systems | Visit without login | Redirect to /login | |
| Route protection | /set-your-own-prices | Visit without login | Redirect to /login | |
| Route protection | /no-transaction-fees | Visit without login | Redirect to /login | |
| Route protection | /messages-and-chat-systems | Visit without login | Redirect to /login | |
| Route protection | /classified-ad-markets | Visit without login | Redirect to /login | |
| Route protection | /member-reviews | Visit without login | Redirect to /login | |
| Route protection | /privacy-functions | Visit without login | Redirect to /login | |
| Route protection | /media-clouds | Visit without login | Redirect to /login | |
| Route protection | /user-blocking-systems | Visit without login | Redirect to /login | |
| Route protection | /human-operated-fake-checks | Visit without login | Redirect to /login | |
| Route protection | /member-reviews-and-ratings | Visit without login | Redirect to /login | |
| Route protection | /full-featured-profiles | Visit without login | Redirect to /login | |
| Route protection | /seller-ratings-and-buyer-reviews | Visit without login | Redirect to /login | |
| Route protection | /user-ranking-lists | Visit without login | Redirect to /login | |
| Route protection | /friends-and-fans-systems | Visit without login | Redirect to /login | |
| Route protection | /custom-video-clips | Visit without login | Redirect to /login | |
| Route protection | /private-photosets | Visit without login | Redirect to /login | |
| Route protection | /whatsapp-and-skype-chats | Visit without login | Redirect to /login | |

---

## Test Matrix — Navigation

| Test | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| All nav links | Click each nav item | Correct page loads, no 404s | |
| Active state | Navigate to page | Current nav item highlighted | |
| Mobile nav | Tap hamburger at 375px | Sheet opens with all links | |
| Mobile nav close | Tap outside or X | Sheet closes | |
| Logo click | Click logo/brand | Navigate to /dashboard | |
| Back button | Use browser back | Previous page loads correctly | |

---

## Test Matrix — Entity CRUD

| Test | Route | Action | Expected Result | Status |
|------|-------|--------|-----------------|--------|
| User Create | /users/new | Submit valid form | Item created, redirect to list, toast shown | |
| User Create (invalid) | /users/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| User List | /users | View with data | Items listed, ordered by newest | |
| User List (empty) | /users | View with no data | Empty state with CTA | |
| User Detail | /users/[id] | Click item from list | Detail page loads, all fields shown | |
| User Detail (404) | /users/invalid-id | Visit invalid ID | Not found handling | |
| User Edit | /users/[id]/edit | Load edit form | Form pre-filled with current values | |
| User Update | /users/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| User Delete | /users/[id] | Click delete | Confirmation dialog appears | |
| User Delete (confirm) | /users/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| User Delete (cancel) | /users/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Listing Create | /listings/new | Submit valid form | Item created, redirect to list, toast shown | |
| Listing Create (invalid) | /listings/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Listing List | /listings | View with data | Items listed, ordered by newest | |
| Listing List (empty) | /listings | View with no data | Empty state with CTA | |
| Listing Detail | /listings/[id] | Click item from list | Detail page loads, all fields shown | |
| Listing Detail (404) | /listings/invalid-id | Visit invalid ID | Not found handling | |
| Listing Edit | /listings/[id]/edit | Load edit form | Form pre-filled with current values | |
| Listing Update | /listings/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Listing Delete | /listings/[id] | Click delete | Confirmation dialog appears | |
| Listing Delete (confirm) | /listings/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Listing Delete (cancel) | /listings/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Review Create | /reviews/new | Submit valid form | Item created, redirect to list, toast shown | |
| Review Create (invalid) | /reviews/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Review List | /reviews | View with data | Items listed, ordered by newest | |
| Review List (empty) | /reviews | View with no data | Empty state with CTA | |
| Review Detail | /reviews/[id] | Click item from list | Detail page loads, all fields shown | |
| Review Detail (404) | /reviews/invalid-id | Visit invalid ID | Not found handling | |
| Review Edit | /reviews/[id]/edit | Load edit form | Form pre-filled with current values | |
| Review Update | /reviews/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Review Delete | /reviews/[id] | Click delete | Confirmation dialog appears | |
| Review Delete (confirm) | /reviews/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Review Delete (cancel) | /reviews/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Shop Create | /shops/new | Submit valid form | Item created, redirect to list, toast shown | |
| Shop Create (invalid) | /shops/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Shop List | /shops | View with data | Items listed, ordered by newest | |
| Shop List (empty) | /shops | View with no data | Empty state with CTA | |
| Shop Detail | /shops/[id] | Click item from list | Detail page loads, all fields shown | |
| Shop Detail (404) | /shops/invalid-id | Visit invalid ID | Not found handling | |
| Shop Edit | /shops/[id]/edit | Load edit form | Form pre-filled with current values | |
| Shop Update | /shops/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Shop Delete | /shops/[id] | Click delete | Confirmation dialog appears | |
| Shop Delete (confirm) | /shops/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Shop Delete (cancel) | /shops/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Order Create | /orders/new | Submit valid form | Item created, redirect to list, toast shown | |
| Order Create (invalid) | /orders/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Order List | /orders | View with data | Items listed, ordered by newest | |
| Order List (empty) | /orders | View with no data | Empty state with CTA | |
| Order Detail | /orders/[id] | Click item from list | Detail page loads, all fields shown | |
| Order Detail (404) | /orders/invalid-id | Visit invalid ID | Not found handling | |
| Order Edit | /orders/[id]/edit | Load edit form | Form pre-filled with current values | |
| Order Update | /orders/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Order Delete | /orders/[id] | Click delete | Confirmation dialog appears | |
| Order Delete (confirm) | /orders/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Order Delete (cancel) | /orders/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Payment Create | /payments/new | Submit valid form | Item created, redirect to list, toast shown | |
| Payment Create (invalid) | /payments/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Payment List | /payments | View with data | Items listed, ordered by newest | |
| Payment List (empty) | /payments | View with no data | Empty state with CTA | |
| Payment Detail | /payments/[id] | Click item from list | Detail page loads, all fields shown | |
| Payment Detail (404) | /payments/invalid-id | Visit invalid ID | Not found handling | |
| Payment Edit | /payments/[id]/edit | Load edit form | Form pre-filled with current values | |
| Payment Update | /payments/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Payment Delete | /payments/[id] | Click delete | Confirmation dialog appears | |
| Payment Delete (confirm) | /payments/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Payment Delete (cancel) | /payments/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Subscription Create | /subscriptions/new | Submit valid form | Item created, redirect to list, toast shown | |
| Subscription Create (invalid) | /subscriptions/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Subscription List | /subscriptions | View with data | Items listed, ordered by newest | |
| Subscription List (empty) | /subscriptions | View with no data | Empty state with CTA | |
| Subscription Detail | /subscriptions/[id] | Click item from list | Detail page loads, all fields shown | |
| Subscription Detail (404) | /subscriptions/invalid-id | Visit invalid ID | Not found handling | |
| Subscription Edit | /subscriptions/[id]/edit | Load edit form | Form pre-filled with current values | |
| Subscription Update | /subscriptions/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Subscription Delete | /subscriptions/[id] | Click delete | Confirmation dialog appears | |
| Subscription Delete (confirm) | /subscriptions/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Subscription Delete (cancel) | /subscriptions/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Upload Create | /uploads/new | Submit valid form | Item created, redirect to list, toast shown | |
| Upload Create (invalid) | /uploads/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Upload List | /uploads | View with data | Items listed, ordered by newest | |
| Upload List (empty) | /uploads | View with no data | Empty state with CTA | |
| Upload Detail | /uploads/[id] | Click item from list | Detail page loads, all fields shown | |
| Upload Detail (404) | /uploads/invalid-id | Visit invalid ID | Not found handling | |
| Upload Edit | /uploads/[id]/edit | Load edit form | Form pre-filled with current values | |
| Upload Update | /uploads/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Upload Delete | /uploads/[id] | Click delete | Confirmation dialog appears | |
| Upload Delete (confirm) | /uploads/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Upload Delete (cancel) | /uploads/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Channel Create | /channels/new | Submit valid form | Item created, redirect to list, toast shown | |
| Channel Create (invalid) | /channels/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Channel List | /channels | View with data | Items listed, ordered by newest | |
| Channel List (empty) | /channels | View with no data | Empty state with CTA | |
| Channel Detail | /channels/[id] | Click item from list | Detail page loads, all fields shown | |
| Channel Detail (404) | /channels/invalid-id | Visit invalid ID | Not found handling | |
| Channel Edit | /channels/[id]/edit | Load edit form | Form pre-filled with current values | |
| Channel Update | /channels/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Channel Delete | /channels/[id] | Click delete | Confirmation dialog appears | |
| Channel Delete (confirm) | /channels/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Channel Delete (cancel) | /channels/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Notification Create | /notifications/new | Submit valid form | Item created, redirect to list, toast shown | |
| Notification Create (invalid) | /notifications/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Notification List | /notifications | View with data | Items listed, ordered by newest | |
| Notification List (empty) | /notifications | View with no data | Empty state with CTA | |
| Notification Detail | /notifications/[id] | Click item from list | Detail page loads, all fields shown | |
| Notification Detail (404) | /notifications/invalid-id | Visit invalid ID | Not found handling | |
| Notification Edit | /notifications/[id]/edit | Load edit form | Form pre-filled with current values | |
| Notification Update | /notifications/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Notification Delete | /notifications/[id] | Click delete | Confirmation dialog appears | |
| Notification Delete (confirm) | /notifications/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Notification Delete (cancel) | /notifications/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Conversation Create | /conversations/new | Submit valid form | Item created, redirect to list, toast shown | |
| Conversation Create (invalid) | /conversations/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Conversation List | /conversations | View with data | Items listed, ordered by newest | |
| Conversation List (empty) | /conversations | View with no data | Empty state with CTA | |
| Conversation Detail | /conversations/[id] | Click item from list | Detail page loads, all fields shown | |
| Conversation Detail (404) | /conversations/invalid-id | Visit invalid ID | Not found handling | |
| Conversation Edit | /conversations/[id]/edit | Load edit form | Form pre-filled with current values | |
| Conversation Update | /conversations/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Conversation Delete | /conversations/[id] | Click delete | Confirmation dialog appears | |
| Conversation Delete (confirm) | /conversations/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Conversation Delete (cancel) | /conversations/[id] | Cancel deletion | Nothing happens, dialog closes | |
| Message Create | /messages/new | Submit valid form | Item created, redirect to list, toast shown | |
| Message Create (invalid) | /messages/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| Message List | /messages | View with data | Items listed, ordered by newest | |
| Message List (empty) | /messages | View with no data | Empty state with CTA | |
| Message Detail | /messages/[id] | Click item from list | Detail page loads, all fields shown | |
| Message Detail (404) | /messages/invalid-id | Visit invalid ID | Not found handling | |
| Message Edit | /messages/[id]/edit | Load edit form | Form pre-filled with current values | |
| Message Update | /messages/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| Message Delete | /messages/[id] | Click delete | Confirmation dialog appears | |
| Message Delete (confirm) | /messages/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| Message Delete (cancel) | /messages/[id] | Cancel deletion | Nothing happens, dialog closes | |
| GlobalSearchFeature Create | /global-search-features/new | Submit valid form | Item created, redirect to list, toast shown | |
| GlobalSearchFeature Create (invalid) | /global-search-features/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| GlobalSearchFeature List | /global-search-features | View with data | Items listed, ordered by newest | |
| GlobalSearchFeature List (empty) | /global-search-features | View with no data | Empty state with CTA | |
| GlobalSearchFeature Detail | /global-search-features/[id] | Click item from list | Detail page loads, all fields shown | |
| GlobalSearchFeature Detail (404) | /global-search-features/invalid-id | Visit invalid ID | Not found handling | |
| GlobalSearchFeature Edit | /global-search-features/[id]/edit | Load edit form | Form pre-filled with current values | |
| GlobalSearchFeature Update | /global-search-features/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| GlobalSearchFeature Delete | /global-search-features/[id] | Click delete | Confirmation dialog appears | |
| GlobalSearchFeature Delete (confirm) | /global-search-features/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| GlobalSearchFeature Delete (cancel) | /global-search-features/[id] | Cancel deletion | Nothing happens, dialog closes | |
| SafeTransactions Create | /safe-transactions/new | Submit valid form | Item created, redirect to list, toast shown | |
| SafeTransactions Create (invalid) | /safe-transactions/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| SafeTransactions List | /safe-transactions | View with data | Items listed, ordered by newest | |
| SafeTransactions List (empty) | /safe-transactions | View with no data | Empty state with CTA | |
| SafeTransactions Detail | /safe-transactions/[id] | Click item from list | Detail page loads, all fields shown | |
| SafeTransactions Detail (404) | /safe-transactions/invalid-id | Visit invalid ID | Not found handling | |
| SafeTransactions Edit | /safe-transactions/[id]/edit | Load edit form | Form pre-filled with current values | |
| SafeTransactions Update | /safe-transactions/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| SafeTransactions Delete | /safe-transactions/[id] | Click delete | Confirmation dialog appears | |
| SafeTransactions Delete (confirm) | /safe-transactions/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| SafeTransactions Delete (cancel) | /safe-transactions/[id] | Cancel deletion | Nothing happens, dialog closes | |
| OwnShopSystem Create | /own-shop-systems/new | Submit valid form | Item created, redirect to list, toast shown | |
| OwnShopSystem Create (invalid) | /own-shop-systems/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| OwnShopSystem List | /own-shop-systems | View with data | Items listed, ordered by newest | |
| OwnShopSystem List (empty) | /own-shop-systems | View with no data | Empty state with CTA | |
| OwnShopSystem Detail | /own-shop-systems/[id] | Click item from list | Detail page loads, all fields shown | |
| OwnShopSystem Detail (404) | /own-shop-systems/invalid-id | Visit invalid ID | Not found handling | |
| OwnShopSystem Edit | /own-shop-systems/[id]/edit | Load edit form | Form pre-filled with current values | |
| OwnShopSystem Update | /own-shop-systems/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| OwnShopSystem Delete | /own-shop-systems/[id] | Click delete | Confirmation dialog appears | |
| OwnShopSystem Delete (confirm) | /own-shop-systems/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| OwnShopSystem Delete (cancel) | /own-shop-systems/[id] | Cancel deletion | Nothing happens, dialog closes | |
| SetYourOwnPrices Create | /set-your-own-prices/new | Submit valid form | Item created, redirect to list, toast shown | |
| SetYourOwnPrices Create (invalid) | /set-your-own-prices/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| SetYourOwnPrices List | /set-your-own-prices | View with data | Items listed, ordered by newest | |
| SetYourOwnPrices List (empty) | /set-your-own-prices | View with no data | Empty state with CTA | |
| SetYourOwnPrices Detail | /set-your-own-prices/[id] | Click item from list | Detail page loads, all fields shown | |
| SetYourOwnPrices Detail (404) | /set-your-own-prices/invalid-id | Visit invalid ID | Not found handling | |
| SetYourOwnPrices Edit | /set-your-own-prices/[id]/edit | Load edit form | Form pre-filled with current values | |
| SetYourOwnPrices Update | /set-your-own-prices/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| SetYourOwnPrices Delete | /set-your-own-prices/[id] | Click delete | Confirmation dialog appears | |
| SetYourOwnPrices Delete (confirm) | /set-your-own-prices/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| SetYourOwnPrices Delete (cancel) | /set-your-own-prices/[id] | Cancel deletion | Nothing happens, dialog closes | |
| NoTransactionFees Create | /no-transaction-fees/new | Submit valid form | Item created, redirect to list, toast shown | |
| NoTransactionFees Create (invalid) | /no-transaction-fees/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| NoTransactionFees List | /no-transaction-fees | View with data | Items listed, ordered by newest | |
| NoTransactionFees List (empty) | /no-transaction-fees | View with no data | Empty state with CTA | |
| NoTransactionFees Detail | /no-transaction-fees/[id] | Click item from list | Detail page loads, all fields shown | |
| NoTransactionFees Detail (404) | /no-transaction-fees/invalid-id | Visit invalid ID | Not found handling | |
| NoTransactionFees Edit | /no-transaction-fees/[id]/edit | Load edit form | Form pre-filled with current values | |
| NoTransactionFees Update | /no-transaction-fees/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| NoTransactionFees Delete | /no-transaction-fees/[id] | Click delete | Confirmation dialog appears | |
| NoTransactionFees Delete (confirm) | /no-transaction-fees/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| NoTransactionFees Delete (cancel) | /no-transaction-fees/[id] | Cancel deletion | Nothing happens, dialog closes | |
| MessagesAndChatSystem Create | /messages-and-chat-systems/new | Submit valid form | Item created, redirect to list, toast shown | |
| MessagesAndChatSystem Create (invalid) | /messages-and-chat-systems/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| MessagesAndChatSystem List | /messages-and-chat-systems | View with data | Items listed, ordered by newest | |
| MessagesAndChatSystem List (empty) | /messages-and-chat-systems | View with no data | Empty state with CTA | |
| MessagesAndChatSystem Detail | /messages-and-chat-systems/[id] | Click item from list | Detail page loads, all fields shown | |
| MessagesAndChatSystem Detail (404) | /messages-and-chat-systems/invalid-id | Visit invalid ID | Not found handling | |
| MessagesAndChatSystem Edit | /messages-and-chat-systems/[id]/edit | Load edit form | Form pre-filled with current values | |
| MessagesAndChatSystem Update | /messages-and-chat-systems/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| MessagesAndChatSystem Delete | /messages-and-chat-systems/[id] | Click delete | Confirmation dialog appears | |
| MessagesAndChatSystem Delete (confirm) | /messages-and-chat-systems/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| MessagesAndChatSystem Delete (cancel) | /messages-and-chat-systems/[id] | Cancel deletion | Nothing happens, dialog closes | |
| ClassifiedAdMarket Create | /classified-ad-markets/new | Submit valid form | Item created, redirect to list, toast shown | |
| ClassifiedAdMarket Create (invalid) | /classified-ad-markets/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| ClassifiedAdMarket List | /classified-ad-markets | View with data | Items listed, ordered by newest | |
| ClassifiedAdMarket List (empty) | /classified-ad-markets | View with no data | Empty state with CTA | |
| ClassifiedAdMarket Detail | /classified-ad-markets/[id] | Click item from list | Detail page loads, all fields shown | |
| ClassifiedAdMarket Detail (404) | /classified-ad-markets/invalid-id | Visit invalid ID | Not found handling | |
| ClassifiedAdMarket Edit | /classified-ad-markets/[id]/edit | Load edit form | Form pre-filled with current values | |
| ClassifiedAdMarket Update | /classified-ad-markets/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| ClassifiedAdMarket Delete | /classified-ad-markets/[id] | Click delete | Confirmation dialog appears | |
| ClassifiedAdMarket Delete (confirm) | /classified-ad-markets/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| ClassifiedAdMarket Delete (cancel) | /classified-ad-markets/[id] | Cancel deletion | Nothing happens, dialog closes | |
| MemberReviews Create | /member-reviews/new | Submit valid form | Item created, redirect to list, toast shown | |
| MemberReviews Create (invalid) | /member-reviews/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| MemberReviews List | /member-reviews | View with data | Items listed, ordered by newest | |
| MemberReviews List (empty) | /member-reviews | View with no data | Empty state with CTA | |
| MemberReviews Detail | /member-reviews/[id] | Click item from list | Detail page loads, all fields shown | |
| MemberReviews Detail (404) | /member-reviews/invalid-id | Visit invalid ID | Not found handling | |
| MemberReviews Edit | /member-reviews/[id]/edit | Load edit form | Form pre-filled with current values | |
| MemberReviews Update | /member-reviews/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| MemberReviews Delete | /member-reviews/[id] | Click delete | Confirmation dialog appears | |
| MemberReviews Delete (confirm) | /member-reviews/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| MemberReviews Delete (cancel) | /member-reviews/[id] | Cancel deletion | Nothing happens, dialog closes | |
| PrivacyFunctions Create | /privacy-functions/new | Submit valid form | Item created, redirect to list, toast shown | |
| PrivacyFunctions Create (invalid) | /privacy-functions/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| PrivacyFunctions List | /privacy-functions | View with data | Items listed, ordered by newest | |
| PrivacyFunctions List (empty) | /privacy-functions | View with no data | Empty state with CTA | |
| PrivacyFunctions Detail | /privacy-functions/[id] | Click item from list | Detail page loads, all fields shown | |
| PrivacyFunctions Detail (404) | /privacy-functions/invalid-id | Visit invalid ID | Not found handling | |
| PrivacyFunctions Edit | /privacy-functions/[id]/edit | Load edit form | Form pre-filled with current values | |
| PrivacyFunctions Update | /privacy-functions/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| PrivacyFunctions Delete | /privacy-functions/[id] | Click delete | Confirmation dialog appears | |
| PrivacyFunctions Delete (confirm) | /privacy-functions/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| PrivacyFunctions Delete (cancel) | /privacy-functions/[id] | Cancel deletion | Nothing happens, dialog closes | |
| MediaCloud Create | /media-clouds/new | Submit valid form | Item created, redirect to list, toast shown | |
| MediaCloud Create (invalid) | /media-clouds/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| MediaCloud List | /media-clouds | View with data | Items listed, ordered by newest | |
| MediaCloud List (empty) | /media-clouds | View with no data | Empty state with CTA | |
| MediaCloud Detail | /media-clouds/[id] | Click item from list | Detail page loads, all fields shown | |
| MediaCloud Detail (404) | /media-clouds/invalid-id | Visit invalid ID | Not found handling | |
| MediaCloud Edit | /media-clouds/[id]/edit | Load edit form | Form pre-filled with current values | |
| MediaCloud Update | /media-clouds/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| MediaCloud Delete | /media-clouds/[id] | Click delete | Confirmation dialog appears | |
| MediaCloud Delete (confirm) | /media-clouds/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| MediaCloud Delete (cancel) | /media-clouds/[id] | Cancel deletion | Nothing happens, dialog closes | |
| UserBlockingSystem Create | /user-blocking-systems/new | Submit valid form | Item created, redirect to list, toast shown | |
| UserBlockingSystem Create (invalid) | /user-blocking-systems/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| UserBlockingSystem List | /user-blocking-systems | View with data | Items listed, ordered by newest | |
| UserBlockingSystem List (empty) | /user-blocking-systems | View with no data | Empty state with CTA | |
| UserBlockingSystem Detail | /user-blocking-systems/[id] | Click item from list | Detail page loads, all fields shown | |
| UserBlockingSystem Detail (404) | /user-blocking-systems/invalid-id | Visit invalid ID | Not found handling | |
| UserBlockingSystem Edit | /user-blocking-systems/[id]/edit | Load edit form | Form pre-filled with current values | |
| UserBlockingSystem Update | /user-blocking-systems/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| UserBlockingSystem Delete | /user-blocking-systems/[id] | Click delete | Confirmation dialog appears | |
| UserBlockingSystem Delete (confirm) | /user-blocking-systems/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| UserBlockingSystem Delete (cancel) | /user-blocking-systems/[id] | Cancel deletion | Nothing happens, dialog closes | |
| HumanOperatedFakeCheck Create | /human-operated-fake-checks/new | Submit valid form | Item created, redirect to list, toast shown | |
| HumanOperatedFakeCheck Create (invalid) | /human-operated-fake-checks/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| HumanOperatedFakeCheck List | /human-operated-fake-checks | View with data | Items listed, ordered by newest | |
| HumanOperatedFakeCheck List (empty) | /human-operated-fake-checks | View with no data | Empty state with CTA | |
| HumanOperatedFakeCheck Detail | /human-operated-fake-checks/[id] | Click item from list | Detail page loads, all fields shown | |
| HumanOperatedFakeCheck Detail (404) | /human-operated-fake-checks/invalid-id | Visit invalid ID | Not found handling | |
| HumanOperatedFakeCheck Edit | /human-operated-fake-checks/[id]/edit | Load edit form | Form pre-filled with current values | |
| HumanOperatedFakeCheck Update | /human-operated-fake-checks/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| HumanOperatedFakeCheck Delete | /human-operated-fake-checks/[id] | Click delete | Confirmation dialog appears | |
| HumanOperatedFakeCheck Delete (confirm) | /human-operated-fake-checks/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| HumanOperatedFakeCheck Delete (cancel) | /human-operated-fake-checks/[id] | Cancel deletion | Nothing happens, dialog closes | |
| MemberReviewsAndRatings Create | /member-reviews-and-ratings/new | Submit valid form | Item created, redirect to list, toast shown | |
| MemberReviewsAndRatings Create (invalid) | /member-reviews-and-ratings/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| MemberReviewsAndRatings List | /member-reviews-and-ratings | View with data | Items listed, ordered by newest | |
| MemberReviewsAndRatings List (empty) | /member-reviews-and-ratings | View with no data | Empty state with CTA | |
| MemberReviewsAndRatings Detail | /member-reviews-and-ratings/[id] | Click item from list | Detail page loads, all fields shown | |
| MemberReviewsAndRatings Detail (404) | /member-reviews-and-ratings/invalid-id | Visit invalid ID | Not found handling | |
| MemberReviewsAndRatings Edit | /member-reviews-and-ratings/[id]/edit | Load edit form | Form pre-filled with current values | |
| MemberReviewsAndRatings Update | /member-reviews-and-ratings/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| MemberReviewsAndRatings Delete | /member-reviews-and-ratings/[id] | Click delete | Confirmation dialog appears | |
| MemberReviewsAndRatings Delete (confirm) | /member-reviews-and-ratings/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| MemberReviewsAndRatings Delete (cancel) | /member-reviews-and-ratings/[id] | Cancel deletion | Nothing happens, dialog closes | |
| FullFeaturedProfiles Create | /full-featured-profiles/new | Submit valid form | Item created, redirect to list, toast shown | |
| FullFeaturedProfiles Create (invalid) | /full-featured-profiles/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| FullFeaturedProfiles List | /full-featured-profiles | View with data | Items listed, ordered by newest | |
| FullFeaturedProfiles List (empty) | /full-featured-profiles | View with no data | Empty state with CTA | |
| FullFeaturedProfiles Detail | /full-featured-profiles/[id] | Click item from list | Detail page loads, all fields shown | |
| FullFeaturedProfiles Detail (404) | /full-featured-profiles/invalid-id | Visit invalid ID | Not found handling | |
| FullFeaturedProfiles Edit | /full-featured-profiles/[id]/edit | Load edit form | Form pre-filled with current values | |
| FullFeaturedProfiles Update | /full-featured-profiles/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| FullFeaturedProfiles Delete | /full-featured-profiles/[id] | Click delete | Confirmation dialog appears | |
| FullFeaturedProfiles Delete (confirm) | /full-featured-profiles/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| FullFeaturedProfiles Delete (cancel) | /full-featured-profiles/[id] | Cancel deletion | Nothing happens, dialog closes | |
| SellerRatingsAndBuyerReviews Create | /seller-ratings-and-buyer-reviews/new | Submit valid form | Item created, redirect to list, toast shown | |
| SellerRatingsAndBuyerReviews Create (invalid) | /seller-ratings-and-buyer-reviews/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| SellerRatingsAndBuyerReviews List | /seller-ratings-and-buyer-reviews | View with data | Items listed, ordered by newest | |
| SellerRatingsAndBuyerReviews List (empty) | /seller-ratings-and-buyer-reviews | View with no data | Empty state with CTA | |
| SellerRatingsAndBuyerReviews Detail | /seller-ratings-and-buyer-reviews/[id] | Click item from list | Detail page loads, all fields shown | |
| SellerRatingsAndBuyerReviews Detail (404) | /seller-ratings-and-buyer-reviews/invalid-id | Visit invalid ID | Not found handling | |
| SellerRatingsAndBuyerReviews Edit | /seller-ratings-and-buyer-reviews/[id]/edit | Load edit form | Form pre-filled with current values | |
| SellerRatingsAndBuyerReviews Update | /seller-ratings-and-buyer-reviews/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| SellerRatingsAndBuyerReviews Delete | /seller-ratings-and-buyer-reviews/[id] | Click delete | Confirmation dialog appears | |
| SellerRatingsAndBuyerReviews Delete (confirm) | /seller-ratings-and-buyer-reviews/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| SellerRatingsAndBuyerReviews Delete (cancel) | /seller-ratings-and-buyer-reviews/[id] | Cancel deletion | Nothing happens, dialog closes | |
| UserRankingList Create | /user-ranking-lists/new | Submit valid form | Item created, redirect to list, toast shown | |
| UserRankingList Create (invalid) | /user-ranking-lists/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| UserRankingList List | /user-ranking-lists | View with data | Items listed, ordered by newest | |
| UserRankingList List (empty) | /user-ranking-lists | View with no data | Empty state with CTA | |
| UserRankingList Detail | /user-ranking-lists/[id] | Click item from list | Detail page loads, all fields shown | |
| UserRankingList Detail (404) | /user-ranking-lists/invalid-id | Visit invalid ID | Not found handling | |
| UserRankingList Edit | /user-ranking-lists/[id]/edit | Load edit form | Form pre-filled with current values | |
| UserRankingList Update | /user-ranking-lists/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| UserRankingList Delete | /user-ranking-lists/[id] | Click delete | Confirmation dialog appears | |
| UserRankingList Delete (confirm) | /user-ranking-lists/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| UserRankingList Delete (cancel) | /user-ranking-lists/[id] | Cancel deletion | Nothing happens, dialog closes | |
| FriendsAndFansSystem Create | /friends-and-fans-systems/new | Submit valid form | Item created, redirect to list, toast shown | |
| FriendsAndFansSystem Create (invalid) | /friends-and-fans-systems/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| FriendsAndFansSystem List | /friends-and-fans-systems | View with data | Items listed, ordered by newest | |
| FriendsAndFansSystem List (empty) | /friends-and-fans-systems | View with no data | Empty state with CTA | |
| FriendsAndFansSystem Detail | /friends-and-fans-systems/[id] | Click item from list | Detail page loads, all fields shown | |
| FriendsAndFansSystem Detail (404) | /friends-and-fans-systems/invalid-id | Visit invalid ID | Not found handling | |
| FriendsAndFansSystem Edit | /friends-and-fans-systems/[id]/edit | Load edit form | Form pre-filled with current values | |
| FriendsAndFansSystem Update | /friends-and-fans-systems/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| FriendsAndFansSystem Delete | /friends-and-fans-systems/[id] | Click delete | Confirmation dialog appears | |
| FriendsAndFansSystem Delete (confirm) | /friends-and-fans-systems/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| FriendsAndFansSystem Delete (cancel) | /friends-and-fans-systems/[id] | Cancel deletion | Nothing happens, dialog closes | |
| CustomVideoClips Create | /custom-video-clips/new | Submit valid form | Item created, redirect to list, toast shown | |
| CustomVideoClips Create (invalid) | /custom-video-clips/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| CustomVideoClips List | /custom-video-clips | View with data | Items listed, ordered by newest | |
| CustomVideoClips List (empty) | /custom-video-clips | View with no data | Empty state with CTA | |
| CustomVideoClips Detail | /custom-video-clips/[id] | Click item from list | Detail page loads, all fields shown | |
| CustomVideoClips Detail (404) | /custom-video-clips/invalid-id | Visit invalid ID | Not found handling | |
| CustomVideoClips Edit | /custom-video-clips/[id]/edit | Load edit form | Form pre-filled with current values | |
| CustomVideoClips Update | /custom-video-clips/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| CustomVideoClips Delete | /custom-video-clips/[id] | Click delete | Confirmation dialog appears | |
| CustomVideoClips Delete (confirm) | /custom-video-clips/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| CustomVideoClips Delete (cancel) | /custom-video-clips/[id] | Cancel deletion | Nothing happens, dialog closes | |
| PrivatePhotosets Create | /private-photosets/new | Submit valid form | Item created, redirect to list, toast shown | |
| PrivatePhotosets Create (invalid) | /private-photosets/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| PrivatePhotosets List | /private-photosets | View with data | Items listed, ordered by newest | |
| PrivatePhotosets List (empty) | /private-photosets | View with no data | Empty state with CTA | |
| PrivatePhotosets Detail | /private-photosets/[id] | Click item from list | Detail page loads, all fields shown | |
| PrivatePhotosets Detail (404) | /private-photosets/invalid-id | Visit invalid ID | Not found handling | |
| PrivatePhotosets Edit | /private-photosets/[id]/edit | Load edit form | Form pre-filled with current values | |
| PrivatePhotosets Update | /private-photosets/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| PrivatePhotosets Delete | /private-photosets/[id] | Click delete | Confirmation dialog appears | |
| PrivatePhotosets Delete (confirm) | /private-photosets/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| PrivatePhotosets Delete (cancel) | /private-photosets/[id] | Cancel deletion | Nothing happens, dialog closes | |
| WhatsappAndSkypeChats Create | /whatsapp-and-skype-chats/new | Submit valid form | Item created, redirect to list, toast shown | |
| WhatsappAndSkypeChats Create (invalid) | /whatsapp-and-skype-chats/new | Submit empty/invalid form | Field-level errors shown, form NOT reset | |
| WhatsappAndSkypeChats List | /whatsapp-and-skype-chats | View with data | Items listed, ordered by newest | |
| WhatsappAndSkypeChats List (empty) | /whatsapp-and-skype-chats | View with no data | Empty state with CTA | |
| WhatsappAndSkypeChats Detail | /whatsapp-and-skype-chats/[id] | Click item from list | Detail page loads, all fields shown | |
| WhatsappAndSkypeChats Detail (404) | /whatsapp-and-skype-chats/invalid-id | Visit invalid ID | Not found handling | |
| WhatsappAndSkypeChats Edit | /whatsapp-and-skype-chats/[id]/edit | Load edit form | Form pre-filled with current values | |
| WhatsappAndSkypeChats Update | /whatsapp-and-skype-chats/[id]/edit | Submit changes | Updated, redirect, toast shown | |
| WhatsappAndSkypeChats Delete | /whatsapp-and-skype-chats/[id] | Click delete | Confirmation dialog appears | |
| WhatsappAndSkypeChats Delete (confirm) | /whatsapp-and-skype-chats/[id] | Confirm deletion | Deleted, redirect to list, toast shown | |
| WhatsappAndSkypeChats Delete (cancel) | /whatsapp-and-skype-chats/[id] | Cancel deletion | Nothing happens, dialog closes | |

---

## Test Matrix — Dashboard

| Test | Route | Action | Expected Result | Status |
|------|-------|--------|-----------------|--------|
| Dashboard (with data) | /dashboard | View with entities | Stat cards show counts, recent items listed | |
| Dashboard (empty) | /dashboard | View with no data | Empty state with CTA | |
| Quick actions | /dashboard | Click quick action buttons | Navigate to correct pages | |
| Stat accuracy | /dashboard | Verify counts | Stats match actual data counts | |

---

## Test Matrix — Settings

| Test | Route | Action | Expected Result | Status |
|------|-------|--------|-----------------|--------|
| Load profile | /settings | Open settings page | Current profile data pre-filled | |
| Update profile | /settings | Change name, submit | Updated, toast shown | |
| Theme toggle | /settings | Switch theme | Theme changes immediately, persists on refresh | |
| Cancel changes | /settings | Edit then cancel | Reverts to original values | |

---

## Test Matrix — Edge Cases

| Test | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 404 page | Visit /this-does-not-exist | Custom 404 page with CTA | |
| Double submit | Click submit button twice rapidly | Only ONE item created | |
| XSS attempt | Enter `<script>alert(1)</script>` in text field | Escaped, not executed | |
| Long text | Enter 10,000+ characters | Handled gracefully (truncate or reject) | |
| Special characters | Enter emoji, unicode in forms | Saved and displayed correctly | |
| Offline state | Disconnect network | Offline banner appears | |
| Reconnect | Reconnect network | Banner disappears, app recovers | |

---

## Test Matrix — Forms (Phase 39 Compliance)

| Test | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| Field-level errors | Submit invalid form | Errors shown per field (not just toast) | |
| Submit button state | Click submit | Button shows "Saving..." / spinner | |
| No reset on error | Submit fails | Form keeps entered values | |
| Keyboard submit | Press Enter in form | Form submits | |
| Focus management | Submit with errors | Focus moves to first error field | |
| Dirty state warning | Edit form, try to navigate away | Warning shown | |

---

## Issue Recording Format

```
FUNCTIONAL ISSUES:
1. [FLOW] [SEVERITY] - Description
   AUTH HIGH - Login with valid credentials returns 500 instead of redirect
2. [FLOW] [SEVERITY] - Description
   CRUD MEDIUM - No confirmation dialog on delete for Posts
3. [FLOW] [SEVERITY] - Description
   EDGE LOW - Emoji in title displays as ? on list page
```

**Severity levels:**
- **HIGH** — Broken flow, user cannot complete action
- **MEDIUM** — Degraded experience, workaround exists
- **LOW** — Minor issue, cosmetic or edge case

**Flow categories:** AUTH, NAV, CRUD, DASHBOARD, SETTINGS, EDGE, FORM

---

## Validation

- [ ] Every row in every test matrix is checked (pass or fail)
- [ ] All auth flows tested (signup, login, logout, route protection)
- [ ] All navigation links verified
- [ ] User full CRUD tested (create, read, update, delete)
- [ ] Listing full CRUD tested (create, read, update, delete)
- [ ] Review full CRUD tested (create, read, update, delete)
- [ ] Shop full CRUD tested (create, read, update, delete)
- [ ] Order full CRUD tested (create, read, update, delete)
- [ ] Payment full CRUD tested (create, read, update, delete)
- [ ] Subscription full CRUD tested (create, read, update, delete)
- [ ] Upload full CRUD tested (create, read, update, delete)
- [ ] Channel full CRUD tested (create, read, update, delete)
- [ ] Notification full CRUD tested (create, read, update, delete)
- [ ] Conversation full CRUD tested (create, read, update, delete)
- [ ] Message full CRUD tested (create, read, update, delete)
- [ ] GlobalSearchFeature full CRUD tested (create, read, update, delete)
- [ ] SafeTransactions full CRUD tested (create, read, update, delete)
- [ ] OwnShopSystem full CRUD tested (create, read, update, delete)
- [ ] SetYourOwnPrices full CRUD tested (create, read, update, delete)
- [ ] NoTransactionFees full CRUD tested (create, read, update, delete)
- [ ] MessagesAndChatSystem full CRUD tested (create, read, update, delete)
- [ ] ClassifiedAdMarket full CRUD tested (create, read, update, delete)
- [ ] MemberReviews full CRUD tested (create, read, update, delete)
- [ ] PrivacyFunctions full CRUD tested (create, read, update, delete)
- [ ] MediaCloud full CRUD tested (create, read, update, delete)
- [ ] UserBlockingSystem full CRUD tested (create, read, update, delete)
- [ ] HumanOperatedFakeCheck full CRUD tested (create, read, update, delete)
- [ ] MemberReviewsAndRatings full CRUD tested (create, read, update, delete)
- [ ] FullFeaturedProfiles full CRUD tested (create, read, update, delete)
- [ ] SellerRatingsAndBuyerReviews full CRUD tested (create, read, update, delete)
- [ ] UserRankingList full CRUD tested (create, read, update, delete)
- [ ] FriendsAndFansSystem full CRUD tested (create, read, update, delete)
- [ ] CustomVideoClips full CRUD tested (create, read, update, delete)
- [ ] PrivatePhotosets full CRUD tested (create, read, update, delete)
- [ ] WhatsappAndSkypeChats full CRUD tested (create, read, update, delete)
- [ ] Edge cases tested (404, double submit, XSS, long text, offline)
- [ ] Form UX requirements verified (Phase 39 compliance)
- [ ] Dashboard tested with data and without data
- [ ] Settings update tested
- [ ] All issues recorded with flow + severity
- [ ] Issues saved for Phase 39e


---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 3: 39c - Code Quality Audit

> Source: `docs/phases/39c-code-quality-audit.md`

# 39c - Code Quality Audit

> **Purpose:** Ensure clean, type-safe, maintainable code
> **Block:** J — Quality Assurance Loop
> **Approach:** Automated checks + manual code review
> **Output:** List of code quality issues for Phase 39e

---

## Automated Checks

### 1. TypeScript Strict

```bash
npx tsc --noEmit
```

**Must have ZERO errors.** Check for:
- [ ] No `any` types
- [ ] No implicit `any` in parameters
- [ ] No unused variables or imports
- [ ] No `@ts-ignore` comments
- [ ] All return types inferrable

### 2. Build

```bash
npm run build
```

**Must succeed with zero errors.**

### 3. ESLint

```bash
npx next lint
```

**Fix all errors.**

---

## Manual Code Review

### File Organization
- [ ] Components in `components/`
- [ ] UI primitives in `components/ui/`
- [ ] Hooks in `hooks/`
- [ ] Types in `types/`
- [ ] Schemas in `lib/schemas/`

### Naming
- [ ] Components: PascalCase
- [ ] Hooks: `use` prefix, camelCase
- [ ] Types: PascalCase
- [ ] Schemas: camelCase + `Schema` suffix
- [ ] API routes: kebab-case directories
- [ ] DB tables: snake_case plural

### Imports
- [ ] All use `@/` alias
- [ ] No circular imports
- [ ] No unused imports

### Component Patterns
- [ ] Props typed (interface or type)
- [ ] No inline styles
- [ ] `cn()` for class concatenation
- [ ] "use client" only when needed

### API Patterns
- [ ] Zod validation on input
- [ ] Auth check on every route
- [ ] Standard error shape
- [ ] Proper HTTP status codes

### Type Safety
- [ ] No `as any`
- [ ] No `!` non-null assertions (except env vars)
- [ ] Zod types match TS interfaces

### Dead Code
- [ ] No unused functions
- [ ] No commented-out code
- [ ] No empty files
- [ ] No TODO/FIXME in critical paths

---

## Issue Format

```
CODE QUALITY ISSUES:
1. [FILE] [CATEGORY] - Description
   Example: components/PostCard.tsx TYPES - Uses 'any' type for props
```

Categories: TYPES, NAMING, IMPORTS, PATTERNS, DEAD_CODE, ENV, BUILD

---

## Validation

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run build` — zero errors
- [ ] No `any` types
- [ ] No unused imports
- [ ] Consistent naming
- [ ] Issues recorded for Phase 39e


---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 4: 39d - Production Readiness + Launch Ops

> Source: `docs/phases/39d-production-check.md`

# 39d - Production Readiness + Launch Ops

> **Purpose:** Complete pre-launch checklist including monitoring, webhooks, secrets, and operational readiness
> **Block:** J — Quality Assurance Loop
> **Output:** Issues for Phase 39e

---

## This Is Launch Ops — Not Just a Build Check

A clean build is 20% of production readiness. The other 80% is: monitoring, webhook verification, secret management, email testing, database backups, and RLS auditing.

---

## Checklist

### Build & Type Safety
- [ ] `npm run build` succeeds with zero errors
- [ ] `npx tsc --noEmit` succeeds with zero errors
- [ ] Build output < 500KB first-load JS per route
- [ ] No TypeScript `any` types (search: `: any`)
- [ ] No `@ts-ignore` or `@ts-expect-error`

### Security
- [ ] No secrets in source code (`grep -r "sk_" "sb_" "key_"`)
- [ ] `.env.example` has no actual secret values
- [ ] `.gitignore` includes: .env.local, .env, node_modules/, .next/
- [ ] All API routes check authentication (except public endpoints)
- [ ] RLS enabled on ALL tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] No `console.log` that leaks sensitive data (tokens, passwords, keys)
- [ ] Input validation (Zod) on ALL API endpoints
- [ ] CSRF protection on mutation routes
- [ ] Security headers configured (Phase 43)

### Error Monitoring (Sentry-Ready)
- [ ] `logError()` utility used in all catch blocks
- [ ] Error boundaries at root, app, and entity levels
- [ ] Error boundaries show user-friendly messages + error digest
- [ ] `// TODO: Sentry.captureException` comments in place for easy activation
- [ ] When Sentry is added: `SENTRY_DSN` in .env.example

### Stripe Webhook Verification
- [ ] Webhook endpoint exists at `/api/stripe/webhook`
- [ ] Webhook signature verification using `stripe.webhooks.constructEvent()`
- [ ] Webhook handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Webhook NOT rate limited (Phase 44)
- [ ] Test webhook with: `stripe trigger checkout.session.completed`
- [ ] `STRIPE_WEBHOOK_SECRET` in .env.example

### Cron / Background Jobs (if applicable)
- [ ] Cron secret set in env (`CRON_SECRET`)
- [ ] Cron routes verify secret: `Authorization: Bearer ${CRON_SECRET}`
- [ ] Cron job listed in vercel.json or documented
- [ ] Kill switch: `FEATURE_CRON=false` disables all cron

### Email (if applicable)
- [ ] Email templates render correctly (preview/test)
- [ ] Sender address verified (no-reply@domain or via Resend/SendGrid)
- [ ] Test send works (manual verification)
- [ ] Email env vars in .env.example

### Environment Variables
- [ ] `.env.example` lists ALL required variables
- [ ] Each variable has a descriptive comment
- [ ] Server-only vars do NOT have `NEXT_PUBLIC_` prefix
- [ ] Client vars have `NEXT_PUBLIC_` prefix
- [ ] Feature flags documented (Phase 38b)
- [ ] No placeholder values in production env

### Database
- [ ] Schema applied successfully
- [ ] All RLS policies tested (as authenticated and anonymous)
- [ ] RLS audit: query each table as different roles
- [ ] Database backup schedule documented or configured
- [ ] Indexes on frequently queried columns (user_id, created_at)
- [ ] No orphaned data possible (cascade or restrict on FKs)

### Documentation
- [ ] README.md with getting started guide
- [ ] .env.example complete and commented
- [ ] INSTRUCTIONS.md present (build guide)
- [ ] CLAUDE.md / .cursorrules present (agent guide)

### Console Cleanup
- [ ] Remove all `console.log` (keep `console.error` for real errors only)
- [ ] Remove all `debugger` statements
- [ ] Remove all commented-out code blocks
- [ ] Remove all placeholder/lorem ipsum text
- [ ] Remove all TODO comments that should be done before launch

### Feature Flags
- [ ] Kill switches work (Phase 38b)
- [ ] Health check shows feature flag states
- [ ] Maintenance mode works when enabled

---

## Run Final Verification

```bash
# Clean build
rm -rf .next
npm run build

# Type check
npx tsc --noEmit

# Search for secrets in code
grep -rn "sk_live\|sb_\|password.*=.*['\"]" --include="*.ts" --include="*.tsx" || echo "No secrets found"

# Search for console.log
grep -rn "console\.log" app/ lib/ components/ --include="*.ts" --include="*.tsx" || echo "No console.log found"

# Search for any types
grep -rn ": any" app/ lib/ components/ --include="*.ts" --include="*.tsx" || echo "No 'any' types found"
```

---

## Issue Format

```
PRODUCTION ISSUES:
1. [CATEGORY] [SEVERITY] - Description
   SECURITY HIGH - API route /api/posts has no auth check
   MONITORING MEDIUM - No error logging in auth callback
   DATABASE LOW - Missing index on posts.category
```

Categories: BUILD, SECURITY, MONITORING, STRIPE, CRON, EMAIL, ENV, DATABASE, DOCS, CLEANUP, FLAGS
Severity: HIGH (must fix before launch), MEDIUM (should fix), LOW (nice to fix)

---

## Compliance & Data Integrity Audit

### Privacy Basics (always applies)

- [ ] PII never logged (verify with: `grep -rn "email\|password" app/ lib/ --include="*.ts" | grep "console"`)
- [ ] User data export endpoint exists (`/api/user/export`) — or at minimum: documented how user can request data
- [ ] Account deletion endpoint exists (`/api/user/delete`)
- [ ] No orphaned data possible (CASCADE or RESTRICT on all FKs)

### Security Baseline (always applies)

- [ ] Access controls: RLS on all tables (verify in schema.sql)
- [ ] Audit trail: audit_logs table and triggers exist (Phase 48)
- [ ] Input validation: Zod on all API endpoints
- [ ] Encryption in transit: HSTS header present (Phase 43)
- [ ] Error handling: standardized error codes via apiError()
- [ ] Monitoring: logError() used in all catch blocks

---

## Validation

- [ ] Clean build passes
- [ ] No secrets in source code
- [ ] All API routes authenticated
- [ ] Error monitoring ready (Sentry hooks in place)
- [ ] Stripe webhooks verified
- [ ] .env.example complete
- [ ] RLS audit passed
- [ ] No console.log in production code (except structured error logging)
- [ ] Feature flags / kill switches working
- [ ] Privacy basics verified (data export, deletion, no PII logging)
- [ ] Security baseline verified (RLS, Zod, HSTS)
- [ ] Issues recorded for Phase 39e


---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 5: 39e - Fix Round 1

> Source: `docs/phases/39e-fix-round.md`

# 39e - Fix Round 1

> **Purpose:** Fix ALL HIGH and MEDIUM severity issues from Phases 57-60
> **Block:** J — Quality Assurance Loop
> **Approach:** Prioritize by severity, fix systematically

---

## Execution Protocol

### Step 1: Collect All Issues

Gather all issues recorded in Phases 39-39d:
- Visual issues (Phase 39)
- Functional issues (Phase 39b)
- Code quality issues (Phase 39c)
- Production readiness issues (Phase 39d)

### Step 2: Sort by Severity

1. **HIGH** — Fix first. These are blocking issues.
2. **MEDIUM** — Fix next. These degrade the experience.
3. **LOW** — Fix if time permits.

### Step 3: Fix HIGH Issues

Work through each HIGH issue:
1. Read the issue description
2. Find the affected file
3. Apply the fix
4. Verify the fix works
5. Run `npx tsc --noEmit` after each fix

### Step 4: Fix MEDIUM Issues

Same process for MEDIUM issues.

### Step 5: Fix LOW Issues

Fix as many LOW issues as possible.

### Step 6: Verification

```bash
npx tsc --noEmit          # Must pass
npm run build              # Must pass
```

---

## Common Fix Patterns

### Visual Fixes
- Spacing: Use design token spacing scale from Phase 04
- Colors: Replace hardcoded colors with CSS variables
- Dark mode: `bg-white` → `bg-background`, `text-black` → `text-foreground`
- Responsive: Add `grid-cols-1 md:grid-cols-2`

### Functional Fixes
- Form validation: Check Zod schema matches form fields
- Auth redirect: Check middleware matcher
- 404s: Verify route file exists at correct path
- CRUD fails: Check Supabase table name, RLS policy

### Code Quality Fixes
- `any` type: Replace with proper type or `unknown`
- Unused import: Remove the import line
- Missing auth: Add `supabase.auth.getUser()` check
- Naming: Rename to match convention

### Production Fixes
- console.log: Remove (keep console.error)
- Missing env var: Add to .env.example
- Build failure: Read error message, fix specific file

---

## Validation

- [ ] All HIGH issues fixed
- [ ] All MEDIUM issues fixed
- [ ] LOW issues: at least 80% fixed
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes


---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 6: 39f - QA / E2E Scenarios

> Source: `docs/phases/39f-e2e-testing.md`

# 39f - QA / E2E Scenarios

> **Purpose:** Define test scenarios, generate E2E tests, establish quality gates
> **Input:** flows[], entities[], features[], roles[]
> **Output:** Test scenarios, Playwright tests, coverage report

---

## Stop Conditions

- ✗ Core flow without E2E test → BLOCK
- ✗ CRUD without API test → BLOCK
- ✗ Auth flow not tested → BLOCK
- ✗ Test coverage < 70% on critical paths → BLOCK

---

## Gate D Validation

This phase validates Gate D. All scenarios must be playable before proceeding.

---

## Input from CONTEXT.md

```yaml
entities: [User, Listing, Review, Shop, Order, Payment, Subscription, Upload, Channel, Notification, Conversation, Message, GlobalSearchFeature, SafeTransactions, OwnShopSystem, SetYourOwnPrices, NoTransactionFees, MessagesAndChatSystem, ClassifiedAdMarket, MemberReviews, PrivacyFunctions, MediaCloud, UserBlockingSystem, HumanOperatedFakeCheck, MemberReviewsAndRatings, FullFeaturedProfiles, SellerRatingsAndBuyerReviews, UserRankingList, FriendsAndFansSystem, CustomVideoClips, PrivatePhotosets, WhatsappAndSkypeChats]
roles: [user, admin]

flows:
  - Buyer Flow
  - Seller Flow
  - Admin Flow

features:
  payments: false
  realtime: false
```

---

## Tasks (Sequential)

### Task 1: Generate Test Scenarios

File: `docs/TEST_SCENARIOS.md`

```markdown
# Test Scenarios - PantyHub

## Authentication Scenarios

### AUTH-001: New User Signup
- **Precondition:** User not logged in
- **Steps:**
  1. Navigate to /signup
  2. Enter valid email and password
  3. Submit form
  4. Verify email (if required)
- **Expected:** User logged in, redirected to dashboard
- **Priority:** Critical

### AUTH-002: Existing User Login
- **Precondition:** User has account
- **Steps:**
  1. Navigate to /login
  2. Enter credentials
  3. Submit form
- **Expected:** User logged in, redirected to dashboard
- **Priority:** Critical

### AUTH-003: Invalid Login
- **Precondition:** User not logged in
- **Steps:**
  1. Navigate to /login
  2. Enter invalid credentials
  3. Submit form
- **Expected:** Error message, stay on login page
- **Priority:** High

### AUTH-004: Logout
- **Precondition:** User logged in
- **Steps:**
  1. Click logout button
- **Expected:** Session cleared, redirected to /login
- **Priority:** High


## User Scenarios

### USER-001: Create User
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /users/new
  2. Fill required fields
  3. Submit form
- **Expected:** User created, redirected to detail
- **Priority:** Critical

### USER-002: List Users
- **Precondition:** User logged in, at least one User exists
- **Steps:**
  1. Navigate to /users
- **Expected:** List displays user's Users
- **Priority:** High

### USER-003: View User
- **Precondition:** User logged in, User exists
- **Steps:**
  1. Navigate to /users/[id]
- **Expected:** User details displayed
- **Priority:** High

### USER-004: Update User
- **Precondition:** User logged in, owns User
- **Steps:**
  1. Navigate to /users/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** User updated
- **Priority:** High

### USER-005: Delete User
- **Precondition:** User logged in, owns User
- **Steps:**
  1. Navigate to /users/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** User deleted, redirected to list
- **Priority:** Medium


## Listing Scenarios

### LISTING-001: Create Listing
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /listings/new
  2. Fill required fields
  3. Submit form
- **Expected:** Listing created, redirected to detail
- **Priority:** Critical

### LISTING-002: List Listings
- **Precondition:** User logged in, at least one Listing exists
- **Steps:**
  1. Navigate to /listings
- **Expected:** List displays user's Listings
- **Priority:** High

### LISTING-003: View Listing
- **Precondition:** User logged in, Listing exists
- **Steps:**
  1. Navigate to /listings/[id]
- **Expected:** Listing details displayed
- **Priority:** High

### LISTING-004: Update Listing
- **Precondition:** User logged in, owns Listing
- **Steps:**
  1. Navigate to /listings/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Listing updated
- **Priority:** High

### LISTING-005: Delete Listing
- **Precondition:** User logged in, owns Listing
- **Steps:**
  1. Navigate to /listings/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Listing deleted, redirected to list
- **Priority:** Medium


## Review Scenarios

### REVIEW-001: Create Review
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /reviews/new
  2. Fill required fields
  3. Submit form
- **Expected:** Review created, redirected to detail
- **Priority:** Critical

### REVIEW-002: List Reviews
- **Precondition:** User logged in, at least one Review exists
- **Steps:**
  1. Navigate to /reviews
- **Expected:** List displays user's Reviews
- **Priority:** High

### REVIEW-003: View Review
- **Precondition:** User logged in, Review exists
- **Steps:**
  1. Navigate to /reviews/[id]
- **Expected:** Review details displayed
- **Priority:** High

### REVIEW-004: Update Review
- **Precondition:** User logged in, owns Review
- **Steps:**
  1. Navigate to /reviews/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Review updated
- **Priority:** High

### REVIEW-005: Delete Review
- **Precondition:** User logged in, owns Review
- **Steps:**
  1. Navigate to /reviews/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Review deleted, redirected to list
- **Priority:** Medium


## Shop Scenarios

### SHOP-001: Create Shop
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /shops/new
  2. Fill required fields
  3. Submit form
- **Expected:** Shop created, redirected to detail
- **Priority:** Critical

### SHOP-002: List Shops
- **Precondition:** User logged in, at least one Shop exists
- **Steps:**
  1. Navigate to /shops
- **Expected:** List displays user's Shops
- **Priority:** High

### SHOP-003: View Shop
- **Precondition:** User logged in, Shop exists
- **Steps:**
  1. Navigate to /shops/[id]
- **Expected:** Shop details displayed
- **Priority:** High

### SHOP-004: Update Shop
- **Precondition:** User logged in, owns Shop
- **Steps:**
  1. Navigate to /shops/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Shop updated
- **Priority:** High

### SHOP-005: Delete Shop
- **Precondition:** User logged in, owns Shop
- **Steps:**
  1. Navigate to /shops/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Shop deleted, redirected to list
- **Priority:** Medium


## Order Scenarios

### ORDER-001: Create Order
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /orders/new
  2. Fill required fields
  3. Submit form
- **Expected:** Order created, redirected to detail
- **Priority:** Critical

### ORDER-002: List Orders
- **Precondition:** User logged in, at least one Order exists
- **Steps:**
  1. Navigate to /orders
- **Expected:** List displays user's Orders
- **Priority:** High

### ORDER-003: View Order
- **Precondition:** User logged in, Order exists
- **Steps:**
  1. Navigate to /orders/[id]
- **Expected:** Order details displayed
- **Priority:** High

### ORDER-004: Update Order
- **Precondition:** User logged in, owns Order
- **Steps:**
  1. Navigate to /orders/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Order updated
- **Priority:** High

### ORDER-005: Delete Order
- **Precondition:** User logged in, owns Order
- **Steps:**
  1. Navigate to /orders/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Order deleted, redirected to list
- **Priority:** Medium


## Payment Scenarios

### PAYMENT-001: Create Payment
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /payments/new
  2. Fill required fields
  3. Submit form
- **Expected:** Payment created, redirected to detail
- **Priority:** Critical

### PAYMENT-002: List Payments
- **Precondition:** User logged in, at least one Payment exists
- **Steps:**
  1. Navigate to /payments
- **Expected:** List displays user's Payments
- **Priority:** High

### PAYMENT-003: View Payment
- **Precondition:** User logged in, Payment exists
- **Steps:**
  1. Navigate to /payments/[id]
- **Expected:** Payment details displayed
- **Priority:** High

### PAYMENT-004: Update Payment
- **Precondition:** User logged in, owns Payment
- **Steps:**
  1. Navigate to /payments/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Payment updated
- **Priority:** High

### PAYMENT-005: Delete Payment
- **Precondition:** User logged in, owns Payment
- **Steps:**
  1. Navigate to /payments/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Payment deleted, redirected to list
- **Priority:** Medium


## Subscription Scenarios

### SUBSCRIPTION-001: Create Subscription
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /subscriptions/new
  2. Fill required fields
  3. Submit form
- **Expected:** Subscription created, redirected to detail
- **Priority:** Critical

### SUBSCRIPTION-002: List Subscriptions
- **Precondition:** User logged in, at least one Subscription exists
- **Steps:**
  1. Navigate to /subscriptions
- **Expected:** List displays user's Subscriptions
- **Priority:** High

### SUBSCRIPTION-003: View Subscription
- **Precondition:** User logged in, Subscription exists
- **Steps:**
  1. Navigate to /subscriptions/[id]
- **Expected:** Subscription details displayed
- **Priority:** High

### SUBSCRIPTION-004: Update Subscription
- **Precondition:** User logged in, owns Subscription
- **Steps:**
  1. Navigate to /subscriptions/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Subscription updated
- **Priority:** High

### SUBSCRIPTION-005: Delete Subscription
- **Precondition:** User logged in, owns Subscription
- **Steps:**
  1. Navigate to /subscriptions/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Subscription deleted, redirected to list
- **Priority:** Medium


## Upload Scenarios

### UPLOAD-001: Create Upload
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /uploads/new
  2. Fill required fields
  3. Submit form
- **Expected:** Upload created, redirected to detail
- **Priority:** Critical

### UPLOAD-002: List Uploads
- **Precondition:** User logged in, at least one Upload exists
- **Steps:**
  1. Navigate to /uploads
- **Expected:** List displays user's Uploads
- **Priority:** High

### UPLOAD-003: View Upload
- **Precondition:** User logged in, Upload exists
- **Steps:**
  1. Navigate to /uploads/[id]
- **Expected:** Upload details displayed
- **Priority:** High

### UPLOAD-004: Update Upload
- **Precondition:** User logged in, owns Upload
- **Steps:**
  1. Navigate to /uploads/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Upload updated
- **Priority:** High

### UPLOAD-005: Delete Upload
- **Precondition:** User logged in, owns Upload
- **Steps:**
  1. Navigate to /uploads/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Upload deleted, redirected to list
- **Priority:** Medium


## Channel Scenarios

### CHANNEL-001: Create Channel
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /channels/new
  2. Fill required fields
  3. Submit form
- **Expected:** Channel created, redirected to detail
- **Priority:** Critical

### CHANNEL-002: List Channels
- **Precondition:** User logged in, at least one Channel exists
- **Steps:**
  1. Navigate to /channels
- **Expected:** List displays user's Channels
- **Priority:** High

### CHANNEL-003: View Channel
- **Precondition:** User logged in, Channel exists
- **Steps:**
  1. Navigate to /channels/[id]
- **Expected:** Channel details displayed
- **Priority:** High

### CHANNEL-004: Update Channel
- **Precondition:** User logged in, owns Channel
- **Steps:**
  1. Navigate to /channels/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Channel updated
- **Priority:** High

### CHANNEL-005: Delete Channel
- **Precondition:** User logged in, owns Channel
- **Steps:**
  1. Navigate to /channels/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Channel deleted, redirected to list
- **Priority:** Medium


## Notification Scenarios

### NOTIFICATION-001: Create Notification
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /notifications/new
  2. Fill required fields
  3. Submit form
- **Expected:** Notification created, redirected to detail
- **Priority:** Critical

### NOTIFICATION-002: List Notifications
- **Precondition:** User logged in, at least one Notification exists
- **Steps:**
  1. Navigate to /notifications
- **Expected:** List displays user's Notifications
- **Priority:** High

### NOTIFICATION-003: View Notification
- **Precondition:** User logged in, Notification exists
- **Steps:**
  1. Navigate to /notifications/[id]
- **Expected:** Notification details displayed
- **Priority:** High

### NOTIFICATION-004: Update Notification
- **Precondition:** User logged in, owns Notification
- **Steps:**
  1. Navigate to /notifications/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Notification updated
- **Priority:** High

### NOTIFICATION-005: Delete Notification
- **Precondition:** User logged in, owns Notification
- **Steps:**
  1. Navigate to /notifications/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Notification deleted, redirected to list
- **Priority:** Medium


## Conversation Scenarios

### CONVERSATION-001: Create Conversation
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /conversations/new
  2. Fill required fields
  3. Submit form
- **Expected:** Conversation created, redirected to detail
- **Priority:** Critical

### CONVERSATION-002: List Conversations
- **Precondition:** User logged in, at least one Conversation exists
- **Steps:**
  1. Navigate to /conversations
- **Expected:** List displays user's Conversations
- **Priority:** High

### CONVERSATION-003: View Conversation
- **Precondition:** User logged in, Conversation exists
- **Steps:**
  1. Navigate to /conversations/[id]
- **Expected:** Conversation details displayed
- **Priority:** High

### CONVERSATION-004: Update Conversation
- **Precondition:** User logged in, owns Conversation
- **Steps:**
  1. Navigate to /conversations/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Conversation updated
- **Priority:** High

### CONVERSATION-005: Delete Conversation
- **Precondition:** User logged in, owns Conversation
- **Steps:**
  1. Navigate to /conversations/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Conversation deleted, redirected to list
- **Priority:** Medium


## Message Scenarios

### MESSAGE-001: Create Message
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /messages/new
  2. Fill required fields
  3. Submit form
- **Expected:** Message created, redirected to detail
- **Priority:** Critical

### MESSAGE-002: List Messages
- **Precondition:** User logged in, at least one Message exists
- **Steps:**
  1. Navigate to /messages
- **Expected:** List displays user's Messages
- **Priority:** High

### MESSAGE-003: View Message
- **Precondition:** User logged in, Message exists
- **Steps:**
  1. Navigate to /messages/[id]
- **Expected:** Message details displayed
- **Priority:** High

### MESSAGE-004: Update Message
- **Precondition:** User logged in, owns Message
- **Steps:**
  1. Navigate to /messages/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Message updated
- **Priority:** High

### MESSAGE-005: Delete Message
- **Precondition:** User logged in, owns Message
- **Steps:**
  1. Navigate to /messages/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Message deleted, redirected to list
- **Priority:** Medium


## Global Search Feature Scenarios

### GLOBALSEARCHFEATURE-001: Create Global Search Feature
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /global-search-features/new
  2. Fill required fields
  3. Submit form
- **Expected:** Global Search Feature created, redirected to detail
- **Priority:** Critical

### GLOBALSEARCHFEATURE-002: List Global Search Features
- **Precondition:** User logged in, at least one Global Search Feature exists
- **Steps:**
  1. Navigate to /global-search-features
- **Expected:** List displays user's Global Search Features
- **Priority:** High

### GLOBALSEARCHFEATURE-003: View Global Search Feature
- **Precondition:** User logged in, Global Search Feature exists
- **Steps:**
  1. Navigate to /global-search-features/[id]
- **Expected:** Global Search Feature details displayed
- **Priority:** High

### GLOBALSEARCHFEATURE-004: Update Global Search Feature
- **Precondition:** User logged in, owns Global Search Feature
- **Steps:**
  1. Navigate to /global-search-features/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Global Search Feature updated
- **Priority:** High

### GLOBALSEARCHFEATURE-005: Delete Global Search Feature
- **Precondition:** User logged in, owns Global Search Feature
- **Steps:**
  1. Navigate to /global-search-features/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Global Search Feature deleted, redirected to list
- **Priority:** Medium


## Safe Transactions Scenarios

### SAFETRANSACTIONS-001: Create Safe Transactions
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /safe-transactions/new
  2. Fill required fields
  3. Submit form
- **Expected:** Safe Transactions created, redirected to detail
- **Priority:** Critical

### SAFETRANSACTIONS-002: List Safe Transactions
- **Precondition:** User logged in, at least one Safe Transactions exists
- **Steps:**
  1. Navigate to /safe-transactions
- **Expected:** List displays user's Safe Transactions
- **Priority:** High

### SAFETRANSACTIONS-003: View Safe Transactions
- **Precondition:** User logged in, Safe Transactions exists
- **Steps:**
  1. Navigate to /safe-transactions/[id]
- **Expected:** Safe Transactions details displayed
- **Priority:** High

### SAFETRANSACTIONS-004: Update Safe Transactions
- **Precondition:** User logged in, owns Safe Transactions
- **Steps:**
  1. Navigate to /safe-transactions/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Safe Transactions updated
- **Priority:** High

### SAFETRANSACTIONS-005: Delete Safe Transactions
- **Precondition:** User logged in, owns Safe Transactions
- **Steps:**
  1. Navigate to /safe-transactions/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Safe Transactions deleted, redirected to list
- **Priority:** Medium


## Own Shop System Scenarios

### OWNSHOPSYSTEM-001: Create Own Shop System
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /own-shop-systems/new
  2. Fill required fields
  3. Submit form
- **Expected:** Own Shop System created, redirected to detail
- **Priority:** Critical

### OWNSHOPSYSTEM-002: List Own Shop Systems
- **Precondition:** User logged in, at least one Own Shop System exists
- **Steps:**
  1. Navigate to /own-shop-systems
- **Expected:** List displays user's Own Shop Systems
- **Priority:** High

### OWNSHOPSYSTEM-003: View Own Shop System
- **Precondition:** User logged in, Own Shop System exists
- **Steps:**
  1. Navigate to /own-shop-systems/[id]
- **Expected:** Own Shop System details displayed
- **Priority:** High

### OWNSHOPSYSTEM-004: Update Own Shop System
- **Precondition:** User logged in, owns Own Shop System
- **Steps:**
  1. Navigate to /own-shop-systems/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Own Shop System updated
- **Priority:** High

### OWNSHOPSYSTEM-005: Delete Own Shop System
- **Precondition:** User logged in, owns Own Shop System
- **Steps:**
  1. Navigate to /own-shop-systems/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Own Shop System deleted, redirected to list
- **Priority:** Medium


## Set Your Own Prices Scenarios

### SETYOUROWNPRICES-001: Create Set Your Own Prices
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /set-your-own-prices/new
  2. Fill required fields
  3. Submit form
- **Expected:** Set Your Own Prices created, redirected to detail
- **Priority:** Critical

### SETYOUROWNPRICES-002: List Set Your Own Prices
- **Precondition:** User logged in, at least one Set Your Own Prices exists
- **Steps:**
  1. Navigate to /set-your-own-prices
- **Expected:** List displays user's Set Your Own Prices
- **Priority:** High

### SETYOUROWNPRICES-003: View Set Your Own Prices
- **Precondition:** User logged in, Set Your Own Prices exists
- **Steps:**
  1. Navigate to /set-your-own-prices/[id]
- **Expected:** Set Your Own Prices details displayed
- **Priority:** High

### SETYOUROWNPRICES-004: Update Set Your Own Prices
- **Precondition:** User logged in, owns Set Your Own Prices
- **Steps:**
  1. Navigate to /set-your-own-prices/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Set Your Own Prices updated
- **Priority:** High

### SETYOUROWNPRICES-005: Delete Set Your Own Prices
- **Precondition:** User logged in, owns Set Your Own Prices
- **Steps:**
  1. Navigate to /set-your-own-prices/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Set Your Own Prices deleted, redirected to list
- **Priority:** Medium


## No Transaction Fees Scenarios

### NOTRANSACTIONFEES-001: Create No Transaction Fees
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /no-transaction-fees/new
  2. Fill required fields
  3. Submit form
- **Expected:** No Transaction Fees created, redirected to detail
- **Priority:** Critical

### NOTRANSACTIONFEES-002: List No Transaction Fees
- **Precondition:** User logged in, at least one No Transaction Fees exists
- **Steps:**
  1. Navigate to /no-transaction-fees
- **Expected:** List displays user's No Transaction Fees
- **Priority:** High

### NOTRANSACTIONFEES-003: View No Transaction Fees
- **Precondition:** User logged in, No Transaction Fees exists
- **Steps:**
  1. Navigate to /no-transaction-fees/[id]
- **Expected:** No Transaction Fees details displayed
- **Priority:** High

### NOTRANSACTIONFEES-004: Update No Transaction Fees
- **Precondition:** User logged in, owns No Transaction Fees
- **Steps:**
  1. Navigate to /no-transaction-fees/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** No Transaction Fees updated
- **Priority:** High

### NOTRANSACTIONFEES-005: Delete No Transaction Fees
- **Precondition:** User logged in, owns No Transaction Fees
- **Steps:**
  1. Navigate to /no-transaction-fees/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** No Transaction Fees deleted, redirected to list
- **Priority:** Medium


## Messages And Chat System Scenarios

### MESSAGESANDCHATSYSTEM-001: Create Messages And Chat System
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /messages-and-chat-systems/new
  2. Fill required fields
  3. Submit form
- **Expected:** Messages And Chat System created, redirected to detail
- **Priority:** Critical

### MESSAGESANDCHATSYSTEM-002: List Messages And Chat Systems
- **Precondition:** User logged in, at least one Messages And Chat System exists
- **Steps:**
  1. Navigate to /messages-and-chat-systems
- **Expected:** List displays user's Messages And Chat Systems
- **Priority:** High

### MESSAGESANDCHATSYSTEM-003: View Messages And Chat System
- **Precondition:** User logged in, Messages And Chat System exists
- **Steps:**
  1. Navigate to /messages-and-chat-systems/[id]
- **Expected:** Messages And Chat System details displayed
- **Priority:** High

### MESSAGESANDCHATSYSTEM-004: Update Messages And Chat System
- **Precondition:** User logged in, owns Messages And Chat System
- **Steps:**
  1. Navigate to /messages-and-chat-systems/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Messages And Chat System updated
- **Priority:** High

### MESSAGESANDCHATSYSTEM-005: Delete Messages And Chat System
- **Precondition:** User logged in, owns Messages And Chat System
- **Steps:**
  1. Navigate to /messages-and-chat-systems/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Messages And Chat System deleted, redirected to list
- **Priority:** Medium


## Classified Ad Market Scenarios

### CLASSIFIEDADMARKET-001: Create Classified Ad Market
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /classified-ad-markets/new
  2. Fill required fields
  3. Submit form
- **Expected:** Classified Ad Market created, redirected to detail
- **Priority:** Critical

### CLASSIFIEDADMARKET-002: List Classified Ad Markets
- **Precondition:** User logged in, at least one Classified Ad Market exists
- **Steps:**
  1. Navigate to /classified-ad-markets
- **Expected:** List displays user's Classified Ad Markets
- **Priority:** High

### CLASSIFIEDADMARKET-003: View Classified Ad Market
- **Precondition:** User logged in, Classified Ad Market exists
- **Steps:**
  1. Navigate to /classified-ad-markets/[id]
- **Expected:** Classified Ad Market details displayed
- **Priority:** High

### CLASSIFIEDADMARKET-004: Update Classified Ad Market
- **Precondition:** User logged in, owns Classified Ad Market
- **Steps:**
  1. Navigate to /classified-ad-markets/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Classified Ad Market updated
- **Priority:** High

### CLASSIFIEDADMARKET-005: Delete Classified Ad Market
- **Precondition:** User logged in, owns Classified Ad Market
- **Steps:**
  1. Navigate to /classified-ad-markets/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Classified Ad Market deleted, redirected to list
- **Priority:** Medium


## Member Reviews Scenarios

### MEMBERREVIEWS-001: Create Member Reviews
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /member-reviews/new
  2. Fill required fields
  3. Submit form
- **Expected:** Member Reviews created, redirected to detail
- **Priority:** Critical

### MEMBERREVIEWS-002: List Member Reviews
- **Precondition:** User logged in, at least one Member Reviews exists
- **Steps:**
  1. Navigate to /member-reviews
- **Expected:** List displays user's Member Reviews
- **Priority:** High

### MEMBERREVIEWS-003: View Member Reviews
- **Precondition:** User logged in, Member Reviews exists
- **Steps:**
  1. Navigate to /member-reviews/[id]
- **Expected:** Member Reviews details displayed
- **Priority:** High

### MEMBERREVIEWS-004: Update Member Reviews
- **Precondition:** User logged in, owns Member Reviews
- **Steps:**
  1. Navigate to /member-reviews/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Member Reviews updated
- **Priority:** High

### MEMBERREVIEWS-005: Delete Member Reviews
- **Precondition:** User logged in, owns Member Reviews
- **Steps:**
  1. Navigate to /member-reviews/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Member Reviews deleted, redirected to list
- **Priority:** Medium


## Privacy Functions Scenarios

### PRIVACYFUNCTIONS-001: Create Privacy Functions
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /privacy-functions/new
  2. Fill required fields
  3. Submit form
- **Expected:** Privacy Functions created, redirected to detail
- **Priority:** Critical

### PRIVACYFUNCTIONS-002: List Privacy Functions
- **Precondition:** User logged in, at least one Privacy Functions exists
- **Steps:**
  1. Navigate to /privacy-functions
- **Expected:** List displays user's Privacy Functions
- **Priority:** High

### PRIVACYFUNCTIONS-003: View Privacy Functions
- **Precondition:** User logged in, Privacy Functions exists
- **Steps:**
  1. Navigate to /privacy-functions/[id]
- **Expected:** Privacy Functions details displayed
- **Priority:** High

### PRIVACYFUNCTIONS-004: Update Privacy Functions
- **Precondition:** User logged in, owns Privacy Functions
- **Steps:**
  1. Navigate to /privacy-functions/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Privacy Functions updated
- **Priority:** High

### PRIVACYFUNCTIONS-005: Delete Privacy Functions
- **Precondition:** User logged in, owns Privacy Functions
- **Steps:**
  1. Navigate to /privacy-functions/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Privacy Functions deleted, redirected to list
- **Priority:** Medium


## Media Cloud Scenarios

### MEDIACLOUD-001: Create Media Cloud
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /media-clouds/new
  2. Fill required fields
  3. Submit form
- **Expected:** Media Cloud created, redirected to detail
- **Priority:** Critical

### MEDIACLOUD-002: List Media Clouds
- **Precondition:** User logged in, at least one Media Cloud exists
- **Steps:**
  1. Navigate to /media-clouds
- **Expected:** List displays user's Media Clouds
- **Priority:** High

### MEDIACLOUD-003: View Media Cloud
- **Precondition:** User logged in, Media Cloud exists
- **Steps:**
  1. Navigate to /media-clouds/[id]
- **Expected:** Media Cloud details displayed
- **Priority:** High

### MEDIACLOUD-004: Update Media Cloud
- **Precondition:** User logged in, owns Media Cloud
- **Steps:**
  1. Navigate to /media-clouds/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Media Cloud updated
- **Priority:** High

### MEDIACLOUD-005: Delete Media Cloud
- **Precondition:** User logged in, owns Media Cloud
- **Steps:**
  1. Navigate to /media-clouds/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Media Cloud deleted, redirected to list
- **Priority:** Medium


## User Blocking System Scenarios

### USERBLOCKINGSYSTEM-001: Create User Blocking System
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /user-blocking-systems/new
  2. Fill required fields
  3. Submit form
- **Expected:** User Blocking System created, redirected to detail
- **Priority:** Critical

### USERBLOCKINGSYSTEM-002: List User Blocking Systems
- **Precondition:** User logged in, at least one User Blocking System exists
- **Steps:**
  1. Navigate to /user-blocking-systems
- **Expected:** List displays user's User Blocking Systems
- **Priority:** High

### USERBLOCKINGSYSTEM-003: View User Blocking System
- **Precondition:** User logged in, User Blocking System exists
- **Steps:**
  1. Navigate to /user-blocking-systems/[id]
- **Expected:** User Blocking System details displayed
- **Priority:** High

### USERBLOCKINGSYSTEM-004: Update User Blocking System
- **Precondition:** User logged in, owns User Blocking System
- **Steps:**
  1. Navigate to /user-blocking-systems/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** User Blocking System updated
- **Priority:** High

### USERBLOCKINGSYSTEM-005: Delete User Blocking System
- **Precondition:** User logged in, owns User Blocking System
- **Steps:**
  1. Navigate to /user-blocking-systems/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** User Blocking System deleted, redirected to list
- **Priority:** Medium


## Human Operated Fake Check Scenarios

### HUMANOPERATEDFAKECHECK-001: Create Human Operated Fake Check
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /human-operated-fake-checks/new
  2. Fill required fields
  3. Submit form
- **Expected:** Human Operated Fake Check created, redirected to detail
- **Priority:** Critical

### HUMANOPERATEDFAKECHECK-002: List Human Operated Fake Checks
- **Precondition:** User logged in, at least one Human Operated Fake Check exists
- **Steps:**
  1. Navigate to /human-operated-fake-checks
- **Expected:** List displays user's Human Operated Fake Checks
- **Priority:** High

### HUMANOPERATEDFAKECHECK-003: View Human Operated Fake Check
- **Precondition:** User logged in, Human Operated Fake Check exists
- **Steps:**
  1. Navigate to /human-operated-fake-checks/[id]
- **Expected:** Human Operated Fake Check details displayed
- **Priority:** High

### HUMANOPERATEDFAKECHECK-004: Update Human Operated Fake Check
- **Precondition:** User logged in, owns Human Operated Fake Check
- **Steps:**
  1. Navigate to /human-operated-fake-checks/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Human Operated Fake Check updated
- **Priority:** High

### HUMANOPERATEDFAKECHECK-005: Delete Human Operated Fake Check
- **Precondition:** User logged in, owns Human Operated Fake Check
- **Steps:**
  1. Navigate to /human-operated-fake-checks/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Human Operated Fake Check deleted, redirected to list
- **Priority:** Medium


## Member Reviews And Ratings Scenarios

### MEMBERREVIEWSANDRATINGS-001: Create Member Reviews And Ratings
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /member-reviews-and-ratings/new
  2. Fill required fields
  3. Submit form
- **Expected:** Member Reviews And Ratings created, redirected to detail
- **Priority:** Critical

### MEMBERREVIEWSANDRATINGS-002: List Member Reviews And Ratings
- **Precondition:** User logged in, at least one Member Reviews And Ratings exists
- **Steps:**
  1. Navigate to /member-reviews-and-ratings
- **Expected:** List displays user's Member Reviews And Ratings
- **Priority:** High

### MEMBERREVIEWSANDRATINGS-003: View Member Reviews And Ratings
- **Precondition:** User logged in, Member Reviews And Ratings exists
- **Steps:**
  1. Navigate to /member-reviews-and-ratings/[id]
- **Expected:** Member Reviews And Ratings details displayed
- **Priority:** High

### MEMBERREVIEWSANDRATINGS-004: Update Member Reviews And Ratings
- **Precondition:** User logged in, owns Member Reviews And Ratings
- **Steps:**
  1. Navigate to /member-reviews-and-ratings/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Member Reviews And Ratings updated
- **Priority:** High

### MEMBERREVIEWSANDRATINGS-005: Delete Member Reviews And Ratings
- **Precondition:** User logged in, owns Member Reviews And Ratings
- **Steps:**
  1. Navigate to /member-reviews-and-ratings/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Member Reviews And Ratings deleted, redirected to list
- **Priority:** Medium


## Full Featured Profiles Scenarios

### FULLFEATUREDPROFILES-001: Create Full Featured Profiles
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /full-featured-profiles/new
  2. Fill required fields
  3. Submit form
- **Expected:** Full Featured Profiles created, redirected to detail
- **Priority:** Critical

### FULLFEATUREDPROFILES-002: List Full Featured Profiles
- **Precondition:** User logged in, at least one Full Featured Profiles exists
- **Steps:**
  1. Navigate to /full-featured-profiles
- **Expected:** List displays user's Full Featured Profiles
- **Priority:** High

### FULLFEATUREDPROFILES-003: View Full Featured Profiles
- **Precondition:** User logged in, Full Featured Profiles exists
- **Steps:**
  1. Navigate to /full-featured-profiles/[id]
- **Expected:** Full Featured Profiles details displayed
- **Priority:** High

### FULLFEATUREDPROFILES-004: Update Full Featured Profiles
- **Precondition:** User logged in, owns Full Featured Profiles
- **Steps:**
  1. Navigate to /full-featured-profiles/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Full Featured Profiles updated
- **Priority:** High

### FULLFEATUREDPROFILES-005: Delete Full Featured Profiles
- **Precondition:** User logged in, owns Full Featured Profiles
- **Steps:**
  1. Navigate to /full-featured-profiles/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Full Featured Profiles deleted, redirected to list
- **Priority:** Medium


## Seller Ratings And Buyer Reviews Scenarios

### SELLERRATINGSANDBUYERREVIEWS-001: Create Seller Ratings And Buyer Reviews
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /seller-ratings-and-buyer-reviews/new
  2. Fill required fields
  3. Submit form
- **Expected:** Seller Ratings And Buyer Reviews created, redirected to detail
- **Priority:** Critical

### SELLERRATINGSANDBUYERREVIEWS-002: List Seller Ratings And Buyer Reviews
- **Precondition:** User logged in, at least one Seller Ratings And Buyer Reviews exists
- **Steps:**
  1. Navigate to /seller-ratings-and-buyer-reviews
- **Expected:** List displays user's Seller Ratings And Buyer Reviews
- **Priority:** High

### SELLERRATINGSANDBUYERREVIEWS-003: View Seller Ratings And Buyer Reviews
- **Precondition:** User logged in, Seller Ratings And Buyer Reviews exists
- **Steps:**
  1. Navigate to /seller-ratings-and-buyer-reviews/[id]
- **Expected:** Seller Ratings And Buyer Reviews details displayed
- **Priority:** High

### SELLERRATINGSANDBUYERREVIEWS-004: Update Seller Ratings And Buyer Reviews
- **Precondition:** User logged in, owns Seller Ratings And Buyer Reviews
- **Steps:**
  1. Navigate to /seller-ratings-and-buyer-reviews/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Seller Ratings And Buyer Reviews updated
- **Priority:** High

### SELLERRATINGSANDBUYERREVIEWS-005: Delete Seller Ratings And Buyer Reviews
- **Precondition:** User logged in, owns Seller Ratings And Buyer Reviews
- **Steps:**
  1. Navigate to /seller-ratings-and-buyer-reviews/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Seller Ratings And Buyer Reviews deleted, redirected to list
- **Priority:** Medium


## User Ranking List Scenarios

### USERRANKINGLIST-001: Create User Ranking List
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /user-ranking-lists/new
  2. Fill required fields
  3. Submit form
- **Expected:** User Ranking List created, redirected to detail
- **Priority:** Critical

### USERRANKINGLIST-002: List User Ranking Lists
- **Precondition:** User logged in, at least one User Ranking List exists
- **Steps:**
  1. Navigate to /user-ranking-lists
- **Expected:** List displays user's User Ranking Lists
- **Priority:** High

### USERRANKINGLIST-003: View User Ranking List
- **Precondition:** User logged in, User Ranking List exists
- **Steps:**
  1. Navigate to /user-ranking-lists/[id]
- **Expected:** User Ranking List details displayed
- **Priority:** High

### USERRANKINGLIST-004: Update User Ranking List
- **Precondition:** User logged in, owns User Ranking List
- **Steps:**
  1. Navigate to /user-ranking-lists/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** User Ranking List updated
- **Priority:** High

### USERRANKINGLIST-005: Delete User Ranking List
- **Precondition:** User logged in, owns User Ranking List
- **Steps:**
  1. Navigate to /user-ranking-lists/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** User Ranking List deleted, redirected to list
- **Priority:** Medium


## Friends And Fans System Scenarios

### FRIENDSANDFANSSYSTEM-001: Create Friends And Fans System
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /friends-and-fans-systems/new
  2. Fill required fields
  3. Submit form
- **Expected:** Friends And Fans System created, redirected to detail
- **Priority:** Critical

### FRIENDSANDFANSSYSTEM-002: List Friends And Fans Systems
- **Precondition:** User logged in, at least one Friends And Fans System exists
- **Steps:**
  1. Navigate to /friends-and-fans-systems
- **Expected:** List displays user's Friends And Fans Systems
- **Priority:** High

### FRIENDSANDFANSSYSTEM-003: View Friends And Fans System
- **Precondition:** User logged in, Friends And Fans System exists
- **Steps:**
  1. Navigate to /friends-and-fans-systems/[id]
- **Expected:** Friends And Fans System details displayed
- **Priority:** High

### FRIENDSANDFANSSYSTEM-004: Update Friends And Fans System
- **Precondition:** User logged in, owns Friends And Fans System
- **Steps:**
  1. Navigate to /friends-and-fans-systems/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Friends And Fans System updated
- **Priority:** High

### FRIENDSANDFANSSYSTEM-005: Delete Friends And Fans System
- **Precondition:** User logged in, owns Friends And Fans System
- **Steps:**
  1. Navigate to /friends-and-fans-systems/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Friends And Fans System deleted, redirected to list
- **Priority:** Medium


## Custom Video Clips Scenarios

### CUSTOMVIDEOCLIPS-001: Create Custom Video Clips
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /custom-video-clips/new
  2. Fill required fields
  3. Submit form
- **Expected:** Custom Video Clips created, redirected to detail
- **Priority:** Critical

### CUSTOMVIDEOCLIPS-002: List Custom Video Clips
- **Precondition:** User logged in, at least one Custom Video Clips exists
- **Steps:**
  1. Navigate to /custom-video-clips
- **Expected:** List displays user's Custom Video Clips
- **Priority:** High

### CUSTOMVIDEOCLIPS-003: View Custom Video Clips
- **Precondition:** User logged in, Custom Video Clips exists
- **Steps:**
  1. Navigate to /custom-video-clips/[id]
- **Expected:** Custom Video Clips details displayed
- **Priority:** High

### CUSTOMVIDEOCLIPS-004: Update Custom Video Clips
- **Precondition:** User logged in, owns Custom Video Clips
- **Steps:**
  1. Navigate to /custom-video-clips/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Custom Video Clips updated
- **Priority:** High

### CUSTOMVIDEOCLIPS-005: Delete Custom Video Clips
- **Precondition:** User logged in, owns Custom Video Clips
- **Steps:**
  1. Navigate to /custom-video-clips/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Custom Video Clips deleted, redirected to list
- **Priority:** Medium


## Private Photosets Scenarios

### PRIVATEPHOTOSETS-001: Create Private Photosets
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /private-photosets/new
  2. Fill required fields
  3. Submit form
- **Expected:** Private Photosets created, redirected to detail
- **Priority:** Critical

### PRIVATEPHOTOSETS-002: List Private Photosets
- **Precondition:** User logged in, at least one Private Photosets exists
- **Steps:**
  1. Navigate to /private-photosets
- **Expected:** List displays user's Private Photosets
- **Priority:** High

### PRIVATEPHOTOSETS-003: View Private Photosets
- **Precondition:** User logged in, Private Photosets exists
- **Steps:**
  1. Navigate to /private-photosets/[id]
- **Expected:** Private Photosets details displayed
- **Priority:** High

### PRIVATEPHOTOSETS-004: Update Private Photosets
- **Precondition:** User logged in, owns Private Photosets
- **Steps:**
  1. Navigate to /private-photosets/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Private Photosets updated
- **Priority:** High

### PRIVATEPHOTOSETS-005: Delete Private Photosets
- **Precondition:** User logged in, owns Private Photosets
- **Steps:**
  1. Navigate to /private-photosets/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Private Photosets deleted, redirected to list
- **Priority:** Medium


## Whatsapp And Skype Chats Scenarios

### WHATSAPPANDSKYPECHATS-001: Create Whatsapp And Skype Chats
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to /whatsapp-and-skype-chats/new
  2. Fill required fields
  3. Submit form
- **Expected:** Whatsapp And Skype Chats created, redirected to detail
- **Priority:** Critical

### WHATSAPPANDSKYPECHATS-002: List Whatsapp And Skype Chats
- **Precondition:** User logged in, at least one Whatsapp And Skype Chats exists
- **Steps:**
  1. Navigate to /whatsapp-and-skype-chats
- **Expected:** List displays user's Whatsapp And Skype Chats
- **Priority:** High

### WHATSAPPANDSKYPECHATS-003: View Whatsapp And Skype Chats
- **Precondition:** User logged in, Whatsapp And Skype Chats exists
- **Steps:**
  1. Navigate to /whatsapp-and-skype-chats/[id]
- **Expected:** Whatsapp And Skype Chats details displayed
- **Priority:** High

### WHATSAPPANDSKYPECHATS-004: Update Whatsapp And Skype Chats
- **Precondition:** User logged in, owns Whatsapp And Skype Chats
- **Steps:**
  1. Navigate to /whatsapp-and-skype-chats/[id]/edit
  2. Modify fields
  3. Submit form
- **Expected:** Whatsapp And Skype Chats updated
- **Priority:** High

### WHATSAPPANDSKYPECHATS-005: Delete Whatsapp And Skype Chats
- **Precondition:** User logged in, owns Whatsapp And Skype Chats
- **Steps:**
  1. Navigate to /whatsapp-and-skype-chats/[id]
  2. Click delete
  3. Confirm deletion
- **Expected:** Whatsapp And Skype Chats deleted, redirected to list
- **Priority:** Medium



```

### Task 2: Generate Playwright E2E Tests

File: `tests/e2e/auth.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("AUTH-001: New user can sign up", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`;

    await page.goto("/signup");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "TestPass123!");
    await page.click('button[type="submit"]');

    // Wait for redirect
    await expect(page).toHaveURL(/\/dashboard|\/onboarding/);
  });

  test("AUTH-002: Existing user can login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
  });

  test("AUTH-003: Invalid login shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "invalid@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("AUTH-004: User can logout", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout"]');

    await expect(page).toHaveURL("/login");
  });
});
```


File: `tests/e2e/user.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("User CRUD", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("USER-001: Can create User", async ({ page }) => {
    await page.goto("/users/new");

    await page.fill('[name="id"]', "Test id");
    await page.fill('[name="created_at"]', "Test created_at");
    await page.fill('[name="updated_at"]', "Test updated_at");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/users\/[a-z0-9-]+/);
  });

  test("USER-002: Can list Users", async ({ page }) => {
    await page.goto("/users");

    await expect(page.locator("h1")).toContainText("User");
  });

  test("USER-003: Can view User", async ({ page }) => {
    // Navigate to list and click first item
    await page.goto("/users");
    await page.click('[data-testid="user-item"]:first-child');

    await expect(page).toHaveURL(/\/users\/[a-z0-9-]+/);
  });

  test("USER-005: Can delete User", async ({ page }) => {
    // Navigate to detail
    await page.goto("/users");
    await page.click('[data-testid="user-item"]:first-child');

    // Delete
    await page.click('[data-testid="delete-button"]');
    await page.click('[data-testid="confirm-delete"]');

    await expect(page).toHaveURL("/users");
  });
});
```


File: `tests/e2e/listing.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Listing CRUD", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("LISTING-001: Can create Listing", async ({ page }) => {
    await page.goto("/listings/new");

    await page.fill('[name="id"]', "Test id");
    await page.fill('[name="created_at"]', "Test created_at");
    await page.fill('[name="updated_at"]', "Test updated_at");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/listings\/[a-z0-9-]+/);
  });

  test("LISTING-002: Can list Listings", async ({ page }) => {
    await page.goto("/listings");

    await expect(page.locator("h1")).toContainText("Listing");
  });

  test("LISTING-003: Can view Listing", async ({ page }) => {
    // Navigate to list and click first item
    await page.goto("/listings");
    await page.click('[data-testid="listing-item"]:first-child');

    await expect(page).toHaveURL(/\/listings\/[a-z0-9-]+/);
  });

  test("LISTING-005: Can delete Listing", async ({ page }) => {
    // Navigate to detail
    await page.goto("/listings");
    await page.click('[data-testid="listing-item"]:first-child');

    // Delete
    await page.click('[data-testid="delete-button"]');
    await page.click('[data-testid="confirm-delete"]');

    await expect(page).toHaveURL("/listings");
  });
});
```


### Task 3: Generate API Tests

File: `tests/api/user.test.ts`

```typescript
import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";
let authToken: string;

beforeAll(async () => {
  // Get auth token
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    }),
  });
  const data = await response.json();
  authToken = data.token;
});


describe("User API", () => {
  let createdUserId: string;

  it("POST /api/users - creates User", async () => {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        id: "test-id",
        created_at: "test-created_at",
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.id).toBeDefined();
    createdUserId = data.data.id;
  });

  it("GET /api/users - lists Users", async () => {
    const response = await fetch(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("GET /api/users/:id - gets single User", async () => {
    const response = await fetch(
      `${BASE_URL}/api/users/${createdUserId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.id).toBe(createdUserId);
  });

  it("PATCH /api/users/:id - updates User", async () => {
    const response = await fetch(
      `${BASE_URL}/api/users/${createdUserId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id: "updated" }),
      }
    );

    expect(response.status).toBe(200);
  });

  it("DELETE /api/users/:id - deletes User", async () => {
    const response = await fetch(
      `${BASE_URL}/api/users/${createdUserId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    expect(response.status).toBe(204);
  });

  it("GET /api/users/:id - 401 without auth", async () => {
    const response = await fetch(
      `${BASE_URL}/api/users/${createdUserId}`
    );

    expect(response.status).toBe(401);
  });
});


describe("Listing API", () => {
  let createdListingId: string;

  it("POST /api/listings - creates Listing", async () => {
    const response = await fetch(`${BASE_URL}/api/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        id: "test-id",
        created_at: "test-created_at",
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.id).toBeDefined();
    createdListingId = data.data.id;
  });

  it("GET /api/listings - lists Listings", async () => {
    const response = await fetch(`${BASE_URL}/api/listings`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("GET /api/listings/:id - gets single Listing", async () => {
    const response = await fetch(
      `${BASE_URL}/api/listings/${createdListingId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.id).toBe(createdListingId);
  });

  it("PATCH /api/listings/:id - updates Listing", async () => {
    const response = await fetch(
      `${BASE_URL}/api/listings/${createdListingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id: "updated" }),
      }
    );

    expect(response.status).toBe(200);
  });

  it("DELETE /api/listings/:id - deletes Listing", async () => {
    const response = await fetch(
      `${BASE_URL}/api/listings/${createdListingId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    expect(response.status).toBe(204);
  });

  it("GET /api/listings/:id - 401 without auth", async () => {
    const response = await fetch(
      `${BASE_URL}/api/listings/${createdListingId}`
    );

    expect(response.status).toBe(401);
  });
});

```

### Task 4: Generate Playwright Config

File: `playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results.json" }],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### Task 5: Generate Test Coverage Script

File: `scripts/test-coverage.ts`

```typescript
import { execSync } from "child_process";

interface CoverageReport {
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
}

async function runTests(): Promise<CoverageReport> {
  console.log("Running E2E tests...");

  try {
    execSync("npx playwright test --reporter=json", {
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (e) {
    // Tests might fail, continue to parse results
  }

  const results = require("../test-results.json");

  const passed = results.suites.reduce(
    (sum: number, suite: { specs: { ok: boolean }[] }) =>
      sum + suite.specs.filter((s) => s.ok).length,
    0
  );
  const failed = results.suites.reduce(
    (sum: number, suite: { specs: { ok: boolean }[] }) =>
      sum + suite.specs.filter((s) => !s.ok).length,
    0
  );

  const total = passed + failed;
  const coverage = total > 0 ? (passed / total) * 100 : 0;

  return { passed, failed, skipped: 0, coverage };
}

async function main() {
  const report = await runTests();

  console.log("\n=== Test Coverage Report ===\n");
  console.log(`Passed: ${report.passed}`);
  console.log(`Failed: ${report.failed}`);
  console.log(`Coverage: ${report.coverage.toFixed(1)}%`);

  if (report.coverage < 70) {
    console.error("\n❌ Coverage below 70% threshold");
    process.exit(1);
  }

  if (report.failed > 0) {
    console.error("\n❌ Some tests failed");
    process.exit(1);
  }

  console.log("\n✅ All tests passed, coverage acceptable");
}

main().catch(console.error);
```

---

## Gate D Checklist

Before proceeding, verify:

- [ ] All AUTH scenarios pass
- [ ] All entity CRUD scenarios pass

- [ ] API tests pass
- [ ] No blocking E2E failures
- [ ] Coverage >= 70%

```bash
# Run Gate D validation
npm run test:e2e
npm run test:api
npm run test:coverage
```

---

## Artifacts

| File | Content |
|------|---------|
| `docs/TEST_SCENARIOS.md` | All test scenarios |
| `tests/e2e/auth.spec.ts` | Auth E2E tests |
| `tests/e2e/*.spec.ts` | Entity E2E tests |
| `tests/api/*.test.ts` | API tests |
| `playwright.config.ts` | Playwright config |
| `scripts/test-coverage.ts` | Coverage script |

---

**Next Phase:** `15-release-devops.md`

---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 7: 40 - Final Build + Smoke Test

> Source: `docs/phases/40-final-build.md`

# 40 - Final Build + Smoke Test

> **Purpose:** Clean build and visit every page to confirm everything works
> **Block:** J — Quality Assurance Loop
> **This is the LAST check before the build report**

---

## Instructions

### 1. Clean Build

```bash
rm -rf .next node_modules/.cache
npm run build
```

**Must succeed with zero errors and zero warnings that indicate problems.**

### 2. Start Production Server

```bash
npm run start
```

### 3. Smoke Test — Visit Every Page

Open the app and quickly verify each page loads:

**Public:**
- [ ] `/` — Landing page loads
- [ ] `/login` — Login form loads
- [ ] `/signup` — Signup form loads

**Authenticated (login first):**
- [ ] `/dashboard` — Dashboard loads with data or empty state
- [ ] All entity list pages load
- [ ] Settings page loads
- [ ] Theme toggle works

**System:**
- [ ] `/api/health` — Returns `{ "status": "ok" }`
- [ ] `/nonexistent` — Shows 404 page
- [ ] `/sitemap.xml` — Returns valid XML
- [ ] `/robots.txt` — Returns valid robots

### 4. Final TypeScript Check

```bash
npx tsc --noEmit
```

Zero errors required.

---

## Validation

- [ ] Clean build succeeds
- [ ] All pages load without errors
- [ ] Health check endpoint works
- [ ] 404 page displays
- [ ] TypeScript passes
- [ ] App is production-ready


---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 8: 40b - Build Report (Brutal Honesty)

> Source: `docs/phases/40b-build-report.md`

# 40b - Build Report (Brutal Honesty)

> **Purpose:** Generate BUILD_REPORT.md that is 100% honest about what was built, what works, and what doesn't
> **Block:** J — Quality Assurance Loop
> **THIS IS THE FINAL PHASE**

---

## The Report Must Be Brutally Honest

This is not a sales document. This is a technical audit.
If something doesn't work, say it. If something was skipped, say it.
The user deserves to know the REAL state of their project.

---

## Instructions

Create `BUILD_REPORT.md` in the project root:

### Template

```markdown
# Build Report — PantyHub

Generated: [current date]
Built with: Vibery Blueprint (40-phase system) + AI Agent

---

## Summary

| Metric | Value |
|--------|-------|
| Total files created | [count — run: find . -name "*.ts" -o -name "*.tsx" | wc -l] |
| Components | [count — run: find components/ -name "*.tsx" | wc -l] |
| API routes | [count — run: find app/api/ -name "route.ts" | wc -l] |
| Database tables | [count — check schema.sql] |
| Build status | [run npm run build → Pass/Fail] |
| TypeScript errors | [run npx tsc --noEmit → count] |
| Bundle size (largest route) | [from build output] |
| Phases completed | [X]/65 |

---

## What Was Built

### Authentication
- [x/!] Login page (email + password)
- [x/!] Signup page with validation
- [x/!] Auth callback (Supabase)
- [x/!] Signout route
- [x/!] Middleware (route protection)
- [x/!] Session management

### Database (Supabase)
- [x/!] Schema with 32 tables
- [x/!] User table with RLS policies
- [x/!] Listing table with RLS policies
- [x/!] Review table with RLS policies
- [x/!] Shop table with RLS policies
- [x/!] Order table with RLS policies
- [x/!] Payment table with RLS policies
- [x/!] Subscription table with RLS policies
- [x/!] Upload table with RLS policies
- [x/!] Channel table with RLS policies
- [x/!] Notification table with RLS policies
- [x/!] Conversation table with RLS policies
- [x/!] Message table with RLS policies
- [x/!] GlobalSearchFeature table with RLS policies
- [x/!] SafeTransactions table with RLS policies
- [x/!] OwnShopSystem table with RLS policies
- [x/!] SetYourOwnPrices table with RLS policies
- [x/!] NoTransactionFees table with RLS policies
- [x/!] MessagesAndChatSystem table with RLS policies
- [x/!] ClassifiedAdMarket table with RLS policies
- [x/!] MemberReviews table with RLS policies
- [x/!] PrivacyFunctions table with RLS policies
- [x/!] MediaCloud table with RLS policies
- [x/!] UserBlockingSystem table with RLS policies
- [x/!] HumanOperatedFakeCheck table with RLS policies
- [x/!] MemberReviewsAndRatings table with RLS policies
- [x/!] FullFeaturedProfiles table with RLS policies
- [x/!] SellerRatingsAndBuyerReviews table with RLS policies
- [x/!] UserRankingList table with RLS policies
- [x/!] FriendsAndFansSystem table with RLS policies
- [x/!] CustomVideoClips table with RLS policies
- [x/!] PrivatePhotosets table with RLS policies
- [x/!] WhatsappAndSkypeChats table with RLS policies
- [x/!] Profile table (linked to auth.users)
- [x/!] Row Level Security on all tables
- [x/!] Auto-update triggers

### Entity CRUD
- [x/!] User: List, Detail, Create, Edit, Delete
- [x/!] Listing: List, Detail, Create, Edit, Delete
- [x/!] Review: List, Detail, Create, Edit, Delete
- [x/!] Shop: List, Detail, Create, Edit, Delete
- [x/!] Order: List, Detail, Create, Edit, Delete
- [x/!] Payment: List, Detail, Create, Edit, Delete
- [x/!] Subscription: List, Detail, Create, Edit, Delete
- [x/!] Upload: List, Detail, Create, Edit, Delete
- [x/!] Channel: List, Detail, Create, Edit, Delete
- [x/!] Notification: List, Detail, Create, Edit, Delete
- [x/!] Conversation: List, Detail, Create, Edit, Delete
- [x/!] Message: List, Detail, Create, Edit, Delete
- [x/!] GlobalSearchFeature: List, Detail, Create, Edit, Delete
- [x/!] SafeTransactions: List, Detail, Create, Edit, Delete
- [x/!] OwnShopSystem: List, Detail, Create, Edit, Delete
- [x/!] SetYourOwnPrices: List, Detail, Create, Edit, Delete
- [x/!] NoTransactionFees: List, Detail, Create, Edit, Delete
- [x/!] MessagesAndChatSystem: List, Detail, Create, Edit, Delete
- [x/!] ClassifiedAdMarket: List, Detail, Create, Edit, Delete
- [x/!] MemberReviews: List, Detail, Create, Edit, Delete
- [x/!] PrivacyFunctions: List, Detail, Create, Edit, Delete
- [x/!] MediaCloud: List, Detail, Create, Edit, Delete
- [x/!] UserBlockingSystem: List, Detail, Create, Edit, Delete
- [x/!] HumanOperatedFakeCheck: List, Detail, Create, Edit, Delete
- [x/!] MemberReviewsAndRatings: List, Detail, Create, Edit, Delete
- [x/!] FullFeaturedProfiles: List, Detail, Create, Edit, Delete
- [x/!] SellerRatingsAndBuyerReviews: List, Detail, Create, Edit, Delete
- [x/!] UserRankingList: List, Detail, Create, Edit, Delete
- [x/!] FriendsAndFansSystem: List, Detail, Create, Edit, Delete
- [x/!] CustomVideoClips: List, Detail, Create, Edit, Delete
- [x/!] PrivatePhotosets: List, Detail, Create, Edit, Delete
- [x/!] WhatsappAndSkypeChats: List, Detail, Create, Edit, Delete

### UI Components
- [x/!] shadcn/ui component library
- [x/!] Custom EmptyState component
- [x/!] Loading skeletons per page
- [x/!] Error boundaries (root + app + entity)
- [x/!] Delete confirmation dialogs
- [x/!] Offline banner

### Pages
- [x/!] Landing page (public)
- [x/!] Dashboard with stats
- [x/!] User list, detail, create, edit pages
- [x/!] Listing list, detail, create, edit pages
- [x/!] Review list, detail, create, edit pages
- [x/!] Shop list, detail, create, edit pages
- [x/!] Order list, detail, create, edit pages
- [x/!] Payment list, detail, create, edit pages
- [x/!] Subscription list, detail, create, edit pages
- [x/!] Upload list, detail, create, edit pages
- [x/!] Channel list, detail, create, edit pages
- [x/!] Notification list, detail, create, edit pages
- [x/!] Conversation list, detail, create, edit pages
- [x/!] Message list, detail, create, edit pages
- [x/!] GlobalSearchFeature list, detail, create, edit pages
- [x/!] SafeTransactions list, detail, create, edit pages
- [x/!] OwnShopSystem list, detail, create, edit pages
- [x/!] SetYourOwnPrices list, detail, create, edit pages
- [x/!] NoTransactionFees list, detail, create, edit pages
- [x/!] MessagesAndChatSystem list, detail, create, edit pages
- [x/!] ClassifiedAdMarket list, detail, create, edit pages
- [x/!] MemberReviews list, detail, create, edit pages
- [x/!] PrivacyFunctions list, detail, create, edit pages
- [x/!] MediaCloud list, detail, create, edit pages
- [x/!] UserBlockingSystem list, detail, create, edit pages
- [x/!] HumanOperatedFakeCheck list, detail, create, edit pages
- [x/!] MemberReviewsAndRatings list, detail, create, edit pages
- [x/!] FullFeaturedProfiles list, detail, create, edit pages
- [x/!] SellerRatingsAndBuyerReviews list, detail, create, edit pages
- [x/!] UserRankingList list, detail, create, edit pages
- [x/!] FriendsAndFansSystem list, detail, create, edit pages
- [x/!] CustomVideoClips list, detail, create, edit pages
- [x/!] PrivatePhotosets list, detail, create, edit pages
- [x/!] WhatsappAndSkypeChats list, detail, create, edit pages
- [x/!] Settings (profile, theme)
- [x/!] 404 Not Found (with CTA)
- [x/!] Login / Signup

### Features
- [x/!] global_search_feature
- [x/!] auth
- [x/!] safe_transactions
- [x/!] own_shop_system
- [x/!] set_your_own_prices
- [x/!] no_transaction_fees
- [x/!] messages_and_chat_system
- [x/!] classified_ad_market
- [x/!] member_reviews
- [x/!] privacy_functions

### Hardening
- [x/!] Security headers (CSP, HSTS)
- [x/!] Rate limiting (per-user + per-IP)
- [x/!] Input sanitization
- [x/!] Performance (< 300KB, no CLS)
- [x/!] Accessibility pass
- [x/!] Dark mode verified

### Production
- [x/!] SEO metadata + OG images + JSON-LD
- [x/!] Sitemap + robots.txt
- [x/!] README.md
- [x/!] CI/CD with 5 quality gates
- [x/!] Health check endpoint
- [x/!] Feature flags / kill switches

**Legend:** [x] = done and verified, [!] = done but has issues, [ ] = not completed

---

## Quality Audit Results

### Visual Audit (Phase 39)
- Total pages audited: [number]
- Issues found: [number]
- Issues fixed: [number]
- Remaining unfixed: [number]
- Worst areas: [list]

### Functional Audit (Phase 39b)
- Flows tested: [number]
- Issues found: [number]
- Issues fixed: [number]
- Remaining unfixed: [number]
- Broken flows: [list or "none"]

### Code Quality (Phase 39c)
- TypeScript: [zero errors / X errors]
- Build: [succeeds / fails]
- No `any` types: [yes / X occurrences]
- No unused imports: [yes / X occurrences]
- No console.log: [yes / X occurrences]

### Production Readiness (Phase 39d)
- Security checks: [pass / X issues]
- RLS audit: [pass / fail]
- Env vars documented: [yes / no]
- Error monitoring ready: [yes / no]
- Kill switches working: [yes / no]

---

## Performance Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| First Load JS (largest) | [X KB] | < 300 KB | [Pass/Fail] |
| Build time | [X seconds] | — | — |
| Route count | [X] | — | — |
| Bundle size (total) | [X KB] | — | — |

---

## Known Issues

[List ALL known issues honestly. If there are none, write "None identified."]

Example:
1. [SEVERITY] Description — Reason it wasn't fixed
2. [SEVERITY] Description — Workaround available

---

## What We Did NOT Build

[List features that were in scope but deferred, and why]

Example:
- Real-time notifications — Requires WebSocket infrastructure
- File uploads — Requires storage configuration
- Email templates — Requires email service setup

---

## Security Checklist

- [ ] No secrets in source code
- [ ] RLS on all tables
- [ ] Auth on all private API routes
- [ ] Input validation on all endpoints
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] No XSS vectors

---

## Conversion Checklist (if applicable)

- [ ] Landing page has clear CTA
- [ ] Pricing page accurate
- [ ] Checkout flow works end-to-end
- [ ] Free tier / trial configured
- [ ] Stripe webhook tested

---

## Next Steps

1. Create Supabase project and apply schema.sql
2. Configure environment variables in .env.local
3. Set up Stripe (if payments needed)
4. Enable Sentry for error monitoring
5. Deploy to Vercel
6. Set up custom domain
7. Run through conversion checklist
```

---

## After Creating the Report

1. Run one final build:
   ```bash
   npm run build
   ```
2. Fill in ALL numbers with REAL values (file counts, issue counts, bundle sizes)
3. Mark each feature as [x], [!], or [ ] — be honest
4. List ALL known issues, even minor ones
5. List what was NOT built
6. **Tell the user: "PantyHub is built and ready. 49 phases complete."**

---

## Completion

This is the FINAL phase. After this:
- The project is complete
- All 49 phases have been executed
- All audits have been run (2 iterations)
- All fixable issues have been fixed
- The build report documents the honest state

## Next

**Continue to Phase 41 (Gap Closer)** — the final sweep that scans for missing files, broken imports, and incomplete features, and fixes ALL of them.

Phase 41 is the absolute last phase. After that, the project is truly done.

---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 9: 41 - Gap Closer (Final Sweep)

> Source: `docs/phases/41-gap-closer.md`

# 41 - Gap Closer (Final Sweep)

> **Purpose:** Scan the ENTIRE project for missing files, broken imports, incomplete features. Fix ALL gaps. This is the absolute last phase.
> **Block:** G — Quality Assurance
> **Depends on:** Phase 40b (Build Report completed)
> **THIS IS THE ABSOLUTE FINAL PHASE — nothing comes after this.**

---

## Why This Phase Exists

Build reports often reveal gaps but don't fix them. This phase is the closer — it finds what's missing and builds it. No excuses, no "TODO later".

---

## Instructions

### Step 1: Automated Inventory Scan

Run these commands and note every missing file:

```bash
# Count what we have
echo "=== PROJECT INVENTORY ==="
echo "TypeScript files: $(find . -name '*.ts' -o -name '*.tsx' | grep -v node_modules | grep -v .next | wc -l)"
echo "Components: $(find ./components -name '*.tsx' 2>/dev/null | wc -l)"
echo "API routes: $(find ./app/api -name 'route.ts' 2>/dev/null | wc -l)"
echo "Pages: $(find ./app -name 'page.tsx' 2>/dev/null | wc -l)"
echo ""

# Check for broken imports
echo "=== BROKEN IMPORTS ==="
npx tsc --noEmit 2>&1 | grep "Cannot find module" || echo "None found"
echo ""

# Check for unused exports
echo "=== BUILD CHECK ==="
npm run build 2>&1 | tail -20
```

### Step 2: Entity Completeness Check

For EACH entity, verify ALL files exist. If any file is missing, **create it now**.

#### User
- [ ] Types exist: `types/user.ts`
- [ ] Zod schema: `lib/schemas/user.ts`
- [ ] List API: `app/api/users/route.ts`
- [ ] Detail API: `app/api/users/[id]/route.ts`
- [ ] Hooks: `hooks/use-users.ts`
- [ ] List page: `app/(app)/users/page.tsx`
- [ ] Detail page: `app/(app)/users/[id]/page.tsx`
- [ ] Create page: `app/(app)/users/new/page.tsx`
- [ ] Edit page: `app/(app)/users/[id]/edit/page.tsx`
- [ ] Form component: `components/user/user-form.tsx`
- [ ] Card component: `components/user/user-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Listing
- [ ] Types exist: `types/listing.ts`
- [ ] Zod schema: `lib/schemas/listing.ts`
- [ ] List API: `app/api/listings/route.ts`
- [ ] Detail API: `app/api/listings/[id]/route.ts`
- [ ] Hooks: `hooks/use-listings.ts`
- [ ] List page: `app/(app)/listings/page.tsx`
- [ ] Detail page: `app/(app)/listings/[id]/page.tsx`
- [ ] Create page: `app/(app)/listings/new/page.tsx`
- [ ] Edit page: `app/(app)/listings/[id]/edit/page.tsx`
- [ ] Form component: `components/listing/listing-form.tsx`
- [ ] Card component: `components/listing/listing-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Review
- [ ] Types exist: `types/review.ts`
- [ ] Zod schema: `lib/schemas/review.ts`
- [ ] List API: `app/api/reviews/route.ts`
- [ ] Detail API: `app/api/reviews/[id]/route.ts`
- [ ] Hooks: `hooks/use-reviews.ts`
- [ ] List page: `app/(app)/reviews/page.tsx`
- [ ] Detail page: `app/(app)/reviews/[id]/page.tsx`
- [ ] Create page: `app/(app)/reviews/new/page.tsx`
- [ ] Edit page: `app/(app)/reviews/[id]/edit/page.tsx`
- [ ] Form component: `components/review/review-form.tsx`
- [ ] Card component: `components/review/review-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Shop
- [ ] Types exist: `types/shop.ts`
- [ ] Zod schema: `lib/schemas/shop.ts`
- [ ] List API: `app/api/shops/route.ts`
- [ ] Detail API: `app/api/shops/[id]/route.ts`
- [ ] Hooks: `hooks/use-shops.ts`
- [ ] List page: `app/(app)/shops/page.tsx`
- [ ] Detail page: `app/(app)/shops/[id]/page.tsx`
- [ ] Create page: `app/(app)/shops/new/page.tsx`
- [ ] Edit page: `app/(app)/shops/[id]/edit/page.tsx`
- [ ] Form component: `components/shop/shop-form.tsx`
- [ ] Card component: `components/shop/shop-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Order
- [ ] Types exist: `types/order.ts`
- [ ] Zod schema: `lib/schemas/order.ts`
- [ ] List API: `app/api/orders/route.ts`
- [ ] Detail API: `app/api/orders/[id]/route.ts`
- [ ] Hooks: `hooks/use-orders.ts`
- [ ] List page: `app/(app)/orders/page.tsx`
- [ ] Detail page: `app/(app)/orders/[id]/page.tsx`
- [ ] Create page: `app/(app)/orders/new/page.tsx`
- [ ] Edit page: `app/(app)/orders/[id]/edit/page.tsx`
- [ ] Form component: `components/order/order-form.tsx`
- [ ] Card component: `components/order/order-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Payment
- [ ] Types exist: `types/payment.ts`
- [ ] Zod schema: `lib/schemas/payment.ts`
- [ ] List API: `app/api/payments/route.ts`
- [ ] Detail API: `app/api/payments/[id]/route.ts`
- [ ] Hooks: `hooks/use-payments.ts`
- [ ] List page: `app/(app)/payments/page.tsx`
- [ ] Detail page: `app/(app)/payments/[id]/page.tsx`
- [ ] Create page: `app/(app)/payments/new/page.tsx`
- [ ] Edit page: `app/(app)/payments/[id]/edit/page.tsx`
- [ ] Form component: `components/payment/payment-form.tsx`
- [ ] Card component: `components/payment/payment-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Subscription
- [ ] Types exist: `types/subscription.ts`
- [ ] Zod schema: `lib/schemas/subscription.ts`
- [ ] List API: `app/api/subscriptions/route.ts`
- [ ] Detail API: `app/api/subscriptions/[id]/route.ts`
- [ ] Hooks: `hooks/use-subscriptions.ts`
- [ ] List page: `app/(app)/subscriptions/page.tsx`
- [ ] Detail page: `app/(app)/subscriptions/[id]/page.tsx`
- [ ] Create page: `app/(app)/subscriptions/new/page.tsx`
- [ ] Edit page: `app/(app)/subscriptions/[id]/edit/page.tsx`
- [ ] Form component: `components/subscription/subscription-form.tsx`
- [ ] Card component: `components/subscription/subscription-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Upload
- [ ] Types exist: `types/upload.ts`
- [ ] Zod schema: `lib/schemas/upload.ts`
- [ ] List API: `app/api/uploads/route.ts`
- [ ] Detail API: `app/api/uploads/[id]/route.ts`
- [ ] Hooks: `hooks/use-uploads.ts`
- [ ] List page: `app/(app)/uploads/page.tsx`
- [ ] Detail page: `app/(app)/uploads/[id]/page.tsx`
- [ ] Create page: `app/(app)/uploads/new/page.tsx`
- [ ] Edit page: `app/(app)/uploads/[id]/edit/page.tsx`
- [ ] Form component: `components/upload/upload-form.tsx`
- [ ] Card component: `components/upload/upload-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Channel
- [ ] Types exist: `types/channel.ts`
- [ ] Zod schema: `lib/schemas/channel.ts`
- [ ] List API: `app/api/channels/route.ts`
- [ ] Detail API: `app/api/channels/[id]/route.ts`
- [ ] Hooks: `hooks/use-channels.ts`
- [ ] List page: `app/(app)/channels/page.tsx`
- [ ] Detail page: `app/(app)/channels/[id]/page.tsx`
- [ ] Create page: `app/(app)/channels/new/page.tsx`
- [ ] Edit page: `app/(app)/channels/[id]/edit/page.tsx`
- [ ] Form component: `components/channel/channel-form.tsx`
- [ ] Card component: `components/channel/channel-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Notification
- [ ] Types exist: `types/notification.ts`
- [ ] Zod schema: `lib/schemas/notification.ts`
- [ ] List API: `app/api/notifications/route.ts`
- [ ] Detail API: `app/api/notifications/[id]/route.ts`
- [ ] Hooks: `hooks/use-notifications.ts`
- [ ] List page: `app/(app)/notifications/page.tsx`
- [ ] Detail page: `app/(app)/notifications/[id]/page.tsx`
- [ ] Create page: `app/(app)/notifications/new/page.tsx`
- [ ] Edit page: `app/(app)/notifications/[id]/edit/page.tsx`
- [ ] Form component: `components/notification/notification-form.tsx`
- [ ] Card component: `components/notification/notification-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Conversation
- [ ] Types exist: `types/conversation.ts`
- [ ] Zod schema: `lib/schemas/conversation.ts`
- [ ] List API: `app/api/conversations/route.ts`
- [ ] Detail API: `app/api/conversations/[id]/route.ts`
- [ ] Hooks: `hooks/use-conversations.ts`
- [ ] List page: `app/(app)/conversations/page.tsx`
- [ ] Detail page: `app/(app)/conversations/[id]/page.tsx`
- [ ] Create page: `app/(app)/conversations/new/page.tsx`
- [ ] Edit page: `app/(app)/conversations/[id]/edit/page.tsx`
- [ ] Form component: `components/conversation/conversation-form.tsx`
- [ ] Card component: `components/conversation/conversation-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### Message
- [ ] Types exist: `types/message.ts`
- [ ] Zod schema: `lib/schemas/message.ts`
- [ ] List API: `app/api/messages/route.ts`
- [ ] Detail API: `app/api/messages/[id]/route.ts`
- [ ] Hooks: `hooks/use-messages.ts`
- [ ] List page: `app/(app)/messages/page.tsx`
- [ ] Detail page: `app/(app)/messages/[id]/page.tsx`
- [ ] Create page: `app/(app)/messages/new/page.tsx`
- [ ] Edit page: `app/(app)/messages/[id]/edit/page.tsx`
- [ ] Form component: `components/message/message-form.tsx`
- [ ] Card component: `components/message/message-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### GlobalSearchFeature
- [ ] Types exist: `types/global-search-feature.ts`
- [ ] Zod schema: `lib/schemas/global-search-feature.ts`
- [ ] List API: `app/api/global-search-features/route.ts`
- [ ] Detail API: `app/api/global-search-features/[id]/route.ts`
- [ ] Hooks: `hooks/use-global-search-features.ts`
- [ ] List page: `app/(app)/global-search-features/page.tsx`
- [ ] Detail page: `app/(app)/global-search-features/[id]/page.tsx`
- [ ] Create page: `app/(app)/global-search-features/new/page.tsx`
- [ ] Edit page: `app/(app)/global-search-features/[id]/edit/page.tsx`
- [ ] Form component: `components/global-search-feature/global-search-feature-form.tsx`
- [ ] Card component: `components/global-search-feature/global-search-feature-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### SafeTransactions
- [ ] Types exist: `types/safe-transactions.ts`
- [ ] Zod schema: `lib/schemas/safe-transactions.ts`
- [ ] List API: `app/api/safe-transactions/route.ts`
- [ ] Detail API: `app/api/safe-transactions/[id]/route.ts`
- [ ] Hooks: `hooks/use-safe-transactions.ts`
- [ ] List page: `app/(app)/safe-transactions/page.tsx`
- [ ] Detail page: `app/(app)/safe-transactions/[id]/page.tsx`
- [ ] Create page: `app/(app)/safe-transactions/new/page.tsx`
- [ ] Edit page: `app/(app)/safe-transactions/[id]/edit/page.tsx`
- [ ] Form component: `components/safe-transactions/safe-transactions-form.tsx`
- [ ] Card component: `components/safe-transactions/safe-transactions-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### OwnShopSystem
- [ ] Types exist: `types/own-shop-system.ts`
- [ ] Zod schema: `lib/schemas/own-shop-system.ts`
- [ ] List API: `app/api/own-shop-systems/route.ts`
- [ ] Detail API: `app/api/own-shop-systems/[id]/route.ts`
- [ ] Hooks: `hooks/use-own-shop-systems.ts`
- [ ] List page: `app/(app)/own-shop-systems/page.tsx`
- [ ] Detail page: `app/(app)/own-shop-systems/[id]/page.tsx`
- [ ] Create page: `app/(app)/own-shop-systems/new/page.tsx`
- [ ] Edit page: `app/(app)/own-shop-systems/[id]/edit/page.tsx`
- [ ] Form component: `components/own-shop-system/own-shop-system-form.tsx`
- [ ] Card component: `components/own-shop-system/own-shop-system-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### SetYourOwnPrices
- [ ] Types exist: `types/set-your-own-prices.ts`
- [ ] Zod schema: `lib/schemas/set-your-own-prices.ts`
- [ ] List API: `app/api/set-your-own-prices/route.ts`
- [ ] Detail API: `app/api/set-your-own-prices/[id]/route.ts`
- [ ] Hooks: `hooks/use-set-your-own-prices.ts`
- [ ] List page: `app/(app)/set-your-own-prices/page.tsx`
- [ ] Detail page: `app/(app)/set-your-own-prices/[id]/page.tsx`
- [ ] Create page: `app/(app)/set-your-own-prices/new/page.tsx`
- [ ] Edit page: `app/(app)/set-your-own-prices/[id]/edit/page.tsx`
- [ ] Form component: `components/set-your-own-prices/set-your-own-prices-form.tsx`
- [ ] Card component: `components/set-your-own-prices/set-your-own-prices-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### NoTransactionFees
- [ ] Types exist: `types/no-transaction-fees.ts`
- [ ] Zod schema: `lib/schemas/no-transaction-fees.ts`
- [ ] List API: `app/api/no-transaction-fees/route.ts`
- [ ] Detail API: `app/api/no-transaction-fees/[id]/route.ts`
- [ ] Hooks: `hooks/use-no-transaction-fees.ts`
- [ ] List page: `app/(app)/no-transaction-fees/page.tsx`
- [ ] Detail page: `app/(app)/no-transaction-fees/[id]/page.tsx`
- [ ] Create page: `app/(app)/no-transaction-fees/new/page.tsx`
- [ ] Edit page: `app/(app)/no-transaction-fees/[id]/edit/page.tsx`
- [ ] Form component: `components/no-transaction-fees/no-transaction-fees-form.tsx`
- [ ] Card component: `components/no-transaction-fees/no-transaction-fees-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### MessagesAndChatSystem
- [ ] Types exist: `types/messages-and-chat-system.ts`
- [ ] Zod schema: `lib/schemas/messages-and-chat-system.ts`
- [ ] List API: `app/api/messages-and-chat-systems/route.ts`
- [ ] Detail API: `app/api/messages-and-chat-systems/[id]/route.ts`
- [ ] Hooks: `hooks/use-messages-and-chat-systems.ts`
- [ ] List page: `app/(app)/messages-and-chat-systems/page.tsx`
- [ ] Detail page: `app/(app)/messages-and-chat-systems/[id]/page.tsx`
- [ ] Create page: `app/(app)/messages-and-chat-systems/new/page.tsx`
- [ ] Edit page: `app/(app)/messages-and-chat-systems/[id]/edit/page.tsx`
- [ ] Form component: `components/messages-and-chat-system/messages-and-chat-system-form.tsx`
- [ ] Card component: `components/messages-and-chat-system/messages-and-chat-system-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### ClassifiedAdMarket
- [ ] Types exist: `types/classified-ad-market.ts`
- [ ] Zod schema: `lib/schemas/classified-ad-market.ts`
- [ ] List API: `app/api/classified-ad-markets/route.ts`
- [ ] Detail API: `app/api/classified-ad-markets/[id]/route.ts`
- [ ] Hooks: `hooks/use-classified-ad-markets.ts`
- [ ] List page: `app/(app)/classified-ad-markets/page.tsx`
- [ ] Detail page: `app/(app)/classified-ad-markets/[id]/page.tsx`
- [ ] Create page: `app/(app)/classified-ad-markets/new/page.tsx`
- [ ] Edit page: `app/(app)/classified-ad-markets/[id]/edit/page.tsx`
- [ ] Form component: `components/classified-ad-market/classified-ad-market-form.tsx`
- [ ] Card component: `components/classified-ad-market/classified-ad-market-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### MemberReviews
- [ ] Types exist: `types/member-reviews.ts`
- [ ] Zod schema: `lib/schemas/member-reviews.ts`
- [ ] List API: `app/api/member-reviews/route.ts`
- [ ] Detail API: `app/api/member-reviews/[id]/route.ts`
- [ ] Hooks: `hooks/use-member-reviews.ts`
- [ ] List page: `app/(app)/member-reviews/page.tsx`
- [ ] Detail page: `app/(app)/member-reviews/[id]/page.tsx`
- [ ] Create page: `app/(app)/member-reviews/new/page.tsx`
- [ ] Edit page: `app/(app)/member-reviews/[id]/edit/page.tsx`
- [ ] Form component: `components/member-reviews/member-reviews-form.tsx`
- [ ] Card component: `components/member-reviews/member-reviews-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### PrivacyFunctions
- [ ] Types exist: `types/privacy-functions.ts`
- [ ] Zod schema: `lib/schemas/privacy-functions.ts`
- [ ] List API: `app/api/privacy-functions/route.ts`
- [ ] Detail API: `app/api/privacy-functions/[id]/route.ts`
- [ ] Hooks: `hooks/use-privacy-functions.ts`
- [ ] List page: `app/(app)/privacy-functions/page.tsx`
- [ ] Detail page: `app/(app)/privacy-functions/[id]/page.tsx`
- [ ] Create page: `app/(app)/privacy-functions/new/page.tsx`
- [ ] Edit page: `app/(app)/privacy-functions/[id]/edit/page.tsx`
- [ ] Form component: `components/privacy-functions/privacy-functions-form.tsx`
- [ ] Card component: `components/privacy-functions/privacy-functions-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### MediaCloud
- [ ] Types exist: `types/media-cloud.ts`
- [ ] Zod schema: `lib/schemas/media-cloud.ts`
- [ ] List API: `app/api/media-clouds/route.ts`
- [ ] Detail API: `app/api/media-clouds/[id]/route.ts`
- [ ] Hooks: `hooks/use-media-clouds.ts`
- [ ] List page: `app/(app)/media-clouds/page.tsx`
- [ ] Detail page: `app/(app)/media-clouds/[id]/page.tsx`
- [ ] Create page: `app/(app)/media-clouds/new/page.tsx`
- [ ] Edit page: `app/(app)/media-clouds/[id]/edit/page.tsx`
- [ ] Form component: `components/media-cloud/media-cloud-form.tsx`
- [ ] Card component: `components/media-cloud/media-cloud-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### UserBlockingSystem
- [ ] Types exist: `types/user-blocking-system.ts`
- [ ] Zod schema: `lib/schemas/user-blocking-system.ts`
- [ ] List API: `app/api/user-blocking-systems/route.ts`
- [ ] Detail API: `app/api/user-blocking-systems/[id]/route.ts`
- [ ] Hooks: `hooks/use-user-blocking-systems.ts`
- [ ] List page: `app/(app)/user-blocking-systems/page.tsx`
- [ ] Detail page: `app/(app)/user-blocking-systems/[id]/page.tsx`
- [ ] Create page: `app/(app)/user-blocking-systems/new/page.tsx`
- [ ] Edit page: `app/(app)/user-blocking-systems/[id]/edit/page.tsx`
- [ ] Form component: `components/user-blocking-system/user-blocking-system-form.tsx`
- [ ] Card component: `components/user-blocking-system/user-blocking-system-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### HumanOperatedFakeCheck
- [ ] Types exist: `types/human-operated-fake-check.ts`
- [ ] Zod schema: `lib/schemas/human-operated-fake-check.ts`
- [ ] List API: `app/api/human-operated-fake-checks/route.ts`
- [ ] Detail API: `app/api/human-operated-fake-checks/[id]/route.ts`
- [ ] Hooks: `hooks/use-human-operated-fake-checks.ts`
- [ ] List page: `app/(app)/human-operated-fake-checks/page.tsx`
- [ ] Detail page: `app/(app)/human-operated-fake-checks/[id]/page.tsx`
- [ ] Create page: `app/(app)/human-operated-fake-checks/new/page.tsx`
- [ ] Edit page: `app/(app)/human-operated-fake-checks/[id]/edit/page.tsx`
- [ ] Form component: `components/human-operated-fake-check/human-operated-fake-check-form.tsx`
- [ ] Card component: `components/human-operated-fake-check/human-operated-fake-check-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### MemberReviewsAndRatings
- [ ] Types exist: `types/member-reviews-and-ratings.ts`
- [ ] Zod schema: `lib/schemas/member-reviews-and-ratings.ts`
- [ ] List API: `app/api/member-reviews-and-ratings/route.ts`
- [ ] Detail API: `app/api/member-reviews-and-ratings/[id]/route.ts`
- [ ] Hooks: `hooks/use-member-reviews-and-ratings.ts`
- [ ] List page: `app/(app)/member-reviews-and-ratings/page.tsx`
- [ ] Detail page: `app/(app)/member-reviews-and-ratings/[id]/page.tsx`
- [ ] Create page: `app/(app)/member-reviews-and-ratings/new/page.tsx`
- [ ] Edit page: `app/(app)/member-reviews-and-ratings/[id]/edit/page.tsx`
- [ ] Form component: `components/member-reviews-and-ratings/member-reviews-and-ratings-form.tsx`
- [ ] Card component: `components/member-reviews-and-ratings/member-reviews-and-ratings-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### FullFeaturedProfiles
- [ ] Types exist: `types/full-featured-profiles.ts`
- [ ] Zod schema: `lib/schemas/full-featured-profiles.ts`
- [ ] List API: `app/api/full-featured-profiles/route.ts`
- [ ] Detail API: `app/api/full-featured-profiles/[id]/route.ts`
- [ ] Hooks: `hooks/use-full-featured-profiles.ts`
- [ ] List page: `app/(app)/full-featured-profiles/page.tsx`
- [ ] Detail page: `app/(app)/full-featured-profiles/[id]/page.tsx`
- [ ] Create page: `app/(app)/full-featured-profiles/new/page.tsx`
- [ ] Edit page: `app/(app)/full-featured-profiles/[id]/edit/page.tsx`
- [ ] Form component: `components/full-featured-profiles/full-featured-profiles-form.tsx`
- [ ] Card component: `components/full-featured-profiles/full-featured-profiles-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### SellerRatingsAndBuyerReviews
- [ ] Types exist: `types/seller-ratings-and-buyer-reviews.ts`
- [ ] Zod schema: `lib/schemas/seller-ratings-and-buyer-reviews.ts`
- [ ] List API: `app/api/seller-ratings-and-buyer-reviews/route.ts`
- [ ] Detail API: `app/api/seller-ratings-and-buyer-reviews/[id]/route.ts`
- [ ] Hooks: `hooks/use-seller-ratings-and-buyer-reviews.ts`
- [ ] List page: `app/(app)/seller-ratings-and-buyer-reviews/page.tsx`
- [ ] Detail page: `app/(app)/seller-ratings-and-buyer-reviews/[id]/page.tsx`
- [ ] Create page: `app/(app)/seller-ratings-and-buyer-reviews/new/page.tsx`
- [ ] Edit page: `app/(app)/seller-ratings-and-buyer-reviews/[id]/edit/page.tsx`
- [ ] Form component: `components/seller-ratings-and-buyer-reviews/seller-ratings-and-buyer-reviews-form.tsx`
- [ ] Card component: `components/seller-ratings-and-buyer-reviews/seller-ratings-and-buyer-reviews-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### UserRankingList
- [ ] Types exist: `types/user-ranking-list.ts`
- [ ] Zod schema: `lib/schemas/user-ranking-list.ts`
- [ ] List API: `app/api/user-ranking-lists/route.ts`
- [ ] Detail API: `app/api/user-ranking-lists/[id]/route.ts`
- [ ] Hooks: `hooks/use-user-ranking-lists.ts`
- [ ] List page: `app/(app)/user-ranking-lists/page.tsx`
- [ ] Detail page: `app/(app)/user-ranking-lists/[id]/page.tsx`
- [ ] Create page: `app/(app)/user-ranking-lists/new/page.tsx`
- [ ] Edit page: `app/(app)/user-ranking-lists/[id]/edit/page.tsx`
- [ ] Form component: `components/user-ranking-list/user-ranking-list-form.tsx`
- [ ] Card component: `components/user-ranking-list/user-ranking-list-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### FriendsAndFansSystem
- [ ] Types exist: `types/friends-and-fans-system.ts`
- [ ] Zod schema: `lib/schemas/friends-and-fans-system.ts`
- [ ] List API: `app/api/friends-and-fans-systems/route.ts`
- [ ] Detail API: `app/api/friends-and-fans-systems/[id]/route.ts`
- [ ] Hooks: `hooks/use-friends-and-fans-systems.ts`
- [ ] List page: `app/(app)/friends-and-fans-systems/page.tsx`
- [ ] Detail page: `app/(app)/friends-and-fans-systems/[id]/page.tsx`
- [ ] Create page: `app/(app)/friends-and-fans-systems/new/page.tsx`
- [ ] Edit page: `app/(app)/friends-and-fans-systems/[id]/edit/page.tsx`
- [ ] Form component: `components/friends-and-fans-system/friends-and-fans-system-form.tsx`
- [ ] Card component: `components/friends-and-fans-system/friends-and-fans-system-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### CustomVideoClips
- [ ] Types exist: `types/custom-video-clips.ts`
- [ ] Zod schema: `lib/schemas/custom-video-clips.ts`
- [ ] List API: `app/api/custom-video-clips/route.ts`
- [ ] Detail API: `app/api/custom-video-clips/[id]/route.ts`
- [ ] Hooks: `hooks/use-custom-video-clips.ts`
- [ ] List page: `app/(app)/custom-video-clips/page.tsx`
- [ ] Detail page: `app/(app)/custom-video-clips/[id]/page.tsx`
- [ ] Create page: `app/(app)/custom-video-clips/new/page.tsx`
- [ ] Edit page: `app/(app)/custom-video-clips/[id]/edit/page.tsx`
- [ ] Form component: `components/custom-video-clips/custom-video-clips-form.tsx`
- [ ] Card component: `components/custom-video-clips/custom-video-clips-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### PrivatePhotosets
- [ ] Types exist: `types/private-photosets.ts`
- [ ] Zod schema: `lib/schemas/private-photosets.ts`
- [ ] List API: `app/api/private-photosets/route.ts`
- [ ] Detail API: `app/api/private-photosets/[id]/route.ts`
- [ ] Hooks: `hooks/use-private-photosets.ts`
- [ ] List page: `app/(app)/private-photosets/page.tsx`
- [ ] Detail page: `app/(app)/private-photosets/[id]/page.tsx`
- [ ] Create page: `app/(app)/private-photosets/new/page.tsx`
- [ ] Edit page: `app/(app)/private-photosets/[id]/edit/page.tsx`
- [ ] Form component: `components/private-photosets/private-photosets-form.tsx`
- [ ] Card component: `components/private-photosets/private-photosets-card.tsx`
- [ ] Delete works (API + UI confirmation)

#### WhatsappAndSkypeChats
- [ ] Types exist: `types/whatsapp-and-skype-chats.ts`
- [ ] Zod schema: `lib/schemas/whatsapp-and-skype-chats.ts`
- [ ] List API: `app/api/whatsapp-and-skype-chats/route.ts`
- [ ] Detail API: `app/api/whatsapp-and-skype-chats/[id]/route.ts`
- [ ] Hooks: `hooks/use-whatsapp-and-skype-chats.ts`
- [ ] List page: `app/(app)/whatsapp-and-skype-chats/page.tsx`
- [ ] Detail page: `app/(app)/whatsapp-and-skype-chats/[id]/page.tsx`
- [ ] Create page: `app/(app)/whatsapp-and-skype-chats/new/page.tsx`
- [ ] Edit page: `app/(app)/whatsapp-and-skype-chats/[id]/edit/page.tsx`
- [ ] Form component: `components/whatsapp-and-skype-chats/whatsapp-and-skype-chats-form.tsx`
- [ ] Card component: `components/whatsapp-and-skype-chats/whatsapp-and-skype-chats-card.tsx`
- [ ] Delete works (API + UI confirmation)

### Step 3: Core Infrastructure Check

- [ ] `middleware.ts` exists and protects `/(app)` routes
- [ ] `lib/supabase/server.ts` exists
- [ ] `lib/supabase/client.ts` exists
- [ ] `.env.example` has ALL required vars
- [ ] `supabase/schema.sql` matches entities above
- [ ] RLS policies exist for every table

### Step 4: Page Completeness

- [ ] `/` — Landing page
- [ ] `/login` — Login page
- [ ] `/signup` — Signup page
- [ ] `/dashboard` — Dashboard with real data or empty state
- [ ] `/settings` — Settings page
- [ ] `/not-found` — 404 page with CTA
- [ ] `/terms` — Terms of Service
- [ ] `/privacy` — Privacy Policy
- [ ] `/users` — User list page
- [ ] `/listings` — Listing list page
- [ ] `/reviews` — Review list page
- [ ] `/shops` — Shop list page
- [ ] `/orders` — Order list page
- [ ] `/payments` — Payment list page
- [ ] `/subscriptions` — Subscription list page
- [ ] `/uploads` — Upload list page
- [ ] `/channels` — Channel list page
- [ ] `/notifications` — Notification list page
- [ ] `/conversations` — Conversation list page
- [ ] `/messages` — Message list page
- [ ] `/global-search-features` — GlobalSearchFeature list page
- [ ] `/safe-transactions` — SafeTransactions list page
- [ ] `/own-shop-systems` — OwnShopSystem list page
- [ ] `/set-your-own-prices` — SetYourOwnPrices list page
- [ ] `/no-transaction-fees` — NoTransactionFees list page
- [ ] `/messages-and-chat-systems` — MessagesAndChatSystem list page
- [ ] `/classified-ad-markets` — ClassifiedAdMarket list page
- [ ] `/member-reviews` — MemberReviews list page
- [ ] `/privacy-functions` — PrivacyFunctions list page
- [ ] `/media-clouds` — MediaCloud list page
- [ ] `/user-blocking-systems` — UserBlockingSystem list page
- [ ] `/human-operated-fake-checks` — HumanOperatedFakeCheck list page
- [ ] `/member-reviews-and-ratings` — MemberReviewsAndRatings list page
- [ ] `/full-featured-profiles` — FullFeaturedProfiles list page
- [ ] `/seller-ratings-and-buyer-reviews` — SellerRatingsAndBuyerReviews list page
- [ ] `/user-ranking-lists` — UserRankingList list page
- [ ] `/friends-and-fans-systems` — FriendsAndFansSystem list page
- [ ] `/custom-video-clips` — CustomVideoClips list page
- [ ] `/private-photosets` — PrivatePhotosets list page
- [ ] `/whatsapp-and-skype-chats` — WhatsappAndSkypeChats list page
- [ ] `/users/[id]` — User detail page
- [ ] `/listings/[id]` — Listing detail page
- [ ] `/reviews/[id]` — Review detail page
- [ ] `/shops/[id]` — Shop detail page
- [ ] `/orders/[id]` — Order detail page
- [ ] `/payments/[id]` — Payment detail page
- [ ] `/subscriptions/[id]` — Subscription detail page
- [ ] `/uploads/[id]` — Upload detail page
- [ ] `/channels/[id]` — Channel detail page
- [ ] `/notifications/[id]` — Notification detail page
- [ ] `/conversations/[id]` — Conversation detail page
- [ ] `/messages/[id]` — Message detail page
- [ ] `/global-search-features/[id]` — GlobalSearchFeature detail page
- [ ] `/safe-transactions/[id]` — SafeTransactions detail page
- [ ] `/own-shop-systems/[id]` — OwnShopSystem detail page
- [ ] `/set-your-own-prices/[id]` — SetYourOwnPrices detail page
- [ ] `/no-transaction-fees/[id]` — NoTransactionFees detail page
- [ ] `/messages-and-chat-systems/[id]` — MessagesAndChatSystem detail page
- [ ] `/classified-ad-markets/[id]` — ClassifiedAdMarket detail page
- [ ] `/member-reviews/[id]` — MemberReviews detail page
- [ ] `/privacy-functions/[id]` — PrivacyFunctions detail page
- [ ] `/media-clouds/[id]` — MediaCloud detail page
- [ ] `/user-blocking-systems/[id]` — UserBlockingSystem detail page
- [ ] `/human-operated-fake-checks/[id]` — HumanOperatedFakeCheck detail page
- [ ] `/member-reviews-and-ratings/[id]` — MemberReviewsAndRatings detail page
- [ ] `/full-featured-profiles/[id]` — FullFeaturedProfiles detail page
- [ ] `/seller-ratings-and-buyer-reviews/[id]` — SellerRatingsAndBuyerReviews detail page
- [ ] `/user-ranking-lists/[id]` — UserRankingList detail page
- [ ] `/friends-and-fans-systems/[id]` — FriendsAndFansSystem detail page
- [ ] `/custom-video-clips/[id]` — CustomVideoClips detail page
- [ ] `/private-photosets/[id]` — PrivatePhotosets detail page
- [ ] `/whatsapp-and-skype-chats/[id]` — WhatsappAndSkypeChats detail page
- [ ] `/users/new` — Create User
- [ ] `/listings/new` — Create Listing
- [ ] `/reviews/new` — Create Review
- [ ] `/shops/new` — Create Shop
- [ ] `/orders/new` — Create Order
- [ ] `/payments/new` — Create Payment
- [ ] `/subscriptions/new` — Create Subscription
- [ ] `/uploads/new` — Create Upload
- [ ] `/channels/new` — Create Channel
- [ ] `/notifications/new` — Create Notification
- [ ] `/conversations/new` — Create Conversation
- [ ] `/messages/new` — Create Message
- [ ] `/global-search-features/new` — Create GlobalSearchFeature
- [ ] `/safe-transactions/new` — Create SafeTransactions
- [ ] `/own-shop-systems/new` — Create OwnShopSystem
- [ ] `/set-your-own-prices/new` — Create SetYourOwnPrices
- [ ] `/no-transaction-fees/new` — Create NoTransactionFees
- [ ] `/messages-and-chat-systems/new` — Create MessagesAndChatSystem
- [ ] `/classified-ad-markets/new` — Create ClassifiedAdMarket
- [ ] `/member-reviews/new` — Create MemberReviews
- [ ] `/privacy-functions/new` — Create PrivacyFunctions
- [ ] `/media-clouds/new` — Create MediaCloud
- [ ] `/user-blocking-systems/new` — Create UserBlockingSystem
- [ ] `/human-operated-fake-checks/new` — Create HumanOperatedFakeCheck
- [ ] `/member-reviews-and-ratings/new` — Create MemberReviewsAndRatings
- [ ] `/full-featured-profiles/new` — Create FullFeaturedProfiles
- [ ] `/seller-ratings-and-buyer-reviews/new` — Create SellerRatingsAndBuyerReviews
- [ ] `/user-ranking-lists/new` — Create UserRankingList
- [ ] `/friends-and-fans-systems/new` — Create FriendsAndFansSystem
- [ ] `/custom-video-clips/new` — Create CustomVideoClips
- [ ] `/private-photosets/new` — Create PrivatePhotosets
- [ ] `/whatsapp-and-skype-chats/new` — Create WhatsappAndSkypeChats

### Step 5: UX Completeness

- [ ] Every list page has an empty state (no blank screens)
- [ ] Every form has validation errors shown to user
- [ ] Every async action has a loading spinner
- [ ] Every destructive action has a confirmation dialog
- [ ] Toast notifications work (success + error)
- [ ] Dark mode renders correctly on every page
- [ ] Mobile layout works on every page (no overflow, no cut-off)

### Step 6: Feature-Specific Checks

### Payments
- [ ] Stripe checkout page or component
- [ ] Webhook handler: `app/api/webhooks/stripe/route.ts`
- [ ] Pricing page exists
- [ ] Success/cancel redirect pages

### File Uploads
- [ ] Upload component with dropzone
- [ ] Supabase Storage bucket configured in schema
- [ ] File size + type validation
- [ ] Upload preview

### Realtime
- [ ] Supabase realtime subscription in at least one component
- [ ] Presence or broadcast channel (if chat/collab)

### Notifications
- [ ] Notification model/table
- [ ] Notification list UI
- [ ] Mark as read functionality

### Search
- [ ] Search input component
- [ ] Debounced search hook
- [ ] Search results display

### Step 7: Fix Everything

For every ❌ item above:
1. Create the missing file
2. Wire it up (imports, routes, navigation)
3. Verify it renders without errors

**Do NOT skip items. Do NOT mark things as "TODO". Build them now.**

### Step 8: Final Verification

```bash
# Must all pass
npx tsc --noEmit          # Zero errors
npm run build             # Clean build
npm run lint 2>/dev/null  # No critical warnings
```

---

## Validation

- [ ] Every entity has ALL files (types, schema, API, hooks, pages, form, card)
- [ ] Every page renders without errors
- [ ] Build succeeds with zero errors
- [ ] TypeScript passes with zero errors
- [ ] No broken imports remain
- [ ] All enabled features are functional
- [ ] Empty states, loading states, error states all present

---

## When This Phase Is Done

Update `BUILD_REPORT.md`:
1. Change any `[ ]` or `[!]` items to `[x]` that you just fixed
2. Remove items from "Known Issues" that you resolved
3. Move items from "What We Did NOT Build" to "What Was Built" if you built them
4. Add a line at the bottom: **"Gap Closer (Phase 41) completed — all gaps resolved."**

**PantyHub is now truly complete.**

---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 10: 42 - MVP Completeness Loop (Self-Healing)

> Source: `docs/phases/42-mvp-loop.md`

# 42 - MVP Completeness Loop (Self-Healing)

> **Purpose:** Loop until the MVP is 100% complete — entities, features, navigation, build
> **Block:** G — Quality Assurance
> **Depends on:** Phase 41 (Gap Closer completed)
> **THIS PHASE LOOPS — do NOT proceed to Phase 43 until this phase exits cleanly**

---

## CRITICAL: This Is a LOOP, Not a Checklist

Previous phases (39-41) created checklists. This phase is different. It **LOOPS** until everything passes:

```
REPEAT {
  1. Run FULL inventory scan (entities + features + navigation + build)
  2. For EVERY ❌ item: implement it completely
  3. Run verification (tsc + build)
  4. IF any ❌ items remain → go to step 1
  5. IF ALL items ✅ → exit loop
} MAX 5 ITERATIONS
```

**You MUST loop. Do NOT mark this phase as done after one pass.**
**You MUST implement missing features, not just check for them.**

---

## What This Phase Enforces

This phase checks **THREE categories** — ALL must pass:

1. **Entity CRUD** (32 entities × 11 files each = 352 files)
2. **Feature Implementations** (28 enabled features: Payments (Stripe), File Storage / Uploads, Realtime, Notifications, Full-Text Search, Direct Messaging, Reviews & Ratings, Global Search Feature, Auth, Safe Transactions, Own Shop System, Set Your Own Prices, No Transaction Fees, Messages And Chat System, Classified Ad Market, Member Reviews, Privacy Functions, Media Cloud, User Blocking System, Human Operated Fake Check, Member Reviews And Ratings, Full Featured Profiles, Seller Ratings And Buyer Reviews, User Ranking List, Friends And Fans System, Custom Video Clips, Private Photosets, Whatsapp And Skype Chats)
3. **Navigation Completeness** (all 32 entities accessible via sidebar/nav)

Plus: TypeScript compilation + build success.

---

## Step 1: FULL Inventory Scan

Run this scan. Count ALL ❌ items — they ALL block exit.

```bash
echo "================================================================"
echo "  MVP COMPLETENESS INVENTORY — PantyHub"
echo "  Iteration: [UPDATE THIS NUMBER]"
echo "================================================================"
echo ""
FAIL_COUNT=0

# ═══════════════════════════════════════════════════
# SECTION A: TypeScript + Build
# ═══════════════════════════════════════════════════
echo "--- A. TypeScript Check ---"
TSC_OUTPUT=$(npx tsc --noEmit 2>&1)
TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep "error TS" | wc -l | tr -d ' ')
echo "TypeScript errors: $TSC_ERRORS"
if [ "$TSC_ERRORS" -gt 0 ]; then
  echo "$TSC_OUTPUT" | grep "error TS" | head -30
  FAIL_COUNT=$((FAIL_COUNT + TSC_ERRORS))
fi
echo ""

echo "--- A. Build Check ---"
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_OK=$?
if [ $BUILD_OK -ne 0 ]; then
  echo "❌ BUILD FAILED"
  echo "$BUILD_OUTPUT" | tail -30
  FAIL_COUNT=$((FAIL_COUNT + 1))
else
  echo "✅ BUILD OK"
fi
echo ""

# ═══════════════════════════════════════════════════
# SECTION B: Entity CRUD Files
# ═══════════════════════════════════════════════════
echo "--- B. Entity Files ---"
echo "User:"
[ -f "types/user.ts" ] && echo "  ✅ types/user.ts" || { echo "  ❌ types/user.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/user.ts" ] && echo "  ✅ lib/schemas/user.ts" || { echo "  ❌ lib/schemas/user.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/users/route.ts" ] && echo "  ✅ app/api/users/route.ts" || { echo "  ❌ app/api/users/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/users/[id]/route.ts" ] && echo "  ✅ app/api/users/[id]/route.ts" || { echo "  ❌ app/api/users/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-users.ts" ] || [ -f "hooks/use-users.tsx" ]) && echo "  ✅ hooks/use-users" || { echo "  ❌ hooks/use-users.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/users/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/users/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/users/[id]/page.tsx" ] || [ -f "app/(app)/users/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/users/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/users/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/users/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/users/[id]/edit/page.tsx" ] || [ -f "app/(app)/users/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/users/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "user-form.tsx" -o -name "userForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/user/user-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "user-card.tsx" -o -name "userCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/user/user-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Listing:"
[ -f "types/listing.ts" ] && echo "  ✅ types/listing.ts" || { echo "  ❌ types/listing.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/listing.ts" ] && echo "  ✅ lib/schemas/listing.ts" || { echo "  ❌ lib/schemas/listing.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/listings/route.ts" ] && echo "  ✅ app/api/listings/route.ts" || { echo "  ❌ app/api/listings/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/listings/[id]/route.ts" ] && echo "  ✅ app/api/listings/[id]/route.ts" || { echo "  ❌ app/api/listings/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-listings.ts" ] || [ -f "hooks/use-listings.tsx" ]) && echo "  ✅ hooks/use-listings" || { echo "  ❌ hooks/use-listings.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/listings/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/listings/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/listings/[id]/page.tsx" ] || [ -f "app/(app)/listings/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/listings/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/listings/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/listings/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/listings/[id]/edit/page.tsx" ] || [ -f "app/(app)/listings/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/listings/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "listing-form.tsx" -o -name "listingForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/listing/listing-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "listing-card.tsx" -o -name "listingCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/listing/listing-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Review:"
[ -f "types/review.ts" ] && echo "  ✅ types/review.ts" || { echo "  ❌ types/review.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/review.ts" ] && echo "  ✅ lib/schemas/review.ts" || { echo "  ❌ lib/schemas/review.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/reviews/route.ts" ] && echo "  ✅ app/api/reviews/route.ts" || { echo "  ❌ app/api/reviews/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/reviews/[id]/route.ts" ] && echo "  ✅ app/api/reviews/[id]/route.ts" || { echo "  ❌ app/api/reviews/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-reviews.ts" ] || [ -f "hooks/use-reviews.tsx" ]) && echo "  ✅ hooks/use-reviews" || { echo "  ❌ hooks/use-reviews.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/reviews/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/reviews/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/reviews/[id]/page.tsx" ] || [ -f "app/(app)/reviews/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/reviews/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/reviews/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/reviews/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/reviews/[id]/edit/page.tsx" ] || [ -f "app/(app)/reviews/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/reviews/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "review-form.tsx" -o -name "reviewForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/review/review-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "review-card.tsx" -o -name "reviewCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/review/review-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Shop:"
[ -f "types/shop.ts" ] && echo "  ✅ types/shop.ts" || { echo "  ❌ types/shop.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/shop.ts" ] && echo "  ✅ lib/schemas/shop.ts" || { echo "  ❌ lib/schemas/shop.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/shops/route.ts" ] && echo "  ✅ app/api/shops/route.ts" || { echo "  ❌ app/api/shops/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/shops/[id]/route.ts" ] && echo "  ✅ app/api/shops/[id]/route.ts" || { echo "  ❌ app/api/shops/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-shops.ts" ] || [ -f "hooks/use-shops.tsx" ]) && echo "  ✅ hooks/use-shops" || { echo "  ❌ hooks/use-shops.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/shops/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/shops/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/shops/[id]/page.tsx" ] || [ -f "app/(app)/shops/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/shops/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/shops/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/shops/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/shops/[id]/edit/page.tsx" ] || [ -f "app/(app)/shops/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/shops/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "shop-form.tsx" -o -name "shopForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/shop/shop-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "shop-card.tsx" -o -name "shopCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/shop/shop-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Order:"
[ -f "types/order.ts" ] && echo "  ✅ types/order.ts" || { echo "  ❌ types/order.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/order.ts" ] && echo "  ✅ lib/schemas/order.ts" || { echo "  ❌ lib/schemas/order.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/orders/route.ts" ] && echo "  ✅ app/api/orders/route.ts" || { echo "  ❌ app/api/orders/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/orders/[id]/route.ts" ] && echo "  ✅ app/api/orders/[id]/route.ts" || { echo "  ❌ app/api/orders/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-orders.ts" ] || [ -f "hooks/use-orders.tsx" ]) && echo "  ✅ hooks/use-orders" || { echo "  ❌ hooks/use-orders.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/orders/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/orders/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/orders/[id]/page.tsx" ] || [ -f "app/(app)/orders/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/orders/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/orders/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/orders/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/orders/[id]/edit/page.tsx" ] || [ -f "app/(app)/orders/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/orders/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "order-form.tsx" -o -name "orderForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/order/order-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "order-card.tsx" -o -name "orderCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/order/order-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Payment:"
[ -f "types/payment.ts" ] && echo "  ✅ types/payment.ts" || { echo "  ❌ types/payment.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/payment.ts" ] && echo "  ✅ lib/schemas/payment.ts" || { echo "  ❌ lib/schemas/payment.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/payments/route.ts" ] && echo "  ✅ app/api/payments/route.ts" || { echo "  ❌ app/api/payments/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/payments/[id]/route.ts" ] && echo "  ✅ app/api/payments/[id]/route.ts" || { echo "  ❌ app/api/payments/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-payments.ts" ] || [ -f "hooks/use-payments.tsx" ]) && echo "  ✅ hooks/use-payments" || { echo "  ❌ hooks/use-payments.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/payments/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/payments/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/payments/[id]/page.tsx" ] || [ -f "app/(app)/payments/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/payments/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/payments/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/payments/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/payments/[id]/edit/page.tsx" ] || [ -f "app/(app)/payments/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/payments/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "payment-form.tsx" -o -name "paymentForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/payment/payment-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "payment-card.tsx" -o -name "paymentCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/payment/payment-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Subscription:"
[ -f "types/subscription.ts" ] && echo "  ✅ types/subscription.ts" || { echo "  ❌ types/subscription.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/subscription.ts" ] && echo "  ✅ lib/schemas/subscription.ts" || { echo "  ❌ lib/schemas/subscription.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/subscriptions/route.ts" ] && echo "  ✅ app/api/subscriptions/route.ts" || { echo "  ❌ app/api/subscriptions/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/subscriptions/[id]/route.ts" ] && echo "  ✅ app/api/subscriptions/[id]/route.ts" || { echo "  ❌ app/api/subscriptions/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-subscriptions.ts" ] || [ -f "hooks/use-subscriptions.tsx" ]) && echo "  ✅ hooks/use-subscriptions" || { echo "  ❌ hooks/use-subscriptions.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/subscriptions/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/subscriptions/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/subscriptions/[id]/page.tsx" ] || [ -f "app/(app)/subscriptions/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/subscriptions/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/subscriptions/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/subscriptions/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/subscriptions/[id]/edit/page.tsx" ] || [ -f "app/(app)/subscriptions/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/subscriptions/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "subscription-form.tsx" -o -name "subscriptionForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/subscription/subscription-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "subscription-card.tsx" -o -name "subscriptionCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/subscription/subscription-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Upload:"
[ -f "types/upload.ts" ] && echo "  ✅ types/upload.ts" || { echo "  ❌ types/upload.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/upload.ts" ] && echo "  ✅ lib/schemas/upload.ts" || { echo "  ❌ lib/schemas/upload.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/uploads/route.ts" ] && echo "  ✅ app/api/uploads/route.ts" || { echo "  ❌ app/api/uploads/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/uploads/[id]/route.ts" ] && echo "  ✅ app/api/uploads/[id]/route.ts" || { echo "  ❌ app/api/uploads/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-uploads.ts" ] || [ -f "hooks/use-uploads.tsx" ]) && echo "  ✅ hooks/use-uploads" || { echo "  ❌ hooks/use-uploads.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/uploads/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/uploads/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/uploads/[id]/page.tsx" ] || [ -f "app/(app)/uploads/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/uploads/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/uploads/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/uploads/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/uploads/[id]/edit/page.tsx" ] || [ -f "app/(app)/uploads/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/uploads/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "upload-form.tsx" -o -name "uploadForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/upload/upload-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "upload-card.tsx" -o -name "uploadCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/upload/upload-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Channel:"
[ -f "types/channel.ts" ] && echo "  ✅ types/channel.ts" || { echo "  ❌ types/channel.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/channel.ts" ] && echo "  ✅ lib/schemas/channel.ts" || { echo "  ❌ lib/schemas/channel.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/channels/route.ts" ] && echo "  ✅ app/api/channels/route.ts" || { echo "  ❌ app/api/channels/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/channels/[id]/route.ts" ] && echo "  ✅ app/api/channels/[id]/route.ts" || { echo "  ❌ app/api/channels/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-channels.ts" ] || [ -f "hooks/use-channels.tsx" ]) && echo "  ✅ hooks/use-channels" || { echo "  ❌ hooks/use-channels.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/channels/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/channels/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/channels/[id]/page.tsx" ] || [ -f "app/(app)/channels/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/channels/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/channels/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/channels/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/channels/[id]/edit/page.tsx" ] || [ -f "app/(app)/channels/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/channels/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "channel-form.tsx" -o -name "channelForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/channel/channel-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "channel-card.tsx" -o -name "channelCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/channel/channel-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Notification:"
[ -f "types/notification.ts" ] && echo "  ✅ types/notification.ts" || { echo "  ❌ types/notification.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/notification.ts" ] && echo "  ✅ lib/schemas/notification.ts" || { echo "  ❌ lib/schemas/notification.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/notifications/route.ts" ] && echo "  ✅ app/api/notifications/route.ts" || { echo "  ❌ app/api/notifications/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/notifications/[id]/route.ts" ] && echo "  ✅ app/api/notifications/[id]/route.ts" || { echo "  ❌ app/api/notifications/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-notifications.ts" ] || [ -f "hooks/use-notifications.tsx" ]) && echo "  ✅ hooks/use-notifications" || { echo "  ❌ hooks/use-notifications.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/notifications/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/notifications/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/notifications/[id]/page.tsx" ] || [ -f "app/(app)/notifications/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/notifications/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/notifications/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/notifications/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/notifications/[id]/edit/page.tsx" ] || [ -f "app/(app)/notifications/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/notifications/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "notification-form.tsx" -o -name "notificationForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/notification/notification-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "notification-card.tsx" -o -name "notificationCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/notification/notification-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Conversation:"
[ -f "types/conversation.ts" ] && echo "  ✅ types/conversation.ts" || { echo "  ❌ types/conversation.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/conversation.ts" ] && echo "  ✅ lib/schemas/conversation.ts" || { echo "  ❌ lib/schemas/conversation.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/conversations/route.ts" ] && echo "  ✅ app/api/conversations/route.ts" || { echo "  ❌ app/api/conversations/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/conversations/[id]/route.ts" ] && echo "  ✅ app/api/conversations/[id]/route.ts" || { echo "  ❌ app/api/conversations/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-conversations.ts" ] || [ -f "hooks/use-conversations.tsx" ]) && echo "  ✅ hooks/use-conversations" || { echo "  ❌ hooks/use-conversations.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/conversations/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/conversations/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/conversations/[id]/page.tsx" ] || [ -f "app/(app)/conversations/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/conversations/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/conversations/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/conversations/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/conversations/[id]/edit/page.tsx" ] || [ -f "app/(app)/conversations/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/conversations/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "conversation-form.tsx" -o -name "conversationForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/conversation/conversation-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "conversation-card.tsx" -o -name "conversationCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/conversation/conversation-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Message:"
[ -f "types/message.ts" ] && echo "  ✅ types/message.ts" || { echo "  ❌ types/message.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/message.ts" ] && echo "  ✅ lib/schemas/message.ts" || { echo "  ❌ lib/schemas/message.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/messages/route.ts" ] && echo "  ✅ app/api/messages/route.ts" || { echo "  ❌ app/api/messages/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/messages/[id]/route.ts" ] && echo "  ✅ app/api/messages/[id]/route.ts" || { echo "  ❌ app/api/messages/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-messages.ts" ] || [ -f "hooks/use-messages.tsx" ]) && echo "  ✅ hooks/use-messages" || { echo "  ❌ hooks/use-messages.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/messages/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/messages/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/messages/[id]/page.tsx" ] || [ -f "app/(app)/messages/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/messages/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/messages/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/messages/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/messages/[id]/edit/page.tsx" ] || [ -f "app/(app)/messages/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/messages/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "message-form.tsx" -o -name "messageForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/message/message-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "message-card.tsx" -o -name "messageCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/message/message-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "GlobalSearchFeature:"
[ -f "types/global-search-feature.ts" ] && echo "  ✅ types/global-search-feature.ts" || { echo "  ❌ types/global-search-feature.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/global-search-feature.ts" ] && echo "  ✅ lib/schemas/global-search-feature.ts" || { echo "  ❌ lib/schemas/global-search-feature.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/global-search-features/route.ts" ] && echo "  ✅ app/api/global-search-features/route.ts" || { echo "  ❌ app/api/global-search-features/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/global-search-features/[id]/route.ts" ] && echo "  ✅ app/api/global-search-features/[id]/route.ts" || { echo "  ❌ app/api/global-search-features/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-global-search-features.ts" ] || [ -f "hooks/use-global-search-features.tsx" ]) && echo "  ✅ hooks/use-global-search-features" || { echo "  ❌ hooks/use-global-search-features.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/global-search-features/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/global-search-features/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/global-search-features/[id]/page.tsx" ] || [ -f "app/(app)/global-search-features/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/global-search-features/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/global-search-features/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/global-search-features/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/global-search-features/[id]/edit/page.tsx" ] || [ -f "app/(app)/global-search-features/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/global-search-features/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "global-search-feature-form.tsx" -o -name "global-search-featureForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/global-search-feature/global-search-feature-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "global-search-feature-card.tsx" -o -name "global-search-featureCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/global-search-feature/global-search-feature-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "SafeTransactions:"
[ -f "types/safe-transactions.ts" ] && echo "  ✅ types/safe-transactions.ts" || { echo "  ❌ types/safe-transactions.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/safe-transactions.ts" ] && echo "  ✅ lib/schemas/safe-transactions.ts" || { echo "  ❌ lib/schemas/safe-transactions.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/safe-transactions/route.ts" ] && echo "  ✅ app/api/safe-transactions/route.ts" || { echo "  ❌ app/api/safe-transactions/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/safe-transactions/[id]/route.ts" ] && echo "  ✅ app/api/safe-transactions/[id]/route.ts" || { echo "  ❌ app/api/safe-transactions/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-safe-transactions.ts" ] || [ -f "hooks/use-safe-transactions.tsx" ]) && echo "  ✅ hooks/use-safe-transactions" || { echo "  ❌ hooks/use-safe-transactions.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/safe-transactions/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/safe-transactions/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/safe-transactions/[id]/page.tsx" ] || [ -f "app/(app)/safe-transactions/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/safe-transactions/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/safe-transactions/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/safe-transactions/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/safe-transactions/[id]/edit/page.tsx" ] || [ -f "app/(app)/safe-transactions/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/safe-transactions/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "safe-transactions-form.tsx" -o -name "safe-transactionsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/safe-transactions/safe-transactions-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "safe-transactions-card.tsx" -o -name "safe-transactionsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/safe-transactions/safe-transactions-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "OwnShopSystem:"
[ -f "types/own-shop-system.ts" ] && echo "  ✅ types/own-shop-system.ts" || { echo "  ❌ types/own-shop-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/own-shop-system.ts" ] && echo "  ✅ lib/schemas/own-shop-system.ts" || { echo "  ❌ lib/schemas/own-shop-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/own-shop-systems/route.ts" ] && echo "  ✅ app/api/own-shop-systems/route.ts" || { echo "  ❌ app/api/own-shop-systems/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/own-shop-systems/[id]/route.ts" ] && echo "  ✅ app/api/own-shop-systems/[id]/route.ts" || { echo "  ❌ app/api/own-shop-systems/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-own-shop-systems.ts" ] || [ -f "hooks/use-own-shop-systems.tsx" ]) && echo "  ✅ hooks/use-own-shop-systems" || { echo "  ❌ hooks/use-own-shop-systems.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/own-shop-systems/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/own-shop-systems/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/own-shop-systems/[id]/page.tsx" ] || [ -f "app/(app)/own-shop-systems/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/own-shop-systems/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/own-shop-systems/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/own-shop-systems/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/own-shop-systems/[id]/edit/page.tsx" ] || [ -f "app/(app)/own-shop-systems/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/own-shop-systems/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "own-shop-system-form.tsx" -o -name "own-shop-systemForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/own-shop-system/own-shop-system-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "own-shop-system-card.tsx" -o -name "own-shop-systemCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/own-shop-system/own-shop-system-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "SetYourOwnPrices:"
[ -f "types/set-your-own-prices.ts" ] && echo "  ✅ types/set-your-own-prices.ts" || { echo "  ❌ types/set-your-own-prices.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/set-your-own-prices.ts" ] && echo "  ✅ lib/schemas/set-your-own-prices.ts" || { echo "  ❌ lib/schemas/set-your-own-prices.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/set-your-own-prices/route.ts" ] && echo "  ✅ app/api/set-your-own-prices/route.ts" || { echo "  ❌ app/api/set-your-own-prices/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/set-your-own-prices/[id]/route.ts" ] && echo "  ✅ app/api/set-your-own-prices/[id]/route.ts" || { echo "  ❌ app/api/set-your-own-prices/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-set-your-own-prices.ts" ] || [ -f "hooks/use-set-your-own-prices.tsx" ]) && echo "  ✅ hooks/use-set-your-own-prices" || { echo "  ❌ hooks/use-set-your-own-prices.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/set-your-own-prices/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/set-your-own-prices/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/set-your-own-prices/[id]/page.tsx" ] || [ -f "app/(app)/set-your-own-prices/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/set-your-own-prices/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/set-your-own-prices/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/set-your-own-prices/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/set-your-own-prices/[id]/edit/page.tsx" ] || [ -f "app/(app)/set-your-own-prices/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/set-your-own-prices/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "set-your-own-prices-form.tsx" -o -name "set-your-own-pricesForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/set-your-own-prices/set-your-own-prices-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "set-your-own-prices-card.tsx" -o -name "set-your-own-pricesCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/set-your-own-prices/set-your-own-prices-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "NoTransactionFees:"
[ -f "types/no-transaction-fees.ts" ] && echo "  ✅ types/no-transaction-fees.ts" || { echo "  ❌ types/no-transaction-fees.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/no-transaction-fees.ts" ] && echo "  ✅ lib/schemas/no-transaction-fees.ts" || { echo "  ❌ lib/schemas/no-transaction-fees.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/no-transaction-fees/route.ts" ] && echo "  ✅ app/api/no-transaction-fees/route.ts" || { echo "  ❌ app/api/no-transaction-fees/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/no-transaction-fees/[id]/route.ts" ] && echo "  ✅ app/api/no-transaction-fees/[id]/route.ts" || { echo "  ❌ app/api/no-transaction-fees/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-no-transaction-fees.ts" ] || [ -f "hooks/use-no-transaction-fees.tsx" ]) && echo "  ✅ hooks/use-no-transaction-fees" || { echo "  ❌ hooks/use-no-transaction-fees.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/no-transaction-fees/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/no-transaction-fees/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/no-transaction-fees/[id]/page.tsx" ] || [ -f "app/(app)/no-transaction-fees/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/no-transaction-fees/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/no-transaction-fees/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/no-transaction-fees/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/no-transaction-fees/[id]/edit/page.tsx" ] || [ -f "app/(app)/no-transaction-fees/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/no-transaction-fees/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "no-transaction-fees-form.tsx" -o -name "no-transaction-feesForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/no-transaction-fees/no-transaction-fees-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "no-transaction-fees-card.tsx" -o -name "no-transaction-feesCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/no-transaction-fees/no-transaction-fees-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "MessagesAndChatSystem:"
[ -f "types/messages-and-chat-system.ts" ] && echo "  ✅ types/messages-and-chat-system.ts" || { echo "  ❌ types/messages-and-chat-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/messages-and-chat-system.ts" ] && echo "  ✅ lib/schemas/messages-and-chat-system.ts" || { echo "  ❌ lib/schemas/messages-and-chat-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/messages-and-chat-systems/route.ts" ] && echo "  ✅ app/api/messages-and-chat-systems/route.ts" || { echo "  ❌ app/api/messages-and-chat-systems/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/messages-and-chat-systems/[id]/route.ts" ] && echo "  ✅ app/api/messages-and-chat-systems/[id]/route.ts" || { echo "  ❌ app/api/messages-and-chat-systems/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-messages-and-chat-systems.ts" ] || [ -f "hooks/use-messages-and-chat-systems.tsx" ]) && echo "  ✅ hooks/use-messages-and-chat-systems" || { echo "  ❌ hooks/use-messages-and-chat-systems.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/messages-and-chat-systems/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/messages-and-chat-systems/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/messages-and-chat-systems/[id]/page.tsx" ] || [ -f "app/(app)/messages-and-chat-systems/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/messages-and-chat-systems/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/messages-and-chat-systems/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/messages-and-chat-systems/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/messages-and-chat-systems/[id]/edit/page.tsx" ] || [ -f "app/(app)/messages-and-chat-systems/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/messages-and-chat-systems/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "messages-and-chat-system-form.tsx" -o -name "messages-and-chat-systemForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/messages-and-chat-system/messages-and-chat-system-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "messages-and-chat-system-card.tsx" -o -name "messages-and-chat-systemCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/messages-and-chat-system/messages-and-chat-system-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "ClassifiedAdMarket:"
[ -f "types/classified-ad-market.ts" ] && echo "  ✅ types/classified-ad-market.ts" || { echo "  ❌ types/classified-ad-market.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/classified-ad-market.ts" ] && echo "  ✅ lib/schemas/classified-ad-market.ts" || { echo "  ❌ lib/schemas/classified-ad-market.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/classified-ad-markets/route.ts" ] && echo "  ✅ app/api/classified-ad-markets/route.ts" || { echo "  ❌ app/api/classified-ad-markets/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/classified-ad-markets/[id]/route.ts" ] && echo "  ✅ app/api/classified-ad-markets/[id]/route.ts" || { echo "  ❌ app/api/classified-ad-markets/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-classified-ad-markets.ts" ] || [ -f "hooks/use-classified-ad-markets.tsx" ]) && echo "  ✅ hooks/use-classified-ad-markets" || { echo "  ❌ hooks/use-classified-ad-markets.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/classified-ad-markets/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/classified-ad-markets/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/classified-ad-markets/[id]/page.tsx" ] || [ -f "app/(app)/classified-ad-markets/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/classified-ad-markets/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/classified-ad-markets/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/classified-ad-markets/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/classified-ad-markets/[id]/edit/page.tsx" ] || [ -f "app/(app)/classified-ad-markets/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/classified-ad-markets/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "classified-ad-market-form.tsx" -o -name "classified-ad-marketForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/classified-ad-market/classified-ad-market-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "classified-ad-market-card.tsx" -o -name "classified-ad-marketCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/classified-ad-market/classified-ad-market-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "MemberReviews:"
[ -f "types/member-reviews.ts" ] && echo "  ✅ types/member-reviews.ts" || { echo "  ❌ types/member-reviews.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/member-reviews.ts" ] && echo "  ✅ lib/schemas/member-reviews.ts" || { echo "  ❌ lib/schemas/member-reviews.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/member-reviews/route.ts" ] && echo "  ✅ app/api/member-reviews/route.ts" || { echo "  ❌ app/api/member-reviews/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/member-reviews/[id]/route.ts" ] && echo "  ✅ app/api/member-reviews/[id]/route.ts" || { echo "  ❌ app/api/member-reviews/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-member-reviews.ts" ] || [ -f "hooks/use-member-reviews.tsx" ]) && echo "  ✅ hooks/use-member-reviews" || { echo "  ❌ hooks/use-member-reviews.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/member-reviews/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/member-reviews/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/member-reviews/[id]/page.tsx" ] || [ -f "app/(app)/member-reviews/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/member-reviews/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/member-reviews/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/member-reviews/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/member-reviews/[id]/edit/page.tsx" ] || [ -f "app/(app)/member-reviews/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/member-reviews/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "member-reviews-form.tsx" -o -name "member-reviewsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/member-reviews/member-reviews-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "member-reviews-card.tsx" -o -name "member-reviewsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/member-reviews/member-reviews-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "PrivacyFunctions:"
[ -f "types/privacy-functions.ts" ] && echo "  ✅ types/privacy-functions.ts" || { echo "  ❌ types/privacy-functions.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/privacy-functions.ts" ] && echo "  ✅ lib/schemas/privacy-functions.ts" || { echo "  ❌ lib/schemas/privacy-functions.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/privacy-functions/route.ts" ] && echo "  ✅ app/api/privacy-functions/route.ts" || { echo "  ❌ app/api/privacy-functions/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/privacy-functions/[id]/route.ts" ] && echo "  ✅ app/api/privacy-functions/[id]/route.ts" || { echo "  ❌ app/api/privacy-functions/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-privacy-functions.ts" ] || [ -f "hooks/use-privacy-functions.tsx" ]) && echo "  ✅ hooks/use-privacy-functions" || { echo "  ❌ hooks/use-privacy-functions.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/privacy-functions/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/privacy-functions/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/privacy-functions/[id]/page.tsx" ] || [ -f "app/(app)/privacy-functions/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/privacy-functions/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/privacy-functions/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/privacy-functions/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/privacy-functions/[id]/edit/page.tsx" ] || [ -f "app/(app)/privacy-functions/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/privacy-functions/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "privacy-functions-form.tsx" -o -name "privacy-functionsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/privacy-functions/privacy-functions-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "privacy-functions-card.tsx" -o -name "privacy-functionsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/privacy-functions/privacy-functions-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "MediaCloud:"
[ -f "types/media-cloud.ts" ] && echo "  ✅ types/media-cloud.ts" || { echo "  ❌ types/media-cloud.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/media-cloud.ts" ] && echo "  ✅ lib/schemas/media-cloud.ts" || { echo "  ❌ lib/schemas/media-cloud.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/media-clouds/route.ts" ] && echo "  ✅ app/api/media-clouds/route.ts" || { echo "  ❌ app/api/media-clouds/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/media-clouds/[id]/route.ts" ] && echo "  ✅ app/api/media-clouds/[id]/route.ts" || { echo "  ❌ app/api/media-clouds/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-media-clouds.ts" ] || [ -f "hooks/use-media-clouds.tsx" ]) && echo "  ✅ hooks/use-media-clouds" || { echo "  ❌ hooks/use-media-clouds.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/media-clouds/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/media-clouds/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/media-clouds/[id]/page.tsx" ] || [ -f "app/(app)/media-clouds/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/media-clouds/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/media-clouds/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/media-clouds/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/media-clouds/[id]/edit/page.tsx" ] || [ -f "app/(app)/media-clouds/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/media-clouds/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "media-cloud-form.tsx" -o -name "media-cloudForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/media-cloud/media-cloud-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "media-cloud-card.tsx" -o -name "media-cloudCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/media-cloud/media-cloud-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "UserBlockingSystem:"
[ -f "types/user-blocking-system.ts" ] && echo "  ✅ types/user-blocking-system.ts" || { echo "  ❌ types/user-blocking-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/user-blocking-system.ts" ] && echo "  ✅ lib/schemas/user-blocking-system.ts" || { echo "  ❌ lib/schemas/user-blocking-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/user-blocking-systems/route.ts" ] && echo "  ✅ app/api/user-blocking-systems/route.ts" || { echo "  ❌ app/api/user-blocking-systems/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/user-blocking-systems/[id]/route.ts" ] && echo "  ✅ app/api/user-blocking-systems/[id]/route.ts" || { echo "  ❌ app/api/user-blocking-systems/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-user-blocking-systems.ts" ] || [ -f "hooks/use-user-blocking-systems.tsx" ]) && echo "  ✅ hooks/use-user-blocking-systems" || { echo "  ❌ hooks/use-user-blocking-systems.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/user-blocking-systems/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/user-blocking-systems/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/user-blocking-systems/[id]/page.tsx" ] || [ -f "app/(app)/user-blocking-systems/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/user-blocking-systems/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/user-blocking-systems/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/user-blocking-systems/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/user-blocking-systems/[id]/edit/page.tsx" ] || [ -f "app/(app)/user-blocking-systems/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/user-blocking-systems/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "user-blocking-system-form.tsx" -o -name "user-blocking-systemForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/user-blocking-system/user-blocking-system-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "user-blocking-system-card.tsx" -o -name "user-blocking-systemCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/user-blocking-system/user-blocking-system-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "HumanOperatedFakeCheck:"
[ -f "types/human-operated-fake-check.ts" ] && echo "  ✅ types/human-operated-fake-check.ts" || { echo "  ❌ types/human-operated-fake-check.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/human-operated-fake-check.ts" ] && echo "  ✅ lib/schemas/human-operated-fake-check.ts" || { echo "  ❌ lib/schemas/human-operated-fake-check.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/human-operated-fake-checks/route.ts" ] && echo "  ✅ app/api/human-operated-fake-checks/route.ts" || { echo "  ❌ app/api/human-operated-fake-checks/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/human-operated-fake-checks/[id]/route.ts" ] && echo "  ✅ app/api/human-operated-fake-checks/[id]/route.ts" || { echo "  ❌ app/api/human-operated-fake-checks/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-human-operated-fake-checks.ts" ] || [ -f "hooks/use-human-operated-fake-checks.tsx" ]) && echo "  ✅ hooks/use-human-operated-fake-checks" || { echo "  ❌ hooks/use-human-operated-fake-checks.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/human-operated-fake-checks/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/human-operated-fake-checks/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/human-operated-fake-checks/[id]/page.tsx" ] || [ -f "app/(app)/human-operated-fake-checks/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/human-operated-fake-checks/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/human-operated-fake-checks/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/human-operated-fake-checks/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/human-operated-fake-checks/[id]/edit/page.tsx" ] || [ -f "app/(app)/human-operated-fake-checks/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/human-operated-fake-checks/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "human-operated-fake-check-form.tsx" -o -name "human-operated-fake-checkForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/human-operated-fake-check/human-operated-fake-check-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "human-operated-fake-check-card.tsx" -o -name "human-operated-fake-checkCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/human-operated-fake-check/human-operated-fake-check-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "MemberReviewsAndRatings:"
[ -f "types/member-reviews-and-ratings.ts" ] && echo "  ✅ types/member-reviews-and-ratings.ts" || { echo "  ❌ types/member-reviews-and-ratings.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/member-reviews-and-ratings.ts" ] && echo "  ✅ lib/schemas/member-reviews-and-ratings.ts" || { echo "  ❌ lib/schemas/member-reviews-and-ratings.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/member-reviews-and-ratings/route.ts" ] && echo "  ✅ app/api/member-reviews-and-ratings/route.ts" || { echo "  ❌ app/api/member-reviews-and-ratings/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/member-reviews-and-ratings/[id]/route.ts" ] && echo "  ✅ app/api/member-reviews-and-ratings/[id]/route.ts" || { echo "  ❌ app/api/member-reviews-and-ratings/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-member-reviews-and-ratings.ts" ] || [ -f "hooks/use-member-reviews-and-ratings.tsx" ]) && echo "  ✅ hooks/use-member-reviews-and-ratings" || { echo "  ❌ hooks/use-member-reviews-and-ratings.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/member-reviews-and-ratings/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/member-reviews-and-ratings/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/member-reviews-and-ratings/[id]/page.tsx" ] || [ -f "app/(app)/member-reviews-and-ratings/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/member-reviews-and-ratings/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/member-reviews-and-ratings/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/member-reviews-and-ratings/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/member-reviews-and-ratings/[id]/edit/page.tsx" ] || [ -f "app/(app)/member-reviews-and-ratings/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/member-reviews-and-ratings/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "member-reviews-and-ratings-form.tsx" -o -name "member-reviews-and-ratingsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/member-reviews-and-ratings/member-reviews-and-ratings-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "member-reviews-and-ratings-card.tsx" -o -name "member-reviews-and-ratingsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/member-reviews-and-ratings/member-reviews-and-ratings-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "FullFeaturedProfiles:"
[ -f "types/full-featured-profiles.ts" ] && echo "  ✅ types/full-featured-profiles.ts" || { echo "  ❌ types/full-featured-profiles.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/full-featured-profiles.ts" ] && echo "  ✅ lib/schemas/full-featured-profiles.ts" || { echo "  ❌ lib/schemas/full-featured-profiles.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/full-featured-profiles/route.ts" ] && echo "  ✅ app/api/full-featured-profiles/route.ts" || { echo "  ❌ app/api/full-featured-profiles/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/full-featured-profiles/[id]/route.ts" ] && echo "  ✅ app/api/full-featured-profiles/[id]/route.ts" || { echo "  ❌ app/api/full-featured-profiles/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-full-featured-profiles.ts" ] || [ -f "hooks/use-full-featured-profiles.tsx" ]) && echo "  ✅ hooks/use-full-featured-profiles" || { echo "  ❌ hooks/use-full-featured-profiles.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/full-featured-profiles/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/full-featured-profiles/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/full-featured-profiles/[id]/page.tsx" ] || [ -f "app/(app)/full-featured-profiles/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/full-featured-profiles/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/full-featured-profiles/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/full-featured-profiles/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/full-featured-profiles/[id]/edit/page.tsx" ] || [ -f "app/(app)/full-featured-profiles/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/full-featured-profiles/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "full-featured-profiles-form.tsx" -o -name "full-featured-profilesForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/full-featured-profiles/full-featured-profiles-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "full-featured-profiles-card.tsx" -o -name "full-featured-profilesCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/full-featured-profiles/full-featured-profiles-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "SellerRatingsAndBuyerReviews:"
[ -f "types/seller-ratings-and-buyer-reviews.ts" ] && echo "  ✅ types/seller-ratings-and-buyer-reviews.ts" || { echo "  ❌ types/seller-ratings-and-buyer-reviews.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/seller-ratings-and-buyer-reviews.ts" ] && echo "  ✅ lib/schemas/seller-ratings-and-buyer-reviews.ts" || { echo "  ❌ lib/schemas/seller-ratings-and-buyer-reviews.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/seller-ratings-and-buyer-reviews/route.ts" ] && echo "  ✅ app/api/seller-ratings-and-buyer-reviews/route.ts" || { echo "  ❌ app/api/seller-ratings-and-buyer-reviews/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/seller-ratings-and-buyer-reviews/[id]/route.ts" ] && echo "  ✅ app/api/seller-ratings-and-buyer-reviews/[id]/route.ts" || { echo "  ❌ app/api/seller-ratings-and-buyer-reviews/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-seller-ratings-and-buyer-reviews.ts" ] || [ -f "hooks/use-seller-ratings-and-buyer-reviews.tsx" ]) && echo "  ✅ hooks/use-seller-ratings-and-buyer-reviews" || { echo "  ❌ hooks/use-seller-ratings-and-buyer-reviews.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/seller-ratings-and-buyer-reviews/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/seller-ratings-and-buyer-reviews/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/seller-ratings-and-buyer-reviews/[id]/page.tsx" ] || [ -f "app/(app)/seller-ratings-and-buyer-reviews/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/seller-ratings-and-buyer-reviews/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/seller-ratings-and-buyer-reviews/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/seller-ratings-and-buyer-reviews/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/seller-ratings-and-buyer-reviews/[id]/edit/page.tsx" ] || [ -f "app/(app)/seller-ratings-and-buyer-reviews/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/seller-ratings-and-buyer-reviews/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "seller-ratings-and-buyer-reviews-form.tsx" -o -name "seller-ratings-and-buyer-reviewsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/seller-ratings-and-buyer-reviews/seller-ratings-and-buyer-reviews-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "seller-ratings-and-buyer-reviews-card.tsx" -o -name "seller-ratings-and-buyer-reviewsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/seller-ratings-and-buyer-reviews/seller-ratings-and-buyer-reviews-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "UserRankingList:"
[ -f "types/user-ranking-list.ts" ] && echo "  ✅ types/user-ranking-list.ts" || { echo "  ❌ types/user-ranking-list.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/user-ranking-list.ts" ] && echo "  ✅ lib/schemas/user-ranking-list.ts" || { echo "  ❌ lib/schemas/user-ranking-list.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/user-ranking-lists/route.ts" ] && echo "  ✅ app/api/user-ranking-lists/route.ts" || { echo "  ❌ app/api/user-ranking-lists/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/user-ranking-lists/[id]/route.ts" ] && echo "  ✅ app/api/user-ranking-lists/[id]/route.ts" || { echo "  ❌ app/api/user-ranking-lists/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-user-ranking-lists.ts" ] || [ -f "hooks/use-user-ranking-lists.tsx" ]) && echo "  ✅ hooks/use-user-ranking-lists" || { echo "  ❌ hooks/use-user-ranking-lists.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/user-ranking-lists/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/user-ranking-lists/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/user-ranking-lists/[id]/page.tsx" ] || [ -f "app/(app)/user-ranking-lists/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/user-ranking-lists/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/user-ranking-lists/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/user-ranking-lists/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/user-ranking-lists/[id]/edit/page.tsx" ] || [ -f "app/(app)/user-ranking-lists/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/user-ranking-lists/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "user-ranking-list-form.tsx" -o -name "user-ranking-listForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/user-ranking-list/user-ranking-list-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "user-ranking-list-card.tsx" -o -name "user-ranking-listCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/user-ranking-list/user-ranking-list-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "FriendsAndFansSystem:"
[ -f "types/friends-and-fans-system.ts" ] && echo "  ✅ types/friends-and-fans-system.ts" || { echo "  ❌ types/friends-and-fans-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/friends-and-fans-system.ts" ] && echo "  ✅ lib/schemas/friends-and-fans-system.ts" || { echo "  ❌ lib/schemas/friends-and-fans-system.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/friends-and-fans-systems/route.ts" ] && echo "  ✅ app/api/friends-and-fans-systems/route.ts" || { echo "  ❌ app/api/friends-and-fans-systems/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/friends-and-fans-systems/[id]/route.ts" ] && echo "  ✅ app/api/friends-and-fans-systems/[id]/route.ts" || { echo "  ❌ app/api/friends-and-fans-systems/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-friends-and-fans-systems.ts" ] || [ -f "hooks/use-friends-and-fans-systems.tsx" ]) && echo "  ✅ hooks/use-friends-and-fans-systems" || { echo "  ❌ hooks/use-friends-and-fans-systems.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/friends-and-fans-systems/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/friends-and-fans-systems/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/friends-and-fans-systems/[id]/page.tsx" ] || [ -f "app/(app)/friends-and-fans-systems/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/friends-and-fans-systems/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/friends-and-fans-systems/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/friends-and-fans-systems/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/friends-and-fans-systems/[id]/edit/page.tsx" ] || [ -f "app/(app)/friends-and-fans-systems/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/friends-and-fans-systems/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "friends-and-fans-system-form.tsx" -o -name "friends-and-fans-systemForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/friends-and-fans-system/friends-and-fans-system-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "friends-and-fans-system-card.tsx" -o -name "friends-and-fans-systemCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/friends-and-fans-system/friends-and-fans-system-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "CustomVideoClips:"
[ -f "types/custom-video-clips.ts" ] && echo "  ✅ types/custom-video-clips.ts" || { echo "  ❌ types/custom-video-clips.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/custom-video-clips.ts" ] && echo "  ✅ lib/schemas/custom-video-clips.ts" || { echo "  ❌ lib/schemas/custom-video-clips.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/custom-video-clips/route.ts" ] && echo "  ✅ app/api/custom-video-clips/route.ts" || { echo "  ❌ app/api/custom-video-clips/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/custom-video-clips/[id]/route.ts" ] && echo "  ✅ app/api/custom-video-clips/[id]/route.ts" || { echo "  ❌ app/api/custom-video-clips/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-custom-video-clips.ts" ] || [ -f "hooks/use-custom-video-clips.tsx" ]) && echo "  ✅ hooks/use-custom-video-clips" || { echo "  ❌ hooks/use-custom-video-clips.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/custom-video-clips/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/custom-video-clips/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/custom-video-clips/[id]/page.tsx" ] || [ -f "app/(app)/custom-video-clips/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/custom-video-clips/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/custom-video-clips/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/custom-video-clips/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/custom-video-clips/[id]/edit/page.tsx" ] || [ -f "app/(app)/custom-video-clips/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/custom-video-clips/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "custom-video-clips-form.tsx" -o -name "custom-video-clipsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/custom-video-clips/custom-video-clips-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "custom-video-clips-card.tsx" -o -name "custom-video-clipsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/custom-video-clips/custom-video-clips-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "PrivatePhotosets:"
[ -f "types/private-photosets.ts" ] && echo "  ✅ types/private-photosets.ts" || { echo "  ❌ types/private-photosets.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/private-photosets.ts" ] && echo "  ✅ lib/schemas/private-photosets.ts" || { echo "  ❌ lib/schemas/private-photosets.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/private-photosets/route.ts" ] && echo "  ✅ app/api/private-photosets/route.ts" || { echo "  ❌ app/api/private-photosets/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/private-photosets/[id]/route.ts" ] && echo "  ✅ app/api/private-photosets/[id]/route.ts" || { echo "  ❌ app/api/private-photosets/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-private-photosets.ts" ] || [ -f "hooks/use-private-photosets.tsx" ]) && echo "  ✅ hooks/use-private-photosets" || { echo "  ❌ hooks/use-private-photosets.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/private-photosets/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/private-photosets/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/private-photosets/[id]/page.tsx" ] || [ -f "app/(app)/private-photosets/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/private-photosets/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/private-photosets/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/private-photosets/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/private-photosets/[id]/edit/page.tsx" ] || [ -f "app/(app)/private-photosets/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/private-photosets/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "private-photosets-form.tsx" -o -name "private-photosetsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/private-photosets/private-photosets-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "private-photosets-card.tsx" -o -name "private-photosetsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/private-photosets/private-photosets-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "WhatsappAndSkypeChats:"
[ -f "types/whatsapp-and-skype-chats.ts" ] && echo "  ✅ types/whatsapp-and-skype-chats.ts" || { echo "  ❌ types/whatsapp-and-skype-chats.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "lib/schemas/whatsapp-and-skype-chats.ts" ] && echo "  ✅ lib/schemas/whatsapp-and-skype-chats.ts" || { echo "  ❌ lib/schemas/whatsapp-and-skype-chats.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/whatsapp-and-skype-chats/route.ts" ] && echo "  ✅ app/api/whatsapp-and-skype-chats/route.ts" || { echo "  ❌ app/api/whatsapp-and-skype-chats/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/api/whatsapp-and-skype-chats/[id]/route.ts" ] && echo "  ✅ app/api/whatsapp-and-skype-chats/[id]/route.ts" || { echo "  ❌ app/api/whatsapp-and-skype-chats/[id]/route.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-whatsapp-and-skype-chats.ts" ] || [ -f "hooks/use-whatsapp-and-skype-chats.tsx" ]) && echo "  ✅ hooks/use-whatsapp-and-skype-chats" || { echo "  ❌ hooks/use-whatsapp-and-skype-chats.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/whatsapp-and-skype-chats/page.tsx" ] && echo "  ✅ list page" || { echo "  ❌ app/(app)/whatsapp-and-skype-chats/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/whatsapp-and-skype-chats/[id]/page.tsx" ] || [ -f "app/(app)/whatsapp-and-skype-chats/\[id\]/page.tsx" ]) && echo "  ✅ detail page" || { echo "  ❌ app/(app)/whatsapp-and-skype-chats/[id]/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/(app)/whatsapp-and-skype-chats/new/page.tsx" ] && echo "  ✅ create page" || { echo "  ❌ app/(app)/whatsapp-and-skype-chats/new/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/whatsapp-and-skype-chats/[id]/edit/page.tsx" ] || [ -f "app/(app)/whatsapp-and-skype-chats/\[id\]/edit/page.tsx" ]) && echo "  ✅ edit page" || { echo "  ❌ app/(app)/whatsapp-and-skype-chats/[id]/edit/page.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "whatsapp-and-skype-chats-form.tsx" -o -name "whatsapp-and-skype-chatsForm.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ form component" || { echo "  ❌ components/whatsapp-and-skype-chats/whatsapp-and-skype-chats-form.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "whatsapp-and-skype-chats-card.tsx" -o -name "whatsapp-and-skype-chatsCard.tsx" 2>/dev/null | head -1 | grep -q . && echo "  ✅ card component" || { echo "  ❌ components/whatsapp-and-skype-chats/whatsapp-and-skype-chats-card.tsx"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""

# ═══════════════════════════════════════════════════
# SECTION C: Enabled Feature Implementations
# ═══════════════════════════════════════════════════
echo "--- C. Feature Implementations (28 enabled) ---"
echo "Payments (Stripe):"
(ls lib/stripe.ts lib/stripe/client.ts lib/payments.ts 2>/dev/null | head -1) && echo "  ✅ Stripe client" || { echo "  ❌ MISSING: Stripe client (lib/stripe.ts)"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(ls app/api/stripe/checkout/route.ts app/api/webhooks/stripe/route.ts 2>/dev/null | head -1) && echo "  ✅ Checkout API" || { echo "  ❌ MISSING: Checkout API route"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(ls app/api/stripe/webhook/route.ts app/api/webhooks/stripe/route.ts 2>/dev/null | head -1) && echo "  ✅ Webhook handler" || { echo "  ❌ MISSING: Webhook handler"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "*checkout*" -o -name "*pricing*" 2>/dev/null | head -1 | grep -q . && echo "  ✅ Checkout/Pricing component" || { echo "  ❌ MISSING: Checkout or pricing component"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
grep -r "STRIPE_SECRET_KEY\|NEXT_PUBLIC_STRIPE" .env.example 2>/dev/null | head -1 | grep -q . && echo "  ✅ Stripe env vars in .env.example" || { echo "  ❌ MISSING: Stripe env vars in .env.example"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "File Storage:"
find components -name "*upload*" -o -name "*file-upload*" -o -name "*image-upload*" 2>/dev/null | head -1 | grep -q . && echo "  ✅ Upload component" || { echo "  ❌ MISSING: Upload component"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find app/api -name "*upload*" 2>/dev/null | head -1 | grep -q . && echo "  ✅ Upload API" || { echo "  ❌ MISSING: Upload API route"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Realtime:"
(find hooks -name "*realtime*" 2>/dev/null; grep -rl "supabase.*channel\|RealtimeChannel\|subscribe(" hooks/ 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Realtime hooks" || { echo "  ❌ MISSING: Realtime subscription hooks"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Notifications:"
find app/api -path "*notification*" -name "route.ts" 2>/dev/null | head -1 | grep -q . && echo "  ✅ Notification API" || { echo "  ❌ MISSING: Notification API route"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "*notification*" 2>/dev/null | head -1 | grep -q . && echo "  ✅ Notification UI" || { echo "  ❌ MISSING: Notification component"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Search:"
(find app/api -path "*search*" -name "route.ts" 2>/dev/null; find components -name "*search*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Search" || { echo "  ❌ MISSING: Search implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Messaging:"
(find app/api -path "*conversation*" -o -path "*message*" 2>/dev/null | grep "route.ts" | head -1) | grep -q . && echo "  ✅ Messaging API" || { echo "  ❌ MISSING: Messaging API routes"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(find app -name "*.tsx" -path "*message*" -o -name "*.tsx" -path "*conversation*" 2>/dev/null | head -1) | grep -q . && echo "  ✅ Messaging UI" || { echo "  ❌ MISSING: Messaging UI pages"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Reviews:"
find app/api -path "*review*" -name "route.ts" 2>/dev/null | head -1 | grep -q . && echo "  ✅ Reviews API" || { echo "  ❌ MISSING: Reviews API route"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
find components -name "*rating*" -o -name "*review*" -o -name "*star*" 2>/dev/null | head -1 | grep -q . && echo "  ✅ Rating component" || { echo "  ❌ MISSING: Star rating component"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Global Search Feature:"
(find app/api -path "*global-search-feature*" -name "route.ts" 2>/dev/null; find app -path "*global-search-feature*" -name "page.tsx" 2>/dev/null; find components -name "*global*search*feature*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Global Search Feature" || { echo "  ❌ MISSING: Global Search Feature implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Auth:"
(find app/api -path "*auth*" -name "route.ts" 2>/dev/null; find app -path "*auth*" -name "page.tsx" 2>/dev/null; find components -name "*auth*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Auth" || { echo "  ❌ MISSING: Auth implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Safe Transactions:"
(find app/api -path "*safe-transactions*" -name "route.ts" 2>/dev/null; find app -path "*safe-transactions*" -name "page.tsx" 2>/dev/null; find components -name "*safe*transactions*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Safe Transactions" || { echo "  ❌ MISSING: Safe Transactions implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Own Shop System:"
(find app/api -path "*own-shop-system*" -name "route.ts" 2>/dev/null; find app -path "*own-shop-system*" -name "page.tsx" 2>/dev/null; find components -name "*own*shop*system*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Own Shop System" || { echo "  ❌ MISSING: Own Shop System implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Set Your Own Prices:"
(find app/api -path "*set-your-own-prices*" -name "route.ts" 2>/dev/null; find app -path "*set-your-own-prices*" -name "page.tsx" 2>/dev/null; find components -name "*set*your*own*prices*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Set Your Own Prices" || { echo "  ❌ MISSING: Set Your Own Prices implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "No Transaction Fees:"
(find app/api -path "*no-transaction-fees*" -name "route.ts" 2>/dev/null; find app -path "*no-transaction-fees*" -name "page.tsx" 2>/dev/null; find components -name "*no*transaction*fees*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ No Transaction Fees" || { echo "  ❌ MISSING: No Transaction Fees implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Messages And Chat System:"
(find app/api -path "*messages-and-chat-system*" -name "route.ts" 2>/dev/null; find app -path "*messages-and-chat-system*" -name "page.tsx" 2>/dev/null; find components -name "*messages*and*chat*system*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Messages And Chat System" || { echo "  ❌ MISSING: Messages And Chat System implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Classified Ad Market:"
(find app/api -path "*classified-ad-market*" -name "route.ts" 2>/dev/null; find app -path "*classified-ad-market*" -name "page.tsx" 2>/dev/null; find components -name "*classified*ad*market*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Classified Ad Market" || { echo "  ❌ MISSING: Classified Ad Market implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Member Reviews:"
(find app/api -path "*member-reviews*" -name "route.ts" 2>/dev/null; find app -path "*member-reviews*" -name "page.tsx" 2>/dev/null; find components -name "*member*reviews*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Member Reviews" || { echo "  ❌ MISSING: Member Reviews implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Privacy Functions:"
(find app/api -path "*privacy-functions*" -name "route.ts" 2>/dev/null; find app -path "*privacy-functions*" -name "page.tsx" 2>/dev/null; find components -name "*privacy*functions*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Privacy Functions" || { echo "  ❌ MISSING: Privacy Functions implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Media Cloud:"
(find app/api -path "*media-cloud*" -name "route.ts" 2>/dev/null; find app -path "*media-cloud*" -name "page.tsx" 2>/dev/null; find components -name "*media*cloud*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Media Cloud" || { echo "  ❌ MISSING: Media Cloud implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "User Blocking System:"
(find app/api -path "*user-blocking-system*" -name "route.ts" 2>/dev/null; find app -path "*user-blocking-system*" -name "page.tsx" 2>/dev/null; find components -name "*user*blocking*system*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ User Blocking System" || { echo "  ❌ MISSING: User Blocking System implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Human Operated Fake Check:"
(find app/api -path "*human-operated-fake-check*" -name "route.ts" 2>/dev/null; find app -path "*human-operated-fake-check*" -name "page.tsx" 2>/dev/null; find components -name "*human*operated*fake*check*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Human Operated Fake Check" || { echo "  ❌ MISSING: Human Operated Fake Check implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Member Reviews And Ratings:"
(find app/api -path "*member-reviews-and-ratings*" -name "route.ts" 2>/dev/null; find app -path "*member-reviews-and-ratings*" -name "page.tsx" 2>/dev/null; find components -name "*member*reviews*and*ratings*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Member Reviews And Ratings" || { echo "  ❌ MISSING: Member Reviews And Ratings implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Full Featured Profiles:"
(find app/api -path "*full-featured-profiles*" -name "route.ts" 2>/dev/null; find app -path "*full-featured-profiles*" -name "page.tsx" 2>/dev/null; find components -name "*full*featured*profiles*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Full Featured Profiles" || { echo "  ❌ MISSING: Full Featured Profiles implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Seller Ratings And Buyer Reviews:"
(find app/api -path "*seller-ratings-and-buyer-reviews*" -name "route.ts" 2>/dev/null; find app -path "*seller-ratings-and-buyer-reviews*" -name "page.tsx" 2>/dev/null; find components -name "*seller*ratings*and*buyer*reviews*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Seller Ratings And Buyer Reviews" || { echo "  ❌ MISSING: Seller Ratings And Buyer Reviews implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "User Ranking List:"
(find app/api -path "*user-ranking-list*" -name "route.ts" 2>/dev/null; find app -path "*user-ranking-list*" -name "page.tsx" 2>/dev/null; find components -name "*user*ranking*list*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ User Ranking List" || { echo "  ❌ MISSING: User Ranking List implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Friends And Fans System:"
(find app/api -path "*friends-and-fans-system*" -name "route.ts" 2>/dev/null; find app -path "*friends-and-fans-system*" -name "page.tsx" 2>/dev/null; find components -name "*friends*and*fans*system*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Friends And Fans System" || { echo "  ❌ MISSING: Friends And Fans System implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Custom Video Clips:"
(find app/api -path "*custom-video-clips*" -name "route.ts" 2>/dev/null; find app -path "*custom-video-clips*" -name "page.tsx" 2>/dev/null; find components -name "*custom*video*clips*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Custom Video Clips" || { echo "  ❌ MISSING: Custom Video Clips implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Private Photosets:"
(find app/api -path "*private-photosets*" -name "route.ts" 2>/dev/null; find app -path "*private-photosets*" -name "page.tsx" 2>/dev/null; find components -name "*private*photosets*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Private Photosets" || { echo "  ❌ MISSING: Private Photosets implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""
echo "Whatsapp And Skype Chats:"
(find app/api -path "*whatsapp-and-skype-chats*" -name "route.ts" 2>/dev/null; find app -path "*whatsapp-and-skype-chats*" -name "page.tsx" 2>/dev/null; find components -name "*whatsapp*and*skype*chats*" 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Whatsapp And Skype Chats" || { echo "  ❌ MISSING: Whatsapp And Skype Chats implementation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""

# ═══════════════════════════════════════════════════
# SECTION D: Navigation Completeness
# ═══════════════════════════════════════════════════
echo "--- D. Navigation ---"
echo "Checking if all entities appear in sidebar/navigation..."
(grep -ri "users\|user" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/users" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ User in navigation" || { echo "  ❌ MISSING: User not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "listings\|listing" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/listings" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Listing in navigation" || { echo "  ❌ MISSING: Listing not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "reviews\|review" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/reviews" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Review in navigation" || { echo "  ❌ MISSING: Review not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "shops\|shop" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/shops" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Shop in navigation" || { echo "  ❌ MISSING: Shop not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "orders\|order" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/orders" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Order in navigation" || { echo "  ❌ MISSING: Order not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "payments\|payment" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/payments" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Payment in navigation" || { echo "  ❌ MISSING: Payment not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "subscriptions\|subscription" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/subscriptions" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Subscription in navigation" || { echo "  ❌ MISSING: Subscription not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "uploads\|upload" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/uploads" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Upload in navigation" || { echo "  ❌ MISSING: Upload not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "channels\|channel" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/channels" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Channel in navigation" || { echo "  ❌ MISSING: Channel not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "notifications\|notification" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/notifications" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Notification in navigation" || { echo "  ❌ MISSING: Notification not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "conversations\|conversation" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/conversations" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Conversation in navigation" || { echo "  ❌ MISSING: Conversation not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "messages\|message" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/messages" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ Message in navigation" || { echo "  ❌ MISSING: Message not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "global-search-features\|global_search_feature" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/global-search-features" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ GlobalSearchFeature in navigation" || { echo "  ❌ MISSING: GlobalSearchFeature not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "safe-transactions\|safe_transactions" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/safe-transactions" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ SafeTransactions in navigation" || { echo "  ❌ MISSING: SafeTransactions not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "own-shop-systems\|own_shop_system" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/own-shop-systems" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ OwnShopSystem in navigation" || { echo "  ❌ MISSING: OwnShopSystem not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "set-your-own-prices\|set_your_own_prices" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/set-your-own-prices" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ SetYourOwnPrices in navigation" || { echo "  ❌ MISSING: SetYourOwnPrices not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "no-transaction-fees\|no_transaction_fees" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/no-transaction-fees" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ NoTransactionFees in navigation" || { echo "  ❌ MISSING: NoTransactionFees not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "messages-and-chat-systems\|messages_and_chat_system" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/messages-and-chat-systems" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ MessagesAndChatSystem in navigation" || { echo "  ❌ MISSING: MessagesAndChatSystem not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "classified-ad-markets\|classified_ad_market" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/classified-ad-markets" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ ClassifiedAdMarket in navigation" || { echo "  ❌ MISSING: ClassifiedAdMarket not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "member-reviews\|member_reviews" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/member-reviews" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ MemberReviews in navigation" || { echo "  ❌ MISSING: MemberReviews not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "privacy-functions\|privacy_functions" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/privacy-functions" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ PrivacyFunctions in navigation" || { echo "  ❌ MISSING: PrivacyFunctions not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "media-clouds\|media_cloud" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/media-clouds" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ MediaCloud in navigation" || { echo "  ❌ MISSING: MediaCloud not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "user-blocking-systems\|user_blocking_system" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/user-blocking-systems" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ UserBlockingSystem in navigation" || { echo "  ❌ MISSING: UserBlockingSystem not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "human-operated-fake-checks\|human_operated_fake_check" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/human-operated-fake-checks" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ HumanOperatedFakeCheck in navigation" || { echo "  ❌ MISSING: HumanOperatedFakeCheck not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "member-reviews-and-ratings\|member_reviews_and_ratings" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/member-reviews-and-ratings" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ MemberReviewsAndRatings in navigation" || { echo "  ❌ MISSING: MemberReviewsAndRatings not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "full-featured-profiles\|full_featured_profiles" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/full-featured-profiles" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ FullFeaturedProfiles in navigation" || { echo "  ❌ MISSING: FullFeaturedProfiles not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "seller-ratings-and-buyer-reviews\|seller_ratings_and_buyer_reviews" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/seller-ratings-and-buyer-reviews" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ SellerRatingsAndBuyerReviews in navigation" || { echo "  ❌ MISSING: SellerRatingsAndBuyerReviews not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "user-ranking-lists\|user_ranking_list" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/user-ranking-lists" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ UserRankingList in navigation" || { echo "  ❌ MISSING: UserRankingList not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "friends-and-fans-systems\|friends_and_fans_system" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/friends-and-fans-systems" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ FriendsAndFansSystem in navigation" || { echo "  ❌ MISSING: FriendsAndFansSystem not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "custom-video-clips\|custom_video_clips" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/custom-video-clips" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ CustomVideoClips in navigation" || { echo "  ❌ MISSING: CustomVideoClips not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "private-photosets\|private_photosets" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/private-photosets" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ PrivatePhotosets in navigation" || { echo "  ❌ MISSING: PrivatePhotosets not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(grep -ri "whatsapp-and-skype-chats\|whatsapp_and_skype_chats" components/layout/header.tsx components/layout/sidebar.tsx components/layout/nav*.tsx components/layout/mobile-nav.tsx components/nav*.tsx lib/config/navigation.ts lib/config/nav*.ts 2>/dev/null; grep -ri "/whatsapp-and-skype-chats" components/layout/*.tsx 2>/dev/null) | head -1 | grep -q . && echo "  ✅ WhatsappAndSkypeChats in navigation" || { echo "  ❌ MISSING: WhatsappAndSkypeChats not in navigation"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""

# ═══════════════════════════════════════════════════
# SECTION E: Core Pages + Infrastructure
# ═══════════════════════════════════════════════════
echo "--- E. Core Pages ---"
([ -f "app/(app)/dashboard/page.tsx" ] || [ -f "app/dashboard/page.tsx" ]) && echo "  ✅ Dashboard" || { echo "  ❌ Dashboard page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(app)/settings/page.tsx" ] || [ -f "app/settings/page.tsx" ]) && echo "  ✅ Settings" || { echo "  ❌ Settings page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/page.tsx" ] || [ -f "app/(public)/page.tsx" ]) && echo "  ✅ Landing" || { echo "  ❌ Landing page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/login/page.tsx" ] || [ -f "app/(auth)/login/page.tsx" ]) && echo "  ✅ Login" || { echo "  ❌ Login page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/signup/page.tsx" ] || [ -f "app/(auth)/signup/page.tsx" ]) && echo "  ✅ Signup" || { echo "  ❌ Signup page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(auth)/forgot-password/page.tsx" ] || [ -f "app/forgot-password/page.tsx" ]) && echo "  ✅ Forgot Password" || { echo "  ❌ Forgot Password page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "app/(auth)/reset-password/page.tsx" ] || [ -f "app/reset-password/page.tsx" ]) && echo "  ✅ Reset Password" || { echo "  ❌ Reset Password page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f "app/not-found.tsx" ] && echo "  ✅ 404" || { echo "  ❌ 404 page"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""

echo "--- E. Infrastructure ---"
[ -f "middleware.ts" ] && echo "  ✅ middleware.ts" || { echo "  ❌ middleware.ts"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "lib/supabase/server.ts" ] || [ -f "lib/supabase/server.tsx" ]) && echo "  ✅ Supabase server client" || { echo "  ❌ Supabase server client"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "lib/supabase/client.ts" ] || [ -f "lib/supabase/client.tsx" ]) && echo "  ✅ Supabase browser client" || { echo "  ❌ Supabase browser client"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
[ -f ".env.example" ] && echo "  ✅ .env.example" || { echo "  ❌ .env.example"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "supabase/schema.sql" ] || [ -f "schema.sql" ]) && echo "  ✅ schema.sql" || { echo "  ❌ schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "hooks/use-user.ts" ] || [ -f "hooks/use-user.tsx" ] || [ -f "hooks/useUser.ts" ]) && echo "  ✅ useUser hook" || { echo "  ❌ hooks/use-user.ts (auth user hook)"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
([ -f "lib/utils/fetcher.ts" ] || [ -f "lib/fetcher.ts" ] || grep -rq "const fetcher" hooks/ 2>/dev/null) && echo "  ✅ SWR fetcher" || { echo "  ❌ lib/utils/fetcher.ts (SWR fetcher utility)"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
(find app/api/dashboard -name "route.ts" 2>/dev/null | head -1 | grep -q .) && echo "  ✅ Dashboard API" || { echo "  ❌ app/api/dashboard/recent/route.ts (dashboard data API)"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
echo ""

# ═══════════════════════════════════════════════════
# SECTION F: Schema-to-Code Consistency
# ═══════════════════════════════════════════════════
echo "--- F. Schema-Code Consistency ---"
if [ -f "supabase/schema.sql" ] || [ -f "schema.sql" ]; then
  SCHEMA_FILE=$([ -f "supabase/schema.sql" ] && echo "supabase/schema.sql" || echo "schema.sql")
  # Check User: schema table exists + types file has matching fields
  grep -qi "create table.*users" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ User table in schema.sql" || { echo "  ❌ User table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/user.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/user.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  User: types/user.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/user.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/user.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  User: lib/schemas/user.ts has ~$ZOD_FIELDS validators"
  fi
# Check Listing: schema table exists + types file has matching fields
  grep -qi "create table.*listings" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Listing table in schema.sql" || { echo "  ❌ Listing table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/listing.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/listing.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Listing: types/listing.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/listing.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/listing.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Listing: lib/schemas/listing.ts has ~$ZOD_FIELDS validators"
  fi
# Check Review: schema table exists + types file has matching fields
  grep -qi "create table.*reviews" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Review table in schema.sql" || { echo "  ❌ Review table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/review.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/review.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Review: types/review.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/review.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/review.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Review: lib/schemas/review.ts has ~$ZOD_FIELDS validators"
  fi
# Check Shop: schema table exists + types file has matching fields
  grep -qi "create table.*shops" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Shop table in schema.sql" || { echo "  ❌ Shop table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/shop.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/shop.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Shop: types/shop.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/shop.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/shop.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Shop: lib/schemas/shop.ts has ~$ZOD_FIELDS validators"
  fi
# Check Order: schema table exists + types file has matching fields
  grep -qi "create table.*orders" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Order table in schema.sql" || { echo "  ❌ Order table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/order.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/order.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Order: types/order.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/order.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/order.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Order: lib/schemas/order.ts has ~$ZOD_FIELDS validators"
  fi
# Check Payment: schema table exists + types file has matching fields
  grep -qi "create table.*payments" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Payment table in schema.sql" || { echo "  ❌ Payment table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/payment.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/payment.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Payment: types/payment.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/payment.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/payment.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Payment: lib/schemas/payment.ts has ~$ZOD_FIELDS validators"
  fi
# Check Subscription: schema table exists + types file has matching fields
  grep -qi "create table.*subscriptions" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Subscription table in schema.sql" || { echo "  ❌ Subscription table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/subscription.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/subscription.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Subscription: types/subscription.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/subscription.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/subscription.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Subscription: lib/schemas/subscription.ts has ~$ZOD_FIELDS validators"
  fi
# Check Upload: schema table exists + types file has matching fields
  grep -qi "create table.*uploads" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Upload table in schema.sql" || { echo "  ❌ Upload table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/upload.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/upload.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Upload: types/upload.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/upload.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/upload.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Upload: lib/schemas/upload.ts has ~$ZOD_FIELDS validators"
  fi
# Check Channel: schema table exists + types file has matching fields
  grep -qi "create table.*channels" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Channel table in schema.sql" || { echo "  ❌ Channel table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/channel.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/channel.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Channel: types/channel.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/channel.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/channel.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Channel: lib/schemas/channel.ts has ~$ZOD_FIELDS validators"
  fi
# Check Notification: schema table exists + types file has matching fields
  grep -qi "create table.*notifications" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Notification table in schema.sql" || { echo "  ❌ Notification table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/notification.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/notification.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Notification: types/notification.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/notification.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/notification.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Notification: lib/schemas/notification.ts has ~$ZOD_FIELDS validators"
  fi
# Check Conversation: schema table exists + types file has matching fields
  grep -qi "create table.*conversations" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Conversation table in schema.sql" || { echo "  ❌ Conversation table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/conversation.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/conversation.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Conversation: types/conversation.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/conversation.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/conversation.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Conversation: lib/schemas/conversation.ts has ~$ZOD_FIELDS validators"
  fi
# Check Message: schema table exists + types file has matching fields
  grep -qi "create table.*messages" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ Message table in schema.sql" || { echo "  ❌ Message table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/message.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/message.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Message: types/message.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/message.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/message.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  Message: lib/schemas/message.ts has ~$ZOD_FIELDS validators"
  fi
# Check GlobalSearchFeature: schema table exists + types file has matching fields
  grep -qi "create table.*global_search_features" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ GlobalSearchFeature table in schema.sql" || { echo "  ❌ GlobalSearchFeature table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/global-search-feature.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/global-search-feature.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  GlobalSearchFeature: types/global-search-feature.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/global-search-feature.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/global-search-feature.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  GlobalSearchFeature: lib/schemas/global-search-feature.ts has ~$ZOD_FIELDS validators"
  fi
# Check SafeTransactions: schema table exists + types file has matching fields
  grep -qi "create table.*safe_transactions" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ SafeTransactions table in schema.sql" || { echo "  ❌ SafeTransactions table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/safe-transactions.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/safe-transactions.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  SafeTransactions: types/safe-transactions.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/safe-transactions.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/safe-transactions.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  SafeTransactions: lib/schemas/safe-transactions.ts has ~$ZOD_FIELDS validators"
  fi
# Check OwnShopSystem: schema table exists + types file has matching fields
  grep -qi "create table.*own_shop_systems" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ OwnShopSystem table in schema.sql" || { echo "  ❌ OwnShopSystem table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/own-shop-system.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/own-shop-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  OwnShopSystem: types/own-shop-system.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/own-shop-system.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/own-shop-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  OwnShopSystem: lib/schemas/own-shop-system.ts has ~$ZOD_FIELDS validators"
  fi
# Check SetYourOwnPrices: schema table exists + types file has matching fields
  grep -qi "create table.*set_your_own_prices" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ SetYourOwnPrices table in schema.sql" || { echo "  ❌ SetYourOwnPrices table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/set-your-own-prices.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/set-your-own-prices.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  SetYourOwnPrices: types/set-your-own-prices.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/set-your-own-prices.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/set-your-own-prices.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  SetYourOwnPrices: lib/schemas/set-your-own-prices.ts has ~$ZOD_FIELDS validators"
  fi
# Check NoTransactionFees: schema table exists + types file has matching fields
  grep -qi "create table.*no_transaction_fees" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ NoTransactionFees table in schema.sql" || { echo "  ❌ NoTransactionFees table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/no-transaction-fees.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/no-transaction-fees.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  NoTransactionFees: types/no-transaction-fees.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/no-transaction-fees.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/no-transaction-fees.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  NoTransactionFees: lib/schemas/no-transaction-fees.ts has ~$ZOD_FIELDS validators"
  fi
# Check MessagesAndChatSystem: schema table exists + types file has matching fields
  grep -qi "create table.*messages_and_chat_systems" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ MessagesAndChatSystem table in schema.sql" || { echo "  ❌ MessagesAndChatSystem table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/messages-and-chat-system.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/messages-and-chat-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MessagesAndChatSystem: types/messages-and-chat-system.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/messages-and-chat-system.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/messages-and-chat-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MessagesAndChatSystem: lib/schemas/messages-and-chat-system.ts has ~$ZOD_FIELDS validators"
  fi
# Check ClassifiedAdMarket: schema table exists + types file has matching fields
  grep -qi "create table.*classified_ad_markets" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ ClassifiedAdMarket table in schema.sql" || { echo "  ❌ ClassifiedAdMarket table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/classified-ad-market.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/classified-ad-market.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  ClassifiedAdMarket: types/classified-ad-market.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/classified-ad-market.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/classified-ad-market.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  ClassifiedAdMarket: lib/schemas/classified-ad-market.ts has ~$ZOD_FIELDS validators"
  fi
# Check MemberReviews: schema table exists + types file has matching fields
  grep -qi "create table.*member_reviews" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ MemberReviews table in schema.sql" || { echo "  ❌ MemberReviews table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/member-reviews.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/member-reviews.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MemberReviews: types/member-reviews.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/member-reviews.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/member-reviews.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MemberReviews: lib/schemas/member-reviews.ts has ~$ZOD_FIELDS validators"
  fi
# Check PrivacyFunctions: schema table exists + types file has matching fields
  grep -qi "create table.*privacy_functions" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ PrivacyFunctions table in schema.sql" || { echo "  ❌ PrivacyFunctions table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/privacy-functions.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/privacy-functions.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  PrivacyFunctions: types/privacy-functions.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/privacy-functions.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/privacy-functions.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  PrivacyFunctions: lib/schemas/privacy-functions.ts has ~$ZOD_FIELDS validators"
  fi
# Check MediaCloud: schema table exists + types file has matching fields
  grep -qi "create table.*media_clouds" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ MediaCloud table in schema.sql" || { echo "  ❌ MediaCloud table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/media-cloud.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/media-cloud.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MediaCloud: types/media-cloud.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/media-cloud.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/media-cloud.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MediaCloud: lib/schemas/media-cloud.ts has ~$ZOD_FIELDS validators"
  fi
# Check UserBlockingSystem: schema table exists + types file has matching fields
  grep -qi "create table.*user_blocking_systems" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ UserBlockingSystem table in schema.sql" || { echo "  ❌ UserBlockingSystem table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/user-blocking-system.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/user-blocking-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  UserBlockingSystem: types/user-blocking-system.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/user-blocking-system.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/user-blocking-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  UserBlockingSystem: lib/schemas/user-blocking-system.ts has ~$ZOD_FIELDS validators"
  fi
# Check HumanOperatedFakeCheck: schema table exists + types file has matching fields
  grep -qi "create table.*human_operated_fake_checks" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ HumanOperatedFakeCheck table in schema.sql" || { echo "  ❌ HumanOperatedFakeCheck table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/human-operated-fake-check.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/human-operated-fake-check.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  HumanOperatedFakeCheck: types/human-operated-fake-check.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/human-operated-fake-check.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/human-operated-fake-check.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  HumanOperatedFakeCheck: lib/schemas/human-operated-fake-check.ts has ~$ZOD_FIELDS validators"
  fi
# Check MemberReviewsAndRatings: schema table exists + types file has matching fields
  grep -qi "create table.*member_reviews_and_ratings" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ MemberReviewsAndRatings table in schema.sql" || { echo "  ❌ MemberReviewsAndRatings table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/member-reviews-and-ratings.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/member-reviews-and-ratings.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MemberReviewsAndRatings: types/member-reviews-and-ratings.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/member-reviews-and-ratings.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/member-reviews-and-ratings.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  MemberReviewsAndRatings: lib/schemas/member-reviews-and-ratings.ts has ~$ZOD_FIELDS validators"
  fi
# Check FullFeaturedProfiles: schema table exists + types file has matching fields
  grep -qi "create table.*full_featured_profiles" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ FullFeaturedProfiles table in schema.sql" || { echo "  ❌ FullFeaturedProfiles table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/full-featured-profiles.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/full-featured-profiles.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  FullFeaturedProfiles: types/full-featured-profiles.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/full-featured-profiles.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/full-featured-profiles.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  FullFeaturedProfiles: lib/schemas/full-featured-profiles.ts has ~$ZOD_FIELDS validators"
  fi
# Check SellerRatingsAndBuyerReviews: schema table exists + types file has matching fields
  grep -qi "create table.*seller_ratings_and_buyer_reviews" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ SellerRatingsAndBuyerReviews table in schema.sql" || { echo "  ❌ SellerRatingsAndBuyerReviews table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/seller-ratings-and-buyer-reviews.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/seller-ratings-and-buyer-reviews.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  SellerRatingsAndBuyerReviews: types/seller-ratings-and-buyer-reviews.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/seller-ratings-and-buyer-reviews.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/seller-ratings-and-buyer-reviews.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  SellerRatingsAndBuyerReviews: lib/schemas/seller-ratings-and-buyer-reviews.ts has ~$ZOD_FIELDS validators"
  fi
# Check UserRankingList: schema table exists + types file has matching fields
  grep -qi "create table.*user_ranking_lists" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ UserRankingList table in schema.sql" || { echo "  ❌ UserRankingList table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/user-ranking-list.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/user-ranking-list.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  UserRankingList: types/user-ranking-list.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/user-ranking-list.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/user-ranking-list.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  UserRankingList: lib/schemas/user-ranking-list.ts has ~$ZOD_FIELDS validators"
  fi
# Check FriendsAndFansSystem: schema table exists + types file has matching fields
  grep -qi "create table.*friends_and_fans_systems" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ FriendsAndFansSystem table in schema.sql" || { echo "  ❌ FriendsAndFansSystem table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/friends-and-fans-system.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/friends-and-fans-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  FriendsAndFansSystem: types/friends-and-fans-system.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/friends-and-fans-system.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/friends-and-fans-system.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  FriendsAndFansSystem: lib/schemas/friends-and-fans-system.ts has ~$ZOD_FIELDS validators"
  fi
# Check CustomVideoClips: schema table exists + types file has matching fields
  grep -qi "create table.*custom_video_clips" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ CustomVideoClips table in schema.sql" || { echo "  ❌ CustomVideoClips table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/custom-video-clips.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/custom-video-clips.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  CustomVideoClips: types/custom-video-clips.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/custom-video-clips.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/custom-video-clips.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  CustomVideoClips: lib/schemas/custom-video-clips.ts has ~$ZOD_FIELDS validators"
  fi
# Check PrivatePhotosets: schema table exists + types file has matching fields
  grep -qi "create table.*private_photosets" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ PrivatePhotosets table in schema.sql" || { echo "  ❌ PrivatePhotosets table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/private-photosets.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/private-photosets.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  PrivatePhotosets: types/private-photosets.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/private-photosets.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/private-photosets.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  PrivatePhotosets: lib/schemas/private-photosets.ts has ~$ZOD_FIELDS validators"
  fi
# Check WhatsappAndSkypeChats: schema table exists + types file has matching fields
  grep -qi "create table.*whatsapp_and_skype_chats" "$SCHEMA_FILE" 2>/dev/null && echo "  ✅ WhatsappAndSkypeChats table in schema.sql" || { echo "  ❌ WhatsappAndSkypeChats table NOT in schema.sql"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
  if [ -f "types/whatsapp-and-skype-chats.ts" ]; then
    TYPE_FIELDS=$(grep -c ":" "types/whatsapp-and-skype-chats.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  WhatsappAndSkypeChats: types/whatsapp-and-skype-chats.ts has ~$TYPE_FIELDS fields"
  fi
  if [ -f "lib/schemas/whatsapp-and-skype-chats.ts" ]; then
    ZOD_FIELDS=$(grep -c "z\." "lib/schemas/whatsapp-and-skype-chats.ts" 2>/dev/null | tr -d ' ')
    echo "  ℹ️  WhatsappAndSkypeChats: lib/schemas/whatsapp-and-skype-chats.ts has ~$ZOD_FIELDS validators"
  fi
else
  echo "  ⚠️  No schema.sql found — skipping consistency checks"
fi
echo ""

# ═══════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════
echo "================================================================"
echo "  INVENTORY SUMMARY"
echo "  Failed items: $FAIL_COUNT"
if [ "$FAIL_COUNT" -eq 0 ]; then
  echo "  ✅ ALL CHECKS PASSED — ready to exit loop"
else
  echo "  ❌ $FAIL_COUNT items need fixing — loop continues"
fi
echo "================================================================"
```

---

## Step 2: Fix EVERY ❌ Item

**DO NOT SKIP ANY ITEM.** Process the inventory output and fix EVERYTHING marked ❌.

### Fix Priority Order

1. **TypeScript errors** — Fix first (they block everything else)
2. **Missing entity files** — Create using patterns from Phases 12-17
3. **Missing feature implementations** — Read the feature doc and implement
4. **Missing navigation links** — Add to sidebar
5. **Build errors** — Fix last (usually caused by the above)

### Entity File Patterns

Each entity needs these 11 files. Use the same patterns established in earlier phases:
  - types/user.ts
  - lib/schemas/user.ts
  - app/api/users/route.ts
  - app/api/users/[id]/route.ts
  - hooks/use-users.ts
  - app/(app)/users/page.tsx
  - app/(app)/users/[id]/page.tsx
  - app/(app)/users/new/page.tsx
  - app/(app)/users/[id]/edit/page.tsx
  - components/user/user-form.tsx
  - components/user/user-card.tsx
  - types/listing.ts
  - lib/schemas/listing.ts
  - app/api/listings/route.ts
  - app/api/listings/[id]/route.ts
  - hooks/use-listings.ts
  - app/(app)/listings/page.tsx
  - app/(app)/listings/[id]/page.tsx
  - app/(app)/listings/new/page.tsx
  - app/(app)/listings/[id]/edit/page.tsx
  - components/listing/listing-form.tsx
  - components/listing/listing-card.tsx
  - types/review.ts
  - lib/schemas/review.ts
  - app/api/reviews/route.ts
  - app/api/reviews/[id]/route.ts
  - hooks/use-reviews.ts
  - app/(app)/reviews/page.tsx
  - app/(app)/reviews/[id]/page.tsx
  - app/(app)/reviews/new/page.tsx
  - app/(app)/reviews/[id]/edit/page.tsx
  - components/review/review-form.tsx
  - components/review/review-card.tsx
  - types/shop.ts
  - lib/schemas/shop.ts
  - app/api/shops/route.ts
  - app/api/shops/[id]/route.ts
  - hooks/use-shops.ts
  - app/(app)/shops/page.tsx
  - app/(app)/shops/[id]/page.tsx
  - app/(app)/shops/new/page.tsx
  - app/(app)/shops/[id]/edit/page.tsx
  - components/shop/shop-form.tsx
  - components/shop/shop-card.tsx
  - types/order.ts
  - lib/schemas/order.ts
  - app/api/orders/route.ts
  - app/api/orders/[id]/route.ts
  - hooks/use-orders.ts
  - app/(app)/orders/page.tsx
  - app/(app)/orders/[id]/page.tsx
  - app/(app)/orders/new/page.tsx
  - app/(app)/orders/[id]/edit/page.tsx
  - components/order/order-form.tsx
  - components/order/order-card.tsx
  - types/payment.ts
  - lib/schemas/payment.ts
  - app/api/payments/route.ts
  - app/api/payments/[id]/route.ts
  - hooks/use-payments.ts
  - app/(app)/payments/page.tsx
  - app/(app)/payments/[id]/page.tsx
  - app/(app)/payments/new/page.tsx
  - app/(app)/payments/[id]/edit/page.tsx
  - components/payment/payment-form.tsx
  - components/payment/payment-card.tsx
  - types/subscription.ts
  - lib/schemas/subscription.ts
  - app/api/subscriptions/route.ts
  - app/api/subscriptions/[id]/route.ts
  - hooks/use-subscriptions.ts
  - app/(app)/subscriptions/page.tsx
  - app/(app)/subscriptions/[id]/page.tsx
  - app/(app)/subscriptions/new/page.tsx
  - app/(app)/subscriptions/[id]/edit/page.tsx
  - components/subscription/subscription-form.tsx
  - components/subscription/subscription-card.tsx
  - types/upload.ts
  - lib/schemas/upload.ts
  - app/api/uploads/route.ts
  - app/api/uploads/[id]/route.ts
  - hooks/use-uploads.ts
  - app/(app)/uploads/page.tsx
  - app/(app)/uploads/[id]/page.tsx
  - app/(app)/uploads/new/page.tsx
  - app/(app)/uploads/[id]/edit/page.tsx
  - components/upload/upload-form.tsx
  - components/upload/upload-card.tsx
  - types/channel.ts
  - lib/schemas/channel.ts
  - app/api/channels/route.ts
  - app/api/channels/[id]/route.ts
  - hooks/use-channels.ts
  - app/(app)/channels/page.tsx
  - app/(app)/channels/[id]/page.tsx
  - app/(app)/channels/new/page.tsx
  - app/(app)/channels/[id]/edit/page.tsx
  - components/channel/channel-form.tsx
  - components/channel/channel-card.tsx
  - types/notification.ts
  - lib/schemas/notification.ts
  - app/api/notifications/route.ts
  - app/api/notifications/[id]/route.ts
  - hooks/use-notifications.ts
  - app/(app)/notifications/page.tsx
  - app/(app)/notifications/[id]/page.tsx
  - app/(app)/notifications/new/page.tsx
  - app/(app)/notifications/[id]/edit/page.tsx
  - components/notification/notification-form.tsx
  - components/notification/notification-card.tsx
  - types/conversation.ts
  - lib/schemas/conversation.ts
  - app/api/conversations/route.ts
  - app/api/conversations/[id]/route.ts
  - hooks/use-conversations.ts
  - app/(app)/conversations/page.tsx
  - app/(app)/conversations/[id]/page.tsx
  - app/(app)/conversations/new/page.tsx
  - app/(app)/conversations/[id]/edit/page.tsx
  - components/conversation/conversation-form.tsx
  - components/conversation/conversation-card.tsx
  - types/message.ts
  - lib/schemas/message.ts
  - app/api/messages/route.ts
  - app/api/messages/[id]/route.ts
  - hooks/use-messages.ts
  - app/(app)/messages/page.tsx
  - app/(app)/messages/[id]/page.tsx
  - app/(app)/messages/new/page.tsx
  - app/(app)/messages/[id]/edit/page.tsx
  - components/message/message-form.tsx
  - components/message/message-card.tsx
  - types/global-search-feature.ts
  - lib/schemas/global-search-feature.ts
  - app/api/global-search-features/route.ts
  - app/api/global-search-features/[id]/route.ts
  - hooks/use-global-search-features.ts
  - app/(app)/global-search-features/page.tsx
  - app/(app)/global-search-features/[id]/page.tsx
  - app/(app)/global-search-features/new/page.tsx
  - app/(app)/global-search-features/[id]/edit/page.tsx
  - components/global-search-feature/global-search-feature-form.tsx
  - components/global-search-feature/global-search-feature-card.tsx
  - types/safe-transactions.ts
  - lib/schemas/safe-transactions.ts
  - app/api/safe-transactions/route.ts
  - app/api/safe-transactions/[id]/route.ts
  - hooks/use-safe-transactions.ts
  - app/(app)/safe-transactions/page.tsx
  - app/(app)/safe-transactions/[id]/page.tsx
  - app/(app)/safe-transactions/new/page.tsx
  - app/(app)/safe-transactions/[id]/edit/page.tsx
  - components/safe-transactions/safe-transactions-form.tsx
  - components/safe-transactions/safe-transactions-card.tsx
  - types/own-shop-system.ts
  - lib/schemas/own-shop-system.ts
  - app/api/own-shop-systems/route.ts
  - app/api/own-shop-systems/[id]/route.ts
  - hooks/use-own-shop-systems.ts
  - app/(app)/own-shop-systems/page.tsx
  - app/(app)/own-shop-systems/[id]/page.tsx
  - app/(app)/own-shop-systems/new/page.tsx
  - app/(app)/own-shop-systems/[id]/edit/page.tsx
  - components/own-shop-system/own-shop-system-form.tsx
  - components/own-shop-system/own-shop-system-card.tsx
  - types/set-your-own-prices.ts
  - lib/schemas/set-your-own-prices.ts
  - app/api/set-your-own-prices/route.ts
  - app/api/set-your-own-prices/[id]/route.ts
  - hooks/use-set-your-own-prices.ts
  - app/(app)/set-your-own-prices/page.tsx
  - app/(app)/set-your-own-prices/[id]/page.tsx
  - app/(app)/set-your-own-prices/new/page.tsx
  - app/(app)/set-your-own-prices/[id]/edit/page.tsx
  - components/set-your-own-prices/set-your-own-prices-form.tsx
  - components/set-your-own-prices/set-your-own-prices-card.tsx
  - types/no-transaction-fees.ts
  - lib/schemas/no-transaction-fees.ts
  - app/api/no-transaction-fees/route.ts
  - app/api/no-transaction-fees/[id]/route.ts
  - hooks/use-no-transaction-fees.ts
  - app/(app)/no-transaction-fees/page.tsx
  - app/(app)/no-transaction-fees/[id]/page.tsx
  - app/(app)/no-transaction-fees/new/page.tsx
  - app/(app)/no-transaction-fees/[id]/edit/page.tsx
  - components/no-transaction-fees/no-transaction-fees-form.tsx
  - components/no-transaction-fees/no-transaction-fees-card.tsx
  - types/messages-and-chat-system.ts
  - lib/schemas/messages-and-chat-system.ts
  - app/api/messages-and-chat-systems/route.ts
  - app/api/messages-and-chat-systems/[id]/route.ts
  - hooks/use-messages-and-chat-systems.ts
  - app/(app)/messages-and-chat-systems/page.tsx
  - app/(app)/messages-and-chat-systems/[id]/page.tsx
  - app/(app)/messages-and-chat-systems/new/page.tsx
  - app/(app)/messages-and-chat-systems/[id]/edit/page.tsx
  - components/messages-and-chat-system/messages-and-chat-system-form.tsx
  - components/messages-and-chat-system/messages-and-chat-system-card.tsx
  - types/classified-ad-market.ts
  - lib/schemas/classified-ad-market.ts
  - app/api/classified-ad-markets/route.ts
  - app/api/classified-ad-markets/[id]/route.ts
  - hooks/use-classified-ad-markets.ts
  - app/(app)/classified-ad-markets/page.tsx
  - app/(app)/classified-ad-markets/[id]/page.tsx
  - app/(app)/classified-ad-markets/new/page.tsx
  - app/(app)/classified-ad-markets/[id]/edit/page.tsx
  - components/classified-ad-market/classified-ad-market-form.tsx
  - components/classified-ad-market/classified-ad-market-card.tsx
  - types/member-reviews.ts
  - lib/schemas/member-reviews.ts
  - app/api/member-reviews/route.ts
  - app/api/member-reviews/[id]/route.ts
  - hooks/use-member-reviews.ts
  - app/(app)/member-reviews/page.tsx
  - app/(app)/member-reviews/[id]/page.tsx
  - app/(app)/member-reviews/new/page.tsx
  - app/(app)/member-reviews/[id]/edit/page.tsx
  - components/member-reviews/member-reviews-form.tsx
  - components/member-reviews/member-reviews-card.tsx
  - types/privacy-functions.ts
  - lib/schemas/privacy-functions.ts
  - app/api/privacy-functions/route.ts
  - app/api/privacy-functions/[id]/route.ts
  - hooks/use-privacy-functions.ts
  - app/(app)/privacy-functions/page.tsx
  - app/(app)/privacy-functions/[id]/page.tsx
  - app/(app)/privacy-functions/new/page.tsx
  - app/(app)/privacy-functions/[id]/edit/page.tsx
  - components/privacy-functions/privacy-functions-form.tsx
  - components/privacy-functions/privacy-functions-card.tsx
  - types/media-cloud.ts
  - lib/schemas/media-cloud.ts
  - app/api/media-clouds/route.ts
  - app/api/media-clouds/[id]/route.ts
  - hooks/use-media-clouds.ts
  - app/(app)/media-clouds/page.tsx
  - app/(app)/media-clouds/[id]/page.tsx
  - app/(app)/media-clouds/new/page.tsx
  - app/(app)/media-clouds/[id]/edit/page.tsx
  - components/media-cloud/media-cloud-form.tsx
  - components/media-cloud/media-cloud-card.tsx
  - types/user-blocking-system.ts
  - lib/schemas/user-blocking-system.ts
  - app/api/user-blocking-systems/route.ts
  - app/api/user-blocking-systems/[id]/route.ts
  - hooks/use-user-blocking-systems.ts
  - app/(app)/user-blocking-systems/page.tsx
  - app/(app)/user-blocking-systems/[id]/page.tsx
  - app/(app)/user-blocking-systems/new/page.tsx
  - app/(app)/user-blocking-systems/[id]/edit/page.tsx
  - components/user-blocking-system/user-blocking-system-form.tsx
  - components/user-blocking-system/user-blocking-system-card.tsx
  - types/human-operated-fake-check.ts
  - lib/schemas/human-operated-fake-check.ts
  - app/api/human-operated-fake-checks/route.ts
  - app/api/human-operated-fake-checks/[id]/route.ts
  - hooks/use-human-operated-fake-checks.ts
  - app/(app)/human-operated-fake-checks/page.tsx
  - app/(app)/human-operated-fake-checks/[id]/page.tsx
  - app/(app)/human-operated-fake-checks/new/page.tsx
  - app/(app)/human-operated-fake-checks/[id]/edit/page.tsx
  - components/human-operated-fake-check/human-operated-fake-check-form.tsx
  - components/human-operated-fake-check/human-operated-fake-check-card.tsx
  - types/member-reviews-and-ratings.ts
  - lib/schemas/member-reviews-and-ratings.ts
  - app/api/member-reviews-and-ratings/route.ts
  - app/api/member-reviews-and-ratings/[id]/route.ts
  - hooks/use-member-reviews-and-ratings.ts
  - app/(app)/member-reviews-and-ratings/page.tsx
  - app/(app)/member-reviews-and-ratings/[id]/page.tsx
  - app/(app)/member-reviews-and-ratings/new/page.tsx
  - app/(app)/member-reviews-and-ratings/[id]/edit/page.tsx
  - components/member-reviews-and-ratings/member-reviews-and-ratings-form.tsx
  - components/member-reviews-and-ratings/member-reviews-and-ratings-card.tsx
  - types/full-featured-profiles.ts
  - lib/schemas/full-featured-profiles.ts
  - app/api/full-featured-profiles/route.ts
  - app/api/full-featured-profiles/[id]/route.ts
  - hooks/use-full-featured-profiles.ts
  - app/(app)/full-featured-profiles/page.tsx
  - app/(app)/full-featured-profiles/[id]/page.tsx
  - app/(app)/full-featured-profiles/new/page.tsx
  - app/(app)/full-featured-profiles/[id]/edit/page.tsx
  - components/full-featured-profiles/full-featured-profiles-form.tsx
  - components/full-featured-profiles/full-featured-profiles-card.tsx
  - types/seller-ratings-and-buyer-reviews.ts
  - lib/schemas/seller-ratings-and-buyer-reviews.ts
  - app/api/seller-ratings-and-buyer-reviews/route.ts
  - app/api/seller-ratings-and-buyer-reviews/[id]/route.ts
  - hooks/use-seller-ratings-and-buyer-reviews.ts
  - app/(app)/seller-ratings-and-buyer-reviews/page.tsx
  - app/(app)/seller-ratings-and-buyer-reviews/[id]/page.tsx
  - app/(app)/seller-ratings-and-buyer-reviews/new/page.tsx
  - app/(app)/seller-ratings-and-buyer-reviews/[id]/edit/page.tsx
  - components/seller-ratings-and-buyer-reviews/seller-ratings-and-buyer-reviews-form.tsx
  - components/seller-ratings-and-buyer-reviews/seller-ratings-and-buyer-reviews-card.tsx
  - types/user-ranking-list.ts
  - lib/schemas/user-ranking-list.ts
  - app/api/user-ranking-lists/route.ts
  - app/api/user-ranking-lists/[id]/route.ts
  - hooks/use-user-ranking-lists.ts
  - app/(app)/user-ranking-lists/page.tsx
  - app/(app)/user-ranking-lists/[id]/page.tsx
  - app/(app)/user-ranking-lists/new/page.tsx
  - app/(app)/user-ranking-lists/[id]/edit/page.tsx
  - components/user-ranking-list/user-ranking-list-form.tsx
  - components/user-ranking-list/user-ranking-list-card.tsx
  - types/friends-and-fans-system.ts
  - lib/schemas/friends-and-fans-system.ts
  - app/api/friends-and-fans-systems/route.ts
  - app/api/friends-and-fans-systems/[id]/route.ts
  - hooks/use-friends-and-fans-systems.ts
  - app/(app)/friends-and-fans-systems/page.tsx
  - app/(app)/friends-and-fans-systems/[id]/page.tsx
  - app/(app)/friends-and-fans-systems/new/page.tsx
  - app/(app)/friends-and-fans-systems/[id]/edit/page.tsx
  - components/friends-and-fans-system/friends-and-fans-system-form.tsx
  - components/friends-and-fans-system/friends-and-fans-system-card.tsx
  - types/custom-video-clips.ts
  - lib/schemas/custom-video-clips.ts
  - app/api/custom-video-clips/route.ts
  - app/api/custom-video-clips/[id]/route.ts
  - hooks/use-custom-video-clips.ts
  - app/(app)/custom-video-clips/page.tsx
  - app/(app)/custom-video-clips/[id]/page.tsx
  - app/(app)/custom-video-clips/new/page.tsx
  - app/(app)/custom-video-clips/[id]/edit/page.tsx
  - components/custom-video-clips/custom-video-clips-form.tsx
  - components/custom-video-clips/custom-video-clips-card.tsx
  - types/private-photosets.ts
  - lib/schemas/private-photosets.ts
  - app/api/private-photosets/route.ts
  - app/api/private-photosets/[id]/route.ts
  - hooks/use-private-photosets.ts
  - app/(app)/private-photosets/page.tsx
  - app/(app)/private-photosets/[id]/page.tsx
  - app/(app)/private-photosets/new/page.tsx
  - app/(app)/private-photosets/[id]/edit/page.tsx
  - components/private-photosets/private-photosets-form.tsx
  - components/private-photosets/private-photosets-card.tsx
  - types/whatsapp-and-skype-chats.ts
  - lib/schemas/whatsapp-and-skype-chats.ts
  - app/api/whatsapp-and-skype-chats/route.ts
  - app/api/whatsapp-and-skype-chats/[id]/route.ts
  - hooks/use-whatsapp-and-skype-chats.ts
  - app/(app)/whatsapp-and-skype-chats/page.tsx
  - app/(app)/whatsapp-and-skype-chats/[id]/page.tsx
  - app/(app)/whatsapp-and-skype-chats/new/page.tsx
  - app/(app)/whatsapp-and-skype-chats/[id]/edit/page.tsx
  - components/whatsapp-and-skype-chats/whatsapp-and-skype-chats-form.tsx
  - components/whatsapp-and-skype-chats/whatsapp-and-skype-chats-card.tsx

### Feature Implementation Instructions

**CRITICAL: For each missing feature, READ its docs/features/ file and implement ALL tasks.**
Do NOT skip features. They are part of the MVP because they were explicitly enabled.

### Feature Fix 1: Payments (Stripe)
**Payments:** Read `docs/features/payments.md` and implement ALL tasks (P.1-P.8). Minimum:
  1. Create `lib/stripe.ts` — Stripe client + helper functions
  2. Create `app/api/stripe/checkout/route.ts` — Checkout session creation
  3. Create `app/api/stripe/webhook/route.ts` — Webhook handler (checkout.session.completed, subscription events)
  4. Create checkout button component
  5. Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to `.env.example`
  6. Add stripe_customer_id, subscription_status columns to profiles in schema.sql (if not already present)

### Feature Fix 2: File Storage / Uploads
**File Uploads:** Read `docs/features/uploads.md` and implement:
  1. Create `components/ui/image-upload.tsx` — drag-drop upload with preview
  2. Create upload API route or use Supabase Storage direct upload
  3. Add file type + size validation
  4. Integrate upload component into entity forms that need images

### Feature Fix 3: Realtime
**Realtime:** Read `docs/features/realtime.md` and implement:
  1. Create `hooks/use-realtime.ts` — Supabase realtime subscription hook
  2. Integrate into entity hooks for live updates
  3. Enable realtime on relevant tables in Supabase

### Feature Fix 4: Notifications
**Notifications:** Read `docs/features/notifications.md` and implement:
  1. Create notifications table in schema.sql
  2. Create notification API routes (GET list, POST create, PATCH mark-read)
  3. Create notification bell + dropdown component
  4. Add to app layout header

### Feature Fix 5: Full-Text Search
**Search:** Read `docs/features/search.md` and implement:
  1. Full-text search API endpoint
  2. Search UI component with results
  3. Add GIN indexes to schema.sql for searchable fields

### Feature Fix 6: Direct Messaging
**Messaging:** Read `docs/features/messaging.md` and implement:
  1. Conversations + messages tables in schema.sql
  2. API routes for conversations (list, create) and messages (list, send)
  3. Conversation list page + message thread page
  4. Real-time subscription for new messages

### Feature Fix 7: Reviews & Ratings
**Reviews:** Read `docs/features/reviews.md` and implement:
  1. Reviews table in schema.sql (rating 1-5, title, body, entity_type, entity_id)
  2. Review CRUD API routes
  3. Star rating + review form components
  4. Average rating display on entity detail pages

### Feature Fix 8: Global Search Feature
**Global Search Feature:** Read `docs/features/global-search-feature.md` and implement ALL tasks listed there.

### Feature Fix 9: Auth
**Auth:** Read `docs/features/auth.md` and implement ALL tasks listed there.

### Feature Fix 10: Safe Transactions
**Safe Transactions:** Read `docs/features/safe-transactions.md` and implement ALL tasks listed there.

### Feature Fix 11: Own Shop System
**Own Shop System:** Read `docs/features/own-shop-system.md` and implement ALL tasks listed there.

### Feature Fix 12: Set Your Own Prices
**Set Your Own Prices:** Read `docs/features/set-your-own-prices.md` and implement ALL tasks listed there.

### Feature Fix 13: No Transaction Fees
**No Transaction Fees:** Read `docs/features/no-transaction-fees.md` and implement ALL tasks listed there.

### Feature Fix 14: Messages And Chat System
**Messages And Chat System:** Read `docs/features/messages-and-chat-system.md` and implement ALL tasks listed there.

### Feature Fix 15: Classified Ad Market
**Classified Ad Market:** Read `docs/features/classified-ad-market.md` and implement ALL tasks listed there.

### Feature Fix 16: Member Reviews
**Member Reviews:** Read `docs/features/member-reviews.md` and implement ALL tasks listed there.

### Feature Fix 17: Privacy Functions
**Privacy Functions:** Read `docs/features/privacy-functions.md` and implement ALL tasks listed there.

### Feature Fix 18: Media Cloud
**Media Cloud:** Read `docs/features/media-cloud.md` and implement ALL tasks listed there.

### Feature Fix 19: User Blocking System
**User Blocking System:** Read `docs/features/user-blocking-system.md` and implement ALL tasks listed there.

### Feature Fix 20: Human Operated Fake Check
**Human Operated Fake Check:** Read `docs/features/human-operated-fake-check.md` and implement ALL tasks listed there.

### Feature Fix 21: Member Reviews And Ratings
**Member Reviews And Ratings:** Read `docs/features/member-reviews-and-ratings.md` and implement ALL tasks listed there.

### Feature Fix 22: Full Featured Profiles
**Full Featured Profiles:** Read `docs/features/full-featured-profiles.md` and implement ALL tasks listed there.

### Feature Fix 23: Seller Ratings And Buyer Reviews
**Seller Ratings And Buyer Reviews:** Read `docs/features/seller-ratings-and-buyer-reviews.md` and implement ALL tasks listed there.

### Feature Fix 24: User Ranking List
**User Ranking List:** Read `docs/features/user-ranking-list.md` and implement ALL tasks listed there.

### Feature Fix 25: Friends And Fans System
**Friends And Fans System:** Read `docs/features/friends-and-fans-system.md` and implement ALL tasks listed there.

### Feature Fix 26: Custom Video Clips
**Custom Video Clips:** Read `docs/features/custom-video-clips.md` and implement ALL tasks listed there.

### Feature Fix 27: Private Photosets
**Private Photosets:** Read `docs/features/private-photosets.md` and implement ALL tasks listed there.

### Feature Fix 28: Whatsapp And Skype Chats
**Whatsapp And Skype Chats:** Read `docs/features/whatsapp-and-skype-chats.md` and implement ALL tasks listed there.

### Navigation Fix

**Every entity MUST appear in the sidebar/navigation.** If an entity has pages but no nav link, users cannot discover it.

Open `components/layout/sidebar.tsx` (or equivalent navigation component) and add links for ALL entities:
- User → /users
- Listing → /listings
- Review → /reviews
- Shop → /shops
- Order → /orders
- Payment → /payments
- Subscription → /subscriptions
- Upload → /uploads
- Channel → /channels
- Notification → /notifications
- Conversation → /conversations
- Message → /messages
- GlobalSearchFeature → /global-search-features
- SafeTransactions → /safe-transactions
- OwnShopSystem → /own-shop-systems
- SetYourOwnPrices → /set-your-own-prices
- NoTransactionFees → /no-transaction-fees
- MessagesAndChatSystem → /messages-and-chat-systems
- ClassifiedAdMarket → /classified-ad-markets
- MemberReviews → /member-reviews
- PrivacyFunctions → /privacy-functions
- MediaCloud → /media-clouds
- UserBlockingSystem → /user-blocking-systems
- HumanOperatedFakeCheck → /human-operated-fake-checks
- MemberReviewsAndRatings → /member-reviews-and-ratings
- FullFeaturedProfiles → /full-featured-profiles
- SellerRatingsAndBuyerReviews → /seller-ratings-and-buyer-reviews
- UserRankingList → /user-ranking-lists
- FriendsAndFansSystem → /friends-and-fans-systems
- CustomVideoClips → /custom-video-clips
- PrivatePhotosets → /private-photosets
- WhatsappAndSkypeChats → /whatsapp-and-skype-chats

Use the same icon style and link pattern as existing nav items.

### Schema-Code Consistency Fix

If an entity table is missing from schema.sql:
1. Open `schema.sql` and add the `CREATE TABLE` statement with ALL fields from the entity's TypeScript type
2. Include: `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`
3. Add foreign keys (e.g. `user_id uuid not null references auth.users(id) on delete cascade`)
4. Add RLS policies for the new table
5. Ensure the TypeScript type in `types/` matches the schema columns
6. Ensure the Zod schema in `lib/schemas/` validates the same fields

### Password Reset Fix

If forgot-password or reset-password pages are missing, read `docs/phases/15b-password-reset.md` and implement:
1. `app/(auth)/forgot-password/page.tsx` — email form → supabase.auth.resetPasswordForEmail()
2. `app/(auth)/reset-password/page.tsx` — new password form → supabase.auth.updateUser()
3. Add "Forgot your password?" link to login page
4. Add /forgot-password and /reset-password to middleware public routes

### TypeScript Error Priority
1. **Cannot find module** → Missing import or missing file. Create the file or fix the import path.
2. **Property does not exist** → Wrong type or missing field. Fix the interface/type.
3. **Type 'X' is not assignable** → Fix the type mismatch.
4. **Missing return** → Add return statement.

### Build Error Priority
- `"use client"` or `"use server"` directive missing → add it
- Missing `generateStaticParams` for dynamic routes → add it
- Server/client boundary violations → move logic to correct side

---

## Step 3: Verify

After fixing ALL items, run verification:

```bash
echo "═══════════════════════════════════════"
echo "  VERIFICATION — Iteration [N]"
echo "═══════════════════════════════════════"
TSC_ERRORS=$(npx tsc --noEmit 2>&1 | grep "error TS" | wc -l | tr -d ' ')
echo "TypeScript errors: $TSC_ERRORS"

BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_OK=$?
[ $BUILD_OK -eq 0 ] && echo "Build: ✅ PASS" || echo "Build: ❌ FAIL"

echo "═══════════════════════════════════════"
```

---

## Step 4: Loop Decision

**Re-run the FULL inventory from Step 1.** Count ❌ items again.

- If **ZERO ❌ items** AND `tsc` passes AND `build` succeeds → **EXIT LOOP** ✅
- If **any ❌ items remain** AND iteration < 5 → **GO BACK TO STEP 2** 🔄
- If iteration 5 and items remain → **EXIT with detailed report** ⚠️

**DO NOT EXIT EARLY.** The loop exists because one pass is never enough.

---

## Step 5: Completion Report

When the loop exits, create `MVP_STATUS.md`:

```markdown
# MVP Status Report — PantyHub

## Result: ✅ COMPLETE / ⚠️ PARTIAL

### Loop Iterations: X/5
### TypeScript Errors: 0
### Build Status: PASS

### Entity Completeness
- User: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Listing: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Review: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Shop: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Order: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Payment: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Subscription: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Upload: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Channel: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Notification: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Conversation: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- Message: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- GlobalSearchFeature: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- SafeTransactions: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- OwnShopSystem: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- SetYourOwnPrices: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- NoTransactionFees: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- MessagesAndChatSystem: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- ClassifiedAdMarket: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- MemberReviews: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- PrivacyFunctions: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- MediaCloud: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- UserBlockingSystem: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- HumanOperatedFakeCheck: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- MemberReviewsAndRatings: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- FullFeaturedProfiles: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- SellerRatingsAndBuyerReviews: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- UserRankingList: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- FriendsAndFansSystem: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- CustomVideoClips: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- PrivatePhotosets: ✅ / ❌ (types, schema, API, hooks, pages, form, card)
- WhatsappAndSkypeChats: ✅ / ❌ (types, schema, API, hooks, pages, form, card)

### Feature Completeness
- Payments (Stripe): ✅ / ❌
- File Storage / Uploads: ✅ / ❌
- Realtime: ✅ / ❌
- Notifications: ✅ / ❌
- Full-Text Search: ✅ / ❌
- Direct Messaging: ✅ / ❌
- Reviews & Ratings: ✅ / ❌
- Global Search Feature: ✅ / ❌
- Auth: ✅ / ❌
- Safe Transactions: ✅ / ❌
- Own Shop System: ✅ / ❌
- Set Your Own Prices: ✅ / ❌
- No Transaction Fees: ✅ / ❌
- Messages And Chat System: ✅ / ❌
- Classified Ad Market: ✅ / ❌
- Member Reviews: ✅ / ❌
- Privacy Functions: ✅ / ❌
- Media Cloud: ✅ / ❌
- User Blocking System: ✅ / ❌
- Human Operated Fake Check: ✅ / ❌
- Member Reviews And Ratings: ✅ / ❌
- Full Featured Profiles: ✅ / ❌
- Seller Ratings And Buyer Reviews: ✅ / ❌
- User Ranking List: ✅ / ❌
- Friends And Fans System: ✅ / ❌
- Custom Video Clips: ✅ / ❌
- Private Photosets: ✅ / ❌
- Whatsapp And Skype Chats: ✅ / ❌

### Navigation
- All entities in sidebar: ✅ / ❌

### What Was Fixed Per Iteration
- Iteration 1: [files created/fixed]
- Iteration 2: [files created/fixed]
- ...

### Remaining Issues (if any)
- [only if iteration 5 and still issues — list exactly what's missing]
```

---

## MVP Definition for PantyHub

These are the MINIMUM requirements. **Nothing here is optional.** Every ❌ blocks exit.

### Core Infrastructure
- `middleware.ts`
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`
- `.env.example` (with ALL required env vars)
- `schema.sql` (with ALL entity + feature tables)

### Pages
- Landing page (`/`)
- Login (`/login`)
- Signup (`/signup`)
- Forgot Password (`/forgot-password`)
- Reset Password (`/reset-password`)
- Dashboard (`/dashboard`)
- Settings (`/settings`)
- 404 (`not-found.tsx`)
- User list (`/users`)
- User detail (`/users/[id]`)
- User create (`/users/new`)
- User edit (`/users/[id]/edit`)
- Listing list (`/listings`)
- Listing detail (`/listings/[id]`)
- Listing create (`/listings/new`)
- Listing edit (`/listings/[id]/edit`)
- Review list (`/reviews`)
- Review detail (`/reviews/[id]`)
- Review create (`/reviews/new`)
- Review edit (`/reviews/[id]/edit`)
- Shop list (`/shops`)
- Shop detail (`/shops/[id]`)
- Shop create (`/shops/new`)
- Shop edit (`/shops/[id]/edit`)
- Order list (`/orders`)
- Order detail (`/orders/[id]`)
- Order create (`/orders/new`)
- Order edit (`/orders/[id]/edit`)
- Payment list (`/payments`)
- Payment detail (`/payments/[id]`)
- Payment create (`/payments/new`)
- Payment edit (`/payments/[id]/edit`)
- Subscription list (`/subscriptions`)
- Subscription detail (`/subscriptions/[id]`)
- Subscription create (`/subscriptions/new`)
- Subscription edit (`/subscriptions/[id]/edit`)
- Upload list (`/uploads`)
- Upload detail (`/uploads/[id]`)
- Upload create (`/uploads/new`)
- Upload edit (`/uploads/[id]/edit`)
- Channel list (`/channels`)
- Channel detail (`/channels/[id]`)
- Channel create (`/channels/new`)
- Channel edit (`/channels/[id]/edit`)
- Notification list (`/notifications`)
- Notification detail (`/notifications/[id]`)
- Notification create (`/notifications/new`)
- Notification edit (`/notifications/[id]/edit`)
- Conversation list (`/conversations`)
- Conversation detail (`/conversations/[id]`)
- Conversation create (`/conversations/new`)
- Conversation edit (`/conversations/[id]/edit`)
- Message list (`/messages`)
- Message detail (`/messages/[id]`)
- Message create (`/messages/new`)
- Message edit (`/messages/[id]/edit`)
- GlobalSearchFeature list (`/global-search-features`)
- GlobalSearchFeature detail (`/global-search-features/[id]`)
- GlobalSearchFeature create (`/global-search-features/new`)
- GlobalSearchFeature edit (`/global-search-features/[id]/edit`)
- SafeTransactions list (`/safe-transactions`)
- SafeTransactions detail (`/safe-transactions/[id]`)
- SafeTransactions create (`/safe-transactions/new`)
- SafeTransactions edit (`/safe-transactions/[id]/edit`)
- OwnShopSystem list (`/own-shop-systems`)
- OwnShopSystem detail (`/own-shop-systems/[id]`)
- OwnShopSystem create (`/own-shop-systems/new`)
- OwnShopSystem edit (`/own-shop-systems/[id]/edit`)
- SetYourOwnPrices list (`/set-your-own-prices`)
- SetYourOwnPrices detail (`/set-your-own-prices/[id]`)
- SetYourOwnPrices create (`/set-your-own-prices/new`)
- SetYourOwnPrices edit (`/set-your-own-prices/[id]/edit`)
- NoTransactionFees list (`/no-transaction-fees`)
- NoTransactionFees detail (`/no-transaction-fees/[id]`)
- NoTransactionFees create (`/no-transaction-fees/new`)
- NoTransactionFees edit (`/no-transaction-fees/[id]/edit`)
- MessagesAndChatSystem list (`/messages-and-chat-systems`)
- MessagesAndChatSystem detail (`/messages-and-chat-systems/[id]`)
- MessagesAndChatSystem create (`/messages-and-chat-systems/new`)
- MessagesAndChatSystem edit (`/messages-and-chat-systems/[id]/edit`)
- ClassifiedAdMarket list (`/classified-ad-markets`)
- ClassifiedAdMarket detail (`/classified-ad-markets/[id]`)
- ClassifiedAdMarket create (`/classified-ad-markets/new`)
- ClassifiedAdMarket edit (`/classified-ad-markets/[id]/edit`)
- MemberReviews list (`/member-reviews`)
- MemberReviews detail (`/member-reviews/[id]`)
- MemberReviews create (`/member-reviews/new`)
- MemberReviews edit (`/member-reviews/[id]/edit`)
- PrivacyFunctions list (`/privacy-functions`)
- PrivacyFunctions detail (`/privacy-functions/[id]`)
- PrivacyFunctions create (`/privacy-functions/new`)
- PrivacyFunctions edit (`/privacy-functions/[id]/edit`)
- MediaCloud list (`/media-clouds`)
- MediaCloud detail (`/media-clouds/[id]`)
- MediaCloud create (`/media-clouds/new`)
- MediaCloud edit (`/media-clouds/[id]/edit`)
- UserBlockingSystem list (`/user-blocking-systems`)
- UserBlockingSystem detail (`/user-blocking-systems/[id]`)
- UserBlockingSystem create (`/user-blocking-systems/new`)
- UserBlockingSystem edit (`/user-blocking-systems/[id]/edit`)
- HumanOperatedFakeCheck list (`/human-operated-fake-checks`)
- HumanOperatedFakeCheck detail (`/human-operated-fake-checks/[id]`)
- HumanOperatedFakeCheck create (`/human-operated-fake-checks/new`)
- HumanOperatedFakeCheck edit (`/human-operated-fake-checks/[id]/edit`)
- MemberReviewsAndRatings list (`/member-reviews-and-ratings`)
- MemberReviewsAndRatings detail (`/member-reviews-and-ratings/[id]`)
- MemberReviewsAndRatings create (`/member-reviews-and-ratings/new`)
- MemberReviewsAndRatings edit (`/member-reviews-and-ratings/[id]/edit`)
- FullFeaturedProfiles list (`/full-featured-profiles`)
- FullFeaturedProfiles detail (`/full-featured-profiles/[id]`)
- FullFeaturedProfiles create (`/full-featured-profiles/new`)
- FullFeaturedProfiles edit (`/full-featured-profiles/[id]/edit`)
- SellerRatingsAndBuyerReviews list (`/seller-ratings-and-buyer-reviews`)
- SellerRatingsAndBuyerReviews detail (`/seller-ratings-and-buyer-reviews/[id]`)
- SellerRatingsAndBuyerReviews create (`/seller-ratings-and-buyer-reviews/new`)
- SellerRatingsAndBuyerReviews edit (`/seller-ratings-and-buyer-reviews/[id]/edit`)
- UserRankingList list (`/user-ranking-lists`)
- UserRankingList detail (`/user-ranking-lists/[id]`)
- UserRankingList create (`/user-ranking-lists/new`)
- UserRankingList edit (`/user-ranking-lists/[id]/edit`)
- FriendsAndFansSystem list (`/friends-and-fans-systems`)
- FriendsAndFansSystem detail (`/friends-and-fans-systems/[id]`)
- FriendsAndFansSystem create (`/friends-and-fans-systems/new`)
- FriendsAndFansSystem edit (`/friends-and-fans-systems/[id]/edit`)
- CustomVideoClips list (`/custom-video-clips`)
- CustomVideoClips detail (`/custom-video-clips/[id]`)
- CustomVideoClips create (`/custom-video-clips/new`)
- CustomVideoClips edit (`/custom-video-clips/[id]/edit`)
- PrivatePhotosets list (`/private-photosets`)
- PrivatePhotosets detail (`/private-photosets/[id]`)
- PrivatePhotosets create (`/private-photosets/new`)
- PrivatePhotosets edit (`/private-photosets/[id]/edit`)
- WhatsappAndSkypeChats list (`/whatsapp-and-skype-chats`)
- WhatsappAndSkypeChats detail (`/whatsapp-and-skype-chats/[id]`)
- WhatsappAndSkypeChats create (`/whatsapp-and-skype-chats/new`)
- WhatsappAndSkypeChats edit (`/whatsapp-and-skype-chats/[id]/edit`)

### Per Entity: User, Listing, Review, Shop, Order, Payment, Subscription, Upload, Channel, Notification, Conversation, Message, GlobalSearchFeature, SafeTransactions, OwnShopSystem, SetYourOwnPrices, NoTransactionFees, MessagesAndChatSystem, ClassifiedAdMarket, MemberReviews, PrivacyFunctions, MediaCloud, UserBlockingSystem, HumanOperatedFakeCheck, MemberReviewsAndRatings, FullFeaturedProfiles, SellerRatingsAndBuyerReviews, UserRankingList, FriendsAndFansSystem, CustomVideoClips, PrivatePhotosets, WhatsappAndSkypeChats
- TypeScript types
- Zod validation schema
- List + Detail API routes
- SWR/fetch hooks
- List, Detail, Create, Edit pages
- Form + Card components

### Enabled Features (MANDATORY — not optional)
- **Payments (Stripe)**: lib/stripe.ts OR lib/stripe/client.ts OR lib/payments.ts, lib/stripe/config.ts OR stripe config in lib/stripe.ts, app/api/stripe/checkout/route.ts OR app/api/webhooks/stripe/route.ts, app/api/stripe/webhook/route.ts OR app/api/webhooks/stripe/route.ts, components/payments/checkout-button.tsx OR components/checkout-button.tsx, app/(app)/pricing/page.tsx OR components/pricing
- **File Storage / Uploads**: components/ui/image-upload.tsx OR components/upload, app/api/upload/route.ts OR upload logic in entity APIs
- **Realtime**: hooks/use-realtime.ts OR realtime subscriptions in entity hooks
- **Notifications**: app/api/notifications/route.ts OR notification logic, components/notifications OR notification UI
- **Full-Text Search**: app/api/search/route.ts OR search logic, components/search OR search UI
- **Direct Messaging**: app/api/conversations/route.ts OR app/api/messages/route.ts, Message thread page or component
- **Reviews & Ratings**: app/api/reviews/route.ts OR review API logic, Star rating component
- **Global Search Feature**: Global Search Feature pages + API routes
- **Auth**: Auth pages + API routes
- **Safe Transactions**: Safe Transactions pages + API routes
- **Own Shop System**: Own Shop System pages + API routes
- **Set Your Own Prices**: Set Your Own Prices pages + API routes
- **No Transaction Fees**: No Transaction Fees pages + API routes
- **Messages And Chat System**: Messages And Chat System pages + API routes
- **Classified Ad Market**: Classified Ad Market pages + API routes
- **Member Reviews**: Member Reviews pages + API routes
- **Privacy Functions**: Privacy Functions pages + API routes
- **Media Cloud**: Media Cloud pages + API routes
- **User Blocking System**: User Blocking System pages + API routes
- **Human Operated Fake Check**: Human Operated Fake Check pages + API routes
- **Member Reviews And Ratings**: Member Reviews And Ratings pages + API routes
- **Full Featured Profiles**: Full Featured Profiles pages + API routes
- **Seller Ratings And Buyer Reviews**: Seller Ratings And Buyer Reviews pages + API routes
- **User Ranking List**: User Ranking List pages + API routes
- **Friends And Fans System**: Friends And Fans System pages + API routes
- **Custom Video Clips**: Custom Video Clips pages + API routes
- **Private Photosets**: Private Photosets pages + API routes
- **Whatsapp And Skype Chats**: Whatsapp And Skype Chats pages + API routes

### Navigation
- ALL entities must have links in the sidebar/navigation component

---

## Validation

This phase is done ONLY when ALL of these are true:
- [ ] `npx tsc --noEmit` returns 0 errors
- [ ] `npm run build` succeeds
- [ ] ALL entity files exist (32 entities × 11 files)
- [ ] ALL core pages exist (landing, login, signup, forgot-password, reset-password, dashboard, settings, 404)
- [ ] ALL infrastructure files exist (middleware, Supabase clients, env, schema)
- [ ] Payments (Stripe) is fully implemented (all critical files exist + functional)
- [ ] File Storage / Uploads is fully implemented (all critical files exist + functional)
- [ ] Realtime is fully implemented (all critical files exist + functional)
- [ ] Notifications is fully implemented (all critical files exist + functional)
- [ ] Full-Text Search is fully implemented (all critical files exist + functional)
- [ ] Direct Messaging is fully implemented (all critical files exist + functional)
- [ ] Reviews & Ratings is fully implemented (all critical files exist + functional)
- [ ] Global Search Feature is fully implemented (all critical files exist + functional)
- [ ] Auth is fully implemented (all critical files exist + functional)
- [ ] Safe Transactions is fully implemented (all critical files exist + functional)
- [ ] Own Shop System is fully implemented (all critical files exist + functional)
- [ ] Set Your Own Prices is fully implemented (all critical files exist + functional)
- [ ] No Transaction Fees is fully implemented (all critical files exist + functional)
- [ ] Messages And Chat System is fully implemented (all critical files exist + functional)
- [ ] Classified Ad Market is fully implemented (all critical files exist + functional)
- [ ] Member Reviews is fully implemented (all critical files exist + functional)
- [ ] Privacy Functions is fully implemented (all critical files exist + functional)
- [ ] Media Cloud is fully implemented (all critical files exist + functional)
- [ ] User Blocking System is fully implemented (all critical files exist + functional)
- [ ] Human Operated Fake Check is fully implemented (all critical files exist + functional)
- [ ] Member Reviews And Ratings is fully implemented (all critical files exist + functional)
- [ ] Full Featured Profiles is fully implemented (all critical files exist + functional)
- [ ] Seller Ratings And Buyer Reviews is fully implemented (all critical files exist + functional)
- [ ] User Ranking List is fully implemented (all critical files exist + functional)
- [ ] Friends And Fans System is fully implemented (all critical files exist + functional)
- [ ] Custom Video Clips is fully implemented (all critical files exist + functional)
- [ ] Private Photosets is fully implemented (all critical files exist + functional)
- [ ] Whatsapp And Skype Chats is fully implemented (all critical files exist + functional)
- [ ] ALL entities appear in the sidebar/navigation
- [ ] MVP_STATUS.md has been created with "COMPLETE" status

**After this phase: proceed to Phase 43 (Premium UI Loop)**

---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 11: 42b - Design Polish & Premium Quality Pass

> Source: `docs/phases/42b-design-polish.md`

# 42b - Design Polish & Premium Quality Pass

> **Purpose:** Elevate every page from "functional" to "premium" — Dribbble/Behance quality
> **Block:** G — Quality Assurance Loop
> **Depends on:** All UI phases complete, visual audit done, fix round done
> **Goal:** Every page must look like it belongs to a $50M startup, not a tutorial project

---

## CRITICAL: This Is NOT Optional

This phase exists because AI-generated UIs often look "correct but boring."
After this phase, every page must pass this test:

**"If I showed this to a designer, would they say it looks premium?"**

If any page fails that test, fix it before moving on.

---

## Step 1: Design System Consistency Audit

Run these checks against EVERY component and page:

```bash
# Check 1: Find hardcoded colors (MUST be zero results)
grep -rn "bg-blue\|bg-gray\|bg-red\|bg-green\|bg-slate\|text-gray\|text-blue\|border-gray" app/ components/ --include="*.tsx" | grep -v "node_modules" | grep -v ".test."

# Check 2: Find hardcoded hex colors (MUST be zero results)
grep -rn "#[0-9a-fA-F]\{3,6\}" app/ components/ --include="*.tsx" | grep -v "node_modules" | grep -v "globals.css" | grep -v "tailwind.config"

# Check 3: Find missing hover states on interactive elements
grep -rn "onClick\|href=" app/ components/ --include="*.tsx" | grep -v "hover:" | head -20

# Check 4: Find cards without hover effects
grep -rn "rounded-xl\|rounded-lg" app/ components/ --include="*.tsx" | grep -v "hover:" | grep -v "button\|btn\|input" | head -20

# Check 5: Verify dark mode classes exist
grep -rn "dark:" app/ components/ --include="*.tsx" | wc -l
# Should be > 50 for a properly themed app
```

**Fix ALL issues found before proceeding to Step 2.**

---

## Step 2: Page-by-Page Premium Polish

For EACH page listed below, read the component file and apply these upgrades:

### /
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /login
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /signup
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /dashboard
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /users
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /users/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /users/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /listings
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /listings/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /listings/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /reviews
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /reviews/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /reviews/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /shops
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /shops/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /shops/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /orders
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /orders/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /orders/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /payments
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /payments/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /payments/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /subscriptions
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /subscriptions/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /subscriptions/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /uploads
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /uploads/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /uploads/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /channels
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /channels/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /channels/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /notifications
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /notifications/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /notifications/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /conversations
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /conversations/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /conversations/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /messages
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /messages/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /messages/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /global-search-features
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /global-search-features/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /global-search-features/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /safe-transactions
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /safe-transactions/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /safe-transactions/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /own-shop-systems
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /own-shop-systems/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /own-shop-systems/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /set-your-own-prices
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /set-your-own-prices/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /set-your-own-prices/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /no-transaction-fees
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /no-transaction-fees/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /no-transaction-fees/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /messages-and-chat-systems
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /messages-and-chat-systems/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /messages-and-chat-systems/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /classified-ad-markets
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /classified-ad-markets/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /classified-ad-markets/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /member-reviews
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /member-reviews/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /member-reviews/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /privacy-functions
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /privacy-functions/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /privacy-functions/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /media-clouds
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /media-clouds/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /media-clouds/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /user-blocking-systems
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /user-blocking-systems/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /user-blocking-systems/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /human-operated-fake-checks
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /human-operated-fake-checks/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /human-operated-fake-checks/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /member-reviews-and-ratings
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /member-reviews-and-ratings/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /member-reviews-and-ratings/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /full-featured-profiles
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /full-featured-profiles/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /full-featured-profiles/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /seller-ratings-and-buyer-reviews
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /seller-ratings-and-buyer-reviews/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /seller-ratings-and-buyer-reviews/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /user-ranking-lists
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /user-ranking-lists/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /user-ranking-lists/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /friends-and-fans-systems
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /friends-and-fans-systems/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /friends-and-fans-systems/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /custom-video-clips
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /custom-video-clips/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /custom-video-clips/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /private-photosets
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /private-photosets/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /private-photosets/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /whatsapp-and-skype-chats
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /whatsapp-and-skype-chats/new
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /whatsapp-and-skype-chats/[id]
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")

### /settings
- [ ] Has proper section spacing (`py-16 md:py-24` or `py-12 md:py-16`)
- [ ] Cards have: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Headings use font-bold or font-semibold (not font-normal for h1/h2)
- [ ] Muted text uses `text-muted-foreground` (not hardcoded grays)
- [ ] At least one visual accent (gradient bg, blur blob, or glass card effect)
- [ ] Empty states have icon + message + CTA button (not just text)
- [ ] Loading states use skeleton shimmer (not just "Loading...")


---

## Step 3: Landing Page Premium Checklist

The landing page is the MOST important page. It must be exceptional.

- [ ] **Hero section:**
  - Gradient text on headline (or bold contrast)
  - Subtitle in `text-muted-foreground text-lg`
  - Two CTAs: primary (solid) + secondary (outline/ghost)
  - Background: subtle gradient mesh or blur blob (`bg-primary/5 blur-3xl`)
  - Social proof / trust signal below CTAs

- [ ] **Feature cards:**
  - Glass card effect: `bg-card/50 backdrop-blur-sm border border-border/30`
  - Icon in colored container: `p-3 rounded-xl bg-primary/10 text-primary`
  - Hover: `hover:shadow-xl hover:-translate-y-1 hover:border-primary/30`
  - Stagger animation: `style={{ animationDelay: `${i * 100}ms` }}`

- [ ] **Sections alternate visual treatment:**
  - Section 1: normal background
  - Section 2: subtle gradient (`bg-gradient-to-br from-muted/30 to-background`)
  - Section 3: normal
  - Section 4: gradient
  - This prevents the "wall of white" effect

- [ ] **Final CTA section:**
  - Gradient background
  - Large headline
  - Single prominent button
  - Decorative blur blob behind

- [ ] **Footer:**
  - Subtle border-top
  - Organized in columns
  - Muted text for copyright

---

## Step 4: Dashboard Premium Checklist

- [ ] **Stat cards** at top:
  - Icon + number + label layout
  - Subtle border, not heavy shadows
  - Color-coded icons (primary, secondary, accent)

- [ ] **Recent items list:**
  - Cards with hover state
  - Relative time display
  - Action buttons on hover (`opacity-0 group-hover:opacity-100`)

- [ ] **Empty dashboard:**
  - Welcoming message
  - Quick-start guide or CTA
  - NOT just "No data yet"

---

## Step 5: Forms Premium Checklist

- [ ] **All inputs have:**
  - Label above (not placeholder-only)
  - Focus ring: `focus:ring-2 focus:ring-primary/30 focus:border-primary`
  - Error state: red border + error message below
  - Consistent border radius (`rounded-lg`)

- [ ] **Submit buttons:**
  - Full width or right-aligned
  - Loading spinner + disabled state during submission
  - Success feedback (toast or redirect)

- [ ] **Form layout:**
  - Glass card container: `bg-card rounded-xl border border-border p-6`
  - Max width constrained (`max-w-lg` or `max-w-2xl`)
  - Centered on page for login/signup

---

## Step 6: Auth Pages Premium Checklist

- [ ] **Login page:**
  - Centered card layout
  - Glass card effect
  - Product logo/name at top
  - Social login buttons if applicable
  - "Don't have an account? Sign up" link

- [ ] **Signup page:**
  - Matches login page styling exactly
  - Password strength indicator if applicable
  - Terms/Privacy links

---

## Step 7: Global Polish

- [ ] **Header/Navigation:**
  - Sticky with backdrop-blur: `sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50`
  - Active link indicator (underline or background)
  - Smooth transitions on dropdown menus

- [ ] **Mobile responsive:**
  - All grids collapse to single column on mobile
  - Touch targets minimum 44x44px
  - Navigation uses sheet/drawer on mobile
  - No horizontal overflow on any page

- [ ] **Transitions everywhere:**
  - Page transitions: fade-in on mount
  - List items: stagger animation on load
  - Hover states: `transition-all duration-200` or `duration-300`
  - No jarring instant changes

- [ ] **Dark mode:**
  - Every page renders correctly in both modes
  - No white backgrounds in dark mode
  - Shadows are stronger in dark mode
  - Glass effects work in both modes

---

## Step 8: Final Verification

After all fixes:

```bash
# Build must pass
npm run build

# Zero hardcoded colors
grep -rn "bg-blue\|bg-gray\|text-gray\|#[0-9a-fA-F]\{6\}" app/ components/ --include="*.tsx" | grep -v "node_modules\|globals.css\|tailwind.config" | wc -l
# Result must be 0

# Hover states on interactive elements
grep -rn "hover:" app/ components/ --include="*.tsx" | wc -l
# Result should be > 100
```

---

## Validation

- [ ] Zero hardcoded colors in components (`grep` returns 0)
- [ ] Every card has hover effect
- [ ] Every page has proper section spacing
- [ ] Landing page has gradient/glass/blur effects
- [ ] Dashboard has stat cards with icons
- [ ] Forms use glass card container with proper input styling
- [ ] Auth pages are centered with premium card layout
- [ ] Header is sticky with backdrop-blur
- [ ] Mobile responsive on all pages
- [ ] Dark mode works on all pages
- [ ] Stagger animations on list pages
- [ ] `npm run build` passes
- [ ] "Would a designer approve this?" — YES for every page



---

> **🎨 Design:** Follow `docs/DESIGN_SYSTEM.md` for colors, typography, component patterns, and hover states. NEVER hardcode colors — use CSS variables.

---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Phase 12: 43 - Premium UI Loop (Design Self-Healing)

> Source: `docs/phases/43-premium-ui-loop.md`

# 43 - Premium UI Loop (Design Self-Healing)

> **Purpose:** Elevate every page from "functional" to "premium" — loop until every page passes the design audit
> **Block:** G — Quality Assurance
> **Depends on:** Phase 42 (MVP Completeness Loop — must be COMPLETE first)
> **THIS PHASE LOOPS — do NOT skip pages or mark done after one pass**

---

## CRITICAL: This Is a LOOP Per Page

For EACH page in the app:

```
FOR each page:
  REPEAT {
    1. Read the component file
    2. Run design audit checks
    3. Apply premium fixes
    4. Verify build still passes
    5. IF audit issues remain → go to step 1
    6. IF page passes all checks → next page
  } MAX 3 ITERATIONS PER PAGE
```

---

## Step 1: Global Design Audit

Before touching individual pages, run the global audit:

```bash
echo "=========================================="
echo "  PREMIUM UI AUDIT"
echo "=========================================="

# Check 1: Hardcoded colors (MUST be 0)
echo "--- Hardcoded Colors ---"
HARDCODED=$(grep -rn "bg-blue-\|bg-gray-\|bg-red-\|bg-green-\|bg-slate-\|text-gray-\|text-blue-\|border-gray-\|bg-zinc-\|text-zinc-\|border-zinc-\|bg-neutral-\|text-neutral-" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v ".test." | wc -l)
echo "Hardcoded color classes: $HARDCODED"
if [ "$HARDCODED" -gt 0 ]; then
  grep -rn "bg-blue-\|bg-gray-\|bg-red-\|bg-green-\|bg-slate-\|text-gray-\|text-blue-\|border-gray-" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | head -20
fi
echo ""

# Check 2: Hardcoded hex colors (MUST be 0 outside config)
echo "--- Hardcoded Hex Colors ---"
HEX=$(grep -rn "#[0-9a-fA-F]\{3,8\}" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v globals.css | grep -v tailwind.config | wc -l)
echo "Hardcoded hex values: $HEX"
echo ""

# Check 3: Interactive elements without hover
echo "--- Missing Hover States ---"
CLICKABLE=$(grep -rn "onClick\|href=\|<button\|<a " app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
HOVERABLE=$(grep -rn "hover:" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
echo "Clickable elements: $CLICKABLE"
echo "Elements with hover: $HOVERABLE"
echo "Ratio: $(echo "scale=0; $HOVERABLE * 100 / ($CLICKABLE + 1)" | bc)%"
echo ""

# Check 4: Loading states
echo "--- Loading/Empty States ---"
LOADING=$(grep -rn "loading\|skeleton\|animate-pulse\|isLoading\|Skeleton" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
EMPTY=$(grep -rn "empty\|no data\|no items\|nothing here\|get started" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
echo "Loading state references: $LOADING"
echo "Empty state references: $EMPTY"
echo ""

# Check 5: Transition classes
echo "--- Transitions ---"
TRANSITIONS=$(grep -rn "transition-\|duration-" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
echo "Transition classes: $TRANSITIONS"
echo ""

echo "=========================================="
echo "  GLOBAL AUDIT COMPLETE"
echo "=========================================="
```

**Fix ALL global issues before proceeding to per-page polish.**

Replace every hardcoded color with theme tokens:
- `bg-gray-100` → `bg-muted`
- `bg-gray-800` → `bg-card`
- `text-gray-500` → `text-muted-foreground`
- `text-gray-900` → `text-foreground`
- `border-gray-200` → `border-border`
- `bg-blue-500` → `bg-primary`
- `text-white` → `text-primary-foreground` (on primary bg) or keep if truly white
- `bg-red-500` → `bg-destructive`
- `bg-green-500` → `bg-primary` or `text-green-500` if semantic success

---

## Step 2: Per-Page Premium Polish

For each page below, read the file, apply the premium rules, then verify.

### Premium Rules (apply to EVERY page)

**Spacing:**
- Page sections: `py-12 md:py-16` minimum between sections
- Card padding: `p-5` or `p-6` minimum
- Component gaps: `gap-4` or `gap-6` in grids

**Cards:**
- Background: `bg-card rounded-xl border border-border`
- Hover effect: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- Glass variant (premium): `bg-card/50 backdrop-blur-sm border border-border/50`

**Typography:**
- h1: `text-3xl md:text-4xl font-bold tracking-tight`
- h2: `text-2xl md:text-3xl font-semibold`
- h3: `text-lg font-semibold`
- Body: `text-muted-foreground` for secondary text
- NEVER use `font-normal` for headings

**Interactive Elements:**
- ALL buttons: must have `transition-colors` or `transition-all`
- ALL links: must have `hover:text-primary` or similar hover change
- ALL cards: must have hover lift or shadow effect
- Touch targets: minimum `p-2` (44px effective)

**Empty States:**
- Icon (from lucide-react): `w-12 h-12 text-muted-foreground`
- Heading: `text-lg font-semibold`
- Description: `text-muted-foreground text-sm`
- CTA button: primary action to fix the empty state
- NEVER just text like "No items yet"

**Loading States:**
- Skeleton shimmer: `animate-pulse bg-muted rounded`
- Match the layout of the actual content
- Show 3-5 skeleton items for lists
- NEVER just "Loading..."

**Error States:**
- Destructive icon + heading + description
- Retry button
- NEVER just "Something went wrong"

---

## Pages to Polish

### 1. Landing — `/`
**File:** `app/page.tsx OR app/(public)/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 2. Login — `/login`
**File:** `app/login/page.tsx OR app/(auth)/login/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 3. Signup — `/signup`
**File:** `app/signup/page.tsx OR app/(auth)/signup/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 4. Dashboard — `/dashboard`
**File:** `app/(app)/dashboard/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 5. Settings — `/settings`
**File:** `app/(app)/settings/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 6. User List — `/users`
**File:** `app/(app)/users/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 7. User Create — `/users/new`
**File:** `app/(app)/users/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 8. User Detail — `/users/[id]`
**File:** `app/(app)/users/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 9. Listing List — `/listings`
**File:** `app/(app)/listings/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 10. Listing Create — `/listings/new`
**File:** `app/(app)/listings/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 11. Listing Detail — `/listings/[id]`
**File:** `app/(app)/listings/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 12. Review List — `/reviews`
**File:** `app/(app)/reviews/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 13. Review Create — `/reviews/new`
**File:** `app/(app)/reviews/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 14. Review Detail — `/reviews/[id]`
**File:** `app/(app)/reviews/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 15. Shop List — `/shops`
**File:** `app/(app)/shops/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 16. Shop Create — `/shops/new`
**File:** `app/(app)/shops/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 17. Shop Detail — `/shops/[id]`
**File:** `app/(app)/shops/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 18. Order List — `/orders`
**File:** `app/(app)/orders/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 19. Order Create — `/orders/new`
**File:** `app/(app)/orders/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 20. Order Detail — `/orders/[id]`
**File:** `app/(app)/orders/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 21. Payment List — `/payments`
**File:** `app/(app)/payments/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 22. Payment Create — `/payments/new`
**File:** `app/(app)/payments/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 23. Payment Detail — `/payments/[id]`
**File:** `app/(app)/payments/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 24. Subscription List — `/subscriptions`
**File:** `app/(app)/subscriptions/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 25. Subscription Create — `/subscriptions/new`
**File:** `app/(app)/subscriptions/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 26. Subscription Detail — `/subscriptions/[id]`
**File:** `app/(app)/subscriptions/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 27. Upload List — `/uploads`
**File:** `app/(app)/uploads/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 28. Upload Create — `/uploads/new`
**File:** `app/(app)/uploads/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 29. Upload Detail — `/uploads/[id]`
**File:** `app/(app)/uploads/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 30. Channel List — `/channels`
**File:** `app/(app)/channels/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 31. Channel Create — `/channels/new`
**File:** `app/(app)/channels/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 32. Channel Detail — `/channels/[id]`
**File:** `app/(app)/channels/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 33. Notification List — `/notifications`
**File:** `app/(app)/notifications/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 34. Notification Create — `/notifications/new`
**File:** `app/(app)/notifications/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 35. Notification Detail — `/notifications/[id]`
**File:** `app/(app)/notifications/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 36. Conversation List — `/conversations`
**File:** `app/(app)/conversations/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 37. Conversation Create — `/conversations/new`
**File:** `app/(app)/conversations/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 38. Conversation Detail — `/conversations/[id]`
**File:** `app/(app)/conversations/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 39. Message List — `/messages`
**File:** `app/(app)/messages/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 40. Message Create — `/messages/new`
**File:** `app/(app)/messages/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 41. Message Detail — `/messages/[id]`
**File:** `app/(app)/messages/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 42. GlobalSearchFeature List — `/global-search-features`
**File:** `app/(app)/global-search-features/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 43. GlobalSearchFeature Create — `/global-search-features/new`
**File:** `app/(app)/global-search-features/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 44. GlobalSearchFeature Detail — `/global-search-features/[id]`
**File:** `app/(app)/global-search-features/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 45. SafeTransactions List — `/safe-transactions`
**File:** `app/(app)/safe-transactions/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 46. SafeTransactions Create — `/safe-transactions/new`
**File:** `app/(app)/safe-transactions/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 47. SafeTransactions Detail — `/safe-transactions/[id]`
**File:** `app/(app)/safe-transactions/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 48. OwnShopSystem List — `/own-shop-systems`
**File:** `app/(app)/own-shop-systems/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 49. OwnShopSystem Create — `/own-shop-systems/new`
**File:** `app/(app)/own-shop-systems/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 50. OwnShopSystem Detail — `/own-shop-systems/[id]`
**File:** `app/(app)/own-shop-systems/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 51. SetYourOwnPrices List — `/set-your-own-prices`
**File:** `app/(app)/set-your-own-prices/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 52. SetYourOwnPrices Create — `/set-your-own-prices/new`
**File:** `app/(app)/set-your-own-prices/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 53. SetYourOwnPrices Detail — `/set-your-own-prices/[id]`
**File:** `app/(app)/set-your-own-prices/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 54. NoTransactionFees List — `/no-transaction-fees`
**File:** `app/(app)/no-transaction-fees/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 55. NoTransactionFees Create — `/no-transaction-fees/new`
**File:** `app/(app)/no-transaction-fees/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 56. NoTransactionFees Detail — `/no-transaction-fees/[id]`
**File:** `app/(app)/no-transaction-fees/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 57. MessagesAndChatSystem List — `/messages-and-chat-systems`
**File:** `app/(app)/messages-and-chat-systems/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 58. MessagesAndChatSystem Create — `/messages-and-chat-systems/new`
**File:** `app/(app)/messages-and-chat-systems/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 59. MessagesAndChatSystem Detail — `/messages-and-chat-systems/[id]`
**File:** `app/(app)/messages-and-chat-systems/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 60. ClassifiedAdMarket List — `/classified-ad-markets`
**File:** `app/(app)/classified-ad-markets/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 61. ClassifiedAdMarket Create — `/classified-ad-markets/new`
**File:** `app/(app)/classified-ad-markets/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 62. ClassifiedAdMarket Detail — `/classified-ad-markets/[id]`
**File:** `app/(app)/classified-ad-markets/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 63. MemberReviews List — `/member-reviews`
**File:** `app/(app)/member-reviews/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 64. MemberReviews Create — `/member-reviews/new`
**File:** `app/(app)/member-reviews/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 65. MemberReviews Detail — `/member-reviews/[id]`
**File:** `app/(app)/member-reviews/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 66. PrivacyFunctions List — `/privacy-functions`
**File:** `app/(app)/privacy-functions/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 67. PrivacyFunctions Create — `/privacy-functions/new`
**File:** `app/(app)/privacy-functions/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 68. PrivacyFunctions Detail — `/privacy-functions/[id]`
**File:** `app/(app)/privacy-functions/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 69. MediaCloud List — `/media-clouds`
**File:** `app/(app)/media-clouds/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 70. MediaCloud Create — `/media-clouds/new`
**File:** `app/(app)/media-clouds/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 71. MediaCloud Detail — `/media-clouds/[id]`
**File:** `app/(app)/media-clouds/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 72. UserBlockingSystem List — `/user-blocking-systems`
**File:** `app/(app)/user-blocking-systems/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 73. UserBlockingSystem Create — `/user-blocking-systems/new`
**File:** `app/(app)/user-blocking-systems/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 74. UserBlockingSystem Detail — `/user-blocking-systems/[id]`
**File:** `app/(app)/user-blocking-systems/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 75. HumanOperatedFakeCheck List — `/human-operated-fake-checks`
**File:** `app/(app)/human-operated-fake-checks/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 76. HumanOperatedFakeCheck Create — `/human-operated-fake-checks/new`
**File:** `app/(app)/human-operated-fake-checks/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 77. HumanOperatedFakeCheck Detail — `/human-operated-fake-checks/[id]`
**File:** `app/(app)/human-operated-fake-checks/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 78. MemberReviewsAndRatings List — `/member-reviews-and-ratings`
**File:** `app/(app)/member-reviews-and-ratings/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 79. MemberReviewsAndRatings Create — `/member-reviews-and-ratings/new`
**File:** `app/(app)/member-reviews-and-ratings/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 80. MemberReviewsAndRatings Detail — `/member-reviews-and-ratings/[id]`
**File:** `app/(app)/member-reviews-and-ratings/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 81. FullFeaturedProfiles List — `/full-featured-profiles`
**File:** `app/(app)/full-featured-profiles/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 82. FullFeaturedProfiles Create — `/full-featured-profiles/new`
**File:** `app/(app)/full-featured-profiles/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 83. FullFeaturedProfiles Detail — `/full-featured-profiles/[id]`
**File:** `app/(app)/full-featured-profiles/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 84. SellerRatingsAndBuyerReviews List — `/seller-ratings-and-buyer-reviews`
**File:** `app/(app)/seller-ratings-and-buyer-reviews/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 85. SellerRatingsAndBuyerReviews Create — `/seller-ratings-and-buyer-reviews/new`
**File:** `app/(app)/seller-ratings-and-buyer-reviews/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 86. SellerRatingsAndBuyerReviews Detail — `/seller-ratings-and-buyer-reviews/[id]`
**File:** `app/(app)/seller-ratings-and-buyer-reviews/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 87. UserRankingList List — `/user-ranking-lists`
**File:** `app/(app)/user-ranking-lists/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 88. UserRankingList Create — `/user-ranking-lists/new`
**File:** `app/(app)/user-ranking-lists/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 89. UserRankingList Detail — `/user-ranking-lists/[id]`
**File:** `app/(app)/user-ranking-lists/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 90. FriendsAndFansSystem List — `/friends-and-fans-systems`
**File:** `app/(app)/friends-and-fans-systems/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 91. FriendsAndFansSystem Create — `/friends-and-fans-systems/new`
**File:** `app/(app)/friends-and-fans-systems/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 92. FriendsAndFansSystem Detail — `/friends-and-fans-systems/[id]`
**File:** `app/(app)/friends-and-fans-systems/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 93. CustomVideoClips List — `/custom-video-clips`
**File:** `app/(app)/custom-video-clips/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 94. CustomVideoClips Create — `/custom-video-clips/new`
**File:** `app/(app)/custom-video-clips/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 95. CustomVideoClips Detail — `/custom-video-clips/[id]`
**File:** `app/(app)/custom-video-clips/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 96. PrivatePhotosets List — `/private-photosets`
**File:** `app/(app)/private-photosets/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 97. PrivatePhotosets Create — `/private-photosets/new`
**File:** `app/(app)/private-photosets/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 98. PrivatePhotosets Detail — `/private-photosets/[id]`
**File:** `app/(app)/private-photosets/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 99. WhatsappAndSkypeChats List — `/whatsapp-and-skype-chats`
**File:** `app/(app)/whatsapp-and-skype-chats/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 100. WhatsappAndSkypeChats Create — `/whatsapp-and-skype-chats/new`
**File:** `app/(app)/whatsapp-and-skype-chats/new/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.

### 101. WhatsappAndSkypeChats Detail — `/whatsapp-and-skype-chats/[id]`
**File:** `app/(app)/whatsapp-and-skype-chats/[id]/page.tsx`

Read the file. Check:
- [ ] Uses theme colors only (no hardcoded colors)
- [ ] Proper section spacing (py-12+)
- [ ] Cards have hover effects
- [ ] Headings are bold/semibold
- [ ] Empty state has icon + text + CTA
- [ ] Loading state uses skeleton shimmer
- [ ] All interactive elements have hover state
- [ ] At least one visual accent (gradient, blur blob, or glass effect)
- [ ] Mobile responsive (no overflow, stacked on small screens)

If ANY check fails → fix it → run `npx tsc --noEmit` → continue.


---

## Step 3: Landing Page Deep Polish

The landing page gets EXTRA attention. After the standard checks, also ensure:

- [ ] **Hero:** Gradient text or bold contrast headline, two CTAs, subtle background effect (blur blob or gradient)
- [ ] **Features section:** Cards in 2x2 or 3-column grid, icons in colored containers (`p-3 rounded-xl bg-primary/10 text-primary`), stagger animation
- [ ] **Alternating sections:** Odd sections normal bg, even sections with subtle `bg-muted/30` or gradient
- [ ] **Social proof / trust signal** below hero (even if placeholder)
- [ ] **Final CTA section:** Gradient background, large headline, single button, decorative blur
- [ ] **Footer:** Organized columns, muted text, border-top

---

## Step 4: Navigation & Layout Polish

- [ ] **Header:** `sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50`
- [ ] **Active link indicator:** Current page highlighted (underline, bg change, or color)
- [ ] **Mobile nav:** Sheet/drawer pattern, smooth transitions, backdrop click to close
- [ ] **Sidebar (if app layout):** Collapsible, active state, proper spacing

---

## Step 5: Forms Polish

- [ ] ALL inputs have labels above (not placeholder-only)
- [ ] Focus ring: `focus:ring-2 focus:ring-primary/20 focus:border-primary`
- [ ] Error state: red border + message below
- [ ] Consistent `rounded-lg` border radius
- [ ] Submit button: loading spinner + disabled during submission
- [ ] Form container: `bg-card rounded-xl border border-border p-6 max-w-lg` or `max-w-2xl`

---

## Step 6: Final Verification

```bash
echo "=========================================="
echo "  PREMIUM UI VERIFICATION"
echo "=========================================="

# Must be 0
HARDCODED=$(grep -rn "bg-blue-\|bg-gray-\|text-gray-\|bg-slate-\|text-slate-\|bg-zinc-\|text-zinc-" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
echo "Hardcoded colors remaining: $HARDCODED"

# Should be high
HOVERS=$(grep -rn "hover:" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
echo "Hover state classes: $HOVERS"

# Should be high
TRANSITIONS=$(grep -rn "transition-" app/ components/ --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
echo "Transition classes: $TRANSITIONS"

# Must pass
npx tsc --noEmit 2>&1 | tail -3
npm run build 2>&1 | tail -5

echo "=========================================="
```

**If hardcoded colors > 0 → go back to Step 2 and fix them.**
**If build fails → fix the error, then re-run verification.**

---

## Step 7: Loop Decision

- If ALL checks pass AND build succeeds → **EXIT** ✅
- If issues remain AND global iteration < 3 → **GO BACK TO STEP 1** 🔄
- If iteration 3 and issues remain → **EXIT with report** ⚠️

---

## Step 8: Completion Report

Create or update `DESIGN_STATUS.md`:

```markdown
# Design Status Report

## Result: ✅ PREMIUM / ⚠️ NEEDS WORK

### Pages Polished: X/101
### Hardcoded Colors: 0
### Hover States: Y total
### Build Status: PASS

### Per-Page Status
- Landing (/): ✅
- Login (/login): ✅
- Signup (/signup): ✅
- Dashboard (/dashboard): ✅
- Settings (/settings): ✅
- User List (/users): ✅
- User Create (/users/new): ✅
- User Detail (/users/[id]): ✅
- Listing List (/listings): ✅
- Listing Create (/listings/new): ✅
- Listing Detail (/listings/[id]): ✅
- Review List (/reviews): ✅
- Review Create (/reviews/new): ✅
- Review Detail (/reviews/[id]): ✅
- Shop List (/shops): ✅
- Shop Create (/shops/new): ✅
- Shop Detail (/shops/[id]): ✅
- Order List (/orders): ✅
- Order Create (/orders/new): ✅
- Order Detail (/orders/[id]): ✅
- Payment List (/payments): ✅
- Payment Create (/payments/new): ✅
- Payment Detail (/payments/[id]): ✅
- Subscription List (/subscriptions): ✅
- Subscription Create (/subscriptions/new): ✅
- Subscription Detail (/subscriptions/[id]): ✅
- Upload List (/uploads): ✅
- Upload Create (/uploads/new): ✅
- Upload Detail (/uploads/[id]): ✅
- Channel List (/channels): ✅
- Channel Create (/channels/new): ✅
- Channel Detail (/channels/[id]): ✅
- Notification List (/notifications): ✅
- Notification Create (/notifications/new): ✅
- Notification Detail (/notifications/[id]): ✅
- Conversation List (/conversations): ✅
- Conversation Create (/conversations/new): ✅
- Conversation Detail (/conversations/[id]): ✅
- Message List (/messages): ✅
- Message Create (/messages/new): ✅
- Message Detail (/messages/[id]): ✅
- GlobalSearchFeature List (/global-search-features): ✅
- GlobalSearchFeature Create (/global-search-features/new): ✅
- GlobalSearchFeature Detail (/global-search-features/[id]): ✅
- SafeTransactions List (/safe-transactions): ✅
- SafeTransactions Create (/safe-transactions/new): ✅
- SafeTransactions Detail (/safe-transactions/[id]): ✅
- OwnShopSystem List (/own-shop-systems): ✅
- OwnShopSystem Create (/own-shop-systems/new): ✅
- OwnShopSystem Detail (/own-shop-systems/[id]): ✅
- SetYourOwnPrices List (/set-your-own-prices): ✅
- SetYourOwnPrices Create (/set-your-own-prices/new): ✅
- SetYourOwnPrices Detail (/set-your-own-prices/[id]): ✅
- NoTransactionFees List (/no-transaction-fees): ✅
- NoTransactionFees Create (/no-transaction-fees/new): ✅
- NoTransactionFees Detail (/no-transaction-fees/[id]): ✅
- MessagesAndChatSystem List (/messages-and-chat-systems): ✅
- MessagesAndChatSystem Create (/messages-and-chat-systems/new): ✅
- MessagesAndChatSystem Detail (/messages-and-chat-systems/[id]): ✅
- ClassifiedAdMarket List (/classified-ad-markets): ✅
- ClassifiedAdMarket Create (/classified-ad-markets/new): ✅
- ClassifiedAdMarket Detail (/classified-ad-markets/[id]): ✅
- MemberReviews List (/member-reviews): ✅
- MemberReviews Create (/member-reviews/new): ✅
- MemberReviews Detail (/member-reviews/[id]): ✅
- PrivacyFunctions List (/privacy-functions): ✅
- PrivacyFunctions Create (/privacy-functions/new): ✅
- PrivacyFunctions Detail (/privacy-functions/[id]): ✅
- MediaCloud List (/media-clouds): ✅
- MediaCloud Create (/media-clouds/new): ✅
- MediaCloud Detail (/media-clouds/[id]): ✅
- UserBlockingSystem List (/user-blocking-systems): ✅
- UserBlockingSystem Create (/user-blocking-systems/new): ✅
- UserBlockingSystem Detail (/user-blocking-systems/[id]): ✅
- HumanOperatedFakeCheck List (/human-operated-fake-checks): ✅
- HumanOperatedFakeCheck Create (/human-operated-fake-checks/new): ✅
- HumanOperatedFakeCheck Detail (/human-operated-fake-checks/[id]): ✅
- MemberReviewsAndRatings List (/member-reviews-and-ratings): ✅
- MemberReviewsAndRatings Create (/member-reviews-and-ratings/new): ✅
- MemberReviewsAndRatings Detail (/member-reviews-and-ratings/[id]): ✅
- FullFeaturedProfiles List (/full-featured-profiles): ✅
- FullFeaturedProfiles Create (/full-featured-profiles/new): ✅
- FullFeaturedProfiles Detail (/full-featured-profiles/[id]): ✅
- SellerRatingsAndBuyerReviews List (/seller-ratings-and-buyer-reviews): ✅
- SellerRatingsAndBuyerReviews Create (/seller-ratings-and-buyer-reviews/new): ✅
- SellerRatingsAndBuyerReviews Detail (/seller-ratings-and-buyer-reviews/[id]): ✅
- UserRankingList List (/user-ranking-lists): ✅
- UserRankingList Create (/user-ranking-lists/new): ✅
- UserRankingList Detail (/user-ranking-lists/[id]): ✅
- FriendsAndFansSystem List (/friends-and-fans-systems): ✅
- FriendsAndFansSystem Create (/friends-and-fans-systems/new): ✅
- FriendsAndFansSystem Detail (/friends-and-fans-systems/[id]): ✅
- CustomVideoClips List (/custom-video-clips): ✅
- CustomVideoClips Create (/custom-video-clips/new): ✅
- CustomVideoClips Detail (/custom-video-clips/[id]): ✅
- PrivatePhotosets List (/private-photosets): ✅
- PrivatePhotosets Create (/private-photosets/new): ✅
- PrivatePhotosets Detail (/private-photosets/[id]): ✅
- WhatsappAndSkypeChats List (/whatsapp-and-skype-chats): ✅
- WhatsappAndSkypeChats Create (/whatsapp-and-skype-chats/new): ✅
- WhatsappAndSkypeChats Detail (/whatsapp-and-skype-chats/[id]): ✅

### Design Highlights
- [notable visual improvements made]
```

---

## Validation

This phase is done ONLY when ALL of these are true:
- [ ] Zero hardcoded colors in all components
- [ ] Every page has proper spacing, hover states, and transitions
- [ ] Landing page has hero gradient, feature cards, CTA section
- [ ] Dashboard has stat cards with icons and proper empty state
- [ ] All forms have labels, focus rings, and error states
- [ ] Navigation is sticky with backdrop-blur
- [ ] All loading states use skeleton shimmer
- [ ] All empty states have icon + message + CTA
- [ ] Mobile responsive on every page
- [ ] `npm run build` passes
- [ ] DESIGN_STATUS.md created

**PantyHub is now truly premium.**


---

> **🎨 Design:** Follow `docs/DESIGN_SYSTEM.md` for colors, typography, component patterns, and hover states. NEVER hardcode colors — use CSS variables.

---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password


---

## Quality Gate

Run this command after completing ALL phases:

```bash
npx tsc --noEmit && npm run build
```

**Requirements:**
- Zero TypeScript/Dart errors
- Build succeeds
- No console errors in dev mode

**Semantic checks** (run AFTER build passes):
```bash
# No empty page components (must have real content)
for f in $(find app -name "page.tsx" -newer package.json 2>/dev/null); do
  lines=$(wc -l < "$f")
  if [ "$lines" -lt 10 ]; then echo "WARNING: $f has only $lines lines — possibly empty"; fi
done

# No TODO placeholders in generated files
grep -rn "TODO:" --include="*.tsx" --include="*.ts" app/ lib/ hooks/ 2>/dev/null | head -20

# No unresolved imports
grep -rn "from ['"]\./.*undefined" --include="*.ts" --include="*.tsx" app/ lib/ 2>/dev/null | head -10
```

Fix any issues found before reporting completion.

---

## Output Contract Verification

Before reporting completion, verify ALL outputs meet their structural contracts:

- [ ] `docs/BUILD_REPORT.md` created

### Structural Contracts

Verify these structural requirements are met:

- `docs/BUILD_REPORT.md` exists
  - Contains: `Build Report`
  - Contains: `Status`

For TypeScript/TSX files, verify exports:
```bash
# Example: grep -c "export" {file} to verify exports exist
```


```bash
test -e "docs/BUILD_REPORT.md" && echo "✓ docs/BUILD_REPORT.md" || echo "✗ MISSING: docs/BUILD_REPORT.md"
```

If any contract fails, fix the file before reporting completion. Do NOT skip contract failures.

---

## Completion Protocol

After all outputs verified:

1. Write your agent state to `docs/build-state/qa.json` (avoids race conditions with parallel agents):
   ```json
   {
     "agentId": "qa",
     "status": "complete",
     "tier": <your-tier-number>,
     "outputContractsPassed": true,
     "filesCreated": ["list", "of", "files", "you", "created"],
     "decisions": [
       {
         "what": "chose X over Y",
         "category": "naming | architecture | library | pattern | design",
         "why": "reason in 1 line",
         "reversible": true,
         "blocksAgents": []
       }
     ],
     "warnings": [],
     "completedAt": "<ISO timestamp>"
   }
   ```
2. ALSO update `docs/BUILD_STATE.json`:
   - Set `agents.qa.status` to `"complete"`
   - Set `agents.qa.completedAt` to current ISO timestamp
   - Set `lastUpdatedByAgent` to `"qa"`
3. Update `docs/PROGRESS.md` — mark this agent as done

---

## Adaptive Error Recovery

Errors are classified into types with different retry strategies:

### Transient Errors (network, timeout, install)
**Strategy:** 5 retries with exponential backoff (2s, 4s, 8s, 16s, 30s)
- npm install timeout → retry with `--legacy-peer-deps`, then `--force`
- Network fetch failed → wait and retry
- File lock conflict → wait 5s and retry

### Config Errors (env vars, paths, settings)
**Strategy:** 1 auto-fix attempt, then stub
- Missing env var → create stub with mock fallback
- Wrong import path → try common alternatives (@/, ../, ./)
- Port conflict → use next available port

### Logic Errors (type mismatch, wrong implementation)
**Strategy:** 1 retry with different approach, then stub
- Type error → check interface, fix type or use `as unknown as X` + TODO
- Component won't render → check props, simplify implementation
- API returns wrong shape → fix response type

### Dependency Errors (missing file from previous agent)
**Strategy:** 0 retries — escalate immediately
- File from previous agent missing → check BUILD_STATE.json for warnings
- Schema mismatch → read shared-types.json, realign
- Create minimal stub and escalate to TODO.md

### Escalation Protocol

If an error can't be resolved with the strategies above:

1. Create/append to `docs/TODO.md`:
   ```markdown
   ## [qa] {error-title}
   - **Phase:** {phase-file}
   - **Type:** transient | config | logic | dependency
   - **Severity:** critical | major | minor
   - **Error:** {error message}
   - **Attempted fixes:** {what you tried}
   - **Workaround:** {stub/mock created}
   - **Impact:** {what won't work until this is fixed}
   ```
2. Create a stub/mock that makes the build pass
3. Add to `agents.qa.warnings` in BUILD_STATE.json
4. Continue to the next phase

---

**Agent qa complete.** Report status to orchestrator.
