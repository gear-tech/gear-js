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