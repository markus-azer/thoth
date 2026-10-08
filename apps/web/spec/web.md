---
title: Web
workspace: apps/web
status: current
related: [links]
---

# Web

The owner's public personal website: one page with their bio and links.


## Rules

- [RULE-WEB-001] The platform checks `/health` → it gets 200 with `{ status: "ok" }`.
- [RULE-WEB-002] A visitor opens the home page → they see the bio for the configured site handle.
- [RULE-WEB-003] The bio can't be fetched → the build fails.
- [RULE-WEB-004] The bio is missing a field → the build fails.
- [RULE-WEB-005] The bio has a blank field → the build fails.
- [RULE-WEB-006] A visitor opens the home page → they see the owner's name, headline, and about.
- [RULE-WEB-007] The bio changed over 5 minutes ago → the next visit rebuilds the home page.
