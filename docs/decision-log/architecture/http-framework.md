---
title: Express with @promster/express for HTTP
status: accepted
date: 2026-07-08
related: [di, admin-port]
---

# Express with @promster/express for HTTP

Express 5 was chosen for all HTTP in `apps/api`: the public API and the admin/metrics server. `@promster/express` auto-instruments requests.

Why: helmet, cors, pino-http, promster, and supertest all plug into Express with one `app.use()`. Fastify was rejected — parallel ecosystem, no clear win at this scale.
