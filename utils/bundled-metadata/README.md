# @gear-js/bundled-metadata

Pre-fetched Vara runtime metadata, keyed by `(genesisHash, specVersion)`.

Pass it to `GearApi.create({ provider, metadata: BUNDLED_METADATA })` (or
`ApiPromise.create({ provider, metadata: BUNDLED_METADATA })`) to skip
the `state_getMetadata` round-trip on cold start — saves ~500-1500 ms on a
public RPC.

## Scope

Today the bundle covers Vara **mainnet** and **testnet** only
(see `scripts/bundled-metadata.config.json` at the monorepo root). When a
consumer's endpoint matches a key in the map, polkadot-js uses the
cached metadata; when it doesn't, polkadot-js silently re-fetches.

This package will not help consumers pointed at local dev chains,
parachains, or any non-Vara Substrate runtime.

## Usage

```ts
import { BUNDLED_METADATA } from '@gear-js/bundled-metadata';
import { GearApi } from '@gear-js/api';

const api = await GearApi.create({
  providerAddress: 'wss://rpc.vara.network',
  metadata: BUNDLED_METADATA,
});
```

Browsers should prefer a dynamic import so Vite/Rollup emit a separate
chunk for the ~1.2 MB blob:

```ts
const { BUNDLED_METADATA } = await import('@gear-js/bundled-metadata');
```

## Refresh

`.github/workflows/refresh-bundled-metadata.yml` runs every Monday at
06:00 UTC. It fetches the current metadata from each configured RPC,
validates it by reconstructing an `ApiPromise` and decoding a known
extrinsic, then opens a PR if the content hash changed.

Manual refresh:

```sh
node scripts/fetch-bundled-metadata.mjs
```

## Failure modes

- **Stale key** (runtime upgrade between weekly refreshes): polkadot-js
  silently re-fetches via `state_getMetadata`. Consumer falls back to
  the original slow path — no crash, just no speed-up that session.
- **Corrupted blob with matching key**: caught at generation time by
  the `validateBundle` step in `scripts/fetch-bundled-metadata.mjs`,
  which reconstructs an `ApiPromise` from the generated map and decodes
  a known extrinsic before writing.
- **Build-config drift** (broken `exports` field, missing CJS variant):
  caught by `test/index.test.ts` — a boundary smoke test that imports
  from the built package and asserts the data is structurally valid.
