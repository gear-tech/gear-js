import { createWalletClient, http, isAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { ViemAdapter } from '../../../src/signer/adapters/viem.adapter.js';
import { SigningError } from '../../../src/types/signer.js';
import {
  TEST_PRIVATE_KEY,
  TEST_ADDRESS,
  TEST_MESSAGES,
  createTestViemAccount,
  verifySignature,
} from '../test-fixtures.js';

describe('ViemAdapter', () => {
  describe('Constructor', () => {
    it('should create adapter from Viem client with account', () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });

      const adapter = new ViemAdapter(client);

      expect(adapter).toBeInstanceOf(ViemAdapter);
    });

    it('should create adapter with explicit account parameter', () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        chain: mainnet,
        transport: http(),
      });

      const adapter = new ViemAdapter(client, account);

      expect(adapter).toBeInstanceOf(ViemAdapter);
    });

    it('should create adapter using static from method', () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });

      const adapter = ViemAdapter.from(client);

      expect(adapter).toBeInstanceOf(ViemAdapter);
    });
  });

  describe('signMessage', () => {
    let account: ReturnType<typeof privateKeyToAccount>;
    let adapter: ViemAdapter;

    beforeEach(() => {
      account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      adapter = new ViemAdapter(client);
    });

    it('should sign a hex string message', async () => {
      const signature = await adapter.signMessage(TEST_MESSAGES.hex);

      expect(typeof signature).toBe('string');
      expect(signature.startsWith('0x')).toBe(true);
      expect(signature).toHaveLength(132);
      expect(verifySignature(signature, TEST_MESSAGES.hex)).toBe(true);
    });

    it('should sign a Uint8Array message', async () => {
      const signature = await adapter.signMessage(TEST_MESSAGES.bytes);

      expect(verifySignature(signature, TEST_MESSAGES.bytes)).toBe(true);
    });

    it('should return consistent signatures for same message', async () => {
      const sig1 = await adapter.signMessage(TEST_MESSAGES.hex);
      const sig2 = await adapter.signMessage(TEST_MESSAGES.hex);

      expect(sig1).toBe(sig2);
    });

    it('should normalize signature to have 0x prefix', async () => {
      const signature = await adapter.signMessage(TEST_MESSAGES.hex);

      expect(signature.startsWith('0x')).toBe(true);
    });

    it('should throw SigningError when no account is available', async () => {
      const client = createWalletClient({
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client);

      await expect(adapter.signMessage('test')).rejects.toThrow(SigningError);
      await expect(adapter.signMessage('test')).rejects.toThrow(/No account available/);
    });

    it('should work with explicit account parameter', async () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client, account);

      const signature = await adapter.signMessage(TEST_MESSAGES.hex);

      expect(verifySignature(signature, TEST_MESSAGES.hex)).toBe(true);
    });

    it('should prefer explicit account over client account', async () => {
      const account1 = createTestViemAccount();
      const account2Address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as `0x${string}`;

      const client = createWalletClient({
        account: account1,
        chain: mainnet,
        transport: http(),
      });

      const adapter = new ViemAdapter(client, account2Address);

      const address = await adapter.getAddress();
      expect(address).toBe(account2Address);
    });
  });

  describe('getAddress', () => {
    let account: ReturnType<typeof privateKeyToAccount>;
    let adapter: ViemAdapter;

    beforeEach(() => {
      account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      adapter = new ViemAdapter(client);
    });

    it('should retrieve the correct address', async () => {
      const address = await adapter.getAddress();

      expect(typeof address).toBe('string');
      expect(address.startsWith('0x')).toBe(true);
      expect(isAddress(address)).toBe(true);
      expect(address).toBe(TEST_ADDRESS);
    });

    it('should return consistent address on multiple calls', async () => {
      const addr1 = await adapter.getAddress();
      const addr2 = await adapter.getAddress();

      expect(addr1).toBe(addr2);
    });

    it('should retrieve address from explicit account parameter', async () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client, account.address);

      const address = await adapter.getAddress();

      expect(address).toBe(TEST_ADDRESS);
    });

    it('should handle account object with address property', async () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client, account);

      const address = await adapter.getAddress();

      expect(address).toBe(TEST_ADDRESS);
    });
  });

  describe('Real Viem Integration', () => {
    it('should work with Viem wallet client and account', async () => {
      const account = privateKeyToAccount(TEST_PRIVATE_KEY);
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client);

      const signature = await adapter.signMessage(TEST_MESSAGES.hex);
      const address = await adapter.getAddress();

      expect(verifySignature(signature, TEST_MESSAGES.hex)).toBe(true);
      expect(address).toBe(TEST_ADDRESS);
    });

    it('should work with account passed separately', async () => {
      const account = privateKeyToAccount(TEST_PRIVATE_KEY);
      const client = createWalletClient({
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client, account);

      const address = await adapter.getAddress();

      expect(address).toBe(TEST_ADDRESS);
    });

    it('should handle both hex and bytes messages', async () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client);

      const hexSig = await adapter.signMessage(TEST_MESSAGES.hex);
      const bytesSig = await adapter.signMessage(TEST_MESSAGES.bytes);

      expect(verifySignature(hexSig, TEST_MESSAGES.hex, TEST_ADDRESS)).toBe(true);
      expect(verifySignature(bytesSig, TEST_MESSAGES.bytes, TEST_ADDRESS)).toBe(true);
    });

    it('should handle long messages', async () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client);

      const longMessage = '0x' + 'ab'.repeat(5000);
      const signature = await adapter.signMessage(longMessage);

      expect(verifySignature(signature, longMessage)).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle multiple parallel signing operations', async () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client);

      const messages = Array.from({ length: 10 }, (_, i) => `0x${i.toString(16).repeat(20)}`);
      const promises = messages.map((msg) => adapter.signMessage(msg));

      const signatures = await Promise.all(promises);

      expect(signatures).toHaveLength(10);
      signatures.forEach((sig, i) => {
        expect(verifySignature(sig, messages[i])).toBe(true);
      });
    });

    it('should handle rapid sequential signing', async () => {
      const account = createTestViemAccount();
      const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
      });
      const adapter = new ViemAdapter(client);

      const messages: string[] = [];
      const signatures: string[] = [];
      for (let i = 0; i < 5; i++) {
        const msg = `0x${i.toString(16).repeat(10)}`;
        messages.push(msg);
        const sig = await adapter.signMessage(msg);
        signatures.push(sig);
      }

      expect(signatures).toHaveLength(5);
      signatures.forEach((sig, i) => {
        expect(verifySignature(sig, messages[i])).toBe(true);
      });
    });
  });
});
