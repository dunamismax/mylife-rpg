<p align="center">
  <img src="public/favicon.svg" alt="MyLife RPG logo" width="84" />
</p>

# MyLife RPG (TypeScript Rewrite)

MyLife RPG is now rewritten to a Bun-first TypeScript stack with React Router framework mode (SPA-first), Tailwind CSS, shadcn/ui-style components, Postgres, Drizzle ORM, Biome, and Zod.

## Stack

- Runtime/package manager/task runner: Bun
- Formatting/linting: Biome
- Frontend app/routing: Vite + React Router framework mode (SPA-first)
- UI runtime: React 19.2 + TypeScript
- Styling/components: Tailwind CSS + shadcn/ui patterns
- Database: Postgres
- ORM/migrations: Drizzle ORM + drizzle-kit
- Validation: Zod
- Authentication baseline: Auth.js (integrate when login/session flow is added)

## Repository layout

- `app/` React Router routes, UI components, RPG domain logic
- `public/` static assets
- `drizzle/` schema and migrations
- `scripts/` Bun TypeScript orchestration scripts
- `docs/` architecture and operational documentation
- `tests/` domain and app behavior tests

## Quick start

```bash
cp .env.example .env
bun install
bun run dev
```

## Database commands

```bash
bun run db:generate
bun run db:migrate
bun run db:studio
```

## Verification commands

```bash
bun run lint
bun run typecheck
bun run build
bun run test
```

## Status

- New feature work targets the TypeScript app and Drizzle schema.
- RPG progression rules live in `app/lib/rpg-engine.ts` and are validated with Bun tests.

## Documentation

- `SOUL.md`: project identity and product taste
- `AGENTS.md`: execution contract and done criteria
- `docs/architecture.md`: rewrite architecture notes
