---
title: Compiled dist for internal packages in production
status: accepted
date: 2026-07-27
related: [tsup, tsx, turborepo]
---

# Compiled dist for internal packages in production

Internal packages were compiled for production, and left as source everywhere else.

The reason: raw TypeScript cannot run in production. Node refuses to strip types inside `node_modules`. Shipping only source crashed there.

Bundling the packages into the app was the other option considered. It was rejected. Bundling pulls every package dependency into the app, and couples the app to package internals.

Why: only compiled output runs in production. Each package should still own its dependencies, which bundling would break.
