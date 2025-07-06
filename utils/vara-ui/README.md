<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear-JS Vara UI
</h3>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
    <a href="https://www.npmjs.com/package/@gear-js/vara-ui"><img src="https://img.shields.io/npm/v/@gear-js/vara-ui.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@gear-js/vara-ui"><img src="https://img.shields.io/npm/dm/@gear-js/vara-ui.svg" alt="Downloads"></a>
    <a href="https://github.com/gear-tech/gear-js/tree/master/apis/gear"><img src="https://img.shields.io/badge/Gear-TypeScript-blue?logo=typescript" alt="Gear TypeScript"></a>
</p>
<p align="center">
    <a href="https://wiki.gear-tech.io"><img src="https://img.shields.io/badge/Gear-Wiki-orange?logo=bookstack" alt="Gear Wiki"></a>
    <a href="https://idea.gear-tech.io"><img src="https://img.shields.io/badge/Gear-IDEA-blue?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBrVLLDYMwDH0OG7ABG5QNYIOwQRmhI3QERmCDMAIjsEFHgA2SDZyk5lRU1LQvQXLi2M+fDUQkLPpKz7MjNS/eN3VHGthSe0SHw2kN8bkwR4Rd9I3JGzWvkxXkQFD0z6Qs+6O0IQ9BlvXZVPDQYr9aNBglXmVUBqHLpCwqD6FTqhYHkfJkODmIpBMdEJVGh7pBZPmk+1rKL3lRfgeTxGrVY2T6z1TbUTKBhLrB1l4DkT+pMoBRzA5k4gCSzQP6wQlxwzh5ZgAAAABJRU5ErkJggg==" alt="Gear IDEA"></a>
</p>
<hr>

# Description

A React library that provides UI components that are used across Vara applications.

# Installation

### npm

```sh
npm install @gear-js/ui sass
```

### yarn

```sh
yarn add @gear-js/ui sass
```

### pnpm

```sh
pnpm add @gear-js/ui sass
```

Import styles in application's root:

```jsx
import '@gear-js/vara-ui/style.css';
```

# Getting started

To use Vara UI components, you have to import the styles at your application's root entry file (typically `index.tsx` or `main.tsx`):

```jsx
import '@gear-js/vara-ui/style.css';
```

## Usage example

```jsx
import { Button } from '@gear-js/vara-ui';
import ArrowSVG from './images/arrow.svg?react';

function BackButton() {
  const handleClick = () => {
    console.log('Going back!');
  };

  return <Button text="Go back" icon={ArrowSVG} onClick={handleClick} />;
}

export { BackButton };
```
