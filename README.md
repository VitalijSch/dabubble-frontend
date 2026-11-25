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

## Scripts

| Script                         | What it does                                                           |
| ------------------------------ | ---------------------------------------------------------------------- |
| `pnpm dev`                     | Dev server with hot reload                                             |
| `pnpm build`                   | Production build (standalone output)                                   |
| `pnpm start`                   | Serve the production build                                             |
| `pnpm check`                   | Typecheck + lint + format check + unit tests — run before every commit |
| `pnpm typecheck`               | Generate route types and run `tsc --noEmit`                            |
| `pnpm lint`                    | ESLint, zero warnings allowed                                          |
| `pnpm format` / `format:check` | Format with Prettier / verify formatting                               |
| `pnpm test` / `test:watch`     | Vitest unit tests (once / watch mode)                                  |
| `pnpm test:e2e`                | Playwright E2E tests against a production build                        |

First E2E run: `pnpm exec playwright install chromium`.

## Docker

```bash
docker build -t dabubble-frontend --build-arg NEXT_PUBLIC_APP_URL=https://chat.example.com .
docker run -p 3000:3000 dabubble-frontend
```

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
