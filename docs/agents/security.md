# Security Agent — Build Agent

> **Product:** PantyHub
> **Agent ID:** security
> **Phases:** 5 | **Est. Time:** ~4 min
> **Dependencies:** error-handling, responsive, feature-payments, feature-uploads, feature-realtime, feature-search, feature-notifications, feature-messaging, feature-reviews

Security headers, rate limiting, input sanitization, CSRF protection

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
Store these in `agents.security.inputHashes` in BUILD_STATE.json.

**Build check:** Run `npx tsc --noEmit` — must pass before starting.

**Rollback preparation:** Before starting, create a restore point:
```bash
git add -A && git stash push -m "pre-security"
git stash pop
```
If this agent fails catastrophically, you can rollback with `git stash pop`.

All checks passed? Proceed to Phase 1.

---

## Context

> Extracted from `docs/CONTEXT.md` — only sections relevant to this agent.
> For full details, read `docs/CONTEXT.md`.

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
- `supabase/schema.sql` → **Schema Agent**
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


If you need something from another agent's file, read it but DO NOT write to it. If the file is missing or has wrong content, log it as a dependency error in BUILD_STATE.json.

---

## Instructions

Execute all phases below in order. After each phase:
1. Run `npx tsc --noEmit` — fix any errors before continuing
2. Verify the phase's tasks are complete
3. Move to the next phase

---

## Phase 1: 34 - Security Headers + NFR Enforcement

> Source: `docs/phases/34-security.md`

# 34 - Security Headers + NFR Enforcement

> **Purpose:** Add security headers via next.config to protect against common attacks. Meet security NFRs.
> **Block:** H — Hardening
> **Depends on:** All feature phases complete

---

## Non-Functional Requirements (Security)

These are hard requirements, not suggestions:

| NFR | Target | How to Verify |
|-----|--------|---------------|
| Security headers | All 6 present on every response | Browser DevTools > Network > Response Headers |
| CSP violations | Zero | Browser console (CSP reports) |
| HTTPS enforcement | 100% of production traffic | HSTS header + Vercel config |
| Clickjacking protection | Blocked | X-Frame-Options: DENY |
| MIME sniffing | Blocked | X-Content-Type-Options: nosniff |
| Referrer leakage | Controlled | Referrer-Policy: strict-origin-when-cross-origin |

---

## Instructions

### 1. Update next.config.ts

Add security headers:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-src https://js.stripe.com",
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
        ],
      },
    ];
  },
};
```

### 2. Headers Explained

| Header | Purpose | Attack Prevented |
|--------|---------|------------------|
| X-Frame-Options: DENY | Prevents page from being embedded in iframes | Clickjacking |
| X-Content-Type-Options: nosniff | Prevents MIME type sniffing | Drive-by downloads |
| Referrer-Policy | Controls how much URL info is sent | Referrer data leakage |
| HSTS | Forces HTTPS for 2 years | SSL stripping (MitM) |
| CSP | Controls allowed content sources | XSS, code injection |
| Permissions-Policy | Controls browser API access | Feature abuse |
| X-XSS-Protection | Legacy XSS filter | Reflected XSS (older browsers) |

### 3. CSP Tuning

The default CSP above works for most Next.js + Supabase apps. Adjust if needed:

| If you need... | Add to CSP |
|----------------|-----------|
| Google Fonts | `font-src 'self' fonts.gstatic.com` |
| Google Analytics | `script-src ... https://www.googletagmanager.com` |
| Stripe | `script-src ... https://js.stripe.com; frame-src https://js.stripe.com` |
| External images | `img-src ... https://your-cdn.com` |
| Sentry | `connect-src ... https://*.ingest.sentry.io` |

### 4. Verify Headers

```bash
npm run build && npm run start &
sleep 3
curl -sI http://localhost:3000 | grep -E "x-frame|x-content|referrer|strict-transport|content-security|permissions-policy"
kill %1
```

**All 6 headers must be present.**

---

## SLA Targets

| Metric | Target | Current |
|--------|--------|---------|
| Security header coverage | 100% of routes | [Run verification] |
| CSP violations logged | 0 in production | [Check console] |
| npm audit critical | 0 | [Run npm audit] |

---

## Validation

- [ ] All 6 security headers present in next.config
- [ ] Headers visible in browser DevTools (Network > Response Headers)
- [ ] CSP doesn't block Supabase connections
- [ ] CSP doesn't block Stripe (if payments enabled)
- [ ] Permissions-Policy restricts unused browser APIs
- [ ] `npm audit` shows 0 critical vulnerabilities
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

