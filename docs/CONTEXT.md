# PantyHub - Context

> Single source of truth. All phases read from this file.

<!-- section:identity -->
## Identity

| Field | Value |
|-------|-------|
| **Title** | PantyHub |
| **Summary** | Buy and Sell with Confidence |
| **Problem** | Lack of a safe and anonymous platform for buying and selling used panties |
| **Value Prop** | PantyHub is a used panty marketplace that prioritizes user safety and anonymity, offering a range of features including secure transactions, own shop systems, and human-operated fake checks. The platform incentivizes sellers to use the platform by offering no transaction fees and allowing them to set their own prices. Buyers can browse listings, send messages to sellers, and make purchases with ease. |
<!-- /section:identity -->

<!-- section:domain -->
## Domain

| Field | Value |
|-------|-------|
| **Type** | used_panty_marketplace |
| **Product** | web_app |
| **Use Case** |  |
| **Trust Level** | MEDIUM |
<!-- /section:domain -->

<!-- section:audience -->
## Audience

| Field | Value |
|-------|-------|
| **Primary Role** | Demographics: 18-45 years old, interests: alternative fashion, kink, and fetish communities, pain points: difficulty finding a safe and anonymous platform to buy and sell used panties, goals: to buy or sell used panties in a secure and private environment |
| **Skill Level** | mixed |
| **Device** | balanced |
| **Frequency** | weekly |
<!-- /section:audience -->

<!-- section:security -->
## Security

| Field | Value |
|-------|-------|
| **Roles** | user, admin |
| **Trust** | medium |
| **Compliance** | none |
<!-- /section:security -->

<!-- section:stack -->
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
<!-- /section:stack -->

<!-- section:entities -->
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
<!-- /section:entities -->

<!-- section:features -->
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
<!-- /section:features -->

## Feature Details

| Feature | Category | Priority | Effort | Description |
|---------|----------|----------|--------|-------------|
| Global Search Feature | core | required | large | [User-specified] A search feature that allows users to find items globally |
| Authentication | core | required | medium | User login, registration, and session management |
| Safe and Anonymous Transactions | core | required | large | Transactions are encrypted and anonymous to ensure user safety |
| Own Shop System for Sellers | core | required | large | Sellers can create and manage their own shops |
| Set Your Own Prices | core | required | small | Sellers can set their own prices for their items |
| No Transaction Fees | core | required | small | No fees are charged for transactions |
| Messages and Chat System | communication | required | medium | Buyers and sellers can communicate through a messaging and chat system |
| Classified Ad Market | core | required | large | A marketplace for buyers and sellers to find and list items |
| Member Reviews | social | required | small | Buyers can leave reviews for sellers |
| Privacy Functions | core | required | small | Users can control their privacy settings |
| Media Cloud | core | required | large | A cloud storage system for users to upload photos and videos |
| User Blocking System | core | required | small | Users can block other users |
| Human-Operated Fake Check | core | required | large | A human-operated system to check for fake accounts |
| Member Reviews and Ratings | social | required | small | Buyers can leave reviews and ratings for sellers |
| Full-Featured Profiles | core | required | medium | Sellers can create full-featured profiles |
| Seller Ratings and Buyer Reviews | social | required | small | Sellers can view their ratings and buyer reviews |
| User Ranking List | social | recommended | medium | A list that ranks users based on their activity and feedback |
| Friends and Fans System | social | recommended | medium | Users can add friends and fans |
| Custom Video Clips | core | recommended | medium | Sellers can upload custom video clips |
| Private Photosets | core | recommended | medium | Sellers can upload private photosets |
| Whatsapp and Skype Chats | communication | recommended | medium | Buyers and sellers can communicate through Whatsapp and Skype |

## Universal Features

21 always-on features across 5 domains. Full specs: `docs/UNIVERSAL_FEATURES.md`

| Domain | Features | Affected Phases |
|--------|----------|----------------|
| Identity & Access | auth-email, auth-social, rbac, profile, account-settings | 04, 07, 17, 20, 28-29, 31-33 |
| Core Data | crud-engine, validation, file-storage, audit-trail, data-export | 12-18, 20, 28 |
| Interaction | email-transactional, comments | 02, 04, 16, 28, 32 |
| Intelligence & Automation | analytics, errors, jobs, webhooks, ai | 02, 04-06, 18, 20, 22, 28, 38 |
| Operations & Trust | rate-limit, moderation, seo, dark-mode | 02, 05, 07, 11, 13, 16, 28, 34-35 |

