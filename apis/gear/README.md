<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear-JS API
</h3>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
    <a href="https://www.npmjs.com/package/@gear-js/api"><img src="https://img.shields.io/npm/v/@gear-js/api.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@gear-js/api"><img src="https://img.shields.io/npm/dm/@gear-js/api.svg" alt="Downloads"></a>
    <a href="https://github.com/gear-tech/gear-js/tree/master/apis/gear"><img src="https://img.shields.io/badge/Gear-TypeScript-blue?logo=typescript" alt="Gear TypeScript"></a>
</p>
<p align="center">
    <a href="https://wiki.gear-tech.io"><img src="https://img.shields.io/badge/Gear-Wiki-orange?logo=bookstack" alt="Gear Wiki"></a>
    <a href="https://idea.gear-tech.io"><img src="https://img.shields.io/badge/Gear-IDEA-blue?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBrVLLDYMwDH0OG7ABG5QNYIOwQRmhI3QERmCDMAIjsEFHgA2SDZyk5lRU1LQvQXLi2M+fDUQkLPpKz7MjNS/eN3VHGthSe0SHw2kN8bkwR4Rd9I3JGzWvkxXkQFD0z6Qs+6O0IQ9BlvXZVPDQYr9aNBglXmVUBqHLpCwqD6FTqhYHkfJkODmIpBMdEJVGh7pBZPmk+1rKL3lRfgeTxGrVY2T6z1TbUTKBhLrB1l4DkT+pMoBRzA5k4gCSzQP6wQlxwzh5ZgAAAABJRU5ErkJggg==" alt="Gear IDEA"></a>
</p>
<hr>


# Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Payload Encoding](#payload-encoding)
- [Gear Extrinsics](#gear-extrinsics)
- [Program State](#program-state)
- [Events](#events)
- [Block Operations](#block-operations)
- [Keyring Management](#keyring-management)
- [Base Gear Program](#base-gear-program)

---

# Description

The `@gear-js/api` library provides a comprehensive set of tools and methods for developers to interact with the Gear Protocol and build decentralized applications (dApps) on top of it.

Built on top of the [@polkadot-js/api](https://github.com/polkadot-js/api) library, it extends functionality by providing additional methods and classes specific to the Gear Protocol. This includes:

- Gear programs deployment and interaction
- Message handling and state management
- Event subscription and monitoring
- Blockchain state queries
- Transaction management

---

# Installation

## Prerequisites

- Node.js 20

## Using npm

```sh
npm install @gear-js/api
```

## Using yarn

```sh
yarn add @gear-js/api
```

## Peer Dependencies

The library has the following peer dependencies that you might need to install:

```sh
npm install @polkadot/api @polkadot/types
```

or

```sh
yarn add @polkadot/api @polkadot/types
```

---

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

# Payload Encoding

The `CreateType` class provides functionality for encoding and decoding payloads using SCALE codec. This is necessary since all data sent to programs on the blockchain must be in bytes format.

## Initialization

There are three ways to initialize `CreateType`:

```typescript
import { CreateType } from '@gear-js/api';

// 1. Default initialization - uses built-in type registry
const defaultCreateType = new CreateType();

// 2. With custom types
const customCreateType = new CreateType({
  MyStruct: {
    field1: 'u8',
    field2: 'String'
  }
});

// 3. With hex metadata
const metadataCreateType = new CreateType('0x...'); // hex-encoded metadata
```

## Encoding/Decoding Data

### Using Static Method

The simplest way to encode/decode data is using the static `create` method:

```typescript
import { CreateType } from '@gear-js/api';

// Encode a string
const encoded = CreateType.create('String', 'Hello, World');
console.log('Hex:', encoded.toHex());

// Decode hex data
const decoded = CreateType.create('String', '0x48656c6c6f2c20576f726c64');
console.log('Value:', decoded.toString());

// Using custom types with registry
const withRegistry = CreateType.create('MyCustomType', data, '0x...'); // hex registry
```

### Using Instance Methods

For more control and reusability, create an instance:

```typescript
// Initialize with custom types
const createType = new CreateType({
  User: {
    name: 'String',
    age: 'u8',
    isActive: 'bool'
  },
  Message: {
    sender: 'User',
    content: 'String',
    timestamp: 'u64'
  }
});

// Encode user data
const user = createType.create('User', {
  name: 'Alice',
  age: 25,
  isActive: true
});

// Available codec methods
console.log('Hex:', user.toHex());       // Get hex representation
console.log('Human:', user.toHuman());    // Get human-friendly format
console.log('JSON:', user.toJSON());      // Get JSON format
console.log('Bytes:', user.toU8a());      // Get Uint8Array bytes
console.log('String:', user.toString());  // Get string representation

// Encode nested structures
const message = createType.create('Message', {
  sender: {
    name: 'Bob',
    age: 30,
    isActive: true
  },
  content: 'Hello Alice!',
  timestamp: 1234567890
});
```

### Register Additional Types

You can register additional types after initialization:

```typescript
const createType = new CreateType();

// Register new types
createType.registerCustomTypes({
  Balance: 'u128',
  AccountInfo: {
    nonce: 'u32',
    balance: 'Balance'
  }
});

// Use newly registered types
const account = createType.create('AccountInfo', {
  nonce: 1,
  balance: '1000000000000'
});
```


---

# Gear Extrinsics

Extrinsics are used to interact with programs running on blockchain networks powered by Gear Protocol. 

## Program Management

### Upload Program

Upload a new program to the blockchain:

```typescript
import { GearApi } from '@gear-js/api';
import { readFileSync } from 'fs';

// Read program WASM
const code = readFileSync('path/to/program.wasm');

// Prepare upload parameters
const program = {
  code,
  gasLimit: 1_000_000,
  value: 1000,
  initPayload: '0x...' // hex encoded payload,
};

// Create and send extrinsic
const { programId, codeId, salt, extrinsic } = 
  api.program.upload(program);

await extrinsic.signAndSend(account, ({ events, status }) => {
  if (status.isInBlock) {
    console.log('Included in block:', status.asInBlock.toHex());
  }
});
```

### Upload Code

Upload program code separately:

```typescript
import { GearApi } from '@gear-js/api';
import { readFileSync } from 'fs';

const code = readFileSync('path/to/program.opt.wasm');
const { codeHash } = await api.code.upload(code);

await api.code.signAndSend(account, ({ events }) => {
  events.forEach(({ event: { method, data } }) => {
    if (method === 'CodeChanged') {
      console.log('Code uploaded:', data.toHuman());
    } else if (method === 'ExtrinsicFailed') {
      throw new Error(`Upload failed: ${data.toString()}`);
    }
  });
});
```

### Create Program from Existing Code

Create a new program instance from previously uploaded code:

```typescript
import { GearApi } from '@gear-js/api';

const program = {
  codeId: '0x...',
  gasLimit: 1_000_000,
  value: 1000,
  initPayload: '0x...' // hex encoded payload,
};

const { programId, salt, extrinsic } = 
  api.program.create(program);

await extrinsic.signAndSend(account, ({ status }) => {
  if (status.isInBlock) {
    console.log('Program created in block:', status.asInBlock.toHex());
  }
});
```

## Message Handling

### Send Message

Send a message to a program:

```typescript
import { GearApi } from '@gear-js/api';

try {
  const message = {
    destination: '0x...', // program ID
    payload: '0x...', // hex encoded payload
    gasLimit: 10_000_000,
    value: 1000,
    keepAlive: true, // protect account from removal due to low balance
  };
  
  // Send message
  let extrinsic = await api.message.send(message);
  
  await extrinsic.signAndSend(account, ({ events, status }) => {
    if (status.isInBlock) {
      console.log('Transaction added in block:', status.asInBlock.toHex());
      const messageQueuedEvent = events.find(({ event: { method } }) => method === 'MessageQueued');
      console.log(`Id of the sent message is ${messageQueuedEvent.event.data[0].toHex()}`);
    }
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

### Send Reply

Reply to a received message:

```typescript
import { GearApi } from '@gear-js/api';

const reply = {
  replyToId: '0x...', // original message ID
  payload: '0x...', // hex encoded payload
  gasLimit: 10_000_000,
  value: 1000,
  keepAlive: true,
};

const extrinsic = await api.message.sendReply(reply);

await extrinsic.signAndSend(account, ({ events, status }) => {
  if (status.isInBlock) {
    console.log('Transaction added in block:', status.asInBlock.toHex());
  }
});
```

## Transaction Management

### Calculate Transaction Fee

Get the transaction fee before sending:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();
const tx = api.program.upload({ code, gasLimit });

const paymentInfo = await tx.paymentInfo(account);
const transactionFee = paymentInfo.partialFee.toNumber();
console.log('Transaction fee:', transactionFee);
```

### Calculate Gas

Calculate minimum gas required for different operations:

```typescript
import { GearApi } from '@gear-js/api';


const gas = await api.program.calculateGas.handle(
  '0x...', // source ID
  '0x...', // program ID
  '0x...', // payload
  0,     // value
  false, // allow other panics
);

console.log('Gas calculation:', gas.toHuman());
```

Available gas calculation methods:
- `calculateGas.init`: For program initialization during upload
- `calculateGas.initCreate`: For program initialization during creation
- `calculateGas.handle`: For handling messages
- `calculateGas.reply`: For reply messages

---

# Program State

## Program Existence Check

To verify if an address belongs to a program, use the `api.program.exists` method:

```typescript
import { GearApi } from '@gear-js/api';

const programId = '0x...';
const programExists = await api.program.exists(programId);

console.log(`Program ${programId} ${programExists ? 'exists' : "doesn't exist"}`);
```

## Query program state

The `api.message.calculateReply` method allows you to read a program's state by simulating a message interaction without creating an actual transaction. This method was introduced in `gear` pallet v1.2.0 and provides a way to query program state through message simulation.

```typescript
import { GearApi, decodeHexTypes, encodePayload } from '@gear-js/api';

const programId = '0x..';
const origin = '0x...'; // sender's address

const params = {
  origin,
  destination: programId,
  payload: '0x...',
  value: 0
};

const result = await api.message.calculateReply(params);

console.log('Full result:', result.toJSON());
```

## Read state of a program using program's `state` entrypoint

> **Note:** This functionality is deprecated. Please use `api.message.calculateReply` instead to read program state by simulating message interactions. See the [Calculate Reply](#query-program-state) section above for details.

## Code Management

### List Uploaded Codes

Retrieve IDs of all uploaded program codes:

```typescript
const codeIds = await api.code.all();
console.log('Uploaded code IDs:', codeIds);
```

## Message Management

### Mailbox Operations

The mailbox contains pending messages awaiting user action.

#### Read Mailbox

```typescript
const api = await GearApi.create();
const address = '0x...';
const mailbox = await api.mailbox.read(address);
console.log('Mailbox messages:', mailbox);
```

#### Claim Value

Claim value from a mailbox message:

```typescript
const api = await GearApi.create();
const messageId = '0x...';

// Prepare the transaction
const tx = await api.mailbox.claimValue.submit(messageId);

// Sign and send the transaction
await tx.signAndSend(account, ({ events, status }) => {
  if (status.isInBlock) {
    console.log('Transaction included in block:', status.asInBlock.toHex());
  }
});
```

### Waitlist Operations

Read a program's waitlist (messages waiting to be processed):

```typescript
const api = await GearApi.create();
const programId = '0x...';
const waitlist = await api.waitlist.read(programId);
console.log('Program waitlist:', waitlist);
```

---

# Events

## Event Handling

### Subscribe to All Events

Monitor all system events:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Subscribe to all events
const unsubscribe = await api.query.system.events((events) => {
  console.log('New events:', events.toHuman());
});

// Later: unsubscribe to stop receiving events
unsubscribe();
```

## RPC Subscriptions

The API provides specialized RPC subscriptions for real-time tracking of specific blockchain events. These subscriptions are more efficient than polling and allow you to listen for specific event types with filtering capabilities.

### Subscribe to User Message Sent Events

Subscribe to messages sent from programs to users with optional filtering:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Basic subscription - listen to all user message sent events
const unsubscribe = await api.message.subscribeUserMessageSent(
  {}, // empty filter means listen to all events
  (item) => {
    console.log('Message sent:', {
      id: item.id,
      source: item.source,
      destination: item.destination,
      payload: item.payload,
      value: item.value.toString(),
      block: item.block,
      index: item.index,
    });
  }
);

// Later: unsubscribe to stop receiving events
unsubscribe();
```

#### Filtering by Source or Destination

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Listen only to messages from a specific program
const unsubscribe = await api.message.subscribeUserMessageSent(
  {
    source: '0x...', // program ID to listen for
  },
  (item) => {
    console.log('Message from program:', item);
  }
);
```

#### Filtering by Payload

The API allows filtering by message payload using `PayloadFilter`:

```typescript
import { GearApi, PayloadFilter } from '@gear-js/api';

const api = await GearApi.create();

// Create payload filters
const filter1 = new PayloadFilter();
filter1.setBytes('0xdeadbeef'); // Match payload by exact bytes

const unsubscribe = await api.message.subscribeUserMessageSent(
  {
    destination: '0x...', // listen to messages sent to this address
    payloadFilters: [filter1],
  },
  (item) => {
    console.log('Filtered message:', item);
  }
);
```

#### Filtering by Block Range

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Listen to events starting from a specific block
const unsubscribe = await api.message.subscribeUserMessageSent(
  {
    fromBlock: 12345, // start listening from block 12345
    finalizedOnly: true, // only process finalized blocks
  },
  (item) => {
    console.log('Event from block:', item.block);
  }
);
```

#### Full Example with All Filters

```typescript
import { GearApi, PayloadFilter } from '@gear-js/api';

const api = await GearApi.create();

const payloadFilter = new PayloadFilter();
payloadFilter.setBytes('0xcafebabe');

const unsubscribe = await api.message.subscribeUserMessageSent(
  {
    source: '0x...', // program sending the message
    destination: '0x...', // user receiving the message
    payloadFilters: [payloadFilter],
    fromBlock: 1000,
    finalizedOnly: true,
  },
  async (item) => {
    console.log('Received message:', {
      id: item.id,
      block: item.block,
      index: item.index,
      source: item.source,
      destination: item.destination,
      payload: item.payload,
      value: item.value.toString(),
      // Reply details are optional and only present if the message includes reply info
      reply: item.reply ? {
        to: item.reply.to,
        code: item.reply.code,
        codeRaw: item.reply.codeRaw,
      } : undefined,
    });

    // You can perform async operations in the callback
    await processingFunction(item);
  }
);

// Cleanup when done
unsubscribe();
```

### Subscribe to Program State Changes

Monitor changes to program state across the blockchain:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Listen to all program state changes
const unsubscribe = await api.program.subscribeToStateChanges(
  null, // null means listen to all programs
  (blockHash, programIds) => {
    console.log('Program state changed in block:', blockHash);
    console.log('Affected programs:', programIds);
  }
);

// Later: unsubscribe
unsubscribe();
```

#### Filter by Specific Programs

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Listen only to state changes of specific programs
const programIds = [
  '0x...', // program ID 1
  '0x...', // program ID 2
];

const unsubscribe = await api.program.subscribeToStateChanges(
  programIds,
  (blockHash, changedProgramIds) => {
    console.log(`Programs updated in block ${blockHash}:`, changedProgramIds);

    // Process each updated program
    changedProgramIds.forEach(async (programId) => {
      const exists = await api.program.exists(programId);
      console.log(`Program ${programId} exists: ${exists}`);
    });
  }
);
```

#### Full Example

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

const myPrograms = ['0x...', '0x...'];

const unsubscribe = await api.program.subscribeToStateChanges(
  myPrograms,
  async (blockHash, programIds) => {
    console.log(`Block: ${blockHash}`);
    console.log(`Updated programs: ${programIds.join(', ')}`);

    // You can perform async operations in the callback
    for (const programId of programIds) {
      const codeId = await api.program.codeId(programId);
      console.log(`Program ${programId} code ID: ${codeId}`);
    }
  }
);

// Cleanup when done
unsubscribe();
```

### Difference Between Event Subscriptions and RPC Subscriptions

| Feature | Events (`api.query.system.events`) | RPC Subscriptions | 
|---------|-----------------------------------|-------------------|
| **Data Type** | All blockchain events | Specific to Gear messages/programs |
| **Filtering** | Client-side filtering | Server-side filtering (more efficient) |
| **Performance** | Less efficient for specific types | More efficient with targeted data |
| **Use Case** | Monitor all system activity | Track specific programs or messages |
| **Payload Details** | Limited message details | Complete message structure with reply info |

### Error Handling

```typescript
import { GearApi, RpcMethodNotSupportedError } from '@gear-js/api';

const api = await GearApi.create();

try {
  const unsubscribe = await api.message.subscribeUserMessageSent(
    { source: '0x...' },
    (item) => console.log(item)
  );
} catch (error) {
  if (error instanceof RpcMethodNotSupportedError) {
    console.error('The node does not support subscriptions:', error.message);
    // Fallback to event polling or other method
  } else {
    console.error('Subscription error:', error);
  }
}
```

### Filter Specific Events

Filter and handle specific event types:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

api.query.system.events((events) => {
  // Handle Gear message events
  events
    .filter(({ event }) => api.events.gear.MessageQueued.is(event))
    .forEach(({ event: { data } }) => {
      console.log('MessageQueued:', data.toHuman());
    });

  // Handle balance transfer events
  events
    .filter(({ event }) => api.events.balances.Transfer.is(event))
    .forEach(({ event: { data } }) => {
      console.log('Balance transfer:', data.toHuman());
    });
});
```

### Subscribe to Gear Events

Subscribe to specific Gear pallet events using the dedicated API:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Subscribe to UserMessageSent events
const unsubscribe = api.gearEvents.subscribeToGearEvent(
  'UserMessageSent',
  ({ data: { message } }) => {
    console.log(`
Message Details:
---------------
ID:          ${message.id}
Source:      ${message.source}
Destination: ${message.destination}
Payload:     ${JSON.stringify(message.payload, null, 2)}
Value:       ${message.value}
${message.reply ? `Reply To:    ${message.reply.replyTo}
Exit Code:   ${message.reply.exitCode}` : ''}
    `);
  }
);

// Later: unsubscribe to stop receiving events
unsubscribe();
```

Available Gear Events:
- `UserMessageSent`: Triggered when a program sends message to a user
- `MessageQueued`: Triggered when a message is added to the queue
- `ProgramChanged`: Triggered when a program state is modified
- `CodeChanged`: Triggered when program code state is modified
- `UserMessageRead`: Triggered when a user sends reply or claims value sent from a program


---

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

# Keyring Management

The `GearKeyring` class provides methods for managing cryptographic keys and signatures in the Gear Protocol.

## Keyring Operations

### Create New Keyring

```typescript
import { GearKeyring } from '@gear-js/api';

// Create new keyring
const { keyring, json } = await GearKeyring.create('myKeyring', 'securePassphrase');
```

### Import Existing Keyring

```typescript
import { GearKeyring } from '@gear-js/api';
import { readFileSync } from 'fs';

// From JSON file
const jsonKeyring = readFileSync('path/to/keyring.json', 'utf-8');
const keyring = GearKeyring.fromJson(jsonKeyring, 'passphrase');

// From seed
const seed = '0x496f9222372eca011351630ad276c7d44768a593cecea73685299e06acef8c0a';
const seedKeyring = await GearKeyring.fromSeed(seed, 'myKeyring');

// From mnemonic
const mnemonic = 'slim potato consider exchange shiver bitter drop carpet helmet unfair cotton eagle';
const mnemonicKeyring = GearKeyring.fromMnemonic(mnemonic, 'myKeyring');
```

### Export Keyring

```typescript
import { GearKeyring } from '@gear-js/api';

// Export keyring to JSON
const json = GearKeyring.toJson(keyring, 'passphrase');
```

### Generate New Keys

```typescript
import { GearKeyring } from '@gear-js/api';

// Generate new mnemonic and seed
const { mnemonic, seed } = GearKeyring.generateMnemonic();

// Generate seed from existing mnemonic
const { seed: derivedSeed } = GearKeyring.generateSeed(mnemonic);
```

## Cryptographic Operations

### Sign Data

```typescript
import { GearKeyring, signatureIsValid } from '@gear-js/api';

// Create signature
const message = 'Message to sign';
const signature = GearKeyring.sign(keyring, message);

// Validate signature
const publicKey = keyring.address;
const isValid = signatureIsValid(publicKey, signature, message);
```

## Address Format Conversion

Convert between public keys and SS58 address format:

```typescript
import { encodeAddress, decodeAddress } from '@gear-js/api';

// Convert SS58 address to public key
const publicKey = decodeAddress(
  '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
);

// Convert public key to SS58 address
const ss58Address = encodeAddress(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'
);
```

## Best Practices

1. Always store keyring JSON securely and never expose private keys
2. Use strong passphrases for keyring encryption
3. Back up mnemonics and store them securely
4. Validate signatures before trusting signed data
5. Use try-catch blocks when working with cryptographic operations

Example with error handling:

```typescript
import { GearKeyring } from '@gear-js/api';

try {
  const { keyring, json } = await GearKeyring.create('myKeyring', 'passphrase');

  // Backup keyring
  await writeFile('keyring-backup.json', JSON.stringify(json, null, 2));

  // Sign data
  const signature = GearKeyring.sign(keyring, 'message');

  // Verify signature
  const isValid = signatureIsValid(keyring.address, signature, 'message');
  if (!isValid) {
    throw new Error('Signature verification failed');
  }
} catch (error) {
  console.error('Keyring operation failed:', error.message);
  // Handle error appropriately
}
```


---

# Base Gear Program

The `BaseGearProgram` class provides an object-oriented interface for interacting with Gear programs on the blockchain. It simplifies common operations and provides type-safe interactions.

## Program Initialization

### Create Program Instance

```typescript
import { BaseGearProgram } from '@gear-js/api';

// Initialize program
const program = await BaseGearProgram.new(
  programId,    // HexString - ID of the program
  gearApi,      // GearApi instance
  account,      // Optional: AddressOrPair - account for signing transactions
  signerOptions // Optional: Partial<SignerOptions> - options for the signer
);
```

### Account Management

```typescript
// Set or update signing account
program.setAccount(account);
```

## Program Information

```typescript
// Get program ID
const programId = program.id;

// Get program balance
const balance = await program.balance();
console.log('Program balance:', balance.toHuman());
```

## Financial Operations

```javascript
// Send funds to program
const amount = 1_000_000_000_000n;
const result = await program.topUp(amount);

if (result.status.isInBlock) {
  console.log('Funds transferred in block:', result.blockNumber);
}
```

## Message Handling

### Gas Calculation

```javascript
// Calculate gas for sending a message with specific payload
const gas = await program.calculateGas(
  payload,         // HexString | Uint8Array - encoded message payload
  value,           // Optional: bigint | number - value to send with message (default: 0)
  allowOtherPanics // Optional: boolean - whether to allow other panics
);

console.log(gas);
// {
//   minLimit: 5000000000n,       // Minimum gas limit needed
//   reserved: 5000000000n,       // Reserved gas amount
//   burned: 0n,                  // Amount of gas that will be burned
//   mayBeReturned: 5000000000n,  // Gas that may be returned
//   waited: false                // Whether the message will be waited
// }
```

### Reply Calculation

```javascript
// Calculate a reply for a specific payload
const reply = await program.calculateReply(
  '0x...', // encoded payload
  0n,      // value
  'max'    // gas limit
);

console.log('Expected reply:', {
  payload: reply.payload,
  value: reply.value.toString(),
  code: reply.code.asString
});
```

### Send Message

```javascript
const result = await program.sendMessage({
  payload,   // HexString | Uint8Array - encoded message payload
  value,     // Optional: bigint | number - value to send
  gasLimit,  // Optional: bigint | number | 'max' | 'auto' - gas limit
  keepAlive  // Optional: boolean - keep account alive
});

if (result.success) {
  console.log('Message sent:', result.id);

  // Wait for response
  const response = await result.response();
  console.log('Response:', {
    payload: response.payload,
    status: response.replyCode.asString
  });
} else {
  console.error('Send failed:', result.error);
}
```

### Batch Messages

```javascript
const messages = [
  {
    payload: "0x...",  // First message payload
    value: 0,
    gasLimit: "auto"
  },
  {
    payload: "0x...",  // Second message payload
    value: 100000000,
    gasLimit: 10000000
  }
];

const result = await program.sendBatchMessages(messages);

if (result.success) {
  console.log(`Batch sent with ${result.sentMessages.length} messages`);

  for (const message of result.sentMessages) {
    if (message.success) {
      console.log(`Message ID: ${message.id}`);
      const response = await message.response();
      console.log(`Response: ${response.payload}`);
    } else {
      console.error(`Message failed: ${message.error}`);
    }
  }
} else {
  console.error(`Failed to send batch: ${result.error}`);
}
```

### Listening for program exited event

```javascript
// Subscribe to program exit event
const unsubscribe = await program.on('programExited', (inheritorId) => {
  console.log(`Program exited with inheritor: ${inheritorId}`);
});

// Later, when you want to stop listening
unsubscribe();
```

