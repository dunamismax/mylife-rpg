# QuestLog

QuestLog is a personal execution journal built as a Bun monorepo. The product stays intentionally narrow: a finite quest list, recurring habits, one daily check-in, and a lightweight XP/level loop.

## Stack

- Runtime: Bun
- Workspace: Bun
- Language: TypeScript
- Frontend: TanStack Start, TanStack Router, TanStack Query, React 19, Tailwind CSS 4
- Server model: async TypeScript services with Zod validation
- Database: PostgreSQL + Drizzle ORM
- Auth: Better Auth
- Observability: OpenTelemetry
- Tooling: Biome + Vitest

## Workspace Layout

```text
apps/web/             TanStack Start app, API routes, UI
packages/contracts/   Zod contracts shared by client and server
packages/db/          Drizzle schema, database client, Better Auth tables
packages/server/      Domain services, validation, and auth/session logic
packages/telemetry/   OpenTelemetry bootstrap and tracing helpers
docs/                 Architecture notes for the rewrite
```

## Prerequisites

- Bun 1.3+
- PostgreSQL 16+ available locally, or a compatible Docker container

## Quick Start

```bash
bun install
cp .env.example .env
docker run --name questlog-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=questlog \
  -p 5432:5432 \
  -d postgres:17
bun run db:push
bun run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Common Commands

```bash
bun run dev
bun run build
bun run test
bun run check
bun run db:push
bun run db:studio
bun run auth:generate
```

## Notes

- `bun run auth:generate` only needs to run after changing Better Auth configuration.
- `OTEL_EXPORTER_OTLP_ENDPOINT` is optional. Without it, traces fall back to console export outside tests.

## License

[MIT](LICENSE)
