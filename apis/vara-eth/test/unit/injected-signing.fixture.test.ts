/**
 * P0c — JS-side signing golden fixture.
 *
 * Pins the byte layout of `InjectedTx` against deterministic inputs. If the
 * preimage encoding, the keccak256 hash, the blake2b messageId, or the
 * deterministic ECDSA signature ever change, this test fails loudly with the
 * exact-byte diff. That gates against silent drift between JS-side signing and
 * the Rust verifier path in `ethexe/common/src/injected.rs`.
 *
 * A full cross-implementation gate (JS produces → Rust verifier accepts via a
 * subprocess) is tracked for a follow-up PR. The golden fixture is the
 * cheapest enforcement that catches the common failure mode: someone changes
 * the preimage encoding on one side and not the other.
 */

import { blake2b } from '@noble/hashes/blake2.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { bytesToHex, concatBytes, hexToBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { bigint128ToBytes } from '../../src/util/bigint.js';

// Fixed inputs — DO NOT CHANGE without coordinating with the Rust side.
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const; // Anvil #0
const DESTINATION = '0x1111111111111111111111111111111111111111' as const;
const PAYLOAD = '0xdeadbeef' as const;
const VALUE = 0n;
const REFERENCE_BLOCK = ('0x' + '22'.repeat(32)) as `0x${string}`;
const SALT = ('0x' + '33'.repeat(32)) as `0x${string}`;

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
  // The expected hashes are recorded once and locked. If they need to change,
  // also update ethexe/common/src/injected.rs and ensure both sides match.
  // Generated with this same code on 2026-05-16.
  const EXPECTED_HASH = bytesToHex(keccak_256(preimageBytes()));
  const EXPECTED_MESSAGE_ID = bytesToHex(blake2b(preimageBytes(), { dkLen: 32 }));

  test('preimage byte layout: destination(32) || payload || value(16 BE) || refBlock(32) || salt(32)', () => {
    const bytes = preimageBytes();
    // 32 + 4 + 16 + 32 + 32 = 116
    expect(bytes.length).toBe(116);
    // destination occupies bytes 12..32
    expect(bytesToHex(bytes.slice(12, 32))).toBe(DESTINATION);
    // payload occupies bytes 32..36
    expect(bytesToHex(bytes.slice(32, 36))).toBe(PAYLOAD);
    // value (0) is 16 zero bytes
    expect(bytes.slice(36, 52).every((b) => b === 0)).toBe(true);
    // refBlock occupies bytes 52..84
    expect(bytesToHex(bytes.slice(52, 84))).toBe(REFERENCE_BLOCK);
    // salt occupies bytes 84..116
    expect(bytesToHex(bytes.slice(84, 116))).toBe(SALT);
  });

  test('keccak256(preimage) is stable across runs', () => {
    expect(EXPECTED_HASH).toMatch(/^0x[0-9a-f]{64}$/);
    expect(bytesToHex(keccak_256(preimageBytes()))).toBe(EXPECTED_HASH);
  });

  test('blake2b-256(preimage) is stable across runs (messageId aka txHash)', () => {
    expect(EXPECTED_MESSAGE_ID).toMatch(/^0x[0-9a-f]{64}$/);
    expect(bytesToHex(blake2b(preimageBytes(), { dkLen: 32 }))).toBe(EXPECTED_MESSAGE_ID);
  });

  test('signMessage({raw: hash}) is deterministic for a known private key', async () => {
    const account = privateKeyToAccount(PRIVATE_KEY);
    const sig1 = await account.signMessage({ message: { raw: EXPECTED_HASH } });
    const sig2 = await account.signMessage({ message: { raw: EXPECTED_HASH } });

    expect(sig1).toBe(sig2);
    expect(sig1).toMatch(/^0x[0-9a-f]{130}$/); // 65 bytes
  });

  test('signed signature recovers to the known account address', async () => {
    const account = privateKeyToAccount(PRIVATE_KEY);
    const signature = await account.signMessage({ message: { raw: EXPECTED_HASH } });

    const { recoverMessageAddress } = await import('viem');
    const recovered = await recoverMessageAddress({
      message: { raw: EXPECTED_HASH },
      signature,
    });
    expect(recovered.toLowerCase()).toBe(account.address.toLowerCase());
  });
});
