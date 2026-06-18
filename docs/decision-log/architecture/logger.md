---
title: pino logger with flush-before-exit
status: accepted
date: 2026-06-17
related: [lifecycle]
---

# pino logger with flush-before-exit

Logging goes through [pino](https://github.com/pinojs/pino) wrapped in a thin `Log` facade exposing `{ debug, info, warn, error, flush }` with a `(msg, ctx)` signature.

Why: pino is the fastest structured logger for Node and emits JSON natively. The facade keeps call sites independent of pino so the implementation can swap. `flush` is on the surface so the lifecycle manager can drain pino's buffer before exit.
