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

A React library that provides components that are used across Vara applications.

## Installation

Install package:

```sh
npm install @gear-js/vara-ui
```

or

```sh
yarn add @gear-js/vara-ui
```

Import styles in application's root:

```jsx
import '@gear-js/vara-ui/styles.css';
```

## Getting started

Simple as it is, here's quick example:

```jsx
import { Button } from '@gear-js/vara-ui';
import { ReactComponent as ArrowSVG } from './images/arrow.svg';

function BackButton() {
  const handleClick = () => {
    console.log('Going back!');
  };

  return <Button text="Go back" icon={ArrowSVG} onClick={handleClick} />;
}

export { BackButton };
```
