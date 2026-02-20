# DevOps Agent — Build Agent

> **Product:** PantyHub
> **Agent ID:** devops
> **Phases:** 10 | **Est. Time:** ~7 min
> **Dependencies:** error-handling, responsive, feature-payments, feature-uploads, feature-realtime, feature-search, feature-notifications, feature-messaging, feature-reviews

SEO, sitemap, performance optimization, caching, developer guide, CI/CD, deployment

---


> **POLISH:** Primary buttons should have `hover:brightness-110 active:scale-[0.98] transition-all` for tactile feedback.

## Pre-Flight Check

Before executing any phases, verify ALL prerequisites:

```bash
test -e "app/(app)/*/page.tsx" && echo "✓ app/(app)/*/page.tsx" || echo "✗ MISSING: app/(app)/*/page.tsx"
test -e "middleware.ts" && echo "✓ middleware.ts" || echo "✗ MISSING: middleware.ts"
```

**Context handoff:** Read per-agent state files to understand what previous agents produced:
- `docs/build-state/error-handling.json` — decisions, warnings, files created
- `docs/build-state/responsive.json` — decisions, warnings, files created
- `docs/build-state/feature-payments.json` — decisions, warnings, files created
- `docs/build-state/feature-uploads.json` — decisions, warnings, files created
- `docs/build-state/feature-realtime.json` — decisions, warnings, files created
- `docs/build-state/feature-search.json` — decisions, warnings, files created
- `docs/build-state/feature-notifications.json` — decisions, warnings, files created
- `docs/build-state/feature-messaging.json` — decisions, warnings, files created
- `docs/build-state/feature-reviews.json` — decisions, warnings, files created

Also read `docs/BUILD_STATE.json` for the global overview (conflict zones, tier progress).

**Cross-agent types:** Read `docs/contracts/shared-types.json` for entity definitions, naming conventions, and design tokens. Do NOT deviate from these conventions.
**Route safety:** Check `routeOverrides` in shared-types.json. If your entity route conflicts with a reserved/feature route, use the override path (e.g., `manage-reviews` instead of `reviews`).

**Dependency hashes:** Record hashes of input files for change detection:
```bash
# app/(app)/*/page.tsx — skip hash (glob pattern)
md5sum "middleware.ts" 2>/dev/null || echo "N/A middleware.ts"
```
Store these in `agents.devops.inputHashes` in BUILD_STATE.json.

**Build check:** Run `npx tsc --noEmit` — must pass before starting.

**Rollback preparation:** Before starting, create a restore point:
```bash
git add -A && git stash push -m "pre-devops"
git stash pop
```
If this agent fails catastrophically, you can rollback with `git stash pop`.

All checks passed? Proceed to Phase 1.

---

## Context

> Extracted from `docs/CONTEXT.md` — only sections relevant to this agent.
> For full details, read `docs/CONTEXT.md`.

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
- `app/sitemap.ts`
- `app/robots.ts`
- `.github/workflows/ci.yml`
- `README.md`

If you need something from another agent's file, read it but DO NOT write to it. If the file is missing or has wrong content, log it as a dependency error in BUILD_STATE.json.

---

## Instructions

Execute all phases below in order. After each phase:
1. Run `npx tsc --noEmit` — fix any errors before continuing
2. Verify the phase's tasks are complete
3. Move to the next phase

---

## Phase 1: 35 - SEO Growth System

> Source: `docs/phases/35-seo.md`

# 35 - SEO Growth System

> **Purpose:** Complete SEO system — metadata, OG images, canonical URLs, JSON-LD, index rules
> **Block:** I — Production
> **Depends on:** All pages created

---

## This Is Not Just Meta Tags

A growth SEO system means: every public page is discoverable, every route has correct index/noindex rules, social sharing works perfectly, and structured data helps search engines understand the content.

---

## Instructions

### 1. Root Metadata with Full Config

Update `app/layout.tsx`:

```typescript
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PantyHub",
    template: `%s | PantyHub`,
  },
  description: "A safe and anonymous marketplace for individuals to buy and sell used panties",
  openGraph: {
    title: "PantyHub",
    description: "A safe and anonymous marketplace for individuals to buy and sell used panties",
    url: siteUrl,
    siteName: "PantyHub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PantyHub",
    description: "A safe and anonymous marketplace for individuals to buy and sell used panties",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};
```

### 2. Per-Page Metadata with Canonical URLs

Every page exports metadata with title, description, AND canonical:

```typescript
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your PantyHub dashboard",
  alternates: {
    canonical: "/dashboard",
  },
};
```

### 3. Index / NoIndex Rules

| Route | Index | Reason |
|-------|-------|--------|
| `/` (landing) | **index** | Main entry point |
| `/login` | **noindex** | Auth page, no SEO value |
| `/signup` | **noindex** | Auth page, no SEO value |
| `/dashboard` | **noindex** | Private content |
| `/settings` | **noindex** | Private content |
| All entity pages | **noindex** | Private user data |
| `/pricing` | **index** | Conversion page |
| `/features` | **index** | Discovery page |
| `/blog/*` | **index** | Content pages |

For noindex pages:
```typescript
export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};
```

### 4. OpenGraph Images

Create `app/opengraph-image.tsx` (or `opengraph-image.png`):

```typescript
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PantyHub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}>
        <h1 style={{ fontSize: 64, fontWeight: 700 }}>PantyHub</h1>
        <p style={{ fontSize: 28, color: "#a1a1aa" }}>A safe and anonymous marketplace for individuals to buy and sell used panties</p>
      </div>
    ),
    { ...size }
  );
}
```

### 5. JSON-LD Structured Data

Add to landing page (`app/page.tsx` or `app/(public)/page.tsx`):

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "PantyHub",
      description: "A safe and anonymous marketplace for individuals to buy and sell used panties",
      url: process.env.NEXT_PUBLIC_APP_URL,
      applicationCategory: "WebApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    }),
  }}
/>
```

### 6. Pages to Update

| Page | Title | Description | Index |
|------|-------|-------------|-------|
| Landing | PantyHub | A safe and anonymous marketplace for individuals to buy and sell used panties | yes |
| Login | Sign In | Sign in to PantyHub | no |
| Signup | Create Account | Create your PantyHub account | no |
| Dashboard | Dashboard | Your PantyHub dashboard | no |
| Settings | Settings | Manage your account settings | no |
| 404 | Not Found | Page not found | no |

### 7. favicon.ico + Apple Touch Icon

Ensure these exist in `app/`:
- `favicon.ico`
- `apple-icon.png` (180x180)
- `icon.png` (32x32)

---

## Validation

- [ ] Root metadata has `metadataBase` set
- [ ] Every page has title, description, and canonical URL
- [ ] NoIndex applied to all private/auth routes
- [ ] OpenGraph image generates correctly (visit /opengraph-image)
- [ ] JSON-LD structured data on landing page
- [ ] favicon.ico exists
- [ ] Social sharing preview works (check with og-image debugger)
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

## Phase 2: 35b - Sitemap & Robots.txt (SEO-Aware)

> Source: `docs/phases/35b-sitemap.md`

# 35b - Sitemap & Robots.txt (SEO-Aware)

> **Purpose:** Only public pages in sitemap. All authenticated routes blocked. Proper crawl directives.
> **Block:** I — Production
> **Depends on:** Phase 35 (SEO metadata), Phase 06 (landing page)
> **Rule:** Sitemap = ONLY public pages. Robots = BLOCK all auth'd routes.

---

## Index Rules Recap

Before building the sitemap, understand what gets indexed:

| Route | Public? | In Sitemap? | Indexed? |
|-------|---------|-------------|----------|
| / (Landing) | Yes | Yes | Yes |
| /login | Yes | Yes | Yes (noindex optional) |
| /signup | Yes | Yes | Yes (noindex optional) |
| /pricing | Yes | Yes | Yes |
| /features | Yes | Yes | Yes |
| /terms | Yes | Yes | Yes |
| /privacy | Yes | Yes | Yes |
| /dashboard | No | No | No |
| /settings | No | No | No |
| /users | No | No | No |
| /listings | No | No | No |
| /reviews | No | No | No |
| /shops | No | No | No |
| /orders | No | No | No |
| /payments | No | No | No |
| /subscriptions | No | No | No |
| /uploads | No | No | No |
| /channels | No | No | No |
| /notifications | No | No | No |
| /conversations | No | No | No |
| /messages | No | No | No |
| /global-search-features | No | No | No |
| /safe-transactions | No | No | No |
| /own-shop-systems | No | No | No |
| /set-your-own-prices | No | No | No |
| /no-transaction-fees | No | No | No |
| /messages-and-chat-systems | No | No | No |
| /classified-ad-markets | No | No | No |
| /member-reviews | No | No | No |
| /privacy-functions | No | No | No |
| /media-clouds | No | No | No |
| /user-blocking-systems | No | No | No |
| /human-operated-fake-checks | No | No | No |
| /member-reviews-and-ratings | No | No | No |
| /full-featured-profiles | No | No | No |
| /seller-ratings-and-buyer-reviews | No | No | No |
| /user-ranking-lists | No | No | No |
| /friends-and-fans-systems | No | No | No |
| /custom-video-clips | No | No | No |
| /private-photosets | No | No | No |
| /whatsapp-and-skype-chats | No | No | No |
| /api/* | No | No | No |

---

## Instructions

### 1. Sitemap

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // ONLY public pages — never include authenticated routes
  const publicPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.1,
    },
  ];

  return publicPages;
}
```

