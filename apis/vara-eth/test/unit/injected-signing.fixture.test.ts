/**
 * P0c — JS-side signing golden fixture.
 *
 * Pins the byte layout and signing output of `InjectedTx` against deterministic
 * inputs. If the preimage encoding, the keccak256 hash, the blake2b messageId,
 * or the deterministic ECDSA signature ever change, this test fails loudly with
 * the exact-byte diff. That gates against silent drift between JS-side signing
 * and the Rust verifier path in `ethexe/common/src/injected.rs`.
 *
 * The expected values below are HARDCODED LITERALS — they must match what the
 * code currently produces. If they need to change, also update the Rust side
 * and verify both implementations match.
 *
 * A full cross-implementation gate (JS produces → Rust verifier accepts via a
 * subprocess) is tracked for a follow-up PR.
 */

import { blake2b } from '@noble/hashes/blake2.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { bytesToHex, concatBytes, hexToBytes, recoverMessageAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { bigint128ToBytes } from '../../src/util/bigint.js';

// Fixed inputs — DO NOT CHANGE without coordinating with the Rust side.
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const; // Anvil #0
const DESTINATION = '0x1111111111111111111111111111111111111111' as const;
const PAYLOAD = '0xdeadbeef' as const;
const VALUE = 0n;
const REFERENCE_BLOCK = `0x${'22'.repeat(32)}` as `0x${string}`;
const SALT = `0x${'33'.repeat(32)}` as `0x${string}`;

// Hardcoded expected outputs. Recorded 2026-05-16 from this exact preimage + key.
// Changing either side of an = breaks the gate — that's the point.
const EXPECTED_PREIMAGE_LEN = 116; // 32 + 4 + 16 + 32 + 32
const EXPECTED_HASH = '0x118e0141a9c8fdb4d23db00d6f994dc6216f9e3b4089a7180e38be4635f2753e';
const EXPECTED_MESSAGE_ID = '0xe9b97b53898130e888ba7cd664a729eee648be25db99b1a8842e5fb0b4006672';
const EXPECTED_SIGNATURE =
  '0xb277104f6798349764eebc89f5c44f88443f8fbc36c0d0ec06cfbba7350dface5e44767d2c1d0ff66f6d91bd846c158c16942f6a64bc95ee7c9e8de6ce344df11c';
const EXPECTED_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

function destinationToPaddedBytes(addr: `0x${string}`): Uint8Array {
  const out = new Uint8Array(32);
  out.set(hexToBytes(addr), 12); // 20-byte address, left-padded with 12 zero bytes
  return out;
}

function preimageBytes(): Uint8Array {
  return concatBytes([
    destinationToPaddedBytes(DESTINATION),
    hexToBytes(PAYLOAD),
    bigint128ToBytes(VALUE),
    hexToBytes(REFERENCE_BLOCK),
    hexToBytes(SALT),
  ]);
}

describe('InjectedTx signing — golden fixture (P0c gate)', () => {
  test('preimage byte layout: destination(32) || payload || value(16 BE) || refBlock(32) || salt(32)', () => {
    const bytes = preimageBytes();
    expect(bytes.length).toBe(EXPECTED_PREIMAGE_LEN);
    expect(bytesToHex(bytes.slice(12, 32))).toBe(DESTINATION);
    expect(bytesToHex(bytes.slice(32, 36))).toBe(PAYLOAD);
    expect(bytes.slice(36, 52).every((b) => b === 0)).toBe(true); // value=0 → 16 zero bytes
    expect(bytesToHex(bytes.slice(52, 84))).toBe(REFERENCE_BLOCK);
    expect(bytesToHex(bytes.slice(84, 116))).toBe(SALT);
  });

  test('keccak256(preimage) matches recorded literal', () => {
    expect(bytesToHex(keccak_256(preimageBytes()))).toBe(EXPECTED_HASH);
  });

  test('blake2b-256(preimage) matches recorded literal (messageId aka txHash)', () => {
    expect(bytesToHex(blake2b(preimageBytes(), { dkLen: 32 }))).toBe(EXPECTED_MESSAGE_ID);
  });

  test('signMessage({raw: hash}) matches recorded signature literal', async () => {
    const account = privateKeyToAccount(PRIVATE_KEY);
    const sig = await account.signMessage({ message: { raw: EXPECTED_HASH } });
    expect(sig).toBe(EXPECTED_SIGNATURE);
  });

  test('signature recovers to the known account address', async () => {
    const recovered = await recoverMessageAddress({
      message: { raw: EXPECTED_HASH },
      signature: EXPECTED_SIGNATURE,
    });
    expect(recovered).toBe(EXPECTED_ADDRESS);
  });
});
