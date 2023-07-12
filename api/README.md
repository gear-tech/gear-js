<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

## Description

The Gear-JS API provides a set of utilities, libraries and tools that enable JavaScript applications to interact with smart contracts running in the Gear-based networks via queries to a Gear node.

## Installation

```sh
npm install @gear-js/api
```

or

```sh
yarn add @gear-js/api
```

---

## Getting started

Start an API connection to a running node on localhost:

```javascript
import { GearApi } from '@gear-js/api';

const gearApi = await GearApi.create();
```

You can also connect to a different node:

```javascript
const gearApi = await GearApi.create({ providerAddress: 'wss://someIP:somePort' });
```

Getting node info:

```javascript
const chain = await gearApi.chain();
const nodeName = await gearApi.nodeName();
const nodeVersion = await gearApi.nodeVersion();
const genesis = gearApi.genesisHash.toHex();
```

---

## Payloads and metadata

### Encode / decode payloads

_It's necessary to send only bytes to interact with programs on blockchain._
_For that purpose we use the `scale-codec` implementation from `@polkadot-js`_

You can use static `CreateType.create` method to encode and decode data with standart types


```javascript
import { CreateType } from '@gear-js/api';

const result = CreateType.create('TypeName', somePayload);
```

The result of these functions is the data of type `Codec` and it has the following methods:

```javascript
result.toHex(); // - returns a hex represetation of the value
result.toHuman(); // - returns human friendly object representation of the value
result.toString(); //  - returns a string represetation of the value
result.toU8a(); // - encodes the value as a Unit8Array
result.toJSON(); // - converts the value to JSON
```

### Getting metadata

There're 2 types of metadata.

1. `ProgramMetadata` is used to encode/decode messages to/from a program as well as to read the whole state of the program

_You can use `getProgramMetadata` function to create the program metadata. The function takes metadata of the program in format of hex string. It will return object of `ProgramMetadata` class that has property `types` that contains all types of the program._

**You should pass an object of this class to function arguments when you want to send some extrinsics that require encoding payloads**

```javascript
import { getProgramMetadata } from '@gear-js/api';

const meta = getProgramMetadata(`0x...`);
meta.types.init.input; // can be used to encode input message for init entrypoint of the program
meta.types.init.output; // can be used to decode output message for init entrypoint of the program
// the same thing available for all entrypoints of the program

meta.types.state; // contains type for decoding state output
```

2. `StateMetadata` is used to encode input/decode output payloads that is needed to read state using a specific wasm.

_You can use `getStateMetadata` function to create program metadata. The function takes wasm as Buffer to read state. It will return object of StateMetadata class that has property `functions` that contains available function of wasm and input/output types_

```javascript
import { getStateMetadata } from '@gear-js/api';

const fileBuffer = fs.readFileSync('path/to/state.meta.wasm');
const meta = await getStateMetadata(fileBuffer);
meta.functions; // is an object whose keys are names of funtions and values are objects of input/output types
```

Both `ProgramMetadata` and `StateMetadata` classes have a few methods that can help to understand what some type is or get the name of some type (because types are represented as number in regestry) as well as encode and decode data.

```javascript
import { ProgramMetadata } from '@gear-js/api';

const meta = getProgramMetadata(`0x...`);

meta.getTypeName(4); // will return name of type with this index
// or
meta.getTypeName(meta.types.handle.input);

meta.getTypeDef(4); // will return structure of this type
meta.getTypeDef(4, true); // if you need to get type structre with additional field (name, type, kind, len) you have to pass the second argument

meta.getAllTypes(); // will return all custom types existed in the registry of the program

meta.createType(4, { value: 'value' }); // to encode or decode data
```

---

## Gear extrinsics

**_Extrinsics are used to interact with programs running on blockchain networks powered by Gear Protocol_**

