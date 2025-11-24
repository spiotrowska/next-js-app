<h1 align="center">StartupsLib</h1>
<p align="center">
	<a href="https://github.com/spiotrowska/next-js-app/actions/workflows/test.yml">
		<img alt="Tests" src="https://github.com/spiotrowska/next-js-app/actions/workflows/test.yml/badge.svg" />
	</a>
</p>
<p align="center">Pitch ideas. Get feedback. Grow startups – built with Next.js 16 App Router, Sanity, NextAuth, Tailwind & modern patterns.</p>

## Table of Contents

1. Overview
2. Tech Stack
3. Core Features
4. Architecture & Routing
5. Data Layer (Sanity)
6. Authentication (NextAuth + GitHub)
7. Theming & Fonts
8. Searching & Filtering
9. Startup Creation Flow (Server Actions)
10. Markdown Pitch & Editor Picks
11. View Counter & Increment on Read
12. Performance Techniques (Parallel Fetching, PPR)
13. Toast & UI System
14. Error Handling & Sentry
15. Development Setup
16. Environment Variables
17. Scripts
18. Deployment Notes
19. Testing & Coverage

---

## 1. Overview

StartupsLib is a small platform to submit, browse and evaluate startup pitches. It demonstrates modern Next.js 16 capabilities (App Router with Turbopack, server actions, streaming) together with Sanity CMS v4 for structured content, GitHub OAuth via NextAuth, and a minimal design system on Tailwind.

## 2. Tech Stack

- Framework: Next.js 16 App Router (with Turbopack)
- Language: TypeScript
- CMS: Sanity v4 (schema types + vision + markdown plugin)
- Auth: NextAuth v5 (GitHub provider) with session/JWT callbacks
- Styling: TailwindCSS + custom Radix UI primitives + local variable font
- Monitoring: Sentry (@sentry/nextjs) + `global-error.tsx`
- Validation: Zod v4
- Queries: groq v4
- Deployment: Vercel

## 3. Core Features

- Browse startups with search filtering.
- View detailed pitch rendered from markdown.
- Track view counts (increment after successful fetch via `after()` API).
- Create startups with validated form + server action.
- GitHub login creates or reuses `author` record.
- Editor Picks playlist curated via Sanity references.
- Dark/light theme persisted in a cookie (SSR no-flash).

## 4. Architecture & Routing

- App Router: top-level `app/layout.tsx` (fonts, theme, toaster) + sectional `(root)` layout with navbar.
- Dynamic routes: `startup/[id]`, `user/[id]` using server components.
- **Cache Components (Partial Prerendering)**: Enabled via `cacheComponents: true` in Next.js 16. All async data access wrapped in Suspense boundaries for optimal streaming and caching.
- Optional API route: `/api/theme` (legacy cookie persistence – current UI writes directly via Zustand store; kept for external or scripted theme updates).

## 5. Data Layer (Sanity)

- Schemas: `author`, `startup`, `playlist` (editor picks) under `sanity/schemaTypes`.
- Read client (`sanity/lib/client.ts`) uses CDN; write client (`write-client.ts`) disables CDN + token.
- GROQ queries centralized in `sanity/lib/queries.ts` and strongly typed by generated types (`sanity/typegen`).
- Seed content provided via NDJSON (see `sanity/seed/seed.ndjson`).
- Structure builder customizes Studio nav (`structure.ts`).

## 6. Authentication (NextAuth + GitHub)

- Config in `auth.ts` registers GitHub provider with `trustHost: true` for Next.js 16 compatibility.
- `signIn` callback ensures an `author` document exists (fetch by GitHub id; create if missing).
- `jwt` callback loads Sanity author `_id` -> `token.id`.
- `session` callback merges `token.id` into `session.user.id` for server actions and route decisions.
- Type augmentation in `next-auth.d.ts` (interface merging, not type overwrite).

## 7. Theming & Fonts

- State: Zustand store (`lib/theme-store.ts`) with `theme`, `setTheme`, `toggleTheme`, `initialize`.
- Persistence: `app-theme` cookie (`Path=/; Max-Age=1y; SameSite=Lax`).
- SSR: `app/layout.tsx` sets `<html class="dark">` if cookie = dark (no flash).
- Preference fallback: Uses `prefers-color-scheme: dark` when no cookie.
- Utilities: `lib/theme-utils.ts` (`getInitialTheme`, `readThemeCookie`, `prefersDarkMode`).
- Toggle: `ThemeToggle` calls `toggleTheme` (no network request).
- Fonts: Local Work Sans via `next/font/local` → `--font-work-sans` variable.

## 8. Searching & Filtering

- Landing page (`(root)/page.tsx`) reads `searchParams.query`.
- GROQ query applies match across title/category/author fields.
- Search form uses `<Form action="/">` (server action form) and a reset component to clear query.

## 9. Startup Creation Flow (Server Actions)

- Page `startup/create/page.tsx` checks auth; redirects if unauthenticated.
- `StartupForm` validates inputs with Zod before calling `createPitch` server action.
- `createPitch` generates slug (`slugify`), attaches author reference (`session.user.id`), writes to Sanity via `writeClient`.
- Action result triggers client navigation to new detail route.

## 10. Markdown Pitch & Editor Picks

- Pitch stored as markdown (`startup.pitch` schema type = markdown plugin).
- Rendered with `markdown-it` server-side to HTML inside detail page.
- Editor Picks loaded from `playlist` document referencing curated startups.

