---
title: Feedback
workspace: apps/api
status: current
related: [mcp, database]
---

# Feedback

A public MCP tool that lets a visitor leave a freeform message for the site owner. Exposed as MCP tool `submit_feedback`.


## Inputs

- `message: string`
- `name: string` _(optional)_
- `topic: string` _(optional)_
- `email: string` _(optional)_


## Outputs

- ACKNOWLEDGED
- INVALID_INPUT


## Rules

- [RULE-FB-001] Empty `message` → INVALID_INPUT.
- [RULE-FB-002] When present, an invalid `email` → INVALID_INPUT.
- [RULE-FB-003] One call persists exactly one feedback entry.
- [RULE-FB-004] The app assigns `id` and `created_at` on persist.