_In all cases of sending extrinsics, there is no need to encode the payloads by yourself. It's sufficient to pass the program metadata obtained from the `getProgramMetadata` function to the methods that creates extrinsics._

### Upload program

Use `api.program.upload` method to create `upload_program` extrinsic

```javascript
const code = fs.readFileSync('path/to/program.wasm');

const program = {
  code,
  gasLimit: 1000000,
  value: 1000,
  initPayload: somePayload,
};

const { programId, codeId, salt, extrinsic } = gearApi.program.upload(program, meta);

await extrinsic.signAndSend(keyring, (event) => {
  console.log(event.toHuman());
});
```

### Upload code

Use `api.code.upload` method to create `upload_code` extrinsic

```javascript
const code = fs.readFileSync('path/to/program.opt.wasm');

const { codeHash } = await gearApi.code.upload(code);

gearApi.code.signAndSend(alice, () => {
  events.forEach(({ event: { method, data } }) => {
    if (method === 'ExtrinsicFailed') {
      throw new Error(data.toString());
    } else if (method === 'CodeChanged') {
      console.log(data.toHuman());
    }
  });
});
```

### Create program from the code uploaded on chain

Use `api.program.create` method to create `create_program` extrinsic

```javascript
const codeId = '0x...';

const program = {
  codeId,
  gasLimit: 1000000,
  value: 1000,
  initPayload: somePayload,
};

const { programId, salt, extrinsic } = gearApi.program.create(program, meta);

await extrinsic.signAndSend(keyring, (event) => {
  console.log(event.toHuman());
});
```

### Send a message

Use `api.message.send` method to create `send_message` extrinsic

```javascript
try {
  const message = {
    destination: destination, // programId
    payload: somePayload,
    gasLimit: 10000000,
    value: 1000,
  };
  // In that case payload will be encoded using meta.handle_input type
  let extrinsic = gearApi.message.send(message, meta);
  // So if you want to use another type you can specify it
  extrinsic = gearApi.message.send(message, meta, meta.async_handle_input);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
try {
  await extrinsic.signAndSend(keyring, (event) => {
    console.log(event.toHuman());
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

### Send a reply message

Use `api.message.reply` method to create `send_reply` extrinsic

```javascript
const reply = {
  replyToId: messageId,
  payload: somePayload,
  gasLimit: 10000000,
  value: 1000,
};
const extrinsic = gearApi.message.sendReply(reply, meta);
await extrinsic(keyring, (events) => {
  console.log(event.toHuman());
});
```

### Get a transaction fee

To get a transaction fee before sending a transaction you can use `paymentInfo` method.

```javascript
const api = await GearApi.create();
api.program.upload({ code, gasLimit });
// same for api.message, api.reply and others
const paymentInfo = await api.program.paymentInfo(alice);
const transactionFee = paymentInfo.partialFee.toNumber();
consolg.log(transactionFee);
```

### Calculate gas for messages

To find out the minimum gas amount to send extrinsic, use `gearApi.program.calculateGas.[method]`.
There are 4 methods to use:
- `init` - to calculate the gas of init message that will be applied to `upload_program` extrinsic
- `initCreate` - to calculate the gas of init message that will be applied to `create_program` extrinsic
- `handle` - to calculate the gas of handle message that will be applied to `send_message` extrinsic
- `reply` - to calculate the gas of reply message that will be applied to `send_reply` extrinsic

Gas calculation returns GasInfo object contains 5 parameters:

- `min_limit` - Minimum gas limit required for execution
- `reserved` - Gas amount that will be reserved for some other on-chain interactions
- `burned` - Number of gas burned during message processing
- `may_be_returned` - value that can be returned in some cases
- `waited` - notifies that the message will be added to waitlist

#### Example of using `calculateGas.handle` method

```javascript
const code = fs.readFileSync('demo_meta.opt.wasm');
const meta = getProgramMetadata('0x...');
const gas = await gearApi.program.calculateGas.handle(
  '0x...', // source id
  '0x...', //program id
  {
    id: {
      decimal: 64,
      hex: '0x...',
    },
  }, // payload
  0, // value
  false, // allow other panics
  meta, // the metadata of the program
);
console.log(gas.toHuman());
```
---

### Resume paused program

To resume paused program use `api.program.resumeSession` methods.
`init` - To start new session to resume program
`push` - To push a bunch of the program pages
`commit` - To finish resume session

```javascript
const program = await api.programStorage.getProgram(programId, oneBlockBeforePauseHash);
const initTx = api.program.resumeSession.init({
  programId,
  allocations: program.allocations,
  codeHash: program.codeHash.toHex(),
});

