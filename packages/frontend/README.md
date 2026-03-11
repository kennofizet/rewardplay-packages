# RewardPlay Frontend

Vue 3 UI for **RewardPlay**: login, bag, shop, daily rewards, ranking, and settings. It talks to two APIs — **Core** (zones, auth check) and **RewardPlay** (game data) — so you pass **coreUrl**, **backendUrl**, and **token** when mounting.

---

## Install

```bash
npm i @kennofizet/rewardplay-frontend
```

**Peer dependency:** Vue 3 (`vue@^3.2.0`). Your app must provide Vue.

---

## Mount in 3 steps

### 1. Add a mount point (only when you have a token)

```html
<div v-show="initialized" id="rewardplay-mount-point"></div>
```

Show it only when `initialized` is true (e.g. after login), then mount in a `nextTick` after setting `initialized = true`. Use the same ID in `document.getElementById` below.

### 2. Get token and URLs

Your app must provide:

- **coreUrl** — Base URL of the Core API (e.g. `https://your-app.com/api/knf`). Used for auth check, zones, managed zones.
- **backendUrl** — Base URL of the RewardPlay API (e.g. `https://your-app.com/api/knf/rewardplay`). Used for user data, bag, shop, daily rewards, ranking, manifest, settings.
- **token** — RewardPlay token (from your backend; see rewardplay-backend README).

### 3. Create app and use the plugin

```js
import { createApp, ref, nextTick } from 'vue'
import RewardPlay, { RewardPlayPage } from '@kennofizet/rewardplay-frontend'

const initialized = ref(false)
let rewardPlayApp = null

async function initRewardPlay() {
  const coreUrl = 'https://your-app.com/api/knf'                    // from your config
  const backendUrl = 'https://your-app.com/api/knf/rewardplay'     // from your config
  if (!coreUrl?.trim() || !backendUrl?.trim()) return

  try {
    const token = await fetchYourRewardPlayToken()   // your API
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
    })

    rewardPlayApp.use(RewardPlay, {
      coreUrl: coreUrl.trim(),
      backendUrl: backendUrl.trim(),
      token,
    })

    rewardPlayApp.mount(mountPoint)
  } catch (err) {
    initialized.value = false
    // handle error
  }
}

// e.g. onMounted or after login
onMounted(() => {
  initRewardPlay()
})
```

---

## Plugin options (all required)

| Option | Type | Description |
|--------|------|-------------|
| `coreUrl` | string | Base URL of Core API (zones, auth check). |
| `backendUrl` | string | Base URL of RewardPlay API (game data, manifest). |
| `token` | string | RewardPlay auth token. |

All three are required: `app.use(RewardPlay, { coreUrl, backendUrl, token })`.

---

## Vite: same Vue instance

If you mount RewardPlay in a separate `createApp(RewardPlayPage)`, add the package to Vite so it shares the same Vue instance and `inject('gameApi')` works:

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@kennofizet/rewardplay-frontend'],
  },
}
```

---

## RewardPlayPage props (optional)

| Prop | Type | Default | Description |
|------|------|--------|-------------|
| `imageUrls` | Array | `[]` | URLs for image manifest/assets |
| `scriptUrls` | Array | `[]` | Script URLs to load |
| `stylesheetUrls` | Array | `[]` | CSS URLs |
| `fontUrls` | Array | `[]` | Font URLs |
| `backgroundImage` | string | null | Background image URL |
| `language` | string | `'en'` | `'en'` or `'vi'` |
| `rotate` | boolean | true | Auto-rotate in portrait |
| `customStyles` | Object | `{}` | Extra CSS variables |

---

## Backend and token

- **Token:** Your host app gets the RewardPlay token from your backend (see **kennofizet/rewardplay-backend** README).
- **URLs:** Core and RewardPlay can live on the same app; just pass the correct base paths for `coreUrl` and `backendUrl`.

---

## Exports

- **default** — Plugin: `app.use(RewardPlay, { coreUrl, backendUrl, token })`
- **RewardPlayPage** — Root component to mount
- **createGameApi**, **installGameModule**, **ComingSoonPage**, **LoadingSource**, **LoginScreen**
- **ResourceLoader**, **useResourceLoader**, constants helpers, **createTranslator**, **translations**

---

## Development (editing the package)

From the **rewardplay-packages** repo root: `npm install`, then `npm run dev:frontend` or `npm run build:frontend`. Package entry is `src/index.js`.
