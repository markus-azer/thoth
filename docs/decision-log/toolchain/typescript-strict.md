---
title: TypeScript maximum strictness
status: accepted
date: 2026-06-16
related: [tsup, tsx, vitest]
---

# TypeScript maximum strictness

All strictness flags are on, including the ones not covered by `strict: true`.

The shared `tsconfig.base.json` at the repo root is the single source of truth. Workspaces extend it. They do not override strictness.

Notable flags beyond `strict: true`:

- `noUncheckedIndexedAccess` — array and index access returns `T | undefined`.
- `exactOptionalPropertyTypes` — `?` does not implicitly add `undefined` to the type.
- `verbatimModuleSyntax` — type-only imports must be explicit (`import type`).

Why: catch bugs at compile time, not in production.
