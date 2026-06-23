---
title: Vitest for tests
status: accepted
date: 2026-06-16
related: [typescript-strict, tsup, tsx]
---

# Vitest for tests

Tests run with Vitest. Test files live in workspace-level `test/`.

Why: ESM-native. Jest-compatible API without Jest's transform overhead. No separate Babel or ts-jest config needed.
