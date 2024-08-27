# @gear-js/ez-transactions

A package for providing gasless and signless transactions

## Install:

```sh
yarn add @gear-js/ez-transactions
```

## Use gasless-transactions

### Provider

Import `GaslessTransactionsProvider` from `@gear-js/ez-transactions` in your `index.tsx` and wrap your application with it. You should pass the required arguments:

```jsx
import { GaslessTransactionsProvider } from '@gear-js/ez-transactions';

<GaslessTransactionsProvider
  programId={'0x...'} // Program address
  backendAddress={'0x...'}  // Address of the gasless backend
  voucherLimit={18} // Limit at which the voucher balance needs to be replenished
>
  <App>
</GaslessTransactionsProvider>
```

### useGaslessTransactions

The package provides a `useGaslessTransactions` hook that returns a context with all required properties:

```jsx
import { useGaslessTransactions } from '@gear-js/ez-transactions';

const gaslessContext = useGaslessTransactions();
const { voucherId, isLoading, isEnabled, isActive, expireTimestamp, requestVoucher, setIsEnabled } = gaslessContext;
```

`voucherId` - id of a created voucher for current account.

`isLoading` - a boolean value indicating whether the voucher is being created/updated at the moment.

`isEnabled` - a boolean indicating whether the gasless transaction feature is currently enabled.

`isActive` - a boolean indicating whether the gasless transaction is currently active. This typically means that a voucher has been successfully created and is ready for use.

`expireTimestamp` - a timestamp indicating when the voucher will expire.

`requestVoucher` - a function to request the creation of a new voucher. This function typically triggers the process of creating a voucher and is used to initiate gasless transactions.

`setIsEnabled` - a function to toggle the isEnabled state. This can be used to programmatically enable or disable the gasless transaction feature within your application.

You can use `voucherId` to get all required details via methods provided with `@gear-js/api`.

## Use signless-transactions

Signless transactions require the implementation of a session service for a program. The provider may use a Sails-generated program or metadata.

### Sails program based provider

```jsx
import { SignlessTransactionsProvider } from '@gear-js/ez-transactions';
import { useProgram } from '@gear-js/react-hooks';
import { Program } from './lib';

function SignlessTransactionsProvider({ children }: ProviderProps) {
  const { data: program } = useProgram({ library: Program, id: '0x...' });

  return (
    <SignlessTransactionsProvider programId={'0x...'} program={program}>
      {children}
    </SignlessTransactionsProvider>
  );
}
```

### Metadata based provider

```jsx
import { SignlessTransactionsProvider } from '@gear-js/ez-transactions';

return (
  <SignlessTransactionsProvider programId={'0x...'} metadataSource={metaTxt}>
    {children}
  </SignlessTransactionsProvider>
);
```

### useSignlessTransactions

The package provides a `useSignlessTransactions` hook that returns a context with all required properties:

```jsx
import { useSignlessTransactions } from '@gear-js/ez-transactions';

const signlessContext = useSignlessTransactions();

const { pair, session, isSessionReady, voucher, isLoading, setIsLoading, isActive, isSessionActive } = signlessContext;
```

## Use gasless and signless transaction together

`EzTransactionsProvider` implements logic that allows the use of gasless and signless transactions together, e.g. disabling gasless when signless is active and requesting a voucher before a signless session is created. It uses both the signless and gasless contexts, so it needs to be wrapped by `GaslessTransactionsProvider` and `SignlessTransactionsProvider`.

```jsx
import { EzTransactionsProvider } from '@gear-js/ez-transactions';

return <EzTransactionsProvider>{children}</EzTransactionsProvider>;
```

The package provides a `useEzTransactions` hook that returns both gasless and signless contexts:

```jsx
import { useEzTransactions } from '@gear-js/ez-transactions';

const { gasless, signless } = useEzTransactions();
```

### usePrepareEzTransactionParams

To work with signless and gasless transactions together, sending transactions requires a `sessionForAccount` parameter and using `pair` as the sender's account. Also, the `voucherId` needs to be requested. `usePrepareEzTransactionParams` implements this logic:

```jsx
import { usePrepareEzTransactionParams } from '@gear-js/ez-transactions';

const { prepareEzTransactionParams } = usePrepareEzTransactionParams();

const sendMessage = async () => {
  const params = await prepareEzTransactionParams();
  // Use these parameters to send a message to your program
  const { sessionForAccount, account, voucherId, gasLimit } = params;
};
```

### UI components

The package provides components for enabling and disabling gasless and signless transactions.

```jsx
import { EzSignlessTransactions, EzGaslessTransactions, EzTransactionsSwitch } from '@gear-js/ez-transactions';

// Buttons
<EzSignlessTransactions allowedActions={allowedActions} />
<EzGaslessTransactions />

// Switch
<EzTransactionsSwitch allowedActions={allowedActions} />
```

`allowedActions`: `string[]` - A list of actions that the program allows for signless transactions.
