# CLAUDE.md — Multi-Agent Build Orchestrator v4.0

> **You are building PantyHub.**
> **17 agents | 5 tiers | 3 parallel tiers | ~98 min estimated**
> **Read docs/CONTEXT.md for all project details.**

> **Model recommendation: Use Claude Opus (the highest available model).** This orchestration spawns up to 17 parallel agents. Opus handles complexity better and produces higher quality output. In Claude Code: switch model with `/model` before starting.

---

## Mission

Build a production-ready Next.js application using a **multi-agent orchestration system**.
Instead of executing 45+ phases sequentially, you orchestrate **specialized agents** that work in parallel.

**Do not ask for permission. Execute autonomously. The build MUST complete 100%.**

---

## How It Works

1. Each agent has a self-contained bundle at `docs/agents/{id}.md`
2. Agents execute in **tiers** — each tier must complete before the next starts
3. Agents within a **parallel tier** can run simultaneously using the Task tool
4. Each agent's bundle contains: pre-flight checks, relevant context, all phase instructions, output contracts, quality gate, completion verification
5. Agents communicate via `docs/BUILD_STATE.json` — the cross-agent context bridge (v2.0 with dependency hashing + conflict zones)
6. Agents share type conventions via `docs/contracts/shared-types.json` — ensures consistent naming across all agents
7. Quality gates are **progressive**: tsc-only → tsc+build → tsc+build+audit (stricter each tier)
8. Each agent is **idempotent** — safe to re-run without creating duplicates
9. Errors use **adaptive retry** — different strategies for transient/config/logic/dependency errors
10. Track progress in `docs/PROGRESS.md`
11. The full orchestration plan is in `docs/ORCHESTRATION.md`

---

## Initialization

Before starting any tier:

1. **Read `docs/PROGRESS.md`** — check if any tiers/agents are already complete
2. **Read `docs/CONTEXT.md`** — understand the project
3. **Read `docs/contracts/shared-types.json`** — understand entity schemas, naming conventions, and design tokens. All agents MUST follow these conventions.
4. **Initialize `docs/BUILD_STATE.json`** — this file tracks cross-agent state. If it doesn't exist, it will be created by the first agent.
5. **Run `npx tsc --noEmit`** — verify clean starting state
6. **Create restore point:** `git add -A && git stash push -m "pre-build" && git stash pop` — enables rollback if needed

### Pre-Shipped Files (IMPORTANT)

This blueprint is a **complete, pre-generated project directory**. All config files, code, and docs are already present. You do NOT need to run create-next-app or any scaffolding tool.

Your only setup tasks before the AI build:
1. Run `npm install` in this directory
2. Apply the database schema: paste `supabase/schema.sql` into Supabase SQL Editor
3. Copy `.env.example` → `.env.local` and fill in your Supabase credentials
4. Then proceed with Tier 1 below

**Pre-generated config files already in this directory (do NOT recreate them):**
- `package.json` — all dependencies pre-listed
- `tsconfig.json` — path aliases configured
- `tailwind.config.ts` — shadcn color tokens + CSS variables
- `next.config.ts` — image domains, plugins
- `app/globals.css` — design system CSS variables
- `.env.example` — all required environment variables

**DO NOT manually install packages beyond `npm install`.** All dependencies are declared.

---

## Cross-Agent Context Bridge

Agents communicate through `docs/BUILD_STATE.json`:

- **Before starting:** Each agent reads BUILD_STATE to understand what previous agents produced
- **After completing:** Each agent writes its status, outputs, decisions, and warnings
- **Between tiers:** The orchestrator (you) checks BUILD_STATE for warnings before proceeding

This ensures context flows between tiers without agents needing to read each other's full bundles.

---

## Execution Protocol

1. Execute tier by tier (see below)
2. For parallel tiers: use the Task tool to spawn agents simultaneously
3. After each tier: run quality gate + supervisor checks + verify BUILD_STATE.json
4. After ALL tiers: "PantyHub is built and production-ready."

### Using the Task Tool for Parallel Agents

For parallel tiers, spawn one Task per agent:

```
Task 1: "Read docs/agents/{agent1}.md and execute ALL phases inside. Report when complete."
Task 2: "Read docs/agents/{agent2}.md and execute ALL phases inside. Report when complete."
```

Wait for all tasks to complete, then run the quality gate.

---

## Execution Plan

### Tier 1: Skeleton (Schema + Pages) — PARALLEL

Spawn 2 parallel agents using the Task tool:

