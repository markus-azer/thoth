---
title: parseOrigins
workspace: packages/utils
status: current
related: []
---

# parseOrigins

Parses a CORS origin config string into a value the `cors` middleware understands.


## Rules

- [RULE-ORIGINS-001] `"*"` returns `true` (allow any origin).
- [RULE-ORIGINS-002] A comma-separated string is split into trimmed origins.
