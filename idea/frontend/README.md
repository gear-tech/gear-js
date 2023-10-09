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

React application of [_wiki link_](#) based on [Rust smart-contract](#).

## Getting started

### Install packages:

```sh
yarn install
```

### Declare environment variables:

Create `.env` file, `.env.example` will let you know what variables are expected.

In order for all features to work as expected, the node and it's runtime version should be chosen based on the current `@gear-js/api` version.

In case of issues with the application, try to switch to another network or run your own local node and specify its address in the .env file. When applicable, make sure the smart contract(s) wasm files are uploaded and running in this network accordingly.

### Run the app:

```sh
yarn start
```
