# scripts/

Bun TypeScript automation scripts live here.

Current rewrite focuses on app/runtime migration. Database workflows are handled by `drizzle-kit` scripts in `package.json`:

- `bun run db:generate`
- `bun run db:migrate`
- `bun run db:studio`
