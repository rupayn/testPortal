# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.13.1

# ─────────────────────────────────────
# Base
# ─────────────────────────────────────
FROM node:${NODE_VERSION}-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


# ─────────────────────────────────────
# Prune
# ─────────────────────────────────────
FROM base AS pruner

COPY . .

RUN pnpm turbo prune api --docker


# ─────────────────────────────────────
# Dependencies + Build
# ─────────────────────────────────────
FROM base AS builder

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

# Copy the actual source
COPY --from=pruner /app/out/full/ .

# Generate Prisma client
RUN pnpm --filter @repo/db exec prisma generate

# Build API
RUN pnpm turbo run build --filter=api


# ─────────────────────────────────────
# Production deployment
# ─────────────────────────────────────
FROM builder AS deploy

RUN pnpm deploy \
    --filter=api \
    --prod \
    --config.auto-install-peers=false \
    /app/deploy


# ─────────────────────────────────────
# Production
# ─────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S -g 1001 nodejs \
    && adduser -S -u 1001 -G nodejs nodejs \
    && mkdir -p /app/data/geoip \
    && chown -R nodejs:nodejs /app

COPY --from=builder --chown=nodejs:nodejs \
    /app/apps/api/dist ./dist

COPY --from=deploy --chown=nodejs:nodejs \
    /app/deploy/node_modules ./node_modules

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.mjs"]