<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear-JS
</h3>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

# Overview

This repository features a collection of libraries, tools and services that are used across Gear applications.

# Packages

## [@gear-js/api](https://github.com/gear-tech/gear-js/tree/main/apis/gear)

A TypeScript library designed to simplify connecting to a Gear node, allowing developers to seamlessly interact with the Gear protocol by sending messages, querying state, and leveraging the full capabilities of the network.

Refer to the [api](https://github.com/gear-tech/gear-js/blob/main/apis/gear/README.md) docs for details.

#### [npm package](https://www.npmjs.com/package/@gear-js/api)

## [@gear-js/txwrapper](https://github.com/gear-tech/gear-js/tree/main/tools/txwrapper)

A package designed to provide helper functions for generating offline transactions using [@substrate/txwrapper-core](https://github.com/paritytech/txwrapper-core) package specifically tailored for the Gear pallet.

Refer to the [txwrapper](https://github.com/gear-tech/gear-js/blob/main/tools/txwrapper/README.md) docs for details.

#### [npm package](https://www.npmjs.com/package/@gear-js/txwrapper)

## [@gear-js/ui](https://github.com/gear-tech/gear-js/tree/main/utils/gear-ui)

React UI components used across Gear applications.

Refer to the [gear-ui](https://github.com/gear-tech/gear-js/blob/main/utils/gear-ui/README.md) docs for details.

#### [npm package](https://www.npmjs.com/package/@gear-js/ui)

## [Gear Idea](https://github.com/gear-tech/gear-js/tree/main/idea)

The source code of the Gear Idea portal for smart-contract developers - [idea.gear-tech.io](https://idea.gear-tech.io/).

### [gear-idea-frontend](https://github.com/gear-tech/gear-js/tree/main/idea/gear/frontend)

A React application designed to help developers get acquainted with Gear by providing tools to create and interact with programs on the network, manage accounts, monitor balances, track events, and much more.

### [gear-idea-explorer](https://github.com/gear-tech/gear-js/tree/main/idea/gear/explorer)

A Node.js application that provides access to indexed data from the Gear network, enabling developers to query and utilize blockchain information efficiently.

### [gear-idea-squid](https://github.com/gear-tech/gear-js/tree/main/idea/gear/squid)

A service that utilizes the Squid SDK to index and organize data from the Gear network.

### [faucet](https://github.com/gear-tech/gear-js/tree/main/idea/gear/faucet)

A simple service that provides test tokens on the Gear network.

### [meta-storage](https://github.com/gear-tech/gear-js/tree/main/idea/gear/meta-storage)

A service that stores and manages metadata of the programs deployed on the Gear network, enabling easy access and retrieval of program details for developers and users.

### [common](https://github.com/gear-tech/gear-js/tree/main/idea/gear/common)

A collection of shared components and utilities used across Gear Idea applications.

### [indexer-db](https://github.com/gear-tech/gear-js/tree/main/idea/gear/indexer-db)

A library that provides database models and types for the Gear Idea indexer.
