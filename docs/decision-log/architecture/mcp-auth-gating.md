---
title: Per-tool MCP auth on a single server
status: accepted
date: 2026-08-16
related: [http-framework]
---

# Per-tool MCP auth on a single server

One MCP server served both public and private tools. Private calls without a valid bearer were refused with `401` plus `WWW-Authenticate`; discovery, listing, and public calls stayed anonymous. This is the spec's lazy-auth pattern.

Lazy clients got true mixed access. Eager clients probed the origin-root metadata at connect and gated the whole server behind one sign-in — treated as their bug to fix, not designed around.

## Rejected alternatives

Split across two origins. Works on eager clients, but adds infrastructure to route around a client bug.

Drop root metadata, rely on the `401` header. Unverified whether eager clients honor `WWW-Authenticate`.

Why: one spec-correct server needs no extra infrastructure. The eager-client gate costs one sign-in, not lost function.
