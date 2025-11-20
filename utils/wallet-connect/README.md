<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear-JS Wallet Connect
</h3>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
    <a href="https://www.npmjs.com/package/@gear-js/wallet-connect"><img src="https://img.shields.io/npm/v/@gear-js/wallet-connect.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@gear-js/wallet-connect"><img src="https://img.shields.io/npm/dm/@gear-js/wallet-connect.svg" alt="Downloads"></a>
    <a href="https://github.com/gear-tech/gear-js/tree/master/apis/gear"><img src="https://img.shields.io/badge/Gear-TypeScript-blue?logo=typescript" alt="Gear TypeScript"></a>
</p>
<p align="center">
    <a href="https://wiki.gear-tech.io"><img src="https://img.shields.io/badge/Gear-Wiki-orange?logo=bookstack" alt="Gear Wiki"></a>
    <a href="https://idea.gear-tech.io"><img src="https://img.shields.io/badge/Gear-IDEA-blue?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBrVLLDYMwDH0OG7ABG5QNYIOwQRmhI3QERmCDMAIjsEFHgA2SDZyk5lRU1LQvQXLi2M+fDUQkLPpKz7MjNS/eN3VHGthSe0SHw2kN8bkwR4Rd9I3JGzWvkxXkQFD0z6Qs+6O0IQ9BlvXZVPDQYr9aNBglXmVUBqHLpCwqD6FTqhYHkfJkODmIpBMdEJVGh7pBZPmk+1rKL3lRfgeTxGrVY2T6z1TbUTKBhLrB1l4DkT+pMoBRzA5k4gCSzQP6wQlxwzh5ZgAAAABJRU5ErkJggg==" alt="Gear IDEA"></a>
</p>
<hr>

# Description

A React library to connect supported Substrate-based wallets in a standardized and consistent way across decentralized applications. It is built on a headless component architecture that separates logic from presentation, giving you full control over styling and structure.

It provides a set of unstyled, headless components that give you complete control over the UI while handling all wallet connection logic internally.

For quick integration, the library also includes pre-defined themed components that implement common wallet connection patterns using the headless components under the hood, with support for Gear and Vara themes out of the box.

# Installation

### npm

```sh
npm install @gear-js/wallet-connect @gear-js/react-hooks
```

### yarn

```sh
yarn add @gear-js/wallet-connect @gear-js/react-hooks
```

### pnpm

```sh
pnpm add @gear-js/wallet-connect @gear-js/react-hooks
```

## Configure API

