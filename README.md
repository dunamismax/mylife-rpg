# QuestLog

Gamified productivity system that turns daily habits, tasks, and goals into RPG progression. Quests, XP, leveling, stats, and achievements — all backed by a real database and designed for long-term use.

## Features

- **RPG progression engine** — XP, leveling, stat allocation, and achievement tracking
- **Quest system** — create and complete quests tied to real-world goals
- **Habit tracking** — recurring habits with streak mechanics
- **Domain-driven design** — RPG rules live in a testable engine, independent of UI
- **Drizzle ORM** — type-safe Postgres schema with migrations
- **shadcn/ui patterns** — Radix primitives + Tailwind + class-variance-authority

## Prerequisites

- [Bun](https://bun.sh)
- PostgreSQL

## Quick Start

```bash
git clone https://github.com/dunamismax/questlog.git
cd questlog
bun install
cp .env.example .env
# configure DATABASE_URL in .env
bun run db:migrate
bun run dev
```

## Commands

| Command | Description |
|---|---|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Biome lint check |
| `bun run format` | Biome auto-format |
| `bun run typecheck` | TypeScript type check |
| `bun run test` | Run Bun tests |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Drizzle Studio |

## Stack

- **Runtime**: Bun
- **Frontend**: React 19 · React Router 7 (framework mode) · Tailwind CSS v4
- **Components**: shadcn/ui patterns (Radix + CVA)
- **Database**: PostgreSQL · Drizzle ORM
- **Validation**: Zod
- **Tooling**: Biome · TypeScript 5.9

## Project Structure

```
app/                    # React frontend
  routes/               # Route modules
  components/           # UI components
  lib/                  # RPG engine, utilities, types
    rpg-engine.ts       # Core progression rules (testable)
drizzle/                # Schema and migrations
scripts/                # Orchestration scripts
tests/                  # Domain and behavior tests
docs/                   # Architecture documentation
public/                 # Static assets
```

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — architecture notes

## License

[MIT](LICENSE)
