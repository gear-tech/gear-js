# Block Operations

The API provides various methods to interact with blockchain blocks.

## Block Data Retrieval

### Get Block Data

Retrieve detailed information about a specific block:

```typescript
import { GearApi, HexString } from '@gear-js/api';

const api = await GearApi.create();

// Get block by number or hash
const blockId = 12345; // or '0x...'
const block = await api.blocks.get(blockId);

console.log('Block details:', block.toHuman());
```

### Get Block Timestamp

Retrieve the timestamp of a specific block:

```typescript
import { GearApi, HexString } from '@gear-js/api';

const api = await GearApi.create();

// Get timestamp by block number or hash
const blockId = 12345; // or '0x...'
const timestamp = (await api.blocks.getBlockTimestamp(blockId)).toNumber();

console.log('Block timestamp:', new Date(timestamp).toISOString());
```

## Block Hash Operations

### Get Block Hash

Get the hash of a block by its number:

```typescript
import { GearApi, HexString } from '@gear-js/api';

const api = await GearApi.create();

const blockNumber = 12345;
const blockHash = (await api.blocks.getBlockHash(blockNumber)).toHex();

console.log('Block hash:', blockHash);
```

### Get Block Number

Get the block number from its hash:

```typescript
import { GearApi, HexString } from '@gear-js/api';

const api = await GearApi.create();

const blockHash = '0x...';
const blockNumber = (await api.blocks.getBlockNumber(blockHash)).toNumber();

console.log('Block number:', blockNumber);
```

## Block Content

### Get Block Events

Retrieve all events from a specific block:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

const blockHash = '0x...';
const events = await api.blocks.getEvents(blockHash);

console.log('Block events:');
events.forEach((event, index) => {
  console.log(`Event ${index + 1}:`, event.toHuman());
});
```

### Get Block Extrinsics

Retrieve all extrinsics (transactions) from a specific block:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

const blockHash = '0x...';
const extrinsics = await api.blocks.getExtrinsics(blockHash);

console.log('Block extrinsics:');
extrinsics.forEach((extrinsic, index) => {
  console.log(`Extrinsic ${index + 1}:`, extrinsic.toHuman());
});
```

---