---
title: Test names quote spec rules verbatim
status: accepted
date: 2026-07-11
related: []
---

# Test names quote spec rules verbatim

Every test covering a spec rule uses the rule id and the rule's exact wording as its title. Rules too long for a readable title are split in the spec rather than paraphrased.

Why: a grep on a rule id then lands on the rule and every test that covers it, with the same words on both sides. Paraphrasing looked cleaner per test but let tests and rules drift silently.