## Phase 2: 34b - Rate Limiting (Production-Grade)

> Source: `docs/phases/34b-rate-limiting.md`

# 34b - Rate Limiting (Production-Grade)

> **Purpose:** Per-user + per-IP rate limiting with separate buckets per endpoint type
> **Block:** H — Hardening
> **Depends on:** Phase 13/13b — entity-api-list/detail (API routes exist)

---

## Instructions

### 1. Rate Limit Utility

Create `lib/rate-limit.ts`:

```typescript
type RateLimitRecord = { count: number; resetTime: number };

const buckets = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of buckets) {
    if (now > record.resetTime) buckets.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const record = buckets.get(identifier);

  if (!record || now > record.resetTime) {
    buckets.set(identifier, { count: 1, resetTime: now + config.windowMs });
    return { success: true, remaining: config.limit - 1, retryAfterMs: 0 };
  }

  if (record.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterMs: record.resetTime - now,
    };
  }

  record.count++;
  return { success: true, remaining: config.limit - record.count, retryAfterMs: 0 };
}

// Composite key: user ID + IP for double-layer protection
export function getRateLimitKey(
  request: Request,
  userId?: string
): { userKey: string; ipKey: string } {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  return {
    userKey: userId ? `user:${userId}` : `anon:${ip}`,
    ipKey: `ip:${ip}`,
  };
}
```

### 2. Rate Limit Presets

```typescript
// lib/rate-limit.ts (continued)

export const RATE_LIMITS = {
  // Auth: strict to prevent brute force
  auth: { limit: 10, windowMs: 15 * 60 * 1000 },      // 10 req / 15 min

  // Create: moderate
  create: { limit: 30, windowMs: 60 * 1000 },           // 30 req / min

  // Update: moderate
  update: { limit: 60, windowMs: 60 * 1000 },           // 60 req / min

  // Delete: strict
  delete: { limit: 10, windowMs: 60 * 1000 },           // 10 req / min

  // Read: generous
  read: { limit: 200, windowMs: 60 * 1000 },            // 200 req / min

  // Upload: strict
  upload: { limit: 20, windowMs: 60 * 1000 },           // 20 req / min

  // Global IP limit: prevents single IP from hammering
  globalIp: { limit: 500, windowMs: 60 * 1000 },        // 500 req / min per IP
} as const;
```

### 3. Apply to API Routes

Every mutation route gets dual rate limiting (per-user + per-IP):

```typescript
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { userKey, ipKey } = getRateLimitKey(request, user?.id);

  // Check both user and IP limits
  const userCheck = checkRateLimit(`create:${userKey}`, RATE_LIMITS.create);
  const ipCheck = checkRateLimit(`global:${ipKey}`, RATE_LIMITS.globalIp);

  if (!userCheck.success || !ipCheck.success) {
    const retryAfter = Math.max(userCheck.retryAfterMs, ipCheck.retryAfterMs);
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfter / 1000)) },
      }
    );
  }

  // ... rest of handler
}
```

### 4. Stripe Webhook Exception

**CRITICAL:** Stripe webhooks must NEVER be rate limited.

```typescript
// app/api/stripe/webhook/route.ts
export async function POST(request: Request) {
  // NO rate limiting here — Stripe sends retries and we must accept them
  // Verify webhook signature instead
  const sig = request.headers.get("stripe-signature");
  // ... handle webhook
}
```

### 5. Abuse Detection Logging

Log rate limit violations for monitoring:

```typescript
export function logRateLimitViolation(
  endpoint: string,
  identifier: string,
  ip: string
) {
  console.warn("[RATE_LIMIT]", {
    endpoint,
    identifier,
    ip,
    timestamp: new Date().toISOString(),
  });
  // Production: forward to monitoring (Sentry, Datadog, PagerDuty)
}
```

Call this when `checkRateLimit` returns `success: false`.

### 6. Rate Limit Headers

Add rate limit info to ALL API responses:

```typescript
headers: {
  "X-RateLimit-Limit": String(config.limit),
  "X-RateLimit-Remaining": String(remaining),
}
```

---

## Rate Limit Matrix

