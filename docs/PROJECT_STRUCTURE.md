# Project Structure

This document explains the layout, aliases, and tips for working in this repo.

## Top-level folders

- `app/` — Next.js App Router pages, routes, and route groups
- `components/` — Reusable UI components (co-located subfolders by domain)
- `contexts/` — React context providers and hooks
- `hooks/` — Reusable React hooks
- `integrations/` — Third-party integrations and adapters
- `lib/` — Core client-side libraries (e.g., Supabase client, services)
- `server/` — Node scripts and local dev orchestrators
- `scripts/` — One-off scripts (TypeScript/Node) for maintenance & setup
- `externals/` — External apps/modules (ignored by Next bundlers)
- `public/` — Static assets served by Next.js
- `docs/` — Documentation for contributors
- `apps/mobile/` — Expo React Native app that wraps the Next.js site with a WebView

## Path aliases

Aliases are configured in `tsconfig.json` and `jsconfig.json`.

- `@/*` → repository root
- `@app/*` → `app/*`
- `@components/*` → `components/*`
- `@contexts/*` → `contexts/*`
- `@hooks/*` → `hooks/*`
- `@integrations/*` → `integrations/*`
- `@lib/*` → `lib/*`
- `@server/*` → `server/*`
- `@utils/*` → `utils/*`
- `@public/*` → `public/*`

Prefer alias-based imports to avoid brittle relative paths, e.g.

```ts
import { supabase } from "@lib/supabaseClient";
import { SiteHeader } from "@components/site-header";
```

## Local development

- Start Next.js dev server with Turbopack:
  - `npm run dev`
- Start Next.js + LiveMeet concurrently:
  - `npm run dev:collab` (uses `server/index.js`)

- Start the native app wrapper (in a second terminal):
  - `npm run mobile` (Expo dev server)
  - `npm run mobile:ios` / `npm run mobile:android`

The dev orchestrator now points to the repo root for Next and `externals/LiveMeet` for the LiveMeet server.

## Environment variables

Define these in `.env.local` at the repo root:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Optional CLI:

```bash
SUPABASE_ACCESS_TOKEN=<token>
```

See `docs/SUPABASE_INTEGRATION.md` for details.

## Conventions

- Co-locate feature-specific components under `components/<feature>/` if it improves discoverability.
- Keep app route logic inside `app/` and reuse logic via `lib/` or `hooks/`.
- Avoid importing from `externals/` inside app code. Next is configured to ignore it.
- Mobile wrapper loads the site URL from `apps/mobile/app.json > expo.extra.WEB_URL`.

## Adding features

1. Create route under `app/feature/` or a route group
2. Add reusable UI under `components/feature/`
3. Share logic via `lib/` or `hooks/`
4. Use path aliases for imports
