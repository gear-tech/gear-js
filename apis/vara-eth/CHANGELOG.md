# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### [0.0.5]

- Use zero address as default recipient address in https://github.com/gear-tech/gear-js/pull/2250clear
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
