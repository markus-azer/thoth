---
title: ...
workspace: apps/...
status: current
related: []
---

# [Module]
<!-- What this module does in one line. -->


## Inputs _(if applicable)_
<!-- What the module receives. -->
- field: type


## Outputs _(if applicable)_
<!-- All possible outcomes. Success and failures. -->
- SUCCESS
- ERROR_CASE


## Rules
<!-- Each rule has a unique ID: RULE-[MODULE]-[NNN]. -->
<!-- Referenced in test names: "RULE-XXX-001: description". -->
- [RULE-XXX-001] rule description.


## Examples _(if applicable)_
<!-- Concrete input → output pairs that make rules unambiguous. -->
action("input") → OUTPUT


## API _(if exposed)_
<!-- Only if this module has an HTTP interface. -->
POST /route
Body: { field: type }
Response: 200 | 400 | 404


---


# Example: Login

Authenticates a user with email and password.


## Inputs

- email: string
- password: string


## Outputs

- SUCCESS
- INVALID_INPUT
- USER_NOT_FOUND


## Rules

- [RULE-LOGIN-001] Email is case-insensitive.
- [RULE-LOGIN-002] Password must be ≥ 8 characters.
- [RULE-LOGIN-003] Empty email or password → INVALID_INPUT.
- [RULE-LOGIN-004] Unknown email → USER_NOT_FOUND.


## Examples

login("test@test.com", "password123") → SUCCESS
login("TEST@TEST.COM", "password123") → SUCCESS
login("", "password123") → INVALID_INPUT
login("test@test.com", "short") → INVALID_INPUT
login("unknown@test.com", "password123") → USER_NOT_FOUND


## API _(if exposed)_

POST /auth/login
Body: { email: string, password: string }
Response: 200 | 400 | 404