### 2. Robots.txt

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/settings",
          "/api/",
          "/users",
          "/listings",
          "/reviews",
          "/shops",
          "/orders",
          "/payments",
          "/subscriptions",
          "/uploads",
          "/channels",
          "/notifications",
          "/conversations",
          "/messages",
          "/global-search-features",
          "/safe-transactions",
          "/own-shop-systems",
          "/set-your-own-prices",
          "/no-transaction-fees",
          "/messages-and-chat-systems",
          "/classified-ad-markets",
          "/member-reviews",
          "/privacy-functions",
          "/media-clouds",
          "/user-blocking-systems",
          "/human-operated-fake-checks",
          "/member-reviews-and-ratings",
          "/full-featured-profiles",
          "/seller-ratings-and-buyer-reviews",
          "/user-ranking-lists",
          "/friends-and-fans-systems",
          "/custom-video-clips",
          "/private-photosets",
          "/whatsapp-and-skype-chats",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### 3. Dynamic Sitemap (if public entity pages exist)

If any entity has public-facing pages (e.g., public profiles, public listings), add them dynamically:

```typescript
// Only if you have public entity pages:
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supabase = await createClient();

  const staticPages = [
    // ... static pages from above
  ];

  // Example: public profiles
  // const { data: profiles } = await supabase
  //   .from("profiles")
  //   .select("username, updated_at")
  //   .eq("is_public", true);
  //
  // const profilePages = (profiles || []).map((p) => ({
  //   url: `${baseUrl}/user/${p.username}`,
  //   lastModified: new Date(p.updated_at),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.6,
  // }));

  return [...staticPages /*, ...profilePages */];
}
```

### 4. Verify No Auth Routes Leak

After creating both files, verify:

```bash
# Build and check sitemap output
npm run build

# Start server and verify
npm run start &
sleep 3

# Check sitemap — should ONLY contain public URLs
curl -s http://localhost:3000/sitemap.xml | grep -E "/<loc>"

# Check robots — should block all auth routes
curl -s http://localhost:3000/robots.txt

# Kill server
kill %1
```

**Expected robots.txt output:**
```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /settings
Disallow: /api/
Disallow: /users
Disallow: /listings
Disallow: /reviews
Disallow: /shops
Disallow: /orders
Disallow: /payments
Disallow: /subscriptions
Disallow: /uploads
Disallow: /channels
Disallow: /notifications
Disallow: /conversations
Disallow: /messages
Disallow: /global-search-features
Disallow: /safe-transactions
Disallow: /own-shop-systems
Disallow: /set-your-own-prices
Disallow: /no-transaction-fees
Disallow: /messages-and-chat-systems
Disallow: /classified-ad-markets
Disallow: /member-reviews
Disallow: /privacy-functions
Disallow: /media-clouds
Disallow: /user-blocking-systems
Disallow: /human-operated-fake-checks
Disallow: /member-reviews-and-ratings
Disallow: /full-featured-profiles
Disallow: /seller-ratings-and-buyer-reviews
Disallow: /user-ranking-lists
Disallow: /friends-and-fans-systems
Disallow: /custom-video-clips
Disallow: /private-photosets
Disallow: /whatsapp-and-skype-chats

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## Validation

- [ ] `app/sitemap.ts` exists and returns ONLY public pages
- [ ] `app/robots.ts` exists with proper disallow rules
- [ ] `/sitemap.xml` contains NO authenticated routes (dashboard, settings, entities)
- [ ] `/robots.txt` disallows: /dashboard, /settings, /api/, /users, /listings, /reviews, /shops, /orders, /payments, /subscriptions, /uploads, /channels, /notifications, /conversations, /messages, /global-search-features, /safe-transactions, /own-shop-systems, /set-your-own-prices, /no-transaction-fees, /messages-and-chat-systems, /classified-ad-markets, /member-reviews, /privacy-functions, /media-clouds, /user-blocking-systems, /human-operated-fake-checks, /member-reviews-and-ratings, /full-featured-profiles, /seller-ratings-and-buyer-reviews, /user-ranking-lists, /friends-and-fans-systems, /custom-video-clips, /private-photosets, /whatsapp-and-skype-chats
- [ ] Sitemap includes correct priorities (landing=1, pricing=0.9, legal=0.1)
- [ ] Sitemap includes changeFrequency for each page
- [ ] baseUrl uses NEXT_PUBLIC_APP_URL env var
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

## Phase 3: 36 - Performance (Hard Requirements)

> Source: `docs/phases/36-performance.md`

# 36 - Performance (Hard Requirements)

> **Purpose:** Measurable performance targets — first load < 300KB, zero CLS, zero hydration errors
> **Block:** H — Hardening
> **Depends on:** All feature phases complete

---

## Hard Requirements (Not Optional)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| First Load JS | **< 300KB** per route | `npm run build` output |
| Cumulative Layout Shift | **0** | Visual inspection during load |
| Hydration Errors | **0** | Browser console (no red errors) |
| Largest Contentful Paint | **< 2.5s** | Lighthouse |
| No `<img>` tags | **0 occurrences** | Search codebase |

---

## Instructions

### 1. Image Optimization — Everywhere

Replace ALL `<img>` tags with Next.js Image:

```bash
# Search for violations
grep -r "<img" app/ components/ --include="*.tsx" --include="*.ts"
```

Every image must use:
```typescript
import Image from "next/image";

<Image
  src={imageUrl}
  alt="Descriptive alt text"
  width={400}
  height={300}
  className="rounded-lg object-cover"
  loading="lazy"  // below fold
  priority         // above fold (hero, avatar)
/>
```

**Rules:**
- Hero images: `priority` (preloaded)
- All other images: `loading="lazy"`
- Always provide `width` and `height` (prevents CLS)
- Always provide meaningful `alt` text

### 2. Dynamic Imports for Heavy Components

Any component > 50KB or that uses heavy libraries:

```typescript
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false,
});

const Chart = dynamic(() => import("@/components/chart"), {
  loading: () => <Skeleton className="h-48" />,
});
```

**Candidates for dynamic import:**
- Rich text editors
- Chart/graph components
- Map components
- Code editors
- PDF viewers
- Heavy modals with complex content

### 3. Server Components Audit

Search for unnecessary "use client":

```bash
grep -r '"use client"' app/ components/ --include="*.tsx" -l
```

For each file with "use client", verify it actually needs it:
- Uses `useState`, `useEffect`, `useRef` → **keep "use client"**
- Uses `onClick`, `onChange`, `onSubmit` → **keep "use client"**
- Only renders data from props → **remove "use client"**
- Only renders children → **remove "use client"**

### 4. Layout Shift Prevention (CLS = 0)

Common CLS causes and fixes:

| Cause | Fix |
|-------|-----|
| Images without dimensions | Always set `width` and `height` |
| Fonts loading late | Use `next/font` with `display: swap` |
| Content popping in | Use matching skeleton layouts |
| Dynamic content above fold | Reserve space with min-height |

### 5. Hydration Error Prevention

Common causes and fixes:

| Cause | Fix |
|-------|-----|
| Date/time rendering | Use `useEffect` for client-side dates |
| `typeof window` checks | Use `useEffect` or dynamic import |
| Random values | Generate on client with `useEffect` |
| Extension-injected HTML | Ignore — not your bug |

```typescript
// BAD: causes hydration mismatch
<p>{new Date().toLocaleDateString()}</p>

// GOOD: renders on client only
const [dateStr, setDateStr] = useState("");
useEffect(() => {
  setDateStr(new Date().toLocaleDateString());
}, []);
<p>{dateStr || <Skeleton className="h-4 w-24" />}</p>
```

### 6. Bundle Analysis

```bash
ANALYZE=true npm run build
# or
npx @next/bundle-analyzer
```

Check the build output table. Every route should show < 300KB First Load JS.

If any route exceeds 300KB:
1. Find the heaviest import
2. Dynamic import it
3. Tree-shake unused exports
4. Check for duplicate dependencies

### 7. SWR Performance Config

```typescript
const { data } = useSWR(key, fetcher, {
  revalidateOnFocus: false,     // Don't refetch on tab focus
  revalidateOnReconnect: true,  // Refetch when coming back online
  dedupingInterval: 5000,       // Dedupe requests within 5s
  keepPreviousData: true,       // Show stale data while revalidating
});
```

### 8. React.memo for Expensive List Items

Any component rendered inside a `.map()` loop should be memoized:

```typescript
import { memo } from "react";

// Card rendered for each item in a list
const ItemCard = memo(function ItemCard({ item }: { item: Item }) {
  return (
    <div className="glass p-4 rounded-xl card-hover">
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
    </div>
  );
});

