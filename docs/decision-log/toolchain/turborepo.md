---
title: Turborepo for build orchestration
status: accepted
date: 2026-07-27
related: [tsup, workspace-packages]
---

# Turborepo for build orchestration

Turborepo was adopted to build packages in dependency order and cache the results.

Running the package manager across the whole workspace was the starting point. It worked out the order on its own, and rebuilt everything on every run. Nothing was cached.

Turborepo was taken instead. It states the dependency order in one place, and skips packages that have not changed.

The cost was extra tooling for a repo with one app. It was taken on early, to settle the build contract while the repo is small.

Why: implicit, uncached builds do not scale. An explicit, cached graph does.
