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

CLI tool to generate js interface around programs

## Installation

```sh
npm install -g @gear-js/gear-js-wrapper
```

or

```sh
yarn global add @gear-js/gear-js-wrapper
```

## Usage

Before using this tool it's neccessary to generate wrapper package using [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen).

Please check out [examples](https://github.com/gear-tech/gear-js/blob/master/utils/js-wrapper/examples) to understand what is neccessary.

To generate wrapper run `gear-js-wrapper path/to/generated/by-wasm-bindgen-pkg`

By default, wrapper will be generated in javascript and for web.

If you need to generate a typescript wrapper add the flag `--ts` and `--target nodejs` to generate a wrapper for nodejs.
