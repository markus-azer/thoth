---
title: Logger
workspace: packages/utils
status: current
related: []
---

# Logger

`createLogger(opts)` returns `{ log, pinoInstance }`. `log` is a thin facade over [pino](https://github.com/pinojs/pino) exposing `debug`, `info`, `warn`, `error`, `flush`. Each takes `(msg, ctx)`.


## Rules

- [RULE-LOGGER-001] Output is JSON by default.
- [RULE-LOGGER-002] When `opts.prettyPrint` is true, output is pretty via `pino-pretty`.
- [RULE-LOGGER-003] `pinoInstance` is returned alongside `log` for middleware like `pino-http`.
- [RULE-LOGGER-004] `flush()` returns a promise that resolves when pino's buffer drains.