<!-- section:design -->
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
<!-- /section:design -->

<!-- section:business -->
## Business Context

| Field | Value |
|-------|-------|
| **Monetization** | The platform generates revenue through premium features, advertising, and potentially commission-based sales |
| **Complexity** | medium |
<!-- /section:business -->

<!-- section:screens -->
## Screens

| Screen | Route | Auth | Description |
|--------|-------|------|-------------|
| Landing | `/` | No | The landing page of the platform |
| Search Results | `/search` | No | The search results page |
| Listing Details | `/listing/:id` | Yes | The details page of a listing |
| Message Thread | `/messages` | Yes | The message thread between a buyer and seller |
| Checkout | `/checkout` | Yes | The checkout page |
| Reviews | `/reviews` | No | - |
| Pricing | `/pricing` | No | Pricing page |
| Subscribe | `/subscribe` | Yes | Subscribe page |
| Billing | `/billing` | Yes | Billing page |
| Notifications | `/notifications` | Yes | Notifications page |
| Conversation | `/messages/[id]` | Yes | Conversation page |
<!-- /section:screens -->

<!-- section:flows -->
## User Flows

### Buyer Flow
The flow for a buyer to find and purchase an item
**Actor:** Buyer
1. Search for items
2. View listing
3. Send message to seller
4. Make purchase
**Success:** The buyer successfully purchases an item

### Seller Flow
The flow for a seller to create and manage listings
**Actor:** Seller
1. Create listing
2. Manage shop
3. Respond to messages
4. Fulfill orders
**Success:** The seller successfully creates and manages listings

### Admin Flow
The flow for an admin to manage the platform
**Actor:** Admin
1. Manage users
2. Manage listings
3. Handle support requests
**Success:** The admin successfully manages the platform
<!-- /section:flows -->

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/search` | No | Search for listings |
| `GET` | `/api/listing/:id` | Yes | Get a listing by ID |
| `POST` | `/api/listings` | Yes | Create a new listing |
| `GET` | `/api/messages` | Yes | Get a message thread |
| `POST` | `/api/messages` | Yes | Send a message |
| `GET` | `/api/orders` | Yes | Get an order by ID |
| `POST` | `/api/orders` | Yes | Create a new order |

## Onboarding Flow

1. **Create an Account** — Create a new account on the platform
2. **Verify Email** — Verify your email address
3. **Set Up Profile** — Set up your profile and add a profile picture

## Unique Differentiators

- Safe and anonymous transactions
- Own shop system for sellers
- No transaction fees
- Human-operated fake check

<!-- section:copy -->
## Marketing Copy

Use this copy consistently across all pages:

- **Hero Headline:** Buy and Sell Used Panties Safely
- **Hero Subheadline:** A platform for individuals to buy and sell used panties in a safe and anonymous environment
- **Primary CTA:** Sign Up
- **Secondary CTA:** Learn More
- **Value Propositions:**
  - Safe and Anonymous Transactions
  - Own Shop System for Sellers
  - No Transaction Fees
- **Feature Headlines:**
  - Safe and Anonymous Transactions
  - Own Shop System for Sellers
  - No Transaction Fees
<!-- /section:copy -->

## Non-Functional Requirements (NFRs)

| Category | Target | Measurement |
|----------|--------|-------------|
| **Performance** | First Load JS < 300KB per route | Build output |
| **Performance** | LCP < 2.5s | Lighthouse |
| **Performance** | CLS = 0 | Lighthouse |
| **Performance** | API response < 500ms p95 | Server logs |
| **Availability** | 99.9% uptime target | Health check monitoring |
| **Scalability** | Support 10K concurrent users | Load testing |
| **Security** | Zero critical vulnerabilities | npm audit |
| **Security** | All tables RLS-enabled | Schema audit |
| **Accessibility** | WCAG 2.1 Level A | axe-core audit |
| **Data Retention** | User data exportable within 72h | GDPR compliance |
| **Error Budget** | < 0.1% error rate | Error monitoring |
| **Recovery** | RTO < 1h, RPO < 24h | Backup restoration test |

## Patterns

```typescript
// Server query
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
const { data } = await supabase.from("table").select("*").eq("user_id", user.id);
```

## Rules

- Server Components default
- `npx shadcn@latest add <component>`
- API: Zod validate → auth check → logic → `{ data }` or `{ error }`

