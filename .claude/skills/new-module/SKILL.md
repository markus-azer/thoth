---
name: new-module
description: |
  Scaffold a thoth API module from a spec. Creates domain, application, interface, and infrastructure files with ports, DI bindings, and test stubs. Use when the user asks to "scaffold a module", "new module", or "add a feature module".
---

# New Module

Scaffold a module or feature from a spec, following the API's clean-architecture layering.

Placeholders in this doc:
- `[name]` is the module name, lowercase (e.g. `auth`).
- `[Name]` is the PascalCase form (e.g. `Auth`).
- `[NAME]` is the uppercase form for rule IDs (e.g. `AUTH`).

## Layers

Imports point inward. Outer layers may import inner ones, never the reverse.

- `domain/` holds entities and types. It is pure, with zero imports and no validation.
- `application/` holds use-case services, input DTOs, and ports (interfaces) for volatile deps.
- `interface/` holds delivery adapters (HTTP controllers or MCP tools) and their response DTOs.
- `infrastructure/` holds adapters that touch IO or libraries. It is the only place `pg` and SQL live.

## Ask

1. Module name (e.g. `auth`)
2. Spec path (e.g. `apps/api/spec/auth.md`), or `--no-spec` to skip

## Spec check

- Spec must exist unless `--no-spec` is passed.
- If missing, stop and direct the user to create it under `apps/api/spec/`.
- If it exists, read it and extract inputs, outputs, and rules.

## Scaffold

**New module** (`apps/api/src/modules/[name]/` doesn't exist):
- `domain/[name].ts` for pure entities and types from the spec outputs.
- `application/[name].service.ts` for the service stub.
- `application/[name].dto.ts` for input schemas via `@thoth/utils` `z`. Derive the type with `z.infer`.
- `interface/[name].controller.ts` (or `[name].tool.ts` for MCP) for the delivery adapter.

For a volatile dependency like a database or external service:
- `application/[name].repository.ts` is a port, a `Symbol` token plus an interface.
- `infrastructure/[name].pg-repository.ts` is the adapter that implements the port and injects `Postgres`.
- The service injects the port, never the concrete adapter.

`index.ts` is the barrel. It exports the service, delivery adapter, DTOs, and ports. It never exports the domain or infrastructure adapters.

**DI** (`apps/api/src/di/index.ts`):
- Under `// [name] module`, bind the delivery adapter, then the port to its adapter, then the service.
- Import the port from the module barrel. Import the adapter straight from its file, since the DI root is the only place allowed to reach an adapter.
- If the `// [name] module` comment is missing, add it first.
- `new-router` later puts the router on top. The final order matches health: Router, Controller, port to adapter, Service.

**Tests** (`apps/api/test/modules/[name]/`):
- One `application/[name].service.test.ts` covering the spec rules.
- Write `it('RULE-[NAME]-NNN: <verbatim rule text>')`, one per rule. Use single quotes to match the health tests.

**Existing module** (e.g. adding `logout` to `auth`):
- Add methods to the existing service and DTOs to the existing `[name].dto.ts`.
- Update `index.ts` only if new exports are needed. Never overwrite existing files.

## Boundaries are enforced

biome and dependency-cruiser guard the layering. They keep the domain pure, the application pointing inward, the barrel free of domain, and cross-module imports going through barrels. Run `pnpm arch`. If a lint fires, an import is crossing a layer it should not.

## Before writing

Show the plan and wait for approval.

## Reference

See `apps/api/src/modules/health/` for the port and adapter pattern via `DbProbe`, and `apps/api/spec/health.md`.
