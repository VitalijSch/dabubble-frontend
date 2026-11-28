# DABubble

Team chat app in the style of Slack — channels, threads and direct messages. Built with Next.js.

## Requirements

- **Node.js 26** (current LTS — see `.nvmrc`)
- **pnpm 12** via corepack (Node 25+ no longer ships corepack, so install it once)

## Quick start

```bash
npm install -g corepack
corepack enable pnpm
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored) and fill in real values. Every variable is
validated in `src/env.ts`, so a missing or wrong one stops the build and the server start.

| Variable              | What it is                                                             |
| --------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app (absolute links, metadata, redirects)           |
| `NEXT_PUBLIC_API_URL` | Origin of the Django backend; the API client sends every request there |

## Scripts

| Script                         | What it does                                                             |
| ------------------------------ | ------------------------------------------------------------------------ |
| `pnpm dev`                     | Dev server with hot reload                                               |
| `pnpm build`                   | Production build (standalone output)                                     |
| `pnpm start`                   | Serve the production build                                               |
| `pnpm check`                   | Typecheck + lint + format check + unit tests — run before every commit   |
| `pnpm typecheck`               | Generate route types and run `tsc --noEmit`                              |
| `pnpm lint`                    | ESLint, zero warnings allowed                                            |
| `pnpm format` / `format:check` | Format with Prettier / verify formatting                                 |
| `pnpm test` / `test:watch`     | Vitest unit tests (once / watch mode)                                    |
| `pnpm test:e2e`                | Playwright E2E tests against a production build                          |
| `pnpm api:generate`            | Regenerate the backend API types from `../dabubble-backend/openapi.yaml` |

First E2E run: `pnpm exec playwright install chromium`.

## Backend API

The Django backend ([dabubble-backend](../dabubble-backend)) describes its whole API in one file,
`openapi.yaml`, the contract. This app never writes API types by hand: they are generated from it.

| Where to look                      | What you find                                                  |
| ---------------------------------- | -------------------------------------------------------------- |
| http://localhost:8000/api/docs/    | Swagger UI: every endpoint, its fields and errors; try it live |
| `../dabubble-backend/openapi.yaml` | The contract itself (changes show up in backend PRs)           |
| `src/lib/api/schema.d.ts`          | The generated TypeScript types (committed, never edited)       |
| `src/lib/api/client.ts`            | The client: base URL, session cookie, CSRF token               |

Call the backend only through `api` from `@/lib/api`. URLs, request bodies, responses and error
bodies are type-checked:

```ts
import { api, type Schema } from "@/lib/api";

const { data, error, response } = await api.POST("/api/v1/auth/register/validate/", {
  body: { full_name, email, password, accept_privacy_policy: true },
});
const isRefused = response.status === 400;
if (isRefused) showFieldErrors(error);

type User = Schema<"User">;
```

Calls don't throw on 4xx/5xx: check `error` or `response.status`. Errors are either messages per
field (`400`, `{ "email": ["…"] }`) or one message (`{ "detail": "…" }`), already in German.

**After the backend changed its API:** pull the backend, run `pnpm api:generate`, commit
`schema.d.ts`. `pnpm typecheck` then shows every place that has to change.

## Docker

```bash
docker build -t dabubble-frontend \
  --build-arg NEXT_PUBLIC_APP_URL=https://chat.example.com \
  --build-arg NEXT_PUBLIC_API_URL=https://api.chat.example.com .
docker run -p 3000:3000 dabubble-frontend
```

`NEXT_PUBLIC_*` values are baked into the build, so pass them as build args, not at `docker run`.
The Node major in the `Dockerfile` (`NODE_VERSION`) must match `.nvmrc`.

Health check: `GET /api/health` → `{ "status": "ok" }`.

## Folder map

```
src/app/          Routes: pages, layouts, error/404/loading, API route handlers
src/features/     One folder per feature (chat, auth, …) with a public index.ts
src/lib/          Shared framework-free helpers
src/env.ts        Validated environment variables (the only place reading process.env)
e2e/              Playwright tests
docs/             ARCHITECTURE.md and architecture decision records (adr/)
.claude/          Shared Claude Code settings and hooks
```
