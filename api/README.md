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

The Gear-JS API provides a set of utilities, libraries and tools that enable JavaScript applications to interact with smart contracts running in the Gear network via queries to a Gear node.

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

You can use static `CreateType.create` method to encode and decode data

<details>
<summary>Example</summary>

```javascript
import { CreateType } from '@gear-js/api';

// If "TypeName" alredy registred
const result = CreateType.create('TypeName', somePayload);
// Otherwise need to add metadata containing TypeName and all required types
const result = CreateType.create('TypeName', somePayload, metadata);
```

Result of this functions is data of type `Codec` and it has the next methods

```javascript
result.toHex(); // - returns a hex represetation of the value
result.toHuman(); // - returns human friendly object representation of the value
result.toString(); //  - returns a string represetation of the value
result.toU8a(); // - encodes the value as a Unit8Array
result.toJSON(); // - converts the value to JSON
```

</details>

### Getting metadata

There're 2 types of metadata.

1. `ProgramMetadata` is used to encode/decode messages to/from a program as well as to read the whole state of the program

_You can use `getProgramMetadata` function to create program metadata. The function takes metadata of the program in format of hex string. It will return object of ProgramMetadata class that has property `types` that contains all types of the program._

**You should pass an object of this class to function arguments when you want to send some extrinsics that require encoding payloads**

```javascript
import { getProgramMetadata } from '@gear-js/api';

const meta = getProgramMetadata(`0x...`);
meta.types.init.input; // can be used to encode input message for init entrypoint of the program
meta.types.init.output; // can be used to decode output message for init entrypoint of the program
// the same thing available for all entrypoints of the program

meta.types.state; // contauns type for decoding state output
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
import { ProgramMetadata } from '@gear-js/api`;

const meta = getProgramMetadata(`0x...`);

meta.getTypeName(4); // will return name of type with this index

meta.getTypeDef(4); // will return structure of this type
meta.getTypeDef(4, true); // if you need to get type structre with additional field (name, type, kind, len) you have to pass the second argument

meta.getAllTypes(); // will return all custom types existed in the registry of the program