## 11. View Counter & Increment on Read

- Detail page fetches startup views (`STARTUP_VIEWS_QUERY`).
- `View` component increments value after response using `after()` and a patch mutation.
- Ensures accurate counts without blocking initial payload.

## 12. Performance Techniques (Parallel Fetching, PPR)

- `Promise.all` fetches the startup and editor picks concurrently.
- Suspense boundaries around view counter (skeleton fallback).
- Partial Prerendering streams slower data later to improve TTFB.

## 13. Toast & UI System

- Toast state machine (`hooks/use-toast.ts`) with capped queue and delayed removal.
- `Toaster` component renders mapped toasts with Radix primitives.
- Shared UI primitives (`button`, `input`, `textarea`, `avatar`, `skeleton`) using Tailwind + variants.

## 14. Error Handling & Sentry

- Global error boundary: `app/global-error.tsx` can capture and render fallback.
- Sentry SDK (@sentry/nextjs) integrated (config files present) for tracing runtime errors.
- Server actions wrap try/catch returning normalized error payloads.

## 15. Development Setup

```bash
npm install
npm run dev
```

- Uses TurboPack in dev (`next dev --turbopack`).
- Run `npm run typegen` to extract schema and generate TS types for GROQ results.
- Sanity Studio mounted at `/studio` route; requires env vars.

## 16. Environment Variables

| Variable                         | Purpose                            |
| -------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Sanity project id                  |
| `NEXT_PUBLIC_SANITY_DATASET`     | Dataset name (e.g. `production`)   |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version date                   |
| `SANITY_WRITE_TOKEN`             | Write token for mutations (server) |
| `GITHUB_ID` / `GITHUB_SECRET`    | GitHub OAuth credentials           |
| `SENTRY_DSN`                     | Sentry project DSN (optional)      |

## 17. Scripts

| Script          | Description                                          |
| --------------- | ---------------------------------------------------- |
| `dev`           | Start Next.js dev server (Turbopack by default)      |
| `build`         | Production build                                     |
| `start`         | Run built production app                             |
| `lint`          | ESLint checks with zero warnings allowed             |
| `typegen`       | Extract Sanity schema + generate GROQ TS types       |
| `predev`        | Ensures schema types up to date before `dev`         |
| `prebuild`      | Ensures schema types up to date before `build`       |
| `test`          | Run Jest test suite (passes even if none found)      |
| `test:watch`    | Jest in watch mode                                   |
| `test:coverage` | Jest with coverage + 100% enforced thresholds         |

## 18. Deployment Notes

- Set all required env vars on hosting provider (e.g. Vercel project settings).
- Ensure Sanity CORS includes deployment origin + local dev.
- Use canary Next.js; keep an eye on PPR experimental changes when upgrading.
- Sentry source maps: upload automatically via build step if configured.

## 19. Testing & Coverage

The project maintains a comprehensive test suite with 100% coverage across statements, branches, functions, and lines for all tracked source files.

### Stack & Configuration

- Runner: Jest (jsdom environment)
- Transformer: `ts-jest` with ESM enabled (`useESM: true`)
- Setup: Global test utilities in `jest.setup.ts`
- Coverage: Enforced 100% thresholds (global + per-path) via `coverageThreshold` in `jest.config.cjs`
- Collection: `collectCoverageFrom` targets `components/**/*.{ts,tsx}` and `lib/**/*.{ts,tsx}` excluding barrel `index.ts` files
- Ignored: Build output (`.next/`) and `node_modules` excluded by `testPathIgnorePatterns`

### Test Folder Structure

Component tests are grouped by component for clarity:

```
components/__tests__/
	Navbar/
		Navbar.actions.test.tsx
		Navbar.avatarBranches.test.tsx
		...
	StartupForm/
		StartupForm.branches.test.tsx
		StartupForm.submit.test.tsx
		...
	ThemeProvider/
	ThemeToggle/
	StartupCard/
	Toast/
	SearchForm/
	SearchFormReset/
	UserStartups/
	Avatar/
	View/
	Ping/
```

Each file name retains the component prefix for fast fuzzy matching in editors.

### CI / GitHub Actions

A workflow (`.github/workflows/test.yml`) runs on push/PR:

- Installs dependencies
- Conditionally runs Sanity type generation & build (skipped when placeholder `dummyProject` is set)
- Executes Jest coverage (100% thresholds enforced)
- Uploads `coverage/lcov.info` as an artifact

To enable Sanity steps in CI, add repository secrets and then replace the placeholder env values:

| Secret               | Maps to env var                     |
| -------------------- | ------------------------------------ |
| `SANITY_PROJECT_ID`  | `NEXT_PUBLIC_SANITY_PROJECT_ID`      |
| `SANITY_DATASET`     | `NEXT_PUBLIC_SANITY_DATASET`         |
| `SANITY_WRITE_TOKEN` | `SANITY_WRITE_TOKEN`                 |

After adding secrets you can remove the conditional `if: env.NEXT_PUBLIC_SANITY_PROJECT_ID != 'dummyProject'` lines to always run typegen/build.


---

## Contributing

1. Fork & clone.
2. Create feature branch.
3. Run dev + typegen.
4. Add tests or docs for new behaviors.
5. Open PR describing change & reasoning.

## License

MIT – use freely for learning and experimentation.

---

<p align="center">Built with care & modern web best practices.</p>
