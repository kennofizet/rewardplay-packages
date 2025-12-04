# RewardPlay Packages

A monorepo containing frontend and backend packages for RewardPlay - an entertainment platform where members can exchange rewards and play games.

## What is This Project?

This repository contains two reusable packages:

1. **Frontend Package** (`@company/rewardplay-frontend`) - A Vue.js 3 component library for the RewardPlay game interface
2. **Backend Package** (`company/rewardplay-backend`) - A Laravel 12 package providing the API and business logic for RewardPlay

Both packages are designed to be installed in any project that needs RewardPlay functionality, allowing you to reuse the game system across multiple applications.

## Quick Start

### Prerequisites

**Frontend Package:**
- Node.js 16+
- Vue.js 3.2.0+ (Vue 2 is NOT supported)
- Vuetify 3.0+

**Backend Package:**
- PHP 8.2+
- Laravel 12.x (Laravel 11 or earlier is NOT supported)
- Composer 2.x

### Installation

#### Option 1: Monorepo Setup (Recommended)

1. **Clone and setup the monorepo:**
   ```bash
   git clone <repository-url>
   cd rewardplay-packages
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   composer install
   ```

4. **Build frontend package:**
   ```bash
   npm run build:frontend
   ```

#### Option 2: Install in Your Project

**Frontend Package:**
```bash
npm install @company/rewardplay-frontend vue@^3.2.30
```

**Backend Package:**
```bash
composer require company/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations
php artisan vendor:publish --tag=rewardplay-config
php artisan rewardplay:publish-images
php artisan migrate
```

## Usage

### Frontend Package

```javascript
import { createApp } from 'vue'
import RewardPlay from '@company/rewardplay-frontend'

const app = createApp({})

// Get token from your authentication system
const rewardPlayToken = user.rewardPlayToken // or however you store it

app.use(RewardPlay, {
  backendUrl: 'https://api.example.com',
  token: rewardPlayToken // Required: RewardPlay token
})

app.mount('#app')
```

### Backend Package

Configure in your `.env`:
```env
REWARDPLAY_TABLE_USER=users
REWARDPLAY_TOKEN_NAME=rewardpay_token
REWARDPLAY_API_PREFIX=api/rewardplay
```

**Important:** After publishing config, clear cache:
```bash
php artisan config:clear
```

The package will:
- Add a token column to your users table (via migration)
- Generate tokens for existing users automatically
- Register routes at `/api/rewardplay/*`
- Provide a demo API endpoint
- Publish default images to `public/rewardplay-images/` (configurable)

See `packages/backend/README.md` for detailed documentation including:
- Token management
- Default images publishing
- Configuration options

## Project Structure

```
rewardplay-packages/
├── packages/
│   ├── frontend/          # Frontend Vue.js package
│   └── backend/           # Backend Laravel package
├── package.json           # NPM workspaces config
├── composer.json          # Composer path repository config
└── README.md
```

## Features

- **Token-based Authentication** - Secure token system for user authentication
- **Demo API Endpoint** - Example API endpoint to demonstrate token validation
- **Automatic Token Generation** - Tokens are automatically generated for existing users during migration

## Version Requirements

### Frontend
- **Vue.js 3.2.0+** (REQUIRED - Vue 2 is NOT supported)
- Uses Composition API, `<script setup>`, and Vue 3 features

### Backend
- **Laravel 12.x** (REQUIRED - Laravel 11 or earlier is NOT supported)
- **PHP 8.2+** (Laravel 12 requirement)

See `VERSION_REQUIREMENTS.md` for detailed version information and migration guides.

## Development

### Frontend Development
```bash
npm run dev:frontend      # Development build
npm run build:frontend    # Production build
npm run watch:frontend    # Watch for changes
```

### Backend Development
The backend package is symlinked, so changes reflect immediately in your main Laravel project.

## License

[Your License Here]

