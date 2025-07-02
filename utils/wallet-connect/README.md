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

A React library to connect supported Substrate-based wallets in a standardized and consistent way across decentralized applications.

# Installation

### npm

```sh
npm install @gear-js/wallet-connect @gear-js/react-hooks @gear-js/ui @gear-js/vara-ui
```

### yarn

```sh
yarn add @gear-js/wallet-connect @gear-js/react-hooks @gear-js/ui @gear-js/vara-ui
```

### pnpm

```sh
pnpm add @gear-js/wallet-connect @gear-js/react-hooks @gear-js/ui @gear-js/vara-ui
```

# Getting started

## Configure API

Before using `@gear-js/wallet-connect`, make sure to configure [`@gear-js/react-hooks`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-hooks#readme) in your project according to its documentation. This setup is required for API connection and account management.

## Configure UI

Depending on your chosen theme, you must also install and configure the corresponding UI library styles:

- For the **`vara`** theme (default), follow the [`@gear-js/vara-ui`](https://github.com/gear-tech/gear-js/tree/main/utils/vara-ui#readme) documentation to set up global styles.
- For the **`gear`** theme, follow the [`@gear-js/ui`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-ui#readme) documentation to set up global styles (typically via your `index.scss`).

# Components

## Wallet

A React component that displays the current account or wallet connection button, and (optionally) the account’s total balance. It uses [`useAccount`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-hooks#useaccount) from `@gear-js/react-hooks` to manage account state and modal visibility for wallet actions.

> **Note:**  
> This is a generic component that provides ready-to-use behavior for wallet management, including connection, account display, and modal handling. For most use cases, you can simply use this component to integrate wallet functionality into your app.

### Props

- `theme` (`'gear' | 'vara'`, optional): UI theme for the wallet controls. Defaults to `'vara'`.
- `displayBalance` (`boolean`, optional): Whether to show the account’s total balance. Defaults to `true`.

### Usage Example

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

## WalletModal

A React modal component for managing wallet connections and account selection. It provides a user interface for connecting to supported wallets, switching between accounts, copying addresses, and logging out. This component is used internally by the [Wallet](#wallet) component.

> **Note:**  
> Use this component if you need to open the wallet modal programmatically, or if you want to create a custom wallet or account button that triggers wallet or account management actions. It gives you more control over when and how the modal appears, compared to the generic `Wallet` component.

### Props

- `theme` (`'gear' | 'vara'`, optional): UI theme for the modal. Defaults to `'vara'`.
- `close` (`() => void`): Function to close the modal.

### Usage Example

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