| Endpoint Type | Per-User Limit | Per-IP Limit | Window |
|--------------|----------------|-------------|--------|
| Auth (login/signup) | 10 | 10 | 15 min |
| Create (POST) | 30 | 500 | 1 min |
| Update (PATCH) | 60 | 500 | 1 min |
| Delete (DELETE) | 10 | 500 | 1 min |
| Read (GET) | 200 | 500 | 1 min |
| Upload | 20 | 500 | 1 min |
| Stripe Webhook | **EXEMPT** | **EXEMPT** | — |

---

### 7. Scaling Note: Distributed Rate Limiting

The in-memory rate limiter above works for **single-server deployments** (Vercel serverless, single Fly.io instance). For multi-server setups:

**Problem:** Each server has its own `Map`, so a user can hit N servers × limit requests.

**Solution:** Use Redis-based rate limiting when scaling to multiple servers:
```typescript
// Replace the in-memory Map with Redis (e.g., @upstash/ratelimit)
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "60 s"),
});

// Usage in route:
const { success, remaining } = await ratelimit.limit(identifier);
```

**When to switch:** If you deploy to multiple instances or see rate limits being ineffective.
**For MVP:** The in-memory approach is fine. Don't over-engineer.

---

## Validation

- [ ] Rate limit utility with cleanup interval
- [ ] Dual rate limiting: per-user AND per-IP
- [ ] Separate config per endpoint type
- [ ] Stripe webhooks exempt from rate limiting
- [ ] Abuse violations logged with timestamp + IP
- [ ] 429 response includes Retry-After header
- [ ] Rate limit headers on API responses
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

## Phase 3: 34c - Input Sanitization + Compliance Hooks

> Source: `docs/phases/34c-input-sanitization.md`

# 34c - Input Sanitization + Compliance Hooks

> **Purpose:** Prevent XSS and injection attacks. Implement compliance-ready data handling hooks.
> **Block:** H — Hardening
> **Depends on:** Phase 12b — entity-schemas (Zod schemas), Phase 17 — entity-forms (forms)

---

## Instructions

### 1. Zod Already Handles Most Validation

Zod schemas strip/validate types automatically. However, for string fields that render as HTML, add extra protection.

### 2. HTML Escaping Utility

Create `lib/utils/sanitize.ts`:

```typescript
/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strip all HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize a string for safe storage (trim + normalize whitespace)
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

/**
 * Redact sensitive fields for logging
 * Used for GDPR-compliant logging — never log PII
 */
export function redactForLogging(obj: Record<string, unknown>, sensitiveKeys: string[]): Record<string, unknown> {
  const redacted = { ...obj };
  for (const key of sensitiveKeys) {
    if (key in redacted) {
      redacted[key] = "[REDACTED]";
    }
  }
  return redacted;
}
```

### 3. React Already Escapes by Default

React's JSX automatically escapes content rendered in `{}`. Verify:

```bash
# Search for dangerous patterns
grep -rn "dangerouslySetInnerHTML" app/ components/ --include="*.tsx" || echo "OK: None found"
grep -rn "innerHTML" app/ components/ --include="*.tsx" || echo "OK: None found"
grep -rn "eval()" app/ lib/ --include="*.ts" --include="*.tsx" || echo "OK: None found"
grep -rn "Function()" app/ lib/ --include="*.ts" --include="*.tsx" || echo "OK: None found"
```

**If any found: remove them. No exceptions.**

### 4. URL Input Validation

For any URL fields:

```typescript
z.string().url().refine(
  (url) => url.startsWith("https://") || url.startsWith("http://localhost"),
  "URL must use HTTPS"
)
```

### 5. File Upload Validation (if applicable)

```typescript
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File too large (max 10MB)" };
  }
  return { valid: true };
}
```

---

## Compliance Hooks

These are implementation hooks — not legal advice. They prepare the codebase for compliance audits.

### GDPR Readiness Checklist

| Requirement | Implementation Hook | Status |
|-------------|-------------------|--------|
| **Data Minimization** | Only collect fields listed in Zod schemas. No extra fields. | [ ] |
| **Purpose Limitation** | Each field has a documented purpose in types/ | [ ] |
| **Consent Tracking** | Store `consent_given_at` timestamp on signup | [ ] |
| **Right to Access** | `/api/user/export` endpoint (Phase 39d) | [ ] |
| **Right to Erasure** | `/api/user/delete` endpoint (Phase 39d) | [ ] |
| **Data Portability** | Export as JSON (same endpoint) | [ ] |
| **Breach Notification** | logError() with severity flag (Phase 20) | [ ] |
| **PII in Logs** | Use `redactForLogging()` — never log email, name, IP | [ ] |

