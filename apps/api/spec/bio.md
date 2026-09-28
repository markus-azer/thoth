---
title: Bio
workspace: apps/api
status: current
related: [mcp, database]
---

# Bio

`get_bio` (public) answers who a handle's bio belongs to.


## Outputs

Semantic states, not the literal MCP response.

`get_bio`:

- FOUND. The tool returns the bio: name, headline, and about.
- NOT_FOUND. No bio matches the lookup.


## Rules

- [RULE-BIO-001] FOUND includes the name, headline, and about.
- [RULE-BIO-002] `:identifier` matches a handle → FOUND for that bio.
- [RULE-BIO-003] `:identifier` absent → NOT_FOUND.
- [RULE-BIO-004] `:identifier` matches no handle → NOT_FOUND.
