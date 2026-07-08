---
title: OpenTelemetry auto-instrumentation, env-gated
status: accepted
date: 2026-07-09
related: []
---

# OpenTelemetry auto-instrumentation, env-gated

Chose auto-instrumentation over per-library setup. Gated by `OTEL_ENABLED` so dev and CI don't need a collector.

Why: auto only patches modules loaded after SDK start. Manual gets us granularity we don't need yet. The gate keeps local runs collector-free.
