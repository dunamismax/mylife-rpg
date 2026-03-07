# questlog — Build Tracker

**Status:** Django baseline rewrite in progress
**Last Updated:** 2026-03-07
**Branch:** `main`

## Current Product Definition

QuestLog is a single-user quest journal for three things only:

- quests that can be created and completed once
- recurring habits with dated completion logs and streaks
- one daily check-in with intention and reflection

XP and level remain, but only as lightweight progress bookkeeping.

## Phase Plan

### Phase 1 — Reset from prototype stack
- [x] Add Django project skeleton (`config/`, `manage.py`)
- [x] Add `journal` app models, forms, services, views, and tests
- [x] Rewrite README + architecture docs for the smaller product
- [x] Remove the old React Router / Drizzle / Bun scaffolding

### Phase 2 — Working server-rendered baseline
- [x] Add base template and dashboard template
- [x] Add plain CSS styling
- [x] Add Python dependency manifest
- [x] Add initial Django migration for the journal app

### Phase 3 — Verification
- [ ] `uv run --with 'Django>=5,<6' python manage.py check`
- [ ] `uv run --with 'Django>=5,<6' python manage.py test`
- [ ] `uv run --with 'Django>=5,<6' python -m compileall manage.py config journal`

## Verification Snapshot

Pending final verification after the Django baseline is fully reconciled.

## Immediate Next Pass Priorities

1. Generate and verify the initial migration
2. Run the Django checks/tests/compile pass
3. Commit only after the repo state matches the rewritten docs
