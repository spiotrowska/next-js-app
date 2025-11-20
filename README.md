<h1 align="center">StartupsLib</h1>
<p align="center">Pitch ideas. Get feedback. Grow startups – built with Next.js 16 App Router, Sanity, NextAuth, Tailwind & modern DX patterns.</p>

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
19. Future Improvements

---

## 1. Overview

StartupsLib is a small platform to submit, browse and evaluate startup pitches. It demonstrates modern Next.js 16 capabilities (App Router with Turbopack, server actions, streaming) together with Sanity CMS for structured content, GitHub OAuth via NextAuth, and a minimal design system on Tailwind.

## 2. Tech Stack

- Framework: Next.js 16 App Router (with Turbopack)
- Language: TypeScript
- CMS: Sanity v3 (schema types + vision + markdown plugin)
- Auth: NextAuth v5 (GitHub provider) with session/JWT callbacks
- Styling: TailwindCSS + custom Radix UI primitives + local variable font
- Monitoring: Sentry (@sentry/nextjs) + `global-error.tsx`
- Validation: Zod
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
- API route: `/api/theme` for theme persistence.

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

- Theme persisted in `app-theme` cookie; read client-side to avoid blocking server rendering.
- `ThemeProvider` client component reads cookie on mount and applies `dark` class to `<html>`.
- `ThemeToggle` persists choice through POST to `/api/theme`.
- System preference detection as fallback when no cookie set.
- Local Work Sans font loaded via `next/font/local` (weights mapped to CSS variable `--font-work-sans`).

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
pnpm install
pnpm dev
```

- Uses TurboPack in dev (`next dev --turbopack`).
- Run `pnpm typegen` to extract schema and generate TS types for GROQ results.
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

| Script                | Description                             |
| --------------------- | --------------------------------------- |
| `dev`                 | Start dev server with TurboPack         |
| `build`               | Production build                        |
| `start`               | Run built app                           |
| `lint`                | ESLint checks                           |
| `typegen`             | Sanity schema extract + type generation |
| `predev` / `prebuild` | Auto-run typegen before dev/build       |

## 18. Deployment Notes

- Set all required env vars on hosting provider (e.g. Vercel project settings).
- Ensure Sanity CORS includes deployment origin + local dev.
- Use canary Next.js; keep an eye on PPR experimental changes when upgrading.
- Sentry source maps: upload automatically via build step if configured.

## 19. Future Improvements

- Add system theme auto-detect fallback when no cookie set.
- Introduce optimistic UI for view counts.
- Implement pagination or infinite scroll for large startup sets.
- Add image optimization or Sanity image pipeline usage instead of raw URLs.
- Rate limiting or spam protection on create action.
- Richer markdown sanitization / allowed elements controls.
- Dedicated accessibility audit & improvements (focus states, ARIA).

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
