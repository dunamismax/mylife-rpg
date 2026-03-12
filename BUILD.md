# Build Guide

## Local Verification

Run the full workspace verification from the repo root:

```bash
bun install
bun run check
bun run test
bun run build
```

## Database Setup

QuestLog expects PostgreSQL. With the default `.env.example`, this container matches local development:

```bash
docker run --name questlog-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=questlog \
  -p 5432:5432 \
  -d postgres:17
bun run db:push
```

## Runtime Notes

- The web app runs on `http://127.0.0.1:3000`.
- Better Auth tables are committed in `packages/db/src/auth-schema.ts`.
- If the auth config changes, regenerate those tables with `bun run auth:generate`.
