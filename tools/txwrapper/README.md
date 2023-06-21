<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

# Description

This package is designed to provide convenient helper functions for generating offline transactions specifically tailored for the Gear pallet. It seamlessly integrates with the  [@substrate/txwrapper-core](https://github.com/paritytech/txwrapper-core) package, enabling efficient transaction handling.


## Installation

```sh
npm install @gear-js/txwrapper
```

or

```sh
yarn add  @gear-js/txwrapper
```

---

## Examples

Check out example of creating and sending sendMessage transaction [here](https://github.com/gear-tech/gear-js/tree/main/tools/txwrapper/examples/sendMessage.ts)

To run the example:
1. Run the Gear node locally
2. Run
```
yarn install
yarn sendMessageExample
```

Check out more usage examples [here](https://github.com/paritytech/txwrapper-core/tree/main/packages/txwrapper-examples)
