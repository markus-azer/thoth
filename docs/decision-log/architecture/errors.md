---
title: AppError hierarchy with string enum codes
status: accepted
date: 2026-06-23
related: []
---

# AppError hierarchy with string enum codes

`AppError` was adopted as the single base class for domain errors, extended by HTTP subclasses (`BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `Conflict`, `UnprocessableEntity`) that lock their status. `ErrorCode` was defined as a TypeScript string enum rather than free-form strings.

Why: locking status per subclass encodes intent at the throw site and keeps HTTP mapping mechanical in the response layer. A string enum keeps codes legible in logs and support tickets while catching typos at build time. Free-form string codes were rejected for lack of compile-time safety. Numeric codes were rejected for opacity in logs.
