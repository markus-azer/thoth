---
title: Conventional Commits in PR titles
status: accepted
date: 2026-06-14
related: [merge-strategy]
---

# Conventional Commits in PR titles

Squash merges use the PR title as the commit subject, so the PR title is the commit message that lands on main.

It must follow Conventional Commits. Linted on every PR and every local commit.

## Allowed types

feat, fix, chore, docs, refactor, perf, style, test, build, ci, infra, spec, revert.

Example: `feat(http): welcome route`.

Why: commit messages on main must be predictable and parseable.