// Parent — renders list of cards
function ItemList({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

**When to use `memo`:**
- Components in `.map()` loops with 10+ items
- Components that receive complex objects as props
- Components with expensive rendering (charts, formatted text)

**When NOT to use `memo`:**
- Components that always re-render with new props
- Components that are already fast (< 1ms render)
- Components rendered once (not in loops)

### 9. useMemo / useCallback for Derived Data

```typescript
// BAD: recalculates on every render
function Dashboard({ items }: { items: Item[] }) {
  const stats = {
    total: items.length,
    active: items.filter((i) => i.status === "active").length,
    recent: items.filter((i) => isRecent(i.created_at)).length,
  };
  // ...
}

// GOOD: only recalculates when items change
function Dashboard({ items }: { items: Item[] }) {
  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((i) => i.status === "active").length,
    recent: items.filter((i) => isRecent(i.created_at)).length,
  }), [items]);
  // ...
}
```

**Use `useMemo` for:**
- Filtering/sorting large arrays (> 100 items)
- Computing aggregates/stats from data
- Derived state that depends on multiple values

**Use `useCallback` for:**
- Event handlers passed to memoized children
- Functions passed as deps to `useEffect`

### 10. Route Prefetching

Next.js prefetches `<Link>` routes automatically. For programmatic navigation, prefetch manually:

```typescript
import { useRouter } from "next/navigation";

function ItemCard({ item }: { item: Item }) {
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => router.prefetch(`/items/${item.id}`)}
      onClick={() => router.push(`/items/${item.id}`)}
      className="cursor-pointer card-hover"
    >
      {/* ... */}
    </div>
  );
}
```

**Prefetch rules:**
- `<Link>` handles prefetch automatically — no action needed
- For `router.push()` on hover/focus, add `router.prefetch()`
- Dashboard cards that link to detail pages = prefetch on hover
- Don't prefetch everything — only likely navigation targets

### 11. Code Splitting by Route

Keep route-specific code in route files, not in shared modules:

```
✅ GOOD: Each route loads only what it needs
app/dashboard/page.tsx    → imports DashboardChart (dynamic)
app/settings/page.tsx     → imports SettingsForm
app/items/[id]/page.tsx   → imports ItemDetail

❌ BAD: Giant shared barrel export
lib/components/index.ts   → exports everything (DashboardChart, SettingsForm, ItemDetail, ...)
```

**Rules:**
- No barrel exports (`index.ts`) that re-export entire directories
- Import directly: `import { Button } from "@/components/ui/button"` not `from "@/components/ui"`
- Heavy libraries (chart.js, date-fns, etc.) only imported where used

### 12. Skeleton Matching

Every loading state must match the final layout dimensions:

```tsx
// loading.tsx for a list page
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton matches actual header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      {/* Grid skeleton matches actual grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
```

---

## Validation

- [ ] `grep -r "<img" app/ components/` returns zero results
- [ ] Every image uses Next.js Image with width/height
- [ ] Heavy components use dynamic import
- [ ] No unnecessary "use client" directives
- [ ] `npm run build` — every route < 300KB First Load JS
- [ ] Zero hydration errors in browser console
- [ ] Zero visible layout shift during navigation
- [ ] SWR configured with dedupe and keepPreviousData
- [ ] List item components wrapped in `React.memo`
- [ ] Expensive computations use `useMemo`
- [ ] Event handlers for memoized children use `useCallback`
- [ ] Hover prefetch on cards linking to detail pages
- [ ] No barrel re-exports pulling entire directories
- [ ] Loading skeletons match final layout dimensions
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

## Phase 4: 36b - Caching Strategy

> Source: `docs/phases/36b-caching.md`

# 36b - Caching Strategy

> **Purpose:** Implement appropriate caching for data fetching
> **Block:** H — Hardening
> **Depends on:** Phase 14 — entity-hooks (SWR hooks)

---

## Instructions

### 1. SWR Configuration

Create `lib/swr-config.ts` with tuned settings:

```typescript
export const swrConfig = {
  // Don't refetch when user returns to tab (reduces unnecessary API calls)
  revalidateOnFocus: false,
  // Do refetch when network reconnects (user may have stale data)
  revalidateOnReconnect: true,
  // Retry failed requests 3 times with exponential backoff
  errorRetryCount: 3,
  // Deduplicate identical requests within 5 seconds
  dedupingInterval: 5000,
  // Keep previous data while revalidating (smoother UX)
  keepPreviousData: true,
};
```

### 2. SWR Provider

Wrap the app with SWR config so all hooks inherit defaults:

```typescript
"use client";
import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr-config";

// Import the shared fetcher from Phase 25 (lib/utils/fetcher.ts)
import { fetcher } from "@/lib/utils/fetcher";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ ...swrConfig, fetcher }}>
      {children}
    </SWRConfig>
  );
}
```

Add `<SWRProvider>` in your root layout inside `<ThemeProvider>`.

### 3. Entity-Specific Cache Keys

Use consistent, parameterized cache keys for all entity hooks:

```typescript
// List with filters
const { data, error, isLoading } = useSWR(
  `/api/entities?page=${page}&search=${search}`
);

// Single entity by ID
const { data: entity } = useSWR(
  id ? `/api/entities/${id}` : null // null key = don't fetch
);

// Conditional fetching (only when dependencies are ready)
const { data: relatedItems } = useSWR(
  entity?.categoryId ? `/api/categories/${entity.categoryId}/items` : null
);
```

**Key pattern:** Always use the API path as the cache key. This makes cache invalidation predictable.

### 4. Optimistic Updates for Mutations

For create/update/delete, update SWR cache optimistically so the UI updates instantly:

```typescript
import { mutate } from "swr";

// === CREATE ===
async function createEntity(data: CreateEntityInput) {
  // Optimistically add to list
  mutate(
    "/api/entities",
    (current: Entity[] | undefined) => [
      ...(current || []),
      { ...data, id: "temp-id", created_at: new Date().toISOString() }
    ],
    { revalidate: false }
  );

  try {
    const result = await fetch("/api/entities", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(r => r.json());

    // Replace optimistic data with real data
    mutate("/api/entities");
    return result;
  } catch (error) {
    // Rollback on failure
    mutate("/api/entities");
    throw error;
  }
}

// === UPDATE ===
async function updateEntity(id: string, data: Partial<Entity>) {
  // Optimistically update in list
  mutate(
    "/api/entities",
    (current: Entity[] | undefined) =>
      current?.map(e => e.id === id ? { ...e, ...data } : e),
    { revalidate: false }
  );

  // Also update the detail cache
  mutate(
    `/api/entities/${id}`,
    (current: Entity | undefined) => current ? { ...current, ...data } : current,
    { revalidate: false }
  );

  await fetch(`/api/entities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  // Revalidate both caches
  mutate("/api/entities");
  mutate(`/api/entities/${id}`);
}

// === DELETE ===
async function deleteEntity(id: string) {
  // Optimistically remove from list
  mutate(
    "/api/entities",
    (current: Entity[] | undefined) => current?.filter(e => e.id !== id),
    { revalidate: false }
  );

  await fetch(`/api/entities/${id}`, { method: "DELETE" });
  mutate("/api/entities");
}
```

### 5. Server-Side Cache Invalidation

Use Next.js `revalidateTag` and `revalidatePath` for server-side cache control:

```typescript
// In API route handlers — tag your fetches
import { revalidateTag, revalidatePath } from "next/cache";

// When fetching in Server Components, tag the request:
const data = await fetch("https://api.example.com/data", {
  next: { tags: ["entities"] }
});

// In mutation API routes, invalidate relevant tags:
export async function POST(req: Request) {
  // ... create entity ...

  revalidateTag("entities");          // Invalidate all fetches tagged "entities"
  revalidatePath("/dashboard");        // Revalidate specific page
  revalidatePath("/entities", "page"); // Revalidate entities layout

  return NextResponse.json({ data: newEntity });
}
```

### 6. Static Page Generation

For content that rarely changes, use `generateStaticParams` for build-time rendering:

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// ISR: revalidate every hour
export const revalidate = 3600;
```

### 7. API Response Caching Headers

Set appropriate `Cache-Control` headers on API routes for CDN/browser caching:

```typescript
// Public data (landing page stats, public listings)
export async function GET() {
  const data = await fetchPublicData();

  return NextResponse.json({ data }, {
    headers: {
      // Cache for 60s, serve stale for 120s while revalidating
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}

// Private data (user-specific) — no shared caching
export async function GET() {
  const data = await fetchUserData(userId);

  return NextResponse.json({ data }, {
    headers: {
      // Only browser cache, revalidate every time
      "Cache-Control": "private, no-cache",
    },
  });
}
```

### 8. Stale-While-Revalidate Pattern

The SWR (Stale-While-Revalidate) pattern works at multiple levels:

```
1. Browser level: Cache-Control headers with stale-while-revalidate
   → CDN serves stale response instantly, fetches fresh in background

2. Client level: SWR library with keepPreviousData
   → Shows cached data immediately, updates when fresh data arrives

3. Server level: Next.js ISR with revalidate
   → Serves static page, regenerates in background after TTL

Result: Users always see instant responses, data is eventually consistent.
```

---

## Validation

- [ ] SWR config applied consistently via SWRProvider
- [ ] All entity hooks use parameterized cache keys (`/api/entities/${id}`)
- [ ] Optimistic updates work for create, update, and delete
- [ ] Cache invalidation triggers after mutations (both list and detail)
- [ ] Server-side `revalidateTag`/`revalidatePath` used in mutation routes
- [ ] Public pages use ISR with `revalidate` where appropriate
- [ ] API routes set appropriate `Cache-Control` headers
- [ ] Private/user-specific routes use `Cache-Control: private, no-cache`
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

## Phase 5: 36c - Image Optimization

> Source: `docs/phases/36c-image-optimization.md`

# 36c - Image Optimization

> **Purpose:** Every image loads fast, looks sharp, and causes zero layout shift — Next.js Image everywhere, blur placeholders, responsive sizing, CDN-ready
> **Block:** F — Production
> **Depends on:** Performance (Phase 46)

---

## 1. Next.js Image Config

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Add other image hosts as needed
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
```

---

## 2. Image Component Patterns

### Hero Image (Above Fold)
```tsx
import Image from "next/image";

<Image
  src={heroImage}
  alt="PantyHub hero"
  width={1200}
  height={630}
  priority                    // Preloaded — no lazy loading
  quality={85}
  className="w-full h-auto rounded-xl object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

### Card Thumbnail (Below Fold)
```tsx
<Image
  src={item.thumbnail_url || "/placeholder.svg"}
  alt={item.name}
  width={400}
  height={300}
  loading="lazy"              // Default — lazy loaded
  className="w-full h-48 object-cover rounded-t-lg"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Avatar
```tsx
<Image
  src={user.avatar_url || "/default-avatar.svg"}
  alt={user.display_name}
  width={40}
  height={40}
  className="rounded-full object-cover"
  sizes="40px"
/>
```

### Full-Width Banner
```tsx
<div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
  <Image
    src={bannerUrl}
    alt="Banner"
    fill                       // Fill parent container
    className="object-cover"
    sizes="100vw"
    priority
  />
</div>
```

---

## 3. Blur Placeholder Pattern

For user-uploaded images, generate blur data URLs server-side:

```typescript
// lib/image-utils.ts

/**
 * Generate a tiny blur placeholder (data URL)
 * Use for uploaded images stored in Supabase
 */
export function getBlurPlaceholder(color?: string): string {
  // Solid color SVG placeholder (instant, no extra request)
  const c = color || "e2e8f0";
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect fill="#${c}" width="8" height="8"/></svg>`
  ).toString("base64")}`;
}
```

Usage:
```tsx
<Image
  src={item.image_url}
  alt={item.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={getBlurPlaceholder()}
  className="rounded-lg object-cover"
/>
```

For static images in `public/`, Next.js auto-generates blur placeholders when you import them:
```tsx
import heroImage from "@/public/hero.jpg";

<Image
  src={heroImage}
  alt="Hero"
  placeholder="blur"     // Auto blur from static import
  priority
/>
```

---

## 4. Responsive Image Sizes Guide

| Context | `sizes` Value |
|---------|----------------|
| Full width | `100vw` |
| Content column | `(max-width: 768px) 100vw, 720px` |
| 2-column grid | `(max-width: 640px) 100vw, 50vw` |
| 3-column grid | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| Sidebar image | `(max-width: 1024px) 100vw, 300px` |
| Avatar (fixed) | `40px` or `64px` |
| Thumbnail | `(max-width: 640px) 50vw, 200px` |

**Always provide `sizes`** when width is responsive. Without it, Next.js assumes 100vw and serves oversized images.

---

## 5. Fallback + Error Handling

```tsx
// components/safe-image.tsx
"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function SafeImage({ fallbackSrc = "/placeholder.svg", className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : props.src}
      onError={() => setError(true)}
      className={cn(className, error && "opacity-60")}
    />
  );
}
```

---

## 6. SVG Placeholder for Missing Images

```tsx
// public/placeholder.svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect fill="hsl(var(--muted))" width="400" height="300"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="hsl(var(--muted-foreground))" font-family="system-ui" font-size="14">
    No image
  </text>
