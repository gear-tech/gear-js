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
import { useReadState } from '@gear-js/react-hooks';
import metaWasm from 'assets/wasm/meta.wasm';

function State() {
  const programId = '0x01';
  const payload = { key: 'value' };

  const state = useReadState(programId, metaWasm, payload);

  return <div>{JSON.stringify(state)}</div>;
}

export { State };
```
