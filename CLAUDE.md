# CLAUDE.md

Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript 5.9 (strict), Tailwind 4.3, Zod 4. Package manager: **pnpm 12** (never npm or yarn). Self-hosted via Docker.

@AGENTS.md
@docs/ARCHITECTURE.md

## Commands

- `pnpm dev` — dev server on http://localhost:3000
- `pnpm check` — typecheck + lint + format check + unit tests. **Run before saying you're done.**
- `pnpm vitest run path/to/file.test.ts` — run one test file
- `pnpm test:e2e` — Playwright against a production build (port 3100)
- `pnpm api:generate` — regenerate API types from `../dabubble-backend/openapi.yaml`

## Rules

- Read env vars only via `import { env } from "@/env"`. New var → `src/env.ts` AND `.env.example`.
- Server Components by default; `"use client"` only for interactivity, as deep in the tree as possible.
- Feature code lives in `src/features/<name>/`; import other features only via their `index.ts`.
- Tests live next to the code. Every bug fix starts with a failing test.
- Ask before adding a new dependency.
- Call the backend only through `api` from `@/lib/api` (typed from the backend's `openapi.yaml`). Never hand-write API types; use `Schema<"Name">`. `src/lib/api/schema.d.ts` is generated: after a backend API change run `pnpm api:generate`, never edit it.

## Clean Code (Robert C. Martin)

Goal: someone who has never programmed reads a function top to bottom and can say what happens. The code explains itself; nothing else does.

**No comments. Anywhere.** Not in `.ts`/`.tsx`, CSS, tests, config, Dockerfile, YAML or `.env.example`.

- When you feel the need for a comment, the code isn't clear enough yet. Rename, extract a function or a named constant, or write a test whose name says it.
- A "why" that no name can carry (a framework quirk, a Figma measurement, a backend rule) goes into a test named after the behaviour, into the commit message, or into an ADR in `docs/adr/`. Never into the code.
- No JSDoc, no section headings, no commented-out code, no TODOs (open an issue instead).
- Only tool directives stay, bare and without explanation: `"use client"`, `/// <reference>`, Dockerfile `# syntax=`, `/** @type */` in `.mjs` configs. Type-level tests use `expectTypeOf`, not `@ts-expect-error` (lint demands a comment after it). Generated files (`schema.d.ts`, `next-env.d.ts`, the `next dev` block in AGENTS.md) are never edited.

**Names** (ch. 2)

- Reveal intent: the name says why it exists, what it does and how it's used. `secondsUntilLogin`, not `t`.
- Plain words a non-programmer knows: `createAccount`, `isLoggedIn`, `firstMessageOfEachField`. No abbreviations, no encodings (`IUser`, `strName`), no mental mapping (`i` only as a tiny loop counter).
- No noise words that make no difference: `data`, `info`, `value`, `manager`, `object`, `tmp`, `helper`.
- No disinformation: `userList` must be a list; two names that differ must mean different things.
- Searchable: every number or string that means something is a named constant (`ACCOUNT_CREATED_MS`, not `4000`).
- Functions and hooks are verbs (`sendConfirmationEmail`, `useSlideInFromRight`); values and components are nouns (`AvatarList`); booleans are yes/no questions (`isPending`, `hasError`, `showsOverlay`).
- One word per idea across the whole project (`check` everywhere, not `check`/`validate`/`verify` for the same thing), and no word used for two ideas.
- Longer scope → longer, more precise name. Domain words from the product (sign-up, avatar, channel, thread) beat technical ones.

**Functions** (ch. 3)

- Small: a few lines, rarely more than ~15. Blocks inside `if`, `else`, `for` are one line, usually a call.
- Do one thing, on one level of abstraction. If you can extract a function with a name that isn't just a restatement, it was doing more than one thing.
- Stepdown rule (newspaper metaphor): the main function reads like a list of steps, its helpers follow right below in calling order, each one level more detailed.
- Arguments: 0 best, 1–2 fine, 3 only with a good reason; more → one object with named fields. No boolean flag arguments: write two functions. No output arguments.
- No hidden side effects. Command–query separation: a function either changes something or answers a question, never both.
- Errors: return typed results (`{ ok: false, … }`) or throw, never `null`/magic codes for failure. Put `try`/`catch` in its own function that does nothing else.
- Early returns instead of nested `if`/`else`. Positive conditions (`isVisible`, not `!isHidden`). Encapsulate a condition in a named function or variable when it isn't obvious (`isFieldErrors(body)`).
- A `switch` on a kind lives in one place, at the lowest level.
- DRY: the same logic twice becomes one function.

**Modules, components and data** (ch. 6, 10)

- One module, one reason to change (single responsibility). When a file mixes jobs (form checks and backend calls), split it.
- High cohesion: what changes together lives together; a feature's files sit in its folder.
- A component shows one thing. Long JSX becomes named components (`<PrivacyCheckbox />`, `<AvatarList />`), not sections.
- Logic stays out of JSX: compute values with named variables or functions before `return`. Effects with a purpose go into a named hook.
- Law of Demeter: talk to your direct neighbours, not `a.b().c().d`. Prefer data in, data out.

**Formatting** (ch. 5) — Prettier handles spacing; you handle order.

- Newspaper order: the exported, high-level thing first, details below.
- Related lines stay together; a blank line separates ideas. Variables are declared right before they're used. Constants and types at the top of the file.

**Boundaries** (ch. 8)

- Wrap third-party code behind our own names: the backend only through `api` from `@/lib/api`, browser APIs through small named functions (`prefersReducedMotion()`).

**Tests** (ch. 9)

- Test names are plain sentences about behaviour: `it("shows the backend's message when the email is taken")`. They are the documentation the code doesn't have.
- One idea per test; arrange → act → assert, readable as a story. Shared setup becomes named helpers (`mockRegister`, `apiAnswering`).
- F.I.R.S.T.: fast, independent, repeatable, self-validating, written with (or before) the code. Test code is kept as clean as production code.

**Simple design** (ch. 12, Kent Beck's four rules, in order)

1. All tests pass. 2. No duplication. 3. Expresses intent. 4. As few functions, modules and types as possible.

**Boy Scout rule:** leave every file you touch cleaner than you found it. Delete dead code and unused exports right away.

## Gotchas

- Next.js 16.4 docs ship in `node_modules/next/dist/docs/` — read them; APIs changed since older versions.
- `error.tsx` receives `{ error: unknown, retry }` (not `reset`); narrow `error` with `instanceof Error`.
- `cacheComponents` is on: uncached dynamic data must sit inside `<Suspense>` or use `"use cache"`.
- No `next lint` — use `pnpm lint` (plain ESLint, flat config). ESLint stays on 9 until Next's plugins support 10.
- `pnpm typecheck` runs `next typegen` first so `PageProps`/`LayoutProps` types exist on a fresh clone.
- Node 25+ no longer bundles corepack: install it with `npm install -g corepack` before `corepack enable pnpm`.
- Vitest uses Vite's native `resolve.tsconfigPaths` — no `vite-tsconfig-paths` plugin.
