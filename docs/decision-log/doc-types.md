---

title: Decision log vs spec vs skill
status: accepted
date: 2026-06-17
related: []
---

# Decision log vs spec vs skill

Project documentation splits into three homes by purpose.
- **Decision log** (`docs/decision-log/`). _Why we chose this._ Tradeoffs and the path not taken. Past tense. Append-only.
- **Spec (SDD)** (`apps/*/spec/`, `packages/*/spec/`). _What we're building._ Source of truth for behavior. Present tense. Edited as scope changes.
- **Skill** (`.claude/skills/`). _How we do recurring tasks._ Imperative procedures, invokable by Claude Code.

Quick test:
- "Why is it like this?" goes in the decision log.
- "What should it do?" goes in the spec.
- "How do I do X again?" goes in a skill.

Why: each doc stays in one lane. Decisions don't rot when behavior changes. Specs don't drown in rationale. Skills stay portable.
