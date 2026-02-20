# Pages Agent — Build Agent

> **Product:** PantyHub
> **Agent ID:** pages
> **Phases:** 5 | **Est. Time:** ~6 min
> **Dependencies:** foundation

Landing page, global pages (about, contact), legal pages (terms, privacy), dark mode toggle

---


> **POLISH:** Primary buttons should have `hover:brightness-110 active:scale-[0.98] transition-all` for tactile feedback.

## Pre-Flight Check

Before executing any phases, verify ALL prerequisites:

```bash
test -e "package.json" && echo "✓ package.json" || echo "✗ MISSING: package.json"
test -e "tailwind.config.ts" && echo "✓ tailwind.config.ts" || echo "✗ MISSING: tailwind.config.ts"
test -e "app/globals.css" && echo "✓ app/globals.css" || echo "✗ MISSING: app/globals.css"
```

**Context handoff:** Read per-agent state files to understand what previous agents produced:
- `docs/build-state/foundation.json` — decisions, warnings, files created

Also read `docs/BUILD_STATE.json` for the global overview (conflict zones, tier progress).

**Cross-agent types:** Read `docs/contracts/shared-types.json` for entity definitions, naming conventions, and design tokens. Do NOT deviate from these conventions.
**Route safety:** Check `routeOverrides` in shared-types.json. If your entity route conflicts with a reserved/feature route, use the override path (e.g., `manage-reviews` instead of `reviews`).

**Dependency hashes:** Record hashes of input files for change detection:
```bash
md5sum "package.json" 2>/dev/null || echo "N/A package.json"
md5sum "tailwind.config.ts" 2>/dev/null || echo "N/A tailwind.config.ts"
md5sum "app/globals.css" 2>/dev/null || echo "N/A app/globals.css"
```
Store these in `agents.pages.inputHashes` in BUILD_STATE.json.

**Build check:** Run `npx tsc --noEmit` — must pass before starting.

**Rollback preparation:** Before starting, create a restore point:
```bash
git add -A && git stash push -m "pre-pages"
git stash pop
```
If this agent fails catastrophically, you can rollback with `git stash pop`.

All checks passed? Proceed to Phase 1.

---

## Context

> Extracted from `docs/CONTEXT.md` — only sections relevant to this agent.
> For full details, read `docs/CONTEXT.md`.

## Identity

| Field | Value |
|-------|-------|
| **Title** | PantyHub |
| **Summary** | Buy and Sell with Confidence |
| **Problem** | Lack of a safe and anonymous platform for buying and selling used panties |
| **Value Prop** | PantyHub is a used panty marketplace that prioritizes user safety and anonymity, offering a range of features including secure transactions, own shop systems, and human-operated fake checks. The platform incentivizes sellers to use the platform by offering no transaction fees and allowing them to set their own prices. Buyers can browse listings, send messages to sellers, and make purchases with ease. |

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

## Audience

| Field | Value |
|-------|-------|
| **Primary Role** | Demographics: 18-45 years old, interests: alternative fashion, kink, and fetish communities, pain points: difficulty finding a safe and anonymous platform to buy and sell used panties, goals: to buy or sell used panties in a secure and private environment |
| **Skill Level** | mixed |
| **Device** | balanced |
| **Frequency** | weekly |

## Business Context

| Field | Value |
|-------|-------|
| **Monetization** | The platform generates revenue through premium features, advertising, and potentially commission-based sales |
| **Complexity** | medium |

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
- `app/page.tsx`
- `app/(public)/about/page.tsx`
- `app/(public)/terms/page.tsx`

If you need something from another agent's file, read it but DO NOT write to it. If the file is missing or has wrong content, log it as a dependency error in BUILD_STATE.json.

---

## Instructions

Execute all phases below in order. After each phase:
1. Run `npx tsc --noEmit` — fix any errors before continuing
2. Verify the phase's tasks are complete
3. Move to the next phase

---

## Phase 1: 06 - Landing Page (Premium)

> Source: `docs/phases/06-landing-page.md`

# 06 - Landing Page (Premium)

> **Purpose:** Create a high-converting, visually premium landing page
> **Block:** B — Visual Shell
> **Depends on:** Phase 05 (root layout), Phase 03 (design system)
> **Quality:** This page is the first thing users see. It MUST look professional and polished.

---

## Page Structure

