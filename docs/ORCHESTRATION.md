# PantyHub — Build Orchestration

> **Multi-Agent Execution Plan**
> 17 agents | 5 tiers | 3 parallel tiers | ~98 min estimated

---

## How It Works

1. Agents execute in **tiers** — each tier must complete before the next starts
2. Agents within a **parallel tier** can run simultaneously (using Claude Code Task tool)
3. Each agent reads its own `docs/agents/{id}.md` bundle (self-contained instructions)
4. After each tier: run the quality gate to verify everything compiles
5. Track progress in `docs/PROGRESS.md`

---

## Execution Plan

### Tier 1: Skeleton (Schema + Pages) ⚡ PARALLEL

| Agent | Phases | Est. Time | Depends On |
|-------|--------|-----------|------------|
| Schema Agent | 4 phases | ~5 min | foundation |
| Pages Agent | 5 phases | ~6 min | foundation |

**Quality Gate:** `npx tsc --noEmit && npm run build`

---

### Tier 2: Content (UX + 7 Features) ⚡ PARALLEL

| Agent | Phases | Est. Time | Depends On |
|-------|--------|-----------|------------|
| Error Handling Agent | 3 phases | ~4 min | schema, pages |
| Responsive Agent | 6 phases | ~4 min | schema, pages |
| Payments (Stripe) Agent | 1 phases | ~5 min | pages |
| File Uploads Agent | 1 phases | ~5 min | pages |
| Realtime Agent | 1 phases | ~5 min | pages |
| Full-Text Search Agent | 1 phases | ~5 min | pages |
| Notifications Agent | 1 phases | ~5 min | pages |
| Direct Messaging Agent | 1 phases | ~5 min | pages |
| Reviews & Ratings Agent | 1 phases | ~5 min | pages |

**Quality Gate:** `npx tsc --noEmit && npm run build`

---

### Tier 3: Content (Production) ⚡ PARALLEL

| Agent | Phases | Est. Time | Depends On |
|-------|--------|-----------|------------|
| Security Agent | 5 phases | ~4 min | error-handling, responsive, feature-payments, feature-uploads, feature-realtime, feature-search, feature-notifications, feature-messaging, feature-reviews |
| DevOps Agent | 10 phases | ~7 min | error-handling, responsive, feature-payments, feature-uploads, feature-realtime, feature-search, feature-notifications, feature-messaging, feature-reviews |

**Quality Gate:** `npx tsc --noEmit && npm run build && echo 'Bundle check: verify first-load JS < 500KB'`

---

### Tier 4: Quality (Audit + Test) ⏳ Sequential

| Agent | Phases | Est. Time | Depends On |
|-------|--------|-----------|------------|
| Quality Assurance Agent | 12 phases | ~15 min | security, devops |
| Smoke Test Agent | 2 phases | ~5 min | qa |

**Quality Gate:** `npx tsc --noEmit && npm run build && echo 'Bundle check: verify first-load JS < 500KB'`

---

### Tier 5: Quality (Proof + Ship) ⏳ Sequential

| Agent | Phases | Est. Time | Depends On |
|-------|--------|-----------|------------|
| Build Proof Agent | 3 phases | ~10 min | smoke-test |
| ShipGate Agent | 2 phases | ~3 min | build-proof |

**Quality Gate:** `npx tsc --noEmit && npm run build && echo 'Bundle check: verify first-load JS < 500KB'`

---

## Agent Bundles

Each agent has a self-contained instruction file at `docs/agents/{agent-id}.md` containing:
- Prerequisites (what must exist before starting)
- Relevant CONTEXT.md sections (not the full file)
- All phase instructions inlined
- Quality gate command

| Agent ID | Bundle File | Phases |
|----------|-------------|--------|
| pages | `docs/agents/pages.md` | 5 |
| schema | `docs/agents/schema.md` | 4 |
| error-handling | `docs/agents/error-handling.md` | 3 |
| responsive | `docs/agents/responsive.md` | 6 |
| security | `docs/agents/security.md` | 5 |
| devops | `docs/agents/devops.md` | 10 |
| qa | `docs/agents/qa.md` | 12 |
| smoke-test | `docs/agents/smoke-test.md` | 2 |
| build-proof | `docs/agents/build-proof.md` | 3 |
| shipgate | `docs/agents/shipgate.md` | 2 |
| feature-payments | `docs/agents/feature-payments.md` | 1 |
| feature-uploads | `docs/agents/feature-uploads.md` | 1 |
| feature-realtime | `docs/agents/feature-realtime.md` | 1 |
| feature-search | `docs/agents/feature-search.md` | 1 |
| feature-notifications | `docs/agents/feature-notifications.md` | 1 |
| feature-messaging | `docs/agents/feature-messaging.md` | 1 |
| feature-reviews | `docs/agents/feature-reviews.md` | 1 |

---

## Dependency Graph

```
Foundation
    ├── Shell  ──┐
    └── Data   ──┤
                 └── Entity
                       ├── Polish  ──────────┐
                       ├── Payments (Stripe) Agent ┤
                       ├── File Uploads Agent   ┤
                       ├── Realtime Agent       ┤
                       ├── Full-Text Search Agent ┤
                       ├── Notifications Agent  ┤
                       ├── Direct Messaging Agent ┤
                       ├── Reviews & Ratings Agent ┤
                       └─────────────────────┤
                                             └── Production
                                                   └── QA
                                                         └── Smoke Test
```
