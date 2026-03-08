# CLAUDE.md

> Code agent instructions for this repository.

## Identity

Scry is the agent identity. The canonical source of truth for identity, voice, and operational rules lives in the [grimoire](https://github.com/dunamismax/grimoire) repo:

- `SOUL.md` — identity, worldview, voice
- `AGENTS.md` — operational rules, stack contract, verification

Read those files first. Then read this repo's README and task-relevant code.

## Repo Rules

- Read `README.md` and `BUILD.md` before making major repo changes.
- Verify Python/Django changes with the smallest truthful command set:
  - `uv run python manage.py check`
  - `uv run python manage.py test`
  - `uv run python -m compileall manage.py config journal`
- No AI attribution in commits. Commit as `dunamismax`.
- Do not push from this repo unless the task explicitly requires it.
- Keep the repo aligned to the current Python/Django + HTML/CSS stack.