meta.createType(4, { value: 'value' }); // to encode or decode data
```

---

## Gear extrinsics

**_Extrinsics are used to interact with programs running on blockchain networks powered by Gear Protocol_**

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

try {
  const { programId, codeId, salt, extrinsic } = gearApi.program.upload(program, meta);
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

### Create program from uploaded code on chain

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

### Send message

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

### Send reply message

Use `api.message.reply` method to create `send_reply` extrinsic

```javascript
try {
  const reply = {
    replyToId: messageId,
    payload: somePayload,
    gasLimit: 10000000,
    value: 1000,
  };
  // In this case payload will be encoded using `meta.async_handle_input` type if it exsits,
  // otherwise `meta.async_init_input` will be used
  const extrinsic = gearApi.message.sendReply(reply, meta);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
try {
  await extrinsic(keyring, (events) => {
    console.log(event.toHuman());
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

### Get transaction fee

To get a transaction fee before sending a transaction you can use paymentInfo method.

<details>
<summary>Example</summary>

```javascript
const api = await GearApi.create();
api.program.upload({ code, gasLimit });
// same for api.message, api.reply and others
const paymentInfo = await api.program.paymentInfo(alice);
const transactionFee = paymentInfo.partialFee.toNumber();
consolg.log(transactionFee);
```

</details>

### Calculate gas for messages

To find out the minimum gas amount to send extrinsic, use `gearApi.program.calculateGas.[method]`.

Gas calculation returns GasInfo object contains 3 parameters:

- `min_limit` - Minimum gas limit required for execution
- `reserved` - Gas amount that will be reserved for some other on-chain interactions
- `burned` - Number of gas burned during message processing
- `may_be_returned` - value that can be returned in some cases
- `waited` - notifies that the message will be added to waitlist

#### Init (for upload_program extrinsic)

<details>
<summary>Example</summary>

```javascript
const code = fs.readFileSync('demo_ping.opt.wasm');

const gas = await gearApi.program.calculateGas.initUpload(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  code,
  '0x00', // payload
  0, //value
  true, // allow other panics
);

console.log(gas.toHuman());
```

</details>

#### Init (for create_program extrinsic)

<details>
<summary>Example</summary>

```javascript
const codeId = '0x...';

const gas = await gearApi.program.calculateGas.initCreate(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  codeId,
  '0x00', // payload
  0, //value
  true, // allow other panics
);

console.log(gas.toHuman());
```

</details>

#### Handle message

<details>
<summary>Example</summary>

```javascript
const code = fs.readFileSync('demo_meta.opt.wasm');
const meta = await getWasmMetadata(fs.readFileSync('demo_meta.opt.wasm'));
const gas = await gearApi.program.calculateGas.handle(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  '0xa178362715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', //program id
  {
    id: {
      decimal: 64,
      hex: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    },
  }, // payload
  0, // value
  false, // allow other panics
  meta,
);
console.log(gas.toHuman());
```

</details>

#### Reply to a message

<details>
<summary>Example</summary>

```javascript
const code = fs.readFileSync('demo_async.opt.wasm');
const meta = await getWasmMetadata(fs.readFileSync('demo_async.opt.wasm'));
const gas = await gearApi.program.calculateGas.reply(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  '0x518e6bc03d274aadb3454f566f634bc2b6aef9ae6faeb832c18ae8300fd72635', // message id
  0, // exit code
  'PONG', // payload
  0, // value
  true, // allow other panics
  meta,
);
console.log(gas.toHuman());
```

</details>

---

## Work with programs and blockchain state

### Check that the address belongs to some program

To find out if an address belongs to a program use the `api.program.exists` method.

```javascript
const programId = '0x...';
const programExists = await api.program.exists(programId);

console.log(`Program with address ${programId} ${programExists ? 'exists' : "doesn't exist"}`);
```

### Read state of program

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

<details>
<summary>Example</summary>

```javascript
const codeIds = await gearApi.code.all();
console.log(codeIds);
```

</details>

### Mailbox

The mailbox contains messages that are waiting for user action.

#### Read

To read the mailbox use `api.mailbox.read` method.

<details>
<summary>Example</summary>

```javascript
const api = await GearApi.create();
const mailbox = await api.mailbox.read('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
console.log(mailbox);
```

</details>

### Claim value

To claim value from a message in the mailbox use `api.mailbox.claimValue.submit` method.

<details>
<summary>Example</summary>

```javascript
const api = await GearApi.create();
const submitted = await api.mailbox.claimValue.submit(messageId);
await api.mailbox.claimValue.signAndSend(...);
```

</details>

### Waitlist

To read the program's waitlist use `api.waitlist.read` method.

<details>
<summary>Example</summary>

```javascript
const gearApi = await GearApi.create();
const programId = '0x1234...';
const waitlist = await api.waitlist.read(programId);
console.log(waitlist);
```

</details>

---

## Events

### Subscribe to all events

<details>
<summary>Example</summary>

```javascript
const unsub = await gearApi.query.system.events((events) => {
  console.log(events.toHuman());
});
// Unsubscribe
unsub();
```

</details>

### Check what the event is

<details>
<summary>Example</summary>

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

</details>

### Subscribe to specific gear events

<details>
<summary>Example</summary>

- Subscribe to messages sent from a program

```javascript
const unsub = api.gearEvents.subscribeToGearEvent(
  'UserMessageSent',
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

- Subscribe to messages intended for a program

```javascript
const unsub = api.gearEvents.subscribeToGearEvent('MessageEnqueued', ({ data: { id, source, destination, entry } }) => {
  console.log({
    messageId: id.toHex(),
    programId: destination.toHex(),
    userId: source.toHex(),
    entry: entry.isInit ? entry.asInit : entry.isHandle ? entry.asHandle : entry.asReply,
  });
});
// Unsubscribe
unsub();
```

- Subscribe to Transfer events

```javascript
const unsub = await gearApi.gearEvents.subscribeToTransferEvents(({ data: { from, to, amount } }) => {
  console.log(`
    Transfer balance:
    from: ${from.toHex()}
    to: ${to.toHex()}
    amount: ${+amount.toString()}
    `);
});
// Unsubscribe
unsub();
```

- Subscribe to new blocks

```javascript
const unsub = await gearApi.gearEvents.subscribeToNewBlocks((header) => {
  console.log(`New block with number: ${header.number.toNumber()} and hash: ${header.hash.toHex()}`);
});
// Unsubscribe
unsub();
```

</details>

---

## Blocks

### Get block data

<details>
<summary>Example</summary>

```javascript
const data = await gearApi.blocks.get(blockNumberOrBlockHash);
console.log(data.toHuman());
```

</details>

### Get block timestamp

<details>
<summary>Example</summary>

```javascript
const ts = await gearApi.blocks.getBlockTimestamp(blockNumberOrBlockHash);
console.log(ts.toNumber());
```

</details>

### Get blockHash by block number

<details>
<summary>Example</summary>

```javascript
const hash = await gearApi.blocks.getBlockHash(blockNumber);
console.log(hash.toHex());
```

</details>

### Get block number by blockhash

<details>
<summary>Example</summary>

```javascript
const hash = await gearApi.blocks.getBlockNumber(blockHash);
console.log(hash.toNumber());
```

</details>

### Get all block's events

<details>
<summary>Example</summary>

```javascript
const events = await gearApi.blocks.getEvents(blockHash);
events.forEach((event) => {
  console.log(event.toHuman());
});
```

</details>

### Get all block's extrinsics

<details>
<summary>Example</summary>

```javascript
const extrinsics = await gearApi.blocks.getExtrinsics(blockHash);
extrinsics.forEach((extrinsic) => {
  console.log(extrinsic.toHuman());
});
```

</details>

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
