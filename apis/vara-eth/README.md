<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>

# Vara.Eth TypeScript API

TypeScript client library for [Vara.Eth](https://gear-tech.io/gear-exe/whitepaper/introduction) - a decentralized compute network that extends Ethereum with high-performance parallel execution, near-zero gas fees, and instant finalization without requiring asset bridging.

## Table of Contents

- [Installation](#installation)
  - [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [High-Level API](#high-level-api)
  - [ISigner Interface](#isigner-interface)
  - [VaraEthApi](#varaethapi)
  - [EthereumClient](#ethereumclient)
  - [RouterClient](#routerclient)
  - [MirrorClient](#mirrorclient)
  - [WrappedVaraClient](#wrappedvaraclient)
- [Ethereum Side Operations](#ethereum-side-operations)
  - [1. Program Creation](#1-program-creation)
  - [2. Sending Messages to Programs](#2-sending-messages-to-programs)
  - [3. Managing Executable Balance](#3-managing-executable-balance)
  - [4. Checking Program State](#4-checking-program-state)
  - [5. Working with TxManager](#5-working-with-txmanager)
- [Vara.Eth Side Operations](#varaeth-side-operations)
  - [1. Instantiating VaraEthApi](#1-instantiating-varaethapi)
  - [2. Injected Transactions](#2-injected-transactions)
  - [3. Querying Program Data](#3-querying-program-data)
  - [4. Reading Program State via calculateReplyForHandle](#4-reading-program-state-via-calculatereplyforhandle)
- [Additional Resources](#additional-resources)
- [License](#license)

## Installation

```bash
npm install @vara-eth/api
```

### Prerequisites

Install required peer dependencies:

```bash
npm install viem@^2.39.0 kzg-wasm@1.0.0
```

## Quick Start

```typescript
import { VaraEthApi, WsVaraEthProvider, EthereumClient, walletClientToSigner } from '@vara-eth/api';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Initialize Ethereum clients
const publicClient = createPublicClient({ transport: http('https://eth-rpc-url') });
const account = privateKeyToAccount('0x...');
const walletClient = createWalletClient({ account, transport: http('https://eth-rpc-url') });

// Convert WalletClient to ISigner
const signer = walletClientToSigner(walletClient);

// Create EthereumClient with signer and router address
const ethereumClient = new EthereumClient(publicClient, signer, routerAddress);

// Wait for initialization to complete
await ethereumClient.waitForInitialization();

// Initialize Vara.Eth API (connects to Vara.Eth node)
const api = new VaraEthApi(
  new WsVaraEthProvider('ws://localhost:9944'),
  ethereumClient
);

// Access Router and WVARA clients through EthereumClient
const router = ethereumClient.router;
const wvara = ethereumClient.wvara;
```

## High-Level API

### ISigner Interface

The library uses a unified `ISigner` interface to abstract transaction signing, making it compatible with different wallet implementations. The signer must implement:

```typescript
interface ISigner {
  signMessage(message: Uint8Array | string): Promise<Hash>;
  getAddress(): Promise<Address>;
  sendTransaction(tx: TransactionRequest): Promise<Hash>;
}
```

**Viem WalletClient Adapter:**

Convert viem's `WalletClient` to `ISigner`:

```typescript
import { walletClientToSigner } from '@vara-eth/api';

const signer = walletClientToSigner(walletClient);
```

This adapter enables the library to work with any viem-compatible wallet while maintaining a clean abstraction layer for future wallet integrations.

### VaraEthApi

Main API class for interacting with the Vara.Eth network. Provides methods for querying program state and performing read-only operations.

```typescript
const api = new VaraEthApi(provider, ethereumClient);

// Query methods
await api.query.program.getIds();           // List all program IDs
await api.query.program.readState(hash);    // Read program state
await api.query.program.codeId(programId);  // Get program's code ID

// Call methods (read-only)
await api.call.program.calculateReplyForHandle(source, programId, payload);

// Create and send injected transactions
const injected = await api.createInjectedTransaction({
  destination: programId,
  payload: encodedPayload,
  value: 0n,
});
await injected.send();
```

### EthereumClient

Wrapper around viem's `PublicClient` and a signer that provides unified interface for contract interactions. Automatically initializes Router and WrappedVara contract clients.

```typescript
const signer = walletClientToSigner(walletClient);
const ethereumClient = new EthereumClient(publicClient, signer, routerAddress);

// Wait for initialization to complete
await ethereumClient.waitForInitialization();

// Access underlying clients
ethereumClient.publicClient;
ethereumClient.signer;  // ISigner interface

// Get account address (async)
const address = await ethereumClient.getAccountAddress();

// Access contract clients
ethereumClient.router;      // RouterClient instance
ethereumClient.wvara;       // WrappedVaraClient instance

// Update signer if needed
ethereumClient.setSigner(newSigner);
```

### RouterClient

Interface for interacting with the Router contract - the main entry point for code validation and program creation on Ethereum.

**Source:** [Router.sol](https://github.com/gear-tech/gear/blob/master/ethexe/contracts/src/Router.sol)

```typescript
const router = getRouterClient(routerAddress, signer, publicClient);
// Or access via EthereumClient
const router = ethereumClient.router;

await router.createProgram(codeId);                 // Create program from validated code
await router.createProgramWithAbiInterface(codeId, abiAddress); // Create with Solidity ABI
```

### MirrorClient

Interface for interacting with Mirror contracts - deployed programs on Ethereum. Each program has its own Mirror contract.

**Source:** [Mirror.sol](https://github.com/gear-tech/gear/blob/master/ethexe/contracts/src/Mirror.sol)

```typescript
const mirror = getMirrorClient(programId, signer, publicClient);

await mirror.sendMessage(payload, value);          // Send message to program
await mirror.executableBalanceTopUp(amount);       // Top up program's balance
await mirror.stateHash();                          // Get current state hash
```

### WrappedVaraClient

Interface for managing WVARA tokens (ERC20 wrapper for VARA) used for gas payments.

**Source:** [WrappedVara.sol](https://github.com/gear-tech/gear/blob/master/ethexe/contracts/src/WrappedVara.sol)

```typescript
const wvara = getWrappedVaraClient(wvaraAddress, signer, publicClient);
// Or access via EthereumClient
const wvara = ethereumClient.wvara;

await wvara.approve(spender, amount);              // Approve spending
await wvara.balanceOf(address);                    // Check balance
await wvara.allowance(owner, spender);             // Check allowance
```

## Uploading Program Code

Before creating a program, you must upload and validate your WASM code using the vara-eth CLI.

### Getting the CLI

**Download from releases** (recommended):
- Visit [Gear repository releases](https://github.com/gear-tech/gear/releases)
- Download the `ethexe-cli` binary for your platform

**Build from source**:
```bash
cargo build -p ethexe-cli -r
```

### Uploading Your Program

Insert your private key:
```bash
./target/release/ethexe key insert $SENDER_PRIVATE_KEY
```

Upload your compiled WASM:
```bash
./target/release/ethexe --cfg none tx \
  --ethereum-rpc "$ETH_RPC" \           # Ethereum node RPC
  --ethereum-router "$ROUTER_ADDRESS" \ # Router contract address
  --sender "$SENDER_ADDRESS" \         # Your account address
  upload -l path/to/program.opt.wasm
```

The CLI will submit code via EIP-4844 blob transactions, request validation, and return a `codeId` once validators confirm it. Use this `codeId` with the API:

```typescript
const codeId = '0x...'; // From CLI output
const tx = await router.createProgram(codeId);
```

## Ethereum Side Operations

### 1. Program Creation

Create programs from validated code:

> **Note**: Code must be uploaded and validated before creating programs. Use the [Vara.Eth CLI](https://github.com/gear-tech/gear/tree/master/ethexe/cli) to upload and validate WASM code. The CLI will provide you with a `codeId` after successful validation.

```typescript
// Create program from validated code
const codeId = '0x...'; // Code ID from vara-eth CLI

const tx = await router.createProgram(codeId);
await tx.sendAndWaitForReceipt();

// Get the program ID
const programId = await tx.getProgramId();
console.log('Program created:', programId);

// Get Mirror contract for program interaction
const mirror = getMirrorClient(programId, ethereumClient);
```

#### Creating Program with Solidity ABI Interface

```typescript
const codeId = '0x...'; // Code ID from vara-eth CLI

// Deploy Solidity ABI contract
const deployHash = await walletClient.deployContract({
  abi: counterAbi,
  bytecode: counterBytecode,
});

const receipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
const abiAddress = receipt.contractAddress;

// Create program with ABI interface
const tx = await router.createProgramWithAbiInterface(codeId, abiAddress);
await tx.sendAndWaitForReceipt();
```

### 2. Sending Messages to Programs

Send messages and wait for replies:

> **Note**: Programs are typically built with [Sails framework](https://github.com/gear-tech/sails). Use [sails-js](https://github.com/gear-tech/sails/tree/master/js) library to encode payloads and decode replies.

```typescript
// Encode payload using sails-js
const sails = await Sails.new(); // Initialize from IDL
const payload = sails.services.Counter.functions.Increment.encodePayload();

// Send message
const tx = await mirror.sendMessage(payload, 0n);
await tx.send();

// Get message details
const message = await tx.getMessage();
console.log('Message ID:', message.id);

// Setup listener and wait for reply
const { waitForReply } = await tx.setupReplyListener();
const { payload: replyPayload, replyCode, value } = await waitForReply;

// Decode reply using sails-js
const result = sails.services.Counter.functions.Increment.decodeResult(replyPayload);
console.log('Result:', result);
```

### 3. Managing Executable Balance

Programs require wVARA balance to execute. Top up using wVARA tokens:

```typescript
// Check WVARA balance
const balance = await wvara.balanceOf(ethereumClient.accountAddress);
console.log('WVARA balance:', balance);

// Approve program to spend wVARA
const approveTx = await wvara.approve(programId, BigInt(10 * 1e12));
await approveTx.sendAndWaitForReceipt();

const approvalData = await approveTx.getApprovalLog();
console.log('Approved amount:', approvalData.value);

// Top up program's executable balance
const topUpTx = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));
const { status } = await topUpTx.sendAndWaitForReceipt();
console.log('Top-up status:', status);
```

### 4. Checking Program State

Query program information from Router and Mirror contracts:

```typescript
// Check code validation status
const codeState = await router.codeState(codeId);
console.log('Code state:', codeState); // 'Validated' | 'Rejected' | 'Unknown'

// Get program's code ID
const programCodeId = await router.programCodeId(programId);

// Get program's state hash
const stateHash = await mirror.stateHash();

// Read full program state from Vara.Eth
const state = await api.query.program.readState(stateHash);
console.log('Program active:', 'Active' in state.program);

// Get program nonce
const nonce = await mirror.nonce();
```

### 5. Working with TxManager

Contract write methods return a `TxManager` instance that handles transaction lifecycle:

```typescript
const tx = await router.createProgram(codeId);

// Send transaction and get response
const response = await tx.send();
console.log('Transaction hash:', response.hash);

// Send and wait for receipt
const receipt = await tx.sendAndWaitForReceipt();
console.log('Status:', receipt.status);
console.log('Block number:', receipt.blockNumber);

// Estimate gas before sending
const gasEstimate = await tx.estimateGas();
console.log('Estimated gas:', gasEstimate);

// Access transaction request
const txRequest = tx.getTx();
console.log('Gas limit:', txRequest.gasLimit);

// Find specific events in receipt
await tx.send();
const event = await tx.findEvent('ProgramCreated');
console.log('Event args:', event.args);

// Use transaction-specific helper functions
const programId = await tx.getProgramId(); // Available on createProgram transactions
```

**TxManager Helper Functions:**

Each transaction type can have specific helper methods:

- `createProgram`: `getProgramId()` - extracts program ID from event
- `requestCodeValidation`: `waitForCodeGotValidated()` - waits for validation completion
- `approve`: `getApprovalLog()` - gets approval event data
- `sendMessage`: `getMessage()`, `setupReplyListener()` - message handling

## Vara.Eth Side Operations

### 1. Instantiating VaraEthApi

Connect to Vara.Eth node using HTTP or WebSocket provider:

```typescript
// HTTP Provider (for queries and calls)
import { VaraEthApi, HttpVaraEthProvider } from '@vara-eth/api';

const api = new VaraEthApi(
  new HttpVaraEthProvider('http://localhost:9944'),
  ethereumClient
);

// WebSocket Provider (for subscriptions and real-time updates)
import { WsVaraEthProvider } from '@vara-eth/api';

const wsApi = new VaraEthApi(
  new WsVaraEthProvider('ws://localhost:9944'),
  ethereumClient
);

// Don't forget to disconnect when done
await api.provider.disconnect();
```

**HTTP vs WebSocket Providers:**

- **HttpVaraEthProvider**: Best for one-time queries and calls. Simpler, no persistent connection.
- **WsVaraEthProvider**: Required for subscriptions and real-time event listening. Maintains persistent connection.

### 2. Injected Transactions

Injected transactions are Vara.Eth-native transactions sent directly to the network, bypassing Ethereum. They provide faster execution and lower costs for operations that don't require Ethereum settlement.

**What are Injected Transactions?**

Unlike regular messages sent through Mirror contracts on Ethereum, injected transactions are:
- Sent directly to Vara.Eth validators
- Signed with Ethereum private key but submitted off-chain
- Cheaper and faster (no Ethereum gas costs)
- Reference an Ethereum block for security

**Creating and Sending Injected Transactions:**

```typescript
// Create injected transaction using API
const injected = await api.createInjectedTransaction({
  destination: programId,              // Program to send message to
  payload: '0x1c436f756e74657224496e6372656d656e74', // Encoded message payload
  value: 0n,                           // Optional value to send
  // These are auto-populated if not provided:
  // recipient: validator address (auto-selected)
  // referenceBlock: recent Ethereum block hash (auto-fetched)
  // salt: random salt for uniqueness
});

// Send transaction
const result = await injected.send();

// Wait for full transaction promise (includes reply)
const promise = await injected.sendAndWaitForPromise();

// Validate the promise signature
await promise.validateSignature(); // Throws if signature is invalid
```

> **Note**: The `Injected` class has been renamed to `InjectedTx`. For backward compatibility, `Injected` is still available as an alias.

**Configuring Transaction Properties:**

```typescript
// Create injected transaction with all properties
const injected = await api.createInjectedTransaction({
  destination: programId,
  payload: encodedPayload,
  value: 1000n,
  referenceBlock: blockHash,          // Specific Ethereum block
  salt: '0x030405',                   // Custom salt
  recipient: validatorAddress,        // Specific validator
});

// Modify transaction using fluent API
injected
  .setValue(2000n)                    // Update value
  .setSalt('0x060708');               // Update salt

// Access transaction properties
const messageId = injected.messageId; // Vara.Eth message ID

// Update transaction fields
await injected.setReferenceBlock();   // Fetch latest Ethereum block
await injected.setRecipient();        // Auto-select next validator
// or specify a validator
await injected.setRecipient(validatorAddress);

// Send transaction
await injected.send();
```

### 3. Querying Program Data

Query program information from Vara.Eth network:

```typescript
// List all program IDs
const programIds = await api.query.program.getIds();
console.log('Total programs:', programIds.length);

// Get program's code ID
const codeId = await api.query.program.codeId(programId);

// Read program state by state hash
const stateHash = await mirror.stateHash(); // Get from Mirror contract
const state = await api.query.program.readState(stateHash);

if ('Active' in state.program) {
  console.log('Program is active');
  console.log('Balance:', state.balance);
}
```

### 4. Reading Program State via `calculateReplyForHandle`

Perform read-only queries on program state without sending transactions:

> **Note**: Use sails-js to encode query payloads and decode results.

```typescript
// Encode query payload using sails-js
const queryPayload = sails.services.Counter.queries.GetValue.encodePayload();

// Calculate what the program would reply (read-only)
const reply = await api.call.program.calculateReplyForHandle(
  await ethereumClient.getAccountAddress(),  // Source address
  programId,                      // Program to query
  queryPayload                    // Encoded query
);

// Decode result using sails-js
const value = sails.services.Counter.queries.GetValue.decodeResult(reply.payload);
console.log('Current counter value:', value);
```

This method is useful for:
- Reading program state without modifying it
- Testing message payloads before sending
- Querying computed values from programs

## Additional Resources

- [Vara.Eth Whitepaper](https://gear-tech.io/gear-exe/whitepaper/)
- [Sails Framework](https://github.com/gear-tech/sails) - Build Vara.Eth programs
- [Sails-JS](https://github.com/gear-tech/sails/tree/master/js) - Encode/decode payloads
- [Viem Documentation](https://viem.sh/) - Ethereum client library

## License

GPL 3.0 - see [LICENSE](../../LICENSE)