Before using `@gear-js/wallet-connect`, make sure to configure [`@gear-js/react-hooks`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-hooks#readme) in your project according to its documentation. This setup is required for API connection and account management.

# Components

## Getting Started

Headless components the library provides are built using [Base UI](https://base-ui.com/) methodology and techniques.

To understand how to work with them, refer to the Base UI documentation:

- **[Styling](https://base-ui.com/react/handbook/styling)** - Learn different approaches to styling headless components
- **[Composition](https://base-ui.com/react/handbook/composition)** - Understand how to compose components and pass props
- **[Customization](https://base-ui.com/react/handbook/customization)** - Explore patterns for replacing elements and customizing behavior
- **[TypeScript](https://base-ui.com/react/handbook/typescript)** - TypeScript usage patterns and type safety

Under the hood, nearly all primitives use the [`useRender`](https://base-ui.com/react/utils/use-render) hook from Base UI, which provides a flexible rendering API that supports both element replacement and render prop patterns.

## Wallet

A wallet connection interface that displays account balance, connection triggers, and a modal dialog for wallet selection and account management.

### Anatomy

Import the component and assemble its parts:

```jsx
import { Wallet } from '@gear-js/wallet-connect';

<Wallet.Root>
  <Wallet.Balance>
    <Wallet.BalanceIcon />
    <Wallet.BalanceValue />
    <Wallet.BalanceSymbol />
  </Wallet.Balance>

  <Wallet.TriggerConnect />

  <Wallet.TriggerConnected>
    <Wallet.ConnectedAccountIcon />
    <Wallet.ConnectedAccountLabel />
  </Wallet.TriggerConnected>

  <Wallet.Dialog>
    <Wallet.WalletList>
      <Wallet.WalletItem>
        <Wallet.WalletTrigger>
          <Wallet.WalletIcon />
          <Wallet.WalletName />
          <Wallet.WalletStatus />
          <Wallet.WalletAccountsLabel />
        </Wallet.WalletTrigger>
      </Wallet.WalletItem>
    </Wallet.WalletList>

    <Wallet.AccountsList>
      <Wallet.AccountItem>
        <Wallet.AccountTrigger>
          <Wallet.AccountIcon />
          <Wallet.AccountLabel />
        </Wallet.AccountTrigger>

        <Wallet.CopyAccountAddressTrigger />
      </Wallet.AccountItem>
    </Wallet.AccountsList>

    <Wallet.NoWallets />
    <Wallet.NoMobileWallets />
    <Wallet.NoAccounts />

    <Wallet.ChangeWalletTrigger>
      <Wallet.ChangeWalletIcon />
      <Wallet.ChangeWalletName />
    </Wallet.ChangeWalletTrigger>

    <Wallet.LogoutTrigger />
  </Wallet.Dialog>
</Wallet.Root>;
```

### Usage Example

For a complete implementation example with styling and theme integration, see the [themed Wallet component](https://github.com/gear-tech/gear-js/blob/main/utils/wallet-connect/src/themed-components/wallet/wallet.tsx) in the repository.

### API Reference

#### Root

Groups all parts of the wallet component and manages dialog state.
Renders a `<div>` element.

##### Props:

Accepts `<div>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### Balance

A container component that displays the connected account's balance information.
Renders a `<div>` element.

##### Props:

Accepts `<div>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### BalanceIcon

Displays an icon representing the token or network.
Renders an SVG element (Vara icon by default).

##### Props:

Accepts SVG element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the default icon with a custom element or component.

#### BalanceValue

Displays the numeric value of the account balance.
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### BalanceSymbol

Displays the token symbol or unit (e.g., "VARA", "ETH").
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### TriggerConnect

A button that opens the wallet connection dialog. Only rendered when no account is connected.
Renders a `<button>` element with default text "Connect Wallet".

##### Props:

Accepts `<button>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### TriggerConnected

A button that opens the account management dialog. Only rendered when an account is connected.
Renders a `<button>` element.

##### Props:

Accepts `<button>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### ConnectedAccountIcon

Displays a visual icon (identicon) for the connected account.
Renders a Polkadot `Identicon` component.

##### Props:

Accepts Identicon component props and:

- `render` (`ReactElement | ((props: HTMLProps, state: { address: HexString }) => ReactElement)`): Allows you to replace the default identicon with a custom element or component.

#### ConnectedAccountLabel

Displays the name or address of the connected account.
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### Dialog

A modal dialog for wallet selection and account management.
Doesn't render its own HTML element by default.

##### Props:

- `render` (`ReactElement | ((props: PropsWithChildren, state: DialogState) => ReactElement)`): Allows you to provide a custom dialog implementation. State includes `isOpen`, `open`, `close`, `toggle`, `heading`, and `isWalletSelected`.
- `children` (`ReactNode`): The content of the dialog (wallet lists, account lists, etc.).

#### WalletList

A list container that renders available wallet extensions. Only shown when no wallet is selected. Renders a `<ul>` element.

##### Props:

Accepts `<ul>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.
- `children` (`ReactNode`): The template for each wallet item (should be `WalletItem` with its children).

#### WalletItem

A container for individual wallet information. Automatically rendered by `WalletList` for each available wallet.
Renders a `<li>` element.

##### Props:

Accepts `<li>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### WalletTrigger

A button to connect or select a wallet.
Renders a `<button>` element.

##### Props:

Accepts `<button>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### WalletIcon

Displays the wallet's logo/icon.
Renders a `<span>` element containing the wallet's SVG.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### WalletName

Displays the wallet's name (e.g., "SubWallet", "Talisman").
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### WalletStatus

Displays the wallet's connection status ("Enabled" or "Disabled").
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps, state: { isConnected: boolean }) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### WalletAccountsLabel

Displays the number of accounts in the wallet. Only shown for connected wallets.
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps, state: { accountsCount: number }) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### AccountsList

A list container that renders accounts from the selected wallet.
Renders a `<ul>` element.

##### Props:

Accepts `<ul>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.
- `children` (`ReactNode`): The template for each account item (should be `AccountItem` with its children).

#### AccountItem

A container for individual account information. Automatically rendered by `AccountsList` for each account.
Renders a `<li>` element.

##### Props:

Accepts `<li>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### AccountTrigger

A button to select an account.
Renders a `<button>` element.

##### Props:

Accepts `<button>` element props and:

- `render` (`ReactElement | ((props: HTMLProps, state: { isActive: boolean }) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### AccountIcon

Displays a visual icon (identicon) for an account.
Renders a Polkadot `Identicon` component.

##### Props:

Accepts Identicon component props and:

- `render` (`ReactElement | ((props: HTMLProps, state: { address: string }) => ReactElement)`): Allows you to replace the default identicon with a custom element or component.

#### AccountLabel

Displays the account's name or truncated address.
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### CopyAccountAddressTrigger

A button to copy the account address to clipboard.
Renders a `<button>` element with default text "Copy".

##### Props:

Accepts `<button>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.
- `onCopy` (`() => void`): Optional callback invoked after successfully copying the address.

#### ChangeWalletTrigger

A button to return to wallet selection from the accounts list. Only shown when a wallet is selected.
Renders a `<button>` element.

##### Props:

Accepts `<button>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### ChangeWalletIcon

Displays the currently selected wallet's icon. Only shown when a wallet is selected.
Renders an SVG element.

##### Props:

Accepts SVG element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the default icon with a custom element or component.

#### ChangeWalletName

Displays the currently selected wallet's name. Only shown when a wallet is selected.
Renders a `<span>` element.

##### Props:

Accepts `<span>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### LogoutTrigger

A button to disconnect the current account. Only shown when an account is connected and a wallet is selected.
Renders a `<button>` element with default text "Logout".

##### Props:

Accepts `<button>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### NoWallets

An empty state message shown when no wallet extensions are detected on desktop.
Renders a `<p>` element.

##### Props:

Accepts `<p>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### NoMobileWallets

An empty state message shown when no wallet extensions are detected on mobile devices.
Renders a `<p>` element.

##### Props:

Accepts `<p>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

#### NoAccounts

An empty state message shown when the selected wallet has no accounts.
Renders a `<p>` element.

##### Props:

Accepts `<p>` element props and:

- `render` (`ReactElement | ((props: HTMLProps) => ReactElement)`): Allows you to replace the component's HTML element with a different tag, or compose it with another component.

# Themed Components

## Getting Started

Depending on your chosen theme, you must also install and configure the corresponding UI library styles:

- For the **`vara`** theme (default), follow the [`@gear-js/vara-ui`](https://github.com/gear-tech/gear-js/tree/main/utils/vara-ui#readme) documentation to set up global styles.
- For the **`gear`** theme, follow the [`@gear-js/ui`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-ui#readme) documentation to set up global styles (typically via your `index.scss`).

## API Reference

### Wallet

A React component that displays the current account or wallet connection button, and (optionally) the account’s total balance. It uses [`useAccount`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-hooks#useaccount) from `@gear-js/react-hooks` to manage account state and modal visibility for wallet actions.

> **Note:**  
> This is a generic component that provides ready-to-use behavior for wallet management, including connection, account display, and modal handling. For most use cases, you can simply use this component to integrate wallet functionality into your app.

#### Props

- `theme` (`'gear' | 'vara'`, optional): UI theme for the wallet controls. Defaults to `'vara'`.
- `displayBalance` (`boolean`, optional): Whether to show the account’s total balance. Defaults to `true`.

#### Usage Example

```jsx
import { Wallet } from '@gear-js/wallet-connect';

import Logo from './logo.svg?react';

function Header() {
  return (
    <header>
      <Logo />
      <Wallet />
    </header>
  );
}

export { Header };
```

### WalletModal

A React modal component for managing wallet connections and account selection. It provides a user interface for connecting to supported wallets, switching between accounts, copying addresses, and logging out. This component is used internally by the [Wallet](#wallet) component.

> **Note:**  
> Use this component if you need to open the wallet modal programmatically, or if you want to create a custom wallet or account button that triggers wallet or account management actions. It gives you more control over when and how the modal appears, compared to the generic `Wallet` component.

#### Props

- `theme` (`'gear' | 'vara'`, optional): UI theme for the modal. Defaults to `'vara'`.
- `close` (`() => void`): Function to close the modal.

#### Usage Example

```jsx
import { WalletModal } from '@gear-js/wallet-connect';

function CustomWalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={openModal}>Open Wallet Modal</button>

      {isModalOpen && <WalletModal theme="vara" close={closeModal} />}
    </>
  );
}
```
