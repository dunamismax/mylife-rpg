# MyLife RPG (Laravel + Livewire)

This repository now uses a Laravel 12 + Livewire 4 application located in `mylife/`.

## Stack

- PHP 8.4
- Laravel 12
- Livewire 4
- Flux UI (Livewire Flux)
- SQLite (default local), works with MySQL/PostgreSQL via `.env`

## Features

- Fortify-based authentication (register/login/logout/password reset/verification/2FA)
- RPG dashboard with:
  - Character stats (level, XP, HP, core attributes)
  - Quest tracking and completion
  - Habit tracking with streaks
  - Achievement unlocking
  - Active status effects display

## Run Locally

```bash
cd mylife
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev
php artisan serve
```

Visit: `http://127.0.0.1:8000`

## Test

```bash
cd mylife
php artisan test --compact
```
