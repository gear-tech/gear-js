# Gear Social App

Welcome to the Gear Social App. This program is designed to demonstrate asynchronous interactions between two Gear programs. The application's logic simulates the example of a `decentralized Twitter`, where each user can create his channel and connect it to a common Hub - A router.

The main program is designed to store data about user channels and their subscriptions. And the channel program provides the storage of user messages of this channel and allows you to perform actions such as add messages, subscribe, and unsubscribe.

For more information see [our documentation](https://wiki.gear-tech.io/examples/feeds)

## To use application

Configure basic in .env file in `root` directory of the project:

```shell
REACT_APP_NODE_ADDRESS
REACT_APP_ROUTER_CONTRACT_ADDRESS
REACT_APP_META_STORAGE_API
```

- `REACT_APP_NODE_ADDRESS` is Gear network address (wss://node-workshop.gear.rs)
- `REACT_APP_ROUTER_CONTRACT_ADDRESS` is Gear Router address
- `REACT_APP_META_STORAGE_API` is the address of the metadata storage for the channels (in this case https://idea.gear-tech.io/api)

`.env.example` provided in the root directory of the project.

To install dependencies:

```shell
yarn install
```

To run:

```shell
yarn start
```

# License

The source code is licensed under GPL v3.0 license.
See [LICENSE](LICENSE) for details.