</svg>
```

---

## 7. Image Upload Size Optimization

Before uploading to Supabase Storage, resize on the client:

```typescript
// lib/resize-image.ts
export async function resizeImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Resize failed"))),
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
```

Usage before upload:
```typescript
const resized = await resizeImage(file, 1200);
const resizedFile = new File([resized], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
await uploadFile(resizedFile, "images");
```

---

## 8. Font Optimization

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",       // Prevent FOIT (flash of invisible text)
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Validation

- [ ] Zero `<img>` tags in codebase — all use Next.js Image
- [ ] All images have explicit `width` + `height` (or `fill`)
- [ ] Hero/above-fold images have `priority`
- [ ] Below-fold images have `loading="lazy"` (default)
- [ ] `sizes` attribute matches layout context
- [ ] `next.config.ts` includes all image host domains
- [ ] Blur placeholders used for user-uploaded images
- [ ] `SafeImage` component handles broken URLs with fallback
- [ ] Client-side resize before upload (max 1200px, WebP)
- [ ] Fonts use `next/font` with `display: "swap"`
- [ ] `placeholder.svg` exists for missing images
- [ ] AVIF + WebP formats enabled in config


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

## Phase 6: 36d - Performance

> Source: `docs/phases/36d-advanced-performance.md`

# 36d - Performance

> **Purpose:** Optimize performance, implement caching, analyze bundles
> **Input:** entities[], features[], scaling_expectation, device_priority
> **Output:** Cache config, optimization hooks, bundle analysis

---

## Stop Conditions

- ✗ First Load JS > 300KB → BLOCK
- ✗ LCP > 2.5s on target device → BLOCK
- ✗ No caching strategy for lists → BLOCK
- ✗ Images without optimization → BLOCK

---

## Input from CONTEXT.md

```yaml
device_priority: both
scaling_expectation: prototype

entities:
  - User: caching=moderate
  - Listing: caching=moderate
  - Review: caching=moderate
  - Shop: caching=moderate
  - Order: caching=moderate
  - Payment: caching=moderate
  - Subscription: caching=moderate
  - Upload: caching=moderate
  - Channel: caching=moderate
  - Notification: caching=none
  - Conversation: caching=moderate
  - Message: caching=none
  - GlobalSearchFeature: caching=moderate
  - SafeTransactions: caching=moderate
  - OwnShopSystem: caching=moderate
  - SetYourOwnPrices: caching=moderate
  - NoTransactionFees: caching=moderate
  - MessagesAndChatSystem: caching=none
  - ClassifiedAdMarket: caching=moderate
  - MemberReviews: caching=moderate
  - PrivacyFunctions: caching=moderate
  - MediaCloud: caching=moderate
  - UserBlockingSystem: caching=moderate
  - HumanOperatedFakeCheck: caching=moderate
  - MemberReviewsAndRatings: caching=moderate
  - FullFeaturedProfiles: caching=aggressive
  - SellerRatingsAndBuyerReviews: caching=moderate
  - UserRankingList: caching=moderate
  - FriendsAndFansSystem: caching=moderate
  - CustomVideoClips: caching=moderate
  - PrivatePhotosets: caching=moderate
  - WhatsappAndSkypeChats: caching=moderate

features:
  realtime: false
  uploads: false
```

---

## Tasks (Sequential)

### Task 1: Generate Caching Configuration

File: `lib/cache/config.ts`

```typescript
export interface CacheConfig {
  entity: string;
  strategy: "none" | "moderate" | "aggressive";
  ttl: number; // seconds
  staleWhileRevalidate: boolean;
  tags: string[];
}

export const CACHE_CONFIG: Record<string, CacheConfig> = {
  "user": {
    entity: "User",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["user", "user"],
  },
  "listing": {
    entity: "Listing",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["listing", "user"],
  },
  "review": {
    entity: "Review",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["review", "user"],
  },
  "shop": {
    entity: "Shop",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["shop", "user"],
  },
  "order": {
    entity: "Order",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["order", "user"],
  },
  "payment": {
    entity: "Payment",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["payment", "user"],
  },
  "subscription": {
    entity: "Subscription",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["subscription", "user"],
  },
  "upload": {
    entity: "Upload",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["upload", "user"],
  },
  "channel": {
    entity: "Channel",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["channel", "user"],
  },
  "notification": {
    entity: "Notification",
    strategy: "none",
    ttl: 0,
    staleWhileRevalidate: false,
    tags: ["notification", "user"],
  },
  "conversation": {
    entity: "Conversation",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["conversation", "user"],
  },
  "message": {
    entity: "Message",
    strategy: "none",
    ttl: 0,
    staleWhileRevalidate: false,
    tags: ["message", "user"],
  },
  "global_search_feature": {
    entity: "GlobalSearchFeature",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["global_search_feature", "user"],
  },
  "safe_transactions": {
    entity: "SafeTransactions",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["safe_transactions", "user"],
  },
  "own_shop_system": {
    entity: "OwnShopSystem",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["own_shop_system", "user"],
  },
  "set_your_own_prices": {
    entity: "SetYourOwnPrices",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["set_your_own_prices", "user"],
  },
  "no_transaction_fees": {
    entity: "NoTransactionFees",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["no_transaction_fees", "user"],
  },
  "messages_and_chat_system": {
    entity: "MessagesAndChatSystem",
    strategy: "none",
    ttl: 0,
    staleWhileRevalidate: false,
    tags: ["messages_and_chat_system", "user"],
  },
  "classified_ad_market": {
    entity: "ClassifiedAdMarket",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["classified_ad_market", "user"],
  },
  "member_reviews": {
    entity: "MemberReviews",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["member_reviews", "user"],
  },
  "privacy_functions": {
    entity: "PrivacyFunctions",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["privacy_functions", "user"],
  },
  "media_cloud": {
    entity: "MediaCloud",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["media_cloud", "user"],
  },
  "user_blocking_system": {
    entity: "UserBlockingSystem",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["user_blocking_system", "user"],
  },
  "human_operated_fake_check": {
    entity: "HumanOperatedFakeCheck",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["human_operated_fake_check", "user"],
  },
  "member_reviews_and_ratings": {
    entity: "MemberReviewsAndRatings",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["member_reviews_and_ratings", "user"],
  },
  "full_featured_profiles": {
    entity: "FullFeaturedProfiles",
    strategy: "aggressive",
    ttl: 3600,
    staleWhileRevalidate: true,
    tags: ["full_featured_profiles", "user"],
  },
  "seller_ratings_and_buyer_reviews": {
    entity: "SellerRatingsAndBuyerReviews",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["seller_ratings_and_buyer_reviews", "user"],
  },
  "user_ranking_list": {
    entity: "UserRankingList",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["user_ranking_list", "user"],
  },
  "friends_and_fans_system": {
    entity: "FriendsAndFansSystem",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["friends_and_fans_system", "user"],
  },
  "custom_video_clips": {
    entity: "CustomVideoClips",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["custom_video_clips", "user"],
  },
  "private_photosets": {
    entity: "PrivatePhotosets",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["private_photosets", "user"],
  },
  "whatsapp_and_skype_chats": {
    entity: "WhatsappAndSkypeChats",
    strategy: "moderate",
    ttl: 60,
    staleWhileRevalidate: true,
    tags: ["whatsapp_and_skype_chats", "user"],
  },
};

export function getCacheHeaders(entityName: string): Record<string, string> {
  const config = CACHE_CONFIG[entityName.toLowerCase()];
  if (!config || config.strategy === "none") {
    return {
      "Cache-Control": "no-store, must-revalidate",
    };
  }

  const directives = [
    "private",
    `max-age=${config.ttl}`,
  ];

  if (config.staleWhileRevalidate) {
    directives.push(`stale-while-revalidate=${config.ttl * 2}`);
  }

  return {
    "Cache-Control": directives.join(", "),
  };
}
```

### Task 2: Generate SWR Configuration

File: `lib/swr/config.ts`

```typescript
import { SWRConfiguration } from "swr";
import { CACHE_CONFIG } from "@/lib/cache/config";

export function getSwrConfig(entityName: string): SWRConfiguration {
  const config = CACHE_CONFIG[entityName.toLowerCase()];

  if (!config || config.strategy === "none") {
    return {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
    };
  }

  return {
    revalidateOnFocus: config.strategy !== "aggressive",
    revalidateOnReconnect: true,
    dedupingInterval: config.ttl * 1000,
    focusThrottleInterval: config.ttl * 1000,
    refreshInterval: config.strategy === "aggressive" ? config.ttl * 1000 : 0,
  };
}

// Optimistic update helper
export function optimisticUpdate<T>(
  current: T[],
  newItem: T,
  key: keyof T = "id" as keyof T
): T[] {
  const index = current.findIndex(item => item[key] === newItem[key]);
  if (index === -1) {
    return [...current, newItem];
  }
  return current.map((item, i) => (i === index ? newItem : item));
}

// Optimistic delete helper
export function optimisticDelete<T>(
  current: T[],
  id: unknown,
  key: keyof T = "id" as keyof T
): T[] {
  return current.filter(item => item[key] !== id);
}
```

### Task 3: Generate Image Optimization

// Image optimization not needed (uploads disabled)

### Task 4: Generate Lazy Loading Components

File: `components/lazy/index.tsx`

```tsx
"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components

export const LazyUserList = dynamic(
  () => import("@/components/user/UserList"),
  {
    loading: () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ),
  }
);

