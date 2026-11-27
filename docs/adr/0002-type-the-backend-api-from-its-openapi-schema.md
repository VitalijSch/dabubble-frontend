# 2. Type the backend API from its OpenAPI schema

Date: 2026-11-27

## Status

Accepted

## Context

The Django backend (dabubble-backend) is a separate repository. Hand-written API types drift
from the real API without anyone noticing, and the bug only shows up at runtime. The backend
already generates an OpenAPI schema with drf-spectacular and commits it as `openapi.yaml`,
including error bodies, with a test that fails when it is out of date.

## Decision

- Generate `src/lib/api/schema.d.ts` from `../dabubble-backend/openapi.yaml` with
  openapi-typescript (`pnpm api:generate`) and commit it, so CI doesn't need the backend repo.
- Call the backend only through one openapi-fetch client (`@/lib/api`). It adds the base URL,
  sends the session cookie and copies Django's CSRF token into `X-CSRFToken`.
- No hand-written API types; use `Schema<"Name">`.

Rejected: a full code generator (Orval, Hey API) — more generated code than this app needs yet;
it can be added later on top of the same schema.

## Consequences

- A backend API change becomes a TypeScript error after `pnpm api:generate`.
- Generating requires the backend repo next to this one.
- The client returns `{ data, error, response }` instead of throwing on 4xx/5xx.
