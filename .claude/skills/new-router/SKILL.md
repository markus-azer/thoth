---
name: new-router
description: |
  Expose a wadjet API module via HTTP. Creates the injectable router, wires DI, exports through the http barrel, and mounts in app-router. Use when the user asks to "wire a router", "expose HTTP routes", or "new router".
---

# New Router

Expose a module via HTTP.

`[name]` in this doc is a placeholder. Substitute the actual module name (e.g. `auth`) everywhere it appears. Run `new-module` first if the module doesn't exist yet.

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
- Bind router under the existing `// [name] module` comment.
- If the comment is absent (module bootstrapped without `new-module`) → create it first, then bind.
- Service and controller are already bound by `new-module`.

**App router** (`apps/api/src/infrastructure/http/app-router.ts`):
- Inject new router in constructor.
- Mount at `app.use("/[name]", this.[name]Router.routes);` — match existing double-quote + semicolon style.
- If already mounted → skip.

## Before writing

Show the plan and wait for approval.

## Reference

See `apps/api/src/infrastructure/http/routes/health.router.ts` and `apps/api/src/di/index.ts` for conventions.
