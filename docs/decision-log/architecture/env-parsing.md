---
title: Envalid for env parsing
status: accepted
date: 2026-07-08
related: []
---

# Envalid for env parsing

Envalid was chosen to validate `process.env` at bootstrap.

Why: zod is overkill for a flat env whose only complexity is "required, typed, one-of". Hand-rolled parsing duplicates envalid's fail-fast reporting.