### SOC 2 Readiness Checklist

| Requirement | Implementation Hook | Status |
|-------------|-------------------|--------|
| **Access Control** | RLS on all tables (Phase 09) | [ ] |
| **Input Validation** | Zod on all API endpoints (Phase 22) | [ ] |
| **Audit Trail** | deletion_audit_log table (data-lifecycle) | [ ] |
| **Encryption in Transit** | HSTS header (Phase 43) | [ ] |
| **Error Handling** | Standardized error codes (Phase 37) | [ ] |
| **Change Management** | CODEOWNERS + review requirements (ownership) | [ ] |
| **Monitoring** | logError() + Sentry hooks (Phase 20) | [ ] |

### ISO 27001 Technical Mapping

| ISO Control | Where Implemented |
|-------------|------------------|
| A.9 Access Control | Auth middleware (Phase 11) + RLS (Phase 09) |
| A.10 Cryptography | HTTPS (Phase 43) + Supabase encryption at rest |
| A.12 Operations Security | Rate limiting (Phase 44) + monitoring (Phase 20) |
| A.14 System Dev Security | Input validation (this phase) + code review (ownership) |
| A.18 Compliance | Data lifecycle + retention policies |

---

## PII Handling Rules

| Rule | Implementation |
|------|----------------|
| Never log PII | Use `redactForLogging()` before any `console.error` |
| Never in URLs | No email, name, or ID in query params |
| Never in error messages | Show generic messages to users, log details server-side |
| Encrypt sensitive fields | Use Supabase vault or app-level encryption for SSN, health data |
| Retention limits | Implement TTL on session/token data |

---

## Validation

- [ ] No `dangerouslySetInnerHTML` in codebase
- [ ] No `innerHTML` assignments
- [ ] No `eval()` or `Function()` calls
- [ ] `sanitize.ts` utility exists with escapeHtml, stripHtml, redactForLogging
- [ ] URL fields validate HTTPS protocol
- [ ] File uploads validate type + size (if applicable)
- [ ] GDPR readiness hooks identified
- [ ] SOC 2 readiness hooks identified
- [ ] PII never appears in console output
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

## Phase 4: 34d - Security Hardening

> Source: `docs/phases/34d-security-hardening.md`

# 34d - Security Hardening

> **Purpose:** Implement security headers, rate limiting, input validation, OWASP protection
> **Input:** security_requirements[], trust_level, compliance_flags[]
> **Output:** Security middleware, rate limiter, validation rules

---

## Stop Conditions

- ✗ Missing security headers → BLOCK
- ✗ API without rate limiting → BLOCK
- ✗ User input without sanitization → BLOCK
- ✗ Secrets in client code → BLOCK

---

## Input from CONTEXT.md

```yaml
trust_level: high

security_requirements:
  - seller_verification
  - escrow_payments
  - dispute_resolution
  - fraud_detection

compliance_flags:
  - pci_dss
  - consumer_protection
  - tax_reporting

rate_limits:
  POST /auth/login: 5/min per IP
  POST /auth/signup: 10/min per IP
  POST /auth/reset-password: 3/min per IP
  DELETE /*: 10/min per user
```

---

## Tasks (Sequential)

### Task 1: Generate Security Headers

File: `middleware.ts` (extend existing)

```typescript
import { NextResponse, type NextRequest } from "next/server";

const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
};

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust for your needs
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Apply security headers
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    cspDirectives.join("; ")
  );

  return response;
}
```

### Task 2: Generate Rate Limiter

File: `lib/rate-limit/index.ts`

