---
title: Flyway for database migrations
status: accepted
date: 2026-07-12
related: [di]
---

# Flyway for database migrations

Flyway was chosen to run versioned SQL migrations (`apps/api/sql/`) as a docker-compose service.

Why: raw `pg`, no ORM, so plain SQL keeps schema infra-owned with checksums for free. node-pg-migrate was the node-native runner-up. Drizzle was rejected — it adds an ORM the codebase avoids.

Trade-off: Flyway is JVM, run via docker not node. Integration tests reuse the same `V*.sql` against `thoth_test` to skip the JVM.
