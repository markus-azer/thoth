---
title: Bio
workspace: apps/api
status: current
related: [mcp, database]
---

# Bio

Three MCP tools and one HTTP route. `get_bio` (public) answers who a bio belongs to. `create_bio` and `update_bio` (private) let the logged-in owner write their own bio. `GET /bio/:handle` (public) returns a bio as JSON.


## Inputs

`create_bio` and `update_bio`:

- `handle: string`, max 60 characters, lowercase letters and digits, with hyphens only between them (not leading or trailing)
- `name: string`, max 100 characters
- `headline: string`, max 200 characters
- `about: string`, max 5000 characters

Each field is trimmed before checks.


## Outputs

Semantic states, not the literal MCP response.

`get_bio`:

- FOUND. The tool returns the bio: name, headline, and about.
- NOT_FOUND. No bio matches the lookup.

`create_bio`:

- CREATED. The tool returns a confirmation.
- ALREADY_EXISTS. The caller already owns a bio.
- HANDLE_TAKEN. Another user already owns that handle.
- INVALID_INPUT. Schema validation rejects the call before the handler runs.

`update_bio`:

- UPDATED. The tool returns a confirmation.
- NOT_FOUND. The caller owns no bio yet.
- HANDLE_TAKEN. Another user already owns that handle.
- INVALID_INPUT. Schema validation rejects the call before the handler runs.

`GET /bio/:handle`:

- FOUND. 200 with `{ name, headline, about }`.
- NOT_FOUND. 404 with the standard error body.


## Rules

- [RULE-BIO-001] FOUND includes the name, headline, and about.
- [RULE-BIO-002] `:handle` matches a bio → FOUND for that bio.
- [RULE-BIO-003] `:handle` absent → NOT_FOUND.
- [RULE-BIO-004] `:handle` matches no bio → NOT_FOUND.
- [RULE-BIO-005] `create_bio` and `update_bio` are private.
- [RULE-BIO-006] `create_bio`, no existing bio for the caller → CREATED.
- [RULE-BIO-007] `create_bio`, an existing bio for the caller → ALREADY_EXISTS.
- [RULE-BIO-008] `update_bio`, an existing bio for the caller → UPDATED.
- [RULE-BIO-009] `update_bio`, no existing bio for the caller → NOT_FOUND.
- [RULE-BIO-010] A `handle` already owned by a different user → HANDLE_TAKEN.
- [RULE-BIO-011] Empty `handle`, `name`, `headline`, or `about` → INVALID_INPUT.
- [RULE-BIO-012] A `handle` that isn't a lowercase, hyphen-separated slug → INVALID_INPUT.
- [RULE-BIO-013] `GET /bio/:handle` with a known handle → 200 with `{ name, headline, about }`.
- [RULE-BIO-014] `GET /bio/:handle` with an unknown handle → 404 with code `BIO_NOT_FOUND`.