Create `app/(public)/page.tsx` as a Server Component:

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (glass nav)                                       │
│ Logo                    [Login] [Sign Up]         │
├─────────────────────────────────────────────────────────┤
│ HERO SECTION                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Gradient headline (big, bold)                       │ │
│ │ Subtitle (muted, max 2 lines)                       │ │
│ │ [Sign Up]  [Learn More]                  │ │
│ │                                                     │ │
│ │ Hero image or illustration (right side / below)     │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ SOCIAL PROOF / STATS BAR                                 │
│ "Trusted by X+ users" or 3-4 stat cards                 │
├─────────────────────────────────────────────────────────┤
│ FEATURES (3x2 grid)                                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│ │ Icon     │ │ Icon     │ │ Icon     │                  │
│ │ Title    │ │ Title    │ │ Title    │                  │
│ │ Desc     │ │ Desc     │ │ Desc     │                  │
│ └──────────┘ └──────────┘ └──────────┘                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│ │ ...      │ │ ...      │ │ ...      │                  │
│ └──────────┘ └──────────┘ └──────────┘                  │
├─────────────────────────────────────────────────────────┤
│ HOW IT WORKS (3 numbered steps + connecting line)        │
│ ① Sign up → ② Set up → ③ Go live                       │
├─────────────────────────────────────────────────────────┤
│ TESTIMONIALS (2-3 cards)                                 │
│ Avatar + Quote + Name + Role                             │
├─────────────────────────────────────────────────────────┤
│ FINAL CTA (gradient bg)                                  │
│ "Ready to get started?"                                  │
│ [Sign Up]                                         │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                   │
│ Links + © PantyHub + social icons                  │
└─────────────────────────────────────────────────────────┘
```

---

## Section-by-Section Instructions

### 1. Hero Section

**Headline:** "Buy and Sell Used Panties Safely"
**Subtitle:** "A platform for individuals to buy and sell used panties in a safe and anonymous environment"
**CTA Primary:** "Sign Up" → /signup (large button, primary color)
**CTA Secondary:** "Learn More" → #features (outline button)

**Hero Visual:**
- Use the **gradient dashboard mockup** shown below (browser chrome frame with skeleton UI)
- This looks intentional and professional — better than a broken stock photo
- The mockup automatically adapts to dark/light mode via CSS variables
- **Later improvement:** Once the real dashboard (Phase 18) is built, take a screenshot and replace the mockup with a real app preview

**Design:**
```tsx
// Hero container
<section className="relative py-20 md:py-32 overflow-hidden">
  {/* Gradient blob behind text */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
  </div>

  <div className="container max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    <div>
      {/* Gradient text heading */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {headline}
        </span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-lg">{subtitle}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button size="lg">{ctaPrimary}</Button>
        <Button size="lg" variant="outline">{ctaSecondary}</Button>
      </div>
    </div>
    <div className="relative">
      {/* App screenshot mockup — shows a stylized preview of the dashboard.
          Replace with an actual screenshot of YOUR app once Phase 18 (dashboard) is built.
          For now, use a gradient placeholder that looks intentional: */}
      <div className="relative rounded-lg overflow-hidden shadow-2xl border border-border/50">
        <div className="aspect-[4/3] bg-gradient-to-br from-card via-card/80 to-primary/5 p-8 flex flex-col">
          <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="col-span-1 space-y-3">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted/60" />
              <div className="h-3 w-24 rounded bg-muted/60" />
              <div className="h-3 w-14 rounded bg-muted/60" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded bg-muted/30 border border-border/30 p-3 space-y-2">
                  <div className="h-2 w-12 rounded bg-primary/20" />
                  <div className="h-6 w-16 rounded bg-foreground/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Value Propositions (display as badges or bullet points below CTA):**
1. Safe and Anonymous Transactions
2. Own Shop System for Sellers
3. No Transaction Fees

### 2. Social Proof / Stats Section

Add a stats bar or social proof section between hero and features:

```tsx
<section className="py-12 border-y border-border/50">
  <div className="container max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {/* Define stats array above: const stats = [{ value: "500+", label: "Users" }, ...] */}
    {stats.map(stat => (
      <div key={stat.label}>
        <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
      </div>
    ))}
  </div>
</section>
```

**⚠️ PLACEHOLDER DATA:** These stats are placeholders. Add a code comment `{/* TODO: Replace with real metrics */}` above the stats array. Use realistic but obviously-placeholder values:
- "1,000+" (not specific enough to be mistaken for real)
- Format: `const stats = [ /* TODO: Replace with real metrics */ { value: "1,000+", label: "Users" }, ... ]`

### 3. Features Section

**Features to display:**
1. **Global Search Feature** — [User-specified] A search feature that allows users to find items globally
2. **Authentication** — User login, registration, and session management
3. **Safe and Anonymous Transactions** — Transactions are encrypted and anonymous to ensure user safety
4. **Own Shop System for Sellers** — Sellers can create and manage their own shops
5. **Set Your Own Prices** — Sellers can set their own prices for their items
6. **No Transaction Fees** — No fees are charged for transactions


**Design pattern — glass cards with hover effect:**
```tsx
<section className="py-20 md:py-32">
  <div className="container max-w-6xl mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold">Everything you need to get things done</h2>
      <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
        PantyHub gives you the tools to stay organized and productive.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Define features array above: const features = [{ title: "...", description: "...", icon: Zap }, ...]
         Import icons from lucide-react: import { Zap, Shield, Rocket, ... } from "lucide-react"; */}
      {features.map(feature => (
        <div className="group p-6 rounded-lg border border-border/50 bg-card/50
          backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/30
          transition-all duration-300">
          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center
            justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <feature.icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

Use lucide-react icons. Pick icons that match each feature conceptually.

### 4. How It Works Section

3 numbered steps with a connecting line or arrow pattern:

```tsx
<section className="py-20 md:py-32 bg-muted/30">
  <div className="container max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-16">How it works</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map((step, i) => (
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground
            font-bold text-lg flex items-center justify-center mx-auto mb-4">
            {i + 1}
          </div>
          <h3 className="font-semibold mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

Steps (adapt to PantyHub's domain — "used_panty_marketplace"):
1. **Sign up** — Create your free PantyHub account in seconds
2. **Add your first data** — Create your first entries and organize your workflow
3. **Stay on top** — Track progress and never miss a beat

### 5. Testimonials Section

Add 2-3 testimonial cards (use realistic-sounding placeholder content):

```tsx
<section className="py-20 md:py-32">
  <div className="container max-w-5xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">What people are saying</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map(t => (
        <div className="p-6 rounded-lg border border-border/50 bg-card/50">
          <p className="text-muted-foreground mb-4 italic">"{t.quote}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div>
              <div className="font-medium text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**⚠️ PLACEHOLDER TESTIMONIALS:** These are placeholder quotes. Add a code comment `{/* TODO: Replace with real customer testimonials */}` above the testimonials array. Write realistic-sounding placeholder quotes. Use generic names (e.g., "Sarah M.", "Alex R.") and roles. The app owner MUST replace these with real testimonials before launch.

### 6. Final CTA Section

```tsx
<section className="py-20 md:py-32 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10" />
  <div className="container max-w-2xl mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start using PantyHub today</h2>
    <p className="text-muted-foreground mb-8">
      Get organized and productive in minutes. Free to start.
    </p>
    <Button size="lg" className="px-8">Sign Up</Button>
  </div>
</section>
```

### 7. Landing Header & Footer

Create `components/landing/landing-header.tsx` (Client Component):
- Glass effect: `bg-background/80 backdrop-blur-md border-b border-border/50`
- Sticky: `sticky top-0 z-50`
- Logo + Product name on left
- Navigation links: Features, How it Works, Pricing (if payments enabled)
- Right side: **Theme Toggle** (sun/moon icon) + Login (outline) + Sign Up (primary) buttons
- Mobile: hamburger menu with Sheet component

### Theme Toggle Component (REQUIRED)

Create `components/theme-toggle.tsx` as a Client Component:

```tsx
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

**Important:** The `ThemeProvider` from `next-themes` must be added to the root layout in Phase 05.
Install: `npm install next-themes`
Add to root layout: `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`

Place the `<ThemeToggle />` in:
1. The landing header (public pages) — between nav links and Login button
2. The app header (authenticated pages) — in the user menu area

This ensures visitors can switch between dark and light mode on ANY page, including the landing page before login.

Create `components/landing/landing-footer.tsx`:
- Product name + tagline
- Link columns: Product, Company, Legal
- Legal links: Terms (/terms), Privacy (/privacy)
- © {year} PantyHub
- Social icons (placeholder links)

---

## Design Quality Checklist

### Colors & Typography
- [ ] Headings use gradient text or bold foreground (not plain)
- [ ] Body text uses `text-muted-foreground` (not full black/white)
- [ ] Primary color used sparingly for CTAs and accents only
- [ ] Font sizes scale properly: mobile text-3xl → desktop text-5xl/6xl

### Spacing & Layout
- [ ] Sections use `py-20 md:py-32` (generous vertical spacing)
- [ ] Content constrained to `max-w-5xl` or `max-w-6xl`
- [ ] Grid gaps: `gap-6` minimum for cards, `gap-12` for hero split
- [ ] Mobile: single column, text centered where appropriate

### Interactions
- [ ] Feature cards have `hover:shadow-lg hover:-translate-y-1 transition-all duration-300`
- [ ] Buttons have hover states (opacity or scale)
- [ ] Smooth scroll to #features on "Learn More" click

### Dark Mode
- [ ] All sections render correctly in dark mode
- [ ] Glass effects (`bg-card/50 backdrop-blur`) work in both modes
- [ ] Images don't look jarring against dark backgrounds (add rounded corners + shadow)
- [ ] No hardcoded colors — use CSS variables / Tailwind semantic classes only

---

## Design Audit Round (MANDATORY)

After building the landing page, perform this audit BEFORE moving to Phase 07:

### Round 1: Visual Check
1. Open the page at `http://localhost:3000`
2. View at 3 widths: 375px (mobile), 768px (tablet), 1440px (desktop)
3. Toggle dark mode — verify all sections look good
4. Check: Is any section visually "flat" or boring? If yes → add gradient bg, glass effect, or shadow

### Round 2: Premium Polish
Look at each section and ask: "Would this look good on a $100M startup's homepage?"
- [ ] Hero: Does the headline grab attention? Is the image high-quality?
- [ ] Features: Do the cards feel interactive (hover effects)?
- [ ] Testimonials: Do they look believable?
- [ ] CTA: Does it create urgency?

If ANY section feels generic or templated:
1. Add a subtle gradient background (`bg-gradient-to-br from-muted/30 to-background`)
2. Add a decorative blur blob (`absolute, bg-primary/10, blur-3xl`)
3. Add micro-interactions (hover transforms, group-hover color shifts)
4. Use asymmetric layouts where possible (not everything centered)

### Round 3: Fix & Verify
- Fix all issues found in rounds 1-2
- Run `npm run build` — must pass
- Take one final look — the page should feel like a real product, not a template

---

## Validation

- [ ] Landing page renders at `/`
- [ ] Hero with headline, subtitle, 2 CTAs, and hero image
- [ ] Social proof / stats section
- [ ] Features section with 3-6 glass cards + hover effects
- [ ] How it works with 3 numbered steps
- [ ] Testimonials section with 2-3 cards
- [ ] Final CTA section with gradient background
- [ ] Glass header (sticky, logo, nav, buttons)
- [ ] Theme toggle (sun/moon) works — switches between light and dark mode
- [ ] ThemeProvider wraps the app in root layout
- [ ] Footer with links, legal, copyright
- [ ] Responsive at 375px, 768px, 1440px
- [ ] Dark mode looks equally good (toggle and verify!)
- [ ] Hero mockup renders correctly in both light and dark mode
- [ ] Design audit rounds 1-3 completed
- [ ] `npm run build` passes


## Feature Integration

- **Payments:** Add a "Pricing" section between features and CTA. Show plan cards with prices and feature lists. Read `docs/features/payments.md` for the pricing page pattern.



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

## Phase 2: 09 - Global Pages (Real SaaS)

> Source: `docs/phases/09-global-pages.md`

# 09 - Global Pages (Real SaaS)

> **Purpose:** Create production-quality error, loading, offline, and system pages
> **Block:** D — Layout & Navigation
> **Depends on:** Phase 05 — root-layout (root layout)

---

## Why This Matters

A premium app handles EVERY failure state gracefully. Users never see a blank screen, a raw error, or a broken page. Every edge case has a designed response.

---

## Instructions

### 1. 404 Not Found — with CTA

Create `app/not-found.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto w-20 h-20 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center">
          <FileQuestion className="h-10 w-10 text-primary/60" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-foreground/10">404</h1>
          <h2 className="text-xl font-semibold -mt-2">Page not found</h2>
        </div>
        <p className="text-muted-foreground">
          This page doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button asChild className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="transition-all duration-200 hover:-translate-y-0.5">
            <Link href="/">Home</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/60">PantyHub</p>
      </div>
    </div>
  );
}
```

### 2. 500 / Error Page — with Retry + Error Reporting

Create `app/error.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (Sentry-ready)
    console.error("[GlobalError]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
    // Production: replace with Sentry.captureException(error)
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto rounded-full bg-destructive/10 p-4 w-fit">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-2 justify-center">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 3. Root Error Boundary (catches root layout crashes)

Create `app/global-error.tsx` — this catches errors that happen in the root layout itself:

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="mx-auto rounded-full bg-destructive/10 p-4 w-fit">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              A critical error occurred. Please try refreshing the page.
            </p>
            <Button onClick={reset}>Try Again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### 4. App-Level Error Boundary

Create `app/(app)/error.tsx` — within the authenticated shell, so the header/sidebar remain visible:

```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { logError } from "@/lib/error-logging";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { component: "AppErrorBoundary" });
  }, [error]);

  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto rounded-full bg-destructive/10 p-4 w-fit">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          This section encountered an error. Your other data is safe.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} size="sm">
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5. Offline Banner Component

Create `components/offline-banner.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-yellow-500 text-yellow-950 text-center py-2 text-sm font-medium flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      You're offline. Changes won't be saved.
    </div>
  );
}
```

Add `<OfflineBanner />` to the root layout, above the main content.

### 6. Suspense Skeleton Defaults

Create `components/ui/page-skeleton.tsx` — reusable skeleton patterns:

```typescript
import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded" />
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl p-6">
      <Skeleton className="h-9 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-9 w-64" />
      <div className="rounded border p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 7. Error Logging Hook (Sentry-Ready)

Create `lib/error-logging.ts`:

```typescript
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  extra?: Record<string, unknown>;
}

export function logError(error: Error, context?: ErrorContext) {
  console.error("[PantyHub]", {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  });

  // Production: Sentry.captureException(error, { extra: context });
}

export function logWarning(message: string, context?: ErrorContext) {
  console.warn("[PantyHub]", { message, ...context });

  // Production: Sentry.captureMessage(message, "warning");
}
```

Use `logError()` instead of raw `console.error()` in all catch blocks.

### 8. Root + App Loading Pages

`app/loading.tsx`:
```typescript
import { PageSkeleton } from "@/components/ui/page-skeleton";
export default function Loading() {
  return <PageSkeleton />;
}
```

`app/(app)/loading.tsx`:
```typescript
import { PageSkeleton } from "@/components/ui/page-skeleton";
export default function AppLoading() {
  return <PageSkeleton />;
}
```

---

## Validation

- [ ] `/nonexistent-url` shows branded 404 with ambient glow + CTA buttons
- [ ] `app/global-error.tsx` catches root layout crashes
- [ ] `app/error.tsx` shows "Try Again" + error digest
- [ ] `app/(app)/error.tsx` preserves header/sidebar, shows error in content area
- [ ] `app/(app)/loading.tsx` shows PageSkeleton within the app shell
- [ ] Error boundary logs to console with structured data (Sentry-ready)
- [ ] OfflineBanner appears when network disconnected
- [ ] PageSkeleton, FormSkeleton, DetailSkeleton components exist
- [ ] `logError()` utility exists and used in catch blocks
- [ ] `npm run build` passes


---

## Quality Gate: Block D Complete

After Phase 20, run:

```bash
npx tsc --noEmit && npm run build
```

Both must pass before proceeding to Block E.


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

## Phase 3: 10 - Legal Pages

> Source: `docs/phases/10-legal-pages.md`

# 10 - Legal Pages

> **Purpose:** Create Terms of Service, Privacy Policy, Cookie Policy, and Imprint pages tailored to PantyHub
> **Block:** B — Visual Shell
> **Depends on:** Phase 07 (public layout + nav + footer)

---

## Why This Matters

Every real product needs legal pages. Users expect them, app stores require them, and GDPR/CCPA compliance depends on them. These pages should be **real content** tailored to your product, not placeholder text.

---

## Instructions

### 1. Terms of Service

Create `app/(public)/terms/page.tsx`:

This is a **Server Component** with SEO metadata. Style it like a clean, readable document page.

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PantyHub",
  description: "Terms of Service for PantyHub",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        {/* ... sections below ... */}
      </div>
    </div>
  );
}
```

**Sections to include (as JSX):**

1. **Acceptance of Terms** — By using PantyHub, you agree to these terms
2. **Description of Service** — A safe and anonymous marketplace for individuals to buy and sell used panties. Users can create and manage "User", "Listing", "Review", "Shop", "Order", "Payment", "Subscription", "Upload", "Channel", "Notification", "Conversation", "Message", "GlobalSearchFeature", "SafeTransactions", "OwnShopSystem", "SetYourOwnPrices", "NoTransactionFees", "MessagesAndChatSystem", "ClassifiedAdMarket", "MemberReviews", "PrivacyFunctions", "MediaCloud", "UserBlockingSystem", "HumanOperatedFakeCheck", "MemberReviewsAndRatings", "FullFeaturedProfiles", "SellerRatingsAndBuyerReviews", "UserRankingList", "FriendsAndFansSystem", "CustomVideoClips", "PrivatePhotosets", "WhatsappAndSkypeChats".
3. **User Accounts** — Users must provide accurate information. One account per person. We may suspend accounts that violate these terms.
4. **User Content** — Users retain ownership of content they create. By posting, they grant PantyHub a license to display and store it. Uploaded files must not violate copyright or contain illegal content.
5. **Acceptable Use** — No spam, abuse, scraping, reverse engineering, or illegal activity.
6. **Intellectual Property** — PantyHub and its design are our property. User content belongs to users.
7. **Payments & Subscriptions** — Subscriptions auto-renew. Cancel anytime. No refunds for partial periods. Prices may change with 30 days notice.
8. **Termination** — We may terminate accounts for violations. Users can delete their account at any time.
9. **Limitation of Liability** — Service provided "as is". We're not liable for data loss, downtime, or indirect damages.
10. **Changes to Terms** — We may update these terms. Continued use = acceptance.
11. **Contact** — Questions? Contact us at [support email or link].

---

### 2. Privacy Policy

Create `app/(public)/privacy/page.tsx`:

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PantyHub",
  description: "Privacy Policy for PantyHub",
};
```

**Sections:**

1. **What We Collect**
- Account information (email, name, profile picture)
- Usage data (pages visited, features used, timestamps)
- Payment information (processed by Stripe — we never store card details)
- Uploaded files and images

2. **How We Use Your Data**
   - To provide and improve PantyHub
   - To authenticate you and protect your account
   - To send transactional emails (password reset, account notifications)

3. **Data Storage & Security**
   - Data stored on Supabase (PostgreSQL) with encryption at rest
   - All connections use HTTPS/TLS
   - Payment processing handled by Stripe (PCI DSS compliant)
   - We use Row Level Security (RLS) to ensure users only see their own data

4. **Third-Party Services**
   - **Supabase** — Database, authentication, file storage
   - **Stripe** — Payment processing
   - **Resend** — Transactional emails

5. **Your Rights (GDPR)**
   - Access your data (`/settings` → export)
   - Correct your data (`/settings/profile`)
   - Delete your data (`/settings/account` → delete account)
   - Data portability (JSON/CSV export)

6. **Data Retention**
   - Active accounts: data retained while account exists
   - Deleted accounts: data removed within 30 days
   - Audit logs: retained for 90 days

7. **Cookies** — See our Cookie Policy for details.

8. **Contact** — Privacy questions? Contact us at [privacy email or link].

---

### 3. Cookie Policy

Create `app/(public)/cookies/page.tsx`:

**Sections:**

1. **What Are Cookies** — Small text files stored in your browser.

2. **Cookies We Use**
- **Essential cookies**: Authentication, session management, security
- **Functional cookies**: User preferences, theme, language settings

3. **Managing Cookies** — You can disable cookies in your browser settings. Essential cookies cannot be disabled without breaking the app.

4. **Do Not Track** — We respect the Do Not Track (DNT) browser signal.

---

### 4. Imprint (optional but recommended)

Create `app/(public)/imprint/page.tsx`:

**Include:**
- Service name: PantyHub
- Contact email
- Responsible person / company
- Hosting provider info (Vercel)

This is especially important for EU-based services (Impressumspflicht).

---

### 5. Add Footer Links

Update the footer component to link to all legal pages:

```
Legal
├── Terms of Service → /terms
├── Privacy Policy → /privacy
├── Cookie Policy → /cookies
└── Imprint → /imprint
```

---

### 6. Design Guidelines

- Use a clean, readable layout: `max-w-3xl mx-auto`
- Use `prose` classes for readable typography
- Include a "Last updated" date at the top
- Use proper heading hierarchy (h1 → h2 → h3)
- Each page should have proper `generateMetadata` for SEO
- Match the design of other public pages (same layout, same fonts)

---

## Validation

- [ ] `/terms` page renders with all sections
- [ ] `/privacy` page renders with data collection, rights, and retention info
- [ ] `/cookies` page renders with cookie types
- [ ] `/imprint` page renders with contact info
- [ ] Footer contains links to all 4 legal pages
- [ ] All pages have proper `Metadata` exports
- [ ] Content is tailored to PantyHub (not generic placeholder text)
- [ ] Dark mode works on all legal pages
- [ ] `npm run build` passes



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

## Phase 4: 11 - Dark Mode Verification

> Source: `docs/phases/11-dark-mode.md`

# 11 - Dark Mode Verification

> **Purpose:** Verify every page looks correct in both light and dark mode
> **Block:** H — Hardening
> **Depends on:** Phase 03 (design tokens), Phase 20 — settings (theme toggle)

---

## Instructions

### 1. next-themes Provider Setup

Ensure `next-themes` is configured in the root layout for seamless theme switching:

```typescript
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Key:** `suppressHydrationWarning` on `<html>` prevents Flash of Unstyled Content (FOUC) — `next-themes` injects a script that sets the class before React hydrates.

