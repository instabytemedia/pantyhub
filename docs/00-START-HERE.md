# START HERE — PantyHub

> **Read this first.** This document tells you exactly what this project contains and how to build it.

---

## What Is This?

This is an **Execution Pack** — a complete build plan for **PantyHub**. It contains:

- **TypeScript source files** — ready to use (lib/utils.ts, middleware.ts, schema.sql, etc.)
- **Phase documents** (docs/phases/) — step-by-step build instructions, execute them in order
- **Feature documents** (docs/features/) — implementation guides for enabled features
- **Agent bundles** (docs/agents/) — self-contained instructions if using multi-agent mode
- **Business intelligence** (docs/business/) — market analysis, go-to-market, monetization strategy

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Supabase** (Postgres + Auth + Storage)
- **Tailwind CSS** + **shadcn/ui**
- **SWR** for data fetching

## Entities

| Entity | Fields |
|--------|--------|
| User | username, email, password, role |
| Listing | title, description, price, status |
| Review | rating, feedback |
| Shop | name, description |
| Order | listing_id, buyer_id, seller_id, amount, status, payment_intent_id |
| Payment | stripe_payment_id, amount, currency, status, payment_method, description |
| Subscription | stripe_customer_id, stripe_subscription_id, plan_name, price_amount, interval, status, current_period_end |
| Upload | file_name, file_url, file_type, file_size, storage_path, alt_text |
| Channel | name, type |
| Notification | title, message, type, read, action_url, sender_id |
| Conversation | title, is_group, last_message_at |
| Message | content, conversation_id, sender_id, message_type, read_at |
| GlobalSearchFeature | title, description, status, metadata |
| SafeTransactions | title, description, status, metadata |
| OwnShopSystem | title, description, status, metadata |
| SetYourOwnPrices | title, description, status, metadata |
| NoTransactionFees | title, description, status, metadata |
| MessagesAndChatSystem | title, description, status, metadata |
| ClassifiedAdMarket | title, description, status, metadata |
| MemberReviews | title, description, status, metadata |
| PrivacyFunctions | title, description, status, metadata |
| MediaCloud | title, description, status, metadata |
| UserBlockingSystem | title, description, status, metadata |
| HumanOperatedFakeCheck | title, description, status, metadata |
| MemberReviewsAndRatings | title, description, status, metadata |
| FullFeaturedProfiles | title, description, status, metadata |
| SellerRatingsAndBuyerReviews | title, description, status, metadata |
| UserRankingList | title, description, status, metadata |
| FriendsAndFansSystem | title, description, status, metadata |
| CustomVideoClips | title, description, status, metadata |
| PrivatePhotosets | title, description, status, metadata |
| WhatsappAndSkypeChats | title, description, status, metadata |

## Enabled Features

- payments
- uploads
- realtime
- search
- notifications
- messaging
- reviews
- global_search_feature
- auth
- safe_transactions
- own_shop_system
- set_your_own_prices
- no_transaction_fees
- messages_and_chat_system
- classified_ad_market
- member_reviews
- privacy_functions
- media_cloud
- user_blocking_system
- human_operated_fake_check
- member_reviews_and_ratings
- full_featured_profiles
- seller_ratings_and_buyer_reviews
- user_ranking_list
- friends_and_fans_system
- custom_video_clips
- private_photosets
- whatsapp_and_skype_chats

---

## How To Build

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Set up environment
Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
The app works WITHOUT credentials (mock client) — you can build the entire UI first.

### Step 3: Execute phases in order
Open `docs/phases/` and work through each phase sequentially:

```
01-project-init.md        → Project setup
02-dependencies-shadcn.md → UI library setup
03-design-system.md       → Design tokens + colors
04-supabase-stubs.md      → Database client
...
49-shipgate.md            → Final deployment
```

Each phase has:
- Clear instructions
- Code to create/modify
- A validation checklist at the bottom

**Rule:** Complete the validation checklist before moving to the next phase.

### Step 4: Set up database (Phase 28)
When you reach Phase 28, apply `supabase/schema.sql` to your Supabase project.
Until then, the mock client keeps everything working.

---

## Key Files Already Generated

| File | Purpose |
|------|---------|
| `package.json` | Dependencies |
| `supabase/schema.sql` | Complete database schema with RLS |
| `.env.example` | Required environment variables |
| `lib/utils.ts` | cn() utility for Tailwind class merging |
| `lib/utils/fetcher.ts` | SWR data fetcher |
| `lib/utils/format-date.ts` | Date formatting utilities |
| `lib/api/error.ts` | Standardized API error responses |
| `lib/logger/index.ts` | Structured logging |
| `middleware.ts` | Auth route protection |
| `tailwind.config.ts` | Tailwind configuration |
| `app/globals.css` | CSS variables + design tokens |
| `docs/CONTEXT.md` | Full project context (entities, design, business) |
| `docs/DESIGN_SYSTEM.md` | Colors, typography, component patterns |
| `docs/ORCHESTRATION.md` | Multi-agent coordination (if applicable) |
| `docs/PROGRESS.md` | Phase completion tracker |

---

## Important References

- **`docs/CONTEXT.md`** — The single source of truth for entities, design system, and business logic
- **`docs/DESIGN_SYSTEM.md`** — MANDATORY design rules for every UI component
- **`CLAUDE.md` / `.cursorrules`** — AI agent instructions (read automatically by your IDE)
- **`docs/PROGRESS.md`** — Track which phases are done

## Do NOT

- Skip phases — they build on each other
- Hardcode colors — use CSS variables from the design system
- Create files outside the documented structure
- Ignore validation checklists
