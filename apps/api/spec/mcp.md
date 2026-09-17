---
title: MCP
workspace: apps/api
status: current
related: [auth]
---

# MCP

MCP over streamable HTTP. Auth is per tool call, not per mount.


## Outputs

- A tool call returns a tool result or a tool-level error (e.g. NOT_FOUND, INVALID_ARGUMENT), always over 200.
- A private tool call on bare `/mcp` with no valid bearer returns 401.
- A private tool call on `/mcp/:identifier` returns 404.


## Rules

- [RULE-MCP-001] Mounts at `POST /mcp` and `POST /mcp/:identifier`.
- [RULE-MCP-002] Transport is MCP streamable HTTP.
- [RULE-MCP-003] `:identifier`, when present, passes through to the public tool unchanged.
- [RULE-MCP-004] Bare `/mcp` → no `:identifier`.
- [RULE-MCP-005] Empty `:identifier` segment (`/mcp/`) → same as bare `/mcp`.
- [RULE-MCP-006] A private tool call on `/mcp/:identifier` → 404.
- [RULE-MCP-007] A private tool call on bare `/mcp`, no valid bearer → 401.
- [RULE-MCP-008] A private tool call on bare `/mcp`, valid bearer → runs.
- [RULE-MCP-009] A tool call, success or tool-level error → 200.
