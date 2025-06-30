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
    <a href="https://www.npmjs.com/package/@gear-js/react-hooks"><img src="https://img.shields.io/npm/v/@gear-js/react-hooks.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@gear-js/react-hooks"><img src="https://img.shields.io/npm/dm/@gear-js/react-hooks.svg" alt="Downloads"></a>
    <a href="https://github.com/gear-tech/gear-js/tree/master/apis/gear"><img src="https://img.shields.io/badge/Gear-TypeScript-blue?logo=typescript" alt="Gear TypeScript"></a>
</p>
<p align="center">
    <a href="https://wiki.gear-tech.io"><img src="https://img.shields.io/badge/Gear-Wiki-orange?logo=bookstack" alt="Gear Wiki"></a>
    <a href="https://idea.gear-tech.io"><img src="https://img.shields.io/badge/Gear-IDEA-blue?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBrVLLDYMwDH0OG7ABG5QNYIOwQRmhI3QERmCDMAIjsEFHgA2SDZyk5lRU1LQvQXLi2M+fDUQkLPpKz7MjNS/eN3VHGthSe0SHw2kN8bkwR4Rd9I3JGzWvkxXkQFD0z6Qs+6O0IQ9BlvXZVPDQYr9aNBglXmVUBqHLpCwqD6FTqhYHkfJkODmIpBMdEJVGh7pBZPmk+1rKL3lRfgeTxGrVY2T6z1TbUTKBhLrB1l4DkT+pMoBRzA5k4gCSzQP6wQlxwzh5ZgAAAABJRU5ErkJggg==" alt="Gear IDEA"></a>
</p>
<hr>

## Description

A React library that provides hooks used across Gear applications.

