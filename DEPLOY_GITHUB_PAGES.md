# Blunder — Deploying to GitHub Pages

This app is a 100% client-side React build that uses `localStorage` only. No backend, no environment variables required. It works on any free static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## What's already configured for you
- `frontend/package.json` has `"homepage": "."` so the build emits **relative** asset paths — it works at any URL subpath (`yourname.github.io/blunder/` etc.).
- `frontend/src/App.js` uses `HashRouter` — GitHub Pages doesn't support client-side `BrowserRouter` deep-links by default, so `#`-style routes are safer.
- No `.env` is required for the build. The app does not call any backend.

## Quick deploy to GitHub Pages

### Option A — Using `gh-pages` branch (recommended)

1. From your repo root:
   ```bash
   cd frontend
   yarn install
   yarn build
   ```
   The static site is now in `frontend/build/`.

2. Push the `build/` folder to a `gh-pages` branch. Easiest with the `gh-pages` package:
   ```bash
   yarn add -D gh-pages
   ```
   Then add to `frontend/package.json` scripts:
   ```json
   "deploy": "gh-pages -d build"
   ```
   Run:
   ```bash
   yarn build && yarn deploy
   ```

3. In GitHub → Settings → Pages → set **Source: `gh-pages` branch / root**. After ~1 minute your site is live at:
   `https://<your-username>.github.io/<your-repo>/`

### Option B — GitHub Actions

Create `.github/workflows/deploy.yml` in your repo:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: corepack enable && cd frontend && yarn install --frozen-lockfile && yarn build
      - uses: actions/upload-pages-artifact@v3
        with: { path: frontend/build }
      - uses: actions/deploy-pages@v4
```
In GitHub → Settings → Pages → set **Source: GitHub Actions**.

## Notes
- All edits are saved in the **browser's** localStorage. Different browsers / devices won't share data. Use Export → JSON to back up or share between branches.
- If you ever want to share recipes across devices automatically, you'd need a tiny backend (Firebase / Supabase work great as drop-ins).
