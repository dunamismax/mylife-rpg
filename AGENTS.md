# AGENTS.md

> Runtime operations source of truth for `mylife-rpg`.
> This file defines what to run, how to run it, and what done looks like.
> For identity and voice, see `SOUL.md`.

---

## First Rule

Read `SOUL.md` first, then this file, then `README.md`.

---

## Owner

- Name: Stephen
- Alias: `dunamismax`
- Home: `/home/sawyer`
- Projects root: `/home/sawyer/github`
- Repo: `/home/sawyer/github/mylife-rpg`

---

## Stack Contract (Strict)

Do not deviate from this stack unless Stephen explicitly approves:

- Runtime + package manager + task runner: **Bun** (`bun`, `bunx`)
- App framework: **Vite + React Router (framework mode, SPA-first)**
- UI runtime: **React 19.2 + TypeScript**
- Styling/components: **Tailwind CSS + shadcn/ui patterns**
- Database: **Postgres**
- ORM/migrations: **Drizzle ORM + drizzle-kit**
- Auth baseline when required: **Auth.js**
- Validation: **Zod**
- Formatting/linting: **Biome**

### Disallowed by default

- No PHP/Laravel/Livewire/Fortify implementation in this repo.
- No npm/pnpm/yarn scripts.
- No ESLint/Prettier migration unless explicitly requested.
- No SSR-by-default setup.

---

## Repository Layout

- `app/` React Router app code (routes, entrypoints, components, domain logic)
- `public/` static assets
- `drizzle/` migrations and schema metadata
- `scripts/` Bun TypeScript orchestration docs/scripts
- `docs/` architecture and operational docs
- `tests/` behavior and domain tests

---

## Workflow

`Wake -> Explore -> Plan -> Code -> Verify -> Report`

- Prefer the smallest reliable diff.
- Keep changes intentional and reviewable.
- Execute directly, then verify with commands.

---

---

### Next-Agent Handoff Prompt (Standard)

- After completing work and reporting results, always ask Stephen whether to generate a handoff prompt for the next AI agent.
- If Stephen says yes, generate a context-aware next-agent prompt that:
  - uses current repo/app state and recent changes,
  - prioritizes highest-value next steps,
  - includes concrete implementation goals, constraints, verification commands, and expected response format.
- Treat this as part of the normal workflow for every completed task.

## Command Policy

Use Bun for all repository operations.

### Canonical commands

```bash
bun install
bun run dev
bun run db:generate
bun run db:migrate
bun run db:studio
bun run lint
bun run typecheck
bun run build
bun run test
bun run format
```

---

## Done Criteria

A task is done only when all are true:

- Requirements are implemented in the target stack.
- Relevant checks were run and reported.
- `bun run lint` passes.
- `bun run typecheck` passes.
- `bun run build` passes for build-impacting changes.
- `bun run test` passes for behavior/auth/data changes.
- Docs are aligned with behavior changes.

---

## Safety Rules

- Ask before destructive deletes or external system changes.
- Keep commits focused and atomic.
- Never claim success without verification output.
- Escalate when uncertainty is high and blast radius is non-trivial.

---

## Living Document Protocol

- Keep this file current-state only.
- Update whenever stack, workflows, or safety posture changes.
- Synchronize with `SOUL.md` whenever repo identity or operating assumptions change.