- **Task:** Read `docs/agents/schema.md` and execute ALL phases inside it.
  Agent: Schema Agent (4 phases, ~5 min)
- **Task:** Read `docs/agents/pages.md` and execute ALL phases inside it.
  Agent: Pages Agent (5 phases, ~6 min)

**Wait for ALL agents to complete.** Then:
1. Run quality gate [Standard (tsc + build)]: `npx tsc --noEmit && npm run build`
2. Read `docs/BUILD_STATE.json` — check for warnings from completed agents
3. Verify `docs/contracts/shared-types.json` — ensure type consistency across agents
4. Verify `docs/INVENTORY.md` for this tier's deliverables
5. Fix any errors before proceeding to Tier 2

---

### Tier 2: Content (UX + 7 Features) — PARALLEL

Spawn 9 parallel agents using the Task tool:

- **Task:** Read `docs/agents/error-handling.md` and execute ALL phases inside it.
  Agent: Error Handling Agent (3 phases, ~4 min)
- **Task:** Read `docs/agents/responsive.md` and execute ALL phases inside it.
  Agent: Responsive Agent (6 phases, ~4 min)
- **Task:** Read `docs/agents/feature-payments.md` and execute ALL phases inside it.
  Agent: Payments (Stripe) Agent (1 phases, ~5 min)
- **Task:** Read `docs/agents/feature-uploads.md` and execute ALL phases inside it.
  Agent: File Uploads Agent (1 phases, ~5 min)
- **Task:** Read `docs/agents/feature-realtime.md` and execute ALL phases inside it.
  Agent: Realtime Agent (1 phases, ~5 min)
- **Task:** Read `docs/agents/feature-search.md` and execute ALL phases inside it.
  Agent: Full-Text Search Agent (1 phases, ~5 min)
- **Task:** Read `docs/agents/feature-notifications.md` and execute ALL phases inside it.
  Agent: Notifications Agent (1 phases, ~5 min)
- **Task:** Read `docs/agents/feature-messaging.md` and execute ALL phases inside it.
  Agent: Direct Messaging Agent (1 phases, ~5 min)
- **Task:** Read `docs/agents/feature-reviews.md` and execute ALL phases inside it.
  Agent: Reviews & Ratings Agent (1 phases, ~5 min)

**Wait for ALL agents to complete.** Then:
1. Run quality gate [Standard (tsc + build)]: `npx tsc --noEmit && npm run build`
2. Read `docs/BUILD_STATE.json` — check for warnings from completed agents
3. Verify `docs/contracts/shared-types.json` — ensure type consistency across agents
4. Verify `docs/INVENTORY.md` for this tier's deliverables
5. Fix any errors before proceeding to Tier 3

---

### Tier 3: Content (Production) — PARALLEL

Spawn 2 parallel agents using the Task tool:

- **Task:** Read `docs/agents/security.md` and execute ALL phases inside it.
  Agent: Security Agent (5 phases, ~4 min)
- **Task:** Read `docs/agents/devops.md` and execute ALL phases inside it.
  Agent: DevOps Agent (10 phases, ~7 min)

**Wait for ALL agents to complete.** Then:
1. Run quality gate [Standard (tsc + build)]: `npx tsc --noEmit && npm run build && echo 'Bundle check: verify first-load JS < 500KB'`
2. Read `docs/BUILD_STATE.json` — check for warnings from completed agents
3. Verify `docs/contracts/shared-types.json` — ensure type consistency across agents
4. Verify `docs/INVENTORY.md` for this tier's deliverables
5. Fix any errors before proceeding to Tier 4

---

### Tier 4: Quality (Audit + Test) — Sequential

Read `docs/agents/qa.md` and execute ALL phases inside it.
Agent: Quality Assurance Agent (12 phases, ~15 min)

After completion:
1. Run quality gate [Standard (tsc + build)]: `npx tsc --noEmit && npm run build && echo 'Bundle check: verify first-load JS < 500KB'`
2. Read `docs/BUILD_STATE.json` — check for warnings
3. Verify `docs/INVENTORY.md` for this tier's deliverables
4. Fix any errors before proceeding to Tier 5

---

### Tier 5: Quality (Proof + Ship) — Sequential

Read `docs/agents/build-proof.md` and execute ALL phases inside it.
Agent: Build Proof Agent (3 phases, ~10 min)

