---
title: Bio
workspace: apps/api
status: current
related: [mcp, database]
---

# Bio

A public MCP tool that answers who the site is about. Exposed as MCP tool `get_bio`.


## Outputs

Semantic states, not the literal MCP response.

- FOUND. The tool returns the bio: name, headline, and about.
- NOT_FOUND. No bio row exists for the tenant.


## Rules

- [RULE-BIO-001] FOUND includes the name, headline, and about.
- [RULE-BIO-002] The tenant is fixed. No selection input exists yet.
- [RULE-BIO-003] NOT_FOUND throws a `NotFound` domain error (`ErrorCode.BIO_NOT_FOUND`).
