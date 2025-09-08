# Gear Indexer Template

A template for building blockchain indexers for the Gear Protocol using the Subsquid framework. This template provides a structured foundation for indexing Gear blockchain events, messages, and state changes.

## Overview

This template is designed to help you quickly start building indexers for Gear-based applications. It includes:

- **Event Processing**: Handle Gear blockchain events like `UserMessageSent`, `MessageQueued`, etc.
- **SAILS Integration**: Decode program messages using SAILS IDL files
- **Database Models**: TypeORM entities for storing indexed data
- **Handler System**: Modular event handlers for different programs/services
- **GraphQL API**: Auto-generated GraphQL API for querying indexed data

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

https://www.postgresql.org/download/

### 3. Configure Environment

Create a `.env` file:

```bash
# Gear Network Configuration
VARA_ARCHIVE_URL=https://v2.archive.subsquid.io/network/vara-testnet
VARA_RPC_URL=wss://testnet-archive.vara.network
VARA_RPC_RATE_LIMIT=20
VARA_FROM_BLOCK=0

# Database Configuration
DB_NAME=indexer
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
```

### 4. Build and Run

```bash
# Build the project
npm run build

# Start the indexer
npm run

# Start the GraphQL API
npm run serve
```

## Project Structure

```
src/
├── handlers/           # Event handlers for different programs
│   ├── base.ts        # Abstract base handler class
│   ├── stub.ts        # Example handler implementation
│   └── index.ts       # Handler exports
├── helpers/           # Utility functions
├── model/             # Database entities (auto-generated)
├── types/             # TypeScript type definitions
├── config.ts          # Configuration management
├── main.ts            # Main application entry point
├── processor.ts       # Subsquid processor configuration
└── sails-decoder.ts   # SAILS message decoder

schema.graphql         # GraphQL schema definition
assets/                # SAILS IDL files
db/migrations/         # Database migration files
```

## Creating Your First Handler

### 1. Define Your Data Model

- Create database entites in `src/model/entities` directory.
- All entities fields should use *snake_case* naming convention. Set it via `name` property in the `@Column` decorator
- All entities should also use *snake_case* naming convention. Set it via `name` property in the `@Column` decorator
- Export all your entities from `src/model/index.ts` file.
- Specify all your entities in `src/mode/dataSource.ts` file in the `entities` field.


### 2. Create a Handler

Create `src/handlers/my-program.ts`:

```typescript
import { BaseHandler } from './base';
import { ProcessorContext } from '../processor';
import { SailsDecoder } from '../sails-decoder';
import { MyProgram, MyTransfer } from '../model';
import { getBlockCommonData, isUserMessageSentEvent, isSailsEvent } from '../helpers';

export class MyProgramHandler extends BaseHandler {
  private _decoder: SailsDecoder;
  private _programs: Map<string, MyProgram> = new Map();
  private _transfers: Map<string, MyTransfer> = new Map();

  constructor() {
    super();
    // Listen to events from your specific program
    this.userMessageSentProgramIds = ['0x1234...your-program-id'];
  }

  public async init(): Promise<void> {
    // Load your program's SAILS IDL
    this._decoder = await SailsDecoder.new('assets/my-program.idl');
  }

  public clear(): void {
    this._programs.clear();
    this._transfers.clear();
  }

  public async save(): Promise<void> {
    // Save all entities to the database
    await this._ctx.store.save(Array.from(this._programs.values()));
    await this._ctx.store.save(Array.from(this._transfers.values()));
  }

  public async process(ctx: ProcessorContext): Promise<void> {
    await super.process(ctx);

    for (const block of ctx.blocks) {
      const common = getBlockCommonData(block);

      for (const event of block.events) {
        if (isUserMessageSentEvent(event)) {
          await this._handleUserMessage(event, common);
        }
      }
    }
  }

  private async _handleUserMessage(event: UserMessageSentEvent, common: BlockCommonData) {
    if (isSailsEvent(event)) {
      const { service, method, payload } = this._decoder.decodeEvent(event);

      switch (service) {
        case 'MyService':
          this._handleMyService(method, payload, common);
          break;
      }
    }
  }

  private _handleMyService(method: string, payload: any, common: BlockCommonData) {
    switch (method) {
      case 'Transfer':
        this._handleTransfer(payload, common);
        break;
      case 'ProgramCreated':
        this._handleProgramCreated(payload, common);
        break;
    }
  }

  private _handleTransfer(payload: any, common: BlockCommonData) {
    const transfer = new MyTransfer({
      id: `${common.blockNumber}-${common.extrinsicIndex}`,
      from: payload.from,
      to: payload.to,
      amount: BigInt(payload.amount),
      blockNumber: common.blockNumber,
      timestamp: common.timestamp,
    });

    this._transfers.set(transfer.id, transfer);
  }

  private _handleProgramCreated(payload: any, common: BlockCommonData) {
    const program = new MyProgram({
      id: payload.id,
      name: payload.name,
      owner: payload.owner,
      createdAt: common.timestamp,
    });

    this._programs.set(program.id, program);
  }
}
```