After completion:
1. Run quality gate [Standard (tsc + build)]: `npx tsc --noEmit && npm run build && echo 'Bundle check: verify first-load JS < 500KB'`
2. Read `docs/BUILD_STATE.json` — check for warnings
3. Verify `docs/INVENTORY.md` for this tier's deliverables
4. Fix any errors before proceeding to Tier 6

---

## Feature Integration

7 feature(s) integrated as dedicated agents. Feature agents run in parallel during Tier 4.

**Block C (Entity System):**
  → Read `docs/features/payments.md`
  → Read `docs/features/uploads.md`
  → Read `docs/features/realtime.md`
  → Read `docs/features/search.md`
  → Read `docs/features/notifications.md`
  → Read `docs/features/messaging.md`
  → Read `docs/features/reviews.md`

---

## Tier Handoff Protocol

After each tier completes, before starting the next:

1. **Quality Gate:** Run the tier's quality gate command (progressive — see each tier below)
2. **Supervisor Check:** Verify quality standards:
   - Zero TypeScript/Dart errors
   - Build succeeds with zero warnings
   - No hardcoded secrets or credentials
   - All created files follow project conventions from `docs/contracts/shared-types.json`
3. **Output Contract Verification:** Check that each agent's `outputContractsPassed` is `true` in BUILD_STATE.json
4. **Conflict Zone Check:** For parallel tiers — verify that files listed in `conflictZones` in BUILD_STATE.json don't have merge conflicts
5. **BUILD_STATE Review:** Read `docs/BUILD_STATE.json`:
   - Check `warnings` arrays for all agents in the completed tier
   - Check `decisions` arrays for architectural choices that affect later agents
   - If critical warnings exist: fix them before proceeding
   - If minor warnings exist: log them and continue
6. **Dependency Hash Check:** Verify `inputHashes` in BUILD_STATE — if an input changed since the agent started, the agent may need re-running
7. **Inventory Check:** Verify `docs/INVENTORY.md` — fix any missing items
8. **Progress Update:** Update `docs/PROGRESS.md` with tier status

---

## Environment Variables Strategy

**Tiers 1-4 require ZERO environment variables.** Everything compiles with stubs.
**Tier 5 (Production) is where env vars matter for real database + auth.**
The app ALWAYS compiles and renders. Backend is the last layer.

---

## Self-Healing & Recovery

When errors occur during any agent's execution, apply these strategies in order:

### Tier 1: Auto-Fix (try first)
| Error Type | Fix |
|------------|-----|
| Missing import | Add the import from @/ path |
| Type mismatch | Fix the type or add proper interface |
| Unused variable | Remove it |
| Missing package | `npm install <package>` |

### Tier 2: Semi-Auto Fix
| Error Type | Fix |
|------------|-----|
| Missing env var | Create stub with mock fallback |
| Port conflict | Use next available port |
| Build cache stale | Clear cache and rebuild |
| Circular dependency | Extract shared type to separate file |

### Tier 3: Structured Workaround
| Error Type | Fix |
|------------|-----|
| Database error | Create migration file, skip execution |
| Auth failure | Create stub auth with mock user |
| External API error | Create mock response |
| Complex type error | Use `as unknown as TargetType` + TODO |

### Tier 4: Escalation
If an error persists after 3 attempts:
1. Log to `docs/TODO.md` with full context
2. Create a stub/mock that makes the build pass
3. Add to `docs/BUILD_STATE.json` warnings
4. Continue to next phase
5. The QA agent (Tier 6) will address all escalated issues

**The golden rule: A working app with stubs > stuck build. The QA agent cleans everything up.**

---

## NEVER-STOP Protocol

**NEVER ask questions. NEVER wait for input. NEVER stop the build.**

- Each agent bundle has **Adaptive Error Recovery** with 4 error types:
  - **Transient** (network/timeout): 5 retries with exponential backoff
  - **Config** (env vars/paths): 1 auto-fix attempt, then stub
  - **Logic** (type mismatch): 1 retry with different approach, then stub
  - **Dependency** (missing file from prior agent): 0 retries, immediate escalation
- Missing env vars? Stub with mock data
- Unclear instruction? Make the best decision, log to `decisions` in BUILD_STATE.json with category
- If stuck 2+ min: escalate to TODO.md + create stub + move on
- External services down? Mock them
- The QA agent (Tier 6) fixes ALL stubs, TODOs, and escalated issues
- The Smoke Test agent (Tier 7) verifies every route actually renders
- **A working app with stubs > stuck build.**

---

## Completion

When all tiers are complete:
> **"PantyHub is built and production-ready. All 17 agents complete. Run `npm run dev` to start."**
