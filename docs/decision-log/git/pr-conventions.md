---
title: PR conventions
status: accepted
date: 2026-06-15
related: [merge-strategy, pr-titles]
---

# PR conventions

PRs are small, green, and reviewable in ten minutes.

- **Small.** Target under 400 LOC. Hard ceiling 800. Lockfiles and generated files don't count.

- **Green.** All required CI checks must pass before requesting review.

- **One thing per PR.** Don't mix refactor with feature. Split.

- **Logical commits.** Each commit is atomic, builds, and makes sense alone. The commit log reads as the design.

- **One-color diff.** Prefer PRs that only add (green) or only delete (red). If both are needed, split per commit so each commit is one color.

- **No drive-by changes.** Reformatting, renames, and unrelated cleanups land as separate commits or PRs.

- **Self-explanatory description.** What, why, how to verify.

Why: review velocity is the bottleneck. Small green PRs review in ten minutes. Large mixed PRs sit for days.
