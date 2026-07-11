---
name: new-module
description: |
  Scaffold a wadjet API module from a spec. Creates domain/application/interface files, DI bindings, and test stubs. Use when the user asks to "scaffold a module", "new module", or "add a feature module".
---

# New Module

Scaffold a module or feature from a spec.

Placeholders in this doc:
- `[name]` — module name, lowercase (e.g. `auth`).
- `[Name]` — PascalCase form (e.g. `Auth`).
- `[NAME]` — uppercase form for rule IDs (e.g. `AUTH`).

## Ask

1. Module name (e.g. `auth`)
2. Spec path (e.g. `apps/api/spec/auth.md`) — or `--no-spec` to skip

## Spec check

- Spec must exist unless `--no-spec` is passed.
- If missing → stop and direct user to create it under `apps/api/spec/`.
- If exists → read and extract inputs, outputs, rules.

## Scaffold

**New module** (`apps/api/src/modules/[name]/` doesn't exist):
- `domain/[name].ts` — pure TS types from spec outputs
- `application/[name].service.ts` — service stub per spec
- `interface/[name].dto.ts` — Zod schemas via `@wadjet/utils` `z` (has `.openapi()`)
- `interface/[name].controller.ts` — Express controller stub
- `index.ts` — exports service, controller, DTOs only

**DI** (`apps/api/src/di/index.ts`):
- Under `// [name] module`, bind the controller, then the service.
- If the comment is not there, add it first.
- When `new-router` runs later, it puts the router on top. Final order: Router, Controller, Service. Same as health.

**Tests** (`apps/api/test/modules/[name]/`):
- One `application/[name].service.test.ts` covering the spec rules.
- `it('RULE-[NAME]-NNN: <verbatim rule text>')` — one per rule. Use single quotes to match the health tests.

**Existing module** (e.g. adding `logout` to `auth`):
- Add methods to existing service.
- Add DTOs to existing `[name].dto.ts`.
- Update `index.ts` if new exports needed.
- Never overwrite existing files.

## Before writing

Show the plan and wait for approval.

## Reference

See `apps/api/src/modules/health/` and `apps/api/spec/health.md` for conventions.
