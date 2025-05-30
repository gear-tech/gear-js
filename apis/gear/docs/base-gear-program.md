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
