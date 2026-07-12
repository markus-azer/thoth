---
title: MCP
workspace: apps/api
status: current
related: [content, ask]
---

# MCP

MCP over streamable HTTP. Reads from content. Public in v1.


## Outputs

- Tool result
- NOT_FOUND
- INVALID_ARGUMENT


## Rules

- [RULE-MCP-001] Mounts at `POST /mcp`.
- [RULE-MCP-002] Transport is MCP streamable HTTP.
- [RULE-MCP-003] No authentication required.


## API

POST /mcp
Body: MCP streamable-HTTP JSON-RPC.
Response: 200 | 400 | 404.
