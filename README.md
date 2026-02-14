<p align="center">
  <img src="public/favicon.svg" alt="MyLife RPG logo" width="84" />
</p>

<p align="center">
  A Laravel + Livewire app that turns real-life goals into quests, habits, and RPG progression.
</p>

# MyLife RPG

MyLife RPG is a productivity game for people who want habit tracking to feel like character progression. You create quests and habits, complete them daily, gain XP, level up stats, and unlock achievements.

## Trust Signals

![PHP](https://img.shields.io/badge/PHP-8.4%2B-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![Livewire](https://img.shields.io/badge/Livewire-4-4E56A6)
![Pest](https://img.shields.io/badge/Tested_with-Pest_4-22C55E)
![License](https://img.shields.io/badge/License-MIT-blue)

## Quick Start

### Prerequisites

- PHP 8.4+
- Composer 2+
- Node.js 22+ (matches CI)
- npm 10+
- SQLite (default) or MySQL/PostgreSQL

### Run

```bash
git clone <your-repo-url> mylife-rpg
cd mylife-rpg
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate
composer dev
```

Expected result:

- App is available at `http://localhost:8000`
- Health check responds at `http://localhost:8000/up`
- Home page shows the MyLife RPG landing screen

Optional local seed user:

```bash
php artisan db:seed
```

Default seeded login: `test@example.com` / `password`

## Features

- Quest tracking with completion state, XP rewards, and one-time reward protection.
- Habit tracking with daily streaks and one-time-per-day reward protection.
- RPG stat engine for XP, HP, level, and core attributes (STR, END, INT, WIS, CHA, WIL).
- Achievement unlocking based on quest completion and streak milestones.
- Active status effects panel with optional penalties and expiration support.
- Fortify-powered auth flow: registration, login/logout, password reset, email verification, and two-factor authentication.
- Settings screens for profile, password, appearance, and two-factor management.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Backend | [Laravel 12](https://laravel.com/docs/12.x) | Application framework, routing, auth middleware, Eloquent |
| Reactive UI | [Livewire 4](https://livewire.laravel.com/) | Server-driven reactive components |
| UI Components | [Flux UI Free](https://fluxui.dev/) | Shared UI primitives for forms, buttons, badges, layout |
| Authentication | [Laravel Fortify](https://laravel.com/docs/12.x/fortify) | Headless authentication and 2FA backend |
| Styling/Build | [Tailwind CSS 4](https://tailwindcss.com/) + [Vite 7](https://vite.dev/) | Styles and frontend asset bundling |
| Database | SQLite (default), MySQL, PostgreSQL, SQL Server | Persistent app state |
| Testing | [Pest 4](https://pestphp.com/) + PHPUnit 12 | Feature and unit test coverage |
| Code Style | [Laravel Pint](https://laravel.com/docs/12.x/pint) | Automated PHP formatting |

## Project Structure

```sh
mylife-rpg/
├── app/
│   ├── Livewire/RpgDashboard.php      # Core gameplay component (quests, habits, progression)
│   ├── Models/                        # User, Stat, Quest, Habit, Achievement, StatusEffect
│   └── Actions/Fortify/               # Registration and password reset actions
├── database/
│   ├── migrations/                    # Auth + RPG schema
│   ├── factories/                     # Model factories for tests/seeding
│   └── seeders/DatabaseSeeder.php     # Optional local seed data
├── resources/
│   ├── views/livewire/                # Dashboard UI
│   ├── views/pages/                   # Auth/settings pages
│   └── css + js                       # Vite entrypoints
├── routes/
│   ├── web.php                        # Home + dashboard routes
│   └── settings.php                   # Authenticated settings routes
├── tests/
│   ├── Feature/RpgDashboardTest.php   # RPG behavior tests
│   └── Feature/Auth/                  # Fortify auth flow tests
├── .github/workflows/                 # CI lint + test workflows
├── composer.json                      # PHP dependencies + workflow scripts
└── package.json                       # Frontend scripts and dependencies
```

## Development Workflow and Common Commands

### Setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Run

```bash
composer dev
```

### Test

```bash
php artisan test --compact
php artisan test --compact tests/Feature/RpgDashboardTest.php
```

### Lint and Format

```bash
composer lint
vendor/bin/pint --dirty --format agent
```

### Build

```bash
npm run build
```

### Deploy (Generic Laravel Flow)

```bash
php artisan down
npm run build
php artisan migrate --force
php artisan optimize
php artisan up
```

Command verification notes for this README rewrite:

- Verified in this environment: `php artisan --version`, `php artisan route:list`, `php artisan migrate --graceful --no-interaction`, `php artisan test --compact tests/Feature/RpgDashboardTest.php`, `npm run build`.
- Not executed in this rewrite: `composer dev`, full production deploy sequence.

## Deployment and Operations

This repository does not ship a platform-specific deployment manifest (no committed Docker/Kubernetes/Caddy config). Deploy as a standard Laravel app on your preferred platform.

- Build assets with `npm run build` before release.
- Run database changes with `php artisan migrate --force` during deploy.
- Use `GET /up` as a basic health endpoint.
- Use `php artisan pail` for live log tailing.
- Roll back the latest migration batch with `php artisan migrate:rollback` if needed.

## Security and Reliability Notes

- Authentication is implemented with Laravel Fortify (session-based auth, password reset, email verification, optional 2FA challenge).
- Dashboard access requires `auth` and verified email middleware.
- Settings routes enforce authentication; two-factor settings can require password confirmation.
- Data access uses Eloquent models and parameterized queries by default.
- Secrets are expected in environment files (`.env`), not hard-coded in source.
- Reliability guardrails include Pest feature tests and CI workflows for lint + tests.

## Documentation

| Path | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Repo-specific engineering and tooling guidance |
| [routes/web.php](routes/web.php) | Main web routes and dashboard entrypoint |
| [routes/settings.php](routes/settings.php) | Settings routes and middleware rules |
| [app/Livewire/RpgDashboard.php](app/Livewire/RpgDashboard.php) | Core gameplay logic |
| [tests/Feature/RpgDashboardTest.php](tests/Feature/RpgDashboardTest.php) | RPG workflow regression coverage |
| [.github/workflows/tests.yml](.github/workflows/tests.yml) | CI test pipeline definition |
| [.github/workflows/lint.yml](.github/workflows/lint.yml) | CI lint pipeline definition |

## Contributing

Contributions are welcome through pull requests.

1. Create a feature branch.
2. Run lint and tests locally (`composer lint` and `php artisan test --compact`).
3. Open a PR with a clear summary of behavior changes and test impact.

## License

Licensed under the [MIT License](LICENSE).
