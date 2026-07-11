# base: Node + pnpm, shared by all stages
FROM node:24.15.0-alpine AS base
RUN corepack enable
WORKDIR /app

# fetch: download all deps to pnpm store using only the lockfile
FROM base AS fetch
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch

# deps: install from store after full source copy (scales to new packages)
FROM fetch AS deps
COPY . .
RUN pnpm install --frozen-lockfile --offline

# dev: hot-reload via tsx, used by docker-compose
FROM deps AS dev
EXPOSE 3002 9090
WORKDIR /app/apps/api
CMD ["pnpm", "dev"]

# build: compile the api app, then flatten workspace deps for prod
FROM deps AS build
RUN pnpm --filter @wadjet/api build \
 && pnpm --filter @wadjet/api deploy --prod /prod/api

# runner: slim production image
FROM node:24.15.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# tini as PID 1 for clean signal handling
RUN apk add --no-cache tini

COPY --from=build /prod/api/node_modules ./node_modules
COPY --from=build /prod/api/dist ./dist
COPY --from=build /prod/api/package.json ./

# drop root for security
USER node
EXPOSE 3002 9090
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