```typescript
import { LRUCache } from "lru-cache";

interface RateLimitConfig {
  interval: number; // ms
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

const rateLimiters = new Map<string, LRUCache<string, number[]>>();

function getLimiter(key: string, config: RateLimitConfig): LRUCache<string, number[]> {
  if (!rateLimiters.has(key)) {
    rateLimiters.set(
      key,
      new LRUCache({
        max: 10000,
        ttl: config.interval,
      })
    );
  }
  return rateLimiters.get(key)!;
}

export function rateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): RateLimitResult {
  const limiter = getLimiter(endpoint, config);
  const now = Date.now();
  const key = `${identifier}:${endpoint}`;

  const timestamps = limiter.get(key) || [];
  const windowStart = now - config.interval;

  // Filter timestamps within window
  const recentTimestamps = timestamps.filter(t => t > windowStart);
  recentTimestamps.push(now);

  limiter.set(key, recentTimestamps);

  const allowed = recentTimestamps.length <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - recentTimestamps.length);
  const reset = Math.ceil((windowStart + config.interval) / 1000);

  return { allowed, remaining, reset };
}

// Pre-configured rate limits
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "POST /auth/login": { maxRequests: 5, interval: 60000 },
  "POST /auth/signup": { maxRequests: 10, interval: 60000 },
  "POST /auth/reset-password": { maxRequests: 3, interval: 60000 },
  "DELETE /*": { maxRequests: 10, interval: 60000 },
  "auth/login": { maxRequests: 5, interval: 60000 },
  "auth/signup": { maxRequests: 10, interval: 60000 },
  "auth/reset": { maxRequests: 3, interval: 60000 },
};
```

### Task 3: Generate Rate Limit Middleware

File: `lib/middleware/rate-limit.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withRateLimit(
  endpoint: string,
  handler: Handler
): Handler {
  return async (request: NextRequest) => {
    // Get identifier (IP or user ID)
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userId = request.headers.get("x-user-id");
    const identifier = userId || ip;

    // Get rate limit config
    const config = RATE_LIMITS[endpoint] || RATE_LIMITS["default"];
    const result = rateLimit(identifier, endpoint, config);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please try again later.",
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(config.maxRequests),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.reset),
            "Retry-After": String(Math.ceil(config.interval / 1000)),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", String(config.maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.reset));

    return response;
  };
}
```

### Task 4: Generate Input Sanitization

File: `lib/security/sanitize.ts`

```typescript
import DOMPurify from "isomorphic-dompurify";

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

// Strip all HTML
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

// Sanitize for SQL (use parameterized queries instead when possible)
export function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

// Validate and sanitize URL
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 255);
}

// Sanitize object recursively
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  stripHtmlFields: string[] = []
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = stripHtmlFields.includes(key)
        ? stripHtml(value)
        : value.trim();
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>, stripHtmlFields);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
```

### Task 5: Generate CSRF Protection

File: `lib/security/csrf.ts`

```typescript
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

export async function generateCsrfToken(): Promise<string> {
  const token = nanoid(32);

  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });

  return token;
}

export async function validateCsrfToken(request: Request): Promise<boolean> {
  const headerToken = request.headers.get(CSRF_HEADER);
  if (!headerToken) return false;

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;

  return headerToken === cookieToken;
}

export function withCsrf(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    // Skip CSRF for safe methods
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      return handler(request);
    }

    const valid = await validateCsrfToken(request);
    if (!valid) {
      return Response.json(
        { error: { code: "CSRF_INVALID", message: "Invalid CSRF token" } },
        { status: 403 }
      );
    }

    return handler(request);
  };
}
```

### Task 6: Generate Secret Scanning

File: `scripts/scan-secrets.ts`

```typescript
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const SECRET_PATTERNS = [
  /(?:api[_-]?key|apikey)["\s:=]+["']?[a-zA-Z0-9_-]{20,}["']?/gi,
  /(?:secret|token|password|pwd)["\s:=]+["']?[a-zA-Z0-9_-]{8,}["']?/gi,
  /sk_(?:test|live)_[a-zA-Z0-9]{24,}/g, // Stripe secret key
  /SUPABASE_SERVICE_ROLE_KEY/g,
  /-----BEGIN (?:RSA )?PRIVATE KEY-----/g,
];

const IGNORE_FILES = [
  ".env.example",
  ".env.local.example",
  "node_modules",
  ".next",
  ".git",
];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_FILES.some(ignore => filePath.includes(ignore));
}

function scanFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const findings: string[] = [];

  for (const pattern of SECRET_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      findings.push(`${filePath}: Potential secret found (pattern: ${pattern.source.slice(0, 30)}...)`);
    }
  }

  return findings;
}

function scanDirectory(dir: string): string[] {
  const findings: string[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (shouldIgnore(filePath)) continue;

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findings.push(...scanDirectory(filePath));
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx|json|md|env)$/.test(file)) {
      findings.push(...scanFile(filePath));
    }
  }

  return findings;
}

console.log("Scanning for secrets...");
const findings = scanDirectory(process.cwd());

if (findings.length > 0) {
  console.error("\n❌ Secrets detected:\n");
  findings.forEach(f => console.error(`  ${f}`));
  process.exit(1);
} else {
  console.log("\n✅ No secrets detected");
}
```

