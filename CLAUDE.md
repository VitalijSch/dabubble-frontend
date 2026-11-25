# CLAUDE.md

Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript 5.9 (strict), Tailwind 4.3, Zod 4. Package manager: **pnpm 12** (never npm or yarn). Self-hosted via Docker.

@AGENTS.md
@docs/ARCHITECTURE.md

## Commands

- `pnpm dev` — dev server on http://localhost:3000
- `pnpm check` — typecheck + lint + format check + unit tests. **Run before saying you're done.**
- `pnpm vitest run path/to/file.test.ts` — run one test file
- `pnpm test:e2e` — Playwright against a production build (port 3100)

## Rules

- Read env vars only via `import { env } from "@/env"`. New var → `src/env.ts` AND `.env.example`.
- Server Components by default; `"use client"` only for interactivity, as deep in the tree as possible.
- Feature code lives in `src/features/<name>/`; import other features only via their `index.ts`.
- Tests live next to the code. Every bug fix starts with a failing test.
- Ask before adding a new dependency.

## Gotchas

- Next.js 16.4 docs ship in `node_modules/next/dist/docs/` — read them; APIs changed since older versions.
- `error.tsx` receives `{ error: unknown, retry }` (not `reset`); narrow `error` with `instanceof Error`.
- `cacheComponents` is on: uncached dynamic data must sit inside `<Suspense>` or use `"use cache"`.
- No `next lint` — use `pnpm lint` (plain ESLint, flat config). ESLint stays on 9 until Next's plugins support 10.
- `pnpm typecheck` runs `next typegen` first so `PageProps`/`LayoutProps` types exist on a fresh clone.
- Node 25+ no longer bundles corepack: install it with `npm install -g corepack` before `corepack enable pnpm`.
- Vitest uses Vite's native `resolve.tsconfigPaths` — no `vite-tsconfig-paths` plugin.
