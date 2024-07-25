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

A React library that provides hooks that are used across Gear applications.

## Installation

```sh
npm install @gear-js/react-hooks
```

or

```sh
yarn add @gear-js/react-hooks
```

## Getting started

Simple as it is, here's quick example:

```jsx
import { ProgramMetadata } from '@gear-js/api';
import { useReadFullState } from '@gear-js/react-hooks';

function State() {
  const programId = '0x...';
  const metadataHex = '0x...';
  const payload = null;

  const { state } = useReadFullState(programId, ProgramMetadata.from(METADATA_HEX), payload);

  return <div>{JSON.stringify(state)}</div>;
}

export { State };
```

## Sails

React hooks abstraction over [sails-js](https://github.com/gear-tech/sails/tree/master/js) and it's generated program library.

[TanStack Query](https://tanstack.com/query) is used as an async state manager to handle queries and mutations. Therefore, most hooks' parameters and return data correspond to the library's conventions.

### useSails

Returns Sails instance.

```js
import { useSails } from '@gear-js/react-hooks';

const prorgramId = '0x...';
const idl = '...';

const { data } = useSails({
  programId,
  idl,
});

console.log(data);
```

### useProgram

Returns a generated library instance.

```js
import { useProgram } from '@gear-js/react-hooks';
import { Program } from './lib';

const { data } = useProgram({
  library: Program,
  id: '0x...',
});

console.log(data);
```

### useSendTransaction

Returns a mutation to sign and send the transaction with minimum efforts.

Can be used as a direct shortcut to [Transaction Builder](https://github.com/gear-tech/sails/blob/master/js/README.md#transaction-builder) `signAndSend` method:

```jsx
import { useProgram, useSendTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function SendTransaction() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { sendTransactionAsync } = useSendTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const handleClick = async () => {
    const result = await sendTransactionAsync({
      args: ['arg', 'anotherArg'],

      // additional options:
      account: { addressOrPair: '0x...' }, // if not provided, connected account from extension will be used by default
      value: 1000000n, // if not provided, 0 is sent by default
      gasLimit: 1000000000n, // if not provided, gas will be calculated automatically
      voucherId: '0x...', // if not provided, transaction will be sent without voucher
    });

    const response = await result.response;

    console.log('response: ', response);
  };

  return (
    <button type="button" onClick={handleClick}>
      Send Transaction
    </button>
  );
}

export { SendTransaction };
```

Or in pair with [usePrepareTransaction](#usePrepareTransaction):

```jsx
import { useProgram, usePrepareTransaction, useSendTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function SendPreparedTransaction() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { sendTransactionAsync } = usePrepareTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const { sendTransactionAsync } = useSendTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const handleClick = async () => {
    const transaction = await prepareTransactionAsync({
      args: ['arg', 'anotherArg'],

      // additional options:
      account: { addressOrPair: '0x...' }, // if not provided, connected account from extension will be used by default
      value: 1000000n, // if not provided, 0 is sent by default
      gasLimit: 1000000000n, // if not provided, gas will be calculated automatically
      voucherId: '0x...', // if not provided, transaction will be sent without voucher
    });

    const fee = await transaction.transactionFee();

    console.log('fee: ', fee);

    const result = await sendTransactionAsync(transaction);
    const response = await result.response;

    console.log('response: ', response);
  };

  return (
    <button type="button" onClick={handleClick}>
      Prepare and Send Transaction
    </button>
  );
}

export { SendPreparedTransaction };
```

### usePrepareTransaction

Returns a mutation that retrieves the intermediate transaction state.

This can be useful for eagerly obtaining values such as `gasLimit`, `extrinsic`, and `transactionFee`, which are essential for providing a better UX.

For example, it can be used to perform validation checks before sending the transaction.

```jsx
import { useProgram, usePrepareTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function LogTransactionFeeButton() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { data, prepareTransactionAsync } = usePrepareTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const handleClick = async () => {
    const transaction = await prepareTransactionAsync({
      args: ['arg', 'anotherArg'],

      // additional options:
      account: { addressOrPair: '0x...' }, // if not provided, connected account from extension will be used by default
      value: 1000000n, // if not provided, 0 is sent by default
      gasLimit: 1000000000n, // if not provided, gas will be calculated automatically
      voucherId: '0x...', // if not provided, transaction will be sent without voucher
    });

    const fee = await transaction.transactionFee();

    console.log('fee: ', fee);
  };

  return (
    <button type="button" onClick={handleClick}>
      Log Transaction Fee
    </button>
  );
}

export { LogTransactionFeeButton };
```

### useReadQuery

Returns a query with readed program's state.

```jsx
import { useProgram, useReadQuery } from '@gear-js/react-hooks';
import { Program } from './lib';

function State() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { data } = useReadQuery({
    program,
    serviceName: 'service',
    functionName: 'function',
    args: ['arg', 'anotherArg'],

    // additional options:
    // if true, subscription to a program's stateChanges in Gear MessagesDispatched event will be initialized.
    // network traffic heavy, proceed with caution
    watch: false,
  });

  return <div>{JSON.stringify(data)}</div>;
}
```

### useEvent

Initialized subscription to a particular program event.

```jsx
import { useProgram, useEvent } from '@gear-js/react-hooks';
import { Routing } from './pages';
import { Program } from './lib';

function App() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  useEvent({
    program,
    serviceName: 'service',
    functionName: 'function',
    onData: (data) => console.log(data),
  });

  return (
    <main>
      <Routing />
    </main>
  );
}

export { App };
```
