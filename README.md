# PantyHub

## Build with AI

**Recommended: Claude Code with Claude Opus (highest model)**

```bash
claude .
# Claude reads CLAUDE.md and builds the entire app autonomously
```

> **Use the highest available Claude model (Claude Opus).** This blueprint uses multi-agent orchestration — Opus makes better decisions and handles complexity reliably. Switch model with `/model` in Claude Code before starting.

**Alternative tools:** Cursor (use `.cursorrules`) · Windsurf (use `.windsurfrules`)

---

## Setup (Before Building)

1. **Create a Supabase project** — https://supabase.com
2. Copy env: `cp .env.example .env.local`
3. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Apply schema: paste `supabase/schema.sql` into Supabase SQL Editor
5. Start the AI build (run `claude .` above)

The app compiles without env vars — backend is wired last.

---

## Project Files

```
├── CLAUDE.md             # Multi-agent orchestration — START HERE (Claude Code)
├── AGENT.md              # Sequential build — fallback for single-agent tools
├── .cursorrules          # Cursor IDE instructions
├── .windsurfrules        # Windsurf IDE instructions
├── supabase/             # Database schema (apply in Supabase SQL Editor)
├── docs/phases/          # Build phase instructions
├── docs/agents/          # Agent bundles (used by CLAUDE.md orchestration)
└── docs/features/        # Feature implementation guides
```

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth, DB, Storage, RLS)
- SWR for data fetching

---

*Generated with [Vibery](https://vibery.io)*
