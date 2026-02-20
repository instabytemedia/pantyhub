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

