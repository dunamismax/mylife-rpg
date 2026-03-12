# Architecture

## Product Shape

QuestLog is deliberately small:

- quests are finite commitments with one completion event
- habits are recurring behaviors with dated logs and streak state
- check-ins are one row per day with intention, triggers, and reflection
- XP and level summarize momentum instead of turning the product into a game

## Monorepo Boundaries

- `apps/web` owns the TanStack Start app, route tree, API handlers, and the dashboard UI
- `packages/contracts` defines the transport and domain contracts with Effect Schema
- `packages/db` owns the Drizzle schema, PostgreSQL client, and generated Better Auth tables
- `packages/server` contains Effect-powered application services, validation, and session/auth helpers
- `packages/ai` contains the Mastra coaching workflow plus a deterministic fallback strategy
- `packages/telemetry` initializes OpenTelemetry tracing for server-side execution

## Data Flow

1. The browser reads dashboard state through TanStack Query.
2. Route handlers call `requireSession()` and then execute Effect services through `runServerEffect()`.
3. Services validate payloads with Effect Schema, perform Drizzle queries inside PostgreSQL transactions, and return contract-shaped results.
4. Mutations return the refreshed dashboard so the client can merge server truth immediately.
5. The AI panel uses TanStack AI for live chat and falls back to deterministic coaching text when `OPENAI_API_KEY` is absent.

## Persistence Model

- `progress` stores total XP and the derived level per user
- `quests` stores open/completed commitments and XP rewards
- `habits` stores recurring behavior definitions plus streak metadata
- `habit_logs` stores dated habit completions and awarded XP
- `daily_check_ins` stores one check-in per user per day
- Better Auth tables store user/session/account state

## Operational Notes

- PostgreSQL is the system of record
- OpenTelemetry wraps server calls so mutations and dashboard loads can be traced consistently
- Biome handles formatting, import organization, and linting
- Vitest covers the core date/streak rules and fallback coaching behavior
