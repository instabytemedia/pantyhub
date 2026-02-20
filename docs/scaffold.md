# File Structure Scaffold - PantyHub

## Complete Project Structure

```
pantyhub/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles
│   │
│   ├── (auth)/                   # Auth group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (app)/                    # Authenticated app group
│   │   ├── layout.tsx            # App layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   ├── users/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── listings/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── reviews/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── shops/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── orders/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── payments/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── subscriptions/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── uploads/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── channels/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── notifications/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── conversations/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── messages/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── global-search-features/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── safe-transactions/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── own-shop-systems/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── set-your-own-prices/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── no-transaction-fees/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── messages-and-chat-systems/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── classified-ad-markets/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── member-reviews/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── privacy-functions/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── media-clouds/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── user-blocking-systems/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── human-operated-fake-checks/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── member-reviews-and-ratings/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── full-featured-profiles/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── seller-ratings-and-buyer-reviews/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── user-ranking-lists/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── friends-and-fans-systems/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── custom-video-clips/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── private-photosets/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   ├── whatsapp-and-skype-chats/
│   │   ├── page.tsx              # List view
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail view
│   │   └── new/
│   │       └── page.tsx          # Create form
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── api/                      # API Routes
│       ├── auth/
│       │   ├── signin/route.ts
│       │   ├── signup/route.ts
│       │   └── signout/route.ts
│   ├── users/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── listings/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── reviews/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── shops/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── orders/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── payments/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── subscriptions/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── uploads/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── channels/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── notifications/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── conversations/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── messages/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── global-search-features/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── safe-transactions/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── own-shop-systems/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── set-your-own-prices/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── no-transaction-fees/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── messages-and-chat-systems/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── classified-ad-markets/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── member-reviews/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── privacy-functions/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── media-clouds/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── user-blocking-systems/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── human-operated-fake-checks/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── member-reviews-and-ratings/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── full-featured-profiles/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── seller-ratings-and-buyer-reviews/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── user-ranking-lists/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── friends-and-fans-systems/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── custom-video-clips/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── private-photosets/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│   ├── whatsapp-and-skype-chats/
│   │   ├── route.ts              # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts          # GET, PATCH, DELETE
│       └── webhooks/
│           └── stripe/route.ts
│
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   │
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── nav.tsx
│   │
│   ├── forms/                    # Form components
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── user-form.tsx
│   │   └── listing-form.tsx
│   │   └── review-form.tsx
│   │   └── shop-form.tsx
│   │   └── order-form.tsx
│   │   └── payment-form.tsx
│   │   └── subscription-form.tsx
│   │   └── upload-form.tsx
│   │   └── channel-form.tsx
│   │   └── notification-form.tsx
│   │   └── conversation-form.tsx
│   │   └── message-form.tsx
│   │   └── global-search-feature-form.tsx
│   │   └── safe-transactions-form.tsx
│   │   └── own-shop-system-form.tsx
│   │   └── set-your-own-prices-form.tsx
│   │   └── no-transaction-fees-form.tsx
│   │   └── messages-and-chat-system-form.tsx
│   │   └── classified-ad-market-form.tsx
│   │   └── member-reviews-form.tsx
│   │   └── privacy-functions-form.tsx
│   │   └── media-cloud-form.tsx
│   │   └── user-blocking-system-form.tsx
│   │   └── human-operated-fake-check-form.tsx
│   │   └── member-reviews-and-ratings-form.tsx
│   │   └── full-featured-profiles-form.tsx
│   │   └── seller-ratings-and-buyer-reviews-form.tsx
│   │   └── user-ranking-list-form.tsx
│   │   └── friends-and-fans-system-form.tsx
│   │   └── custom-video-clips-form.tsx
│   │   └── private-photosets-form.tsx
│   │   └── whatsapp-and-skype-chats-form.tsx
│   │
│   └── features/                 # Feature components
│       ├── user/
│       │   ├── user-card.tsx
│       │   ├── user-list.tsx
│       │   └── user-detail.tsx
│       ├── listing/
│       │   ├── listing-card.tsx
│       │   ├── listing-list.tsx
│       │   └── listing-detail.tsx
│       ├── review/
│       │   ├── review-card.tsx
│       │   ├── review-list.tsx
│       │   └── review-detail.tsx
│       ├── shop/
│       │   ├── shop-card.tsx
│       │   ├── shop-list.tsx
│       │   └── shop-detail.tsx
│       ├── order/
│       │   ├── order-card.tsx
│       │   ├── order-list.tsx
│       │   └── order-detail.tsx
│       ├── payment/
│       │   ├── payment-card.tsx
│       │   ├── payment-list.tsx
│       │   └── payment-detail.tsx
│       ├── subscription/
│       │   ├── subscription-card.tsx
│       │   ├── subscription-list.tsx
│       │   └── subscription-detail.tsx
│       ├── upload/
│       │   ├── upload-card.tsx
│       │   ├── upload-list.tsx
│       │   └── upload-detail.tsx
│       ├── channel/
│       │   ├── channel-card.tsx
│       │   ├── channel-list.tsx
│       │   └── channel-detail.tsx
│       ├── notification/
│       │   ├── notification-card.tsx
│       │   ├── notification-list.tsx
│       │   └── notification-detail.tsx
│       ├── conversation/
│       │   ├── conversation-card.tsx
│       │   ├── conversation-list.tsx
│       │   └── conversation-detail.tsx
│       ├── message/
│       │   ├── message-card.tsx
│       │   ├── message-list.tsx
│       │   └── message-detail.tsx
│       ├── global-search-feature/
│       │   ├── global-search-feature-card.tsx
│       │   ├── global-search-feature-list.tsx
│       │   └── global-search-feature-detail.tsx
│       ├── safe-transactions/
│       │   ├── safe-transactions-card.tsx
│       │   ├── safe-transactions-list.tsx
│       │   └── safe-transactions-detail.tsx
│       ├── own-shop-system/
│       │   ├── own-shop-system-card.tsx
│       │   ├── own-shop-system-list.tsx
│       │   └── own-shop-system-detail.tsx
│       ├── set-your-own-prices/
│       │   ├── set-your-own-prices-card.tsx
│       │   ├── set-your-own-prices-list.tsx
│       │   └── set-your-own-prices-detail.tsx
│       ├── no-transaction-fees/
│       │   ├── no-transaction-fees-card.tsx
│       │   ├── no-transaction-fees-list.tsx
│       │   └── no-transaction-fees-detail.tsx
│       ├── messages-and-chat-system/
│       │   ├── messages-and-chat-system-card.tsx
│       │   ├── messages-and-chat-system-list.tsx
│       │   └── messages-and-chat-system-detail.tsx
│       ├── classified-ad-market/
│       │   ├── classified-ad-market-card.tsx
│       │   ├── classified-ad-market-list.tsx
│       │   └── classified-ad-market-detail.tsx
│       ├── member-reviews/
│       │   ├── member-reviews-card.tsx
│       │   ├── member-reviews-list.tsx
│       │   └── member-reviews-detail.tsx
│       ├── privacy-functions/
│       │   ├── privacy-functions-card.tsx
│       │   ├── privacy-functions-list.tsx
│       │   └── privacy-functions-detail.tsx
│       ├── media-cloud/
│       │   ├── media-cloud-card.tsx
│       │   ├── media-cloud-list.tsx
│       │   └── media-cloud-detail.tsx
│       ├── user-blocking-system/
│       │   ├── user-blocking-system-card.tsx
│       │   ├── user-blocking-system-list.tsx
│       │   └── user-blocking-system-detail.tsx
│       ├── human-operated-fake-check/
│       │   ├── human-operated-fake-check-card.tsx
│       │   ├── human-operated-fake-check-list.tsx
│       │   └── human-operated-fake-check-detail.tsx
│       ├── member-reviews-and-ratings/
│       │   ├── member-reviews-and-ratings-card.tsx
│       │   ├── member-reviews-and-ratings-list.tsx
│       │   └── member-reviews-and-ratings-detail.tsx
│       ├── full-featured-profiles/
│       │   ├── full-featured-profiles-card.tsx
│       │   ├── full-featured-profiles-list.tsx
│       │   └── full-featured-profiles-detail.tsx
│       ├── seller-ratings-and-buyer-reviews/
│       │   ├── seller-ratings-and-buyer-reviews-card.tsx
│       │   ├── seller-ratings-and-buyer-reviews-list.tsx
│       │   └── seller-ratings-and-buyer-reviews-detail.tsx
│       ├── user-ranking-list/
│       │   ├── user-ranking-list-card.tsx
│       │   ├── user-ranking-list-list.tsx
│       │   └── user-ranking-list-detail.tsx
│       ├── friends-and-fans-system/
│       │   ├── friends-and-fans-system-card.tsx
│       │   ├── friends-and-fans-system-list.tsx
│       │   └── friends-and-fans-system-detail.tsx
│       ├── custom-video-clips/
│       │   ├── custom-video-clips-card.tsx
│       │   ├── custom-video-clips-list.tsx
│       │   └── custom-video-clips-detail.tsx
│       ├── private-photosets/
│       │   ├── private-photosets-card.tsx
│       │   ├── private-photosets-list.tsx
│       │   └── private-photosets-detail.tsx
│       ├── whatsapp-and-skype-chats/
│       │   ├── whatsapp-and-skype-chats-card.tsx
│       │   ├── whatsapp-and-skype-chats-list.tsx
│       │   └── whatsapp-and-skype-chats-detail.tsx
│
├── lib/                          # Utilities & Services
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── types.ts              # DB types
│   │
│   ├── utils/
│   │   ├── cn.ts                 # classnames helper
│   │   ├── format.ts             # Formatters
│   │   └── validation.ts         # Zod schemas
│   │
│   └── hooks/
│       ├── use-user.ts
│       ├── use-toast.ts
│       └── use-media-query.ts
│
├── types/                        # TypeScript types
│   ├── index.ts                  # Main types
│   └── api.ts                    # API types
│
├── styles/                       # Additional styles
│   └── components.css
│
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── og-image.png
│   └── images/
│
├── supabase/                     # Supabase config
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── .env.example                  # Env template
├── .env.local                    # Local env (gitignored)
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Key Files to Create First

### 1. Core Configuration
- [ ] `package.json` - Dependencies
- [ ] `next.config.mjs` - Next.js config
- [ ] `tailwind.config.ts` - Tailwind config
- [ ] `.env.example` - Environment template

### 2. Supabase Setup
- [ ] `lib/supabase/client.ts` - Browser client
- [ ] `lib/supabase/server.ts` - Server client
- [ ] `supabase/migrations/001_initial_schema.sql`

### 3. Layout & Auth
- [ ] `app/layout.tsx` - Root layout
- [ ] `app/(auth)/login/page.tsx` - Login
- [ ] `app/(app)/layout.tsx` - App layout

### 4. Core Features
- [ ] `app/(app)/users/page.tsx` - User list
- [ ] `app/(app)/listings/page.tsx` - Listing list
- [ ] `app/(app)/reviews/page.tsx` - Review list
- [ ] `app/(app)/shops/page.tsx` - Shop list
- [ ] `app/(app)/orders/page.tsx` - Order list
- [ ] `app/(app)/payments/page.tsx` - Payment list
- [ ] `app/(app)/subscriptions/page.tsx` - Subscription list
- [ ] `app/(app)/uploads/page.tsx` - Upload list
- [ ] `app/(app)/channels/page.tsx` - Channel list
- [ ] `app/(app)/notifications/page.tsx` - Notification list
- [ ] `app/(app)/conversations/page.tsx` - Conversation list
- [ ] `app/(app)/messages/page.tsx` - Message list
- [ ] `app/(app)/global-search-features/page.tsx` - GlobalSearchFeature list
- [ ] `app/(app)/safe-transactions/page.tsx` - SafeTransactions list
- [ ] `app/(app)/own-shop-systems/page.tsx` - OwnShopSystem list
- [ ] `app/(app)/set-your-own-prices/page.tsx` - SetYourOwnPrices list
- [ ] `app/(app)/no-transaction-fees/page.tsx` - NoTransactionFees list
- [ ] `app/(app)/messages-and-chat-systems/page.tsx` - MessagesAndChatSystem list
- [ ] `app/(app)/classified-ad-markets/page.tsx` - ClassifiedAdMarket list
- [ ] `app/(app)/member-reviews/page.tsx` - MemberReviews list
- [ ] `app/(app)/privacy-functions/page.tsx` - PrivacyFunctions list
- [ ] `app/(app)/media-clouds/page.tsx` - MediaCloud list
- [ ] `app/(app)/user-blocking-systems/page.tsx` - UserBlockingSystem list
- [ ] `app/(app)/human-operated-fake-checks/page.tsx` - HumanOperatedFakeCheck list
- [ ] `app/(app)/member-reviews-and-ratings/page.tsx` - MemberReviewsAndRatings list
- [ ] `app/(app)/full-featured-profiles/page.tsx` - FullFeaturedProfiles list
- [ ] `app/(app)/seller-ratings-and-buyer-reviews/page.tsx` - SellerRatingsAndBuyerReviews list
- [ ] `app/(app)/user-ranking-lists/page.tsx` - UserRankingList list
- [ ] `app/(app)/friends-and-fans-systems/page.tsx` - FriendsAndFansSystem list
- [ ] `app/(app)/custom-video-clips/page.tsx` - CustomVideoClips list
- [ ] `app/(app)/private-photosets/page.tsx` - PrivatePhotosets list
- [ ] `app/(app)/whatsapp-and-skype-chats/page.tsx` - WhatsappAndSkypeChats list

---

## Component Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page | lowercase with dashes | `app/user-settings/page.tsx` |
| Component | PascalCase | `components/UserCard.tsx` |
| Hook | camelCase with `use` prefix | `hooks/useUser.ts` |
| Utility | camelCase | `lib/utils/formatDate.ts` |
| Type | PascalCase | `types/User.ts` |
| API Route | lowercase with dashes | `api/user-profile/route.ts` |
| Schema | camelCase with Schema | `lib/schemas/userSchema.ts` |
| Constant | UPPER_SNAKE_CASE | `lib/config/constants.ts` |

---

## Standardization Guide (for parallel teams)

### Folder Conventions

| Concern | Location | Rule |
|---------|----------|------|
| Pages | `app/(app)/{entity}/` | One folder per entity, plural |
| API routes | `app/api/{entity}/` | Match page entity names |
| Components | `components/{entity}/` | Entity-specific components |
| Shared UI | `components/ui/` | shadcn/ui only |
| Layout | `components/layout/` | Header, sidebar, footer, nav |
| Hooks | `hooks/` | One file per hook |
| Types | `types/` | One file per entity + shared |
| Schemas | `lib/schemas/` | One Zod schema per entity |
| Utils | `lib/utils/` | Pure functions only |
| Config | `lib/config/` | Feature flags, constants |

### API Pattern Standard

Every API route follows this exact pattern:

```typescript
// 1. Auth check
const { data: { user } } = await supabase.auth.getUser();
if (!user) return apiError("UNAUTHORIZED", "Not logged in");

