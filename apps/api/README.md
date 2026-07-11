# @thoth/api

HTTP service with lifecycle-managed startup and shutdown.

```sh
pnpm dev        # tsx --watch
pnpm test       # vitest
pnpm typecheck
pnpm build      # tsup
```

## Run with Docker

```sh
cp apps/api/.env.example apps/api/.env
pnpm compose:up      # or compose:watch for file-sync reload
```

Ports: API `3002`, metrics `9090`, postgres `5432`. Stop with `pnpm compose:down`.
