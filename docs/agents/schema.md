# Schema Agent — Build Agent

> **Product:** PantyHub
> **Agent ID:** schema
> **Phases:** 4 | **Est. Time:** ~5 min
> **Dependencies:** foundation

Database schema SQL, RLS policies, triggers and functions

---

## Pre-Flight Check

Before executing any phases, verify ALL prerequisites:

```bash
test -e "lib/supabase/client.ts" && echo "✓ lib/supabase/client.ts" || echo "✗ MISSING: lib/supabase/client.ts"
test -e "lib/supabase/server.ts" && echo "✓ lib/supabase/server.ts" || echo "✗ MISSING: lib/supabase/server.ts"
```

**Context handoff:** Read per-agent state files to understand what previous agents produced:
- `docs/build-state/foundation.json` — decisions, warnings, files created

Also read `docs/BUILD_STATE.json` for the global overview (conflict zones, tier progress).

**Cross-agent types:** Read `docs/contracts/shared-types.json` for entity definitions, naming conventions, and design tokens. Do NOT deviate from these conventions.
**Route safety:** Check `routeOverrides` in shared-types.json. If your entity route conflicts with a reserved/feature route, use the override path (e.g., `manage-reviews` instead of `reviews`).

**Dependency hashes:** Record hashes of input files for change detection:
```bash
md5sum "lib/supabase/client.ts" 2>/dev/null || echo "N/A lib/supabase/client.ts"
md5sum "lib/supabase/server.ts" 2>/dev/null || echo "N/A lib/supabase/server.ts"
```
Store these in `agents.schema.inputHashes` in BUILD_STATE.json.

**Build check:** Run `npx tsc --noEmit` — must pass before starting.

**Rollback preparation:** Before starting, create a restore point:
```bash
git add -A && git stash push -m "pre-schema"
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

## Security

| Field | Value |
|-------|-------|
| **Roles** | user, admin |
| **Trust** | medium |
| **Compliance** | none |

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
- `components/error-boundary.tsx` → **Error Handling Agent**
- `components/loading-skeleton.tsx` → **Responsive Agent**
- `app/sitemap.ts` → **DevOps Agent**
- `app/robots.ts` → **DevOps Agent**
- `.github/workflows/ci.yml` → **DevOps Agent**
- `README.md` → **DevOps Agent**
- `docs/BUILD_REPORT.md` → **Quality Assurance Agent**
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
- `supabase/schema.sql`

If you need something from another agent's file, read it but DO NOT write to it. If the file is missing or has wrong content, log it as a dependency error in BUILD_STATE.json.

---

## Instructions

Execute all phases below in order. After each phase:
1. Run `npx tsc --noEmit` — fix any errors before continuing
2. Verify the phase's tasks are complete
3. Move to the next phase

---

## Phase 1: 28 - Database Schema

> Source: `docs/phases/28-database-schema.md`

# 28 - Database Schema

> **Agent:** Database Agent 🗄️
> **Goal:** Set up Supabase database with all tables and policies

---

## ⚠️ CRITICAL: Schema Design Rules

### 1. Avoid Duplicate Fields
**NEVER define these fields in your custom schema - they are automatically added:**
- `id` - UUID Primary Key (auto-generated)
- `user_id` - UUID Foreign Key to auth.users (auto-generated)
- `created_at` - TIMESTAMPTZ (auto-generated)
- `updated_at` - TIMESTAMPTZ (auto-generated)

### 2. Profile Table is SPECIAL
The `profiles` table uses `id` = `auth.users.id` (NOT a separate `user_id`):
```sql
-- Profile: id IS the user id
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),  -- id = user.id
  ...
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Query: .eq("id", user.id)  NOT .eq("user_id", user.id)
```

### 3. Junction Tables (Many-to-Many)
For relationships between users (matches, follows, likes), use descriptive field names:
```sql
-- WRONG: Ambiguous user_id
CREATE TABLE matches (
  user_id UUID,  -- Which user? From or To?
);

-- RIGHT: Descriptive field names
CREATE TABLE matches (
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  ...
);
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE TABLE likes (
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  ...
);
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
```

**Only define entity-SPECIFIC fields in your tables.**

Example of WRONG vs RIGHT:
```sql
-- WRONG: Duplicate fields!
CREATE TABLE items (
  id UUID PRIMARY KEY,       -- Already auto-added!
  user_id UUID,              -- Already auto-added!
  created_at TIMESTAMPTZ,    -- Already auto-added!
  name TEXT,
  id UUID,                   -- DUPLICATE! Will cause error!
  created_at TIMESTAMPTZ     -- DUPLICATE! Will cause error!
);

-- RIGHT: Only custom fields
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Only custom fields below:
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
```

---

## Context

**Product:** PantyHub
**Entities:** User, Listing, Review, Shop, Order, Payment, Subscription, Upload, Channel, Notification, Conversation, Message, GlobalSearchFeature, SafeTransactions, OwnShopSystem, SetYourOwnPrices, NoTransactionFees, MessagesAndChatSystem, ClassifiedAdMarket, MemberReviews, PrivacyFunctions, MediaCloud, UserBlockingSystem, HumanOperatedFakeCheck, MemberReviewsAndRatings, FullFeaturedProfiles, SellerRatingsAndBuyerReviews, UserRankingList, FriendsAndFansSystem, CustomVideoClips, PrivatePhotosets, WhatsappAndSkypeChats

### Data Model

**User**: A buyer or seller on the platform
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `username`: TEXT (required, unique, indexed) - The user's username
- `email`: TEXT (required, unique, indexed) - The user's email address
- `password`: TEXT (required) - The user's password
- `role`: TEXT (required, enum: buyer, seller) - The user's role on the platform
Relationships:
  - one_to_many → Listing: A user can have many listings
  - one_to_many → Review: A user can have many reviews

**Listing**: A used panty or other item for sale
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required) - The title of the listing
- `description`: TEXT (required) - The description of the listing
- `price`: INTEGER (required) - The price of the listing
- `status`: TEXT (required, enum: available, sold) - The status of the listing
Relationships:
  - many_to_one → User: A listing belongs to one user
  - one_to_many → Review: A listing can have many reviews

**Review**: A review of a listing
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `rating`: INTEGER (required) - The rating of the review
- `feedback`: TEXT (required) - The feedback of the review
Relationships:
  - many_to_one → User: A review belongs to one user
  - many_to_one → Listing: A review belongs to one listing

**Shop**: A seller's own shop system
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `name`: TEXT (required) - The name of the shop
- `description`: TEXT (required) - The description of the shop
Relationships:
  - many_to_one → User: A shop belongs to one user

**Order**: Purchase transaction
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `listing_id`: UUID (required)
- `buyer_id`: UUID (required)
- `seller_id`: UUID (required)
- `amount`: INTEGER (required)
- `status`: TEXT (required, enum: pending, paid, shipped, completed, cancelled, refunded, default: pending)
- `payment_intent_id`: TEXT (required)


**Payment**: Payment transactions and history
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `stripe_payment_id`: TEXT (required, unique, indexed)
- `amount`: INTEGER (required)
- `currency`: TEXT (required)
- `status`: TEXT (required, indexed, enum: pending, completed, failed, refunded)
- `payment_method`: TEXT (required)
- `description`: TEXT (required)


**Subscription**: User subscription plans (Stripe)
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `stripe_customer_id`: TEXT (required, unique, indexed)
- `stripe_subscription_id`: TEXT (required, unique, indexed)
- `plan_name`: TEXT (required)
- `price_amount`: INTEGER (required)
- `interval`: TEXT (required, indexed, enum: monthly, yearly)
- `status`: TEXT (required, indexed, enum: active, canceled, past_due, trialing, incomplete)
- `current_period_end`: TIMESTAMPTZ (required)


**Upload**: File uploads and media
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `file_name`: TEXT (required)
- `file_url`: TEXT (required)
- `file_type`: TEXT (required)
- `file_size`: INTEGER (required)
- `storage_path`: TEXT (required)
- `alt_text`: TEXT (required)


**Channel**: Chat channels / rooms
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `name`: TEXT (required)
- `type`: TEXT (required, indexed)


**Notification**: User notifications (in-app, email, push)
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `message`: TEXT (required)
- `type`: TEXT (required, indexed, enum: info, success, warning, error, mention, follow, like)
- `read`: BOOLEAN (required, default: false)
- `action_url`: TEXT (required)
- `sender_id`: UUID (required, indexed)


**Conversation**: Chat conversations between users
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `is_group`: BOOLEAN (required)
- `last_message_at`: TIMESTAMPTZ (required, indexed)


**Message**: Individual messages within conversations
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `content`: TEXT (required)
- `conversation_id`: UUID (required, indexed)
- `sender_id`: UUID (required, indexed)
- `message_type`: TEXT (required, indexed, enum: text, image, file, system)
- `read_at`: TIMESTAMPTZ (required)


**GlobalSearchFeature**: Data entity for the global search feature feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**SafeTransactions**: Data entity for the safe transactions feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**OwnShopSystem**: Data entity for the own shop system feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**SetYourOwnPrices**: Data entity for the set your own prices feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**NoTransactionFees**: Data entity for the no transaction fees feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**MessagesAndChatSystem**: Data entity for the messages and chat system feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**ClassifiedAdMarket**: Data entity for the classified ad market feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**MemberReviews**: Data entity for the member reviews feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**PrivacyFunctions**: Data entity for the privacy functions feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**MediaCloud**: Data entity for the media cloud feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**UserBlockingSystem**: Data entity for the user blocking system feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**HumanOperatedFakeCheck**: Data entity for the human operated fake check feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**MemberReviewsAndRatings**: Data entity for the member reviews and ratings feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**FullFeaturedProfiles**: Data entity for the full featured profiles feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**SellerRatingsAndBuyerReviews**: Data entity for the seller ratings and buyer reviews feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**UserRankingList**: Data entity for the user ranking list feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**FriendsAndFansSystem**: Data entity for the friends and fans system feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**CustomVideoClips**: Data entity for the custom video clips feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**PrivatePhotosets**: Data entity for the private photosets feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


**WhatsappAndSkypeChats**: Data entity for the whatsapp and skype chats feature
- `id`: UUID (required, unique, indexed) - Primary key
- `created_at`: TIMESTAMPTZ (required) - Creation timestamp
- `updated_at`: TIMESTAMPTZ (required) - Last update timestamp
- `user_id`: UUID (required, indexed) - Owner user ID
- `title`: TEXT (required)
- `description`: TEXT (required)
- `status`: TEXT (required, indexed, enum: active, inactive, archived)
- `metadata`: JSONB (required)


---

## Instructions

### File Location

> **PRE-SHIPPED:** This bundle includes a complete `supabase/schema.sql` file with all tables, RLS policies, indexes, and triggers already generated. **Use it as-is** unless you need to modify the schema.

The `supabase/schema.sql` file is the single source of truth for the database. To apply it:

1. Open your Supabase Dashboard → SQL Editor
2. Paste the contents of `supabase/schema.sql`
3. Run it

If you need to customize the schema, edit `supabase/schema.sql` directly — do NOT create separate migration files at this stage.

### ⚠️ STOP — Supabase Setup Required

Before applying the schema, the user MUST have a Supabase project:

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy the **Project URL** and **anon key** into `.env.local`
3. Open SQL Editor in Supabase Dashboard
4. Paste the FULL contents of `supabase/schema.sql` and run it

The pre-shipped `supabase/schema.sql` already includes:
- `profiles` table synced with auth.users (auto-create on signup)
- All entity tables with proper types, constraints, indexes
- RLS policies (public-read for social entities, owner-only for private)
- Foreign key relationships auto-detected
- Trigger for `updated_at` timestamps

### Reference: What's In The Schema

Below is a reference of what `supabase/schema.sql` contains (DO NOT recreate — it's already in the file):

### 2. Entity Tables

Create a table for each entity:

**1. User Table (`app_users`):**
Purpose: A buyer or seller on the platform

```sql
CREATE TABLE app_users (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  username TEXT NOT NULL UNIQUE -- The user's username,
  email TEXT NOT NULL UNIQUE -- The user's email address,
  password TEXT NOT NULL -- The user's password,
  role TEXT NOT NULL -- The user's role on the platform,

  -- Enum constraints
  CONSTRAINT app_users_role_check CHECK (role IN ('buyer', 'seller'))
);

