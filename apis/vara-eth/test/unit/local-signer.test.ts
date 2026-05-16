/**
 * Fence test for Fix 1.2 — `new LocalSigner(pk, publicClient)` must not throw
 * at construction. Before the fix, the cast `publicClient.transport as Transport`
 * passed an already-constructed transport to `createWalletClient`, which calls
 * it as a factory and throws `parameters.transport is not a function`.
 */

import { createPublicClient, http } from 'viem';

import { LocalSigner, privateKeyToLocalSigner } from '../../src/signer/adapters/local.js';

// Anvil #0 — well-known public test key, not a real secret.
const ANVIL_0 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const;
const ANVIL_0_ADDR_LC = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

describe('LocalSigner constructor (Fix 1.2)', () => {
  it('does not throw when constructed against an http PublicClient', () => {
    const publicClient = createPublicClient({ transport: http('http://localhost:0') }) as never;
    expect(() => new LocalSigner(ANVIL_0, publicClient)).not.toThrow();
  });

  it('does not throw via the privateKeyToLocalSigner factory', () => {
    const publicClient = createPublicClient({ transport: http('http://localhost:0') }) as never;
    expect(() => privateKeyToLocalSigner(ANVIL_0, publicClient)).not.toThrow();
  });

  it('resolves the expected address for Anvil #0', async () => {
    const publicClient = createPublicClient({ transport: http('http://localhost:0') }) as never;
    const signer = new LocalSigner(ANVIL_0, publicClient);
    const addr = await signer.getAddress();
    expect(addr.toLowerCase()).toBe(ANVIL_0_ADDR_LC);
  });
});