### Task 7: Generate Security Checklist

File: `docs/SECURITY_CHECKLIST.md`

```markdown
# Security Checklist - PantyHub

## Headers
- [x] Strict-Transport-Security
- [x] X-Frame-Options
- [x] X-Content-Type-Options
- [x] Content-Security-Policy
- [x] Referrer-Policy

## Authentication
- [ ] Session timeout configured
- [ ] Secure cookie flags set
- [ ] CSRF protection enabled
- [ ] Rate limiting on auth endpoints

## Input Validation
- [ ] All user input sanitized
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] File uploads validated

## API Security
- [ ] Rate limiting on all endpoints
- [ ] Authorization on all endpoints
- [ ] Error messages don't leak info

## Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Sensitive data encrypted in transit
- [ ] PII logging redacted
- [ ] Database backups encrypted




## PCI-DSS
- [ ] No card data stored
- [ ] Stripe tokenization used
- [ ] Audit logging enabled

```

---

## Validation Checklist

- [ ] Security headers configured
- [ ] Rate limiting on all API routes
- [ ] Input sanitization library installed
- [ ] CSRF protection enabled
- [ ] Secret scanning in CI
- [ ] Security checklist complete
- [ ] No secrets in codebase

---

## Artifacts

| File | Content |
|------|---------|
| `middleware.ts` | Security headers |
| `lib/rate-limit/index.ts` | Rate limiter |
| `lib/middleware/rate-limit.ts` | Rate limit middleware |
| `lib/security/sanitize.ts` | Input sanitization |
| `lib/security/csrf.ts` | CSRF protection |
| `scripts/scan-secrets.ts` | Secret scanner |
| `docs/SECURITY_CHECKLIST.md` | Security checklist |

---

**Next Phase:** `14-qa-e2e.md`

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

## Phase 5: 34e - Observability

> Source: `docs/phases/34e-observability.md`

# 34e - Observability

> **Purpose:** Implement logging, metrics, tracing, and error tracking
> **Input:** entities[], features[], trust_level, scaling_expectation
> **Output:** Logger config, metrics endpoints, error boundaries

---

## Stop Conditions

- ✗ No error boundary on root → BLOCK
- ✗ API route without logging → BLOCK
- ✗ Sensitive data in logs → BLOCK
- ✗ No health check endpoint → BLOCK

---

## Input from CONTEXT.md

```yaml
trust_level: high
scaling_expectation: prototype

logging_level: verbose
metrics_enabled: false
```

---

## Tasks (Sequential)

### Task 1: Generate Structured Logger

File: `lib/logger/index.ts`

```typescript
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  duration?: number;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LOG_LEVEL: LogLevel = process.env.NODE_ENV === "production"
  ? "debug"
  : "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify({
    ...entry,
    env: process.env.NODE_ENV,
    service: "pantyhub",
  });
}

// Sanitize sensitive data
const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "creditCard",
  "ssn",
  "password",
];

function sanitize(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object") {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (!shouldLog("debug")) return;
    console.log(formatLog({
      level: "debug",
      message,
      timestamp: new Date().toISOString(),
      context: sanitize(context) as LogContext,
    }));
  },

  info(message: string, context?: LogContext) {
    if (!shouldLog("info")) return;
    console.log(formatLog({
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      context: sanitize(context) as LogContext,
    }));
  },

  warn(message: string, context?: LogContext) {
    if (!shouldLog("warn")) return;
    console.warn(formatLog({
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      context: sanitize(context) as LogContext,
    }));
  },

  error(message: string, error?: Error, context?: LogContext) {
    if (!shouldLog("error")) return;
    console.error(formatLog({
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...sanitize(context) as LogContext,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      },
    }));
  },
};
```

### Task 2: Generate Request Logging Middleware

File: `lib/middleware/logging.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

export function withLogging(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const requestId = request.headers.get("x-request-id") || nanoid();
    const startTime = Date.now();

    const context = {
      requestId,
      method: request.method,
      path: request.nextUrl.pathname,
      userAgent: request.headers.get("user-agent") || undefined,
    };

    logger.info("Request started", context);

    try {
      const response = await handler(request);
      const duration = Date.now() - startTime;

      logger.info("Request completed", {
        ...context,
        duration,
        status: response.status,
      });

      // Add request ID to response headers
      response.headers.set("x-request-id", requestId);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error(
        "Request failed",
        error instanceof Error ? error : new Error(String(error)),
        { ...context, duration }
      );

      throw error;
    }
  };
}
```

