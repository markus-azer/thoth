---
title: Health
workspace: apps/api
status: current
related: []
---

# Health

Kubernetes-style probes. `/health/live` reports the process is alive. `/health/ready` reports whether the service can accept traffic (dependencies reachable, lifecycle started).


## Rules

- [RULE-HEALTH-001] `/health/live` returns 200 with `{ status: "ok" }`.
- [RULE-HEALTH-002] `/health/ready` returns 200 with `{ status: "ok", checks: { db: "ok" } }` when the service is started and the DB responds.
- [RULE-HEALTH-003] `/health/ready` returns 503 with `status: "degraded"` before `start()`.
- [RULE-HEALTH-004] `/health/ready` returns 503 with `status: "degraded"` after `stop()`.
- [RULE-HEALTH-005] `setReady(false)` forces `status: "degraded"`.
- [RULE-HEALTH-006] A failing DB ping sets `checks.db` to `"degraded"`.
- [RULE-HEALTH-007] A failing DB ping forces `status: "degraded"`.
