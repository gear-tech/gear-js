# @gear-js/ez-transactions

A package for providing gasless and signless transactions.
This frontend solution interacts with a blockchain program, allowing users to make transactions without paying gas fees or signing on-chain transactions.

## Install:

```sh
yarn add @gear-js/ez-transactions
```

## Gasless-transactions

The gas fees, which are usually required to execute transactions on the blockchain, are covered by a backend service provided by the dApp developer. When a user initiates a transaction, the backend issue a [voucher](https://wiki.vara.network/docs/api/vouchers) for that specific user. This voucher effectively covers the gas cost for the transaction, allowing the user to execute it without having to pay any fees themselves.

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

To streamline the process further, the frontend of the application creates a temporary sub-account for the user. This sub-account is granted the necessary permissions by the user to automatically sign transactions on their behalf. This means that users don’t need to manually sign each transaction with their private key, enhancing convenience.
The main account issue a [voucher](https://wiki.vara.network/docs/api/vouchers) to the sub-account to cover gas fees.

Signless transactions require the implementation of a session service for a program.

Programs can be written either in [Sails](https://github.com/gear-tech/sails?tab=readme-ov-file#sails-) or using [metadata](https://wiki.vara.network/docs/build/gstd/metadata). So the provider may use a [Sails-generated program](https://github.com/gear-tech/sails/blob/master/js/README.md#generate-library-from-idl) or metadata:

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

Combined Workflow:

- The frontend generates a sub-account with limited permissions.
- This sub-account then communicates with the backend to request a gas voucher.
- The voucher is applied to the transaction, covering the gas fees.
- The sub-account automatically signs the transaction, completing the process without requiring any manual input from the user.

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
