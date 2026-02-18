# Architecture (Rewrite)

## Runtime and tooling

- Runtime/package manager/task runner: Bun
- Formatter/linter: Biome
- Frontend: React 19 + TypeScript + React Router framework mode (SPA-first)
- Styling: Tailwind CSS + shadcn/ui-style component patterns
- Data: PostgreSQL + Drizzle ORM + drizzle-kit
- Validation: Zod

## App structure

- `app/`: Route modules, reusable UI components, RPG domain engine, validation schemas
- `drizzle/`: Postgres schema and SQL migrations
- `scripts/`: Bun-first automation entrypoints (reserved for orchestration scripts)
- `tests/`: Bun tests for RPG domain rules

## Delivery posture

- New behavior and feature work targets the TypeScript app and Drizzle schema.
- Gameplay rules (XP, streaks, slips, achievements) are implemented in typed utilities in `app/lib/rpg-engine.ts`.
