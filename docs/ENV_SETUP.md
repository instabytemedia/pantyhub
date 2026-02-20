# PantyHub — Environment Setup Guide

> **PantyHub** is a used_panty_marketplace product targeting Individuals interested in buying and selling used panties, including those looking for a unique way to make money and those seeking specific types of used underwear.
> This guide walks you through obtaining every API key and secret needed to run the project locally.

---

## Before You Start

Read this **before Phase 28 (Infrastructure)**. Setting up all required services takes approximately **~15 minutes**. Optional services can be configured later as needed.

---

## Quick Checklist

Use this checklist to track your progress. Check off each service once configured:

- [ ] Supabase (REQUIRED)
- [ ] Stripe (optional)
- [ ] Resend (optional)
- [ ] Sentry (optional)
- [ ] Upstash (optional)
- [ ] Cron Secret (optional)
- [ ] OAuth Providers (optional)

---

## Required Services

These must be configured before you can run the application.

### 1. Supabase (REQUIRED)

**Environment variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)

**Steps:**

1. Create a new project (or select existing) at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **Settings > API**.
3. Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the **anon / public** key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Copy the **service_role / secret** key and paste it as `SUPABASE_SERVICE_ROLE_KEY`.

---

## Optional Services

These services power specific features. You can skip them initially and configure them when you reach the relevant phase.

### 2. Stripe (optional)

**Environment variables:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Dashboard:** [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

**Steps:**

1. Create an account at [stripe.com](https://stripe.com) if you haven't already.
2. Navigate to **Developers > API Keys** at [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
3. Copy the **Publishable key** and paste it as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Copy the **Secret key** and paste it as `STRIPE_SECRET_KEY`.
5. Go to **Developers > Webhooks** and add an endpoint pointing to your `/api/webhooks/stripe` route.
6. Copy the **Signing secret** from the webhook and paste it as `STRIPE_WEBHOOK_SECRET`.

### 3. Resend (optional)

**Environment variables:**
- `RESEND_API_KEY`

**Dashboard:** [https://resend.com/api-keys](https://resend.com/api-keys)

**Steps:**

1. Create an account at [resend.com](https://resend.com).
2. Navigate to **API Keys** at [resend.com/api-keys](https://resend.com/api-keys).
3. Click **Create API Key**, give it a name, and copy the key.
4. Paste it as `RESEND_API_KEY`.

### 4. Sentry (optional)

**Environment variables:**
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`

**Dashboard:** [https://sentry.io](https://sentry.io)

**Steps:**

1. Create an account at [sentry.io](https://sentry.io).
2. Create a new project and select **Next.js** as the platform.
3. Copy the **DSN** from the project settings and paste it as `SENTRY_DSN`.
4. Go to **Settings > Auth Tokens** and generate a new token with `project:releases` and `org:read` scopes.
5. Paste it as `SENTRY_AUTH_TOKEN`.

### 5. Upstash (optional)

**Environment variables:**
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

**Dashboard:** [https://console.upstash.com](https://console.upstash.com)

**Steps:**

1. Sign up or log in at [console.upstash.com](https://console.upstash.com).
2. Create a new **Redis** database (choose a region close to your deployment).
3. In the database details, find the **REST API** section.
4. Copy the **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN** values.

### 6. Cron Secret (optional)

**Environment variables:**
- `CRON_SECRET`

**Steps:**

1. Generate a random string (e.g. `openssl rand -hex 32` in your terminal).
2. Paste the result as `CRON_SECRET`.
3. This secret is used to authenticate cron job endpoints so they cannot be triggered by external actors.

### 7. OAuth Providers (optional)

**Environment variables:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

**Steps:**

1. **Google OAuth:**
  1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
  2. Click **Create Credentials > OAuth 2.0 Client ID**.
  3. Set the application type to **Web application**.
  4. Add your redirect URI (e.g. `https://your-project.supabase.co/auth/v1/callback`).
  5. Copy **Client ID** and **Client Secret** into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

8. **GitHub OAuth:**
  1. Go to [GitHub > Settings > Developer settings > OAuth Apps](https://github.com/settings/developers).
  2. Click **New OAuth App**.
  3. Set the **Authorization callback URL** to your Supabase callback URL.
  4. Copy **Client ID** and **Client Secret** into `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

---

## Verification

After filling in your environment variables, verify everything is working:

```bash
npm run dev
```

**Check for:**

- No `"missing env variable"` warnings in the console
- Supabase connection succeeds (no `SUPABASE_URL` errors)
- Auth flow works (sign-up / sign-in redirects correctly)
- Stripe loads without errors (check browser console)

If a service is misconfigured, the console will typically print the variable name that is missing or invalid. Double-check the value in `.env.local`.

---

## `.env` Template

Copy the block below into `.env.local` and fill in each value:

```bash
# .env.local
# Generated by Vibery Blueprint — fill in your values

# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# --- Stripe ---
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# --- Resend ---
RESEND_API_KEY=

# --- Sentry ---
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# --- Upstash ---
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# --- Cron Secret ---
CRON_SECRET=

# --- OAuth Providers ---
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

```

---

*Generated by Vibery Blueprint for PantyHub.*
