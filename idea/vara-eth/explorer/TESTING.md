# Explorer tests

Integration tests that exercise the full HTTP stack: NestJS/Fastify app → TypeORM → PostgreSQL.

## How it works

```
vitest
  └── global-setup.ts   – spins up Postgres, applies migrations, loads dump.sql
  └── tests/env.ts      – sets DB_URL placeholder so TypeORM config doesn't blow up at import time
  └── *.test.ts         – beforeAll(setup) starts the NestJS app, tests send supertest requests
```

**Each test file** calls `setup()`/`teardown()` from `tests/setup.ts`, which boots a NestJS app pointed at the shared DB and tears it down afterwards. All test files share one DB container (`fileParallelism: false`).

## Database

### Container (default)

Tests try to start a `postgres:15-alpine` Docker container via Testcontainers. If Docker is available this is the default path — no local Postgres needed.

### Local Postgres fallback

If Docker is unavailable, the setup falls back to a local Postgres instance. Configure with env vars:

| Variable | Default |
|---|---|
| `TEST_DB_HOST` | `127.0.0.1` |
| `TEST_DB_PORT` | `5432` |
| `TEST_DB_USERNAME` | `$USER` / `postgres` |
| `TEST_DB_PASSWORD` | _(empty)_ |

A fresh database named `vara_eth_test_<timestamp>` is created and dropped on teardown.

### Schema and seed data

1. Migrations from `idea/vara-eth/indexer-db/db/migrations/` are applied via `applyMigrations()`.
2. `dump.sql` (committed to this package) is loaded as seed data.

`dump.sql` contains a small, hand-curated snapshot of real data: 3 codes, 3 programs, 2 batches, 4 state transitions, 3 Ethereum txs, 5 message requests, 5 messages sent, 4 reply requests, 4 replies sent, 0 injected transactions. The IDs from this snapshot are exported from `tests/fixtures.ts` and used across all tests.

## Running tests locally

```sh
# from repo root
yarn test:varaeth-idea-explorer

# or inside the package
npx vitest run
npx vitest        # watch mode
```

The first run downloads a Postgres Docker image (~80 MB) if you have Docker.

## Regenerating dump.sql

Run when the DB schema changes (new migrations added) or when different seed data is needed:

```sh
# point at a real running Vara.Eth indexer DB
DB_NAME=vara_eth bash idea/vara-eth/explorer/scripts/generate-dump.sh
```

The script creates a temporary database, copies a limited number of rows from each table, dumps only the data, and writes `dump.sql`. After regenerating, update `tests/fixtures.ts` with the new IDs.

## CI

Tests run in the `test-vara-eth-idea-backend` job in `.github/workflows/CI-idea.yml`. The job installs Node 20, installs dependencies, builds the explorer (TypeScript → JS, required for migrations), then runs `yarn test:varaeth-idea-explorer`. Docker is available on `ubuntu-latest` runners, so Testcontainers is used automatically.
