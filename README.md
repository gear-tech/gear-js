<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

## [@gear-js/api](https://github.com/gear-tech/gear-js/tree/master/api)

JavaScript library that provides functionality to connect Gear node and interact with it.

Refer to the [api](https://github.com/gear-tech/gear-js/blob/master/api/README.md) docs for detail

#### [npm package](https://www.npmjs.com/package/@gear-js/api)

## [@gear-js/gear-meta](https://github.com/gear-tech/gear-js/tree/master/utils/meta-cli)

JavaScript CLI tool that provides functionality to work with `.meta.wasm` files.

Refer to the [meta-cli](https://github.com/gear-tech/gear-js/blob/master/utils/meta-cli/README.md) docs for detail

#### [npm package](https://www.npmjs.com/package/@gear-js/gear-meta)

## [@gear-js/ui](https://github.com/gear-tech/gear-js/tree/master/utils/gear-ui)

React UI components used across Gear applications.

Refer to the [gear-ui](https://github.com/gear-tech/gear-js/blob/master/utils/gear-ui/README.md) docs for detail

#### [npm package](https://www.npmjs.com/package/@gear-js/ui)

## [idea](https://github.com/gear-tech/gear-js/tree/master/idea)

Source code of [idea.gear-tech.io](https://idea.gear-tech.io/) and backend microservices

#### [frontend](https://github.com/gear-tech/gear-js/tree/master/idea/frontend)

React application that serves as a get-familiar with Gear to help developers write, test and upload smart contracts to a test network as well as manage accounts, balances, events and more

#### [data-storage](https://github.com/gear-tech/gear-js/tree/master/idea/data-storage)

Microservice is responsible for storing metadata of uploaded programs and information about events and listens to all the events occuring in the Gear node and sends to the data-storage to store the information about them

#### [api-gateway](https://github.com/gear-tech/gear-js/tree/master/idea/api-gateway)

Microservice provides any interaction between the events / meta data store and an external user

#### [test-balance](https://github.com/gear-tech/gear-js/tree/master/idea/test-balance)

Microservice provides the opportunity to obtain test tokens

#### [wasm-compiler](https://github.com/gear-tech/gear-js/tree/master/idea/wasm-compiler)

Microservice provides the opportunity to compile rust projects to wasm