### 2. System Preference Detection

The theme system should respect the user's OS preference via `prefers-color-scheme`:

```css
/* globals.css — fallback for when JS hasn't loaded yet */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    color-scheme: dark;
  }
}
```

`next-themes` with `enableSystem` handles this automatically at runtime. The CSS fallback ensures correct colors during the brief pre-hydration window.

### 3. Smooth Theme Transition CSS

Add transitions so theme switches feel polished instead of jarring:

```css
/* globals.css */
html {
  transition: background-color 0.3s ease, color 0.2s ease;
}

html * {
  transition: background-color 0.3s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Disable transitions on first load to prevent FOUC flash */
html.no-transitions * {
  transition: none !important;
}
```

### 4. ThemeToggle Component

Create a polished toggle with Sun/Moon icon animation (reference: Phase 06 landing page uses this same pattern):

```typescript
"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <Button variant="ghost" size="icon" className="w-9 h-9" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 relative"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

### 5. Theme-Specific Design Tokens

Define distinct shadow and accent values for each mode in `globals.css`:

```css
:root {
  --shadow-color: 0 0% 0%;
  --shadow-sm: 0 1px 2px hsl(var(--shadow-color) / 0.05);
  --shadow-md: 0 4px 6px hsl(var(--shadow-color) / 0.07);
  --shadow-lg: 0 10px 15px hsl(var(--shadow-color) / 0.1);
}

