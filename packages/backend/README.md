# kennofizet/rewardplay-backend

Laravel backend package for **RewardPlay**: API for user data, bag, shop, daily rewards, ranking, and game settings (zones, items, events, shop items, etc.). Uses token-based auth; frontend uses `@kennofizet/rewardplay-frontend` with this API.

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

Edit `config/rewardplay.php` or set in `.env`:

```env
REWARDPLAY_TABLE_USER=users
REWARDPLAY_USER_SERVER_ID_COLUMN=branch_id
REWARDPLAY_TABLE_PREFIX=
REWARDPLAY_API_PREFIX=api/rewardplay
REWARDPLAY_RATE_LIMIT=60
REWARDPLAY_IMAGES_FOLDER=rewardplay-images
REWARDPLAY_CONSTANTS_FOLDER=rewardplay-constants
REWARDPLAY_CUSTOM_GLOBAL_IMAGES_FOLDER=custom/global
REWARDPLAY_ALLOW_CORS_FOR_FILES=true
```

After changing config:

```bash
php artisan config:clear
```

---

## How to Use

### Token for frontend

Your app must issue a RewardPlay token for the logged-in user. The frontend sends it as header `X-RewardPlay-Token` on every request.

**Create or refresh token:**

```php
use Kennofizet\RewardPlay\Services\TokenService;

$tokenService = app(TokenService::class);
$token = $tokenService->createOrRefreshToken($user->id);
```

Return this `$token` to your frontend (e.g. after login) so it can pass it when mounting RewardPlay.

### API authentication

All RewardPlay API routes expect the token in the header:

```
X-RewardPlay-Token: {token}
```

Without a valid token, requests return 401.

### User model in your app

RewardPlay expects a **User** model whose table name is `config('rewardplay.table_user')` (default `users`) and whose primary key is `id`. The package provides a **User** model; if you use your own, either:

- Use the package’s `User` and configure table name, or  
- Ensure your User model is compatible (table, `id`, and any columns used by RewardPlay).

To give your User model token helpers, use the **HasRewardPlayToken** trait (see [Traits](#traits)).

---

## Traits

Use these traits in your app or in package commands/controllers.

### HasRewardPlayToken (User model)

Add to your **User** model so you can get/refresh a RewardPlay token from the user instance:

```php
use Kennofizet\RewardPlay\Traits\HasRewardPlayToken;

class User extends Model
{
    use HasRewardPlayToken;
}
```

Then:

- `$user->getRewardplayToken()` – returns existing token or creates one.
- `$user->refreshRewardplayToken()` – creates/refreshes token and returns it.

Use these in your login or “get game token” endpoint to pass the token to the frontend.

Methods:

- `apiResponseWithContext($data, $message, $status)` – JSON success response with `datas`.
- `apiErrorResponse($message, $status, $errors)` – JSON error response.
- `getImageFullUrl(?string $imagePath)` – full URL for a relative image path.

### SettingRewardPlay (Zones / Server managers)

Use in **artisan commands** or classes that manage zones and server managers:

```php
use Kennofizet\RewardPlay\Traits\SettingRewardPlay;

class MyCommand extends Command
{
    use SettingRewardPlay;

    public function handle()
    {
        $zones = $this->getZones();
        $this->createZone(['name' => 'Zone 1', ...]);
        $this->editZone($zoneId, [...]);
        $this->deleteZone($zoneId);
        // Server manager methods from ServerManagerTrait
    }
}
```

Provides zone CRUD and server-manager helpers (via `ZoneTrait` and `ServerManagerTrait`).

### ManagesZonesRewardPlay

Used together with **SettingRewardPlay** and **GlobalDataTrait** in the package’s `rewardplay:manage` command. You can use it in your own commands if you extend the same flow.

---

## Custom Commands

| Command | Description |
|--------|-------------|
| `php artisan rewardplay:export-constants` | Export PHP constants to JS file for frontend. Generates `Assets/constant/rewardplay-constants.js`. Use `--output=/path` for custom path. |
| `php artisan rewardplay:publish-constants` | Copy constants JS (and folder) to `public/{constants_folder}`. Use `--force` to overwrite. |
| `php artisan rewardplay:publish-images` | Copy default images to `public/{images_folder}`. Use `--force` to overwrite. |
| `php artisan rewardplay:manage` | Interactive CLI: select server, manage zones, server managers, generate fake data. Uses GlobalDataTrait, SettingRewardPlay, ManagesZonesRewardPlay. |
| `php artisan rewardplay:snapshot-ranking` | Snapshot coin/level/power for leaderboards (day/week/month/year). Use `--zone=1` for one zone, or omit for all zones. Schedule via cron. |

**Typical workflow for frontend constants:**

```bash
php artisan rewardplay:export-constants   # Generate JS from PHP
php artisan rewardplay:publish-constants # Publish to public (add --force to overwrite)
```

---

## Updating the Package Version

When you upgrade to a new version that has migrations or asset changes:

1. **Publish and migrate (use `--force` when you want to overwrite):**

```bash
composer update kennofizet/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations --force
php artisan vendor:publish --tag=rewardplay-config --force
php artisan rewardplay:publish-images --force
php artisan rewardplay:export-constants
php artisan rewardplay:publish-constants --force
php artisan migrate
```

2. **Clear caches:**

```bash
php artisan config:clear
php artisan cache:clear
```

So: run the same publish steps as in [Installation](#installation), with `--force` where needed, plus `rewardplay:export-constants`, `rewardplay:publish-constants` (with `--force`), and `migrate` (with `--force` if required in your environment).

---

## API Endpoints (under `api/rewardplay`)

- **Auth:** `GET /auth/check`, `GET /auth/user-data`
- **Player:** `GET /player/bag`, `POST /player/bag/gears`, `POST /player/bag/open-box`, `GET /player/shop`, `POST /player/shop/purchase`, `GET /player/daily-rewards`, `POST /player/daily-rewards/collect`, `GET /player/zones`, `GET /player/events`, `GET /player/custom-images`, `GET /player/managed-zones`
- **Ranking:** `GET /ranking`
- **Manifest:** `GET /manifest`
- **Settings (manager):** setting-items, setting-shop-items, setting-events, setting-stack-bonuses, setting-daily-rewards, setting-level-exps, zones, setting-options, setting-item-sets, setting-stats-transforms, stats

All player/settings routes require header `X-RewardPlay-Token`.

---

## Images and Constants

- **Images:** `php artisan rewardplay:publish-images` copies package images to `public/{images_folder}`. Custom global images go in `public/{images_folder}/{custom_global_images_folder}/` and are included in the manifest.
- **Constants:** Run `rewardplay:export-constants` then `rewardplay:publish-constants` so the frontend can load the same constants (e.g. from `public/rewardplay-constants/rewardplay-constants.js`).

---

## Middleware and Token Status

- Routes use token validation middleware: check `X-RewardPlay-Token`, load user, attach `rewardplay_user_id` (and optionally zone/manager info) to the request.
- Tokens have `is_active`: `1` = active, `0` = inactive (auth blocked).

---

## Support

For issues or questions, see the package source or contact support.
