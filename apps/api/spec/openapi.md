---
title: OpenAPI
workspace: apps/api
status: current
related: []
---

# OpenAPI

Serves the generated OpenAPI 3.1 document and a Swagger UI for it. Both are gated to non-prod.


## Rules

- [RULE-OAS-001] serves the OpenAPI document at /openapi.json
- [RULE-OAS-002] serves Swagger UI at /docs
- [RULE-OAS-003] both routes are hidden when env.isProd is true
