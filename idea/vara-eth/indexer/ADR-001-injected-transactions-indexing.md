# ADR-001: Indexing Injected Transactions from Vara.Eth Node

**Status:** Proposed  
**Date:** 2026-05-04

---

## Context

The Vara.Eth indexer currently uses a Subsquid EVM processor to index Ethereum-side events (Router and Mirror contracts) and exposes the data via a NestJS REST API. Both run as worker threads inside a single Node.js process.

**Gap:** Injected transactions bypass Ethereum entirely — they are submitted directly to the Vara.Eth (Substrate/Gear) node and can only be retrieved by querying the node with a message ID. Those message IDs are present in `Reply` events already indexed by `MirrorHandler`, so the trigger exists but the data is never fetched.

---

## Decision

### 1. Separate the EVM Processor from the Explorer API

Run the Subsquid processor and the NestJS API as **separate services** (separate containers / processes) sharing the same PostgreSQL database.

**Rationale:**
- Independent scaling — API and processor have different load profiles
- Independent deploys — API changes don't require restarting the processor and vice versa
- Isolated failures — an API crash doesn't stall indexing, and vice versa
- Cleaner resource budgeting (CPU, memory, connection pools)

**Trade-off:** Slightly higher operational overhead (two deployments instead of one), but the current worker-supervisor approach couples failure domains unnecessarily and will hurt as load grows.

---

### 2. Add a Polling Enrichment Worker for Injected Transactions

Introduce a third worker (or separate service) that:

1. Polls PostgreSQL for `ReplyRequest` rows where `injectedTx IS NULL`
2. Calls the Vara.Eth node RPC with the message ID from each row
3. Writes the fetched data back to the `injectedTx` column (or a linked `InjectedTransaction` table)

**Why polling over a queue (BullMQ/Redis):** Injected transaction volume is low and slight indexing lag is acceptable. Un-enriched rows are a natural, visible retry queue — no additional infrastructure required. Migration to a queue-based approach is straightforward if volume grows.

**Why polling over inline fetching inside the Subsquid handler:** Inline fetching would couple Vara.Eth node availability to EVM indexing. A slow or unavailable node would stall all Ethereum block processing. Subsquid's batch processor is also not designed for side-effectful external calls mid-batch.

---

## Ownership Rules for Shared Database

Two services writing to the same database is acceptable with clear column ownership:

| Writer | Tables / Columns owned |
|--------|------------------------|
| EVM Processor | All entities — inserts only |
| Enrichment Worker | `injectedTx`-related columns on `ReplyRequest` — updates only |

Additional conventions:
- Add an `enrichedAt TIMESTAMPTZ` column to `ReplyRequest` to track enrichment status and make lag observable
- Set explicit connection pool size limits per service to prevent one starving the other
- Schema migrations are a shared concern — coordinate deploys when migrating tables touched by both services

---

## Options Considered and Rejected

**Inline fetch in Subsquid handler** — Couples Vara.Eth node failures to EVM indexing. No retry logic. Violates Subsquid's idempotency model.

**Queue-based enrichment (BullMQ + Redis)** — Best retryability and scalability, but adds Redis as a required dependency. Premature given current volume and the acceptable lag constraint.

**Separate Vara.Eth node subscriber** — Would provide full real-time coverage of Vara.Eth-side data, but is a significantly larger investment and outside the current scope.

---

## Consequences

- Vara.Eth node outages are isolated from EVM indexing
- Injected transactions appear in the database with a slight delay (seconds to minutes, depending on poll interval) — acceptable per requirements
- The API layer must handle `injectedTx IS NULL` as a valid in-progress state, not an error
- If injected transaction volume grows significantly, the enrichment worker can be promoted to a queue-based architecture without changing the surrounding data model
- Separating the processor and API removes the constraint that all components must be deployed and restarted together
