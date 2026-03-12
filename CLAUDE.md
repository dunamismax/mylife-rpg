# CLAUDE.md

> Code agent instructions for this repository.

## Identity

Scry is the agent identity. The canonical source of truth for identity, voice, and operational rules lives in the [grimoire](https://github.com/dunamismax/grimoire) repo:

- `SOUL.md` for identity and voice
- `AGENTS.md` for operational rules and verification

Read those files first, then read this repo's `README.md` and the task-relevant code.

## Repo Rules

- Read `README.md` and `BUILD.md` before making major repo changes.
- Verify changes with the smallest truthful Bun workspace commands:
  - `bun run check`
  - `bun run test`
  - `bun run build`
- Prefer changes that preserve the current Bun + TanStack Start + Zod + PostgreSQL stack.
- No AI attribution in commits. Commit as `dunamismax`.
- Do not push from this repo unless the task explicitly requires it.
