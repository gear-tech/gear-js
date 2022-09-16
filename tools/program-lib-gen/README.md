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

CLI tool to generate typescript library for gear programs.

## Installation
```sh
npm install -g @gear-js/program
```

or

```sh
yarn global add @gear-js/program
```

## Usage

```sh
gear-lib-gen path/to/scheme.json -o path/to/output/dir
```

To use this generated library you need to have the following packages installed: `@polkadot/api`, `@gear-js/api`, `@gear-js/program`