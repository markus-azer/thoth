# New Router

Expose a module via HTTP.

## Ask

1. Module name (e.g. `auth`)
2. Spec path (e.g. `apps/api/spec/auth.md`) — must exist, read API section for routes.

## Steps

**Router** (`apps/api/src/infrastructure/http/routes/[name].router.ts`):
- If exists → add new routes from spec.
- If not → create with `@injectable()` class, inject controller, register OpenAPI paths and schemas from spec.

**DI** (`apps/api/src/di/index.ts`):
- Bind router only under the existing `// [name] module` comment.
- Service and controller are already bound by `new-module`.

**App router** (`apps/api/src/infrastructure/http/app-router.ts`):
- Inject new router in constructor.
- Mount at `app.use('/[name]', this.[name]Router.routes)`.
- If already mounted → skip.

## Before writing

Show the plan and wait for approval.

## Reference

See `apps/api/src/infrastructure/http/routes/health.router.ts` and `apps/api/src/di/index.ts` for conventions.
