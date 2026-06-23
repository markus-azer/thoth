---
name: pr-opening
description: |
  Open a PR in wadjet. Branch from main, stage explicitly, commit with Conventional Commits subject, push, then `gh pr create` with a HEREDOC body. Use when the user asks to "open a PR", "push and PR", "make a PR", or similar.
---

# Opening a PR


## Branch

- `git checkout main && git pull --ff-only origin main`.
- `git checkout -b <type>/<topic>` (type per Conventional Commits).


## Commit

- Stage explicitly: `git add <files>`. Review `git status` first.
- Subject: `<type>(<scope>): <subject>`. Lowercase, no period.


## Push & PR

- `git push -u origin <branch>`.
- `gh pr create --title "<commit subject>"` with body via HEREDOC.
- Body: one `* <commit subject>` per commit. No Summary/Test plan.