### Task 3: Generate Error Boundary

File: `components/error-boundary.tsx`

```tsx
"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error("Error boundary caught:", error, errorInfo);

    // Send to error tracking (Sentry, etc.)
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        extra: { componentStack: errorInfo.componentStack },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We apologize for the inconvenience. Please try again.
          </p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

File: `app/error.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">
        {error.digest ? `Error ID: ${error.digest}` : "An unexpected error occurred"}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

### Task 4: Generate Health Check

File: `app/api/health/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  latency_ms?: number;
  message?: string;
}

export async function GET() {
  const checks: HealthCheck[] = [];
  const startTime = Date.now();

  // Database check
  try {
    const dbStart = Date.now();
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);

    checks.push({
      name: "database",
      status: error ? "unhealthy" : "healthy",
      latency_ms: Date.now() - dbStart,
      message: error?.message,
    });
  } catch (e) {
    checks.push({
      name: "database",
      status: "unhealthy",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }

  // Memory check
  const memUsage = process.memoryUsage();
  const memPercent = memUsage.heapUsed / memUsage.heapTotal;
  checks.push({
    name: "memory",
    status: memPercent > 0.9 ? "degraded" : "healthy",
    message: `${Math.round(memPercent * 100)}% heap used`,
  });

  const overallStatus = checks.every(c => c.status === "healthy")
    ? "healthy"
    : checks.some(c => c.status === "unhealthy")
    ? "unhealthy"
    : "degraded";

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev",
      uptime_ms: Date.now() - startTime,
      checks,
    },
    { status: overallStatus === "unhealthy" ? 503 : 200 }
  );
}
```

### Task 5: Generate Metrics Collection

// Metrics disabled for prototype scaling level

### Task 6: Generate API Error Handler

File: `lib/api/error-handler.ts`

```typescript
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): NextResponse {
  // Zod validation error
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  // Custom API error
  if (error instanceof ApiError) {
    logger.warn(`API Error: ${error.code}`, {
      message: error.message,
      statusCode: error.statusCode,
    });

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Unknown error
  const message = error instanceof Error ? error.message : "Unknown error";
  logger.error("Unhandled API error", error instanceof Error ? error : new Error(message));

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : message,
      },
    },
    { status: 500 }
  );
}
```

---

## Validation Checklist

- [ ] Structured logger implemented
- [ ] Request logging middleware created
- [ ] Error boundary in root layout
- [ ] Page error handler created
- [ ] Health check endpoint working

- [ ] API error handler standardized
- [ ] Sensitive data redacted from logs
- [ ] Request IDs propagated

---

## Artifacts

| File | Content |
|------|---------|
| `lib/logger/index.ts` | Structured logger |
| `lib/middleware/logging.ts` | Request logging |
| `components/error-boundary.tsx` | React error boundary |
| `app/error.tsx` | Page error handler |
| `app/api/health/route.ts` | Health check endpoint |

| `lib/api/error-handler.ts` | API error handling |

---

**Next Phase:** `12-performance.md`

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

- [ ] All tasks completed



```bash
echo 'All tasks completed'
```

If any contract fails, fix the file before reporting completion. Do NOT skip contract failures.

---

## Completion Protocol

After all outputs verified:

1. Write your agent state to `docs/build-state/security.json` (avoids race conditions with parallel agents):
   ```json
   {
     "agentId": "security",
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
   - Set `agents.security.status` to `"complete"`
   - Set `agents.security.completedAt` to current ISO timestamp
   - Set `lastUpdatedByAgent` to `"security"`
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
   ## [security] {error-title}
   - **Phase:** {phase-file}
   - **Type:** transient | config | logic | dependency
   - **Severity:** critical | major | minor
   - **Error:** {error message}
   - **Attempted fixes:** {what you tried}
   - **Workaround:** {stub/mock created}
   - **Impact:** {what won't work until this is fixed}
   ```
2. Create a stub/mock that makes the build pass
3. Add to `agents.security.warnings` in BUILD_STATE.json
4. Continue to the next phase

---

**Agent security complete.** Report status to orchestrator.
