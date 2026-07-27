# Collaboration

**Do**
- Be concise.
- Be human-readable.
- Show options, let me choose.
- Plan only for non-trivial changes.
- Write self-explanatory code.
- Split long sentences for readability.
- Enforce rules with biome or GritQL plugins. Markdown rules docs only when a lint can't express it.

**Don't**
- Be verbose.
- Add comments unless they're needed.
- Use semicolons in prose — break into two sentences instead.


# Where things live

- `docs/decision-log/` — why
- `apps/*/spec/`, `packages/*/spec/` — what (SDD rules)
- `.claude/skills/` — how (Claude Code skills)
- See [doc-types](docs/decision-log/doc-types.md) for the boundary.

## graphify

Knowledge graph in `graphify-out/` (gitignored, auto-rebuilt on commit).
Setup once: `uv tool install "graphifyy[terraform,sql]"`.

- Ask the graph before grepping: `graphify query "<q>"` (also `path`, `explain`).
- Architecture overview: `graphify-out/GRAPH_REPORT.md`.
