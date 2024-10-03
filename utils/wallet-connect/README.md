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
        variant="vara" // 'vara' (default) or 'gear' theme variation
        displayBalance={true} // true (default) or false
      />
    </header>
  );
}

export { Header };
```

## Vara UI Theme

Wallet is available in two theme variations - `vara` and `gear`.

Be aware that in order for `vara` variation to work as expected, `@gear-js/vara-ui` should be installed with configured global styles:

```jsx
import { Wallet } from '@gear-js/wallet-connect';
import '@gear-js/vara-ui/dist/style.css';

function VaraWallet() {
  return <Wallet variant="vara" />;
}

export { VaraWallet };
```

In order for `gear` variation to work as expected, `@gear-js/ui` should be installed with configured global `index.scss`:

```scss
@use '@gear-js/ui/resets';
@use '@gear-js/ui/typography';
```

```jsx
import { Wallet } from '@gear-js/wallet-connect';
import './index.scss';

function GearWallet() {
  return <Wallet variant="gear" />;
}

export { GearWallet };
```