-- Indexes for performance
CREATE INDEX app_users_user_id_idx ON app_users(user_id);
CREATE INDEX app_users_created_at_idx ON app_users(created_at DESC);
CREATE INDEX app_users_username_idx ON app_users(username);
CREATE INDEX app_users_email_idx ON app_users(email);

-- RLS Policies (Granular)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "app_users_select_own"
  ON app_users FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "app_users_insert_own"
  ON app_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "app_users_update_own"
  ON app_users FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "app_users_delete_own"
  ON app_users FOR DELETE
  USING (auth.uid() = user_id);
```

Relationships:
- one_to_many to Listing (foreign key: listing_id)
- one_to_many to Review (foreign key: review_id)

**2. Listing Table (`listings`):**
Purpose: A used panty or other item for sale

```sql
CREATE TABLE listings (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL -- The title of the listing,
  description TEXT NOT NULL -- The description of the listing,
  price INTEGER NOT NULL -- The price of the listing,
  status TEXT NOT NULL -- The status of the listing,

  -- Enum constraints
  CONSTRAINT listings_status_check CHECK (status IN ('available', 'sold'))
);

-- Indexes for performance
CREATE INDEX listings_user_id_idx ON listings(user_id);
CREATE INDEX listings_created_at_idx ON listings(created_at DESC);


-- RLS Policies (Granular)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "listings_select_own"
  ON listings FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "listings_insert_own"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "listings_update_own"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "listings_delete_own"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);
```

Relationships:
- many_to_one to User (foreign key: user_id)
- one_to_many to Review (foreign key: review_id)

**3. Review Table (`reviews`):**
Purpose: A review of a listing

```sql
CREATE TABLE reviews (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  rating INTEGER NOT NULL -- The rating of the review,
  feedback TEXT NOT NULL -- The feedback of the review

);

-- Indexes for performance
CREATE INDEX reviews_user_id_idx ON reviews(user_id);
CREATE INDEX reviews_created_at_idx ON reviews(created_at DESC);


-- RLS Policies (Granular)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "reviews_select_own"
  ON reviews FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "reviews_insert_own"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "reviews_update_own"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "reviews_delete_own"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);
```

Relationships:
- many_to_one to User (foreign key: user_id)
- many_to_one to Listing (foreign key: listing_id)

**4. Shop Table (`shops`):**
Purpose: A seller's own shop system

```sql
CREATE TABLE shops (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  name TEXT NOT NULL -- The name of the shop,
  description TEXT NOT NULL -- The description of the shop

);

-- Indexes for performance
CREATE INDEX shops_user_id_idx ON shops(user_id);
CREATE INDEX shops_created_at_idx ON shops(created_at DESC);


-- RLS Policies (Granular)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "shops_select_own"
  ON shops FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "shops_insert_own"
  ON shops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "shops_update_own"
  ON shops FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "shops_delete_own"
  ON shops FOR DELETE
  USING (auth.uid() = user_id);
```

Relationships:
- many_to_one to User (foreign key: user_id)

**5. Order Table (`orders`):**
Purpose: Purchase transaction

```sql
CREATE TABLE orders (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_intent_id TEXT NOT NULL REFERENCES payment_intents(id) ON DELETE CASCADE,

  -- Enum constraints
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded'))
);

-- Indexes for performance
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);


-- RLS Policies (Granular)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "orders_update_own"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "orders_delete_own"
  ON orders FOR DELETE
  USING (auth.uid() = user_id);