.dark {
  --shadow-color: 0 0% 0%;
  --shadow-sm: 0 1px 2px hsl(var(--shadow-color) / 0.2);
  --shadow-md: 0 4px 6px hsl(var(--shadow-color) / 0.3);
  --shadow-lg: 0 10px 15px hsl(var(--shadow-color) / 0.4);
}
```

Dark mode needs stronger shadow opacity because the contrast between surface and shadow is lower.

### 6. Per-Component Dark Mode Overrides

**Cards:**
```
Light: bg-card border-border shadow-sm
Dark:  bg-card border-border/50 shadow-md (slightly elevated feel)
```
```tsx
<Card className="bg-card border-border dark:border-border/50 shadow-sm dark:shadow-md">
  {/* card content */}
</Card>
```

**Inputs:**
```
Light: bg-background border-input
Dark:  bg-muted/50 border-input (subtle fill to differentiate from page bg)
```
```tsx
<Input className="bg-background dark:bg-muted/50 border-input" />
```

**Buttons (secondary/outline):**
```
Light: bg-secondary text-secondary-foreground
Dark:  bg-secondary/80 hover:bg-secondary (slightly transparent base)
```

**Dropdowns/Popovers:**
```tsx
<DropdownMenuContent className="bg-popover border-border shadow-md dark:shadow-lg">
  {/* dropdown items */}
</DropdownMenuContent>
```

### 7. Systematic Dark Mode Audit

Toggle to dark mode and check EVERY page:

**Auth pages:**
- [ ] Login page — readable, no white backgrounds
- [ ] Signup page — readable, no white backgrounds

**App pages:**
- [ ] Dashboard — stat cards visible, text readable
- [ ] All entity list pages — cards have correct bg
- [ ] All entity detail pages — content readable
- [ ] All entity form pages — inputs have correct bg
- [ ] Settings page — form inputs visible

### 8. Common Dark Mode Issues

**Hardcoded colors:**
```
❌ bg-white → ✅ bg-background or bg-card
❌ text-black → ✅ text-foreground
❌ text-gray-500 → ✅ text-muted-foreground
❌ border-gray-200 → ✅ border-border
```

**Shadows:**
```
❌ shadow-lg (too visible in dark) → ✅ shadow-sm or use theme-aware shadow tokens
```

**Images:**
- Ensure logos/icons are visible on dark backgrounds
- Use `dark:invert` for dark icons if needed
- For decorative SVGs, use `currentColor` so they inherit text color

### 9. CSS Variable Compliance

Every color in the app should use CSS variables from the design system:
- `bg-background`, `bg-card`, `bg-muted`
- `text-foreground`, `text-muted-foreground`
- `border-border`, `border-input`
- `bg-primary`, `text-primary-foreground`
- `bg-destructive`, `text-destructive`

### 10. Search for Hardcoded Colors

```bash
grep -r "bg-white\|bg-black\|text-gray\|text-white\|border-gray" --include="*.tsx" --include="*.ts" app/ components/
```

Replace ALL hardcoded colors with CSS variable classes.

### 11. FOUC Prevention Checklist

- [ ] `suppressHydrationWarning` on `<html>` element
- [ ] `ThemeProvider` wraps entire app with `attribute="class"`
- [ ] No conditional rendering based on theme during SSR (use `mounted` guard)
- [ ] Theme toggle shows placeholder skeleton until mounted
- [ ] Test: hard refresh in both modes — no flash of wrong theme

---

## Validation

- [ ] `next-themes` provider configured with `enableSystem`
- [ ] `suppressHydrationWarning` on `<html>` to prevent FOUC
- [ ] ThemeToggle component with Sun/Moon animation renders correctly
- [ ] Smooth CSS transitions between themes (no jarring switch)
- [ ] Per-component overrides for cards, inputs, buttons verified
- [ ] Theme-specific shadow tokens defined (stronger in dark mode)
- [ ] Every page checked in dark mode
- [ ] No hardcoded colors (bg-white, text-black, etc.)
- [ ] All colors use CSS variables
- [ ] Text readable in both modes
- [ ] Inputs visible in dark mode
- [ ] System preference detection works (`prefers-color-scheme`)
- [ ] `npm run build` passes

## Block B Checkpoint

After this phase, open `docs/INVENTORY.md` and verify ALL Block B deliverables exist.
For any ❌ items, go back and create them NOW before proceeding.


---

## Quality Gate: Block B Complete

After Phase 11, run:

```bash
npx tsc --noEmit && npm run build
```

Both must pass before proceeding to Block I.


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

## Phase 5: 11b - UX Flows

> Source: `docs/phases/11b-ux-flows.md`

# 11b - UX Flows

> **Purpose:** Define screen map, user flows, navigation structure, entry/exit points
> **Input:** entities[], flows[], onboarding_steps[], audience_patterns
> **Output:** Screen map, flow diagrams, navigation config, entry points

---

## DEPENDENCY NOTICE

This phase CONSUMES output from:
- **Phase 05 (Layout):** Navigation patterns, screen hierarchy
- **Phase 07 (Dashboard):** Widget structure, quick actions

This phase PRODUCES artifacts for:
- **Phase 09 (Permissions):** Route-to-role mapping
- **Phase 14 (Testing):** Flow test scenarios

---

## Stop Conditions

- ✗ No primary flow defined → BLOCK
- ✗ Orphan screen (no navigation path) → BLOCK
- ✗ Missing entry point → BLOCK
- ✗ Flow without exit condition → BLOCK

---

## Input from CONTEXT.md

```yaml
device_priority: both
ux_complexity: standard

