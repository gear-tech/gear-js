<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear.exe TypeScript API
</h3>
<p align="center">
    <a href="https://wiki.gear-tech.io"><img src="https://img.shields.io/badge/Gear-Wiki-orange?logo=bookstack" alt="Gear Wiki"></a>
    <a href="https://idea.gear-tech.io"><img src="https://img.shields.io/badge/Gear-IDEA-blue?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBrVLLDYMwDH0OG7ABG5QNYIOwQRmhI3QERmCDMAIjsEFHgA2SDZyk5lRU1LQvQXLi2M+fDUQkLPpKz7MjNS/eN3VHGthSe0SHw2kN8bkwR4Rd9I3JGzWvkxXkQFD0z6Qs+6O0IQ9BlvXZVPDQYr9aNBglXmVUBqHLpCwqD6FTqhYHkfJkODmIpBMdEJVGh7pBZPmk+1rKL3lRfgeTxGrVY2T6z1TbUTKBhLrB1l4DkT+pMoBRzA5k4gCSzQP6wQlxwzh5ZgAAAABJRU5ErkJggg==" alt="Gear IDEA"></a>
    <a href="https://gear-tech.io/gear-exe/whitepaper/"><img src="https://img.shields.io/badge/Gear.exe-Whitepaper-blue" alt="Gear.exe Whitepaper"></a>
</p>
<hr>

# Gear.exe TypeScript API

