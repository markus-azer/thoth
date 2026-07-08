---
title: OpenAPI from zod schemas, dev-only Swagger UI
status: accepted
date: 2026-07-09
related: []
---

# OpenAPI from zod schemas, dev-only Swagger UI

Chose `@asteasolutions/zod-to-openapi` so route schemas double as the spec. Swagger UI at `/docs` and JSON at `/openapi.json`, both gated to non-prod.

Why: routes already validate with zod. A separate hand-written spec drifts. Dev-only serving keeps the prod surface small and the CSP tight.
