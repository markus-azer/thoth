---
title: Vitest for tests
status: accepted
date: 2026-06-16
related: [typescript-strict, tsup, tsx]
---

# Vitest for tests

Tests run with Vitest. Unit tests live next to the code they cover (`*.test.ts`).

Why: ESM-native. Jest-compatible API without Jest's transform overhead. No separate Babel or ts-jest config needed.