This package provides ready-to-use hooks for interacting with the [@gear-js/api](https://github.com/gear-tech/gear-js/tree/main/apis/gear), managing accounts and wallets, formatting balances, querying on-chain state, handling program transactions, and working with vouchers and staking.

Designed to simplify dApp development, these hooks abstract away low-level details and provide a consistent, declarative interface for common blockchain operations, including real-time subscriptions, state management, and user notifications.

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
> We recommend to not install peer dependencies explicitly if your package manager can resolve them automatically. However, if you have to fix version conflicts, or if you want to use functionality from these libraries directly in your project, you should install them explicitly.
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

## useApi

Provides access to the Gear API instance, allowing you to interact with the blockchain, check if the API is ready, and switch networks programmatically.

### Parameters

None.

### Returns

- `api` (`GearApi | undefined`): The current Gear API instance, or `undefined` if not yet connected.
- `isApiReady` (`boolean`): Indicates whether the API is fully initialized and ready to use.
- `switchNetwork` (`(args: ProviderArgs) => Promise<void>`): Function to switch the network provider.

### Usage Example

```jsx
import { useApi } from '@gear-js/react-hooks';

function ApiStatus() {
  const { api, isApiReady, switchNetwork } = useApi();

  if (!isApiReady) return <div>Connecting to network...</div>;

  return (
    <div>
      <div>API connected: {String(!!api)}</div>
      <div>Spec Version: {api?.specVersion}</div>
    </div>
  );
}
```

## useAccount

Provides access to the current wallet and account context, allowing you to manage user wallet connection, retrieve available wallets, and handle login/logout actions in your application. This hook interacts with browser wallet extensions.

### Parameters

None.

### Returns

- `wallets` (`Wallets | undefined`): An object containing all detected wallets and their accounts, or `undefined` if not yet loaded.
- `account` (`Account | undefined`): The currently selected account, or `undefined` if not logged in.
- `isAnyWallet` (`boolean`): Indicates whether any wallet extension is available.
- `isAccountReady` (`boolean`): Indicates whether wallet and account information has been loaded.
- `login` (`(account: Account) => void`): Function to log in with a specific account.
- `logout` (`() => void`): Function to log out the current account.

### Usage Example

```jsx
import { useAccount } from '@gear-js/react-hooks';

function AccountInfo() {
  const { wallets, account, isAnyWallet, isAccountReady, login, logout } = useAccount();

  if (!isAccountReady) return <div>Loading wallets...</div>;
  if (!isAnyWallet) return <div>No wallet extension found</div>;

  return (
    <div>
      <div>Current account: {account?.address || 'None'}</div>

      {account && <button onClick={logout}>Logout</button>}
    </div>
  );
}
```

## useAlert

Provides access to alert and notification methods, allowing you to show, update, and remove alerts or notifications in your application.

### Parameters

None.

### Returns

- `info` (`(content: ReactNode, options?: TemplateAlertOptions) => string`): Show an info alert.
- `error` (`(content: ReactNode, options?: TemplateAlertOptions) => string`): Show an error alert.
- `success` (`(content: ReactNode, options?: TemplateAlertOptions) => string`): Show a success alert.
- `loading` (`(content: ReactNode, options?: TemplateAlertOptions) => string`): Show a loading alert.
- `update` (`(alertId: string, content: ReactNode, options?: Partial<AlertOptions>) => void`): Update an existing alert by its ID.
- `remove` (`(alertId: string) => void`): Remove an alert by its ID.

### Usage Example

```jsx
import { useAccount, useAlert } from '@gear-js/react-hooks';

function AlertButtons() {
  const alert = useAlert();

  const handleSuccessClick = () => {
    alert.success('Success alert!');
  };

  const handleErrorClick = () => {
    alert.error('Error alert!');
  };

  return (
    <div>
      <button onClick={handleSuccessClick}>Show Success Alert</button>

      <button onClick={handleErrorClick}>Show Error Alert</button>
    </div>
  );
}
```

## useBalanceFormat

Provides utilities for formatting and converting balances and gas values according to the current chain's decimals and token unit. Use this hook when you need to display user-friendly balances, convert between raw and formatted values, or transform gas calculation values. This hook is based on `api.registry.chainDecimals`, `api.registry.chainTokens`, and `api.valuePerGas`.

> **Note:**
> This hook uses the BigNumber.js library under the hood. If you are not sure, all values returned as BigNumber instances should be converted or used in calculations only with BigNumber methods — using them as regular JavaScript numbers is not safe and may lead to precision errors.

### Parameters

None.

### Returns

- `balanceMultiplier` (`BigNumber`): Multiplier for converting between raw and formatted balances.
- `decimals` (`number`): Number of decimals for the current chain.
- `getChainBalanceValue` (`(value: string | number) => BigNumber`): Converts a formatted value to the raw chain balance.
- `getFormattedBalanceValue` (`(value: string | number) => BigNumber`): Converts a raw chain balance to a formatted value.
- `getFormattedBalance` (`(balance: BN | string | number) => { value: string, unit: string }`): Formats a balance for display, returning the value and unit.
- `getChainGasValue` (`(value: string | number) => BigNumber`): Converts a formatted gas value to the raw chain gas value.
- `getFormattedGasValue` (`(value: string | number) => BigNumber`): Converts a raw chain gas value to a formatted value.

### Usage Example

```jsx
import { useApi, useBalanceFormat } from '@gear-js/react-hooks';

const RAW_BALANCE = 1_000_000_000_000n;

function BalanceDisplay({ balance }) {
  const { isApiReady } = useApi();

  const { getFormattedBalance } = useBalanceFormat();
  const formattedBalance = isApiReady ? getFormattedBalance(RAW_BALANCE) : undefined;

  if (!formattedBalance) return <span>Loading...</span>;

  return (
    <span>
      {formattedBalance.value} {formattedBalance.unit}
    </span>
  );
}
```

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

## useDeriveBalancesAll

Retrieves and subscribes to all balance components (transferable, reserved, misc frozen, etc.) for a given account address, providing a full breakdown of the account's balance as returned by Substrate's derive API. Use this hook when you need to display or react to specific balance fields, such as transferable or reserved balance, rather than the total. This hook is based on `api.derive.balances.all`.

### Parameters

- `address` (`string | undefined`): The account address to fetch and subscribe to the balance breakdown for.
- `watch` (`boolean`, optional): If true, subscribes to balance changes and updates automatically. Default is false.
- `query` (`QueryParameters`, optional): Additional query options for TanStack Query.

### Returns

- TanStack Query `UseQueryResult` with `DeriveBalancesAll` data.

### Usage Example

```jsx
import { useDeriveBalancesAll } from '@gear-js/react-hooks';

function BalanceBreakdown({ address }) {
  const { data, isLoading } = useDeriveBalancesAll({ address });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <div>Transferable: {data.transferable.toString()}</div>
      <div>Reserved: {data.reservedBalance.toString()}</div>
      <div>Frozen Misc: {data.frozenMisc.toString()}</div>
      <div>Frozen Fee: {data.frozenFee.toString()}</div>
    </div>
  );
}
```

## useDeriveStakingAccount

Retrieves and subscribes to staking information for a given account address, including staking ledger, nominations, rewards, and more, as provided by Substrate's derive API. Use this hook when you need to display or react to staking-related data for an account. This hook is based on `api.derive.staking.account`.

### Parameters

- `address` (`string | undefined`): The account address to fetch and subscribe to staking information for.
- `watch` (`boolean`, optional): If true, subscribes to staking changes and updates automatically. Default is false.
- `query` (`QueryParameters`, optional): Additional query options for TanStack Query.

### Returns

- TanStack Query `UseQueryResult` with `DeriveStakingAccount` data.

### Usage Example

```jsx
import { useDeriveStakingAccount } from '@gear-js/react-hooks';

function StakingInfo({ address }) {
  const { data, isLoading } = useDeriveStakingAccount({ address });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No staking data</div>;

  return (
    <div>
      <div>Stash: {data.stashId.toHex()}</div>
      <div>Controller: {data.controllerId.toHex()}</div>
      <div>Ledger: {JSON.stringify(data.stakingLedger)}</div>
      <div>Nominations: {JSON.stringify(data.nominations)}</div>
    </div>
  );
}
```

## useVoucher

Retrieves details for a specific voucher associated with a given account address. Use this hook when you need to display or react to voucher information for a user. This hook is based on `api.voucher.getDetails`.

### Parameters

- `voucherId` (`HexString | undefined`): The voucher ID to fetch details for.
- `accountAddress` (`string | undefined`): The account address to fetch the voucher for.

### Returns

- `voucher` (`IVoucherDetails | undefined`): The voucher details, or `undefined` if not yet loaded.
- `isVoucherReady` (`boolean`): Indicates whether the voucher details have been successfully loaded.

### Usage Example

```jsx
import { useVoucher } from '@gear-js/react-hooks';

function VoucherInfo({ voucherId, accountAddress }) {
  const { voucher, isVoucherReady } = useVoucher(voucherId, accountAddress);

  if (!isVoucherReady) return <div>Loading...</div>;
  if (!voucher) return <div>No voucher found</div>;

  return (
    <div>
      <div>Owner: {voucher.owner}</div>
      <div>Expiry: {voucher.expiry}</div>
      <div>Code Uploading: {voucher.codeUploading}</div>
      <div>Programs: {JSON.stringify(voucher.programs)}</div>
    </div>
  );
}
```

## useVouchers

Retrieves all voucher details for a given account address, optionally filtered by a specific program ID. Use this hook when you need to display or react to all vouchers associated with a user. This hook is based on `api.voucher.getAllForAccount`.

### Parameters

- `accountAddress` (`string | undefined`): The account address to fetch vouchers for.
- `programId` (`HexString`, optional): The program ID to filter vouchers by. If omitted, returns all vouchers for the account.

### Returns

- `vouchers` (`Record<HexString, IVoucherDetails> | undefined`): An object mapping voucher IDs to their details, or `undefined` if not yet loaded.
- `isEachVoucherReady` (`boolean`): Indicates whether the vouchers have been successfully loaded.

### Usage Example

```jsx
import { useVouchers } from '@gear-js/react-hooks';

function VouchersList({ accountAddress, programId }) {
  const { vouchers, isEachVoucherReady } = useVouchers(accountAddress, programId);

  if (!isEachVoucherReady) return <div>Loading...</div>;
  if (!vouchers || Object.keys(vouchers).length === 0) return <div>No vouchers found</div>;

  return (
    <ul>
      {Object.values(vouchers).map((voucher, index) => (
        <li key={index}>
          <div>Owner: {voucher.owner}</div>
          <div>Expiry: {voucher.expiry}</div>
          <div>Code Uploading: {voucher.codeUploading}</div>
          <div>Programs: {JSON.stringify(voucher.programs)}</div>
        </li>
      ))}
    </ul>
  );
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
