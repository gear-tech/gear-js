<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://gear-tech.io/images/logo-black.svg" width="240" alt="GEAR">
  </a>
</p>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>

## Description

A JavaScript library that provides functionality to connect GEAR Component APIs.

## Installation

```sh
npm install @gear-js/api
```

## Getting started

Start an API connection to a running node on localhost

```javascript
import { GearApi } from '@gear-js/api';

const gearApi = await GearApi.create();
```

You can also connect to a different node

```javascript
const gearApi = await GearApi.create({ providerAddress: 'wss://someIP:somePort' });
```

Registering custom types

```javascript
const yourCustomTypesExample = {
  Person: {
    surname: 'String',
    name: 'String',
    patronymic: 'Option<String>'
  },
  Id: {
    decimal: 'u64',
    hex: 'Vec<u8>'
  },
  Data: {
    id: 'Id',
    person: 'Person',
    data: 'Vec<String>'
  }
};
const gearApi = await GearApi.create({ customTypes: { ...yourCustomTypesExample } });
```

### Subscribing

Subscribe to all events

```javascript
const unsub = await gearApi.allEvents((events) => {
  console.log(event.toHuman());
});
// Unsubscribe
unsub();
```

Check what the event is

```javascript
gearApi.allEvents((events) => {
  events
    .filter(({ event }) => gearApi.events.gear.InitMessageEnqueued.is(event))
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

Subscribe to Log events

```javascript
const unsub = await gearApi.gearEvents.subscribeLogEvents((event) => {
  const data: any = event.data[0].toHuman();
  console.log(data);
});
// Unsubscribe
unsub();
```

Subscribe to Program events

```javascript
const unsub = await gearApi.gearEvents.subscribeProgramEvents((event) => {
  console.log(event.toHuman());
});
// Unsubscribe
unsub();
```

Subscribe to new blocks

```javascript
const unsub = await gearApi.gearEvents.subscribeNewBlocks((header) => {
  console.log(`New block with number: ${header.number.toNumber()} and hash: ${header.hash.toHex()}`);
});
// Unsubscribe
unsub();
```

### Creating custom types

Use types that were registered at the time of creating the API

```javascript
const createType = new CreateType(gearApi);
```

And without them

```javascript
const createType = new CreateType();
```

Encode data

```javascript
// If "TypeName" alredy registred
createType.encode('TypeName', somePayload);
// Otherwise need to add metadata containing TypeName and all required types
createType.encode('TypeName', somePayload, metadata);
```

By analogy data is decoded

```javascript
createType.decode('TypeName', someBytes);
// or
createType.decode('TypeName', someBytes, metadata);
```

### Create keyring

Creating a new keyring

```javascript
import { GearKeyring } from '@gear-js/api';
const { keyring, json } = await GearKeyring.create('keyringName');
```

Getting a keyring from JSON

```javascript
const jsonKeyring = fs.readFileSync('path/to/keyring.json').toString();
const keyring = GearKeyring.fromJson(jsonKeyring);
```

Getting a keyring from seed

```javascript
const seed = '0x496f9222372eca011351630ad276c7d44768a593cecea73685299e06acef8c0a';
const keyring = await GearKeyring.fromSeed(seed, 'name');
```

Getting a keyring from mnemonic

```javascript
const mnemonic = 'slim potato consider exchange shiver bitter drop carpet helmet unfair cotton eagle';
const keyring = await GearKeyring.fromMnemonic(mnemonic, 'name');
```

Generate mnemonic and seed

```javascript
const { mnemonic, seed } = GearKeyring.generateMnemonic();

// Getting a seed from mnemonic
const { seed } = GearKeyring.generateSeed(mnemonic);
```

### Sign messages

Creating signature

```javascript
import { GearKeyring } from '@gear-js/api';
const message = 'your message';
const signature = GearKeyring.sign(keyring, message);

// Check signature
const publicKey = keyring.address;
const verified = GearKeyring.checkSign(publicKey, signature, message);
```

### Getting metadata

Getting metadata from program.meta.wasm

```javascript
import { getWasmMetadata } from '@gear-js/api';
const fileBuffer = fs.readFileSync('path/to/program.meta.wasm');
const meta = await getWasmMetadata(fileBuffer);
```

### Uploading program

```javascript
const code = fs.readFileSync('path/to/program.wasm');

const uploadProgram = {
  code,
  gasLimit: 1000000,
  value: 1000,
  initPayload: somePayload
};

try {
  const programId = await gearApi.program.submit(uploadProgram, meta);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}

try {
  await gearApi.program.signAndSend(keyring, (data) => {
    console.log(data);
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

### Sending message

```javascript
try {
  const message = {
    destination: destination, // programId
    payload: somePayload,
    gasLimit: 10000000,
    value: 1000
  };
  await gearApi.message.submit(message, meta);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
try {
  await gearApi.message.signAndSend(keyring, (data) => {
    console.log(data);
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

## [Examples](https://github.com/gear-tech/gear-js/tree/master/api/examples)

To run examples see https://github.com/gear-tech/gear-js/tree/master/api/examples
