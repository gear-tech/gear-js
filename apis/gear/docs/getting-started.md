# Getting Started

## Basic Connection

Start an API connection to a running node on localhost:

```typescript
import { GearApi } from '@gear-js/api';

// Connect to local node
const gearApi = await GearApi.create({ providerAddress: 'ws://127.0.0.1:9944' });
```

## Custom Node Connection

Read Vara mainnet state by providing its WebSocket address:

```typescript
// Connect to Vara mainnet for reads
const gearApi = await GearApi.create({
  providerAddress: 'wss://rpc.vara.network'
});
```

Use a local development node at `ws://127.0.0.1:9944` for tutorial deployments, messages and test transactions. The retired Vara Substrate testnet is no longer available. Mainnet transactions spend real VARA; the read connection above does not make tutorial writes safe to run on mainnet.

View mainnet activity in [Vara Explorer](https://explorer.vara.network/). Direct links use `/account/<address>`, `/block/<number>` and `/extrinsic/<block>-<index>`.

## Node Information

Retrieve basic information about the connected node:

```typescript
// Get node information
const chain = await gearApi.chain();
const nodeName = await gearApi.nodeName();
const nodeVersion = await gearApi.nodeVersion();
const genesis = gearApi.genesisHash.toHex();
```

## Runtime Versions

Different networks can have different runtime versions, which may affect extrinsic and RPC call signatures.
While the `GearApi` class provides general functionality for node interaction, specialized classes are available for specific runtime versions:

```typescript
import { VaraApiV1010 } from '@gear-js/api';

// For networks with runtime version 1010 or higher
const varaApi = await VaraApiV1010.create({
  providerAddress: 'wss://rpc.vara.network'
});
```
