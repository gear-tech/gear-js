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