### 3. Register Your Handler

Simply export your handler from `src/handlers/index.ts`. It will be registered automatically.

```typescript
export * from './my-program';
```

## Working with SAILS

### 1. Add Your IDL File

Place your program's SAILS IDL file in the `assets/` directory:

```bash
cp path/to/your-program.idl assets/
```

### 2. Decode Messages

The `SailsDecoder` class helps you decode program messages:

```typescript
// Initialize decoder with your IDL
const decoder = await SailsDecoder.new('assets/your-program.idl');

// Decode an event
const { service, method, payload } = decoder.decodeEvent(event);

// Decode a payload of message sent to program
const result = decoder.decodeInput(messageQueuedEvent);

// Decode a message program replied with
const reply = decoder.decodeOutput(userMessagSentEvent);
```

## Database Operations

### Generating Migrations

When you change your schema:

```bash
# Generate a new migration
NAME=migration_name npm run migration:generate

# Apply migrations
npm run migration:run
```

### Querying Data

The template automatically generates a GraphQL API. Start the API server:

```bash
npm run serve:dev
```

Then visit `http://localhost:4350/graphql` to explore your data.

## Environment Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VARA_ARCHIVE_URL` | Subsquid archive URL | Vara testnet archive |
| `VARA_RPC_URL` | Gear network RPC URL | Vara testnet RPC |
| `VARA_RPC_RATE_LIMIT` | RPC request rate limit | 20 |
| `VARA_FROM_BLOCK` | Starting block number | 0 |
| `DB_*` | Database connection settings | PostgreSQL defaults |

## Development Tips

### 1. Event Filtering

Be specific about which events you need to reduce processing overhead:

```typescript
// Only listen to specific program IDs
this.userMessageSentProgramIds = ['0x123...', '0x456...'];

// Only listen to specific events
this.events = ['Balances.Transfer', 'System.ExtrinsicSuccess'];
```

### 2. Batch Processing

Process multiple entities efficiently:

```typescript
public async save(): Promise<void> {
  // Batch save for better performance
  const allEntities = [
    ...Array.from(this._programs.values()),
    ...Array.from(this._transfers.values()),
  ];

  if (allEntities.length > 0) {
    await this._ctx.store.save(allEntities);
  }
}
```

### 3. Error Handling

Add proper error handling in your handlers:

```typescript
private _handleTransfer(payload: any, common: BlockCommonData) {
  try {
    // Your processing logic
  } catch (error) {
    this._logger.error('Failed to process transfer', { error, payload });
    // Don't throw - let other handlers continue
  }
}
```

### 4. Logging

Use the built-in logger for debugging:

```typescript
export class MyHandler extends BaseHandler {
  public async process(ctx: ProcessorContext): Promise<void> {
    await super.process(ctx);

    ctx.log.info(`Processing ${ctx.blocks.length} blocks`);

    // Your processing logic
  }
}
```
