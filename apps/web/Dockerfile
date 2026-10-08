# base: Node + pnpm, shared by all stages
FROM node:24.15.0-alpine AS base
RUN corepack enable
WORKDIR /app

# fetch: download all deps to pnpm store using only the lockfile
FROM base AS fetch
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch

# deps: install from store after full source copy
FROM fetch AS deps
COPY . .
RUN pnpm install --frozen-lockfile --offline

# build: standalone Next.js server in apps/web/dist
FROM deps AS build
ARG API_URL
ARG SITE_HANDLE
RUN pnpm exec turbo run build --filter=@thoth/web

# runner: only the traced server files, no pnpm or sources
FROM node:24.15.0-alpine AS runner
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=8080
WORKDIR /app
COPY --from=build --chown=node:node /app/apps/web/dist/standalone ./
COPY --from=build --chown=node:node /app/apps/web/dist/static ./apps/web/dist/static
USER node
EXPOSE 8080
CMD ["node", "apps/web/server.js"]