```



**6. Payment Table (`payments`):**
Purpose: Payment transactions and history

```sql
CREATE TABLE payments (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  stripe_payment_id TEXT NOT NULL UNIQUE REFERENCES stripe_payments(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Enum constraints
  CONSTRAINT payments_status_check CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- Indexes for performance
CREATE INDEX payments_user_id_idx ON payments(user_id);
CREATE INDEX payments_created_at_idx ON payments(created_at DESC);
CREATE INDEX payments_stripe_payment_id_idx ON payments(stripe_payment_id);
CREATE INDEX payments_status_idx ON payments(status);

-- RLS Policies (Granular)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "payments_select_own"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "payments_insert_own"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "payments_update_own"
  ON payments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "payments_delete_own"
  ON payments FOR DELETE
  USING (auth.uid() = user_id);
```



**7. Subscription Table (`subscriptions`):**
Purpose: User subscription plans (Stripe)

```sql
CREATE TABLE subscriptions (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  stripe_customer_id TEXT NOT NULL UNIQUE REFERENCES stripe_customers(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE REFERENCES stripe_subscriptions(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  price_amount INTEGER NOT NULL,
  interval TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,

  -- Enum constraints
  CONSTRAINT subscriptions_interval_check CHECK (interval IN ('monthly', 'yearly')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete'))
);

-- Indexes for performance
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_created_at_idx ON subscriptions(created_at DESC);
CREATE INDEX subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);
CREATE INDEX subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX subscriptions_interval_idx ON subscriptions(interval);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);

-- RLS Policies (Granular)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "subscriptions_insert_own"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "subscriptions_update_own"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "subscriptions_delete_own"
  ON subscriptions FOR DELETE
  USING (auth.uid() = user_id);
```



**8. Upload Table (`uploads`):**
Purpose: File uploads and media

```sql
CREATE TABLE uploads (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT NOT NULL

);

-- Indexes for performance
CREATE INDEX uploads_user_id_idx ON uploads(user_id);
CREATE INDEX uploads_created_at_idx ON uploads(created_at DESC);


-- RLS Policies (Granular)
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "uploads_select_own"
  ON uploads FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "uploads_insert_own"
  ON uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "uploads_update_own"
  ON uploads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "uploads_delete_own"
  ON uploads FOR DELETE
  USING (auth.uid() = user_id);
```



**9. Channel Table (`channels`):**
Purpose: Chat channels / rooms

```sql
CREATE TABLE channels (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  name TEXT NOT NULL,
  type TEXT NOT NULL

);

-- Indexes for performance
CREATE INDEX channels_user_id_idx ON channels(user_id);
CREATE INDEX channels_created_at_idx ON channels(created_at DESC);
CREATE INDEX channels_type_idx ON channels(type);

-- RLS Policies (Granular)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "channels_select_own"
  ON channels FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "channels_insert_own"
  ON channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "channels_update_own"
  ON channels FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "channels_delete_own"
  ON channels FOR DELETE
  USING (auth.uid() = user_id);
```



**10. Notification Table (`notifications`):**
Purpose: User notifications (in-app, email, push)

```sql
CREATE TABLE notifications (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES senders(id) ON DELETE CASCADE,

  -- Enum constraints
  CONSTRAINT notifications_type_check CHECK (type IN ('info', 'success', 'warning', 'error', 'mention', 'follow', 'like'))
);

-- Indexes for performance
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX notifications_type_idx ON notifications(type);
CREATE INDEX notifications_sender_id_idx ON notifications(sender_id);

-- RLS Policies (Granular)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "notifications_insert_own"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
```



**11. Conversation Table (`conversations`):**
Purpose: Chat conversations between users

```sql
CREATE TABLE conversations (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  is_group BOOLEAN NOT NULL,
  last_message_at TIMESTAMPTZ NOT NULL

);

-- Indexes for performance
CREATE INDEX conversations_user_id_idx ON conversations(user_id);
CREATE INDEX conversations_created_at_idx ON conversations(created_at DESC);
CREATE INDEX conversations_last_message_at_idx ON conversations(last_message_at);

-- RLS Policies (Granular)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "conversations_select_own"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "conversations_insert_own"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "conversations_update_own"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "conversations_delete_own"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);
```



**12. Message Table (`messages`):**
Purpose: Individual messages within conversations

```sql
CREATE TABLE messages (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  content TEXT NOT NULL,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES senders(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL,

  -- Enum constraints
  CONSTRAINT messages_message_type_check CHECK (message_type IN ('text', 'image', 'file', 'system'))
);

-- Indexes for performance
CREATE INDEX messages_user_id_idx ON messages(user_id);
CREATE INDEX messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_message_type_idx ON messages(message_type);

-- RLS Policies (Granular)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "messages_select_own"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "messages_insert_own"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "messages_update_own"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "messages_delete_own"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);
```



**13. GlobalSearchFeature Table (`global_search_features`):**
Purpose: Data entity for the global search feature feature

```sql
CREATE TABLE global_search_features (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT global_search_features_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX global_search_features_user_id_idx ON global_search_features(user_id);
CREATE INDEX global_search_features_created_at_idx ON global_search_features(created_at DESC);
CREATE INDEX global_search_features_status_idx ON global_search_features(status);

-- RLS Policies (Granular)
ALTER TABLE global_search_features ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "global_search_features_select_own"
  ON global_search_features FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "global_search_features_insert_own"
  ON global_search_features FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "global_search_features_update_own"
  ON global_search_features FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "global_search_features_delete_own"
  ON global_search_features FOR DELETE
  USING (auth.uid() = user_id);
```



**14. SafeTransactions Table (`safe_transactions`):**
Purpose: Data entity for the safe transactions feature

```sql
CREATE TABLE safe_transactions (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT safe_transactions_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX safe_transactions_user_id_idx ON safe_transactions(user_id);
CREATE INDEX safe_transactions_created_at_idx ON safe_transactions(created_at DESC);
CREATE INDEX safe_transactions_status_idx ON safe_transactions(status);

-- RLS Policies (Granular)
ALTER TABLE safe_transactions ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "safe_transactions_select_own"
  ON safe_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "safe_transactions_insert_own"
  ON safe_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "safe_transactions_update_own"
  ON safe_transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "safe_transactions_delete_own"
  ON safe_transactions FOR DELETE
  USING (auth.uid() = user_id);
```



**15. OwnShopSystem Table (`own_shop_systems`):**
Purpose: Data entity for the own shop system feature

```sql
CREATE TABLE own_shop_systems (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT own_shop_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX own_shop_systems_user_id_idx ON own_shop_systems(user_id);
CREATE INDEX own_shop_systems_created_at_idx ON own_shop_systems(created_at DESC);
CREATE INDEX own_shop_systems_status_idx ON own_shop_systems(status);

-- RLS Policies (Granular)
ALTER TABLE own_shop_systems ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "own_shop_systems_select_own"
  ON own_shop_systems FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "own_shop_systems_insert_own"
  ON own_shop_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "own_shop_systems_update_own"
  ON own_shop_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "own_shop_systems_delete_own"
  ON own_shop_systems FOR DELETE
  USING (auth.uid() = user_id);
```



**16. SetYourOwnPrices Table (`set_your_own_prices`):**
Purpose: Data entity for the set your own prices feature

```sql
CREATE TABLE set_your_own_prices (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT set_your_own_prices_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX set_your_own_prices_user_id_idx ON set_your_own_prices(user_id);
CREATE INDEX set_your_own_prices_created_at_idx ON set_your_own_prices(created_at DESC);
CREATE INDEX set_your_own_prices_status_idx ON set_your_own_prices(status);

-- RLS Policies (Granular)
ALTER TABLE set_your_own_prices ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "set_your_own_prices_select_own"
  ON set_your_own_prices FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "set_your_own_prices_insert_own"
  ON set_your_own_prices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "set_your_own_prices_update_own"
  ON set_your_own_prices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "set_your_own_prices_delete_own"
  ON set_your_own_prices FOR DELETE
  USING (auth.uid() = user_id);
```



**17. NoTransactionFees Table (`no_transaction_fees`):**
Purpose: Data entity for the no transaction fees feature

```sql
CREATE TABLE no_transaction_fees (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT no_transaction_fees_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX no_transaction_fees_user_id_idx ON no_transaction_fees(user_id);
CREATE INDEX no_transaction_fees_created_at_idx ON no_transaction_fees(created_at DESC);
CREATE INDEX no_transaction_fees_status_idx ON no_transaction_fees(status);

-- RLS Policies (Granular)
ALTER TABLE no_transaction_fees ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "no_transaction_fees_select_own"
  ON no_transaction_fees FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "no_transaction_fees_insert_own"
  ON no_transaction_fees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "no_transaction_fees_update_own"
  ON no_transaction_fees FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "no_transaction_fees_delete_own"
  ON no_transaction_fees FOR DELETE
  USING (auth.uid() = user_id);
```



**18. MessagesAndChatSystem Table (`messages_and_chat_systems`):**
Purpose: Data entity for the messages and chat system feature

```sql
CREATE TABLE messages_and_chat_systems (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT messages_and_chat_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX messages_and_chat_systems_user_id_idx ON messages_and_chat_systems(user_id);
CREATE INDEX messages_and_chat_systems_created_at_idx ON messages_and_chat_systems(created_at DESC);
CREATE INDEX messages_and_chat_systems_status_idx ON messages_and_chat_systems(status);

-- RLS Policies (Granular)
ALTER TABLE messages_and_chat_systems ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "messages_and_chat_systems_select_own"
  ON messages_and_chat_systems FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "messages_and_chat_systems_insert_own"
  ON messages_and_chat_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "messages_and_chat_systems_update_own"
  ON messages_and_chat_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "messages_and_chat_systems_delete_own"
  ON messages_and_chat_systems FOR DELETE
  USING (auth.uid() = user_id);
```



**19. ClassifiedAdMarket Table (`classified_ad_markets`):**
Purpose: Data entity for the classified ad market feature

```sql
CREATE TABLE classified_ad_markets (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT classified_ad_markets_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX classified_ad_markets_user_id_idx ON classified_ad_markets(user_id);
CREATE INDEX classified_ad_markets_created_at_idx ON classified_ad_markets(created_at DESC);
CREATE INDEX classified_ad_markets_status_idx ON classified_ad_markets(status);

-- RLS Policies (Granular)
ALTER TABLE classified_ad_markets ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "classified_ad_markets_select_own"
  ON classified_ad_markets FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "classified_ad_markets_insert_own"
  ON classified_ad_markets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "classified_ad_markets_update_own"
  ON classified_ad_markets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "classified_ad_markets_delete_own"
  ON classified_ad_markets FOR DELETE
  USING (auth.uid() = user_id);
```



**20. MemberReviews Table (`member_reviews`):**
Purpose: Data entity for the member reviews feature

```sql
CREATE TABLE member_reviews (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT member_reviews_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX member_reviews_user_id_idx ON member_reviews(user_id);
CREATE INDEX member_reviews_created_at_idx ON member_reviews(created_at DESC);
CREATE INDEX member_reviews_status_idx ON member_reviews(status);

-- RLS Policies (Granular)
ALTER TABLE member_reviews ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "member_reviews_select_own"
  ON member_reviews FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "member_reviews_insert_own"
  ON member_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "member_reviews_update_own"
  ON member_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "member_reviews_delete_own"
  ON member_reviews FOR DELETE
  USING (auth.uid() = user_id);
```



**21. PrivacyFunctions Table (`privacy_functions`):**
Purpose: Data entity for the privacy functions feature

```sql
CREATE TABLE privacy_functions (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT privacy_functions_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX privacy_functions_user_id_idx ON privacy_functions(user_id);
CREATE INDEX privacy_functions_created_at_idx ON privacy_functions(created_at DESC);
CREATE INDEX privacy_functions_status_idx ON privacy_functions(status);

-- RLS Policies (Granular)
ALTER TABLE privacy_functions ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "privacy_functions_select_own"
  ON privacy_functions FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "privacy_functions_insert_own"
  ON privacy_functions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "privacy_functions_update_own"
  ON privacy_functions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "privacy_functions_delete_own"
  ON privacy_functions FOR DELETE
  USING (auth.uid() = user_id);
```



**22. MediaCloud Table (`media_clouds`):**
Purpose: Data entity for the media cloud feature

```sql
CREATE TABLE media_clouds (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT media_clouds_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX media_clouds_user_id_idx ON media_clouds(user_id);
CREATE INDEX media_clouds_created_at_idx ON media_clouds(created_at DESC);
CREATE INDEX media_clouds_status_idx ON media_clouds(status);

-- RLS Policies (Granular)
ALTER TABLE media_clouds ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "media_clouds_select_own"
  ON media_clouds FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "media_clouds_insert_own"
  ON media_clouds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "media_clouds_update_own"
  ON media_clouds FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "media_clouds_delete_own"
  ON media_clouds FOR DELETE
  USING (auth.uid() = user_id);
```



**23. UserBlockingSystem Table (`user_blocking_systems`):**
Purpose: Data entity for the user blocking system feature

```sql
CREATE TABLE user_blocking_systems (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT user_blocking_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX user_blocking_systems_user_id_idx ON user_blocking_systems(user_id);
CREATE INDEX user_blocking_systems_created_at_idx ON user_blocking_systems(created_at DESC);
CREATE INDEX user_blocking_systems_status_idx ON user_blocking_systems(status);

-- RLS Policies (Granular)
ALTER TABLE user_blocking_systems ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "user_blocking_systems_select_own"
  ON user_blocking_systems FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "user_blocking_systems_insert_own"
  ON user_blocking_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "user_blocking_systems_update_own"
  ON user_blocking_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "user_blocking_systems_delete_own"
  ON user_blocking_systems FOR DELETE
  USING (auth.uid() = user_id);
```



**24. HumanOperatedFakeCheck Table (`human_operated_fake_checks`):**
Purpose: Data entity for the human operated fake check feature

```sql
CREATE TABLE human_operated_fake_checks (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT human_operated_fake_checks_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX human_operated_fake_checks_user_id_idx ON human_operated_fake_checks(user_id);
CREATE INDEX human_operated_fake_checks_created_at_idx ON human_operated_fake_checks(created_at DESC);
CREATE INDEX human_operated_fake_checks_status_idx ON human_operated_fake_checks(status);

-- RLS Policies (Granular)
ALTER TABLE human_operated_fake_checks ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "human_operated_fake_checks_select_own"
  ON human_operated_fake_checks FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "human_operated_fake_checks_insert_own"
  ON human_operated_fake_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "human_operated_fake_checks_update_own"
  ON human_operated_fake_checks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "human_operated_fake_checks_delete_own"
  ON human_operated_fake_checks FOR DELETE
  USING (auth.uid() = user_id);
```



**25. MemberReviewsAndRatings Table (`member_reviews_and_ratings`):**
Purpose: Data entity for the member reviews and ratings feature

```sql
CREATE TABLE member_reviews_and_ratings (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT member_reviews_and_ratings_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX member_reviews_and_ratings_user_id_idx ON member_reviews_and_ratings(user_id);
CREATE INDEX member_reviews_and_ratings_created_at_idx ON member_reviews_and_ratings(created_at DESC);
CREATE INDEX member_reviews_and_ratings_status_idx ON member_reviews_and_ratings(status);

-- RLS Policies (Granular)
ALTER TABLE member_reviews_and_ratings ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "member_reviews_and_ratings_select_own"
  ON member_reviews_and_ratings FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "member_reviews_and_ratings_insert_own"
  ON member_reviews_and_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "member_reviews_and_ratings_update_own"
  ON member_reviews_and_ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "member_reviews_and_ratings_delete_own"
  ON member_reviews_and_ratings FOR DELETE
  USING (auth.uid() = user_id);
```



**26. FullFeaturedProfiles Table (`full_featured_profiles`):**
Purpose: Data entity for the full featured profiles feature

```sql
CREATE TABLE full_featured_profiles (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT full_featured_profiles_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX full_featured_profiles_user_id_idx ON full_featured_profiles(user_id);
CREATE INDEX full_featured_profiles_created_at_idx ON full_featured_profiles(created_at DESC);
CREATE INDEX full_featured_profiles_status_idx ON full_featured_profiles(status);

-- RLS Policies (Granular)
ALTER TABLE full_featured_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "full_featured_profiles_select_own"
  ON full_featured_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "full_featured_profiles_insert_own"
  ON full_featured_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "full_featured_profiles_update_own"
  ON full_featured_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "full_featured_profiles_delete_own"
  ON full_featured_profiles FOR DELETE
  USING (auth.uid() = user_id);
```



**27. SellerRatingsAndBuyerReviews Table (`seller_ratings_and_buyer_reviews`):**
Purpose: Data entity for the seller ratings and buyer reviews feature

```sql
CREATE TABLE seller_ratings_and_buyer_reviews (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT seller_ratings_and_buyer_reviews_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX seller_ratings_and_buyer_reviews_user_id_idx ON seller_ratings_and_buyer_reviews(user_id);
CREATE INDEX seller_ratings_and_buyer_reviews_created_at_idx ON seller_ratings_and_buyer_reviews(created_at DESC);
CREATE INDEX seller_ratings_and_buyer_reviews_status_idx ON seller_ratings_and_buyer_reviews(status);

-- RLS Policies (Granular)
ALTER TABLE seller_ratings_and_buyer_reviews ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "seller_ratings_and_buyer_reviews_select_own"
  ON seller_ratings_and_buyer_reviews FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "seller_ratings_and_buyer_reviews_insert_own"
  ON seller_ratings_and_buyer_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "seller_ratings_and_buyer_reviews_update_own"
  ON seller_ratings_and_buyer_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "seller_ratings_and_buyer_reviews_delete_own"
  ON seller_ratings_and_buyer_reviews FOR DELETE
  USING (auth.uid() = user_id);
```



**28. UserRankingList Table (`user_ranking_lists`):**
Purpose: Data entity for the user ranking list feature

```sql
CREATE TABLE user_ranking_lists (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT user_ranking_lists_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX user_ranking_lists_user_id_idx ON user_ranking_lists(user_id);
CREATE INDEX user_ranking_lists_created_at_idx ON user_ranking_lists(created_at DESC);
CREATE INDEX user_ranking_lists_status_idx ON user_ranking_lists(status);

-- RLS Policies (Granular)
ALTER TABLE user_ranking_lists ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "user_ranking_lists_select_own"
  ON user_ranking_lists FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "user_ranking_lists_insert_own"
  ON user_ranking_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "user_ranking_lists_update_own"
  ON user_ranking_lists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "user_ranking_lists_delete_own"
  ON user_ranking_lists FOR DELETE
  USING (auth.uid() = user_id);
```



**29. FriendsAndFansSystem Table (`friends_and_fans_systems`):**
Purpose: Data entity for the friends and fans system feature

```sql
CREATE TABLE friends_and_fans_systems (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT friends_and_fans_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX friends_and_fans_systems_user_id_idx ON friends_and_fans_systems(user_id);
CREATE INDEX friends_and_fans_systems_created_at_idx ON friends_and_fans_systems(created_at DESC);
CREATE INDEX friends_and_fans_systems_status_idx ON friends_and_fans_systems(status);

-- RLS Policies (Granular)
ALTER TABLE friends_and_fans_systems ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "friends_and_fans_systems_select_own"
  ON friends_and_fans_systems FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "friends_and_fans_systems_insert_own"
  ON friends_and_fans_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "friends_and_fans_systems_update_own"
  ON friends_and_fans_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "friends_and_fans_systems_delete_own"
  ON friends_and_fans_systems FOR DELETE
  USING (auth.uid() = user_id);
```



**30. CustomVideoClips Table (`custom_video_clips`):**
Purpose: Data entity for the custom video clips feature

```sql
CREATE TABLE custom_video_clips (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT custom_video_clips_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX custom_video_clips_user_id_idx ON custom_video_clips(user_id);
CREATE INDEX custom_video_clips_created_at_idx ON custom_video_clips(created_at DESC);
CREATE INDEX custom_video_clips_status_idx ON custom_video_clips(status);

-- RLS Policies (Granular)
ALTER TABLE custom_video_clips ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "custom_video_clips_select_own"
  ON custom_video_clips FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "custom_video_clips_insert_own"
  ON custom_video_clips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "custom_video_clips_update_own"
  ON custom_video_clips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "custom_video_clips_delete_own"
  ON custom_video_clips FOR DELETE
  USING (auth.uid() = user_id);
```



**31. PrivatePhotosets Table (`private_photosets`):**
Purpose: Data entity for the private photosets feature

```sql
CREATE TABLE private_photosets (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT private_photosets_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX private_photosets_user_id_idx ON private_photosets(user_id);
CREATE INDEX private_photosets_created_at_idx ON private_photosets(created_at DESC);
CREATE INDEX private_photosets_status_idx ON private_photosets(status);

-- RLS Policies (Granular)
ALTER TABLE private_photosets ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "private_photosets_select_own"
  ON private_photosets FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "private_photosets_insert_own"
  ON private_photosets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "private_photosets_update_own"
  ON private_photosets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "private_photosets_delete_own"
  ON private_photosets FOR DELETE
  USING (auth.uid() = user_id);
```



**32. WhatsappAndSkypeChats Table (`whatsapp_and_skype_chats`):**
Purpose: Data entity for the whatsapp and skype chats feature

```sql
CREATE TABLE whatsapp_and_skype_chats (
  -- Standard fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Entity-specific fields
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,

  -- Enum constraints
  CONSTRAINT whatsapp_and_skype_chats_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Indexes for performance
CREATE INDEX whatsapp_and_skype_chats_user_id_idx ON whatsapp_and_skype_chats(user_id);
CREATE INDEX whatsapp_and_skype_chats_created_at_idx ON whatsapp_and_skype_chats(created_at DESC);
CREATE INDEX whatsapp_and_skype_chats_status_idx ON whatsapp_and_skype_chats(status);

-- RLS Policies (Granular)
ALTER TABLE whatsapp_and_skype_chats ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view their own records
CREATE POLICY "whatsapp_and_skype_chats_select_own"
  ON whatsapp_and_skype_chats FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can only create records for themselves
CREATE POLICY "whatsapp_and_skype_chats_insert_own"
  ON whatsapp_and_skype_chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own records
CREATE POLICY "whatsapp_and_skype_chats_update_own"
  ON whatsapp_and_skype_chats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own records
CREATE POLICY "whatsapp_and_skype_chats_delete_own"
  ON whatsapp_and_skype_chats FOR DELETE
  USING (auth.uid() = user_id);
```




### 3. Updated-At Automation

Create a **Trigger Function** that automatically sets `updated_at`:
- Function Name: `update_updated_at()`
- Trigger: BEFORE UPDATE on all tables
- Logic: SET NEW.updated_at = now()

Apply the trigger to all tables (profiles + entities).

### 4. Storage Setup

Create a **Storage Bucket** for file uploads:
- Name: "uploads"
- Visibility: Private
- Folder Structure: `{user_id}/{filename}`

Storage Policies:
- Users can only upload to their own folder
- Users can only read/delete their own files
- No public access

Implement folder-based security with storage.foldername().

### 5. Type Safety

Generate TypeScript types from the schema:
- Use Supabase CLI: `supabase gen types typescript`
- Export to: `lib/database.types.ts`
- Use the types for type-safe queries

---

## Validation Checklist

Verify that:
- [ ] profiles table exists with RLS
- [ ] Auto-create Profile Trigger works
- [ ] User table exists with correct fields
- [ ] Listing table exists with correct fields
- [ ] Review table exists with correct fields
- [ ] Shop table exists with correct fields
- [ ] Order table exists with correct fields
- [ ] Payment table exists with correct fields
- [ ] Subscription table exists with correct fields
- [ ] Upload table exists with correct fields
- [ ] Channel table exists with correct fields
- [ ] Notification table exists with correct fields
- [ ] Conversation table exists with correct fields
- [ ] Message table exists with correct fields
- [ ] GlobalSearchFeature table exists with correct fields
- [ ] SafeTransactions table exists with correct fields
- [ ] OwnShopSystem table exists with correct fields
- [ ] SetYourOwnPrices table exists with correct fields
- [ ] NoTransactionFees table exists with correct fields
- [ ] MessagesAndChatSystem table exists with correct fields
- [ ] ClassifiedAdMarket table exists with correct fields
- [ ] MemberReviews table exists with correct fields
- [ ] PrivacyFunctions table exists with correct fields
- [ ] MediaCloud table exists with correct fields
- [ ] UserBlockingSystem table exists with correct fields
- [ ] HumanOperatedFakeCheck table exists with correct fields
- [ ] MemberReviewsAndRatings table exists with correct fields
- [ ] FullFeaturedProfiles table exists with correct fields
- [ ] SellerRatingsAndBuyerReviews table exists with correct fields
- [ ] UserRankingList table exists with correct fields
- [ ] FriendsAndFansSystem table exists with correct fields
- [ ] CustomVideoClips table exists with correct fields
- [ ] PrivatePhotosets table exists with correct fields
- [ ] WhatsappAndSkypeChats table exists with correct fields
- [ ] All tables have RLS enabled
- [ ] Foreign Keys correctly set
- [ ] Indexes created for performance
- [ ] updated_at Trigger on all tables
- [ ] Storage Bucket configured
- [ ] TypeScript Types generated

**Test:**
- Signup new user → Profile automatically created
- Create Entity record → Only visible to owner
- Update record → updated_at automatically set
- Upload file → Only possible in own folder

---

## Troubleshooting

**RLS Issues:**
- Check if policies correctly use auth.uid()
- Test with SQL Editor: `SELECT auth.uid()`
- Policies must have USING and WITH CHECK

**Foreign Key Errors:**
- Check CASCADE on user_id
- Entities with relationships: Correct order when creating

**Storage Issues:**
- Folder structure must follow {user_id}/ pattern
- Policies use storage.foldername() for user isolation

---

## Feature Integration

These features require additional database tables/columns. Implement now — the full feature files (`docs/features/`) build on top of this schema.

### Payments (Stripe)
Add to the `profiles` table: `stripe_customer_id TEXT`, `subscription_status TEXT DEFAULT 'inactive'`, `subscription_plan TEXT`, `stripe_subscription_id TEXT`.
Full Stripe setup is in `docs/features/payments.md` — skip the schema task when you read it later.

### Notifications
Create a `notifications` table: `id UUID PK DEFAULT gen_random_uuid()`, `user_id UUID FK → auth.users NOT NULL`, `type TEXT NOT NULL`, `message TEXT NOT NULL`, `read BOOLEAN DEFAULT FALSE`, `data JSONB`, `created_at TIMESTAMPTZ DEFAULT now()`. Enable RLS. Policy: users read/update own only.

---



---

## Phase 2: 29 - Row Level Security

> Source: `docs/phases/29-rls.md`

# 29 - Row Level Security

> **Purpose:** Enable and configure RLS policies on all Supabase tables
> **Block:** B — Infrastructure
> **Depends on:** Phase 28 — database-schema (schema created)

---

## CRITICAL: Security

RLS ensures users can only access their own data. Every table MUST have RLS enabled.

**Note:** The schema phase may have already created RLS policies inline. This phase uses `DROP POLICY IF EXISTS` before each `CREATE POLICY` to be idempotent — safe to run regardless of whether policies already exist.

---

## Instructions

### 1. Profile Table RLS

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
CREATE POLICY "profiles_public_read"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
```

### 2. Entity Table RLS

```sql
-- User (PRIVATE — owner-only access)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_users_select_own" ON app_users;
CREATE POLICY "app_users_select_own"
  ON app_users FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "app_users_insert_own" ON app_users;
CREATE POLICY "app_users_insert_own"
  ON app_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "app_users_update_own" ON app_users;
CREATE POLICY "app_users_update_own"
  ON app_users FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "app_users_delete_own" ON app_users;
CREATE POLICY "app_users_delete_own"
  ON app_users FOR DELETE
  USING (auth.uid() = user_id);

-- Listing (PUBLIC READ — social/community content)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listings_public_read" ON listings;
CREATE POLICY "listings_public_read"
  ON listings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "listings_insert_own" ON listings;
CREATE POLICY "listings_insert_own"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "listings_update_own" ON listings;
CREATE POLICY "listings_update_own"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "listings_delete_own" ON listings;
CREATE POLICY "listings_delete_own"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- Review (PUBLIC READ — social/community content)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read"
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_update_own" ON reviews;
CREATE POLICY "reviews_update_own"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_delete_own" ON reviews;
CREATE POLICY "reviews_delete_own"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Shop (PRIVATE — owner-only access)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shops_select_own" ON shops;
CREATE POLICY "shops_select_own"
  ON shops FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "shops_insert_own" ON shops;
CREATE POLICY "shops_insert_own"
  ON shops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "shops_update_own" ON shops;
CREATE POLICY "shops_update_own"
  ON shops FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "shops_delete_own" ON shops;
CREATE POLICY "shops_delete_own"
  ON shops FOR DELETE
  USING (auth.uid() = user_id);

-- Order (PRIVATE — owner-only access)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_update_own" ON orders;
CREATE POLICY "orders_update_own"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_delete_own" ON orders;
CREATE POLICY "orders_delete_own"
  ON orders FOR DELETE
  USING (auth.uid() = user_id);

-- Payment (PRIVATE — owner-only access)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_insert_own" ON payments;
CREATE POLICY "payments_insert_own"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_update_own" ON payments;
CREATE POLICY "payments_update_own"
  ON payments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_delete_own" ON payments;
CREATE POLICY "payments_delete_own"
  ON payments FOR DELETE
  USING (auth.uid() = user_id);

-- Subscription (PRIVATE — owner-only access)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_insert_own" ON subscriptions;
CREATE POLICY "subscriptions_insert_own"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_update_own" ON subscriptions;
CREATE POLICY "subscriptions_update_own"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_delete_own" ON subscriptions;
CREATE POLICY "subscriptions_delete_own"
  ON subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Upload (PRIVATE — owner-only access)
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uploads_select_own" ON uploads;
CREATE POLICY "uploads_select_own"
  ON uploads FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "uploads_insert_own" ON uploads;
CREATE POLICY "uploads_insert_own"
  ON uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "uploads_update_own" ON uploads;
CREATE POLICY "uploads_update_own"
  ON uploads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "uploads_delete_own" ON uploads;
CREATE POLICY "uploads_delete_own"
  ON uploads FOR DELETE
  USING (auth.uid() = user_id);

-- Channel (PRIVATE — owner-only access)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channels_select_own" ON channels;
CREATE POLICY "channels_select_own"
  ON channels FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "channels_insert_own" ON channels;
CREATE POLICY "channels_insert_own"
  ON channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "channels_update_own" ON channels;
CREATE POLICY "channels_update_own"
  ON channels FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "channels_delete_own" ON channels;
CREATE POLICY "channels_delete_own"
  ON channels FOR DELETE
  USING (auth.uid() = user_id);

-- Notification (PRIVATE — owner-only access)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Conversation (PRIVATE — owner-only access)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations_select_own" ON conversations;
CREATE POLICY "conversations_select_own"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "conversations_insert_own" ON conversations;
CREATE POLICY "conversations_insert_own"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "conversations_update_own" ON conversations;
CREATE POLICY "conversations_update_own"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "conversations_delete_own" ON conversations;
CREATE POLICY "conversations_delete_own"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Message (PRIVATE — owner-only access)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_own" ON messages;
CREATE POLICY "messages_select_own"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_insert_own" ON messages;
CREATE POLICY "messages_insert_own"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_update_own" ON messages;
CREATE POLICY "messages_update_own"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_delete_own" ON messages;
CREATE POLICY "messages_delete_own"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);

-- GlobalSearchFeature (PRIVATE — owner-only access)
ALTER TABLE global_search_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "global_search_features_select_own" ON global_search_features;
CREATE POLICY "global_search_features_select_own"
  ON global_search_features FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "global_search_features_insert_own" ON global_search_features;
CREATE POLICY "global_search_features_insert_own"
  ON global_search_features FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "global_search_features_update_own" ON global_search_features;
CREATE POLICY "global_search_features_update_own"
  ON global_search_features FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "global_search_features_delete_own" ON global_search_features;
CREATE POLICY "global_search_features_delete_own"
  ON global_search_features FOR DELETE
  USING (auth.uid() = user_id);

-- SafeTransactions (PRIVATE — owner-only access)
ALTER TABLE safe_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "safe_transactions_select_own" ON safe_transactions;
CREATE POLICY "safe_transactions_select_own"
  ON safe_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "safe_transactions_insert_own" ON safe_transactions;
CREATE POLICY "safe_transactions_insert_own"
  ON safe_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "safe_transactions_update_own" ON safe_transactions;
CREATE POLICY "safe_transactions_update_own"
  ON safe_transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "safe_transactions_delete_own" ON safe_transactions;
CREATE POLICY "safe_transactions_delete_own"
  ON safe_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- OwnShopSystem (PRIVATE — owner-only access)
ALTER TABLE own_shop_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_shop_systems_select_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_select_own"
  ON own_shop_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_shop_systems_insert_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_insert_own"
  ON own_shop_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_shop_systems_update_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_update_own"
  ON own_shop_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_shop_systems_delete_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_delete_own"
  ON own_shop_systems FOR DELETE
  USING (auth.uid() = user_id);

-- SetYourOwnPrices (PRIVATE — owner-only access)
ALTER TABLE set_your_own_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "set_your_own_prices_select_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_select_own"
  ON set_your_own_prices FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "set_your_own_prices_insert_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_insert_own"
  ON set_your_own_prices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "set_your_own_prices_update_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_update_own"
  ON set_your_own_prices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "set_your_own_prices_delete_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_delete_own"
  ON set_your_own_prices FOR DELETE
  USING (auth.uid() = user_id);

-- NoTransactionFees (PRIVATE — owner-only access)
ALTER TABLE no_transaction_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no_transaction_fees_select_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_select_own"
  ON no_transaction_fees FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_transaction_fees_insert_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_insert_own"
  ON no_transaction_fees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_transaction_fees_update_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_update_own"
  ON no_transaction_fees FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_transaction_fees_delete_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_delete_own"
  ON no_transaction_fees FOR DELETE
  USING (auth.uid() = user_id);

-- MessagesAndChatSystem (PRIVATE — owner-only access)
ALTER TABLE messages_and_chat_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_and_chat_systems_select_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_select_own"
  ON messages_and_chat_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_and_chat_systems_insert_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_insert_own"
  ON messages_and_chat_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_and_chat_systems_update_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_update_own"
  ON messages_and_chat_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_and_chat_systems_delete_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_delete_own"
  ON messages_and_chat_systems FOR DELETE
  USING (auth.uid() = user_id);

-- ClassifiedAdMarket (PRIVATE — owner-only access)
ALTER TABLE classified_ad_markets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "classified_ad_markets_select_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_select_own"
  ON classified_ad_markets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "classified_ad_markets_insert_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_insert_own"
  ON classified_ad_markets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "classified_ad_markets_update_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_update_own"
  ON classified_ad_markets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "classified_ad_markets_delete_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_delete_own"
  ON classified_ad_markets FOR DELETE
  USING (auth.uid() = user_id);

-- MemberReviews (PRIVATE — owner-only access)
ALTER TABLE member_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "member_reviews_select_own" ON member_reviews;
CREATE POLICY "member_reviews_select_own"
  ON member_reviews FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_insert_own" ON member_reviews;
CREATE POLICY "member_reviews_insert_own"
  ON member_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_update_own" ON member_reviews;
CREATE POLICY "member_reviews_update_own"
  ON member_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_delete_own" ON member_reviews;
CREATE POLICY "member_reviews_delete_own"
  ON member_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- PrivacyFunctions (PRIVATE — owner-only access)
ALTER TABLE privacy_functions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "privacy_functions_select_own" ON privacy_functions;
CREATE POLICY "privacy_functions_select_own"
  ON privacy_functions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "privacy_functions_insert_own" ON privacy_functions;
CREATE POLICY "privacy_functions_insert_own"
  ON privacy_functions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "privacy_functions_update_own" ON privacy_functions;
CREATE POLICY "privacy_functions_update_own"
  ON privacy_functions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "privacy_functions_delete_own" ON privacy_functions;
CREATE POLICY "privacy_functions_delete_own"
  ON privacy_functions FOR DELETE
  USING (auth.uid() = user_id);

-- MediaCloud (PRIVATE — owner-only access)
ALTER TABLE media_clouds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "media_clouds_select_own" ON media_clouds;
CREATE POLICY "media_clouds_select_own"
  ON media_clouds FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "media_clouds_insert_own" ON media_clouds;
CREATE POLICY "media_clouds_insert_own"
  ON media_clouds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "media_clouds_update_own" ON media_clouds;
CREATE POLICY "media_clouds_update_own"
  ON media_clouds FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "media_clouds_delete_own" ON media_clouds;
CREATE POLICY "media_clouds_delete_own"
  ON media_clouds FOR DELETE
  USING (auth.uid() = user_id);

-- UserBlockingSystem (PRIVATE — owner-only access)
ALTER TABLE user_blocking_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_blocking_systems_select_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_select_own"
  ON user_blocking_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_blocking_systems_insert_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_insert_own"
  ON user_blocking_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_blocking_systems_update_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_update_own"
  ON user_blocking_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_blocking_systems_delete_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_delete_own"
  ON user_blocking_systems FOR DELETE
  USING (auth.uid() = user_id);

-- HumanOperatedFakeCheck (PRIVATE — owner-only access)
ALTER TABLE human_operated_fake_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "human_operated_fake_checks_select_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_select_own"
  ON human_operated_fake_checks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "human_operated_fake_checks_insert_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_insert_own"
  ON human_operated_fake_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "human_operated_fake_checks_update_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_update_own"
  ON human_operated_fake_checks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "human_operated_fake_checks_delete_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_delete_own"
  ON human_operated_fake_checks FOR DELETE
  USING (auth.uid() = user_id);

-- MemberReviewsAndRatings (PRIVATE — owner-only access)
ALTER TABLE member_reviews_and_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "member_reviews_and_ratings_select_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_select_own"
  ON member_reviews_and_ratings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_and_ratings_insert_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_insert_own"
  ON member_reviews_and_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_and_ratings_update_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_update_own"
  ON member_reviews_and_ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_and_ratings_delete_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_delete_own"
  ON member_reviews_and_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- FullFeaturedProfiles (PRIVATE — owner-only access)
ALTER TABLE full_featured_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "full_featured_profiles_select_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_select_own"
  ON full_featured_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "full_featured_profiles_insert_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_insert_own"
  ON full_featured_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "full_featured_profiles_update_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_update_own"
  ON full_featured_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "full_featured_profiles_delete_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_delete_own"
  ON full_featured_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- SellerRatingsAndBuyerReviews (PRIVATE — owner-only access)
ALTER TABLE seller_ratings_and_buyer_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_select_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_select_own"
  ON seller_ratings_and_buyer_reviews FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_insert_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_insert_own"
  ON seller_ratings_and_buyer_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_update_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_update_own"
  ON seller_ratings_and_buyer_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_delete_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_delete_own"
  ON seller_ratings_and_buyer_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- UserRankingList (PRIVATE — owner-only access)
ALTER TABLE user_ranking_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_ranking_lists_select_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_select_own"
  ON user_ranking_lists FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_ranking_lists_insert_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_insert_own"
  ON user_ranking_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_ranking_lists_update_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_update_own"
  ON user_ranking_lists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_ranking_lists_delete_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_delete_own"
  ON user_ranking_lists FOR DELETE
  USING (auth.uid() = user_id);

-- FriendsAndFansSystem (PRIVATE — owner-only access)
ALTER TABLE friends_and_fans_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friends_and_fans_systems_select_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_select_own"
  ON friends_and_fans_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_and_fans_systems_insert_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_insert_own"
  ON friends_and_fans_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_and_fans_systems_update_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_update_own"
  ON friends_and_fans_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_and_fans_systems_delete_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_delete_own"
  ON friends_and_fans_systems FOR DELETE
  USING (auth.uid() = user_id);

-- CustomVideoClips (PRIVATE — owner-only access)
ALTER TABLE custom_video_clips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "custom_video_clips_select_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_select_own"
  ON custom_video_clips FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "custom_video_clips_insert_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_insert_own"
  ON custom_video_clips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "custom_video_clips_update_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_update_own"
  ON custom_video_clips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "custom_video_clips_delete_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_delete_own"
  ON custom_video_clips FOR DELETE
  USING (auth.uid() = user_id);

-- PrivatePhotosets (PRIVATE — owner-only access)
ALTER TABLE private_photosets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "private_photosets_select_own" ON private_photosets;
CREATE POLICY "private_photosets_select_own"
  ON private_photosets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "private_photosets_insert_own" ON private_photosets;
CREATE POLICY "private_photosets_insert_own"
  ON private_photosets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "private_photosets_update_own" ON private_photosets;
CREATE POLICY "private_photosets_update_own"
  ON private_photosets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "private_photosets_delete_own" ON private_photosets;
CREATE POLICY "private_photosets_delete_own"
  ON private_photosets FOR DELETE
  USING (auth.uid() = user_id);

-- WhatsappAndSkypeChats (PRIVATE — owner-only access)
ALTER TABLE whatsapp_and_skype_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_select_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_select_own"
  ON whatsapp_and_skype_chats FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_insert_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_insert_own"
  ON whatsapp_and_skype_chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_update_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_update_own"
  ON whatsapp_and_skype_chats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_delete_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_delete_own"
  ON whatsapp_and_skype_chats FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Verification

After applying RLS in Supabase:
1. Public-read tables (posts, comments, etc.): anyone can SELECT, only owner can INSERT/UPDATE/DELETE
2. Private tables (settings, bookmarks, etc.): only owner can do anything
3. Try to update another user's data → should fail for ALL tables
4. Own data should be fully accessible

---

### 4. Query Performance with RLS

**Preventing N+1 queries:** When fetching entities with relationships (e.g., posts with author profiles), use Supabase's join syntax instead of separate queries:

```typescript
// ✅ GOOD: Single query with join (1 query)
const { data } = await supabase
  .from("posts")
  .select("*, profiles!user_id(display_name, avatar_url)")
  .order("created_at", { ascending: false });

// ❌ BAD: Separate queries (N+1 problem)
const { data: posts } = await supabase.from("posts").select("*");
for (const post of posts) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", post.user_id)
    .single();
}
```

**RLS works with joins** — Supabase evaluates RLS policies on each joined table. If the user has SELECT access on both tables, the join works. This is both safer AND faster.

**Common joined queries to use:**
- List pages with author info: `.select("*, profiles!user_id(display_name, avatar_url)")`
- Detail pages with related items: `.select("*, comments(id, text, created_at, profiles!user_id(display_name))")`

---

## Validation

- [ ] RLS enabled on ALL tables (profiles + 32 entity tables)
- [ ] Public content tables have `SELECT USING (true)` for read access
- [ ] Private tables restrict all operations to `auth.uid() = user_id`
- [ ] INSERT/UPDATE/DELETE always restricted to owner via `auth.uid()`
- [ ] Joined queries used instead of N+1 separate queries for related data


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

## Phase 3: 29b - Permissions & RLS

> Source: `docs/phases/29b-permissions.md`

# 29b - Permissions & RLS

> **Purpose:** Define row-level security policies and permission system
> **Input:** entities[], roles[], role_capabilities[], security_requirements[]
> **Output:** RLS policies, permission hooks, role guards

---

## Stop Conditions

- ✗ Entity without RLS policy → BLOCK
- ✗ Role without defined capabilities → BLOCK
- ✗ Route without permission check → BLOCK
- ✗ Sensitive entity without audit logging → BLOCK

---

## Input from CONTEXT.md

```yaml
roles: [user, admin]

role_capabilities:
  user: [read_own, create_own, update_own, delete_own]
  admin: [read_all, create_all, update_all, delete_all]

trust_level: high

entities:
  - User: standard
  - Listing: safety_critical
  - Review: safety_critical
  - Shop: standard
  - Order: safety_critical
  - Payment: standard
  - Subscription: standard
  - Upload: standard
  - Channel: standard
  - Notification: standard
  - Conversation: standard
  - Message: standard
  - GlobalSearchFeature: standard
  - SafeTransactions: standard
  - OwnShopSystem: standard
  - SetYourOwnPrices: standard
  - NoTransactionFees: standard
  - MessagesAndChatSystem: standard
  - ClassifiedAdMarket: standard
  - MemberReviews: standard
  - PrivacyFunctions: standard
  - MediaCloud: standard
  - UserBlockingSystem: standard
  - HumanOperatedFakeCheck: standard
  - MemberReviewsAndRatings: standard
  - FullFeaturedProfiles: standard
  - SellerRatingsAndBuyerReviews: standard
  - UserRankingList: standard
  - FriendsAndFansSystem: standard
  - CustomVideoClips: standard
  - PrivatePhotosets: standard
  - WhatsappAndSkypeChats: standard
```

---

## Tasks (Sequential)

### Task 1: Generate RLS Policies

File: `supabase/policies.sql`

```sql
-- ============================================
-- RLS POLICIES FOR PANTYHUB
-- Generated based on roles and capabilities
-- ============================================

-- Enable RLS on all tables
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_search_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE own_shop_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_your_own_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE no_transaction_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_and_chat_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE classified_ad_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_clouds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocking_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_operated_fake_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_reviews_and_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE full_featured_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_ratings_and_buyer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranking_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends_and_fans_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_video_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_photosets ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_and_skype_chats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE (Special: id = auth.uid())
-- ============================================

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);


-- ============================================
-- USER TABLE
-- ============================================

-- Users can view own User
CREATE POLICY "Users can view own app_users"
ON app_users FOR SELECT
USING (user_id = auth.uid());

-- Users can create own User
CREATE POLICY "Users can create own app_users"
ON app_users FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own User
CREATE POLICY "Users can update own app_users"
ON app_users FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own User
CREATE POLICY "Users can delete own app_users"
ON app_users FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all User
CREATE POLICY "Admins can manage all app_users"
ON app_users FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- LISTING TABLE
-- ============================================

-- Users can view own Listing
CREATE POLICY "Users can view own listings"
ON listings FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Listing
CREATE POLICY "Users can create own listings"
ON listings FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Listing
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Listing
CREATE POLICY "Users can delete own listings"
ON listings FOR DELETE
USING (user_id = auth.uid());


-- SAFETY CRITICAL: Require explicit action confirmation
CREATE POLICY "Safety critical delete requires confirmation"
ON listings FOR DELETE
USING (
  user_id = auth.uid()
  AND (current_setting('app.delete_confirmed', true) = 'true')
);

-- Admins can manage all Listing
CREATE POLICY "Admins can manage all listings"
ON listings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- REVIEW TABLE
-- ============================================

-- Users can view own Review
CREATE POLICY "Users can view own reviews"
ON reviews FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Review
CREATE POLICY "Users can create own reviews"
ON reviews FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Review
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Review
CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
USING (user_id = auth.uid());


-- SAFETY CRITICAL: Require explicit action confirmation
CREATE POLICY "Safety critical delete requires confirmation"
ON reviews FOR DELETE
USING (
  user_id = auth.uid()
  AND (current_setting('app.delete_confirmed', true) = 'true')
);

-- Admins can manage all Review
CREATE POLICY "Admins can manage all reviews"
ON reviews FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- SHOP TABLE
-- ============================================

-- Users can view own Shop
CREATE POLICY "Users can view own shops"
ON shops FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Shop
CREATE POLICY "Users can create own shops"
ON shops FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Shop
CREATE POLICY "Users can update own shops"
ON shops FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Shop
CREATE POLICY "Users can delete own shops"
ON shops FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Shop
CREATE POLICY "Admins can manage all shops"
ON shops FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- ORDER TABLE
-- ============================================

-- Users can view own Order
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Order
CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Order
CREATE POLICY "Users can update own orders"
ON orders FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Order
CREATE POLICY "Users can delete own orders"
ON orders FOR DELETE
USING (user_id = auth.uid());


-- SAFETY CRITICAL: Require explicit action confirmation
CREATE POLICY "Safety critical delete requires confirmation"
ON orders FOR DELETE
USING (
  user_id = auth.uid()
  AND (current_setting('app.delete_confirmed', true) = 'true')
);

-- Admins can manage all Order
CREATE POLICY "Admins can manage all orders"
ON orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- PAYMENT TABLE
-- ============================================

-- Users can view own Payment
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Payment
CREATE POLICY "Users can create own payments"
ON payments FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Payment
CREATE POLICY "Users can update own payments"
ON payments FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Payment
CREATE POLICY "Users can delete own payments"
ON payments FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Payment
CREATE POLICY "Admins can manage all payments"
ON payments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- SUBSCRIPTION TABLE
-- ============================================

-- Users can view own Subscription
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Subscription
CREATE POLICY "Users can create own subscriptions"
ON subscriptions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Subscription
CREATE POLICY "Users can update own subscriptions"
ON subscriptions FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Subscription
CREATE POLICY "Users can delete own subscriptions"
ON subscriptions FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Subscription
CREATE POLICY "Admins can manage all subscriptions"
ON subscriptions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- UPLOAD TABLE
-- ============================================

-- Users can view own Upload
CREATE POLICY "Users can view own uploads"
ON uploads FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Upload
CREATE POLICY "Users can create own uploads"
ON uploads FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Upload
CREATE POLICY "Users can update own uploads"
ON uploads FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Upload
CREATE POLICY "Users can delete own uploads"
ON uploads FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Upload
CREATE POLICY "Admins can manage all uploads"
ON uploads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- CHANNEL TABLE
-- ============================================

-- Users can view own Channel
CREATE POLICY "Users can view own channels"
ON channels FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Channel
CREATE POLICY "Users can create own channels"
ON channels FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Channel
CREATE POLICY "Users can update own channels"
ON channels FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Channel
CREATE POLICY "Users can delete own channels"
ON channels FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Channel
CREATE POLICY "Admins can manage all channels"
ON channels FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- NOTIFICATION TABLE
-- ============================================

-- Users can view own Notification
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Notification
CREATE POLICY "Users can create own notifications"
ON notifications FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Notification
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Notification
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Notification
CREATE POLICY "Admins can manage all notifications"
ON notifications FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- CONVERSATION TABLE
-- ============================================

-- Users can view own Conversation
CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Conversation
CREATE POLICY "Users can create own conversations"
ON conversations FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Conversation
CREATE POLICY "Users can update own conversations"
ON conversations FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Conversation
CREATE POLICY "Users can delete own conversations"
ON conversations FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Conversation
CREATE POLICY "Admins can manage all conversations"
ON conversations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- MESSAGE TABLE
-- ============================================

-- Users can view own Message
CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
USING (user_id = auth.uid());

-- Users can create own Message
CREATE POLICY "Users can create own messages"
ON messages FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own Message
CREATE POLICY "Users can update own messages"
ON messages FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own Message
CREATE POLICY "Users can delete own messages"
ON messages FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all Message
CREATE POLICY "Admins can manage all messages"
ON messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- GLOBALSEARCHFEATURE TABLE
-- ============================================

-- Users can view own GlobalSearchFeature
CREATE POLICY "Users can view own global_search_features"
ON global_search_features FOR SELECT
USING (user_id = auth.uid());

-- Users can create own GlobalSearchFeature
CREATE POLICY "Users can create own global_search_features"
ON global_search_features FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own GlobalSearchFeature
CREATE POLICY "Users can update own global_search_features"
ON global_search_features FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own GlobalSearchFeature
CREATE POLICY "Users can delete own global_search_features"
ON global_search_features FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all GlobalSearchFeature
CREATE POLICY "Admins can manage all global_search_features"
ON global_search_features FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- SAFETRANSACTIONS TABLE
-- ============================================

-- Users can view own SafeTransactions
CREATE POLICY "Users can view own safe_transactions"
ON safe_transactions FOR SELECT
USING (user_id = auth.uid());

-- Users can create own SafeTransactions
CREATE POLICY "Users can create own safe_transactions"
ON safe_transactions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own SafeTransactions
CREATE POLICY "Users can update own safe_transactions"
ON safe_transactions FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own SafeTransactions
CREATE POLICY "Users can delete own safe_transactions"
ON safe_transactions FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all SafeTransactions
CREATE POLICY "Admins can manage all safe_transactions"
ON safe_transactions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- OWNSHOPSYSTEM TABLE
-- ============================================

-- Users can view own OwnShopSystem
CREATE POLICY "Users can view own own_shop_systems"
ON own_shop_systems FOR SELECT
USING (user_id = auth.uid());

-- Users can create own OwnShopSystem
CREATE POLICY "Users can create own own_shop_systems"
ON own_shop_systems FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own OwnShopSystem
CREATE POLICY "Users can update own own_shop_systems"
ON own_shop_systems FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own OwnShopSystem
CREATE POLICY "Users can delete own own_shop_systems"
ON own_shop_systems FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all OwnShopSystem
CREATE POLICY "Admins can manage all own_shop_systems"
ON own_shop_systems FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- SETYOUROWNPRICES TABLE
-- ============================================

-- Users can view own SetYourOwnPrices
CREATE POLICY "Users can view own set_your_own_prices"
ON set_your_own_prices FOR SELECT
USING (user_id = auth.uid());

-- Users can create own SetYourOwnPrices
CREATE POLICY "Users can create own set_your_own_prices"
ON set_your_own_prices FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own SetYourOwnPrices
CREATE POLICY "Users can update own set_your_own_prices"
ON set_your_own_prices FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own SetYourOwnPrices
CREATE POLICY "Users can delete own set_your_own_prices"
ON set_your_own_prices FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all SetYourOwnPrices
CREATE POLICY "Admins can manage all set_your_own_prices"
ON set_your_own_prices FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- NOTRANSACTIONFEES TABLE
-- ============================================

-- Users can view own NoTransactionFees
CREATE POLICY "Users can view own no_transaction_fees"
ON no_transaction_fees FOR SELECT
USING (user_id = auth.uid());

-- Users can create own NoTransactionFees
CREATE POLICY "Users can create own no_transaction_fees"
ON no_transaction_fees FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own NoTransactionFees
CREATE POLICY "Users can update own no_transaction_fees"
ON no_transaction_fees FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own NoTransactionFees
CREATE POLICY "Users can delete own no_transaction_fees"
ON no_transaction_fees FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all NoTransactionFees
CREATE POLICY "Admins can manage all no_transaction_fees"
ON no_transaction_fees FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- MESSAGESANDCHATSYSTEM TABLE
-- ============================================

-- Users can view own MessagesAndChatSystem
CREATE POLICY "Users can view own messages_and_chat_systems"
ON messages_and_chat_systems FOR SELECT
USING (user_id = auth.uid());

-- Users can create own MessagesAndChatSystem
CREATE POLICY "Users can create own messages_and_chat_systems"
ON messages_and_chat_systems FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own MessagesAndChatSystem
CREATE POLICY "Users can update own messages_and_chat_systems"
ON messages_and_chat_systems FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own MessagesAndChatSystem
CREATE POLICY "Users can delete own messages_and_chat_systems"
ON messages_and_chat_systems FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all MessagesAndChatSystem
CREATE POLICY "Admins can manage all messages_and_chat_systems"
ON messages_and_chat_systems FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- CLASSIFIEDADMARKET TABLE
-- ============================================

-- Users can view own ClassifiedAdMarket
CREATE POLICY "Users can view own classified_ad_markets"
ON classified_ad_markets FOR SELECT
USING (user_id = auth.uid());

-- Users can create own ClassifiedAdMarket
CREATE POLICY "Users can create own classified_ad_markets"
ON classified_ad_markets FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own ClassifiedAdMarket
CREATE POLICY "Users can update own classified_ad_markets"
ON classified_ad_markets FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own ClassifiedAdMarket
CREATE POLICY "Users can delete own classified_ad_markets"
ON classified_ad_markets FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all ClassifiedAdMarket
CREATE POLICY "Admins can manage all classified_ad_markets"
ON classified_ad_markets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- MEMBERREVIEWS TABLE
-- ============================================

-- Users can view own MemberReviews
CREATE POLICY "Users can view own member_reviews"
ON member_reviews FOR SELECT
USING (user_id = auth.uid());

-- Users can create own MemberReviews
CREATE POLICY "Users can create own member_reviews"
ON member_reviews FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own MemberReviews
CREATE POLICY "Users can update own member_reviews"
ON member_reviews FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own MemberReviews
CREATE POLICY "Users can delete own member_reviews"
ON member_reviews FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all MemberReviews
CREATE POLICY "Admins can manage all member_reviews"
ON member_reviews FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- PRIVACYFUNCTIONS TABLE
-- ============================================

-- Users can view own PrivacyFunctions
CREATE POLICY "Users can view own privacy_functions"
ON privacy_functions FOR SELECT
USING (user_id = auth.uid());

-- Users can create own PrivacyFunctions
CREATE POLICY "Users can create own privacy_functions"
ON privacy_functions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own PrivacyFunctions
CREATE POLICY "Users can update own privacy_functions"
ON privacy_functions FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own PrivacyFunctions
CREATE POLICY "Users can delete own privacy_functions"
ON privacy_functions FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all PrivacyFunctions
CREATE POLICY "Admins can manage all privacy_functions"
ON privacy_functions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- MEDIACLOUD TABLE
-- ============================================

-- Users can view own MediaCloud
CREATE POLICY "Users can view own media_clouds"
ON media_clouds FOR SELECT
USING (user_id = auth.uid());

-- Users can create own MediaCloud
CREATE POLICY "Users can create own media_clouds"
ON media_clouds FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own MediaCloud
CREATE POLICY "Users can update own media_clouds"
ON media_clouds FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own MediaCloud
CREATE POLICY "Users can delete own media_clouds"
ON media_clouds FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all MediaCloud
CREATE POLICY "Admins can manage all media_clouds"
ON media_clouds FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- USERBLOCKINGSYSTEM TABLE
-- ============================================

-- Users can view own UserBlockingSystem
CREATE POLICY "Users can view own user_blocking_systems"
ON user_blocking_systems FOR SELECT
USING (user_id = auth.uid());

-- Users can create own UserBlockingSystem
CREATE POLICY "Users can create own user_blocking_systems"
ON user_blocking_systems FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own UserBlockingSystem
CREATE POLICY "Users can update own user_blocking_systems"
ON user_blocking_systems FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own UserBlockingSystem
CREATE POLICY "Users can delete own user_blocking_systems"
ON user_blocking_systems FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all UserBlockingSystem
CREATE POLICY "Admins can manage all user_blocking_systems"
ON user_blocking_systems FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- HUMANOPERATEDFAKECHECK TABLE
-- ============================================

-- Users can view own HumanOperatedFakeCheck
CREATE POLICY "Users can view own human_operated_fake_checks"
ON human_operated_fake_checks FOR SELECT
USING (user_id = auth.uid());

-- Users can create own HumanOperatedFakeCheck
CREATE POLICY "Users can create own human_operated_fake_checks"
ON human_operated_fake_checks FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own HumanOperatedFakeCheck
CREATE POLICY "Users can update own human_operated_fake_checks"
ON human_operated_fake_checks FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own HumanOperatedFakeCheck
CREATE POLICY "Users can delete own human_operated_fake_checks"
ON human_operated_fake_checks FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all HumanOperatedFakeCheck
CREATE POLICY "Admins can manage all human_operated_fake_checks"
ON human_operated_fake_checks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- MEMBERREVIEWSANDRATINGS TABLE
-- ============================================

-- Users can view own MemberReviewsAndRatings
CREATE POLICY "Users can view own member_reviews_and_ratings"
ON member_reviews_and_ratings FOR SELECT
USING (user_id = auth.uid());

-- Users can create own MemberReviewsAndRatings
CREATE POLICY "Users can create own member_reviews_and_ratings"
ON member_reviews_and_ratings FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own MemberReviewsAndRatings
CREATE POLICY "Users can update own member_reviews_and_ratings"
ON member_reviews_and_ratings FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own MemberReviewsAndRatings
CREATE POLICY "Users can delete own member_reviews_and_ratings"
ON member_reviews_and_ratings FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all MemberReviewsAndRatings
CREATE POLICY "Admins can manage all member_reviews_and_ratings"
ON member_reviews_and_ratings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- FULLFEATUREDPROFILES TABLE
-- ============================================

-- Users can view own FullFeaturedProfiles
CREATE POLICY "Users can view own full_featured_profiles"
ON full_featured_profiles FOR SELECT
USING (user_id = auth.uid());

-- Users can create own FullFeaturedProfiles
CREATE POLICY "Users can create own full_featured_profiles"
ON full_featured_profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own FullFeaturedProfiles
CREATE POLICY "Users can update own full_featured_profiles"
ON full_featured_profiles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own FullFeaturedProfiles
CREATE POLICY "Users can delete own full_featured_profiles"
ON full_featured_profiles FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all FullFeaturedProfiles
CREATE POLICY "Admins can manage all full_featured_profiles"
ON full_featured_profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- SELLERRATINGSANDBUYERREVIEWS TABLE
-- ============================================

-- Users can view own SellerRatingsAndBuyerReviews
CREATE POLICY "Users can view own seller_ratings_and_buyer_reviews"
ON seller_ratings_and_buyer_reviews FOR SELECT
USING (user_id = auth.uid());

-- Users can create own SellerRatingsAndBuyerReviews
CREATE POLICY "Users can create own seller_ratings_and_buyer_reviews"
ON seller_ratings_and_buyer_reviews FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own SellerRatingsAndBuyerReviews
CREATE POLICY "Users can update own seller_ratings_and_buyer_reviews"
ON seller_ratings_and_buyer_reviews FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own SellerRatingsAndBuyerReviews
CREATE POLICY "Users can delete own seller_ratings_and_buyer_reviews"
ON seller_ratings_and_buyer_reviews FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all SellerRatingsAndBuyerReviews
CREATE POLICY "Admins can manage all seller_ratings_and_buyer_reviews"
ON seller_ratings_and_buyer_reviews FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- USERRANKINGLIST TABLE
-- ============================================

-- Users can view own UserRankingList
CREATE POLICY "Users can view own user_ranking_lists"
ON user_ranking_lists FOR SELECT
USING (user_id = auth.uid());

-- Users can create own UserRankingList
CREATE POLICY "Users can create own user_ranking_lists"
ON user_ranking_lists FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own UserRankingList
CREATE POLICY "Users can update own user_ranking_lists"
ON user_ranking_lists FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own UserRankingList
CREATE POLICY "Users can delete own user_ranking_lists"
ON user_ranking_lists FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all UserRankingList
CREATE POLICY "Admins can manage all user_ranking_lists"
ON user_ranking_lists FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- FRIENDSANDFANSSYSTEM TABLE
-- ============================================

-- Users can view own FriendsAndFansSystem
CREATE POLICY "Users can view own friends_and_fans_systems"
ON friends_and_fans_systems FOR SELECT
USING (user_id = auth.uid());

-- Users can create own FriendsAndFansSystem
CREATE POLICY "Users can create own friends_and_fans_systems"
ON friends_and_fans_systems FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own FriendsAndFansSystem
CREATE POLICY "Users can update own friends_and_fans_systems"
ON friends_and_fans_systems FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own FriendsAndFansSystem
CREATE POLICY "Users can delete own friends_and_fans_systems"
ON friends_and_fans_systems FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all FriendsAndFansSystem
CREATE POLICY "Admins can manage all friends_and_fans_systems"
ON friends_and_fans_systems FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- CUSTOMVIDEOCLIPS TABLE
-- ============================================

-- Users can view own CustomVideoClips
CREATE POLICY "Users can view own custom_video_clips"
ON custom_video_clips FOR SELECT
USING (user_id = auth.uid());

-- Users can create own CustomVideoClips
CREATE POLICY "Users can create own custom_video_clips"
ON custom_video_clips FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own CustomVideoClips
CREATE POLICY "Users can update own custom_video_clips"
ON custom_video_clips FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own CustomVideoClips
CREATE POLICY "Users can delete own custom_video_clips"
ON custom_video_clips FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all CustomVideoClips
CREATE POLICY "Admins can manage all custom_video_clips"
ON custom_video_clips FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- PRIVATEPHOTOSETS TABLE
-- ============================================

-- Users can view own PrivatePhotosets
CREATE POLICY "Users can view own private_photosets"
ON private_photosets FOR SELECT
USING (user_id = auth.uid());

-- Users can create own PrivatePhotosets
CREATE POLICY "Users can create own private_photosets"
ON private_photosets FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own PrivatePhotosets
CREATE POLICY "Users can update own private_photosets"
ON private_photosets FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own PrivatePhotosets
CREATE POLICY "Users can delete own private_photosets"
ON private_photosets FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all PrivatePhotosets
CREATE POLICY "Admins can manage all private_photosets"
ON private_photosets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- WHATSAPPANDSKYPECHATS TABLE
-- ============================================

-- Users can view own WhatsappAndSkypeChats
CREATE POLICY "Users can view own whatsapp_and_skype_chats"
ON whatsapp_and_skype_chats FOR SELECT
USING (user_id = auth.uid());

-- Users can create own WhatsappAndSkypeChats
CREATE POLICY "Users can create own whatsapp_and_skype_chats"
ON whatsapp_and_skype_chats FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update own WhatsappAndSkypeChats
CREATE POLICY "Users can update own whatsapp_and_skype_chats"
ON whatsapp_and_skype_chats FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own WhatsappAndSkypeChats
CREATE POLICY "Users can delete own whatsapp_and_skype_chats"
ON whatsapp_and_skype_chats FOR DELETE
USING (user_id = auth.uid());



-- Admins can manage all WhatsappAndSkypeChats
CREATE POLICY "Admins can manage all whatsapp_and_skype_chats"
ON whatsapp_and_skype_chats FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Task 2: Generate Permission Hooks

File: `lib/permissions/index.ts`

```typescript
import { createClient } from "@/lib/supabase/server";

export type Role = "user" | "admin";
export type Action = "read" | "create" | "update" | "delete";
export type Scope = "own" | "all";

interface Permission {
  action: Action;
  scope: Scope;
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  user: [{ action: "read" as Action, scope: "own" as Scope }, { action: "create" as Action, scope: "own" as Scope }, { action: "update" as Action, scope: "own" as Scope }, { action: "delete" as Action, scope: "own" as Scope }],
  admin: [{ action: "read" as Action, scope: "all" as Scope }, { action: "create" as Action, scope: "all" as Scope }, { action: "update" as Action, scope: "all" as Scope }, { action: "delete" as Action, scope: "all" as Scope }],
};

export async function getCurrentUserRole(): Promise<Role | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (profile?.role as Role) || "user";
}

export function hasPermission(
  role: Role,
  action: Action,
  scope: Scope = "own"
): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.some(
    p => p.action === action && (p.scope === "all" || p.scope === scope)
  );
}

export async function checkPermission(
  action: Action,
  scope: Scope = "own"
): Promise<boolean> {
  const role = await getCurrentUserRole();
  if (!role) return false;
  return hasPermission(role, action, scope);
}

export async function requirePermission(
  action: Action,
  scope: Scope = "own"
): Promise<void> {
  const allowed = await checkPermission(action, scope);
  if (!allowed) {
    throw new Error(`Permission denied: ${action}_${scope}`);
  }
}
```

### Task 3: Generate Route Guards

File: `lib/permissions/guards.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasPermission, Role, Action, Scope } from "./index";

type RouteHandler = (
  request: NextRequest,
  context: { params: Record<string, string> }
) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    return handler(request, context);
  };
}

export function withRole(allowedRoles: Role[], handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Insufficient permissions" } },
        { status: 403 }
      );
    }

    return handler(request, context);
  };
}

export function withPermission(
  action: Action,
  scope: Scope,
  handler: RouteHandler
): RouteHandler {
  return async (request, context) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role as Role || "user";

    if (!hasPermission(userRole, action, scope)) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: `Permission denied: ${action}_${scope}` } },
        { status: 403 }
      );
    }

    return handler(request, context);
  };
}
```

### Task 4: Generate Entity-Specific Policies


#### User Policies

```typescript
// lib/permissions/policies/user.ts

export const UserPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

  // Sensitive fields require additional checks
  sensitiveFields: ["password"],

  canAccessSensitive: (userId: string, ownerId: string, role: Role) => {
    // Only owner or admin can access sensitive fields
    return role === "admin" || userId === ownerId;
  },
};
```


#### Listing Policies

```typescript
// lib/permissions/policies/listing.ts

export const ListingPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Review Policies

```typescript
// lib/permissions/policies/review.ts

export const ReviewPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Shop Policies

```typescript
// lib/permissions/policies/shop.ts

export const ShopPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Order Policies

```typescript
// lib/permissions/policies/order.ts

export const OrderPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Payment Policies

```typescript
// lib/permissions/policies/payment.ts

export const PaymentPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Subscription Policies

```typescript
// lib/permissions/policies/subscription.ts

export const SubscriptionPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Upload Policies

```typescript
// lib/permissions/policies/upload.ts

export const UploadPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Channel Policies

```typescript
// lib/permissions/policies/channel.ts

export const ChannelPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Notification Policies

```typescript
// lib/permissions/policies/notification.ts

export const NotificationPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Conversation Policies

```typescript
// lib/permissions/policies/conversation.ts

export const ConversationPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### Message Policies

```typescript
// lib/permissions/policies/message.ts

export const MessagePolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### GlobalSearchFeature Policies

```typescript
// lib/permissions/policies/global-search-feature.ts

export const GlobalSearchFeaturePolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### SafeTransactions Policies

```typescript
// lib/permissions/policies/safe-transactions.ts

export const SafeTransactionsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### OwnShopSystem Policies

```typescript
// lib/permissions/policies/own-shop-system.ts

export const OwnShopSystemPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### SetYourOwnPrices Policies

```typescript
// lib/permissions/policies/set-your-own-prices.ts

export const SetYourOwnPricesPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### NoTransactionFees Policies

```typescript
// lib/permissions/policies/no-transaction-fees.ts

export const NoTransactionFeesPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### MessagesAndChatSystem Policies

```typescript
// lib/permissions/policies/messages-and-chat-system.ts

export const MessagesAndChatSystemPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### ClassifiedAdMarket Policies

```typescript
// lib/permissions/policies/classified-ad-market.ts

export const ClassifiedAdMarketPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### MemberReviews Policies

```typescript
// lib/permissions/policies/member-reviews.ts

export const MemberReviewsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### PrivacyFunctions Policies

```typescript
// lib/permissions/policies/privacy-functions.ts

export const PrivacyFunctionsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### MediaCloud Policies

```typescript
// lib/permissions/policies/media-cloud.ts

export const MediaCloudPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### UserBlockingSystem Policies

```typescript
// lib/permissions/policies/user-blocking-system.ts

export const UserBlockingSystemPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### HumanOperatedFakeCheck Policies

```typescript
// lib/permissions/policies/human-operated-fake-check.ts

export const HumanOperatedFakeCheckPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### MemberReviewsAndRatings Policies

```typescript
// lib/permissions/policies/member-reviews-and-ratings.ts

export const MemberReviewsAndRatingsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### FullFeaturedProfiles Policies

```typescript
// lib/permissions/policies/full-featured-profiles.ts

export const FullFeaturedProfilesPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### SellerRatingsAndBuyerReviews Policies

```typescript
// lib/permissions/policies/seller-ratings-and-buyer-reviews.ts

export const SellerRatingsAndBuyerReviewsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### UserRankingList Policies

```typescript
// lib/permissions/policies/user-ranking-list.ts

export const UserRankingListPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### FriendsAndFansSystem Policies

```typescript
// lib/permissions/policies/friends-and-fans-system.ts

export const FriendsAndFansSystemPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### CustomVideoClips Policies

```typescript
// lib/permissions/policies/custom-video-clips.ts

export const CustomVideoClipsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### PrivatePhotosets Policies

```typescript
// lib/permissions/policies/private-photosets.ts

export const PrivatePhotosetsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


#### WhatsappAndSkypeChats Policies

```typescript
// lib/permissions/policies/whatsapp-and-skype-chats.ts

export const WhatsappAndSkypeChatsPolicy = {
  canRead: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId;
  },

  canCreate: (userId: string, role: Role) => {
    return hasPermission(role, "create", "own");
  },

  canUpdate: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "update", "own");
  },

  canDelete: (userId: string, ownerId: string, role: Role) => {
    if (role === "admin") return true;
    return userId === ownerId && hasPermission(role, "delete", "own");
  },

};
```


### Task 5: Generate Audit Logging (if trust_level high)


File: `lib/audit/index.ts`

```typescript
import { createClient } from "@/lib/supabase/server";

export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "permission_denied";

interface AuditEntry {
  user_id: string;
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  changes?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  const supabase = await createClient();

  await supabase.from("audit_log").insert({
    ...entry,
    created_at: new Date().toISOString(),
  });
}

// Middleware wrapper for automatic audit logging
export function withAudit<T>(
  action: AuditAction,
  entityType: string,
  handler: () => Promise<T>
): Promise<T> {
  return handler().then(async (result) => {
    // Log successful action
    await logAudit({
      user_id: "current_user_id", // Get from context
      action,
      entity_type: entityType,
    });
    return result;
  });
}
```


---

## Validation Checklist

- [ ] All entities have RLS policies
- [ ] All roles have defined capabilities
- [ ] Permission hooks implemented
- [ ] Route guards available
- [ ] Entity-specific policies created
- [ ] Audit logging implemented
- [ ] No routes without permission checks
- [ ] Sensitive fields protected

---

## Gate C Validation

After this phase, verify:

```bash
# Test RLS policies
supabase db test

# Verify all routes have policies
grep -r "withAuth\|withRole\|withPermission" app/api/

# Check for unprotected routes
# (should return empty)
grep -rL "withAuth\|withRole\|withPermission" app/api/**/route.ts
```

---

## Artifacts

| File | Content |
|------|---------|
| `supabase/policies.sql` | RLS policies |
| `lib/permissions/index.ts` | Permission system |
| `lib/permissions/guards.ts` | Route guards |
| `lib/permissions/policies/*.ts` | Entity policies |
| `lib/audit/index.ts` | Audit logging |

---

**Next Phase:** `10-ux-flows.md`

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

## Phase 4: 30 - Database Triggers & Functions

> Source: `docs/phases/30-triggers.md`

# 30 - Database Triggers & Functions

> **Purpose:** Create database triggers for automatic timestamps and user lifecycle
> **Block:** B — Infrastructure
> **Depends on:** Phase 28 — database-schema (schema), Phase 29 — rls (RLS)

---

## Instructions

### 1. Updated At Trigger Function

This should already exist from Phase 08, but verify:

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. Auto Profile Creation on Signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Updated At Triggers for Entity Tables

```sql
-- Profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_uploads_updated_at
  BEFORE UPDATE ON uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_global_search_features_updated_at
  BEFORE UPDATE ON global_search_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_safe_transactions_updated_at
  BEFORE UPDATE ON safe_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_own_shop_systems_updated_at
  BEFORE UPDATE ON own_shop_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_set_your_own_prices_updated_at
  BEFORE UPDATE ON set_your_own_prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_no_transaction_fees_updated_at
  BEFORE UPDATE ON no_transaction_fees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_messages_and_chat_systems_updated_at
  BEFORE UPDATE ON messages_and_chat_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_classified_ad_markets_updated_at
  BEFORE UPDATE ON classified_ad_markets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_member_reviews_updated_at
  BEFORE UPDATE ON member_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_privacy_functions_updated_at
  BEFORE UPDATE ON privacy_functions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_media_clouds_updated_at
  BEFORE UPDATE ON media_clouds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_blocking_systems_updated_at
  BEFORE UPDATE ON user_blocking_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_human_operated_fake_checks_updated_at
  BEFORE UPDATE ON human_operated_fake_checks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_member_reviews_and_ratings_updated_at
  BEFORE UPDATE ON member_reviews_and_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_full_featured_profiles_updated_at
  BEFORE UPDATE ON full_featured_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_seller_ratings_and_buyer_reviews_updated_at
  BEFORE UPDATE ON seller_ratings_and_buyer_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_ranking_lists_updated_at
  BEFORE UPDATE ON user_ranking_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_friends_and_fans_systems_updated_at
  BEFORE UPDATE ON friends_and_fans_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_custom_video_clips_updated_at
  BEFORE UPDATE ON custom_video_clips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_private_photosets_updated_at
  BEFORE UPDATE ON private_photosets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_whatsapp_and_skype_chats_updated_at
  BEFORE UPDATE ON whatsapp_and_skype_chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Validation

- [ ] `update_updated_at()` function exists
- [ ] `handle_new_user()` function creates profile on signup
- [ ] All tables with `updated_at` have auto-update triggers
- [ ] Triggers fire correctly (test by updating a row)


## Feature Integration

- **Realtime:** Enable realtime on relevant tables: `ALTER PUBLICATION supabase_realtime ADD TABLE ${tables};` — check `docs/features/realtime.md` for which tables need it.
- **Notifications:** Add notifications table to realtime publication: `ALTER PUBLICATION supabase_realtime ADD TABLE notifications;`


---

## Quality Gate: Block B Complete

After Phase 10, run:

```bash
npx tsc --noEmit && npm run build
```

Both must pass before proceeding to Block C.

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

- [ ] `supabase/schema.sql` created

### Structural Contracts

Verify these structural requirements are met:

- `supabase/schema.sql` exists
  - Contains: `CREATE TABLE`
  - Contains: `profiles`

For TypeScript/TSX files, verify exports:
```bash
# Example: grep -c "export" {file} to verify exports exist
```


```bash
test -e "supabase/schema.sql" && echo "✓ supabase/schema.sql" || echo "✗ MISSING: supabase/schema.sql"
```

If any contract fails, fix the file before reporting completion. Do NOT skip contract failures.

---

## Completion Protocol

After all outputs verified:

1. Write your agent state to `docs/build-state/schema.json` (avoids race conditions with parallel agents):
   ```json
   {
     "agentId": "schema",
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
   - Set `agents.schema.status` to `"complete"`
   - Set `agents.schema.completedAt` to current ISO timestamp
   - Set `lastUpdatedByAgent` to `"schema"`
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
   ## [schema] {error-title}
   - **Phase:** {phase-file}
   - **Type:** transient | config | logic | dependency
   - **Severity:** critical | major | minor
   - **Error:** {error message}
   - **Attempted fixes:** {what you tried}
   - **Workaround:** {stub/mock created}
   - **Impact:** {what won't work until this is fixed}
   ```
2. Create a stub/mock that makes the build pass
3. Add to `agents.schema.warnings` in BUILD_STATE.json
4. Continue to the next phase

---

**Agent schema complete.** Report status to orchestrator.
