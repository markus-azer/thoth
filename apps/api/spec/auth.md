---
title: Auth
workspace: apps/api
status: draft
related: [mcp, memory, database]
---

# Auth

Better Auth is thoth's OAuth 2.1 server for MCP clients. It mounts at `/api/auth`, federates login to GitHub, and issues JWT access tokens.

Public tools stay anonymous. A private tool called without a valid token returns `401`, so the client signs in and retries with a bearer.


## Surfaces

- Public: `GET /`, `GET /health`, everything under `/api/auth`, the sign-in and consent pages.
- Private: any MCP tool that needs a `Principal`, e.g. `memory` (`remember`, `recall`).
- `POST /mcp` is one endpoint. Auth is decided per call from the JSON-RPC body.


## Flow

On a private call with no valid token, thoth returns `401` with `WWW-Authenticate`. The client registers dynamically, runs the OAuth dance against Better Auth (which authenticates via GitHub), gets a JWT, and retries with the bearer. `initialize`, `tools/list`, and public calls never need a token.


## Rules

- [RULE-AUTH-001] Better Auth is the authorization server at `/api/auth`.
- [RULE-AUTH-002] Login federates to GitHub, so thoth never handles a password.
- [RULE-AUTH-003] Signup is open, and each user owns its data keyed on `(providerId, accountId)`.
- [RULE-AUTH-004] A private `tools/call` without a valid token returns `401` with `WWW-Authenticate`, checked per batch element.
- [RULE-AUTH-005] `verifyBearer` validates the JWT signature, `iss`, and `aud`, returning a `Principal` `{ userId, scopes }`.
- [RULE-AUTH-006] Every user-scoped row carries the user id, and every query filters by it.


## Data

Better Auth owns these Postgres tables, schema in `sql/V3__auth.sql` and generated from its config: `user`, `session`, `account`, `verification`, `jwks`, `oauthClient`, `oauthAccessToken`, `oauthRefreshToken`, `oauthConsent`.


## Config

Env: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `BETTER_AUTH_URL` (public base URL, also the token audience), `BETTER_AUTH_SECRET` (signing secret).


## Spec impact

- `mcp.md` RULE-MCP-003 flips from "no authentication required" to per-call auth.
- `memory.md` RULE-MEM-001 and RULE-MEM-002 move from a static token to this `Principal`. Memory rows gain a user scope.


## Reuse

`AuthPort.verifyBearer` and `Principal` are transport-neutral, so any HTTP route protects itself the same way a private tool does. A future web frontend reuses the same session and JWKS.


## Examples

- `ask("Who is Markus?")` without token → runs
- `remember("...")` without token → `401`, sign in, retry → saved
- `remember(...)` as user A, then `recall(...)` as user B → B never sees A's data
