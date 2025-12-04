# RewardPlay Frontend Package

Vue.js 3 component library for RewardPlay game interface.

## Installation

**Important:** This package is part of an npm workspace. Dependencies are installed at the **root level**, not in this directory.

### From Root (Recommended)
```bash
cd ../..  # Go to monorepo root
npm install
```

### From Package Directory
```bash
npm install
```
This will install dependencies, but they'll be hoisted to the root `node_modules/` (this is normal for workspaces).

## What `npm install` Does

When you run `npm install` in this package:

1. ✅ Installs dependencies listed in `package.json`
2. ✅ Creates/updates `node_modules/` at the **root level** (not here)
3. ❌ Does NOT create local `node_modules/` (workspace hoisting)
4. ❌ Does NOT build or create dist files
5. ❌ Does NOT modify source files

**This is normal!** npm workspaces hoist dependencies to the root to avoid duplication.

## Development

For local development (like in the test environment), the package uses source files directly from `src/`. No build step is required.

The `package.json` is configured to point to `src/index.js` for local development, so Vite can resolve the source files directly.

## Building for Production

If you need to build the package for distribution:

```bash
npm run production
```

This will create built files in the `dist/` directory using Laravel Mix.

## Local Development Setup

When using this package locally (via `file:` in package.json), Vite will resolve the source files directly. No build needed!

## Where Are My Dependencies?

Dependencies are installed at:
```
rewardplay-packages/node_modules/  (root level)
```

Not at:
```
packages/frontend/node_modules/  (doesn't exist - this is normal!)
```
