# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0]

### Added

- Validator pool provider (`VaraEthValidatorWsPool` class) in https://github.com/gear-tech/gear-js/pull/2262
- Selection of the next validator in the pool in https://github.com/gear-tech/gear-js/pull/2262
- `InjectedTxPromise` class for handling promise replies from injected transactions and validating promise signature in https://github.com/gear-tech/gear-js/pull/2281
- `ISigner` interface for wallet-agnostic transaction signing in https://github.com/gear-tech/gear-js/pull/2332
- `walletClientToSigner()` adapter function for converting viem's `WalletClient` to `ISigner` in https://github.com/gear-tech/gear-js/pull/2332
- `WalletClientAdapter` class implementing `ISigner` interface for viem wallets in https://github.com/gear-tech/gear-js/pull/2332
- `VARA_ETH_RPC_METHODS` constants for organized RPC method names in https://github.com/gear-tech/gear-js/pull/2332
- `SigningError` and `AddressError` exception classes for signer operations in https://github.com/gear-tech/gear-js/pull/2332

### Changed

- **BREAKING**: `EthereumClient` constructor now accepts `ISigner` instead of `WalletClient` as second parameter in https://github.com/gear-tech/gear-js/pull/2332
- **BREAKING**: `EthereumClient.accountAddress` removed in favor of `await ethereumClient.signer.accountAddress()` method in https://github.com/gear-tech/gear-js/pull/2336
- **BREAKING**: `EthereumClient.isInitialized` getter replaced with `waitForInitialization()` method in https://github.com/gear-tech/gear-js/pull/2332
- **BREAKING**: `EthereumClient.setWalletClient()` renamed to `setSigner()` in https://github.com/gear-tech/gear-js/pull/2332
- **BREAKING**: `EthereumClient.walletClient` property replaced with `signer` property (returns `ISigner` interface) in https://github.com/gear-tech/gear-js/pull/2332
- **BREAKING**: `getRouterClient()`, `getMirrorClient()`, and `getWrappedVaraClient()` factory functions now accept `ISigner` instead of `WalletClient` in https://github.com/gear-tech/gear-js/pull/2332
- **BREAKING**: `RouterClient`, `MirrorClient`, `WrappedVaraClient`, and `TxManager` internal implementations refactored to use `ISigner` in https://github.com/gear-tech/gear-js/pull/2332
- **BREAKING**: `RouterClient`, `MirrorClient` and `WrappedVaraClient` accepts a single param object instead of separate arguments in https://github.com/gear-tech/gear-js/pull/2332
- Renamed `Injected` class to `InjectedTx` (with backward-compatible alias) in https://github.com/gear-tech/gear-js/pull/2281
- Refactored injected transaction code into separate modules (`tx.ts` and `promise.ts`) in https://github.com/gear-tech/gear-js/pull/2281
- Updated `IInjectedTransactionPromise` interface: flattened reply structure, changed `value` from `number` to `bigint`, changed `code` to `Hex` in https://github.com/gear-tech/gear-js/pull/2281
- `InjectedTx.sign()` method now accepts optional `ISigner` parameter, defaults to `EthereumClient.signer` (https://github.com/gear-tech/gear-js/pull/2336)
- `InjectedTx.setReferenceBlock()` now accepts an optional `blockHash` parameter, allowing callers to explicitly provide the reference block hash instead of fetching it automatically. (https://github.com/gear-tech/gear-js/pull/2336)

### Removed

- **BREAKING**: Direct `WalletClient` usage from public API (use `ISigner` interface via adapters instead) in https://github.com/gear-tech/gear-js/pull/2332
- Generic type parameters for `Account` from `EthereumClient`, `RouterClient`, `MirrorClient`, `WrappedVaraClient`, and `TxManager` classes in https://github.com/gear-tech/gear-js/pull/2332

## [0.1.0]

### Changed

- Use raw data in `signMessage` method in https://github.com/gear-tech/gear-js/pull/2254
- Use blake2 for both messageId and tx hash in https://github.com/gear-tech/gear-js/pull/2254
- Update Router and Mirror abi in https://github.com/gear-tech/gear-js/pull/2254

### Added

- `address` field to injected transaction in https://github.com/gear-tech/gear-js/pull/2254

## [0.0.5]

- Use zero address as default recipient address in https://github.com/gear-tech/gear-js/pull/2250
- Remove `public_key` field from the injected tx body in https://github.com/gear-tech/gear-js/pull/2250
- Fix unsubscribe method on Websocket provider in https://github.com/gear-tech/gear-js/pull/2242

## [0.0.4]

### Changed

- Fix calculating `recipient` address in https://github.com/gear-tech/gear-js/pull/2240

## [0.0.3]

### Changed

- Fix `router.createProgramWithAbiInterface` method in https://github.com/gear-tech/gear-js/pull/2222

## [0.0.2]

### Changed

- Expose contract addresses from mirror/router/wvara clients in https://github.com/gear-tech/gear-js/pull/2197
- Move `InjectedTransaction` class logic into `Injected` class in https://github.com/gear-tech/gear-js/pull/2207
- Update `IInjectedTransaction` interface with comprehensive JSDoc documentation in https://github.com/gear-tech/gear-js/pull/2207
- `VaraEthApi` constructor no longer requires `routerAddress` parameter in https://github.com/gear-tech/gear-js/pull/2217
- `EthereumClient` now requires `routerAddress` in constructor and automatically initializes Router and WrappedVara clients in https://github.com/gear-tech/gear-js/pull/2217
- Router and WVARA client access moved to `EthereumClient` properties (`router` and `wvara`) in https://github.com/gear-tech/gear-js/pull/2217

### Added

- Pick the next validator as a recipient for injected transactions in https://github.com/gear-tech/gear-js/pull/2205
- `EthereumClient.isInitialized` promise for initialization tracking in https://github.com/gear-tech/gear-js/pull/2217
- `EthereumClient.router` property to access Router contract client in https://github.com/gear-tech/gear-js/pull/2217
- `EthereumClient.wvara` property to access WrappedVara contract client in https://github.com/gear-tech/gear-js/pull/2217

### Removed

- `InjectedTransaction` class in https://github.com/gear-tech/gear-js/pull/2207
- `VaraEthApi.routerClient` property (use `ethereumClient.router` instead) in https://github.com/gear-tech/gear-js/pull/2217
- `routerAddress` parameter from `VaraEthApi` constructor in https://github.com/gear-tech/gear-js/pull/2217