entities:
  - User
  - Listing
  - Review
  - Shop
  - Order
  - Payment
  - Subscription
  - Upload
  - Channel
  - Notification
  - Conversation
  - Message
  - GlobalSearchFeature
  - SafeTransactions
  - OwnShopSystem
  - SetYourOwnPrices
  - NoTransactionFees
  - MessagesAndChatSystem
  - ClassifiedAdMarket
  - MemberReviews
  - PrivacyFunctions
  - MediaCloud
  - UserBlockingSystem
  - HumanOperatedFakeCheck
  - MemberReviewsAndRatings
  - FullFeaturedProfiles
  - SellerRatingsAndBuyerReviews
  - UserRankingList
  - FriendsAndFansSystem
  - CustomVideoClips
  - PrivatePhotosets
  - WhatsappAndSkypeChats

flows:
  - Buyer Flow: 4 steps
  - Seller Flow: 4 steps
  - Admin Flow: 3 steps

onboarding_steps: 3
```

---

## Tasks (Sequential)

### Task 1: Generate Screen Map

File: `docs/ux/SCREEN_MAP.md`

```markdown
# Screen Map - PantyHub

## Public Screens (No Auth)

| Screen | Path | Purpose | Entry Points |
|--------|------|---------|--------------|
| Landing | / | Marketing, conversion | Direct, SEO, Ads |
| Login | /login | Authentication | Header CTA, redirect |
| Signup | /signup | Registration | Landing CTA |
| Pricing | /pricing | Plan comparison | Landing, header |
| About | /about | Company info | Footer |

## Authenticated Screens

| Screen | Path | Purpose | Entry Points |
|--------|------|---------|--------------|
| Dashboard | /dashboard | Overview, quick actions | Login redirect, nav |
| User List | /users | View all User | Nav, dashboard |
| User Detail | /users/[id] | Single User view | List click |
| User Create | /users/new | Create User | List CTA |
| User Edit | /users/[id]/edit | Edit User | Detail CTA |
| Listing List | /listings | View all Listing | Nav, dashboard |
| Listing Detail | /listings/[id] | Single Listing view | List click |
| Listing Create | /listings/new | Create Listing | List CTA |
| Listing Edit | /listings/[id]/edit | Edit Listing | Detail CTA |
| Review List | /reviews | View all Review | Nav, dashboard |
| Review Detail | /reviews/[id] | Single Review view | List click |
| Review Create | /reviews/new | Create Review | List CTA |
| Review Edit | /reviews/[id]/edit | Edit Review | Detail CTA |
| Shop List | /shops | View all Shop | Nav, dashboard |
| Shop Detail | /shops/[id] | Single Shop view | List click |
| Shop Create | /shops/new | Create Shop | List CTA |
| Shop Edit | /shops/[id]/edit | Edit Shop | Detail CTA |
| Order List | /orders | View all Order | Nav, dashboard |
| Order Detail | /orders/[id] | Single Order view | List click |
| Order Create | /orders/new | Create Order | List CTA |
| Order Edit | /orders/[id]/edit | Edit Order | Detail CTA |
| Payment List | /payments | View all Payment | Nav, dashboard |
| Payment Detail | /payments/[id] | Single Payment view | List click |
| Payment Create | /payments/new | Create Payment | List CTA |
| Payment Edit | /payments/[id]/edit | Edit Payment | Detail CTA |
| Subscription List | /subscriptions | View all Subscription | Nav, dashboard |
| Subscription Detail | /subscriptions/[id] | Single Subscription view | List click |
| Subscription Create | /subscriptions/new | Create Subscription | List CTA |
| Subscription Edit | /subscriptions/[id]/edit | Edit Subscription | Detail CTA |
| Upload List | /uploads | View all Upload | Nav, dashboard |
| Upload Detail | /uploads/[id] | Single Upload view | List click |
| Upload Create | /uploads/new | Create Upload | List CTA |
| Upload Edit | /uploads/[id]/edit | Edit Upload | Detail CTA |
| Channel List | /channels | View all Channel | Nav, dashboard |
| Channel Detail | /channels/[id] | Single Channel view | List click |
| Channel Create | /channels/new | Create Channel | List CTA |
| Channel Edit | /channels/[id]/edit | Edit Channel | Detail CTA |
| Notification List | /notifications | View all Notification | Nav, dashboard |
| Notification Detail | /notifications/[id] | Single Notification view | List click |
| Notification Create | /notifications/new | Create Notification | List CTA |
| Notification Edit | /notifications/[id]/edit | Edit Notification | Detail CTA |
| Conversation List | /conversations | View all Conversation | Nav, dashboard |
| Conversation Detail | /conversations/[id] | Single Conversation view | List click |
| Conversation Create | /conversations/new | Create Conversation | List CTA |
| Conversation Edit | /conversations/[id]/edit | Edit Conversation | Detail CTA |
| Message List | /messages | View all Message | Nav, dashboard |
| Message Detail | /messages/[id] | Single Message view | List click |
| Message Create | /messages/new | Create Message | List CTA |
| Message Edit | /messages/[id]/edit | Edit Message | Detail CTA |
| GlobalSearchFeature List | /global-search-features | View all GlobalSearchFeature | Nav, dashboard |
| GlobalSearchFeature Detail | /global-search-features/[id] | Single GlobalSearchFeature view | List click |
| GlobalSearchFeature Create | /global-search-features/new | Create GlobalSearchFeature | List CTA |
| GlobalSearchFeature Edit | /global-search-features/[id]/edit | Edit GlobalSearchFeature | Detail CTA |
| SafeTransactions List | /safe-transactions | View all SafeTransactions | Nav, dashboard |
| SafeTransactions Detail | /safe-transactions/[id] | Single SafeTransactions view | List click |
| SafeTransactions Create | /safe-transactions/new | Create SafeTransactions | List CTA |
| SafeTransactions Edit | /safe-transactions/[id]/edit | Edit SafeTransactions | Detail CTA |
| OwnShopSystem List | /own-shop-systems | View all OwnShopSystem | Nav, dashboard |
| OwnShopSystem Detail | /own-shop-systems/[id] | Single OwnShopSystem view | List click |
| OwnShopSystem Create | /own-shop-systems/new | Create OwnShopSystem | List CTA |
| OwnShopSystem Edit | /own-shop-systems/[id]/edit | Edit OwnShopSystem | Detail CTA |
| SetYourOwnPrices List | /set-your-own-prices | View all SetYourOwnPrices | Nav, dashboard |
| SetYourOwnPrices Detail | /set-your-own-prices/[id] | Single SetYourOwnPrices view | List click |
| SetYourOwnPrices Create | /set-your-own-prices/new | Create SetYourOwnPrices | List CTA |
| SetYourOwnPrices Edit | /set-your-own-prices/[id]/edit | Edit SetYourOwnPrices | Detail CTA |
| NoTransactionFees List | /no-transaction-fees | View all NoTransactionFees | Nav, dashboard |
| NoTransactionFees Detail | /no-transaction-fees/[id] | Single NoTransactionFees view | List click |
| NoTransactionFees Create | /no-transaction-fees/new | Create NoTransactionFees | List CTA |
| NoTransactionFees Edit | /no-transaction-fees/[id]/edit | Edit NoTransactionFees | Detail CTA |
| MessagesAndChatSystem List | /messages-and-chat-systems | View all MessagesAndChatSystem | Nav, dashboard |
| MessagesAndChatSystem Detail | /messages-and-chat-systems/[id] | Single MessagesAndChatSystem view | List click |
| MessagesAndChatSystem Create | /messages-and-chat-systems/new | Create MessagesAndChatSystem | List CTA |
| MessagesAndChatSystem Edit | /messages-and-chat-systems/[id]/edit | Edit MessagesAndChatSystem | Detail CTA |
| ClassifiedAdMarket List | /classified-ad-markets | View all ClassifiedAdMarket | Nav, dashboard |
| ClassifiedAdMarket Detail | /classified-ad-markets/[id] | Single ClassifiedAdMarket view | List click |
| ClassifiedAdMarket Create | /classified-ad-markets/new | Create ClassifiedAdMarket | List CTA |
| ClassifiedAdMarket Edit | /classified-ad-markets/[id]/edit | Edit ClassifiedAdMarket | Detail CTA |
| MemberReviews List | /member-reviews | View all MemberReviews | Nav, dashboard |
| MemberReviews Detail | /member-reviews/[id] | Single MemberReviews view | List click |
| MemberReviews Create | /member-reviews/new | Create MemberReviews | List CTA |
| MemberReviews Edit | /member-reviews/[id]/edit | Edit MemberReviews | Detail CTA |
| PrivacyFunctions List | /privacy-functions | View all PrivacyFunctions | Nav, dashboard |
| PrivacyFunctions Detail | /privacy-functions/[id] | Single PrivacyFunctions view | List click |
| PrivacyFunctions Create | /privacy-functions/new | Create PrivacyFunctions | List CTA |
| PrivacyFunctions Edit | /privacy-functions/[id]/edit | Edit PrivacyFunctions | Detail CTA |
| MediaCloud List | /media-clouds | View all MediaCloud | Nav, dashboard |
| MediaCloud Detail | /media-clouds/[id] | Single MediaCloud view | List click |
| MediaCloud Create | /media-clouds/new | Create MediaCloud | List CTA |
| MediaCloud Edit | /media-clouds/[id]/edit | Edit MediaCloud | Detail CTA |
| UserBlockingSystem List | /user-blocking-systems | View all UserBlockingSystem | Nav, dashboard |
| UserBlockingSystem Detail | /user-blocking-systems/[id] | Single UserBlockingSystem view | List click |
| UserBlockingSystem Create | /user-blocking-systems/new | Create UserBlockingSystem | List CTA |
| UserBlockingSystem Edit | /user-blocking-systems/[id]/edit | Edit UserBlockingSystem | Detail CTA |
| HumanOperatedFakeCheck List | /human-operated-fake-checks | View all HumanOperatedFakeCheck | Nav, dashboard |
| HumanOperatedFakeCheck Detail | /human-operated-fake-checks/[id] | Single HumanOperatedFakeCheck view | List click |
| HumanOperatedFakeCheck Create | /human-operated-fake-checks/new | Create HumanOperatedFakeCheck | List CTA |
| HumanOperatedFakeCheck Edit | /human-operated-fake-checks/[id]/edit | Edit HumanOperatedFakeCheck | Detail CTA |
| MemberReviewsAndRatings List | /member-reviews-and-ratings | View all MemberReviewsAndRatings | Nav, dashboard |
| MemberReviewsAndRatings Detail | /member-reviews-and-ratings/[id] | Single MemberReviewsAndRatings view | List click |
| MemberReviewsAndRatings Create | /member-reviews-and-ratings/new | Create MemberReviewsAndRatings | List CTA |
| MemberReviewsAndRatings Edit | /member-reviews-and-ratings/[id]/edit | Edit MemberReviewsAndRatings | Detail CTA |
| FullFeaturedProfiles List | /full-featured-profiles | View all FullFeaturedProfiles | Nav, dashboard |
| FullFeaturedProfiles Detail | /full-featured-profiles/[id] | Single FullFeaturedProfiles view | List click |
| FullFeaturedProfiles Create | /full-featured-profiles/new | Create FullFeaturedProfiles | List CTA |
| FullFeaturedProfiles Edit | /full-featured-profiles/[id]/edit | Edit FullFeaturedProfiles | Detail CTA |
| SellerRatingsAndBuyerReviews List | /seller-ratings-and-buyer-reviews | View all SellerRatingsAndBuyerReviews | Nav, dashboard |
| SellerRatingsAndBuyerReviews Detail | /seller-ratings-and-buyer-reviews/[id] | Single SellerRatingsAndBuyerReviews view | List click |
| SellerRatingsAndBuyerReviews Create | /seller-ratings-and-buyer-reviews/new | Create SellerRatingsAndBuyerReviews | List CTA |
| SellerRatingsAndBuyerReviews Edit | /seller-ratings-and-buyer-reviews/[id]/edit | Edit SellerRatingsAndBuyerReviews | Detail CTA |
| UserRankingList List | /user-ranking-lists | View all UserRankingList | Nav, dashboard |
| UserRankingList Detail | /user-ranking-lists/[id] | Single UserRankingList view | List click |
| UserRankingList Create | /user-ranking-lists/new | Create UserRankingList | List CTA |
| UserRankingList Edit | /user-ranking-lists/[id]/edit | Edit UserRankingList | Detail CTA |
| FriendsAndFansSystem List | /friends-and-fans-systems | View all FriendsAndFansSystem | Nav, dashboard |
| FriendsAndFansSystem Detail | /friends-and-fans-systems/[id] | Single FriendsAndFansSystem view | List click |
| FriendsAndFansSystem Create | /friends-and-fans-systems/new | Create FriendsAndFansSystem | List CTA |
| FriendsAndFansSystem Edit | /friends-and-fans-systems/[id]/edit | Edit FriendsAndFansSystem | Detail CTA |
| CustomVideoClips List | /custom-video-clips | View all CustomVideoClips | Nav, dashboard |
| CustomVideoClips Detail | /custom-video-clips/[id] | Single CustomVideoClips view | List click |
| CustomVideoClips Create | /custom-video-clips/new | Create CustomVideoClips | List CTA |
| CustomVideoClips Edit | /custom-video-clips/[id]/edit | Edit CustomVideoClips | Detail CTA |
| PrivatePhotosets List | /private-photosets | View all PrivatePhotosets | Nav, dashboard |
| PrivatePhotosets Detail | /private-photosets/[id] | Single PrivatePhotosets view | List click |
| PrivatePhotosets Create | /private-photosets/new | Create PrivatePhotosets | List CTA |
| PrivatePhotosets Edit | /private-photosets/[id]/edit | Edit PrivatePhotosets | Detail CTA |
| WhatsappAndSkypeChats List | /whatsapp-and-skype-chats | View all WhatsappAndSkypeChats | Nav, dashboard |
| WhatsappAndSkypeChats Detail | /whatsapp-and-skype-chats/[id] | Single WhatsappAndSkypeChats view | List click |
| WhatsappAndSkypeChats Create | /whatsapp-and-skype-chats/new | Create WhatsappAndSkypeChats | List CTA |
| WhatsappAndSkypeChats Edit | /whatsapp-and-skype-chats/[id]/edit | Edit WhatsappAndSkypeChats | Detail CTA |
| Settings | /settings | User preferences | Nav, profile |
| Profile | /profile | User profile | Nav, avatar |

