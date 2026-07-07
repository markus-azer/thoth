# Decision Log

Records why each decision was made. Grouped by topic, one decision per file.


## Rules

- One decision per file. Name it after the decision.
- Document intent (what and why), not implementation. The code is the truth.
- Group by topic. Cross-link related decisions.
- Frontmatter: `title`, `status` (accepted | proposed | deprecated | superseded), `date`, `related`.
- Be terse. Blank lines between sections. Periods end sentences.
- End each decision with a one-line `Why: ...` so the motivation is never lost. Name each alternative rejected and why.
- Formal, impersonal voice. No first-person pronouns (`we`, `I`, `our`). Prefer "X was adopted" over "we chose X".


## Frontmatter

```yaml
---
title: ...
status: accepted
date: 2026-06-14
related: [other-decision]
---
```
