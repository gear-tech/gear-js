# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.5.0-rc.0] — wallet-CLI primitives (Phase 0 + Phase 1 + Phase 2)

### Fixed — review feedback on the initial rc.0 push
- **`api.programs.sendAndWait({ via: 'eth' })`** — the default on-chain path now actually submits the transaction. Previously skipped `tx.send()` between `sendMessage()` and `setupReplyListener()`, so `getReceipt()` threw immediately.
- **`new LocalSigner(privateKey, publicClient)`** — no longer throws at construction. The constructor was feeding `publicClient.transport` (a constructed `Transport`) to `createWalletClient`, which calls it as a factory. Routes through viem's `custom({ request: publicClient.request })` now.
- **`@vara-eth/api` is importable from browser bundles.** Removed the top-level `import { createRequire } from 'node:module'` in `src/util/viem-fork.ts`; the Node-only probe is now gated on a runtime `process.versions.node` check and accesses `require` via opaque indirection so esbuild/webpack don't try to resolve `node:module` at bundle time.
- **`deployProgram` no longer hangs forever** when `CodeGotValidated` doesn't fire. New option `codeValidationTimeoutMs` (default 120s); on expiry throws `CodeValidationTimeoutError` carrying `{ codeId, txHash, timeoutMs }` so callers can resume via `router.createProgramBuilder(codeId).build()` once validators commit out-of-band.
- **`deployProgram` permit lifecycle** — the executable-balance permit is now signed AFTER `CodeGotValidated` resolves, with a fresh `now`-based deadline. Previously shared the code-fee permit's deadline; the executable-balance permit could expire during long validator waits, reverting `createProgramWithExecutableBalance` and burning code-validation fees.
- **`InjectedTx.setReferenceBlock(suppliedHash)`** — when the caller supplies an explicit reference block, the SDK now pre-checks it against the chain head and throws `InjectedTxStaleError` if it's outside the 32-block validity window. Transient RPC failure during the check falls through to signing rather than blocking.

### Added — Phase 2 (event streams)
- **`api.stream` namespace** — typed event subscriptions wrapping viem's `watchContractEvent` / `watchBlocks`. Each method returns an `Unsubscribe` function and accepts `{ onEvent, onError }` handlers.
  - `api.stream.programEvents(mirror, handlers, opts?)` — emits every Mirror event as a discriminated union (`ProgramEvent`): `Message`, `MessageQueueingRequested`, `MessageCallFailed`, `Reply`, `ReplyQueueingRequested`, `ReplyCallFailed`, `ReplyTransferFailed`, `StateChanged`, `ValueClaimed`, `ValueClaimingRequested`, `ValueClaimFailed`, `ExecutableBalanceTopUpRequested`, `OwnedBalanceTopUpRequested`, `TransferLockedValueToInheritorFailed`. Every event carries `EventMeta` (blockNumber, blockHash, txHash, txIndex, logIndex).
  - `api.stream.routerEvents(handlers, opts?)` — emits every Router event as a discriminated union (`RouterEvent`): `AnnouncesCommitted`, `BatchCommitted`, `CodeGotValidated`, `CodeValidationRequested`, `ComputationSettingsChanged`, `Initialized`, `OwnershipTransferred`, `Paused`/`Unpaused`, `ProgramCreated`, `StorageSlotChanged`, `Upgraded`, `ValidatorsCommittedForEra`.
  - `api.stream.blocks(handlers, opts?)` — emits new block headers (`StreamedBlockHeader`: number/hash/parentHash/timestamp/baseFeePerGas). `includePending: true` follows pending blocks; pending blocks with `number === null` are filtered out.
  - Standalone exports for non-namespace callers: `watchProgramEvents`, `watchRouterEvents`, `watchBlocks`.

### Added — Phase 0 + Phase 1 (originally shipped)
- **High-level helpers** for the common wallet flows:
  - `api.programs.deploy(code, opts)` — one call covers WVARA permit signing, `requestCodeValidation`, `CodeGotValidated` wait, and the appropriate `createProgram*` variant (incl. optional `salt` / `abiInterface` / `executableBalance`).
  - `api.programs.sendAndWait(mirror, payload, opts)` — supports both the on-chain `Mirror.sendMessage` path and the `injected_sendTransactionAndWatch` path; returns a uniform `{messageId, reply, txHash, validator?}` shape with `code` parsed as `ReplyCode` regardless of rail.
  - `api.fees.estimate(op)` — viem-backed gas estimate plus WVARA fee for code uploads.
