# 1. Record architecture decisions

Date: 2026-11-25

## Status

Accepted

## Context

Decisions such as the backend, the auth provider or the realtime transport shape the whole
codebase. Months later it is hard to remember why an option was picked and what was rejected.

## Decision

We record every significant decision as a short Markdown file in `docs/adr/`, numbered
sequentially (`0002-choose-realtime-transport.md`, ...), with the sections Status, Context,
Decision and Consequences.

## Consequences

- New contributors (and Claude) can read why things are the way they are.
- A decision is changed by adding a new ADR that supersedes the old one, not by editing history.
