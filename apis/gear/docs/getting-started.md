# Getting Started

## Basic Connection

Start an API connection to a running node on localhost:

```typescript
import { GearApi } from '@gear-js/api';

// Connect to local node
const gearApi = await GearApi.create();
```

## Custom Node Connection

Connect to a specific node by providing its WebSocket address:

```typescript
// Connect to a custom node
const gearApi = await GearApi.create({
  providerAddress: 'wss://someIP:somePort'
});
```

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
  providerAddress: 'wss://testnet.vara.network'
});
```

---
