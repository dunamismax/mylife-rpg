# QuestLog

QuestLog is now a narrow Django app for one person to log quests, recurring habits, and a single daily check-in. XP and levels remain as lightweight bookkeeping, but the product is no longer framed as a full life-RPG simulator.

## Product Shape

- Quests: create them, complete them once, and keep a durable record of when they were finished.
- Habits: define recurring habits, log completion by day, and keep a real streak/history trail.
- Daily check-in: keep one check-in per day with intention, trigger notes, reflection, and slip tracking.
- Progress: XP and level summarize logged work. They support the journal instead of dominating it.

This baseline is intentionally single-user. Authentication, teams, achievements, and game-like status systems are out of scope for this pass.

## Stack

- Python 3
- Django
- SQLite for the default local database
- Server-rendered HTML templates
- Plain CSS

## Quick Start

```bash
uv venv
uv pip install -r requirements.txt
cp .env.example .env
uv run python manage.py migrate
uv run python manage.py runserver
```

Open `http://127.0.0.1:8000/`.

## Common Commands

```bash
uv run python manage.py migrate
uv run python manage.py test
uv run python manage.py runserver
uv run python manage.py check
```

## Project Layout

```text
config/                 Django project settings and root URLs
journal/                Core app: models, forms, services, views, tests
templates/              Server-rendered templates
static/css/             Plain CSS
data/                   SQLite database location for local development
docs/                   Product and architecture notes
```

## Documentation

- [`docs/architecture.md`](docs/architecture.md)

## License

[MIT](LICENSE)