A comprehensive TypeScript library for interacting with [Gear.exe](https://gear-tech.io/gear-exe), a revolutionary decentralized compute network that enhances Ethereum's computational capabilities without requiring bridges or fragmented liquidity.

## What is Gear.exe?

Gear.exe is a groundbreaking decentralized compute network designed to significantly enhance the computational capabilities of Ethereum. Unlike conventional Layer-2 solutions, Gear.exe provides:

- **Real-time, high-performance, parallel execution** environment
- **Near-zero gas fees** for intensive computations
- **Instant finalization** and seamless Ethereum integration
- **Up to 2GB memory per program** for resource-heavy computations
- **Multi-threaded execution** supporting parallel processing
- **Rust-based programming** for performance and safety
- **No asset bridging required** - full Ethereum integration

Each program in Gear.exe operates as its own individual rollup, collectively forming a "swarm of rollups" that delivers unparalleled flexibility and scalability.

## Installation

Install the package using npm or yarn:

```bash
npm install gearexe
```

```bash
yarn add gearexe
```

### Peer Dependencies

The library requires `ethers` v6.14+ as a peer dependency:

```bash
npm install ethers@^6.14
```

## Key Features

- **🔗 Ethereum Integration**: Seamless interaction with Ethereum smart contracts
- **⚡ High Performance**: Multi-threaded execution with near-zero gas fees
- **🔒 Type Safety**: Full TypeScript support with strict typing
- **🛠️ Developer Tools**: Comprehensive APIs for program management
- **💰 Cost Efficient**: Reverse gas model and reduced computation costs
- **🚀 Real-time**: Instant pre-confirmations with blockchain security

## Core Concepts

### Programs
WebAssembly (WASM) programs running on Gear.exe that handle computationally intensive logic extracted from Solidity contracts.

### Router Contract
The main entry point for creating programs and managing code validation on the Ethereum side.

Ref: [Router Contract](https://github.com/gear-tech/gear/blob/master/ethexe/contracts/src/Router.sol)

### Mirror Contract
Represents a deployed program on Ethereum, enabling message sending and state management.

Ref: [Mirror Contract](https://github.com/gear-tech/gear/blob/master/ethexe/contracts/src/Mirror.sol)

### Wrapped VARA (wVARA)
ERC20 representation of VARA tokens used for gas payments and program interactions.

Ref: [Wrapped VARA](https://github.com/gear-tech/gear/blob/master/ethexe/contracts/src/WrappedVara.sol)

## Quick Start

```typescript
import {
  GearExeApi,
  HttpGearexeProvider,
  getRouterContract,
  getMirrorContract,
  getWrappedVaraContract
} from 'gearexe';
import { ethers } from 'ethers';

// Initialize API and wallet
const api = new GearExeApi(new HttpGearexeProvider('http://localhost:9944'));
const wallet = new ethers.Wallet(privateKey, provider);

// Get contract instances
const router = getRouterContract(routerAddress, wallet);
const wvara = getWrappedVaraContract(wvaraAddress, wallet);
```

## Main Functionality

### 1. Code Upload and Validation

Upload and validate WebAssembly code before creating programs:

```typescript
import * as fs from 'fs';

// Upload code for validation
const code = fs.readFileSync('path/to/program.wasm');
const txManager = await router.requestCodeValidation(code);

await txManager.sendAndWaitForReceipt();

// Wait for validation
const isValidated = await tx.waitForCodeGotValidated();
console.log('Code validated:', isValidated);
```

### 2. Program Creation

Create programs from validated code:

```typescript
// Create a new program
const createTx = await router.createProgram(codeId);
await createTx.send();

// Get the program ID
const programId = await createTx.getProgramId();

// Get mirror contract for program interaction
const mirror = getMirrorContract(programId, wallet);
```

### 3. Program State Management

Query and manage program state:

```typescript
// Check if program is active
const stateHash = await mirror.stateHash();
const state = await api.query.program.readState(stateHash);
console.log('Program active:', 'Active' in state.program);

// Get program code ID
const codeId = await api.query.program.codeId(programId);

// List all program IDs
const programIds = await api.query.program.getIds();
```

### 4. Message Sending

Send messages to programs with payload encoding.

_Most likely program is written with [Sails](https://github.com/gear-tech/sails) framework so [sails-js](https://github.com/gear-tech/sails/tree/master/js/README.md) library can be used to encode payloads._

```typescript
const payload = `<payload encoded by sails-js library>`;
const tx = await mirror.sendMessage(payload, 0n);
await tx.send();

// Handle reply
const { waitForReply: waitIncrement } = await tx.setupReplyListener();
const { payload: replyPayload, replyCode, value } = await waitIncrement;
const result = sails.services.Counter.functions.Increment.decodeResult(replyPayload);
```

### 5. Balance Management

Manage wrapped VARA tokens for program operations:

```typescript
// Check balance
const balance = await wvara.balanceOf(wallet.address);
console.log('wVARA balance:', balance.toString());

// Approve spending
const approveTx = await wvara.approve(programId, BigInt(10 * 1e12));
await approveTx.send();

// Check allowance
const allowance = await wvara.allowance(wallet.address, programId);
console.log('Allowance:', allowance.toString());

// Top up executable balance
const topUpTx = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));
const { status } = await topUpTx.sendAndWaitForReceipt();
```

### 6. State Queries

Perform read-only operations on program state:

```typescript
// Calculate reply for handle call
const queryPayload = sails.services.Counter.queries.GetValue.encodePayload();
const reply = await api.call.program.calculateReplyForHandle(
  sourceAddress,
  programId,
  queryPayload
);

// Decode result
const value = sails.services.Counter.queries.GetValue.decodeResult(reply.payload);
console.log('Current counter value:', value);
```

### 7. Transaction Management

Advanced transaction handling with the TxManager (see section 8 for detailed TxManager functionality):

```typescript
// Create transaction with custom options
const tx = await router.createProgram(codeId);

// Send and get receipt
const receipt = await tx.sendAndWaitForReceipt();
console.log('Transaction status:', receipt.status);

// Get transaction response
const response = await tx.send();
console.log('Transaction hash:', response.hash);

// Access transaction events using TxManager
const event = await tx.findEvent('ProgramCreated');
console.log('Program created:', event.args);

// Use contract-specific helper functions
const programId = await tx.getProgramId(); // Custom helper function
```

### 8. Transaction Manager (TxManager)

The `TxManager` is a core component that handles all Ethereum transactions in the gearexe library. It provides a unified interface for transaction lifecycle management with TypeScript generics support for extensibility.

#### Key Features

- **Generic Type Support**: Allows custom helper functions for transaction-specific operations
- **Transaction Lifecycle Management**: From gas estimation to receipt handling
- **Event Processing**: Automatic event parsing and retrieval from transaction receipts
- **Type Safety**: Full TypeScript support with interface definitions

#### Core Methods

```typescript
class TxManager<T = object, U = object> {
  // Send transaction to network
  async send(): Promise<TransactionResponse>;

  // Send and wait for confirmation
  async sendAndWaitForReceipt(): Promise<TransactionReceipt>;

  // Get transaction receipt
  async getReceipt(): Promise<TransactionReceipt>;

  // Estimate gas for transaction
  async estimateGas(): Promise<bigint>;

  // Find specific events in receipt
  async findEvent(eventName: string): Promise<EventLog>;

  // Get transaction request details
  getTx(): TransactionRequest;
}
```

#### Usage Examples

```typescript
// Basic transaction handling
const tx = await router.createProgram(codeId);
await tx.send();
const receipt = await tx.getReceipt();

// With gas estimation
await tx.estimateGas();
const gasLimit = tx.getTx().gasLimit;

// Event handling
const transferEvent = await tx.findEvent('Transfer');
console.log('Transfer event:', transferEvent.args);

// Custom helper functions (transaction-dependent)
const txWithHelpers = new TxManager(
  wallet,
  transactionRequest,
  contractInterface,
  {
    // Helper function that depends on this transaction
    getProgramId: (manager) => async () => {
      const event = await manager.findEvent('ProgramCreated');
      return event.args.programId;
    }
  }
);

// Use the helper function
const programId = await txWithHelpers.getProgramId();
```

#### Helper Functions

The TxManager supports two types of helper functions:

1. **Transaction-Dependent Helpers**: Functions that need access to the transaction manager instance
2. **Transaction-Independent Helpers**: Static utility functions

```typescript
// Example from router contract
const createTx = new TxManager(
  wallet,
  request,
  interface,
  {
    // Transaction-dependent: needs access to transaction events
    getProgramId: (manager) => async () => {
      const event = await manager.findEvent('ProgramCreated');
      return event.args.programId;
    },
    waitForCodeGotValidated: (manager) => async () => {
      // Custom logic for waiting for validation
      return new Promise(resolve => {
        // Implementation details...
      });
    }
  },
  {
    // Transaction-independent: utility functions
    processDevBlob: async () => {
      // Development-specific processing
    }
  }
);
```

This design pattern ensures type safety while providing flexibility for contract-specific operations.

## API Reference

### GearExeApi

Main API class for interacting with Gear.exe:

```typescript
class GearExeApi {
  constructor(provider: IGearExeProvider);

  // Query methods (read-only)
  query: {
    program: {
      getIds(): Promise<string[]>;
      readState(hash: string): Promise<ProgramState>;
      codeId(programId: string): Promise<string>;
    };
  };

  // Call methods (transactions)
  call: {
    program: {
      calculateReplyForHandle(
        source: string,
        program: string,
        payload: string
      ): Promise<ReplyInfo>;
    };
  };
}
```

### Contract Utilities

Helper functions for contract interaction:

```typescript
// Get contract instances
function getRouterContract(address: string, signer: Signer): RouterContract;
function getMirrorContract(address: string, signer: Signer): MirrorContract;
function getWrappedVaraContract(address: string, signer: Signer): WrappedVaraContract;
```

### Providers

Network communication providers:

```typescript
// HTTP provider for standard requests
class HttpGearexeProvider implements IGearExeProvider {
  constructor(url?: string); // defaults to 'http://127.0.0.1:9944'
}

// WebSocket provider for real-time subscriptions
class WsGearexeProvider implements IGearExeProvider {
  constructor(url?: string); // defaults to 'ws://127.0.0.1:9944'
}
```

## Development

### Building

```bash
yarn build
```

### Testing

```bash
yarn test
```

## TypeScript Support

The library is built with strict TypeScript support, providing:

- **Full type safety** for all API interactions
- **Interface definitions** for contracts and responses
- **Generic type support** for transaction management
- **JSDoc documentation** for all public APIs

## Error Handling

The library provides comprehensive error handling:

```typescript
try {
  const result = await api.call.program.calculateReplyForHandle(
    sourceId,
    invalidProgramId,
    payload
  );
} catch (error) {
  console.error('Program call failed:', error.message);
}
```

## Contributing

Contributions are welcome! Please check the [contributing guidelines](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the GPL 3.0 License - see the [LICENSE](../../LICENSE) file for details.

## Resources

- **[Gear.exe Whitepaper](https://gear-tech.io/gear-exe/whitepaper/)** - Comprehensive technical documentation
- **[Gear Wiki](https://wiki.gear-tech.io)** - Developer documentation and guides
- **[Gear IDEA](https://idea.gear-tech.io)** - Online IDE for Gear program development
- **[Vara Network](https://vara.network)** - The Gear Protocol mainnet

## Questions or Issues?

If you have questions about the gearexe library functionality, need clarification on any features, or encounter issues:

1. **Check the [Gear Wiki](https://wiki.gear-tech.io)** for comprehensive documentation
2. **Review the [test examples](./test/)** in this repository for practical usage patterns
3. **Open an issue** in this repository for bug reports or feature requests
4. **Join the [Gear Discord](https://discord.gg/7BQznC9uD9)** for community support

**Is anything unclear in this documentation?** Please let us know what needs better explanation!
