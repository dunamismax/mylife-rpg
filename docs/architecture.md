# Architecture

## Product Definition

QuestLog is a personal quest journal, not a broad life-ops RPG. The smallest sane product already latent in the old prototype was:

- a list of quests that can be finished and kept as a record,
- a small set of recurring habits with streaks,
- one daily check-in with intention and reflection,
- a lightweight XP/level summary.

Everything outside that core was either prototype flourish or premature system design.

## Foundation

- Framework: Django
- Rendering: server-rendered templates
- Styling: plain CSS
- Persistence: SQLite by default, through Django models and migrations
- Interaction model: standard HTML forms and POST/redirect/GET flows

## Deliberate Scope Cuts

These were removed from the foundation because they were not yet justified by the repo's real product shape:

- React Router application shell
- Tailwind/shadcn component scaffolding
- Drizzle schema and migration stack
- generic multi-user RPG framing
- achievements and status effects
- client-side demo state as the main source of truth

## Data Model

- `Progress`: singleton-style XP and level summary for the local user
- `Quest`: a one-time or recurring commitment with completion timestamp
- `Habit`: a recurring behavior definition with current streak metadata
- `HabitLog`: a dated completion record for a habit
- `DailyCheckIn`: one row per day for intention, triggers, reflection, and slip tracking

## Request Flow

- The dashboard is the product.
- Creating a quest or habit writes immediately to the database.
- Completing a quest awards XP once and stamps `completed_at`.
- Logging a habit creates a dated `HabitLog`, updates streak state, and awards XP once for that day.
- Saving a daily check-in upserts today's row.

## Next Expansion Points

If the product earns more scope later, the next additions should still stay boring:

- authentication for multiple users,
- export/reporting,
- better filtering and archival views,
- stricter audit trails for progress changes.