## Onboarding Flow

| Step | Screen | Purpose | Next |
|------|--------|---------|------|
| 1 | /onboarding?step=1 | Create an Account | Step 2 |
| 2 | /onboarding?step=2 | Verify Email | Step 3 |
| 3 | /onboarding?step=3 | Set Up Profile | Dashboard |



```

### Task 2: Generate Primary User Flows

File: `docs/ux/FLOWS.md`

```markdown
# User Flows - PantyHub


## New User Signup

**Trigger:** User clicks signup button
**Goal:** Create account and reach dashboard
**Success Criteria:** User logged in, profile created

### Flow Steps

```
1. Click signup on landing page
2. Enter email and password
3. Submit form
4. Verify email (if required)
5. Complete onboarding (if exists)
6. Reach dashboard
```

### Screen Sequence

```
/ → /signup → /auth/callback → /onboarding → /dashboard
```

### Exit Points

- Success: /dashboard
- Cancel: /
- Error: /signup with error message


## Returning User Login

**Trigger:** User clicks login button
**Goal:** Authenticate and access app
**Success Criteria:** User logged in

### Flow Steps

```
1. Click login on landing/header
2. Enter credentials
3. Submit form
4. Redirect to dashboard
```

### Screen Sequence

```
/login → /dashboard
```

### Exit Points

- Success: /dashboard
- Cancel: /
- Error: /login with error message


## Create User

**Trigger:** User clicks "New User" button
**Goal:** Create a new User
**Success Criteria:** User created and visible in list

### Flow Steps

```
1. Navigate to Users list
2. Click create button
3. Fill form fields
4. Submit form
5. Redirect to detail or list
```

### Screen Sequence

```
/users → /users/new → /users/[id]
```

### Exit Points

- Success: /users/[id]
- Cancel: /users
- Error: /users/new with validation errors

