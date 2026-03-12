# QuestLog

QuestLog is a personal execution journal rebuilt as a Bun + pnpm monorepo. The product stays intentionally narrow: a finite quest list, recurring habits, one daily check-in, and a lightweight XP/level loop.

## Stack

- Runtime: Bun
- Workspace: pnpm
- Language: TypeScript
- Frontend: TanStack Start, TanStack Router, TanStack Query, React 19, Tailwind CSS 4
- Server model: Effect + Effect Schema
- Database: PostgreSQL + Drizzle ORM
- Auth: Better Auth
- AI UX: TanStack AI with a Mastra coaching workflow
- Observability: OpenTelemetry
- Tooling: Biome + Vitest

## Workspace Layout

```text
apps/web/             TanStack Start app, API routes, UI
packages/contracts/   Effect Schema contracts shared by client and server
packages/db/          Drizzle schema, database client, Better Auth tables
packages/server/      Effect-powered domain services and auth/session logic
packages/ai/          Mastra workflow and fallback coaching heuristics
packages/telemetry/   OpenTelemetry bootstrap and tracing helpers
docs/                 Architecture notes for the rewrite
```

## Prerequisites

- Bun 1.2+
- pnpm 10+
- PostgreSQL 16+ available locally, or a compatible Docker container

## Quick Start

```bash
pnpm install
cp .env.example .env
docker run --name questlog-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=questlog \
  -p 5432:5432 \
  -d postgres:17
pnpm db:push
pnpm dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Common Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm check
pnpm db:push
pnpm db:studio
pnpm auth:generate
```

## Notes

- `pnpm auth:generate` only needs to run after changing Better Auth configuration.
- `OPENAI_API_KEY` is optional. Without it, QuestLog still renders fallback coaching guidance from the live dashboard state.
- `OTEL_EXPORTER_OTLP_ENDPOINT` is optional. Without it, traces fall back to console export outside tests.

## License

[MIT](LICENSE)
