---
title: Errors
workspace: packages/utils
status: current
related: []
---

# Errors

`AppError` is the base class for domain errors. It carries an `ErrorCode` (string enum), an HTTP `status`, a `message`, and optional `fieldErrors`. HTTP subclasses lock their status.


## Rules

- [RULE-ERRORS-001] `BadRequest` sets status 400.
- [RULE-ERRORS-002] `Unauthorized` sets status 401.
- [RULE-ERRORS-003] `Forbidden` sets status 403.
- [RULE-ERRORS-004] `NotFound` sets status 404.
- [RULE-ERRORS-005] `Conflict` sets status 409.
- [RULE-ERRORS-006] `UnprocessableEntity` sets status 422.
- [RULE-ERRORS-007] `AppError.from` returns the same instance when given an `AppError`.
- [RULE-ERRORS-008] `AppError.from` returns a 500 `INTERNAL_ERROR` for unknown values.
- [RULE-ERRORS-009] `isServerError` is true when status is 500 or greater.
- [RULE-ERRORS-010] `fieldErrors` is optional and carried through when provided.