```

### Task 3: Generate Navigation Structure

File: `lib/config/navigation.ts`

```typescript
import {
  Home,
  Settings,
  User,
  User,
  Box,
  Box,
  Box,
  ShoppingCart,
  CreditCard,
  CreditCard,
  Box,
  Box,
  Bell,
  Box,
  MessageSquare,
  Box,
  Box,
  Box,
  Box,
  Box,
  MessageSquare,
  Box,
  Box,
  Box,
  Box,
  User,
  Box,
  Box,
  User,
  Box,
  User,
  Box,
  Video,
  Box,
  Box,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: string;
  children?: NavItem[];
}

export const MAIN_NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Users",
    href: "/users",
    icon: User,
  },
  {
    label: "Listings",
    href: "/listings",
    icon: Box,
  },
  {
    label: "Reviews",
    href: "/reviews",
    icon: Box,
  },
  {
    label: "Shops",
    href: "/shops",
    icon: Box,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    label: "Subscriptions",
    href: "/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Uploads",
    href: "/uploads",
    icon: Box,
  },
  {
    label: "Channels",
    href: "/channels",
    icon: Box,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    label: "Conversations",
    href: "/conversations",
    icon: Box,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    label: "Global Search Features",
    href: "/global-search-features",
    icon: Box,
  },
  {
    label: "Safe Transactions",
    href: "/safe-transactions",
    icon: Box,
  },
  {
    label: "Own Shop Systems",
    href: "/own-shop-systems",
    icon: Box,
  },
  {
    label: "Set Your Own Prices",
    href: "/set-your-own-prices",
    icon: Box,
  },
  {
    label: "No Transaction Fees",
    href: "/no-transaction-fees",
    icon: Box,
  },
  {
    label: "Messages And Chat Systems",
    href: "/messages-and-chat-systems",
    icon: MessageSquare,
  },
  {
    label: "Classified Ad Markets",
    href: "/classified-ad-markets",
    icon: Box,
  },
  {
    label: "Member Reviews",
    href: "/member-reviews",
    icon: Box,
  },
  {
    label: "Privacy Functions",
    href: "/privacy-functions",
    icon: Box,
  },
  {
    label: "Media Clouds",
    href: "/media-clouds",
    icon: Box,
  },
  {
    label: "User Blocking Systems",
    href: "/user-blocking-systems",
    icon: User,
  },
  {
    label: "Human Operated Fake Checks",
    href: "/human-operated-fake-checks",
    icon: Box,
  },
  {
    label: "Member Reviews And Ratings",
    href: "/member-reviews-and-ratings",
    icon: Box,
  },
  {
    label: "Full Featured Profiles",
    href: "/full-featured-profiles",
    icon: User,
  },
  {
    label: "Seller Ratings And Buyer Reviews",
    href: "/seller-ratings-and-buyer-reviews",
    icon: Box,
  },
  {
    label: "User Ranking Lists",
    href: "/user-ranking-lists",
    icon: User,
  },
  {
    label: "Friends And Fans Systems",
    href: "/friends-and-fans-systems",
    icon: Box,
  },
  {
    label: "Custom Video Clips",
    href: "/custom-video-clips",
    icon: Video,
  },
  {
    label: "Private Photosets",
    href: "/private-photosets",
    icon: Box,
  },
  {
    label: "Whatsapp And Skype Chats",
    href: "/whatsapp-and-skype-chats",
    icon: Box,
  },
];

export const USER_NAV: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const MOBILE_NAV: NavItem[] = [
  // Bottom navigation for mobile
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Users", href: "/users", icon: User },
  { label: "Listings", href: "/listings", icon: Box },
  { label: "Reviews", href: "/reviews", icon: Box },
  { label: "Profile", href: "/profile", icon: User },
];

// Route to role mapping (consumed by permissions)
export const ROUTE_ROLES: Record<string, string[]> = {
  "/dashboard": ["user", "admin"],
  "/users": ["user", "admin"],
  "/users/new": ["user", "admin"],
  "/users/[id]": ["user", "admin"],
  "/listings": ["user", "admin"],
  "/listings/new": ["user", "admin"],
  "/listings/[id]": ["user", "admin"],
  "/reviews": ["user", "admin"],
  "/reviews/new": ["user", "admin"],
  "/reviews/[id]": ["user", "admin"],
  "/shops": ["user", "admin"],
  "/shops/new": ["user", "admin"],
  "/shops/[id]": ["user", "admin"],
  "/orders": ["user", "admin"],
  "/orders/new": ["user", "admin"],
  "/orders/[id]": ["user", "admin"],
  "/payments": ["user", "admin"],
  "/payments/new": ["user", "admin"],
  "/payments/[id]": ["user", "admin"],
  "/subscriptions": ["user", "admin"],
  "/subscriptions/new": ["user", "admin"],
  "/subscriptions/[id]": ["user", "admin"],
  "/uploads": ["user", "admin"],
  "/uploads/new": ["user", "admin"],
  "/uploads/[id]": ["user", "admin"],
  "/channels": ["user", "admin"],
  "/channels/new": ["user", "admin"],
  "/channels/[id]": ["user", "admin"],
  "/notifications": ["user", "admin"],
  "/notifications/new": ["user", "admin"],
  "/notifications/[id]": ["user", "admin"],
  "/conversations": ["user", "admin"],
  "/conversations/new": ["user", "admin"],
  "/conversations/[id]": ["user", "admin"],
  "/messages": ["user", "admin"],
  "/messages/new": ["user", "admin"],
  "/messages/[id]": ["user", "admin"],
  "/global-search-features": ["user", "admin"],
  "/global-search-features/new": ["user", "admin"],
  "/global-search-features/[id]": ["user", "admin"],
  "/safe-transactions": ["user", "admin"],
  "/safe-transactions/new": ["user", "admin"],
  "/safe-transactions/[id]": ["user", "admin"],
  "/own-shop-systems": ["user", "admin"],
  "/own-shop-systems/new": ["user", "admin"],
  "/own-shop-systems/[id]": ["user", "admin"],
  "/set-your-own-prices": ["user", "admin"],
  "/set-your-own-prices/new": ["user", "admin"],
  "/set-your-own-prices/[id]": ["user", "admin"],
  "/no-transaction-fees": ["user", "admin"],
  "/no-transaction-fees/new": ["user", "admin"],
  "/no-transaction-fees/[id]": ["user", "admin"],
  "/messages-and-chat-systems": ["user", "admin"],
  "/messages-and-chat-systems/new": ["user", "admin"],
  "/messages-and-chat-systems/[id]": ["user", "admin"],
  "/classified-ad-markets": ["user", "admin"],
  "/classified-ad-markets/new": ["user", "admin"],
  "/classified-ad-markets/[id]": ["user", "admin"],
  "/member-reviews": ["user", "admin"],
  "/member-reviews/new": ["user", "admin"],
  "/member-reviews/[id]": ["user", "admin"],
  "/privacy-functions": ["user", "admin"],
  "/privacy-functions/new": ["user", "admin"],
  "/privacy-functions/[id]": ["user", "admin"],
  "/media-clouds": ["user", "admin"],
  "/media-clouds/new": ["user", "admin"],
  "/media-clouds/[id]": ["user", "admin"],
  "/user-blocking-systems": ["user", "admin"],
  "/user-blocking-systems/new": ["user", "admin"],
  "/user-blocking-systems/[id]": ["user", "admin"],
  "/human-operated-fake-checks": ["user", "admin"],
  "/human-operated-fake-checks/new": ["user", "admin"],
  "/human-operated-fake-checks/[id]": ["user", "admin"],
  "/member-reviews-and-ratings": ["user", "admin"],
  "/member-reviews-and-ratings/new": ["user", "admin"],
  "/member-reviews-and-ratings/[id]": ["user", "admin"],
  "/full-featured-profiles": ["user", "admin"],
  "/full-featured-profiles/new": ["user", "admin"],
  "/full-featured-profiles/[id]": ["user", "admin"],
  "/seller-ratings-and-buyer-reviews": ["user", "admin"],
  "/seller-ratings-and-buyer-reviews/new": ["user", "admin"],
  "/seller-ratings-and-buyer-reviews/[id]": ["user", "admin"],
  "/user-ranking-lists": ["user", "admin"],
  "/user-ranking-lists/new": ["user", "admin"],
  "/user-ranking-lists/[id]": ["user", "admin"],
  "/friends-and-fans-systems": ["user", "admin"],
  "/friends-and-fans-systems/new": ["user", "admin"],
  "/friends-and-fans-systems/[id]": ["user", "admin"],
  "/custom-video-clips": ["user", "admin"],
  "/custom-video-clips/new": ["user", "admin"],
  "/custom-video-clips/[id]": ["user", "admin"],
  "/private-photosets": ["user", "admin"],
  "/private-photosets/new": ["user", "admin"],
  "/private-photosets/[id]": ["user", "admin"],
  "/whatsapp-and-skype-chats": ["user", "admin"],
  "/whatsapp-and-skype-chats/new": ["user", "admin"],
  "/whatsapp-and-skype-chats/[id]": ["user", "admin"],
  "/settings": ["user", "admin"],
  "/admin": ["admin"],
};
```

### Task 4: Generate Entry/Exit Points

File: `docs/ux/ENTRY_EXIT.md`

```markdown
# Entry & Exit Points