- **Typed error taxonomy** at public API boundaries (`src/errors/vara-eth-error.ts`): `VaraEthError` base class + named subclasses (`ViemForkRequiredError`, `InjectedTxStaleError`, `PromiseTimeoutError`, `PromiseSignatureInvalidError`, `PermitExpiredError`, `BlobUnderpricedError`, `CodeValidationTimeoutError`, `NoSailsIdlError`, `RpcConnectionError`, `ChainIdMismatchError`). Wallet-only errors (`WalletLockedError`, `KeystoreDecryptError`) remain in consumer code by design — the lib stays adapter-shaped.
- **`LocalSigner`** (`src/signer/adapters/local.ts`) + `privateKeyToLocalSigner(privateKey, publicClient)` — self-contained `ITransactionSigner` backed by a raw secp256k1 key in process memory, for scripts/CLI/agent flows.
- **Sails IDL extractor** (`extractSailsIdl(wasm)` / `extractSailsIdlOrThrow(wasm)`) — pure-function WASM custom-section parser; tolerates both `sails_idl` and `sails-idl` naming.
- **Viem-fork runtime check** (`assertViemFork()`) — invoked at the entry of `RouterClient.requestCodeValidation*` paths so consumers of read-only contract calls never pay the cost. Throws `ViemForkRequiredError` with remediation message when upstream viem is installed instead of `@vara-eth/viem`.
- **Phase 0 dev script** at `scripts/poc-wallet.ts` (run with `yarn poc:ethexe`) — end-to-end smoke against a local `ethexe run --dev` devnet: upload → create → send-injected → wait promise → print reply. Backed by `yarn typecheck:poc` (CI-friendly typecheck without needing a devnet).

### Tests
- Unit tests for the IDL extractor (`test/unit/idl-extract.test.ts`) — happy path, alt naming, missing section, truncated WASM, non-WASM bytes.
- **JS-side signing golden fixture** (`test/unit/injected-signing.fixture.test.ts`, P0c gate) — pins the preimage byte layout, keccak256 hash, blake2b messageId, and deterministic ECDSA signature against known inputs. Locks `InjectedTx` byte layout against silent drift from the Rust verifier in `ethexe/common/src/injected.rs`. A full cross-impl gate via Rust subprocess is tracked as follow-up work.

### Fixed
- Pre-existing TS warning on `feeHistory.baseFeePerBlobGas` in `router.contract.ts` (the `@vara-eth/viem` fork populates this field but upstream viem types do not declare it; narrowed via `unknown` cast).

## [0.4.0]

