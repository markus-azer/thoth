---
title: Metrics and liveness on a separate admin port
status: accepted
date: 2026-07-08
related: [http-framework]
---

# Metrics and liveness on a separate admin port

`/metrics` and `/health/live` were routed to a dedicated admin port, separate from the public API port.

Why: keeping observability endpoints off the public port avoids information leak without per-route auth. Folding metrics + liveness into one admin server collapsed what an earlier plan drew as two separate phases.
