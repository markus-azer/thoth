---
title: tsx for dev execution
status: accepted
date: 2026-06-16
related: [typescript-strict, tsup, vitest]
---

# tsx for dev execution

Dev scripts run TypeScript directly with `tsx --watch`. No compile step.

Why: fast iteration. Reloads on save. No `dist/` to keep in sync during development.
