# Spec (SDD)

Records what each workspace does. Source of truth for behavior. See [doc-types](../decision-log/doc-types.md) for boundaries.


## Rules

- One spec per module.
- Name the file after the module.
- Specs live co-located with their workspace (e.g. `apps/api/spec/`).
- This README is the format for those specs.
- Present tense. "X does Y", not "X will do Y".
- Describe behavior, not rationale.
- Rationale goes in the decision log.
- Edit freely as scope changes. Not append-only.
- Each rule is a single one-line invariant.
- Split combined sentences (e.g. "X happens AND Y is ignored") into two rules.
- Each rule has a unique ID `RULE-[MODULE]-[NNN]`.
- Tests reference the ID and quote the rule text verbatim.
- `Inputs`, `Outputs`, `Examples`, `API` sections are optional.
- Drop the sections a module doesn't need.


## Frontmatter

```yaml
---
title: ...
workspace: apps/api
status: current
related: [other-spec]
---
```

`status`: `current | draft | deprecated`.


## Template

See [TEMPLATE.md](TEMPLATE.md).
