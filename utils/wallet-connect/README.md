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

## Description

A React library to connect supported Substrate-based wallets in a standardized and consistent way across decentralized applications.

## Installation

Install package:

```sh
npm install @gear-js/wallet-connect
```

or

```sh
yarn add @gear-js/wallet-connect
```

## Getting started

Simple as it is, here's quick example:

```jsx
import { Wallet } from '@gear-js/wallet-connect';
import Logo from './logo.svg?react';

function Header() {
  return (
    <header>
      <Logo />

      <Wallet
        theme="vara" // 'vara' (default) or 'gear' theme variation
        displayBalance={true} // true (default) or false
      />
    </header>
  );
}

export { Header };
```

## Vara UI Theme

Be aware that in order for `vara` theme to work as expected, `@gear-js/vara-ui` package should be installed with configured global styles:

```jsx
import { Wallet } from '@gear-js/wallet-connect';
import '@gear-js/vara-ui/dist/style.css';

function VaraWallet() {
  return <Wallet theme="vara" />;
}

export { VaraWallet };
```

## Gear UI Theme

In order for `gear` theme to work as expected, `@gear-js/ui` package should be installed with configured global `index.scss`:

```scss
@use '@gear-js/ui/resets';
@use '@gear-js/ui/typography';
```

```jsx
import { Wallet } from '@gear-js/wallet-connect';
import './index.scss';

function GearWallet() {
  return <Wallet theme="gear" />;
}

export { GearWallet };
```
