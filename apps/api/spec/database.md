---
title: Database
workspace: apps/api
status: current
related: []
---

# Database

Owns the Postgres `pg.Pool`.


## Rules

- [RULE-DB-001] `start()` runs `SELECT 1`. If it errors, start fails.
- [RULE-DB-002] `stop()` calls `pool.end()`, draining active queries.
- [RULE-DB-003] `query<T>(sql, params?)` returns `rows` directly.
- [RULE-DB-004] `ping()` returns `true` when `SELECT 1` succeeds, `false` on any error.