### Added
- Precalculated blob versioned hash to the `requestCodeValidation` method in the Router client (https://github.com/gear-tech/gear-js/pull/2435)
- EIP-2612 permit support for `requestCodeValidation` — charges the WVARA fee via a signed permit, so no prior `approve` call is needed (https://github.com/gear-tech/gear-js/pull/2446)
- `RouterClient.requestCodeValidationOnBehalf()` — submits code validation on behalf of another address using two EIP-712 signatures: one from the requester authorising the validation request, one authorising the WVARA fee transfer (https://github.com/gear-tech/gear-js/pull/2446)
- `RouterClient.prepareAndSignRequestCodeValidationPermitData()` — signs EIP-712 `RequestCodeValidationOnBehalf` typed data and returns the resulting signature, `codeId`, blob hashes, requester address, and deadline, ready to pass directly into `requestCodeValidationOnBehalf` (https://github.com/gear-tech/gear-js/pull/2446)
- `RouterClient.nonces()` — returns the EIP-2612 nonce for a given address on the Router contract (https://github.com/gear-tech/gear-js/pull/2446)
- `WrappedVaraClient.prepareAndSignPermitData()` — signs EIP-712 `Permit` typed data and returns owner, spender, value, deadline, and signature, ready to pass into `WrappedVaraClient.permit()` or `RouterClient.requestCodeValidation()` (https://github.com/gear-tech/gear-js/pull/2446)
- `WrappedVaraClient.permit()` — submits an EIP-2612 permit transaction to set a WVARA allowance without a prior `approve` (https://github.com/gear-tech/gear-js/pull/2446)
- `WrappedVaraClient.nonces()` — returns the EIP-2612 nonce for a given address on the WrappedVara contract (https://github.com/gear-tech/gear-js/pull/2446)
- `eip712Domain()` method on `RouterClient` and `WrappedVaraClient` — returns the EIP-712 domain separator used for typed data signing (https://github.com/gear-tech/gear-js/pull/2446)
- `watchEIP712DomainChangedEvent()` method on `RouterClient` and `WrappedVaraClient` — subscribes to `EIP712DomainChanged` contract events (https://github.com/gear-tech/gear-js/pull/2446)
- `signTypedData()` method added to `IMessageSigner`, `DynamicSigner`, and `WalletClientAdapter` — required for EIP-712 permit flows (https://github.com/gear-tech/gear-js/pull/2446)
- `RouterContractClientParams` exported type — extends the base contract params with optional `maxFeePerBlobGasMultiplier?: bigint` (defaults to `3n`) for tuning blob gas bids on congested networks (https://github.com/gear-tech/gear-js/pull/2446)
- `CreateProgramBuilder` class — a fluent builder for assembling program-creation transactions. Obtain an instance via `RouterClient.createProgramBuilder(codeId)`, configure optional features with `withAbiInterface()`, `withExecutableBalance()`, `withSalt()`, and `withOverrideInitializer()`, then call `build()` to produce a transaction manager. The builder automatically selects the correct on-chain function (`createProgram`, `createProgramWithAbiInterface`, `createProgramWithExecutableBalance`, or `createProgramWithAbiInterfaceAndExecutableBalance`) based on which options are set (https://github.com/gear-tech/gear-js/pull/2453)
- `RouterClient.createProgramBuilder()` — factory method that constructs a `CreateProgramBuilder` for the given code ID (https://github.com/gear-tech/gear-js/pull/2453)
- `initKzgLoading()` exported from `@vara-eth/api/util` — starts loading the `kzg-wasm` WASM library in the background. Call this once at application startup if your app uses code upload functionality so KZG is ready by the time `requestCodeValidation` is invoked. Without it, loading begins lazily on the first code upload, adding latency to that call. The `kzg-wasm` module is no longer loaded eagerly at import time, so applications that never upload code no longer pay its memory cost. (https://github.com/gear-tech/gear-js/pull/2455)
- `InjectedTxPromise.replyHash` — returns the blake2b-256 hash of the reply info (payload, value, and reply code concatenated) (https://github.com/gear-tech/gear-js/pull/2464)
- `InjectedTxPromise.compactPromise` — returns `{ txHash, replyHash }`, the compact promise representation used for signing in (https://github.com/gear-tech/gear-js/pull/2464)

### Removed
- `RouterClient.createProgram()` — replaced by `RouterClient.createProgramBuilder(codeId).build()` (https://github.com/gear-tech/gear-js/pull/2453)
- `RouterClient.createProgramWithAbiInterface()` — replaced by `RouterClient.createProgramBuilder(codeId).withAbiInterface(address).build()` (https://github.com/gear-tech/gear-js/pull/2453)
- `RouterClient.createProgramWithExecutableBalance()` — replaced by `RouterClient.createProgramBuilder(codeId).withExecutableBalance(amount, deadline, signature).build()` (https://github.com/gear-tech/gear-js/pull/2453)
- `RouterClient.createProgramWithAbiInterfaceAndExecutableBalance()` — replaced by `RouterClient.createProgramBuilder(codeId).withAbiInterface(address).withExecutableBalance(amount, deadline, signature).build()` (https://github.com/gear-tech/gear-js/pull/2453)

### Changed
- `RouterClient.requestCodeValidation()` now requires two additional parameters: `deadline: bigint` and `wvaraPermitSignature: Signature | Hex` — callers must obtain a signed WVARA permit via `wvara.prepareAndSignPermitData()` first (https://github.com/gear-tech/gear-js/pull/2446)
- `EthereumClient` constructor accepts an optional 4th `options` parameter (`{ maxFeePerBlobGasMultiplier?: bigint }`) passed through to the underlying `RouterClient` (https://github.com/gear-tech/gear-js/pull/2446)
- `InjectedTxPromise.hash` — the signed hash now covers `keccak256(txHash + replyInfoHash)` instead of the previous flat `keccak256(txHash + payload + code + value)`; reply fields are first hashed together with blake2b-256 to produce `replyInfoHash` (https://github.com/gear-tech/gear-js/pull/2464)

### Fixed
- `WalletClientAdapter.signMessage` now correctly handles non-hex string inputs by forwarding them as UTF-8 personal-sign messages instead of unsafely casting to `Uint8Array` (https://github.com/gear-tech/gear-js/pull/2446)

## [0.3.2]

### Added

- `IVaraEthValidatorPoolProvider.hasValidator()` method to check whether a given address is present in the pool (https://github.com/gear-tech/gear-js/pull/2416)
- `InjectedTx.setSlotValidator()` method that targets the validator assigned to the current slot via round-robin scheduling (`floor(timestamp / blockDuration) % validators.length`, projected two blocks ahead) (https://github.com/gear-tech/gear-js/pull/2416)
- `InjectedTx.setDefaultValidator()` method that sets the recipient to the zero address, allowing any validator to process the transaction (https://github.com/gear-tech/gear-js/pull/2416)

### Changed

- `InjectedTx.setNextValidator()` and `InjectedTx.setRecipient()` no longer require a pool provider — both work with any provider; if the provider is a pool and the target address is in the pool, the send is routed directly to that validator's connection, otherwise the transaction is forwarded by the receiving node (https://github.com/gear-tech/gear-js/pull/2416)
- `InjectedTx.setRecipient()` called without an address now targets the current slot validator (via `setSlotValidator()`) instead of the zero address; use `setDefaultValidator()` explicitly to retain the old zero-address behavior (https://github.com/gear-tech/gear-js/pull/2416)
- `InjectedTx.setRecipient()` with an explicit address no longer unconditionally calls `setActiveValidator` — it only does so when the provider is a pool and the address is present in the pool (https://github.com/gear-tech/gear-js/pull/2416)
- Constructor: setting `tx.recipient` now only calls `setActiveValidator` when the provider is a pool and the address is in the pool (same routing logic as above) (https://github.com/gear-tech/gear-js/pull/2416)

### Deprecated

- `InjectedTx.setNextValidator()` — use `InjectedTx.setSlotValidator()` instead; the old method remains as a thin wrapper (https://github.com/gear-tech/gear-js/pull/2416)

## [0.3.1]

### Added

- `RouterClient.requestCodeValidation()` method (previously private and unimplemented) for uploading Wasm program code as an EIP-7594 blob transaction (https://github.com/gear-tech/gear-js/pull/2405)
- EIP-7594 multi-blob encoding via `simpleSidecarEncode()` — replaces the old single-blob `prepareBlob()` and correctly encodes arbitrary-length data across multiple blobs following the Simple Sidecar Encoding format (https://github.com/gear-tech/gear-js/pull/2405)
- `computeCellsAndKzgProofs` KZG hook required by EIP-7594 (https://github.com/gear-tech/gear-js/pull/2405)

### Changed

- Peer dependency `viem` switched from `^2.39.0` to `@vara-eth/viem@2.47.7-1` — a temporary fork at https://github.com/StackOverflowExcept1on/viem/tree/feat/eip-7594-support-for-blob-txs that adds EIP-7594 blob transaction support not yet available upstream; will revert to the official package once merged (https://github.com/gear-tech/gear-js/pull/2405)
- `requestCodeValidation` blob transactions now use `blobVersion: '7594'` (EIP-7594) instead of the standard EIP-4844 format (https://github.com/gear-tech/gear-js/pull/2405)
- `maxFeePerBlobGas` is now derived dynamically from `getFeeHistory` (3× the latest base fee) instead of the previous hardcoded value (https://github.com/gear-tech/gear-js/pull/2405)
- Gas limit for code validation transactions is now estimated via `estimateGas` instead of a hardcoded value (https://github.com/gear-tech/gear-js/pull/2405)

## [0.3.0]

### Added

- `ReplyCode` class for parsing and inspecting reply codes from program messages in https://github.com/gear-tech/gear-js/pull/2338
- Internal `SuccessReply`, `ErrorReply`, `ExecutionError`, `UnavailableActorError` detail classes used by `ReplyCode` for structured reply code introspection in https://github.com/gear-tech/gear-js/pull/2338
- `IMessageSigner` interface for message-only signing (used by injected transactions and Metamask Snap adapters) in https://github.com/gear-tech/gear-js/pull/2352
- `ITransactionSigner` interface extending `IMessageSigner` with `sendTransaction` for on-chain contract operations in https://github.com/gear-tech/gear-js/pull/2352
- `DynamicSigner` adapter class that resolves the active signer lazily at call time via a getter function — useful in reactive environments (e.g. React) where the wallet can change without recreating the API instance in https://github.com/gear-tech/gear-js/pull/2352
- `createVaraEthApi()` factory function that constructs and initializes `EthereumClient` internally, returning a ready-to-use `VaraEthApi` instance in https://github.com/gear-tech/gear-js/pull/2352
- `VaraEthApi.eth` getter that exposes the underlying `EthereumClient` for direct contract access in https://github.com/gear-tech/gear-js/pull/2352
- `api.query.block.events()` method to fetch block request events (optionally by block hash) in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.block.outcome()` method to fetch state transitions produced by a block (optionally by block hash) in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.code.getOriginal()` method to fetch original Wasm bytecode by code ID in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.program.readQueue()` method to fetch the message queue for a program state hash in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.program.readWaitlist()` method to fetch the waitlist for a program state hash in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.program.readStash()` method to fetch the dispatch stash for a program state hash in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.program.readMailbox()` method to fetch the mailbox for a program state hash in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.program.readFullState()` method to fetch the complete program state including all queues in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.program.readPages()` method to fetch memory page hashes for a program in https://github.com/gear-tech/gear-js/pull/2385
- `api.query.program.readPageData()` method to fetch raw memory page data by page hash in https://github.com/gear-tech/gear-js/pull/2385
- `BlockRequestEvent`, `StateTransition`, `ValueClaim`, `OutgoingMessage` types for block query results in https://github.com/gear-tech/gear-js/pull/2385
- `FullProgramState`, `MessageQueue`, `Waitlist`, `DispatchStash`, `Mailbox`, `MemoryPages` types for program query results in https://github.com/gear-tech/gear-js/pull/2385
- `Dispatch`, `DispatchKind`, `PayloadLookup`, `MessageDetails`, `ReplyDetails`, `SignalDetails`, `ContextStore`, `Expiring` types for message and dispatch structures in https://github.com/gear-tech/gear-js/pull/2385

### Changed

- `IInjectedTransactionPromise.code` changed from `Hex` to `ReplyCode` in https://github.com/gear-tech/gear-js/pull/2338
- `InjectedTxPromise.code` now returns a `ReplyCode` instance instead of raw `Hex` value in https://github.com/gear-tech/gear-js/pull/2338
- `InjectedTx.sign()` now accepts `IMessageSigner` instead of `ISigner` — Snap adapters only need to implement `signMessage` and `getAddress` in https://github.com/gear-tech/gear-js/pull/2352
- `EthereumClient`, `TxManager`, and base contract clients now require `ITransactionSigner` instead of `ISigner` in https://github.com/gear-tech/gear-js/pull/2352
- `ProgramState` extended with `stashHash`, `balance` (`bigint`), and `executableBalance` (`bigint`) fields in https://github.com/gear-tech/gear-js/pull/2385
- `Dispatch.messageType` renamed from `message_type` to camelCase `messageType` to match HTTP provider's automatic key transformation in https://github.com/gear-tech/gear-js/pull/2385

### Deprecated

- `ISigner` — use `ITransactionSigner` (for contract operations) or `IMessageSigner` (for injected transactions / Snap) instead; `ISigner` remains as a type alias for `ITransactionSigner` in https://github.com/gear-tech/gear-js/pull/2352


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
