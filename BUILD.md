# questlog — Build Tracker

**Status:** Documentation and instruction cleanup for the Django baseline
**Last Updated:** 2026-03-08
**Branch:** `codex/stack-realign-20260308-105446`

## Current Product Definition

QuestLog is a single-user Django app for:

- one-time quests with a completion record
- recurring habits with dated logs and streak tracking
- one daily check-in with intention and reflection

XP and level remain as lightweight bookkeeping around the journal.

## Cleanup Objective

This pass is limited to repo alignment work:

- keep the existing Python/Django implementation intact
- remove stale repository guidance that still describes non-Python tooling
- make build, verification, and agent instructions truthful for the current stack
- verify the repo with the smallest meaningful Django checks

## Planned Changes

### Phase 1 — Inspect and document the real state
- [x] Confirm the repo is already a Django + HTML/CSS application
- [x] Identify stale repo-specific instructions and old-stack references
- [x] Rewrite this tracker before major edits

### Phase 2 — Align repo documentation
- [x] Leave `README.md` unchanged because it already matches the Django app
- [x] Rewrite `CLAUDE.md` for Python/Django verification and local-only workflow
- [x] Remove stale old-stack wording from repo docs and helper instructions
- [x] Trim irrelevant ignore patterns that no longer match this repo

### Phase 3 — Verify and checkpoint
- [ ] `uv run python manage.py check` blocked: Django is not installed in the sandbox environment
- [ ] `uv run python manage.py test` blocked: Django is not installed in the sandbox environment
- [x] `uv run python -m compileall manage.py config journal`
- [ ] Create a local commit once docs and verification are coherent

## Verification Snapshot

Completed:

- `UV_CACHE_DIR=/tmp/uv-cache uv run python -m compileall manage.py config journal`

Blocked:

- `UV_CACHE_DIR=/tmp/uv-cache uv run python manage.py check`
- `UV_CACHE_DIR=/tmp/uv-cache uv run python manage.py test`

Both Django management commands fail with `ModuleNotFoundError: No module named 'django'` because the sandbox does not have Django installed.

## Notes

- This repo already appears to be migrated to Django; the remaining work is mostly documentation and instruction cleanup.
- No changes should reach outside this worktree.
