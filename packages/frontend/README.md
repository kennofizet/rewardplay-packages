# @kennofizet/rewardplay-frontend

Vue 3 frontend package for **RewardPlay**: game UI (bag, shop, daily reward, ranking, settings) that talks to the RewardPlay backend API.

## What This Package Is

- **Vue 3 component library** for the RewardPlay game interface (login, loading, bag/gear, shop, daily rewards, ranking, manage settings).
- **Token-based**: you pass a backend URL and token; the package uses them for all API calls.
- **Embeddable**: mount it in a host app inside a div (e.g. after login or when entering the game section).
- Backend API, auth, and data format are defined in **@kennofizet/rewardplay-backend**. Use that package (or its docs) for token, endpoints, and data structures.

## Installation

```bash
npm i @kennofizet/rewardplay-frontend
```

**Peer dependency:** Vue 3 (`vue@^3.2.0`). The host project must provide Vue.

## Setup: Mount Point and Initialization

### 1. Mount point in template

Render a stable DOM node only when you are ready to mount RewardPlay (e.g. after you have a token):

```html
<div v-show="initialized" id="rewardplay-mount-point"></div>
```

- Use `v-show="initialized"` (or `v-if`) so the element exists only when `initialized` is true, then mount in a `nextTick` after setting `initialized = true`.
- The ID (`rewardplay-mount-point`) is what you pass to `document.getElementById` before mounting.

### 2. Initialize and mount in your app

Example (Vue 3 Composition API with `createApp`):

```js
import { createApp, ref, nextTick } from 'vue'
import RewardPlay, { RewardPlayPage } from '@kennofizet/rewardplay-frontend'

const initialized = ref(false)
let rewardPlayApp = null

async function initialize() {
  const backendUrl = 'https://your-backend.com'   // from your config
  if (!backendUrl?.trim()) {
    // handle error
    return
  }

  try {
    const token = await fetchToken()   // get token from your backend (see rewardplay-backend)
    initialized.value = true
    await nextTick()

    const mountPoint = document.getElementById('rewardplay-mount-point')
    if (!mountPoint) {
      initialized.value = false
      return
    }

    rewardPlayApp = createApp(RewardPlayPage, {
      imageUrls: [],
      scriptUrls: [],
      stylesheetUrls: [],
      fontUrls: [],
      backgroundImage: null,
      language: 'vi',   // 'en' | 'vi'
      // enableUnzip: true,  // if your RewardPlayPage supports it
    })

    rewardPlayApp.use(RewardPlay, {
      backendUrl: backendUrl.trim(),
      token,
    })

    rewardPlayApp.mount(mountPoint)
  } catch (err) {
    initialized.value = false
    // handle err
  }
}

// e.g. in onMounted or after login
onMounted(() => {
  initialize()
})
```

### 3. Plugin options (required)

| Option      | Type   | Description                    |
|------------|--------|--------------------------------|
| `backendUrl` | string | Base URL of RewardPlay API     |
| `token`      | string | RewardPlay auth token          |

Both are required when calling `app.use(RewardPlay, { backendUrl, token })`.

### 4. Vite: optimizeDeps

If you mount RewardPlay in a separate app with `createApp(RewardPlayPage).use(RewardPlay, { backendUrl, token }).mount(...)`, add the package to Vite’s `optimizeDeps.include` so it uses the same Vue instance and `inject('gameApi')` works:

```js
// vite.config.js (or vite.config.ts)
export default {
  // ...
  optimizeDeps: {
    include: ['@kennofizet/rewardplay-frontend'],
    // ... rest of your config
  },
}
```

Without this, dev and build can end up with a different Vue instance for the package and `gameApi` may be missing (e.g. “gameApi.... is not a function”)

### 5. RewardPlayPage root props (optional)

| Prop             | Type   | Default | Description                    |
|------------------|--------|--------|--------------------------------|
| `imageUrls`      | Array  | `[]`   | URLs for image manifest/assets |
| `scriptUrls`     | Array  | `[]`   | Script URLs to load            |
| `stylesheetUrls` | Array  | `[]`   | CSS URLs                       |
| `fontUrls`       | Array  | `[]`   | Font URLs                      |
| `backgroundImage`| string | null   | Background image URL           |
| `language`       | string | `'en'` | UI language: `'en'` or `'vi'`  |
| `rotate`         | boolean| true   | Auto-rotate in portrait        |
| `customStyles`    | Object | `{}`   | Extra inline/CSS variables     |

## Backend and data

- **Token**: Your host app must obtain the RewardPlay token (e.g. from your own backend that talks to RewardPlay). How to issue/validate the token and which endpoints to call is defined in **@kennofizet/rewardplay-backend**.
- **API**: The frontend calls endpoints under `backendUrl` (e.g. `/api/rewardplay/auth/user-data`, `/api/rewardplay/player/shop`, etc.). Base URL, routes, and response shapes are documented in the backend package.
- For API contracts, env vars, and server setup, read **@kennofizet/rewardplay-backend** (or the backend README in the same repo).

## Exports

- **default**: plugin object `{ install }` — use with `app.use(RewardPlay, { backendUrl, token })`.
- **RewardPlayPage**: root Vue component to mount.
- **installGameModule**, **createGameApi**, **RewardPlayPage**, **ComingSoonPage**, **LoadingSource**, **LoginScreen**.
- Utilities: **ResourceLoader**, **useResourceLoader**, constants helpers, **createTranslator**, **translations**.

## Development

If you work inside the repo (e.g. `rewardplay-packages`):

- Dependencies are usually installed at the **root** of the repo: `npm install` at root.
- The package entry is `src/index.js`; the host can resolve source directly (no build step required for development).
- For a production build of the frontend package, run `npm run production` in this package (output in `dist/`).
