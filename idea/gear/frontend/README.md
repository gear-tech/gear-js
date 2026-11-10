<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://raw.githubusercontent.com/gear-tech/gear/refs/heads/master/.github/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear Idea Frontend
</h3>
<hr>

# Description

React application of Gear Idea portal.

# Getting started

## Install packages:

```sh
yarn install
```

## Declare environment variables:

Create `.env` file, `.env.example` will let you know what variables are expected.

In order for all features to work as expected, the node and it's runtime version should be chosen based on the current `@gear-js/api` version.

In case of issues with the application, try to switch to another network or run your own local node and specify its address in the .env file. When applicable, make sure the smart contract(s) wasm files are uploaded and running in this network accordingly.

## Supported networks

Use `wss://rpc.vara.network` for Vara mainnet reads and a running local node at `ws://127.0.0.1:9944` for tutorial deployments, messages and test transactions. Mainnet transactions spend real VARA.

Vara Substrate testnet has been retired. Its presets, verifier target and remote test balance action are unavailable. A retired URL, saved selection or recognized testnet genesis displays a network selection screen. You must choose a supported network before the application becomes available; it does not automatically switch to mainnet. Custom nodes and other networks remain supported.

Run `yarn workspace gear-idea-frontend test` from the repository root to check the network selection rules and application gate.

## Run the app:

```sh
yarn start
```