let sessionId: HexString;
initTx.signAndSend(account, ({ events }) => {
  events.forEach(({ event: { method, data }}) => {
    if (method === 'ProgramResumeSessionStarted') {
      sessionId = data.sessionId.toNumber();
    }
  })
})

const pages = await api.programStorage.getProgramPages(programId, program, oneBlockBeforePauseHash);
for (const memPage of Object.entries(page)) {
  const tx = api.program.resumeSession.push({ sessionId, memoryPages: [memPage] });
  tx.signAndSend(account);
}

const tx = api.program.resumeSession.commit({ sessionId, blockCount: 20_000 });
tx.signAndSend(account);
```

## Work with programs and blockchain state

### Check that the address belongs to some program

To find out if an address belongs to a program use the `api.program.exists` method.

```javascript
const programId = '0x...';
const programExists = await api.program.exists(programId);

console.log(`Program with address ${programId} ${programExists ? 'exists' : "doesn't exist"}`);
```

### Read state of a program

There are 2 ways to read state of a program.

1. Read full state of a program.
   _To read full state of the program you need to have only metadata of this program. You can call `api.programState.read` method to get the state._

   ```javascript
   await api.programState.read({ programId: `0x...` }, programMetadata);

   // Also you can read the state of the program at some specific block.
   await api.programState.read({ programId: `0x...`, at: `0x...` }, programMetadata);
   ```

2. Read state using wasm.
   _If you have some program that is able to read state and return you only necessary data you need to use `api.programState.readUsingWasm` method._

   ```javascript
   const wasm = readFileSync('path/to/state.meta.wasm');
   const state = await api.programState.readUsingWasm(
     { programId, fn_name: 'name_of_function_to_execute', wasm, argument: { input: 'payload' } },
     wasm,
   );
   ```

### Get ids of all uploaded codes

To get all ids of uploaded codes use `api.code.all` method. It returns array of code ids

```javascript
const codeIds = await gearApi.code.all();
console.log(codeIds);
```

### Mailbox

The mailbox contains messages that are waiting for user action.

#### Read

To read the mailbox use `api.mailbox.read` method.

```javascript
const api = await GearApi.create();
const mailbox = await api.mailbox.read('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
console.log(mailbox);
```

### Claim value

To claim value from a message in the mailbox use `api.mailbox.claimValue.submit` method.

```javascript
const api = await GearApi.create();
const submitted = await api.mailbox.claimValue.submit(messageId);
await api.mailbox.claimValue.signAndSend(...);
```

### Waitlist

To read the program's waitlist use `api.waitlist.read` method.

```javascript
const gearApi = await GearApi.create();
const programId = '0x1234...';
const waitlist = await api.waitlist.read(programId);
console.log(waitlist);
```

---

## Events

### Subscribe to all events

```javascript
const unsub = await gearApi.query.system.events((events) => {
  console.log(events.toHuman());
});
// Unsubscribe
unsub();
```

### Check what the event is

```javascript
gearApi.query.system.events((events) => {
  events
    .filter(({ event }) => gearApi.events.gear.MessageEnqueued.is(event))
    .forEach(({ event: { data } }) => {
      console.log(data.toHuman());
    });

  events
    .filter(({ event }) => gearApi.events.balances.Transfer.is(event))
    .forEach(({ event: { data } }) => {
      console.log(data.toHuman());
    });
});
```

### Subscribe to specific gear events

There is an oportunity to subscribe to a specific event of the Gear pallet without filtering events manually.

```javascript
const unsub = api.gearEvents.subscribeToGearEvent(
  'UserMessageSent', // pass here name of event you're interested in
  ({
    data: {
      message: { id, source, destination, payload, value, reply },
    },
  }) => {
    console.log(`
  messageId: ${id.toHex()}
  source: ${source.toHex()}
  payload: ${payload.toHuman()}
  `);
  },
);
// Unsubscribe
unsub();
```

---

## Blocks

### Get block data

```javascript
const data = await gearApi.blocks.get(blockNumberOrBlockHash);
console.log(data.toHuman());
```

### Get block timestamp

```javascript
const ts = await gearApi.blocks.getBlockTimestamp(blockNumberOrBlockHash);
console.log(ts.toNumber());
```

### Get blockHash by block number

```javascript
const hash = await gearApi.blocks.getBlockHash(blockNumber);
console.log(hash.toHex());
```

### Get block number by blockhash

```javascript
const hash = await gearApi.blocks.getBlockNumber(blockHash);
console.log(hash.toNumber());
```

### Get all block's events

```javascript
const events = await gearApi.blocks.getEvents(blockHash);
events.forEach((event) => {
  console.log(event.toHuman());
});
```

### Get all block's extrinsics

```javascript
const extrinsics = await gearApi.blocks.getExtrinsics(blockHash);
extrinsics.forEach((extrinsic) => {
  console.log(extrinsic.toHuman());
});
```

---

## Keyring

### Create keyring

To create keyring you can use static methods of `GearKeyring` class.

<details>
<summary>Example</summary>

- Creating a new keyring

```javascript
import { GearKeyring } from '@gear-js/api';
const { keyring, json } = await GearKeyring.create('keyringName', 'passphrase');
```

- Getting a keyring from JSON

```javascript
const jsonKeyring = fs.readFileSync('path/to/keyring.json').toString();
const keyring = GearKeyring.fromJson(jsonKeyring, 'passphrase');
```

- Getting JSON for keyring

```javascript
const json = GearKeyring.toJson(keyring, 'passphrase');
```

- Getting a keyring from seed

```javascript
const seed = '0x496f9222372eca011351630ad276c7d44768a593cecea73685299e06acef8c0a';
const keyring = await GearKeyring.fromSeed(seed, 'name');
```

- Getting a keyring from mnemonic

```javascript
const mnemonic = 'slim potato consider exchange shiver bitter drop carpet helmet unfair cotton eagle';
const keyring = GearKeyring.fromMnemonic(mnemonic, 'name');
```

- Generate mnemonic and seed

```javascript
const { mnemonic, seed } = GearKeyring.generateMnemonic();

// Getting a seed from mnemonic
const { seed } = GearKeyring.generateSeed(mnemonic);
```

</details>

### Sign data

<details>
<summary>Example</summary>

1. Create signature

```javascript
import { GearKeyring } from '@gear-js/api';
const message = 'your message';
const signature = GearKeyring.sign(keyring, message);
```

2. Validate signature

```javascript
import { signatureIsValid } from '@gear-js/api';
const publicKey = keyring.address;
const verified = signatureIsValid(publicKey, signature, message);
```

</details>

### Convert public keys into ss58 format and back

Use `encodeAddress` and `decodeAddress` functions to convert the public key into ss58 format and back.

<details>
<summary>Example</summary>

1. Convert to raw format

```javascript
import { decodeAddress } from '@gear-js/api';
console.log(decodeAddress('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'));
```

2. Convert to ss58 format

```javascript
import { encodeAddress } from '@gear-js/api';
console.log(encodeAddress('0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'));
```

</details>
