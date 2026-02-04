# RewardPlay Packages

**RewardPlay** is a game layer where members earn and spend rewards: bag, shop, daily rewards, ranking, and more. This repository contains the **frontend** and **backend** as two installable packages you can plug into any app.

---

## What is this project?

This repository contains two **reusable packages** that work together:

| Package | Purpose |
|--------|---------|
| **@kennofizet/rewardplay-frontend** | Vue 3 game UI: login, bag/gear, shop, daily rewards, ranking, settings. Embeddable in your app with a backend URL + token. |
| **kennofizet/rewardplay-backend** | Laravel API and business logic: user data, bag, shop, daily rewards, ranking, zones, items, events. Token-based auth. |

Use them in **one app** (Laravel API + Vue frontend) or split (e.g. backend in Laravel, frontend in Nuxt/Next). Both are designed to be installed via npm/composer and configured in your project.

---

## Requirements

### Frontend (`@kennofizet/rewardplay-frontend`)

- **Node.js** 16+
- **Vue 3** (^3.2.0). Vue 2 is not supported.
- Your app provides Vue; the package is a Vue 3 component library.

### Backend (`kennofizet/rewardplay-backend`)

- **PHP** 8.2+
- **Laravel** 12.x
- **Composer** 2.x

---

## Quick start

### Install in your own project

**1. Backend (Laravel)**

```bash
composer require kennofizet/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations
php artisan vendor:publish --tag=rewardplay-config
php artisan rewardplay:publish-images
php artisan rewardplay:export-constants
php artisan rewardplay:publish-constants
php artisan migrate
```

Configure `config/rewardplay.php` or `.env` (e.g. `REWARDPLAY_TABLE_USER`, `REWARDPLAY_API_PREFIX`). Then:

```bash
php artisan config:clear
```

**2. Frontend (Vue 3 app)**

```bash
npm install @kennofizet/rewardplay-frontend
```

Mount RewardPlay with your backend URL and token (see [packages/frontend/README.md](packages/frontend/README.md) for mount point and `createApp` + `RewardPlay` plugin setup).

---

### Development (work on the packages)

If you clone this repo to change the packages themselves:

1. **Clone and enter the repo**

   ```bash
   git clone <repository-url>
   cd rewardplay-packages
   ```

2. **Frontend**

   ```bash
   npm install
   npm run dev:frontend    # or build:frontend, watch:frontend
   ```

   Dependencies are installed at the repo root; the frontend package lives in `packages/frontend`.

3. **Backend**

   Use Composer from the repo root or from `packages/backend` (e.g. `composer install` where your `composer.json` is). The backend is a Laravel package; for full API you’ll typically use it inside a Laravel app via `path` or published package.

---

## Project structure

```
rewardplay-packages/
├── packages/
│   ├── frontend/          # @kennofizet/rewardplay-frontend (Vue 3)
│   └── backend/           # kennofizet/rewardplay-backend (Laravel)
├── package.json           # NPM config (frontend package)
├── composer.json          # Composer config (if present)
└── README.md              # This file
```

- **Frontend:** [packages/frontend/README.md](packages/frontend/README.md) — install, mount point, plugin options, props.
- **Backend:** [packages/backend/README.md](packages/backend/README.md) — config, token, traits, commands, API overview.

---

## What you get

- **Token-based auth** — One RewardPlay token per user; frontend sends it as `X-RewardPlay-Token`.
- **Game API** — User data, bag, shop, daily rewards, ranking, zones, setting items, events, etc.
- **Embeddable UI** — Mount the Vue game UI in a div after login; pass backend URL + token.
- **Reusable** — Same frontend and backend packages across multiple projects.

---

## Development commands

From the repo root:

| Command | Description |
|--------|-------------|
| `npm install` | Install frontend dependencies |
| `npm run dev:frontend` | Development build (frontend) |
| `npm run build:frontend` | Production build (frontend) |
| `npm run watch:frontend` | Watch and rebuild on change |

Backend: use Artisan and Composer as usual inside your Laravel app that depends on this package.

---

## Support and docs

- **Frontend:** [packages/frontend/README.md](packages/frontend/README.md) — setup, mount, plugin, RewardPlayPage props.
- **Backend:** [packages/backend/README.md](packages/backend/README.md) — installation, config, traits, custom commands, upgrading.

For bugs or feature requests, open an issue in this repository.

---

## License

MIT (or see [LICENSE](LICENSE) in the repo).
