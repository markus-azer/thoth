---
title: Squash-only merges
status: accepted
date: 2026-06-14
related: [branch-protection, pr-titles]
---

# Squash-only merges

Main stays linear. Every merged PR becomes exactly one commit.

The squash commit's subject is the PR title, with the PR number auto-appended. Its body preserves each PR commit message as a bullet so the trail is not lost.

Why: one PR equals one commit on main.
