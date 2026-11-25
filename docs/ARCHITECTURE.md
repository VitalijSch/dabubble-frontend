# Architecture

DABubble is a team chat app (channels, threads, direct messages) in the style of Slack.

## Stack and why

| Piece      | Choice                                            | Why                                                                |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| Framework  | Next.js 16 (App Router, Cache Components)         | Server Components by default, one deployable for UI and API routes |
| Language   | TypeScript (strict + `noUncheckedIndexedAccess`)  | Catch nulls and typos before runtime                               |
| Styling    | Tailwind CSS 4                                    | Utility classes, no separate CSS architecture to maintain          |
| Validation | Zod 4                                             | One schema for env vars, forms and API input                       |
| Tests      | Vitest (unit), Playwright (E2E)                   | Fast unit loop; E2E against a production build                     |
| Hosting    | Self-hosted Docker image (`output: "standalone"`) | Runs on any VPS / container platform                               |

## Folder map

```
src/
  app/            Routes only: pages, layouts, route handlers. Thin — delegates to features.
  features/<name> One folder per feature (e.g. chat, auth). index.ts is its public API.
  lib/            Small, framework-free helpers shared by several features.
  env.ts          The only place that reads process.env.
e2e/              Playwright end-to-end tests.
docs/             This file and architecture decision records (adr/).
```

## Dependency direction

```
app  →  features  →  lib
```

- `app/` may import from `features/` and `lib/`.
- A feature may import from `lib/` and from another feature's `index.ts` — never from its internals.
- `lib/` imports nothing from `app/` or `features/`.

## Decisions

Significant decisions are recorded in [`docs/adr/`](./adr/). Add a new numbered file when you
choose a backend, auth provider, realtime transport, etc.
