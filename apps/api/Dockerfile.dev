# syntax=docker/dockerfile:1.7

# =========================================================
# Base: shared setup for all stages
# =========================================================
FROM node:24-alpine  AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# =========================================================
# Pruner: uses turbo to extract ONLY the files needed for
# apps/api (its own source + any internal workspace deps it
# actually uses — e.g. packages/db once it's added). Avoids
# copying the entire monorepo into every image and keeps
# layer caching precise.
#
# NOTE: turbo prune only picks up packages/db automatically
# once apps/api/package.json lists it as a real dependency,
# e.g. "@repo/db": "workspace:*". Nothing to change here
# when that happens — this stage handles it automatically.
# =========================================================
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo prune api --docker

# =========================================================
# Deps: install dependencies using the pruned lockfile.
# This layer only invalidates when deps actually change,
# not when app source code changes.
# =========================================================
FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# =========================================================
# Dev: fast iteration, hot reload via tsx watch.
# Source code is bind-mounted via docker-compose.dev.yml,
# NOT baked in here — that's what makes dev fast.
#
# Uses `turbo run dev --filter=api` (not plain `pnpm dev`)
# so that workspace dependencies like packages/db are picked
# up correctly per turbo.json's dependency graph — important
# once apps/api imports from packages/db.
# =========================================================
FROM deps AS dev
COPY --from=pruner /app/out/full/ .
WORKDIR /app
EXPOSE 3000
CMD ["pnpm", "turbo", "run", "dev", "--filter=api"]

# =========================================================
# Build: compiles TypeScript -> dist/server.mjs via tsup.
#
# `--filter=api` still builds packages/db (or any other
# workspace dep) FIRST automatically, as long as turbo.json's
# build task has "dependsOn": ["^build"] — turbo resolves
# the whole dependency graph, not just api in isolation.
# =========================================================
FROM deps AS build
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=api

# =========================================================
# Prod: minimal final image. No dev dependencies, no source,
# no build tools — just the compiled output + prod deps.
# =========================================================
FROM node:24-alpine  AS prod
ENV NODE_ENV=production
WORKDIR /app

# Run as non-root for security
RUN addgroup -S nodejs && adduser -S expressjs -G nodejs

COPY --from=build --chown=expressjs:nodejs /app/apps/api/dist ./dist
COPY --from=build --chown=expressjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=build --chown=expressjs:nodejs /app/node_modules ./node_modules

# Once packages/db exists and api imports it, also copy its
# build output so the compiled JS is resolvable at runtime:
# COPY --from=build --chown=expressjs:nodejs /app/packages/db/dist ./packages/db/dist
# COPY --from=build --chown=expressjs:nodejs /app/packages/db/package.json ./packages/db/package.json

USER expressjs
EXPOSE 3000

# Basic healthcheck — adjust path to a real /health route
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/server.mjs"]