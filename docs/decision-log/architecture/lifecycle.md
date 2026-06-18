---
title: Service-based lifecycle
status: accepted
date: 2026-06-17
related: [logger]
---

# Service-based lifecycle

Long-lived resources (HTTP server, database, metrics, workers) implement a shared `Lifecycle` interface. A `LifecycleManager` registers them, starts in order, stops in reverse, and owns the process signal traps.

Why: one place to wire startup order, rollback on partial start, signal handling, and shutdown timeouts. Adding a resource is one `register()` call instead of new branches in `main.ts`.
