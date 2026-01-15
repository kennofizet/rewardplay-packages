# RewardPlay Backend Package

## Quick Start

### Installation

```bash
composer require kennofizet/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations
php artisan vendor:publish --tag=rewardplay-config
php artisan rewardplay:publish-images
php artisan migrate
```

### Configuration

Edit `config/rewardplay.php` or add to your `.env`:

```env
REWARDPLAY_TABLE_USER=users
REWARDPLAY_USER_SERVER_ID_COLUMN=branch_id
REWARDPLAY_TABLE_PREFIX=
REWARDPLAY_API_PREFIX=api/rewardplay
REWARDPLAY_RATE_LIMIT=60
REWARDPLAY_IMAGES_FOLDER=rewardplay-images
REWARDPLAY_CUSTOM_GLOBAL_IMAGES_FOLDER=custom/global
```

**Important:** After changing config, run:
```bash
php artisan config:clear
```

## Upgrading from Old Version

When upgrading to a new version that includes database changes:

### Step 1: Backup Your Data (Recommended)
```bash
# Export your database or backup important tables
# Especially if you have data in rewardplay_settings_items
```

### Step 2: Update Package
```bash
composer update kennofizet/rewardplay-backend
```

### Step 3: Publish New Migrations
```bash
php artisan vendor:publish --tag=rewardplay-migrations --force
```

### Step 4: Run Migrations
```bash
php artisan migrate
```

### Step 5: Publish Updated Images (if needed)
```bash
php artisan rewardplay:publish-images
# Or force overwrite:
php artisan rewardplay:publish-images --force
```

### Step 6: Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
```

## Features

### Token Management

Generate tokens for users:

```php
use Kennofizet\RewardPlay\Services\TokenService;

$tokenService = app(TokenService::class);
$token = $tokenService->createOrRefreshToken($user->id);
```

### API Authentication

All API routes require the `X-RewardPlay-Token` header:

```
GET /api/rewardplay/demo
Headers: X-RewardPlay-Token: {token}
```

### Setting Items (Game Items)

Manage game items with zones, images, and properties:

- **Create/Update Items:** With image uploads, zone assignment, and JSON properties
- **Zone Filtering:** Items are organized by zones
- **Image Storage:** Images saved to `public/{images_folder}/items/{zone_id}/{user_id}/`

## API Endpoints

### Authentication
- `POST /api/rewardplay/auth/check` - Check token validity
- `GET /api/rewardplay/auth/user-data` - Get user data

### Setting Items
- `GET /api/rewardplay/setting-items` - List items (with zone filter)
- `GET /api/rewardplay/setting-items/types` - Get item types
- `GET /api/rewardplay/setting-items/{id}` - Get single item
- `POST /api/rewardplay/setting-items` - Create item (with image upload)
- `PATCH /api/rewardplay/setting-items/{id}` - Update item
- `DELETE /api/rewardplay/setting-items/{id}` - Delete item

### Images
- `GET /api/rewardplay/manifest` - Get image manifest

## Images Management

### Publishing Images

```bash
php artisan rewardplay:publish-images
```

Images are published to `public/{images_folder}/` (default: `rewardplay-images`).

### Custom Global Images

Place custom images in `public/{images_folder}/{custom_global_images_folder}/` (default: `custom/global/`).

These images will:
- Override default global images with matching filenames
- Be included in the manifest API response
- Be cached for 5 minutes for performance

## Middleware

All routes are automatically protected by token validation middleware that:
- Validates `X-RewardPlay-Token` header
- Checks user existence
- Optionally reads zone column and attaches as `rewardplay_user_zone_id`

## Token Status

Tokens have an `is_active` status:
- `1` = Active (default)
- `0` = Inactive (blocks authentication)

## Support

For issues or questions, check the package documentation or contact support.