export const LazyUserDetail = dynamic(
  () => import("@/components/user/UserDetail"),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

export const LazyListingList = dynamic(
  () => import("@/components/listing/ListingList"),
  {
    loading: () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ),
  }
);

export const LazyListingDetail = dynamic(
  () => import("@/components/listing/ListingDetail"),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

export const LazyReviewList = dynamic(
  () => import("@/components/review/ReviewList"),
  {
    loading: () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ),
  }
);

export const LazyReviewDetail = dynamic(
  () => import("@/components/review/ReviewDetail"),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

export const LazyShopList = dynamic(
  () => import("@/components/shop/ShopList"),
  {
    loading: () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ),
  }
);

export const LazyShopDetail = dynamic(
  () => import("@/components/shop/ShopDetail"),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

// Lazy load charts (if needed)
export const LazyChart = dynamic(
  () => import("@/components/charts/chart-wrapper"),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
);
```

### Task 5: Generate Bundle Analysis Script

File: `scripts/analyze-bundle.ts`

```typescript
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface BundleStats {
  route: string;
  size: number;
  firstLoadJS: number;
}

async function analyzeBundles() {
  console.log("Building with bundle analyzer...");

  // Build with analyzer
  execSync("ANALYZE=true npm run build", { stdio: "inherit" });

  // Read build manifest
  const manifestPath = path.join(process.cwd(), ".next/build-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  const stats: BundleStats[] = [];

  // Analyze pages
  for (const [route, files] of Object.entries(manifest.pages)) {
    const jsFiles = (files as string[]).filter(f => f.endsWith(".js"));
    const totalSize = jsFiles.reduce((sum, file) => {
      const filePath = path.join(process.cwd(), ".next", file);
      if (fs.existsSync(filePath)) {
        return sum + fs.statSync(filePath).size;
      }
      return sum;
    }, 0);

    stats.push({
      route,
      size: totalSize,
      firstLoadJS: totalSize / 1024,
    });
  }

  // Report
  console.log("\n=== Bundle Analysis ===\n");

  const sorted = stats.sort((a, b) => b.size - a.size);

  for (const stat of sorted.slice(0, 10)) {
    const status = stat.firstLoadJS > 300 ? "❌" : stat.firstLoadJS > 200 ? "⚠️" : "✅";
    console.log(`${status} ${stat.route}: ${stat.firstLoadJS.toFixed(1)}KB`);
  }

  // Check thresholds
  const failing = stats.filter(s => s.firstLoadJS > 300);
  if (failing.length > 0) {
    console.error(`\n❌ ${failing.length} routes exceed 300KB threshold`);
    process.exit(1);
  }

  console.log("\n✅ All routes within bundle size limits");
}

analyzeBundles().catch(console.error);
```

### Task 6: Generate Performance Monitoring

File: `lib/performance/vitals.ts`

```typescript
import { onCLS, onFID, onLCP, onFCP, onTTFB, Metric } from "web-vitals";

type ReportHandler = (metric: Metric) => void;

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getScore(name: string, value: number): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

export function reportWebVitals(handler: ReportHandler) {
  const wrapper: ReportHandler = (metric) => {
    const score = getScore(metric.name, metric.value);

    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(1)} (${score})`);

    // Send to analytics
    handler({
      ...metric,
      // @ts-ignore - add custom fields
      score,
    });
  };

  onCLS(wrapper);
  onFID(wrapper);
  onLCP(wrapper);
  onFCP(wrapper);
  onTTFB(wrapper);
}

// Hook for Next.js
export function useWebVitals() {
  if (typeof window !== "undefined") {
    reportWebVitals((metric) => {
      // Send to your analytics service
      if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
        // Example: send to custom endpoint
        fetch("/api/vitals", {
          method: "POST",
          body: JSON.stringify(metric),
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      }
    });
  }
}
```

### Task 7: Generate Prefetching Strategy

File: `lib/performance/prefetch.ts`

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Routes to prefetch on app load
const PREFETCH_ROUTES = [
  "/dashboard",
  "/users",
  "/listings",
  "/reviews",
];

export function usePrefetchRoutes() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch after initial render
    const timer = setTimeout(() => {
      PREFETCH_ROUTES.forEach(route => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);
}

// Prefetch on hover for links
export function usePrefetchOnHover(href: string) {
  const router = useRouter();

  return {
    onMouseEnter: () => router.prefetch(href),
    onTouchStart: () => router.prefetch(href),
  };
}

// Data prefetching for SWR
export async function prefetchData(
  key: string,
  fetcher: () => Promise<unknown>
): Promise<void> {
  try {
    await fetcher();
  } catch {
    // Ignore prefetch errors
  }
}
```

---

## Validation Checklist

- [ ] Cache config for all entities
- [ ] SWR optimistic updates implemented

- [ ] Heavy components lazy loaded
- [ ] Bundle analysis passing (< 300KB)
- [ ] Web Vitals monitoring active
- [ ] Prefetching strategy implemented
- [ ] LCP < 2.5s verified
- [ ] CLS < 0.1 verified

---

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| First Load JS | < 300KB | TBD | - |
| LCP | < 2.5s | TBD | - |
| FID | < 100ms | TBD | - |
| CLS | < 0.1 | TBD | - |
| TTFB | < 800ms | TBD | - |

---

## Artifacts

| File | Content |
|------|---------|
| `lib/cache/config.ts` | Caching strategy |
| `lib/swr/config.ts` | SWR configuration |

| `components/lazy/index.tsx` | Lazy components |
| `scripts/analyze-bundle.ts` | Bundle analysis |
| `lib/performance/vitals.ts` | Web Vitals |
| `lib/performance/prefetch.ts` | Prefetching |

---

**Next Phase:** `13-security.md`

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

## Phase 7: 37 - Developer Guide + README

> Source: `docs/phases/37-developer-guide.md`

# 37 - Developer Guide + README

> **Purpose:** Create comprehensive developer documentation: architecture overview, entity map, feature status, and setup guide
> **Block:** F — Production
> **Depends on:** All build phases (28-36) complete

---

## Why This Matters

A developer picking up this project needs to understand:
1. **What was built** — architecture, entities, features
2. **How it's organized** — folder structure, patterns, conventions
3. **What's TODO** — remaining work, known issues, next steps
4. **How to extend it** — adding entities, pages, features

Without this, the next developer (or you in 2 weeks) will waste hours figuring out the codebase.

---

## Instructions

### 1. Create DEVELOPER_GUIDE.md

Create `DEVELOPER_GUIDE.md` in the project root:

```markdown
# Developer Guide — PantyHub

> A safe and anonymous marketplace for individuals to buy and sell used panties

## Architecture

### Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Auth:** Supabase Auth (email + social)
- **Validation:** Zod (shared client/server schemas)
- **Data Fetching:** SWR hooks
- **State:** React hooks + SWR cache

### Folder Structure

```
app/
├── (public)/          # Public routes (landing, auth, legal pages)
│   ├── page.tsx       # Landing page
│   ├── login/         # Login
│   ├── signup/        # Signup
│   ├── terms/         # Terms of Service
│   ├── privacy/       # Privacy Policy
│   ├── cookies/       # Cookie Policy
│   └── imprint/       # Imprint
├── (app)/             # Authenticated routes
│   ├── dashboard/     # Dashboard
│   ├── settings/      # User settings
│   └── {entities}/    # Entity CRUD pages
├── api/               # API routes
│   ├── {entities}/    # Entity CRUD APIs
│   ├── settings/      # Settings API
│   └── auth/          # Auth helpers
└── auth/              # Auth callback
components/
├── ui/                # shadcn/ui base components
├── layout/            # Header, sidebar, footer
├── auth/              # Auth forms
└── {entity}/          # Entity-specific components
hooks/                 # SWR data fetching hooks
lib/
├── supabase/          # Supabase client (browser + server + middleware)
├── validations/       # Zod schemas
├── config/            # Navigation, SEO, constants
└── utils/             # Utilities (dates, formatting, etc.)
types/                 # TypeScript interfaces
```

### Key Patterns

**API Route Pattern:**
- Every API route checks auth with `supabase.auth.getUser()`
- Validates input with Zod `schema.parse()`
- Returns standard error shape: `{ error: { code, message } }`
- Uses proper HTTP status codes (200, 201, 400, 401, 404, 500)

**Data Fetching Pattern:**
- SWR hooks in `hooks/use-{entity}s.ts`
- Automatic revalidation + optimistic updates
- Loading / error / empty states handled in UI

**Form Pattern:**
- react-hook-form + zodResolver
- Field-level validation errors
- Submit → loading state → success toast / error toast
- Create and Edit share the same form component

**Auth Pattern:**
- Supabase Auth handles sessions
- `middleware.ts` protects `/(app)/` routes
- Public routes in `/(public)/` accessible to everyone
- Auth callback at `/auth/callback`

---

## Entity Map

| Entity | Types | API | List | Detail | Form | Delete |
|--------|-------|-----|------|--------|------|--------|
| User | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Listing | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Review | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Shop | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Order | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Payment | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Subscription | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Upload | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Channel | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Notification | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Conversation | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| Message | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| GlobalSearchFeature | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| SafeTransactions | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| OwnShopSystem | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| SetYourOwnPrices | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| NoTransactionFees | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| MessagesAndChatSystem | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| ClassifiedAdMarket | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| MemberReviews | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| PrivacyFunctions | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| MediaCloud | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| UserBlockingSystem | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| HumanOperatedFakeCheck | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| MemberReviewsAndRatings | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| FullFeaturedProfiles | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| SellerRatingsAndBuyerReviews | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| UserRankingList | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| FriendsAndFansSystem | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| CustomVideoClips | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| PrivatePhotosets | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |
| WhatsappAndSkypeChats | ✅ Types | ✅ API | ✅ List | ✅ Detail | ✅ Form | ✅ Delete |

---

## Feature Status

| Feature | Status | Documentation |
|---------|--------|---------------|
| Auth (email + social) | ✅ Built | Phases 28-33 |
| CRUD for all entities | ✅ Built | Phases 12-21 |
| Dashboard | ✅ Built | Phase 18 |
| Settings | ✅ Built | Phase 20 |
| Search + Pagination | ✅ Built | Phase 21 |
| Landing Page | ✅ Built | Phase 06 |
| Legal Pages | ✅ Built | Phase 10 |
| Dark Mode | ✅ Built | Phase 11 |
| Error States | ✅ Built | Phase 22 |
| Loading States | ✅ Built | Phase 25 |
| Mobile Responsive | ✅ Built | Phase 26 |
| Accessibility | ✅ Built | Phase 27 |
| SEO | ✅ Built | Phase 35 |
| payments | ✅ Enabled | See `docs/features/payments.md` |
| uploads | ✅ Enabled | See `docs/features/uploads.md` |
| realtime | ✅ Enabled | See `docs/features/realtime.md` |
| search | ✅ Enabled | See `docs/features/search.md` |
| notifications | ✅ Enabled | See `docs/features/notifications.md` |
| messaging | ✅ Enabled | See `docs/features/messaging.md` |
| reviews | ✅ Enabled | See `docs/features/reviews.md` |
| global_search_feature | ✅ Enabled | See `docs/features/global_search_feature.md` |
| auth | ✅ Enabled | See `docs/features/auth.md` |
| safe_transactions | ✅ Enabled | See `docs/features/safe_transactions.md` |
| own_shop_system | ✅ Enabled | See `docs/features/own_shop_system.md` |
| set_your_own_prices | ✅ Enabled | See `docs/features/set_your_own_prices.md` |
| no_transaction_fees | ✅ Enabled | See `docs/features/no_transaction_fees.md` |
| messages_and_chat_system | ✅ Enabled | See `docs/features/messages_and_chat_system.md` |
| classified_ad_market | ✅ Enabled | See `docs/features/classified_ad_market.md` |
| member_reviews | ✅ Enabled | See `docs/features/member_reviews.md` |
| privacy_functions | ✅ Enabled | See `docs/features/privacy_functions.md` |
| media_cloud | ✅ Enabled | See `docs/features/media_cloud.md` |
| user_blocking_system | ✅ Enabled | See `docs/features/user_blocking_system.md` |
| human_operated_fake_check | ✅ Enabled | See `docs/features/human_operated_fake_check.md` |
| member_reviews_and_ratings | ✅ Enabled | See `docs/features/member_reviews_and_ratings.md` |
| full_featured_profiles | ✅ Enabled | See `docs/features/full_featured_profiles.md` |
| seller_ratings_and_buyer_reviews | ✅ Enabled | See `docs/features/seller_ratings_and_buyer_reviews.md` |
| user_ranking_list | ✅ Enabled | See `docs/features/user_ranking_list.md` |
| friends_and_fans_system | ✅ Enabled | See `docs/features/friends_and_fans_system.md` |
| custom_video_clips | ✅ Enabled | See `docs/features/custom_video_clips.md` |
| private_photosets | ✅ Enabled | See `docs/features/private_photosets.md` |
| whatsapp_and_skype_chats | ✅ Enabled | See `docs/features/whatsapp_and_skype_chats.md` |

---

## Environment Variables

See `.env.example` for all required variables.

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)

**Optional (based on enabled features):**
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- See `.env.example` for the complete list

---

## Database

**Schema:** `supabase/schema.sql`
**RLS Policies:** `supabase/rls.sql`
**Triggers:** `supabase/triggers.sql`

To reset the database:
1. Open Supabase SQL Editor
2. Run schema.sql (creates tables)
3. Run rls.sql (creates policies)
4. Run triggers.sql (creates triggers)

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/{entities}` | ✅ | List all (paginated, filterable) |
| POST | `/api/{entities}` | ✅ | Create new |
| GET | `/api/{entities}/[id]` | ✅ | Get by ID |
| PATCH | `/api/{entities}/[id]` | ✅ | Update by ID |
| DELETE | `/api/{entities}/[id]` | ✅ | Delete by ID |
| GET | `/api/settings` | ✅ | Get user profile |
| PATCH | `/api/settings` | ✅ | Update user profile |
| POST | \`/api/stripe/checkout\` | ✅ | Create checkout session |
| POST | \`/api/stripe/webhook\` | ❌ | Stripe webhook handler |
| POST | \`/api/upload\` | ✅ | File upload |
| GET | \`/api/notifications\` | ✅ | Get notifications |
| PATCH | \`/api/notifications/[id]\` | ✅ | Mark as read |

**Standard Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description of what went wrong"
  }
}
```

**Rate Limits:**
- Auth: 10 req / 15 min
- Create: 30 req / min
- Read: 200 req / min
- Global IP: 500 req / min

---

## TODO / Known Issues

> **Add items here as you discover them during development.**

- [ ] Add avatar upload to profile
- [ ] Add data export (CSV/JSON)
- [ ] Set up error monitoring (Sentry)
- [ ] Performance audit (Lighthouse)

---

## How to Extend

### Adding a New Entity

1. Type: `types/{entity}.ts`
2. Schema: `lib/validations/{entity}.ts`
3. API List: `app/api/{entities}/route.ts`
4. API Detail: `app/api/{entities}/[id]/route.ts`
5. Hook: `hooks/use-{entities}.ts`
6. List Page: `app/(app)/{entities}/page.tsx`
7. Detail Page: `app/(app)/{entities}/[id]/page.tsx`
8. Create: `app/(app)/{entities}/new/page.tsx`
9. Edit: `app/(app)/{entities}/[id]/edit/page.tsx`
10. Form: `components/{entity}/{entity}-form.tsx`
11. Card: `components/{entity}/{entity}-card.tsx`
12. Nav: Update navigation config

### Adding a Page

1. Page: `app/(app)/{name}/page.tsx`
2. Loading: `app/(app)/{name}/loading.tsx`
3. Add to navigation

### Copy, Don't Invent

Look at existing files. Copy the pattern. Maintain consistency.
```

---

### 2. Create README.md

Create `README.md` in the project root:

```markdown
# PantyHub

A safe and anonymous marketplace for individuals to buy and sell used panties

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Validation:** Zod
- **Data Fetching:** SWR

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your Supabase credentials

# 3. Apply database schema
# Open Supabase SQL Editor → run supabase/schema.sql

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production |
| `npm run lint` | Run ESLint |

## Documentation

- **Developer Guide:** `DEVELOPER_GUIDE.md` — Architecture, patterns, how to extend
- **API Contracts:** `docs/contracts/` — Type definitions, schemas
- **Feature Docs:** `docs/features/` — Optional feature implementation guides

## License

Private
```

---

## Validation

- [ ] `DEVELOPER_GUIDE.md` exists with all sections
- [ ] Entity map matches actual entities in the project
- [ ] Feature status matrix reflects what was actually built
- [ ] Folder structure matches actual project structure
- [ ] TODO list contains actionable items
- [ ] README.md exists with quick start guide
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

## Phase 8: 38 - CI/CD with Real Gates

> Source: `docs/phases/38-ci-cd.md`

# 38 - CI/CD with Real Gates

> **Purpose:** Automated quality gates — lint, typecheck, unit tests, smoke tests, migration check
> **Block:** I — Production
> **Depends on:** All build phases complete

---

## Real Gates — Not Just "Build"

A CI pipeline that only runs `npm run build` catches 20% of issues. Real gates catch 90%.

---

## Instructions

### 1. GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Quality Gates
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      # Gate 1: TypeScript
      - name: Type Check
        run: npx tsc --noEmit

      # Gate 2: Lint
      - name: Lint
        run: npm run lint

      # Gate 3: Unit Tests
      - name: Unit Tests
        run: npm run test --if-present

      # Gate 4: Build
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder-key
          NEXT_PUBLIC_APP_URL: http://localhost:3000

      # Gate 5: Bundle Size Check (uses .next from previous build step)
      - name: Check Bundle Size
        run: |
          echo "Checking First Load JS sizes..."
          du -sh .next/static 2>/dev/null || echo "No static build output found"
          # Check route sizes from build output (already built in previous step)

  smoke-test:
    name: Smoke Tests
    runs-on: ubuntu-latest
    needs: quality

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder-key
          NEXT_PUBLIC_APP_URL: http://localhost:3000

      - name: Run Smoke Tests
        run: npx playwright test --project=chromium
        env:
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder-key
          NEXT_PUBLIC_APP_URL: http://localhost:3000

  sql-check:
    name: Schema Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Validate SQL Syntax
        run: |
          if [ -f "supabase/schema.sql" ]; then
            echo "Schema file exists — checking syntax..."
            # Basic syntax check — ensure no obvious errors
            grep -c "CREATE TABLE" supabase/schema.sql && echo "Tables found"
            grep -c "ALTER TABLE.*ENABLE ROW LEVEL SECURITY" supabase/schema.sql && echo "RLS enabled"
          fi
```

### 2. Minimal Playwright Smoke Test

Create `tests/e2e/smoke.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/PantyHub/i);
});

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("form")).toBeVisible();
});

test("signup page loads", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.locator("form")).toBeVisible();
});

test("404 page works", async ({ page }) => {
  await page.goto("/this-does-not-exist");
  await expect(page.locator("text=404")).toBeVisible();
});

test("health check endpoint", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe("ok");
});
```

### 3. Playwright Config

Create `playwright.config.ts` (this will be expanded in Phase 46 — Build Proof):

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 1,
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

### 4. Gate Summary

| Gate | What It Catches | Blocks PR? |
|------|----------------|-----------|
| TypeScript | Type errors, missing imports | Yes |
| Lint | Code style, unused vars, no-any | Yes |
| Unit Tests | Logic bugs, edge cases | Yes |
| Build | Build failures, SSR issues | Yes |
| Smoke Tests | Broken pages, 500 errors | Yes |
| Schema Check | Missing RLS, syntax errors | Warning |

---

## Validation

- [ ] `.github/workflows/ci.yml` has all 5 gates
- [ ] TypeScript gate: `npx tsc --noEmit`
- [ ] Lint gate: `npm run lint`
- [ ] Unit test gate: `npm run test`
- [ ] Build gate with placeholder env vars
- [ ] Smoke tests exist with Playwright
- [ ] Playwright config with webServer
- [ ] SQL schema validation step
- [ ] `npm run build` passes locally



---

## Phase 9: 38b - Deployment + Kill Switches

> Source: `docs/phases/38b-deployment.md`

# 38b - Deployment + Kill Switches

> **Purpose:** Production deployment config with feature flags and emergency kill switches
> **Block:** I — Production
> **Depends on:** All build phases complete

---

## Kill Switches Save You at Launch

When something breaks in production, you need to disable features without redeploying. Env-based feature flags give you that power.

---

## Instructions

### 1. Feature Flags / Kill Switches

Create `lib/feature-flags.ts`:

```typescript
/**
 * Feature flags controlled by environment variables.
 * Set any to "false" to disable that feature instantly.
 * No redeploy needed — just update the env var.
 */
export const FEATURES = {
  /** Enable/disable checkout and payment flows */
  checkout: process.env.NEXT_PUBLIC_FEATURE_CHECKOUT !== "false",

  /** Enable/disable blueprint/content generation */
  generation: process.env.NEXT_PUBLIC_FEATURE_GENERATION !== "false",

  /** Enable/disable cron jobs and background tasks */
  cron: process.env.FEATURE_CRON !== "false",

  /** Enable/disable public listings and explore page */
  publicListings: process.env.NEXT_PUBLIC_FEATURE_PUBLIC_LISTINGS !== "false",

  /** Enable/disable user registration (useful during maintenance) */
  registration: process.env.NEXT_PUBLIC_FEATURE_REGISTRATION !== "false",

  /** Enable/disable API access for external consumers */
  api: process.env.FEATURE_API !== "false",

  /** Maintenance mode — shows maintenance page for all routes */
  maintenance: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
} as const;

export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}
```

### 2. Use Feature Flags in Code

**In API routes:**
```typescript
import { FEATURES } from "@/lib/feature-flags";

export async function POST(request: Request) {
  if (!FEATURES.checkout) {
    return NextResponse.json(
      { error: { code: "FEATURE_DISABLED", message: "Checkout is temporarily unavailable" } },
      { status: 503 }
    );
  }
  // ... normal handler
}
```

**In UI:**
```typescript
import { FEATURES } from "@/lib/feature-flags";

export default function PricingPage() {
  return (
    <div>
      {FEATURES.checkout ? (
        <Button>Subscribe</Button>
      ) : (
        <p className="text-muted-foreground">Checkout unavailable</p>
      )}
    </div>
  );
}
```

**Maintenance mode in middleware:**
```typescript
if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
  // Allow only /maintenance and static assets
  if (!request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }
}
```

### 3. Maintenance Page

Create `app/maintenance/page.tsx`:
```typescript
export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold">Under Maintenance</h1>
        <p className="text-muted-foreground">
          We're making improvements. We'll be back shortly.
        </p>
      </div>
    </div>
  );
}
```

### 4. Health Check Endpoint

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { FEATURES } from "@/lib/feature-flags";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    features: FEATURES,
  });
}
```

### 5. Environment Variables for Deployment

Add to `.env.example`:

```bash
# Feature Flags (set to "false" to disable)
NEXT_PUBLIC_FEATURE_CHECKOUT=true
NEXT_PUBLIC_FEATURE_GENERATION=true
FEATURE_CRON=true
NEXT_PUBLIC_FEATURE_PUBLIC_LISTINGS=true
NEXT_PUBLIC_FEATURE_REGISTRATION=true
FEATURE_API=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### 6. Vercel Configuration

