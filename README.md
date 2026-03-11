# RewardPlay Packages

A game layer where members earn and spend rewards: bag, shop, daily rewards, ranking, zones, and more. Two packages work together — **backend** (Laravel API) and **frontend** (Vue 3 UI) — so you can plug them into your app.

---

## What’s inside?

| Package | What it does |
|--------|----------------|
| **kennofizet/rewardplay-backend** | Laravel API: user data, bag, shop, daily rewards, ranking, zones, settings. Token-based auth. |
| **@kennofizet/rewardplay-frontend** | Vue 3 game UI: login, bag, shop, daily rewards, ranking, settings. You pass **coreUrl**, **backendUrl**, and **token** to mount it. |

You need both: the backend serves the API; the frontend talks to it using a **core** API URL (zones, auth check) and a **RewardPlay** API URL (game data).

---

## Requirements

- **Backend:** PHP 8.2+, Laravel 12.x, Composer 2.x  
- **Frontend:** Node.js 16+, Vue 3 (^3.2.0)

---

## Quick start

### 1. Backend (Laravel app)

```bash
composer require kennofizet/rewardplay-backend
php artisan vendor:publish --tag=rewardplay-migrations
php artisan vendor:publish --tag=rewardplay-config
php artisan rewardplay:publish-images
php artisan rewardplay:export-constants
php artisan rewardplay:publish-constants
php artisan migrate
```

Set your app URL and RewardPlay config in `config/rewardplay.php` or `.env`, then:

```bash
php artisan config:clear
```

Details: [packages/backend/README.md](packages/backend/README.md)

### 2. Frontend (Vue 3 app)

```bash
npm install @kennofizet/rewardplay-frontend
```

Mount RewardPlay with **coreUrl**, **backendUrl**, and **token**:

```js
rewardPlayApp.use(RewardPlay, {
  coreUrl: 'https://your-app.com/api/knf',           // Core API (zones, auth check)
  backendUrl: 'https://your-app.com/api/knf/rewardplay',  // RewardPlay API
  token: yourRewardPlayToken,
})
```

Full setup: [packages/frontend/README.md](packages/frontend/README.md)

---

## How to see it working

In this repo you’ll find a **____TEST** folder with a test backend and frontend that use these packages. Run that app to see RewardPlay in action and copy the same pattern (coreUrl, backendUrl, token) into your project.

---

## Repo structure

```
rewardplay-packages/
├── packages/
│   ├── backend/   → kennofizet/rewardplay-backend (Laravel)
│   └── frontend/  → @kennofizet/rewardplay-frontend (Vue 3)
├── package.json
└── README.md (this file)
```

- **Frontend:** [packages/frontend/README.md](packages/frontend/README.md) — install, mount, plugin options (coreUrl, backendUrl, token).  
- **Backend:** [packages/backend/README.md](packages/backend/README.md) — config, token, traits, commands, API.

---

## Dev commands (when working on the packages)

From repo root:

| Command | Description |
|--------|-------------|
| `npm install` | Install frontend dependencies |
| `npm run dev:frontend` | Dev build (frontend) |
| `npm run build:frontend` | Production build (frontend) |
| `npm run watch:frontend` | Watch and rebuild |

Backend: use Composer and Artisan in a Laravel app that requires this package.

---

## License

MIT (see [LICENSE](LICENSE) in the repo).
