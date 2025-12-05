# RewardPlay Backend Package

## Installation

```bash
composer require kennofizet/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations
php artisan vendor:publish --tag=rewardplay-config
php artisan rewardplay:publish-images
```

## Configuration

After publishing the config, edit `config/rewardplay.php`:

```php
'table_user' => env('REWARDPLAY_TABLE_USER', 'users'),
```

**IMPORTANT:** After changing the config, clear the config cache:
```bash
php artisan config:clear
```

## Migration

Run the migration to add the token column to your users table:

```bash
php artisan migrate
```

The migration will:
1. Check if the token column already exists (from config)
2. If found, return an error and stop
3. If not found, create the column after the `id` column
4. Generate tokens for all existing users automatically

**Note:** Old users will have tokens created automatically during migration.

## Token Management

### Creating/Refreshing Token for User

When creating a new user, you need to generate a token for them:

```php
use Kennofizet\RewardPlay\Services\TokenService;

$tokenService = app(TokenService::class);
$token = $tokenService->createOrRefreshToken($user->id);
```

### Using in User Model

Add this to your `User` model:

```php
use Kennofizet\RewardPlay\Services\TokenService;

class User extends Authenticatable
{
    // ... existing code ...

    /**
     * Get RewardPlay token
     */
    public function getRewardPlayToken()
    {
        $tokenService = app(TokenService::class);
        $token = $tokenService->getToken($this->id);
        
        // If token doesn't exist, create one
        if (!$token) {
            $token = $tokenService->createOrRefreshToken($this->id);
        }
        
        return $token;
    }

    /**
     * Refresh RewardPlay token
     */
    public function refreshRewardPlayToken()
    {
        $tokenService = app(TokenService::class);
        return $tokenService->createOrRefreshToken($this->id);
    }
}
```

### Usage Example

```php
// Get token for user
$token = $user->getRewardPlayToken();

// Refresh token
$newToken = $user->refreshRewardPlayToken();
```

## Middleware

The package includes middleware that automatically:
- Validates the `X-RewardPlay-Token` header
- Checks if the user exists in the database
- Attaches the user ID to the request as `rewardplay_user_id`

All routes are protected by this middleware automatically.

## Rate Limiting

All API endpoints are rate-limited per token. Default: **60 requests per minute**.

You can configure this in your `.env`:
```env
REWARDPLAY_RATE_LIMIT=60
```

When the rate limit is exceeded, the API will return a `429 Too Many Requests` response.

## API Usage

The package provides a demo API endpoint that validates the token:

```
GET /api/rewardplay/demo
Headers: X-RewardPlay-Token: {token}
```

**Response:**
```json
{
    "message": "Demo API endpoint",
    "user_id": 1,
    "status": "success"
}
```

**Error Responses:**
- `401 Unauthorized` - Token missing or invalid
- `404 Not Found` - User not found
- `429 Too Many Requests` - Rate limit exceeded

## Accessing User ID in Controllers

The middleware automatically attaches the user ID to the request attributes (secure, cannot be overridden). You can access it in your controllers:

```php
public function index(Request $request)
{
    $userId = $request->attributes->get('rewardplay_user_id');
    // Use $userId...
}
```

**Security Note:** The user ID is stored in request attributes, not input, so it cannot be overridden by user input. This prevents users from impersonating other users.

## Token Active Status

The package includes a `token_active` column to control token status:
- `1` = Active (default)
- `0` = Inactive

When a token is inactive, authentication will fail even if the token is valid.

### Migration

Run the migration to add the `token_active` column:

```bash
php artisan migrate
```

The migration will:
1. Add `token_active` column (default: 1)
2. Set all existing tokens as active (1)

## API Endpoints

### Authentication Check (Public)

```
POST /api/rewardplay/auth/check
Headers: X-RewardPlay-Token: {token}
```

**Response (Success):**
```json
{
    "success": true,
    "user": {
        "id": 1
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Invalid or inactive token"
}
```

### Demo Endpoint (Protected)

```
GET /api/rewardplay/demo
Headers: X-RewardPlay-Token: {token}
```

## Default Images

The package includes a default images folder that can be published to your project's public directory.

### Publishing Images

You can publish default images using either method:

**Method 1: Using the custom command (Recommended)**
```bash
php artisan rewardplay:publish-images
```

**Method 2: Using Laravel's vendor publish**
```bash
php artisan vendor:publish --tag=rewardplay-images
```

**Force overwrite existing files:**
```bash
php artisan rewardplay:publish-images --force
```

### Configuring Images Folder Name

By default, images are published to `public/rewardplay-images/`. You can change this by:

**Option 1: Environment variable (`.env`)**
```env
REWARDPLAY_IMAGES_FOLDER=my-custom-images
```

**Option 2: Config file (`config/rewardplay.php`)**
```php
'images_folder' => 'my-custom-images',
```

After changing the config, run:
```bash
php artisan config:clear
php artisan rewardplay:publish-images
```

### Adding Default Images

To add default images to the package:

1. Place your images in: `packages/backend/src/Assets/images/`
2. Run the publish command in your project:
   ```bash
   php artisan rewardplay:publish-images
   ```

Images will be available at: `/{images_folder}/your-image.jpg`

**Example:**
- If `REWARDPLAY_IMAGES_FOLDER=rewardplay-images` (default)
- Image path: `/rewardplay-images/background.jpg`

### Image Structure

```
packages/backend/src/Assets/images/
├── .gitkeep
├── background.jpg
├── logo.png
└── icons/
    └── icon.svg
```

After publishing, the structure in your project will be:
```
public/rewardplay-images/
├── background.jpg
├── logo.png
└── icons/
    └── icon.svg
```

## Environment Variables

Add to your `.env`:

```env
REWARDPLAY_TABLE_USER=users
REWARDPLAY_API_PREFIX=api/rewardplay
REWARDPLAY_RATE_LIMIT=60
REWARDPLAY_IMAGES_FOLDER=rewardplay-images
```