Create `vercel.json` (optional — only if custom config needed):

```json
{
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

### 7. Deployment Checklist

1. Push to GitHub
2. Connect repo to Vercel
3. Set ALL environment variables (from .env.example)
4. Deploy
5. Verify `/api/health` returns `{ status: "ok" }`
6. Verify all feature flags show correct state in health check
7. Test kill switches: set FEATURE_CHECKOUT=false → verify checkout disabled

---

## Validation

- [ ] `lib/feature-flags.ts` with all kill switches
- [ ] Feature flags used in checkout/generation/registration routes
- [ ] Maintenance mode page and middleware check
- [ ] Health check endpoint shows feature flag states
- [ ] .env.example includes all feature flag vars
- [ ] No hardcoded localhost URLs in production code
- [ ] Kill switch test: disable one feature, verify it's disabled
- [ ] `npm run build` passes

## Block F Checkpoint

After this phase, open `docs/INVENTORY.md` and verify ALL Block F deliverables exist.
For any ❌ items, go back and create them NOW before proceeding.


---

## Quality Gate: Block F Complete

After Phase 38b, run:

```bash
npx tsc --noEmit && npm run build
```

Both must pass before proceeding to Block G.


---

## Phase 10: 38c - Release & DevOps

> Source: `docs/phases/38c-release-devops.md`

# 38c - Release & DevOps

> **Purpose:** Configure CI/CD, environments, deployment pipelines
> **Input:** deployment_target, scaling_expectation, features[]
> **Output:** GitHub Actions, environment configs, deployment scripts

---

## Stop Conditions

- ✗ No staging environment → BLOCK
- ✗ Production deploy without tests → BLOCK
- ✗ Secrets in repository → BLOCK
- ✗ Missing rollback procedure → BLOCK

---

## Input from CONTEXT.md

```yaml
deployment_target: vercel
scaling_expectation: prototype
trust_level: high

