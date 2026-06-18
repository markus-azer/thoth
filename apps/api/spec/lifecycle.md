---
title: Lifecycle
workspace: apps/api
status: current
related: []
---

# Lifecycle

Manages startup and shutdown of long-lived resources (HTTP server, database, metrics, workers). Each resource implements a `Lifecycle` interface with `start()` and `stop()`. A `LifecycleManager` owns registration order and drives the process.


## Rules

- [RULE-LIFECYCLE-001] Services start in registration order.
- [RULE-LIFECYCLE-002] Services stop in reverse registration order.
- [RULE-LIFECYCLE-003] On start failure, every already-started service is stopped in reverse order, then the original error is rethrown.
- [RULE-LIFECYCLE-004] Per-service `stop()` is wrapped in a timeout.
- [RULE-LIFECYCLE-005] If a service throws during stop, the manager logs and moves to the next.
- [RULE-LIFECYCLE-006] Calling stop twice runs the drain once.
- [RULE-LIFECYCLE-007] SIGTERM and SIGINT invoke stop and exit cleanly.
- [RULE-LIFECYCLE-008] Repeat signals during shutdown are ignored.
- [RULE-LIFECYCLE-009] Unhandled rejection and uncaught exception log and exit non-zero.
