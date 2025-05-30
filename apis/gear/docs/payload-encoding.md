# Payload Encoding

The `CreateType` class provides functionality for encoding and decoding payloads using SCALE codec. This is necessary since all data sent to programs on the blockchain must be in bytes format.

## Initialization

There are three ways to initialize `CreateType`:

```typescript
import { CreateType } from '@gear-js/api';

// 1. Default initialization - uses built-in type registry
const defaultCreateType = new CreateType();

// 2. With custom types
const customCreateType = new CreateType({
  MyStruct: {
    field1: 'u8',
    field2: 'String'
  }
});

// 3. With hex metadata
const metadataCreateType = new CreateType('0x...'); // hex-encoded metadata
```

## Encoding/Decoding Data

### Using Static Method

The simplest way to encode/decode data is using the static `create` method:

```typescript
import { CreateType } from '@gear-js/api';

// Encode a string
const encoded = CreateType.create('String', 'Hello, World');
console.log('Hex:', encoded.toHex());

// Decode hex data
const decoded = CreateType.create('String', '0x48656c6c6f2c20576f726c64');
console.log('Value:', decoded.toString());

// Using custom types with registry
const withRegistry = CreateType.create('MyCustomType', data, '0x...'); // hex registry
```

### Using Instance Methods

For more control and reusability, create an instance:

```typescript
// Initialize with custom types
const createType = new CreateType({
  User: {
    name: 'String',
    age: 'u8',
    isActive: 'bool'
  },
  Message: {
    sender: 'User',
    content: 'String',
    timestamp: 'u64'
  }
});

// Encode user data
const user = createType.create('User', {
  name: 'Alice',
  age: 25,
  isActive: true
});

// Available codec methods
console.log('Hex:', user.toHex());       // Get hex representation
console.log('Human:', user.toHuman());    // Get human-friendly format
console.log('JSON:', user.toJSON());      // Get JSON format
console.log('Bytes:', user.toU8a());      // Get Uint8Array bytes
console.log('String:', user.toString());  // Get string representation

// Encode nested structures
const message = createType.create('Message', {
  sender: {
    name: 'Bob',
    age: 30,
    isActive: true
  },
  content: 'Hello Alice!',
  timestamp: 1234567890
});
```

### Register Additional Types

You can register additional types after initialization:

```typescript
const createType = new CreateType();

// Register new types
createType.registerCustomTypes({
  Balance: 'u128',
  AccountInfo: {
    nonce: 'u32',
    balance: 'Balance'
  }
});

// Use newly registered types
const account = createType.create('AccountInfo', {
  nonce: 1,
  balance: '1000000000000'
});
```

---
