<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear-JS Frontend Configs
</h3>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

# Description

The `@gear-js/frontend-configs` library provides a set of configurations for ESLint, Vite, and TypeScript that are used across Gear frontend applications. These configurations help maintain code quality, enforce coding standards, and streamline the development process.

# Installation

```sh
npm install @gear-js/frontend-configs
```

or

```sh
yarn add @gear-js/frontend-configs
```

---

# Usage

## TypeScript

### `tsconfig.app.json`

```json
{
  "extends": "@gear-js/frontend-configs/tsconfig.app.json"
}
```

### `tsconfig.node.json`

```json
{
  "extends": "@gear-js/frontend-configs/tsconfig.node.json"
}
```

### `tsconfig.json`

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

## ESLint

```ts
import { eslintConfig } from '@gear-js/frontend-configs';

export default eslintConfig;
```

## Vite

```ts
import { viteConfigs } from '@gear-js/frontend-configs';

export default viteConfigs.app;
```

## Prettier

```ts
import { prettierConfig } from '@gear-js/frontend-configs';

export default prettierConfig;
```