features:
  payments: false
  realtime: false
```

---

## Tasks (Sequential)

### Task 1: Generate Environment Configuration

File: `.env.example`

```bash
# PantyHub Environment Configuration
# Copy to .env.local and fill in values

# ===================
# SUPABASE
# ===================
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ===================
# APP
# ===================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PantyHub





# ===================
# ENVIRONMENT
# ===================
NODE_ENV=development
```

### Task 2: Generate GitHub Actions CI/CD

File: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "20"

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()

  e2e:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Analyze bundle
        run: npm run analyze || true
```

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Deploy to Staging
        run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Deploy to Production
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Notify deployment
        run: |
          echo "Deployed to production: ${{ github.sha }}"
```

### Task 3: Generate Vercel Configuration

File: `vercel.json`

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ],
  "crons": []
}
```

### Task 4: Generate Deployment Scripts

File: `scripts/deploy.sh`

```bash
#!/bin/bash
set -e

ENV=${1:-staging}

echo "Deploying to $ENV..."

# Pre-deployment checks
echo "Running pre-deployment checks..."
npm run lint
npm run type-check
npm run test

# Build
echo "Building..."
npm run build

# Deploy based on environment
if [ "$ENV" = "production" ]; then
    echo "Deploying to production..."
    vercel deploy --prod
else
    echo "Deploying to staging..."
    vercel deploy
fi

# Post-deployment verification
echo "Verifying deployment..."
DEPLOY_URL=$(vercel ls --json | jq -r '.[0].url')

# Health check
curl -f "https://$DEPLOY_URL/api/health" || {
    echo "Health check failed!"
    exit 1
}

echo "Deployment complete: https://$DEPLOY_URL"
```

