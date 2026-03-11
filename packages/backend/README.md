# RewardPlay Backend

Laravel package that provides the **RewardPlay API**: user data, bag, shop, daily rewards, ranking, zones, and game settings. The frontend (`@kennofizet/rewardplay-frontend`) calls this API with a token.

---

## Installation

```bash
composer require kennofizet/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations
php artisan vendor:publish --tag=rewardplay-config
php artisan rewardplay:publish-images
php artisan rewardplay:export-constants
php artisan rewardplay:publish-constants
php artisan migrate
```

---

## Configuration

Use `config/rewardplay.php` or `.env`:

```env
REWARDPLAY_IMAGES_FOLDER=rewardplay-images
REWARDPLAY_CONSTANTS_FOLDER=rewardplay-constants
REWARDPLAY_CUSTOM_GLOBAL_IMAGES_FOLDER=custom/global
REWARDPLAY_ALLOW_CORS_FOR_FILES=true
```

Core-related options (user table, API prefix, rate limit) live in **packages-core** config. After any config change:

```bash
php artisan config:clear
```

---

## How the frontend connects

The frontend needs **two** base URLs:

1. **coreUrl** — Your core API (e.g. `https://your-app.com/api/knf`). Used for auth check, player zones, managed zones, zone CRUD. Comes from **packages-core**.
2. **backendUrl** — RewardPlay API (e.g. `https://your-app.com/api/knf/rewardplay`). Used for user data, bag, shop, daily rewards, ranking, settings, manifest.

So in the host app you pass both when mounting RewardPlay (see frontend README).

---

## Token (required by frontend)

Your app must issue a RewardPlay token for the logged-in user. The frontend sends it in the header `X-Knf-Token` on every request.

**Create or refresh token:**

```php
use Kennofizet\RewardPlay\Services\TokenService;

$tokenService = app(TokenService::class);
$token = $tokenService->createOrRefreshToken($user->id);
```

Return this `$token` to the frontend (e.g. after login) so it can pass it to `RewardPlay` with `coreUrl` and `backendUrl`.

All RewardPlay API routes require a valid token; otherwise they return 401.

---

## User model

RewardPlay expects a **User** model (table from config, primary key `id`). To add token helpers to your User model, use the **HasKnfCoreToken** trait:

```php
use Kennofizet\RewardPlay\Traits\HasKnfCoreToken;

class User extends Model
{
    use HasKnfCoreToken;
}
```

Then:

- `$user->getKnfCoreToken()` — existing token or create one  
- `$user->refreshKnfCoreToken()` — create/refresh and return token  

Use these in your login or “get game token” endpoint.

---

## Artisan commands

| Command | Description |
|--------|-------------|
| `rewardplay:export-constants` | Export PHP constants to JS for frontend. Use `--output=/path` for custom path. |
| `rewardplay:publish-constants` | Copy constants JS to `public/{constants_folder}`. Use `--force` to overwrite. |
| `rewardplay:publish-images` | Copy default images to `public/{images_folder}`. Use `--force` to overwrite. |
| `rewardplay:manage` | Interactive CLI: server, zones, managers, fake data. |
| `rewardplay:snapshot-ranking` | Snapshot ranking (day/week/month/year). Use `--zone=1` for one zone. Schedule via cron. |

Typical flow for frontend constants:

```bash
php artisan rewardplay:export-constants
php artisan rewardplay:publish-constants
```

---

## API overview (under your API prefix + `rewardplay`)

- **Auth:** `GET /auth/user-data`
- **Player:** bag, shop, daily-rewards, events, custom-images
- **Ranking:** `GET /ranking`
- **Manifest:** `GET /manifest`
- **Settings (manager):** setting-items, setting-shop-items, setting-events, stack-bonuses, daily-rewards, level-exps, zones, options, item-sets, stats-transforms, stats

All routes require header `X-Knf-Token`.

---

## Updating the package

After upgrading:

```bash
composer update kennofizet/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations --force
php artisan vendor:publish --tag=rewardplay-config --force
php artisan rewardplay:publish-images --force
php artisan rewardplay:export-constants
php artisan rewardplay:publish-constants --force
php artisan migrate
php artisan config:clear
php artisan cache:clear
```