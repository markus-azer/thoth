---

title: Query
workspace: apps/api
status: current
related: [mcp, auth, feedback, database]
---

# Query

A private MCP tool `query` on bare `/mcp`. A signed-in owner runs read-only SQL over their own data. The database enforces isolation, since an LLM writes the SQL.

## Inputs

- `sql: string`

## Outputs

Semantic states, not the literal MCP response.

- ROWS. The result rows.
- QUERY_ERROR. A tool-level error with the database message.

## Rules

- [RULE-QRY-001] No valid bearer → 401.
- [RULE-QRY-002] The query sees only rows whose `user_id` is the caller's.
- [RULE-QRY-003] The query runs as `llm_reader`, which can only `SELECT` exposed tables.
- [RULE-QRY-004] The owner is set per call from the `Principal`.
- [RULE-QRY-005] The query cannot change the owner.
- [RULE-QRY-006] The transaction is read-only.
- [RULE-QRY-007] The transaction is always rolled back.
- [RULE-QRY-008] More than one statement → QUERY_ERROR.
- [RULE-QRY-009] A query over 1 second → QUERY_ERROR.
- [RULE-QRY-010] A table that is not exposed → QUERY_ERROR.
- [RULE-QRY-011] Any database error → QUERY_ERROR, still 200.
- [RULE-QRY-012] The app connects as a non-superuser role.

## Exposed

`feedback`. To expose a table, grant `SELECT` to `llm_reader` and add an owner policy.
