---
title: tsup for production builds
status: accepted
date: 2026-06-16
related: [typescript-strict, tsx, vitest]
---

# tsup for production builds

Each workspace builds with tsup. Output is ESM with sourcemaps.

Each app has one entry. `@thoth/utils` has one per module.

Why: plain `tsc` emits imports exactly as written. ESM at runtime needs `.js` extensions and resolved path aliases. tsup handles both. tsc does not.
