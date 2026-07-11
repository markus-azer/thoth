---
name: new-router
description: |
  Expose a wadjet API module via HTTP. Creates the injectable router, wires DI, exports through the http barrel, and mounts in app-router. Use when the user asks to "wire a router", "expose HTTP routes", or "new router".
---

# New Router

Expose a module via HTTP.

Placeholders in this doc:
- `[name]` — module name, lowercase (e.g. `auth`).
- `[Name]` — PascalCase form (e.g. `Auth`).

Run `new-module` first if the module doesn't exist yet.

## Ask

1. Module name (e.g. `auth`)
2. Spec path (e.g. `apps/api/spec/auth.md`) — must exist, read API section for routes.

## Steps

**Router** (`apps/api/src/infrastructure/http/routes/[name].router.ts`):
- If exists → add new routes from spec.
- If not → create with `@injectable()` class, inject controller, register OpenAPI paths and schemas from spec.

**Barrel** (`apps/api/src/infrastructure/http/index.ts`):
- Add `export { [Name]Router } from "./routes/[name].router";` alongside the existing router exports.

**DI** (`apps/api/src/di/index.ts`):
- Under `// [name] module`, bind the router first, above the controller and service. Final order: Router, Controller, Service. Same as health.
- If the comment is not there (module was set up by hand), add it first, then bind.

**App router** (`apps/api/src/infrastructure/http/app-router.ts`):
- Inject new router in constructor.
- Mount at `app.use("/[name]", this.[name]Router.routes);` — match existing double-quote + semicolon style.
- If already mounted → skip.

## Before writing

Show the plan and wait for approval.

## Reference

See `apps/api/src/infrastructure/http/routes/health.router.ts` and `apps/api/src/di/index.ts` for conventions.
