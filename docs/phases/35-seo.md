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
