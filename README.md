# Thoth

Personal website and MCP server.

## Layout

- `apps/` — runnable services.
- `packages/` — shared libraries.
- `infra/` — Terraform.
- `docs/decision-log/` — decisions.
- `docs/spec/` — module specs (SDD).

## Local AI tooling

`.mcp.json` wires up MCP servers for Claude Code.

The `github` server needs a token:

```sh
export GITHUB_TOKEN=$(gh auth token)   # or a personal access token
```

## License

MIT — see [LICENSE](./LICENSE).
