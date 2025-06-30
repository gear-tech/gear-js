<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear-JS React Hooks
</h3>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

## Description

A React library that provides hooks that are used across Gear applications.

## Installation

### npm

```sh
npm install @gear-js/react-hooks
```

### yarn

```sh
yarn add @gear-js/react-hooks
```

### pnpm

```sh
pnpm add @gear-js/react-hooks
```

### Peer Dependencies

This package requires several peer dependencies to be installed in your project:

- @gear-js/api
- @polkadot/api
- @tanstack/react-query
- sails-js

> **Note:**
> We recommend not installing peer dependencies explicitly if your package manager can resolve them automatically. However, if you have to fix version conflicts, or if you want to use functionality from these libraries directly in your project, you should install them explicitly.
> Please refer to the `peerDependencies` section in the `package.json` for the required versions.

## Getting started

To use the hooks, wrap your application with the required providers. Each provider is described below.

### QueryClientProvider (TanStack Query)

Wrap your app with [`QueryClientProvider`](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider) from TanStack Query to enable query and mutation management.

For more details on setting up the TanStack Query, see the [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start).

**Props:**

- `client` (**required**): An instance of `QueryClient`.

Example:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>{/* ... */}</QueryClientProvider>;
```

### ApiProvider

Provides Gear API context to the app.

**Props:**

- `initialArgs` (**required**): `ProviderArgs` — Arguments for the API provider. Determines how the API connection is established.
  - `WsProviderArgs`: `{ endpoint: string | string[]; autoConnectMs?: number | false; headers?: Record<string, string>; timeout?: number; }` — Connects via JSON-RPC. `endpoint` is the node address or addresses. `autoConnectMs` sets auto-reconnect interval. `headers` and `timeout` are optional connection options.
  - `ScProviderArgs`: `{ spec: string; sharedSandbox?: ScProvider; }` — Connects via Light Client. `spec` is the specification string. `sharedSandbox` allows sharing a sandbox instance.

Example:

```jsx
import { ApiProvider } from '@gear-js/react-hooks';

<ApiProvider initialArgs={{ endpoint: 'wss://testnet.vara.network' }}>{/* ... */}</ApiProvider>;
```

### AccountProvider

Provides account and wallet context to the app.

**Props:**

- `appName` (**required**): `string` — The name of your application. Value provided here will be displayed at wallet app or extension.

Example:

```jsx
import { AccountProvider } from '@gear-js/react-hooks';

<AccountProvider appName="MyApp">{/* ... */}</AccountProvider>;
```

### AlertProvider

Provides alert context for notifications and messages.

**Props:**

- `template` (**required**): `ComponentType<AlertTemplateProps>` — The component to use as the alert template. Defines how alerts are rendered in your app.
- `containerClassName` (optional): `string` — Custom class name for the alert container. Use this to style or position the alert area.

Example:

```jsx
import { AlertProvider } from '@gear-js/react-hooks';

import { AlertTemplate } from './alert-template';

<AlertProvider template={AlertTemplate}>{/* ... */}</AlertProvider>;
```

### Combine all providers at the root of your app:

```jsx
<QueryClientProvider client={queryClient}>
  <ApiProvider initialArgs={{ endpoint: 'wss://testnet.vara.network' }}>
    <AccountProvider appName="MyApp">
      <AlertProvider template={AlertTemplate}>
        <App />
      </AlertProvider>
    </AccountProvider>
  </ApiProvider>
</QueryClientProvider>
```

### Usage

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

## Hooks

## useBalance

Retrieves and subscribes to the total balance of a given account address, allowing you to display or react to the overall balance in your application. This hook is based on `api.balance.findOut` and `api.gearEvents.subscribeToBalanceChanges`.

> **Note:**  
> This hook returns the account's total balance as a single value, not its individual components (such as free, reserved, or misc frozen balances). On Substrate-based chains, the balance type is a composite structure; to access specific fields like free balance, use the [useDeriveBalancesAll](#useDeriveBalancesAll).

### Parameters

- `address` (`string | undefined`): The account address to fetch and subscribe to the balance for.

### Returns

- `balance` (`Balance | undefined`): The current total balance of the account, or `undefined` if not yet loaded.
- `isBalanceReady` (`boolean`): Indicates whether the balance has been successfully loaded.

### Usage Example

```jsx
import { useBalance } from '@gear-js/react-hooks';

type Props = {
  address: string | undefined;
}

function Balance({ address }: Props) {
  const { balance, isBalanceReady } = useBalance(address);

  if (!isBalanceReady) return <div>Loading...</div>;

  return <div>Total Balance: {balance?.toString()}</div>;
}
```

## Sails Hooks

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

### useSendProgramTransaction

Returns a mutation to sign and send the transaction with minimum efforts.

Can be used as a direct shortcut to [Transaction Builder](https://github.com/gear-tech/sails/blob/master/js/README.md#transaction-builder) `signAndSend` method:

```jsx
import { useProgram, useSendProgramTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function SendTransaction() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { sendTransactionAsync } = useSendProgramTransaction({
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

Or in pair with [usePrepareProgramTransaction](#usePrepareProgramTransaction):

```jsx
import { useProgram, usePrepareProgramTransaction, useSendProgramTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function SendPreparedTransaction() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { sendTransactionAsync } = usePrepareProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const { sendTransactionAsync } = useSendProgramTransaction({
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

### usePrepareProgramTransaction

Returns a mutation that retrieves the intermediate transaction state.

This can be useful for eagerly obtaining values such as `gasLimit`, `extrinsic`, and `transactionFee`, which are essential for providing a better UX.

For example, it can be used to perform validation checks before sending the transaction.

```jsx
import { useProgram, usePrepareProgramTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function LogTransactionFeeButton() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { data, prepareTransactionAsync } = usePrepareProgramTransaction({
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

### useProgramQuery

Returns a query with readed program's state.

```jsx
import { useProgram, useProgramQuery } from '@gear-js/react-hooks';
import { Program } from './lib';

function State() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { data } = useProgramQuery({
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

### useProgramEvent

Initialized subscription to a particular program event.

```jsx
import { useProgram, useProgramEvent } from '@gear-js/react-hooks';
import { Routing } from './pages';
import { Program } from './lib';

function App() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  useProgramEvent({
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
