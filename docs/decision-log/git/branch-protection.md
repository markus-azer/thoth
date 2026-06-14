---
title: Branch protection on main
status: accepted
date: 2026-06-14
related: [merge-strategy, pr-titles]
---

# Branch protection on main

Main is protected. The following must hold before any merge:

- Linear history.
- All PR conversations resolved.
- Signed commits.
- All required CI checks passing.

Why: main ships to production.
