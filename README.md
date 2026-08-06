# TestPortal Monorepo

A [Turborepo](https://turborepo.dev/) monorepo powered by [pnpm](https://pnpm.io/) workspaces.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `apps/api`: the backend API service (Node.js / TypeScript, run via `tsx watch`)
- `packages/db`: shared database client/schema, used by `api`
- `packages/ui`: shared React component library
- `packages/eslint-config`: shared `eslint` configurations
- `packages/typescript-config`: shared `tsconfig.json` base configs used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already set up for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [pnpm workspaces](https://pnpm.io/workspaces) for dependency management across packages

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/) & Docker Compose (for local dev environment)

## Getting started

Install dependencies from the repo root:

```sh
pnpm install
```

## Develop

To run all apps and packages in dev mode:

```sh
turbo dev
```

Without global `turbo`:

```sh
pnpm exec turbo dev
```

To run a specific app, use a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```sh
turbo dev --filter=api
```

### Running with Docker

The `api` service can also be run in a containerized dev environment:

```sh
docker compose -f infra/docker/docker-compose.dev.yml up
```

To rebuild the image after adding new workspace packages or changing dependencies:

```sh
docker compose -f infra/docker/docker-compose.dev.yml build --no-cache
docker compose -f infra/docker/docker-compose.dev.yml up
```

## Build

To build all apps and packages:

```sh
turbo build
```

Build a specific package:

```sh
turbo build --filter=api
```

## Workspace dependency convention

Internal packages are linked using pnpm's `workspace:` protocol. This repo uses:

```json
"@repo/db": "workspace:^"
```

Since these packages are internal and not published to npm, `workspace:^` and `workspace:*` behave identically during local development — both resolve to the local package via symlink. Stick to `workspace:^` for consistency across the repo.

## Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines and CI/CD pipelines.

```sh
turbo login
turbo link
```

## Useful Links

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
