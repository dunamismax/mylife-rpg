# Deployment Guide (Ubuntu + Caddy)

Last updated: February 15, 2026.

This guide documents how to self-host MyLife RPG on an Ubuntu server using Caddy as the public web server / reverse proxy and PHP-FPM to run Laravel.

## 1. Assumptions

- Ubuntu server with SSH access (examples target Ubuntu 24.04+).
- A DNS record for your domain pointing to the server.
- You will deploy to `/var/www/mylife-rpg`.
- You are deploying the `main` branch.

## 2. Server Prep

Update the system and install base tools:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git unzip ca-certificates lsb-release software-properties-common
```

Optional but recommended firewall setup:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 3. Install PHP 8.4, Composer, Node 22, and Caddy

Install PHP 8.4 and required extensions:

```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y \
  php8.4-fpm php8.4-cli php8.4-common php8.4-mbstring php8.4-xml php8.4-curl \
  php8.4-zip php8.4-sqlite3 php8.4-mysql php8.4-pgsql php8.4-bcmath php8.4-intl
```

Install Composer:

```bash
cd /tmp
curl -sS https://getcomposer.org/installer -o composer-setup.php
php composer-setup.php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

Install Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

Install Caddy:

```bash
sudo apt install -y caddy
sudo systemctl enable --now caddy
```

Enable PHP-FPM:

```bash
sudo systemctl enable --now php8.4-fpm
```

## 4. Deploy App Code

Create the app path and clone:

```bash
sudo mkdir -p /var/www
sudo chown -R "$USER":"$USER" /var/www
cd /var/www
git clone <your-repo-url> mylife-rpg
cd /var/www/mylife-rpg
```

Create production environment file:

```bash
cp .env.example .env
```

Set at least these values in `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.example

# Choose one DB driver and configure it:
DB_CONNECTION=sqlite
# DB_DATABASE=/var/www/mylife-rpg/database/database.sqlite

# or MySQL/PostgreSQL in production:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=...
# DB_USERNAME=...
# DB_PASSWORD=...
```

Important defaults already expected by this app:

- `SESSION_DRIVER=database`
- `CACHE_STORE=database`
- `QUEUE_CONNECTION=database`

## 5. Install Dependencies and Build

```bash
cd /var/www/mylife-rpg
composer install --no-dev --prefer-dist --optimize-autoloader
npm ci
npm run build
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan optimize
```

Notes:

- This repository’s `DatabaseSeeder` intentionally skips seeding in production.
- `/up` is available as a health endpoint (`bootstrap/app.php`).

## 6. File Permissions

Laravel must write to `storage` and `bootstrap/cache`:

```bash
cd /var/www/mylife-rpg
sudo chown -R "$USER":www-data /var/www/mylife-rpg
sudo find storage bootstrap/cache -type d -exec chmod 775 {} \;
sudo find storage bootstrap/cache -type f -exec chmod 664 {} \;
```

If you run PHP-FPM as another user/group, adjust accordingly.

## 7. Configure Caddy

Edit `/etc/caddy/Caddyfile`:

```caddy
your-domain.example {
    root * /var/www/mylife-rpg/public
    encode zstd gzip

    php_fastcgi unix//run/php/php8.4-fpm.sock
    file_server
}
```

Validate and reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy will automatically provision and renew TLS certificates when DNS is correct.

## 8. Queue Worker (systemd)

Because the app default is `QUEUE_CONNECTION=database`, run a worker service:

Create `/etc/systemd/system/mylife-rpg-queue.service`:

```ini
[Unit]
Description=MyLife RPG Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
RestartSec=5
WorkingDirectory=/var/www/mylife-rpg
ExecStart=/usr/bin/php /var/www/mylife-rpg/artisan queue:work database --sleep=3 --tries=3 --max-time=3600

[Install]
WantedBy=multi-user.target
```

Enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mylife-rpg-queue
sudo systemctl status mylife-rpg-queue
```

## 9. Scheduler (cron)

This app currently has no scheduled jobs defined, but Laravel scheduler wiring is still safe to install for future tasks:

```bash
crontab -e
```

Add:

```cron
* * * * * cd /var/www/mylife-rpg && php artisan schedule:run >> /dev/null 2>&1
```

## 10. Verification Checklist

Run these checks after deploy:

```bash
curl -I https://your-domain.example
curl -I https://your-domain.example/up
php artisan about
php artisan migrate:status
sudo systemctl status caddy php8.4-fpm mylife-rpg-queue
```

## 11. Ongoing Deploy Process

Use this sequence for updates:

```bash
cd /var/www/mylife-rpg
git fetch origin
git checkout main
git pull --ff-only origin main

composer install --no-dev --prefer-dist --optimize-autoloader
npm ci
npm run build

php artisan down --retry=60
php artisan migrate --force
php artisan optimize
php artisan queue:restart
php artisan up
```

## 12. Troubleshooting

- 502/blank page:
  - `sudo systemctl status php8.4-fpm caddy`
  - `sudo journalctl -u caddy -n 200 --no-pager`
- App errors:
  - `tail -n 200 storage/logs/laravel.log`
- Permissions errors:
  - re-run the permissions section above.
- Stale config/routes/views:
  - `php artisan optimize:clear && php artisan optimize`
