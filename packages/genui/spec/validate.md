---

title: Generated UI validation
workspace: packages/genui
status: current
related: []
---

# Generated UI validation

A program is the text the model writes. It is checked against the library.

## Rules

- [RULE-VALIDATE-001] A program that uses only library components is valid.
- [RULE-VALIDATE-002] A program that uses an unknown component is invalid.
- [RULE-VALIDATE-003] An empty program is invalid.
- [RULE-VALIDATE-004] A program without a `root` is invalid.
- [RULE-VALIDATE-005] A program whose `root` is not a `Stack` is invalid.
- [RULE-VALIDATE-006] A prop of the wrong type is invalid.
- [RULE-VALIDATE-007] A program that refers to a statement it never defines is invalid.
- [RULE-VALIDATE-008] A program with a statement that nothing uses is invalid.
- [RULE-VALIDATE-009] A validator checks programs against the library it is given.
- [RULE-VALIDATE-010] A valid program has no problems.
- [RULE-VALIDATE-011] Each problem names what is wrong.
- [RULE-VALIDATE-012] A problem inside a child is reported once.
- [RULE-VALIDATE-013] A truncated program is invalid.