// 2. Input validation (for POST/PATCH)
const body = await request.json();
const parsed = schema.safeParse(body);
if (!parsed.success) return apiError("VALIDATION_ERROR", parsed.error.issues[0].message);

// 3. Business logic
const { data, error } = await supabase.from("table").select("*").eq("user_id", user.id);
if (error) return apiError("DB_ERROR", error.message);

// 4. Response
return NextResponse.json({ data });
```

### Error Code Taxonomy

| Code | HTTP | When |
|------|------|------|
| UNAUTHORIZED | 401 | No session |
| FORBIDDEN | 403 | No permission |
| NOT_FOUND | 404 | Resource missing |
| VALIDATION_ERROR | 400 | Bad input |
| DUPLICATE | 409 | Unique constraint |
| RATE_LIMITED | 429 | Too many requests |
| DB_ERROR | 500 | Database failure |
| INTERNAL_ERROR | 500 | Unexpected error |

### Database Naming

| Object | Convention | Example |
|--------|-----------|---------|
| Table | snake_case, plural | `user_posts` |
| Column | snake_case | `created_at` |
| Primary key | `id` (UUID) | `id UUID PRIMARY KEY` |
| Foreign key | `{table_singular}_id` | `user_id` |
| Index | `idx_{table}_{column}` | `idx_posts_user_id` |
| Policy | Descriptive | `"Users can CRUD own posts"` |
| Trigger | `{table}_{action}` | `posts_updated_at` |

### Component Pattern

```typescript
// Entity list: always Server Component
// app/(app)/posts/page.tsx
export default async function PostsPage() { ... }

// Entity form: always Client Component
// components/posts/post-form.tsx
"use client";
export function PostForm({ defaultValues }: { defaultValues?: Post }) { ... }

// Entity card: always Server Component
// components/posts/post-card.tsx
export function PostCard({ post }: { post: Post }) { ... }
```

### Import Order

```typescript
// 1. React/Next.js
import { useState } from "react";
import Link from "next/link";

// 2. External packages
import { z } from "zod";
import { toast } from "sonner";

// 3. Internal: components
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";

// 4. Internal: lib/hooks/types
import { createClient } from "@/lib/supabase/server";
import { usePosts } from "@/hooks/use-posts";
import { type Post } from "@/types/post";
```
