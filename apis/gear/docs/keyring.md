# Keyring Management

The `GearKeyring` class provides methods for managing cryptographic keys and signatures in the Gear Protocol.

## Keyring Operations

### Create New Keyring

```typescript
import { GearKeyring } from '@gear-js/api';

// Create new keyring
const { keyring, json } = await GearKeyring.create('myKeyring', 'securePassphrase');
```

### Import Existing Keyring

```typescript
import { GearKeyring } from '@gear-js/api';
import { readFileSync } from 'fs';

// From JSON file
const jsonKeyring = readFileSync('path/to/keyring.json', 'utf-8');
const keyring = GearKeyring.fromJson(jsonKeyring, 'passphrase');

// From seed
const seed = '0x496f9222372eca011351630ad276c7d44768a593cecea73685299e06acef8c0a';
const seedKeyring = await GearKeyring.fromSeed(seed, 'myKeyring');

// From mnemonic
const mnemonic = 'slim potato consider exchange shiver bitter drop carpet helmet unfair cotton eagle';
const mnemonicKeyring = GearKeyring.fromMnemonic(mnemonic, 'myKeyring');
```

### Export Keyring

```typescript
import { GearKeyring } from '@gear-js/api';

// Export keyring to JSON
const json = GearKeyring.toJson(keyring, 'passphrase');
```

### Generate New Keys

```typescript
import { GearKeyring } from '@gear-js/api';

// Generate new mnemonic and seed
const { mnemonic, seed } = GearKeyring.generateMnemonic();

// Generate seed from existing mnemonic
const { seed: derivedSeed } = GearKeyring.generateSeed(mnemonic);
```

## Cryptographic Operations

### Sign Data

```typescript
import { GearKeyring, signatureIsValid } from '@gear-js/api';

// Create signature
const message = 'Message to sign';
const signature = GearKeyring.sign(keyring, message);

// Validate signature
const publicKey = keyring.address;
const isValid = signatureIsValid(publicKey, signature, message);
```

## Address Format Conversion

Convert between public keys and SS58 address format:

```typescript
import { encodeAddress, decodeAddress } from '@gear-js/api';

// Convert SS58 address to public key
const publicKey = decodeAddress(
  '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
);

// Convert public key to SS58 address
const ss58Address = encodeAddress(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'
);
```

## Best Practices

1. Always store keyring JSON securely and never expose private keys
2. Use strong passphrases for keyring encryption
3. Back up mnemonics and store them securely
4. Validate signatures before trusting signed data
5. Use try-catch blocks when working with cryptographic operations

Example with error handling:

```typescript
import { GearKeyring } from '@gear-js/api';

try {
  const { keyring, json } = await GearKeyring.create('myKeyring', 'passphrase');
  
  // Backup keyring
  await writeFile('keyring-backup.json', JSON.stringify(json, null, 2));
  
  // Sign data
  const signature = GearKeyring.sign(keyring, 'message');
  
  // Verify signature
  const isValid = signatureIsValid(keyring.address, signature, 'message');
  if (!isValid) {
    throw new Error('Signature verification failed');
  }
} catch (error) {
  console.error('Keyring operation failed:', error.message);
  // Handle error appropriately
}
```

---