## Application Entry Points

| Entry | Target Screen | User State | Redirect Logic |
|-------|---------------|------------|----------------|
| Direct URL (/) | Landing | Anonymous | - |
| Direct URL (/dashboard) | Dashboard | Authenticated | /login if anon |
| OAuth Callback | /auth/callback | Post-auth | /dashboard or /onboarding |
| Email Magic Link | /auth/callback | Post-auth | Original URL or /dashboard |
| Deep Link | Entity detail | Authenticated | /login if anon, then redirect |


## Application Exit Points

| Exit | From | Trigger | Action |
|------|------|---------|--------|
| Logout | Any authenticated | User action | Clear session, redirect /login |
| Session Timeout | Any authenticated | 30min inactivity | Redirect /login with message |
| Account Deletion | Settings | User action | Clear all, redirect / |


## Flow Exit Conditions


### New User Signup

- **Success:** /dashboard
- **Cancel:** /
- **Error:** /signup with error message


### Returning User Login

- **Success:** /dashboard
- **Cancel:** /
- **Error:** /login with error message


### Create User

- **Success:** /users/[id]
- **Cancel:** /users
- **Error:** /users/new with validation errors

```

### Task 5: Generate Widget Mapping (for Dashboard)

File: `lib/config/widgets.ts`

```typescript
import { LucideIcon } from "lucide-react";

export interface DashboardWidget {
  id: string;
  title: string;
  type: "stat" | "list" | "chart" | "action";
  size: "sm" | "md" | "lg";
  dataSource: string;
  refreshInterval?: number;
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: "welcome",
    title: "Welcome",
    type: "action",
    size: "lg",
    dataSource: "profile",
  },
  {
    id: "user_count",
    title: "Total Users",
    type: "stat",
    size: "sm",
    dataSource: "users:count",
  },
  {
    id: "user_recent",
    title: "Recent Users",
    type: "list",
    size: "md",
    dataSource: "users:recent:5",
  },
  {
    id: "listing_count",
    title: "Total Listings",
    type: "stat",
    size: "sm",
    dataSource: "listings:count",
  },
  {
    id: "listing_recent",
    title: "Recent Listings",
    type: "list",
    size: "md",
    dataSource: "listings:recent:5",
  },
  {
    id: "review_count",
    title: "Total Reviews",
    type: "stat",
    size: "sm",
    dataSource: "reviews:count",
  },
  {
    id: "review_recent",
    title: "Recent Reviews",
    type: "list",
    size: "md",
    dataSource: "reviews:recent:5",
  },
  {
    id: "shop_count",
    title: "Total Shops",
    type: "stat",
    size: "sm",
    dataSource: "shops:count",
  },
  {
    id: "shop_recent",
    title: "Recent Shops",
    type: "list",
    size: "md",
    dataSource: "shops:recent:5",
  },
];

export const QUICK_ACTIONS = [
  { label: "New User", href: "/users/new" },
  { label: "New Listing", href: "/listings/new" },
  { label: "New Review", href: "/reviews/new" },
  { label: "New Shop", href: "/shops/new" },
  { label: "New Order", href: "/orders/new" },
  { label: "New Payment", href: "/payments/new" },
  { label: "New Subscription", href: "/subscriptions/new" },
  { label: "New Upload", href: "/uploads/new" },
  { label: "New Channel", href: "/channels/new" },
  { label: "New Notification", href: "/notifications/new" },
  { label: "New Conversation", href: "/conversations/new" },
  { label: "New Message", href: "/messages/new" },
  { label: "New Global Search Feature", href: "/global-search-features/new" },
  { label: "New Safe Transactions", href: "/safe-transactions/new" },
  { label: "New Own Shop System", href: "/own-shop-systems/new" },
  { label: "New Set Your Own Prices", href: "/set-your-own-prices/new" },
  { label: "New No Transaction Fees", href: "/no-transaction-fees/new" },
  { label: "New Messages And Chat System", href: "/messages-and-chat-systems/new" },
  { label: "New Classified Ad Market", href: "/classified-ad-markets/new" },
  { label: "New Member Reviews", href: "/member-reviews/new" },
  { label: "New Privacy Functions", href: "/privacy-functions/new" },
  { label: "New Media Cloud", href: "/media-clouds/new" },
  { label: "New User Blocking System", href: "/user-blocking-systems/new" },
  { label: "New Human Operated Fake Check", href: "/human-operated-fake-checks/new" },
  { label: "New Member Reviews And Ratings", href: "/member-reviews-and-ratings/new" },
  { label: "New Full Featured Profiles", href: "/full-featured-profiles/new" },
  { label: "New Seller Ratings And Buyer Reviews", href: "/seller-ratings-and-buyer-reviews/new" },
  { label: "New User Ranking List", href: "/user-ranking-lists/new" },
  { label: "New Friends And Fans System", href: "/friends-and-fans-systems/new" },
  { label: "New Custom Video Clips", href: "/custom-video-clips/new" },
  { label: "New Private Photosets", href: "/private-photosets/new" },
  { label: "New Whatsapp And Skype Chats", href: "/whatsapp-and-skype-chats/new" },
];
```

---

## Validation Checklist

- [ ] Screen map covers all routes
- [ ] All screens have navigation paths
- [ ] Primary flows defined with steps
- [ ] Entry points mapped
- [ ] Exit conditions specified
- [ ] Widget mapping complete
- [ ] Mobile navigation defined
- [ ] Route-to-role mapping complete

---

## Artifacts (Required by Other Phases)

| File | Consumed By |
|------|-------------|
| `docs/ux/SCREEN_MAP.md` | Phase 05 (Layout) |
| `docs/ux/FLOWS.md` | Phase 14 (QA) |
| `lib/config/navigation.ts` | Phase 05 (Layout) |
| `docs/ux/ENTRY_EXIT.md` | Phase 03 (Auth), Phase 09 (Permissions) |
| `lib/config/widgets.ts` | Phase 07 (Dashboard) |

---

**Next Phase:** `11-observability.md`

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

- [ ] `app/page.tsx` created
- [ ] `app/(public)/about/page.tsx` created
- [ ] `app/(public)/terms/page.tsx` created

### Structural Contracts

Verify these structural requirements are met:

- `app/page.tsx` exists
  - Exports: `default`

For TypeScript/TSX files, verify exports:
```bash
# Example: grep -c "export" {file} to verify exports exist
```


```bash
test -e "app/page.tsx" && echo "✓ app/page.tsx" || echo "✗ MISSING: app/page.tsx"
test -e "app/(public)/about/page.tsx" && echo "✓ app/(public)/about/page.tsx" || echo "✗ MISSING: app/(public)/about/page.tsx"
test -e "app/(public)/terms/page.tsx" && echo "✓ app/(public)/terms/page.tsx" || echo "✗ MISSING: app/(public)/terms/page.tsx"
```

If any contract fails, fix the file before reporting completion. Do NOT skip contract failures.

---

## Completion Protocol

After all outputs verified:

1. Write your agent state to `docs/build-state/pages.json` (avoids race conditions with parallel agents):
   ```json
   {
     "agentId": "pages",
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
   - Set `agents.pages.status` to `"complete"`
   - Set `agents.pages.completedAt` to current ISO timestamp
   - Set `lastUpdatedByAgent` to `"pages"`
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
   ## [pages] {error-title}
   - **Phase:** {phase-file}
   - **Type:** transient | config | logic | dependency
   - **Severity:** critical | major | minor
   - **Error:** {error message}
   - **Attempted fixes:** {what you tried}
   - **Workaround:** {stub/mock created}
   - **Impact:** {what won't work until this is fixed}
   ```
2. Create a stub/mock that makes the build pass
3. Add to `agents.pages.warnings` in BUILD_STATE.json
4. Continue to the next phase

---

**Agent pages complete.** Report status to orchestrator.
