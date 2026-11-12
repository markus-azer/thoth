---

title: Feedback
workspace: apps/api
status: current
related: [mcp, bio, query, database]
---

# Feedback

A public MCP tool `submit_feedback` on `/mcp/:handle`. Anyone leaves a message for the bio's owner, who reads it through [query](query.md).


## Inputs

- `message: string`
- `name: string` _(optional)_
- `topic: string` _(optional)_
- `email: string` _(optional)_


## Outputs

Semantic states, not the literal MCP response.
- ACKNOWLEDGED. A text confirmation.
- INVALID_INPUT. Schema validation rejects the call.
- NOT_FOUND. No handle, or the handle matches no bio.


## Rules

- [RULE-FB-001] Empty `message` → INVALID_INPUT.
- [RULE-FB-002] An invalid `email` → INVALID_INPUT.
- [RULE-FB-003] One call persists one entry.
- [RULE-FB-004] The app assigns `id` and `created_at`.
- [RULE-FB-005] The entry stores the `user_id` of the bio that owns `:handle`.
- [RULE-FB-006] Bare `/mcp` → NOT_FOUND, nothing persisted.
- [RULE-FB-007] An unknown `:handle` → NOT_FOUND, nothing persisted.
- [RULE-FB-008] No sign-in needed.
- [RULE-FB-009] Deleting a user deletes their feedbacks.