File: `scripts/rollback.sh`

```bash
#!/bin/bash
set -e

echo "Rolling back to previous deployment..."

# Get previous deployment
PREVIOUS=$(vercel ls --json | jq -r '.[1].uid')

if [ -z "$PREVIOUS" ]; then
    echo "No previous deployment found!"
    exit 1
fi

echo "Rolling back to: $PREVIOUS"
vercel rollback $PREVIOUS --yes

# Verify
echo "Verifying rollback..."
sleep 10

CURRENT_URL=$(vercel ls --json | jq -r '.[0].url')
curl -f "https://$CURRENT_URL/api/health" || {
    echo "Rollback verification failed!"
    exit 1
}

echo "Rollback complete"
```

### Task 5: Generate Environment Matrix

File: `docs/ENVIRONMENTS.md`

```markdown
# Environments - PantyHub

## Environment Matrix

| Environment | URL | Branch | Auto-Deploy | Purpose |
|-------------|-----|--------|-------------|---------|
| Development | localhost:3000 | - | - | Local dev |
| Preview | *.vercel.app | PR | Yes | PR review |
| Staging | staging.pantyhub.com | staging | Yes | QA testing |
| Production | pantyhub.com | main | Yes* | Live users |

*Production deploys require approval in high-trust environments.

## Environment Variables

| Variable | Dev | Staging | Production |
|----------|-----|---------|------------|
| NODE_ENV | development | production | production |
| SUPABASE_URL | dev project | staging project | prod project |


## Deployment Flow

```
Feature Branch → PR → Preview Deploy
         ↓
      Merge to staging → Staging Deploy
         ↓
      Merge to main → Production Deploy
```

## Rollback Procedure

1. Identify issue in production
2. Run `scripts/rollback.sh`
3. Verify health check passes
4. Investigate and fix in staging
5. Deploy fix through normal flow
```

### Task 6: Generate Pre-commit Hooks

File: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Lint staged files
npx lint-staged

# Run type check
npm run type-check

# Scan for secrets
npm run scan-secrets
```

File: `.lintstagedrc.json`

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### Task 7: Generate Database Migration Workflow

File: `.github/workflows/db-migrate.yml`

```yaml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options:
          - staging
          - production
      migration_name:
        description: "Migration name (optional)"
        required: false
        type: string

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Run migrations
        run: |
          supabase db push --db-url "${{ secrets.SUPABASE_DB_URL }}"

      - name: Verify migration
        run: |
          supabase db diff --db-url "${{ secrets.SUPABASE_DB_URL }}"
```

---

## Validation Checklist

- [ ] CI workflow runs on PR
- [ ] All tests pass before deploy
- [ ] Staging environment configured
- [ ] Production requires main branch
- [ ] Health check in deployment
- [ ] Rollback script tested
- [ ] Pre-commit hooks active
- [ ] Secrets not in codebase

---

## Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "ts-node scripts/test-coverage.ts",
    "analyze": "ANALYZE=true next build",
    "scan-secrets": "ts-node scripts/scan-secrets.ts",
    "deploy:staging": "./scripts/deploy.sh staging",
    "deploy:prod": "./scripts/deploy.sh production",
    "rollback": "./scripts/rollback.sh"
  }
}
```

---

## Artifacts

| File | Content |
|------|---------|
| `.env.example` | Environment template |
| `.github/workflows/ci.yml` | CI pipeline |
| `.github/workflows/deploy.yml` | Deployment pipeline |
| `vercel.json` | Vercel config |
| `scripts/deploy.sh` | Deploy script |
| `scripts/rollback.sh` | Rollback script |
| `docs/ENVIRONMENTS.md` | Environment docs |
| `.husky/pre-commit` | Pre-commit hooks |

---

**Build Phases Complete. Proceed to Premium Phases (98-99) if enabled.**

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

- [ ] `app/sitemap.ts` created
- [ ] `app/robots.ts` created
- [ ] `.github/workflows/ci.yml` created
- [ ] `README.md` created

### Structural Contracts

Verify these structural requirements are met:

- `app/sitemap.ts` exists
  - Exports: `default`
- `app/robots.ts` exists
  - Exports: `default`
- `.github/workflows/ci.yml` exists
  - Contains: `on:`
  - Contains: `jobs:`
- `README.md` exists
  - Contains: `Build with AI`

For TypeScript/TSX files, verify exports:
```bash
# Example: grep -c "export" {file} to verify exports exist
```


```bash
test -e "app/sitemap.ts" && echo "✓ app/sitemap.ts" || echo "✗ MISSING: app/sitemap.ts"
test -e "app/robots.ts" && echo "✓ app/robots.ts" || echo "✗ MISSING: app/robots.ts"
test -e ".github/workflows/ci.yml" && echo "✓ .github/workflows/ci.yml" || echo "✗ MISSING: .github/workflows/ci.yml"
test -e "README.md" && echo "✓ README.md" || echo "✗ MISSING: README.md"
```

If any contract fails, fix the file before reporting completion. Do NOT skip contract failures.

---

## Completion Protocol

After all outputs verified:

1. Write your agent state to `docs/build-state/devops.json` (avoids race conditions with parallel agents):
   ```json
   {
     "agentId": "devops",
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
   - Set `agents.devops.status` to `"complete"`
   - Set `agents.devops.completedAt` to current ISO timestamp
   - Set `lastUpdatedByAgent` to `"devops"`
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
   ## [devops] {error-title}
   - **Phase:** {phase-file}
   - **Type:** transient | config | logic | dependency
   - **Severity:** critical | major | minor
   - **Error:** {error message}
   - **Attempted fixes:** {what you tried}
   - **Workaround:** {stub/mock created}
   - **Impact:** {what won't work until this is fixed}
   ```
2. Create a stub/mock that makes the build pass
3. Add to `agents.devops.warnings` in BUILD_STATE.json
4. Continue to the next phase

---

**Agent devops complete.** Report status to orchestrator.
